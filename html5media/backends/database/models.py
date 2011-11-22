from django.db import models

class Media(models.Model):
    title  = models.CharField(max_length=127)
    #TODO: the following fields will be normalized to their own tables
    artist = models.CharField(max_length=100)
    album  = models.CharField(max_length=100)
    url    = models.CharField(max_length=255)
    
    def __unicode__(self):
        return u"Media #{}: {} ({}) - {}".format(self.id, self.album, self.artist, self.title)
    
    # Data source API helper methods
    @staticmethod
    def getLibraryItems():
        items = []
        for item in Media.objects.all():
            items.append({"id":     item.id,
                          "title":  item.title,
                          "artist": item.artist,
                          "album":  item.album,
                          "url":    item.url })
        return items

class Playlist(models.Model):
    items = models.ManyToManyField(Media)
    name  = models.CharField(max_length=63)
    
    def __unicode__(self):
        return u"Playlist #{}: {} ({} items)".format(self.id, self.name, self.items.count())
    
    # Data source API helper methods
    @staticmethod
    def getPlaylist(playlistID):
        playlistObj = Playlist.objects.get(pk=playlistID)
        playlist = {"id": playlistObj.id,
                    "name": playlistObj.name,
                    "items": []}
        for item in playlistObj.items.all():
            playlist["items"].append({"id":     item.id,
                                      "title":  item.title,
                                      "artist": item.artist,
                                      "album":  item.album,
                                      "url":    item.url })
        return playlist
    
    @staticmethod
    def getPlaylistList():
        lists = Playlist.objects.all()
        listout = []
        for playlist in lists:
            listout.append({"id": playlist.id,
                            "name": playlist.name})
        return listout
    
    @staticmethod
    def savePlaylist(idList, name):
        items = Media.objects.filter(pk__in=idList)
        playlist = Playlist()
        #TODO: see if there's a better way than saving twice
        playlist.save()
        playlist.items.add(*items)
        playlist.name = name
        playlist.save()
