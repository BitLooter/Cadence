import json
import logging

from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseNotFound
from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.csrf import csrf_exempt  # See note below on saveplaylist

import models


# Set up logging
logger = logging.getLogger("apps")


# View function decorators
##########################

def log_request(f):
    """Records request info to the log file"""

    def wrapper(*args, **kwargs):
        request = args[0]
        # Display simpler message if there are no view parameters
        if kwargs == {}:
            message = "{} request from {}".format(f.__name__, request.get_host())
        elif "item_id" in kwargs:
            message = "{} (#{}) request from {}".format(f.__name__, kwargs["item_id"], request.get_host())
        else:
            message = "{} {} request from {}".format(f.__name__, repr(kwargs), request.get_host())
        logger.info(message)
        return f(*args, **kwargs)
    wrapper.__doc__ = f.__doc__

    return wrapper


def handle_not_found(f):
    """
    For views that request a specific object (e.g. a playlist), return a 404
    page and log an error if the object was not found.

    Assumes the object being looked for is passed as a kwarg named 'item_id'.
    If this view does not fit this pattern, you will not be able to handle
    404 errors for it with this decorator.
    """

    def wrapper(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except ObjectDoesNotExist as e:
            print e.message
            error = "{} (#{})".format(e.message, kwargs["item_id"])
            logger.error(error)
            return HttpResponseNotFound(error, mimetype="text/plain")
    wrapper.__doc__ = f.__doc__

    return wrapper


# View functions
################

#TODO: check for external errors like database access problems
#TODO: This really, REALLY needs to be fixed - do not let this enter final
# release without properly implementing CSRF protection.
@csrf_exempt
def playlists(request):
    """
    Generic view for /data/playlists/, choosing a view function for the request type.
    
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


@log_request
def playlistlist(request):
    """View method for list of playlists. Returns list of playlists in JSON."""
    
    lists = models.Playlist.getPlaylistList()
    return json_response(lists)


@log_request
def saveplaylist(request):
    """
    View method for saving a playlist (POST).
    
    Saves a new playlist to the database. Data is in JSON format, and is expected
    to take the form of a dict with 'name' and 'tracks' fields, name being a
    string and tracks being a list of track IDs. Example::
    
        {
            "name": "Top ten Tuvian throat singing rap singles"
            "tracks": [553, 1490, 6643, 1186, 6689, 91, 642, 11, 853, 321]
        }
    """
    
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


@handle_not_found
@log_request
def playlist_tracks(request, item_id):
    """View method for playlist tracklist. Returns playlist matching ID."""
    
    return json_response(models.Playlist.getPlaylist(item_id))


@log_request
def media(request):
    """
    View method for all media. Returns information on every track in the library.
    
    Note that for very large libraries, this could produce a great amount of data
    and load slowly on the client (not to mention "Holy crap Frank, how'd we go over
    our data limit again this month?"). Therefore, this view may be disabled depending
    on the current site settings.
    """
     
    return json_response(models.Media.getFullLibrary())


@handle_not_found
@log_request
def media_details(request, item_id):
    """View method for details on a specific media item"""

    return json_response(models.Media.getDetails(item_id))


@log_request
def albums(request):
    """View method for albums list. Returns list of albums in the library."""
    
    return json_response(models.Album.getAlbums())


@handle_not_found
@log_request
def album_tracks(request, item_id):
    """View method for album tracklist. Returns media for album matching ID."""
    
    return json_response(models.Album.getAlbumTracks(item_id))


@log_request
def artists(request):
    """View method for artists list. Returns list of artists in the library."""
    
    return json_response(models.Artist.getArtists())


@handle_not_found
@log_request
def artist_tracks(request, item_id):
    """View method for artist tracklist. Returns media for artist matching ID."""
    
    return json_response(models.Artist.getArtistTracks(item_id))


# Utility methods
#################

def json_response(output):
    """Returns an HTTP Response with the data in output as the content in JSON format"""
    return HttpResponse(json.dumps(output), mimetype="application/json")
