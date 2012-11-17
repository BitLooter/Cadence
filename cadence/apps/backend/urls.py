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

media/
    List of all tracks in library (may be disabled in settings)

media/<Media ID>/
    Details about the media with the given ID

#library/audio/
#    Like `library/`, but restricted to audio files

albums/
    List of albums in the library

albums/<Album ID>/
    Tracks in the given album

albums/<Album ID>/details/
    Detailed information about the specified album

artists/
    List of artists in the library

artists/<Artist ID>/
    List of tracks belonging to the given artist

artists/<Artist ID>/details/
    Detailed information about the specified artist

playlists/
    List of playlists available

playlists/<Playlist ID>/
    Playlist information for the given ID

"""

from django.conf.urls import patterns, url

#TODO: xxID should be xx_id
urlpatterns = patterns('cadence.apps.backend.views',
    url(r"^media/$", "media"),
    url(r"^media/(?P<mediaID>\d+)/$", "media_details"),
    url(r"^albums/(?P<albumID>\d+)/tracks/$", "album_tracks"),
    #url(r"^albums/(?P<albumID>\d+)/$", "album_details"),
    url(r"^albums/$", "albums"),
    url(r"^artists/(?P<artistID>\d+)/tracks/$", "artist_tracks"),
    #url(r"^artists/(?P<artistID>\d+)/$", "artist_details"),
    url(r"^artists/$", "artists"),
    url(r"^playlists/(?P<playlistID>\d+)/tracks/$", "playlist_tracks"),
    #url(r"^playlists/(?P<playlistID>\d+)/$", "playlist_details"),
    url(r"^playlists/$", "playlists"),
)
