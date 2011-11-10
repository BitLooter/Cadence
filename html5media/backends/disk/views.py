from django.http import HttpResponse
import os
import json

def getplaylist_view(request):
    #TODO: decouple data/view
    files = os.listdir("C:/Develop/html5media/html5media/main/static/")
    files = ["/static/" + f.replace(" ", "%20") for f in files if ".ogg" in f]
    return HttpResponse(json.dumps(files))
