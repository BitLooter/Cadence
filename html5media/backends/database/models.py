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
    
    @staticmethod
    def getAlbums():
        albums = []
        for album in Album.objects.all():
            albums.append({"id":     album.id,
                           "name":   album.name })
        return albums

class Media(models.Model):
    title  = models.CharField(max_length=127)
    artist = models.ForeignKey(Artist)
    album  = models.ForeignKey(Album)
    length = models.FloatField()
    url    = models.CharField(max_length=255)
    
    def __unicode__(self):
        return u"#{}: {} ({}) - {}".format(self.id, self.album.name, self.artist.name, self.title)
    
    def make_dict(self):
        return {"id":     self.id,
                "title":  self.title,
                "artist": self.artist.name,
                "album":  self.album.name,
                "length": self.length,
                "url":    self.url }
    
    # Data source API helper methods
    @staticmethod
    def getLibraryItems(filters):
        request_kwargs = {}
        for arg, param in filters.items():
            request_kwargs[arg] = param
        
        items = []
        for item in Media.objects.filter(**request_kwargs):
            items.append(item.make_dict())
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
            playlist["items"].append(item.make_dict())
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
        playlist.save()
        playlist.items.add(*items)
        playlist.name = name
        playlist.save()
        return playlist.id
