import os
import urllib   #NOTE: use urllib.parse in Python 3.x
import logging
import time
from   django.shortcuts import HttpResponse
from   django.conf      import settings
import mutagen

import models


logger = logging.getLogger('apps')


#TODO: remove (object) in Py3k
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
                   time.mktime(models.Media.objects.get(path=self.relpath).scanDate.timetuple())
        except models.Media.DoesNotExist:
            return False

def scan():
    """
    Scans a directory for media and updates the database.
    
    Note that because it uses Django models to interface with the database,
    it must be run inside a Django context.
    """
    
    logger.info("Media scan initiated")
    
    actions = None
    
    validTypes = [".ogg", ".mp3"]
    pathnames = []
    for dirpath, dirnames, filenames in os.walk(settings.AUDIO_ROOT):
        pathnames += [os.path.join(dirpath, f) for f in filenames if os.path.splitext(f)[1] in validTypes]
    meta = {p: Mediainfo(p) for p in pathnames}
    albums = set([a.album for a in meta.values()])
    artists = set([a.artist for a in meta.values()])
    # Correct for blank tags
    if "" in albums:
        albums.remove(""); albums.add(settings.UNKNOWN_ALBUM)
    if "" in artists:
        artists.remove(""); artists.add(settings.UNKNOWN_ARTIST)
    
    # Process available album art
    artFilenames = os.listdir(settings.ALBUMART_ROOT)
    artUrls = {}
    # Tie file basenames to resulting URLS
    for image in artFilenames:
        name = os.path.splitext(image)[0]
        artUrls[name] = urllib.quote(settings.ALBUMART_URL + image)
    
    # Create the album and artist database entries
    albumEntries = {}
    for album in albums:
        # Check for album art
        # Album name may contain bad path characters (like ':'), search against a filtered version
        pathalbum = filterPathChars(album)
        if pathalbum in artUrls:
            cover = artUrls[pathalbum]
        else:
            cover = ""
        albumEntries[album] = models.Album.objects.get_or_create(name=album, coverurl=cover)[0]
    artistEntries = {}
    for artist in artists:
        artistEntries[artist] = models.Artist.objects.get_or_create(name=artist)[0]
    
    # Now process the media files
    # Get a list of all previously processed files
    scannedFiles = models.Media.objects.values_list("path", flat=True)
    for filename in pathnames:
        # Database paths are relative to AUDIO_ROOT
        metadata = meta[filename]
        if metadata.relpath not in scannedFiles:
            # New file not in database, create new entry
            media = models.Media()
        elif metadata.modified:
            # In the database but modified since last scan
            media = models.Media.objects.get(path=metadata.relpath)
        else:
            # If already in database and not modified, skip to the next one
            continue
        
        media.title = metadata.title
        media.artist = artistEntries[metadata.artist]
        media.album = albumEntries[metadata.album]
        media.length = metadata.length
        # Chop off filesystem root and replace native path separators with URL /'s
        urlseg = filename.replace(settings.AUDIO_ROOT, "").replace(os.sep, "/")
        media.url = urllib.quote(settings.AUDIO_URL + urlseg)
        media.path = metadata.relpath
        media.save()
    
    logger.info("Media scan complete")
    
    return actions

def filterPathChars(path):
    """Takes a string and returns it with illegal path characters removed"""
    newpath = path
    for char in r'\/:*?"<>|':
        newpath = newpath.replace(char, "")
    return newpath
