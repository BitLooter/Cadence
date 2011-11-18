from django.db import models

class Track(models.Model):
    title = models.CharField(max_length=127)
    url = models.CharField(max_length=127)

def getPlaylist(name):
    pass
#    return playlist

def getPlaylistList():
    pass
#    return dirs
