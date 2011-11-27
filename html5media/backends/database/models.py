from django.db import models


# Constants
############
allowedFilters = ["album"]


# Classes
##########

class Artist(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    def __unicode__(self):
        return u"Artist #{}: {}".format(self.id, self.name)

class Album(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    def __unicode__(self):
        return u"Album #{}: {}".format(self.id, self.name)

class Media(models.Model):
    title  = models.CharField(max_length=127)
    #TODO: the following fields will be normalized to their own tables
    artist = models.ForeignKey(Artist)
    album  = models.ForeignKey(Album)
    url    = models.CharField(max_length=255)
    
    def __unicode__(self):
        return u"#{}: {} ({}) - {}".format(self.id, self.album.name, self.artist.name, self.title)
    
    # Data source API helper methods
    @staticmethod
    def getLibraryItems(filters):
        request_kwargs = {}
        for arg, param in filters.items():
            request_kwargs[arg] = param
        
        items = []
        for item in Media.objects.filter(**request_kwargs):
            items.append({"id":     item.id,
                          "title":  item.title,
                          "artist": item.artist.name,
                          "album":  item.album.name,
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
                                      "artist": item.artist.name,
                                      "album":  item.album.name,
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
        return playlist.id
