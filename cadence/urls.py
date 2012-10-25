from django.conf.urls import patterns, include, url
from django.conf import settings

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r"^$", "cadence.apps.player.views.index"),
    url(r"^data/", include("cadence.apps.backend.urls")),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)

# Serve media files with staticfiles, if we're on the dev server.
if settings.DEBUG == True:
    urlpatterns += patterns('',
        # Manually set static root here, because staticfiles doesn't like relative
        # STATIC_URL paths - which I'm using to easily switch dev servers.
        (r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT}),
        (r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
    )
