from django.http import HttpResponse
import json
from database import models

#TODO: change getplaylist to playlist
def getplaylist(request):
    #TODO: check parameters
    #TODO: HTTP errors
    playlist = models.getPlaylist(request.GET["name"])
    return HttpResponse(json.dumps(playlist))

def playlistlist(request):
    lists = models.getPlaylistList()
    return HttpResponse(json.dumps(lists))

def libraryitems(request):
    return HttpResponse(json.dumps(models.getLibraryItems()))
