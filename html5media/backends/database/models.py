from django.db import models

class Track(models.Model):
    title  = models.CharField(max_length=127)
    #TODO: the following fields will be normalized to their own tables
    artist = models.CharField(max_length=100)
    album  = models.CharField(max_length=100)
    url    = models.CharField(max_length=255)
    
    def __unicode__(self):
        return u"Track #{}: {} ({}) - {}".format(self.id, self.album, self.artist, self.title)
    
    # Data source API helper methods
    @staticmethod
    def getLibraryItems():
        items = []
        for track in Track.objects.all():
            items.append({"id":     track.id,
                          "title":  track.title,
                          "artist": track.artist,
                          "album":  track.album,
                          "url":    track.url })
        return items

class Playlist(models.Model):
    tracks = models.ManyToManyField(Track)
    name   = models.CharField(max_length=63)
    
    def __unicode__(self):
        return u"Playlist #{}: {} ({} tracks)".format(self.id, self.name, self.tracks.count())
    
    # Data source API helper methods
    @staticmethod
    def getPlaylist(playlistID):
        playlistObj = Playlist.objects.get(pk=playlistID)
        playlist = {"id": playlistObj.id,
                    "name": playlistObj.name,
                    "tracks": []}
        for track in playlistObj.tracks.all():
            playlist["tracks"].append({"id":     track.id,
                                       "title":  track.title,
                                       "artist": track.artist,
                                       "album":  track.album,
                                       "url":    track.url })
        return playlist
    
    @staticmethod
    def getPlaylistList():
        lists = Playlist.objects.all()
        listout = []
        for playlist in lists:
            listout.append({"id": playlist.id,
                            "name": playlist.name,
                            "tracks": [t.id for t in playlist.tracks.all()]})
        return listout
    
    @staticmethod
    def savePlaylist(trackList, name):
        tracks = Track.objects.filter(pk__in=trackList)
        playlist = Playlist()
        #TODO: see if there's a better way than saving twice
        playlist.save()
        playlist.tracks.add(*tracks)
        playlist.name = name
        playlist.save()
