from django.shortcuts import HttpResponse
import os
import mutagen
import models

def scan():
    path = "C:/Develop/html5media/html5media/media/"
    files = os.listdir(path)
    files = [f for f in files if ".ogg" in f]
    outstr = ""
    for f in files:
        audio = mutagen.File(path + f)
        metadata = {}
        metadata["url"] = f
        metadata["title"] = audio["title"][0] if "title" in audio else ""
        t = models.Track()
        t.title = metadata["title"]
        t.url = "/media/" + metadata["url"]
        t.save()
        outstr += repr(metadata) + "<p>"
    return True, outstr

def update(request):
    """Django view for running the scanner"""
    
    result, data = scan()
    if result == True:
        return HttpResponse("Done!<p>"+data)
    else:
        return HttpResponse("Error!\n\n"+data)
