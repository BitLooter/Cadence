from django.shortcuts import HttpResponse
import os
import urllib   #TODO: use urllib.parse in Python 3.x
import mutagen
import models

def scan():
    """
    Scans a directory for media and updates the database.
    
    Note that because it uses Django models to interface with the database,
    it must be run inside a Django context.
    """
    
    path = "C:/Develop/html5media/html5media/media/"
    files = os.listdir(path)
    files = [f for f in files if ".ogg" in f]
    for f in files:
        audio = mutagen.File(path + f)
        t = models.Media()
        #TODO: note that this catches missing tags but not blank tags
        t.title = audio["title"][0] if "title" in audio else "<No title>"
        t.artist = audio["artist"][0] if "title" in audio else "<No artist>"
        t.album = audio["album"][0] if "title" in audio else "<No album>"
        t.url = urllib.quote("/html5media/media/" + f)
        t.save()
    return True

def update(request):
    """Django view for running the scanner"""
    
    result = scan()
    if result == True:
        return HttpResponse("Done!")
    else:
        return HttpResponse("Error!\n\n"+data)
