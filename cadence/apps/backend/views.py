from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseNotFound
from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt # See note below on saveplaylist
import json
import logging

import models


# Set up logging
logger = logging.getLogger("apps")

#TODO: check for external errors like database access problems
#TODO: This really, REALLY needs to be fixed - do not let this enter final
# release without properly implementing CSRF protection.
@csrf_exempt
def playlists(request):
    """
    Virtual view method for data/playlists/
    
    Saves a playlist or returns a list of them, depending on request type. A GET
    request will return a list of available playlists in JSON format; a POST request
    saves a new playlist to the server, using the POST data (also in JSON format).
    
    Does not actually do anything itself, but rather calls the correct function for
    the task.
    """
    
    # If POST, we're saving a playlist
    if request.method == "POST":
        return saveplaylist(request)
    # Otherwise, default behavior is to return a list of playlists
    else:
        return playlistlist(request)

def playlistlist(request):
    """View method for data/playlists/ (GET). Returns list of playlists in JSON."""
    
    logger.info("Playlist list requested from {}".format(request.get_host()))
    lists = models.Playlist.getPlaylistList()
    return json_response(lists)

def saveplaylist(request):
    """
    View method for data/playlists/ (POST)
    
    Saves a new playlist to the database. Data is in JSON format, and is expected
    to take the form of a dict with 'name' and 'tracks' fields, name being a
    string and tracks being a list of track IDs. Example::
    
        {
            "name": "Top ten Tuvian throat singing rap singles"
            "tracks": [553, 1490, 6643, 1186, 6689, 91, 642, 11, 853, 321]
        }
    """
    
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
            response["Location"] = "/cadence/data/playlist/{}/".format(newID)
            logger.info("Playlist from {} successfully saved as #{}".format(request.get_host(), newID))
    
    return response

def getplaylist(request, playlistID):
    """View method for data/playlists/<ID>/. Returns playlist matching ID."""
    
    logger.info("Playlist #{} requested from {}".format(playlistID, request.get_host()))
    
    try:
        playlist = models.Playlist.getPlaylist(playlistID)
        response = json_response(playlist)
    except ObjectDoesNotExist:
        error = "Playlist #{} does not exist".format(playlistID)
        response = HttpResponseNotFound(error, mimetype="text/plain")
        logger.error(error)
    
    return response

def library(request):
    """
    View method for data/library/. Returns information on every track in the library.
    
    Note that for very large libraries, this could produce a great amount of data
    and load slowly on the client (not to mention "Holy crap Frank, how'd we go over
    our data limit again this month?"). Therefore, this view may be disabled depending
    on the current site settings.
    """
     
    logger.info("Full library request from {}".format(request.get_host()))
    response = json_response(models.Media.getFullLibrary())
    return response

def library_albums(request):
    """View method for data/library/albums/. Returns list of albums in the library."""
    logger.info("Library albums request from {}".format(request.get_host()))
    response = json_response(models.Album.getAlbums())
    return response

def library_get_album(request, albumID):
    """View method for data/library/albums/<ID>. Returns info on album matching ID."""
    logger.info("Album request from {}".format(request.get_host()))
    
    try:
        tracks = models.Album.getAlbumTracks(albumID)
        response = json_response(tracks)
    except ObjectDoesNotExist as e:
        error = "Error: {}".format(e.message)
        logger.error(error)
        response = HttpResponseNotFound(error, mimetype="text/plain")
    
    return response

def library_artists(request):
    """View method for data/library/artists/. Returns list of artists in the library."""
    logger.info("Library artists request from {}".format(request.get_host()))
    response = json_response(models.Artist.getArtists())
    return response

def library_get_artist(request, artistID):
    """View method for data/library/artists/<ID>. Returns info on artist matching ID."""
    logger.info("Artist request from {}".format(request.get_host()))
    
    try:
        tracks = models.Artist.getArtistTracks(artistID)
        response = json_response(tracks)
    except ObjectDoesNotExist as e:
        error = "Error: {}".format(e.message)
        logger.error(error)
        response = HttpResponseNotFound(error, mimetype="text/plain")
    
    return response


# Utility methods
#################

def json_response(output):
    """Returns an HTTP Response with the data in output as the content in JSON format"""
    return HttpResponse(json.dumps(output), mimetype="application/json")
