"""
TODO: clean up this comment, better formatting for Sphinx

Cadence backend URLs
====================

Cadence's backend REST interface is defined here. These should be placed under
`data/` at Cadence's URL root (e.g. if your Cadence installation is being served
at `http://yourawesomewebsite.com/cadence`, these urls should be at
`http://yourawesomewebsite.com/cadence/data`.


REST API
--------

TODO: data formats

library/
    List of all tracks in library (may be disabled in settings)

library/audio/
    Like `library/`, but restricted to audio files

library/<Media ID>/
    Details about the media with the given ID

library/albums/
    List of albums in the library

library/albums/<Album ID>/
    Tracks in the given album

library/albums/<Album ID>/details/
    Detailed information about the specified album

library/artists/
    List of artists in the library

library/artists/<Artist ID>/
    List of tracks belonging to the given artist

library/artists/<Artist ID>/details/
    Detailed information about the specified artist

playlists/
    List of playlists available

playlists/<Playlist ID>/
    Playlist information for the given ID

"""

from django.conf.urls import patterns, url

#TODO: xxID should be xx_id
urlpatterns = patterns('cadence.apps.backend.views',
    url(r"^library/(?P<mediaID>\d+)/$", "details"),
    #url(r"^library/albums/(?P<albumID>\d+)/details/$", ""),
    url(r"^library/albums/(?P<albumID>\d+)/$", "library_get_album"),
    url(r"^library/albums/$", "library_albums"),
    #url(r"^library/artists/(?P<artistID>\d+)/details/$", ""),
    url(r"^library/artists/(?P<artistID>\d+)/$", "library_get_artist"),
    url(r"^library/artists/$", "library_artists"),
    url(r"^library/$", "library"),
    url(r"^playlists/(?P<playlistID>\d+)/$", "getplaylist"),
    url(r"^playlists/$", "playlists"),
)
