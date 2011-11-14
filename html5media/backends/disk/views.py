from django.http import HttpResponse
import os
import json

def getplaylist_view(request):
    #TODO: decouple data/view
    #TODO: check parameters
    files = os.listdir("C:/Develop/html5media/html5media/media/" + request.GET["name"])
    files = ["/html5media/media/" + request.GET["name"] + "/" + f for f in files if ".ogg" in f]
    playlist = []
    for pathname in files:
        playlist.append( {"title": os.path.basename(pathname),
                          "url":   pathname.replace(" ", "%20")} ) #TODO: urlencode
    return HttpResponse(json.dumps(playlist))
