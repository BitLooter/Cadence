from django.shortcuts import HttpResponse
import os
import urllib   #TODO: use urllib.parse in Python 3.x
import logging
import mutagen
import models

# Constants
############
UNKNOWN_ALBUM = "<Unknown album>"
UNKNOWN_ARTIST = "<Unknown artist>"
MEDIA_ROOT = "C:/Develop/html5media/html5media/media/"
URL_ROOT = "/html5media/media/"

logger = logging.getLogger('apps')

def scan():
    """
    Scans a directory for media and updates the database.
    
    Note that because it uses Django models to interface with the database,
    it must be run inside a Django context.
    """
    
    logger.info("Media scan initiated")
    
    validTypes = [".ogg"]
    pathnames = []
    for dirpath, dirnames, filenames in os.walk(MEDIA_ROOT):
        pathnames += [os.path.join(dirpath, f) for f in filenames if os.path.splitext(f)[1] in validTypes]
    meta = {p: mutagen.File(p) for p in pathnames}
    albums = set([a.setdefault("album", [UNKNOWN_ALBUM])[0] for a in meta.values()])
    artists = set([a.setdefault("artist", [UNKNOWN_ARTIST])[0] for a in meta.values()])
    # Correct for blank tags
    if "" in albums:
        albums.remove(""); albums.add(UNKNOWN_ALBUM)
    if "" in artists:
        artists.remove(""); artists.add(UNKNOWN_ARTIST)
    
    # Create the album and artist database entries
    albumEntries = {}
    for album in albums:
        albumEntries[album] = models.Album.objects.get_or_create(name=album)[0]
    artistEntries = {}
    for artist in artists:
        artistEntries[artist] = models.Artist.objects.get_or_create(name=artist)[0]
    
    # Now process the media files
    for filename in pathnames:
        media = models.Media()
        if "title" in meta[filename] and meta[filename]["title"] != "":
            title = meta[filename]["title"][0]
        else:
            title = "<No title>"
        media.title = title
        media.artist = artistEntries[meta[filename]["artist"][0]]
        media.album = albumEntries[meta[filename]["album"][0]]
        urlseg = file.replace(MEDIA_ROOT, "").replace(os.sep, "/")
        media.url = urllib.quote(URL_ROOT + urlseg)
        media.save()
    
    logger.info("Media scan complete")

def update(request):
    """Django view for running the scanner"""
    
    out = scan()
    return HttpResponse(repr(out))
