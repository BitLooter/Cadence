from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseNotFound
from django.core.exceptions import ObjectDoesNotExist
import json
import logging

from database import models


# Set up logging
logger = logging.getLogger("apps")

#TODO: document API parameters
#TODO: check for external errors like database access problems
def playlist(request, playlistID):
    logger.info("Playlist #{} requested from {}".format(playlistID, request.get_host()))
    
    try:
        playlist = models.Playlist.getPlaylist(playlistID)
        response = HttpResponse(json.dumps(playlist), mimetype="text/plain")
    except ObjectDoesNotExist:
        response = HttpResponseNotFound("Error: Playlist not found", mimetype="text/plain")
        logger.error("Playlist #{} does not exist".format(playlistID))
    
    return response

def playlistlist(request):
    logger.info("Playlist list requested from {}".format(request.get_host()))
    
    lists = models.Playlist.getPlaylistList()
    return HttpResponse(json.dumps(lists), mimetype="text/plain")

def saveplaylist(request):
    logger.info("Save playlist request from {}".format(request.get_host()))

    try:
        info = json.loads(request.raw_post_data)
    except ValueError:
        response = HttpResponseBadRequest("Error: POST data is not valid JSON", mimetype="text/plain")
        logger.exception("Not saving playlist from {}, invalid JSON in request - POST data: '{}'".format(request.get_host(), request.raw_post_data))
    else:
        # Sanity check on the data - name is a (unicode) string, tracks are all integers
        if "name" not in info or "tracks" not in info:
            logger.debug("data check")
            response = HttpResponseBadRequest("Error: Not enough parameters were passed", mimetype="text/plain")
            logger.error("Not saving playlist from {}, not enough information given - POST data: '{}'".format(request.get_host(), request.raw_post_data))
        elif (type(info["name"]) != unicode) or not (all(type(t) == int for t in info["tracks"])):
            response = HttpResponseBadRequest("Error: Given data is invalid", mimetype="text/plain")
            logger.error("Not saving playlist from {}, given data is invalid - POST data: '{}'".format(request.get_host(), request.raw_post_data))
        else:
            newID = models.Playlist.savePlaylist(info["tracks"], info["name"])
            response = HttpResponse("Playlist created successfully", status=201, mimetype="text/plain")
            response["Location"] = "/html5media/data/playlist/{}/".format(newID)
            logger.info("Playlist from {} successfully saved as #{}".format(request.get_host(), newID))
    
    return response

def library(request):
    logger.info("Library request from {}".format(request.get_host()))
    
    # Make sure no one's trying anything funny with the queries and database access
    if set(request.GET.keys()) <= set(models.allowedFilters):
        response = HttpResponse(json.dumps(models.Media.getLibraryItems(request.GET)), mimetype="text/plain")
    else:
        badFilters = list(set(request.GET.keys()) - set(models.allowedFilters))
        response = HttpResponseBadRequest("Error: Unrecognized filter(s): {}".format(", ".join(badFilters)),
                                          mimetype="text/plain")
        logger.error("Unrecognized filter(s): {}".format(", ".join(badFilters)))
    return response

def library_albums(request):
    logger.info("Library albums request from {}".format(request.get_host()))
    
    response = HttpResponse(json.dumps(models.Album.getAlbums()), mimetype="text/plain")
    return response

def library_get_album(request, albumID):
    logger.info("Album request from {}".format(request.get_host()))
    
    response = HttpResponse(json.dumps(models.Album.getAlbumTracks(albumID)), mimetype="text/plain")
    return response
