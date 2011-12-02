from django.conf.urls.defaults import patterns, url

urlpatterns = patterns('html5media.backends.views',
    url(r"^playlist/(?P<playlistID>\d+)/$", "playlist"),
    url(r"^playlistlist/$", "playlistlist"),
    url(r"^saveplaylist/$", "saveplaylist"),
    url(r"^library/albums/$", "library_albums"),
    url(r"^library/$", "library"),
)
