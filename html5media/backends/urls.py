from django.conf.urls.defaults import patterns, url

urlpatterns = patterns('html5media.backends.views',
    url(r"^getplaylist/$", "getplaylist"),
    url(r"^playlistlist/$", "playlistlist"),
    url(r"^libraryitems/$", "libraryitems"),
)
