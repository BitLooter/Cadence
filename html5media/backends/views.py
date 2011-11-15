from django.http import HttpResponse
import json
from disk import models

def getplaylist(request):
    #TODO: check parameters
    #TODO: HTTP errors
    playlist = models.getPlaylist(request.GET["name"])
    return HttpResponse(json.dumps(playlist))
