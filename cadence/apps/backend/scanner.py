import os
import urllib   # NOTE: use urllib.parse in Python 3.x
import logging
import time
from   django.conf import settings
import mutagen

import models
# The TranscodeManager is defined in the settings, do a dynamic import
TranscodeManager = __import__(settings.TRANSCODER, fromlist=["TranscodeManager"]).TranscodeManager


logger = logging.getLogger('apps')


class Mediainfo(object):
    def __init__(self, pathname):
        # Use easy mode for ID3 tagged files, we don't need direct ID3 access
        rawdata = mutagen.File(pathname, easy=True)
        rawdata.setdefault("title", [os.path.splitext(os.path.basename(pathname))[0]])
        rawdata.setdefault("artist", [settings.UNKNOWN_ARTIST])
        rawdata.setdefault("album", [settings.UNKNOWN_ALBUM])
        self.title = rawdata["title"][0]
        self.artist = rawdata["artist"][0]
        self.album = rawdata["album"][0]
        self.length = rawdata.info.length
        self.path = pathname
        self.relpath = pathname[len(settings.AUDIO_ROOT):]
    
    @property
    def modified(self):
        """Returns True if the file has been modified since it was last scanned,
           or False if not present in database"""
        try:
            return os.path.getmtime(self.path) > \
                   time.mktime(models.MediaSource.objects.get(path=self.relpath).media.scan_date.timetuple())
        except models.MediaSource.DoesNotExist:
            return False
        except Exception as e:
            print(e)


class Scanner(object):
    def __init__(self, options):
        self.options = options
    
    def scan(self):
        """
        Scans a directory for media and updates the database.
        
        Note that because it uses Django models to interface with the database,
        it must be run inside a Django context, using "manage.py scan".
        """
        
        logger.info("Media scan initiated")
        
        # Get metadata for every file in the media directory (recursively)
        pathnames = []
        for dirpath, dirnames, filenames in os.walk(settings.AUDIO_ROOT):
            pathnames += [os.path.join(dirpath, f) for f in filenames if os.path.splitext(f)[1] in TranscodeManager.source_types]
        meta = [Mediainfo(p) for p in pathnames]
        
        # Process available album art
        self.get_art()
        
        # Create the album and artist database entries
        # Make a list of every item. Use a set to filter out duplicates.
        albums = set([a.album for a in meta])
        artists = set([a.artist for a in meta])
        # Correct for blank tags
        if "" in albums:
            albums.remove("")
            albums.add(settings.UNKNOWN_ALBUM)
        if "" in artists:
            artists.remove("")
            artists.add(settings.UNKNOWN_ARTIST)
        # Create the entires in the database
        self.make_albums(albums)
        self.make_artists(artists)
        
        # Now process the scanned files
        # Make a list of all previously processed files
        self.scannedFiles = models.Media.objects.values_list("original_source", flat=True)
        #PY3K: iteritems() becomes items() in Py3k
        for metadata in meta:
            media = self.update_db(metadata)
            # Do the media transcoding, if needed
            self.make_transcodes(metadata.path, media)
            
        logger.info("Media scan complete")
    
    def get_art(self):
        artFilenames = os.listdir(settings.ALBUMART_ROOT)
        self.artUrls = {}
        # Map file basenames to resulting URLS
        for image in artFilenames:
            name = os.path.splitext(image)[0]
            self.artUrls[name] = urllib.quote(settings.ALBUMART_URL + image)
    
    def make_artists(self, artists):
        self.artistEntries = {}
        for artist in artists:
            self.artistEntries[artist] = models.Artist.objects.get_or_create(name=artist)[0]
    
    def make_albums(self, albums):
        self.albumEntries = {}
        for album in albums:
            # Check for album art
            # Album name may contain bad path characters (like ':'), search against a filtered version
            pathalbum = self.filter_path_chars(album)
            if pathalbum in self.artUrls:
                cover = self.artUrls[pathalbum]
            else:
                cover = ""
            self.albumEntries[album] = models.Album.objects.get_or_create(name=album, coverurl=cover)[0]
    
    def update_db(self, metadata):
        # Database paths are relative to AUDIO_ROOT
        if metadata.relpath not in self.scannedFiles:
            # New file not in database, create new entry
            media = models.Media()
            print("Found new media: " + metadata.path.replace(settings.AUDIO_ROOT, ""))
            update_needed = True
        elif metadata.modified:
            # In the database but modified since last scan
            media = models.Media.objects.get(original_source=metadata.relpath)
            print("Modified media: " + metadata.path.replace(settings.AUDIO_ROOT, ""))
            update_needed = True
        else:
            # Else nothing to do here, but do get the object to return later
            media = models.Media.objects.get(original_source=metadata.relpath)
            print("Skipping already known media: " + metadata.path.replace(settings.AUDIO_ROOT, ""))
            update_needed = False
        
        # Only update if this is new or modifed data
        if update_needed == True:
            # Save all the info to the database
            media.title = metadata.title
            media.artist = self.artistEntries[metadata.artist]
            media.album = self.albumEntries[metadata.album]
            media.length = metadata.length
            media.original_source = metadata.path.replace(settings.AUDIO_ROOT, "")
            media.save()
        
        return media
    
    def make_transcodes(self, filename, media):
        transcoder = TranscodeManager([filename])
        
        # By default transcode only if needed, but can be forced by command line
        if transcoder.transcode_needed or self.options["force_transcode"]:
            print("Transcoding...")
            transcoder.convert()
        
        for transpath, url, mime, is_transcode in transcoder.files:
            # Create DB entries, if they do not exist already
            create_params = {"media":     media,
                             "path":      transpath,
                             "url":       url,
                             "mime":      mime,
                             "transcode": is_transcode}
            models.MediaSource.objects.get_or_create(**create_params)
    
    def filter_path_chars(self, path):
        """Takes a string and returns it with illegal path characters removed"""
        newpath = path
        for char in r'\/:*?"<>|':
            newpath = newpath.replace(char, "")
        return newpath
