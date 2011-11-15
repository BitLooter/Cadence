from django.conf.urls.defaults import patterns, url

urlpatterns = patterns('html5media.backends.disk.views',
    url(r"^getplaylist/$", "getplaylist"),
)
