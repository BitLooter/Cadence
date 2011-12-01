from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseNotFound
from django.core.exceptions import ObjectDoesNotExist
import json
from database import models

#TODO: document API parameters
#TODO: check for external errors like database access problems
def playlist(request):
    #TODO: logging
    #If ID contains anything but numbers, it's an error
    playlistID = request.GET["id"]
    if playlistID.isdigit():
        try:
            playlist = models.Playlist.getPlaylist(playlistID)
            response = HttpResponse(json.dumps(playlist), mimetype="text/plain")
        except ObjectDoesNotExist:
            response = HttpResponseNotFound("Error: Playlist not found", mimetype="text/plain")
    else:
        response = HttpResponseBadRequest("Error: ID is not a number", mimetype="text/plain")
    return response

def playlistlist(request):
    #TODO: logging
    lists = models.Playlist.getPlaylistList()
    return HttpResponse(json.dumps(lists))

def saveplaylist(request):
    #TODO: logging
    info = json.loads(request.raw_post_data)
    # Sanity check on the data - name is a (unicode) string, tracks are all integers 
    if (type(info["name"]) != unicode) or not (all(type(t) == int for t in info["tracks"])):
        response = HttpResponseBadRequest("Error: Given data is invalid", mimetype="text/plain")
    else:
        newID = models.Playlist.savePlaylist(info["tracks"], info["name"])
        response = HttpResponse("Playlist created successfully", status=201, mimetype="text/plain")
        response["Location"] = "/html5media/data/playlist/?{}".format(newID)
    
    return response

def library(request):
    #TODO: logging
    # Make sure no one's trying anything funny with the queries and database access
    if set(request.GET.keys()) <= set(models.allowedFilters):
        response = HttpResponse(json.dumps(models.Media.getLibraryItems(request.GET)))
    else:
        badFilters = list(set(request.GET.keys()) - set(models.allowedFilters))
        response = HttpResponseBadRequest("Error: Unrecognized filter(s): {}".format(", ".join(badFilters)),
                                          mimetype="text/plain")
    return response
