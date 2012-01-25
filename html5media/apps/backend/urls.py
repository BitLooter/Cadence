from django.conf.urls.defaults import patterns, url

urlpatterns = patterns('html5media.apps.backend.views',
    url(r"^playlists/(?P<playlistID>\d+)/$", "playlist"),
    url(r"^playlists/$", "playlistlist"),
    url(r"^saveplaylist/$", "saveplaylist"),
    url(r"^library/albums/(?P<albumID>\d+)/$", "library_get_album"),
    url(r"^library/albums/$", "library_albums"),
    url(r"^library/artists/(?P<artistID>\d+)/$", "library_get_artist"),
    url(r"^library/artists/$", "library_artists"),
    url(r"^library/$", "library"),
    url(r"^update/$", "update"),
)
