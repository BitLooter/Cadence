from django.http import HttpResponse
import json
from database import models

#TODO: document parameters
def playlist(request):
    #TODO: check parameters
    #TODO: HTTP errors
    playlist = models.Playlist.getPlaylist(request.GET["id"])
    return HttpResponse(json.dumps(playlist))

def playlistlist(request):
    lists = models.Playlist.getPlaylistList()
    return HttpResponse(json.dumps(lists))

def saveplaylist(request):
    tracks = request.POST["tracks"].split(",")
    models.Playlist.savePlaylist(tracks, request.POST["name"])
    #TODO: come up with a better response
    return HttpResponse("done!")

def libraryitems(request):
    return HttpResponse(json.dumps(models.Track.getLibraryItems()))
