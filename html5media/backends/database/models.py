from django.db import models


# Classes
##########

class Artist(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    def __unicode__(self):
        return u"Artist #{}: {}".format(self.id, self.name)

class Album(models.Model):
    name =     models.CharField(max_length=100, unique=True)
    coverurl = models.URLField()
    
    def __unicode__(self):
        return u"Album #{}: {}".format(self.id, self.name)
    
    @staticmethod
    def getAlbums():
        albums = []
        for album in Album.objects.all():
            albums.append({"id":       album.id,
                           "name":     album.name,
                           "coverurl": album.coverurl })
        return albums
    
    @staticmethod
    def getAlbumTracks(albumID):
        items = []
        for item in Media.objects.filter(album=albumID):
            items.append(item.make_dict())
        return items

class Media(models.Model):
    title  = models.CharField(max_length=127)
    artist = models.ForeignKey(Artist)
    album  = models.ForeignKey(Album)
    length = models.FloatField(help_text="Track length in seconds, floating point")
    url    = models.CharField(max_length=255)
    
    def __unicode__(self):
        return u"#{}: {} ({}) - {}".format(self.id, self.album.name, self.artist.name, self.title)
    
    def make_dict(self):
        return {"id":       self.id,
                "title":    self.title,
                "artist":   self.artist.name,
                "album":    self.album.name,
                "length":   self.length,
                "url":      self.url,
                "poster":   self.album.coverurl }
    
    # Data source API helper methods
    @staticmethod
    def getFullLibrary():
        items = []
        for item in Media.objects.all():
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
