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

class Playlist(models.Model):
    tracks = models.ManyToManyField(Track)
    name   = models.CharField(max_length=63)

def getPlaylist(name):
    playlistObj = Playlist.objects.all()[0]
    #TODO: make this part a method of Playlist
    playlist = []
    for track in playlistObj.tracks.all():
        playlist.append({"id":     track.id,
                         "title":  track.title,
                         "artist": track.artist,
                         "album":  track.album,
                         "url":    track.url })
    return playlist

def getPlaylistList():
    lists = Playlist.objects.all()
    listout = []
    for playlist in lists:
        listout.append({"id": playlist.id,
                        "name": playlist.name,
                        "tracks": [t.id for t in playlist.tracks.all()]})
    return listout

def savePlaylist(tracks):
    pass

def getLibraryItems():
    items = []
    for track in Track.objects.all():
        items.append({"id":     track.id,
                      "title":  track.title,
                      "artist": track.artist,
                      "album":  track.album,
                      "url":    track.url })
    return items
