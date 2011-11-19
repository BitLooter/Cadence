from django.http import HttpResponse
import json
from database import models

#TODO: document parameters
def playlist(request):
    #TODO: check parameters
    #TODO: HTTP errors
    playlist = models.getPlaylist(request.GET["id"])
    return HttpResponse(json.dumps(playlist))

def playlistlist(request):
    lists = models.getPlaylistList()
    return HttpResponse(json.dumps(lists))

def saveplaylist(request):
    tracks = request.POST["tracks"].split(",")
    models.savePlaylist(tracks)

def libraryitems(request):
    return HttpResponse(json.dumps(models.getLibraryItems()))
