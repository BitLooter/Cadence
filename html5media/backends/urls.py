from django.conf.urls.defaults import patterns, url

urlpatterns = patterns('html5media.backends.views',
    url(r"^playlist/$", "playlist"),
    url(r"^playlistlist/$", "playlistlist"),
    url(r"^libraryitems/$", "libraryitems"),
)
