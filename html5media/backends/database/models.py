from django.db import models

class Track(models.Model):
    title  = models.CharField(max_length=127)
    #TODO: the following fields will be normalized to their own tables
    artist = models.CharField(max_length=100)
    album  = models.CharField(max_length=100)
    url    = models.CharField(max_length=255)
    
    def __unicode__(self):
        #TODO: this still needs work
        return u"<Track: {} - {}".format(self.album, self.title)

def getPlaylist(name):
    playlist = []
    for track in Track.objects.all():
        playlist.append({"title": track.title,
                         "url":   track.url })
    return playlist

def getPlaylistList():
    return ["none"]

def getLibraryItems():
    items = []
    for track in Track.objects.all():
        items.append({"title": track.title,
                      "url":   track.url })
    return items
