from   django.shortcuts import HttpResponse
import os
import urllib   #NOTE: use urllib.parse in Python 3.x
import logging
import mutagen

from   settings import *
import models


logger = logging.getLogger('apps')


#TODO: remove (object) in Py3k
class Metadata(object):
    def __init__(self, pathname):
        # Use easy mode for ID3 tagged files, we don't need direct ID3 access
        rawdata = mutagen.File(pathname, easy=True)
        rawdata.setdefault("title", [os.path.splitext(os.path.basename(pathname))[0]])
        rawdata.setdefault("artist", [UNKNOWN_ARTIST])
        rawdata.setdefault("album", [UNKNOWN_ALBUM])
        self.title = rawdata["title"][0]
        self.artist = rawdata["artist"][0]
        self.album = rawdata["album"][0]
        self.length = rawdata.info.length

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
    for dirpath, dirnames, filenames in os.walk(AUDIO_ROOT):
        pathnames += [os.path.join(dirpath, f) for f in filenames if os.path.splitext(f)[1] in validTypes]
    meta = {p: Metadata(p) for p in pathnames}
    albums = set([a.album for a in meta.values()])
    artists = set([a.artist for a in meta.values()])
    # Correct for blank tags
    if "" in albums:
        albums.remove(""); albums.add(UNKNOWN_ALBUM)
    if "" in artists:
        artists.remove(""); artists.add(UNKNOWN_ARTIST)
    
    # Process available album art
    artFilenames = os.listdir(ALBUMART_ROOT)
    artUrls = {}
    # Tie file basenames to resulting URLS
    for image in artFilenames:
        name = os.path.splitext(image)[0]
        artUrls[name] = urllib.quote(ALBUMART_URL_ROOT + image)
    
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
        relpath = filename[len(AUDIO_ROOT):]
        metadata = meta[filename]
        # Ignore file if previously scanned
        #TODO: rescan if changed
        if relpath not in scannedFiles:
            media = models.Media()
            media.title = metadata.title
            media.artist = artistEntries[metadata.artist]
            media.album = albumEntries[metadata.album]
            media.length = metadata.length
            urlseg = filename.replace(AUDIO_ROOT, "").replace(os.sep, "/")
            media.url = urllib.quote(AUDIO_URL_ROOT + urlseg)
            media.path = relpath
            media.save()
    
    logger.info("Media scan complete")
    
    return actions

def filterPathChars(path):
    """Takes a string and returns it with illegal path characters removed"""
    newpath = path
    for char in r'\/:*?"<>|':
        newpath = newpath.replace(char, "")
    return newpath

def update(request):
    """Django view for running the scanner"""
    
    out = scan()
    return HttpResponse(repr(out))
