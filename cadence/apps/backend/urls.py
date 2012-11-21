"""
Cadence REST API
================

Cadence's backend REST interface is defined here. These should be placed under
`data/` at Cadence's URL root (e.g. if your Cadence installation is being served
at ``yourawesomewebsite.com/cadence/``, these urls should be at
``yourawesomewebsite.com/cadence/data/``.


API calls
---------

.. http:get:: media/
   
   Every track on the server, the whole shebang. May be disabled on some servers
   depending on the configuration for performance or security reasons.
   
   Returns data as a JSON tracklist.

   :statuscode 200: No error
   :statuscode 403: Full library view disabled


.. http:get:: albums/
   
   A list of albums in the server database, along with associated metadata.
   
   **Example response**:
   
   .. sourcecode:: javascript
   
      [
         {"coverurl": "media/albumart/Still%20Alive%20%28The%20Theme%20From%20Mirror%27s%20Edge%29%20-%20The%20Remixes.jpg",
          "id": 1,
          "name": "Still Alive (The Theme From Mirror's Edge) - The Remixes"},
         {"coverurl": "media/albumart/Cows%20with%20Guns.jpg",
          "id": 2,
          "name": "Cows with Guns"},
         {"coverurl": "media/albumart/Metal%20Gear%20Solid%202%20Sons%20Of%20Liberty%20OST.jpg",
          "id": 3,
          "name": "Metal Gear Solid 2: Sons Of Liberty OST"},

         // Continues on for the rest of the albums in the database>
      ]
   
   :statuscode 200: No error


.. http:get:: albums/(int:album_id)/tracks/
   
   All tracks contained in an album matching the given album ID.
   
   Returns data as a JSON tracklist.
   
   :param album_id: Unique ID for the album
   :statuscode 200: No error
   :statuscode 404: Album ID does not exist in database


.. http:get:: artists/
   
   A list of artists in the server database, along with associated metadata.
   
   **Example response**:
   
   .. sourcecode:: javascript
   
      [
         {
            "id": 1,
            "name": "Lisa Miskovsky"},
         {
            "id": 2,
            "name": "Dana Lyons"},
         
         // Continues on for the rest of the artists in the database
      ]

   :statuscode 200: No error


.. http:get:: artists/(int:artist_id)/tracks/
   
   All tracks by an artist matching the given artist ID.
   
   Returns data as a JSON tracklist.
   
   :param artist_id: Unique ID for the artist
   :statuscode 200: No error
   :statuscode 404: Artist ID does not exist in database


.. http:get:: playlists/
   
   A list of playlists stored on the server.
   
   **Example response**:
   
   .. sourcecode:: javascript
   
      [
         {"name": "Hits of the 80's",
          "id": 1},
         {"name": "Party like it's 1899",
          "id": 2},
         {"name": "Music to annoy dubstep fans",
          "id": 3},
         
         // Continues on for the rest of the playlists
      ]
   
   :statuscode 200: No error


.. http:get:: playlists/(int:playlist_id)/tracks/
   
   Tracklist for a playlist matching `playlist_id`.
   
   Returns data as a JSON tracklist.
   
   :param playlist_id: Unique ID for the playlist
   :statuscode 200: No error
   :statuscode 404: No playlist matching `playlist_id`.


Common data formats
-------------------

Response formats common to multiple API calls are documented here.


Tracklist
~~~~~~~~~

 .. sourcecode:: javascript
    
    [
       {"album": "Cows with Guns",
        "artist": "Dana Lyons",
        "poster": "Cows%20with%20Guns.jpg",
        "title": "Cows with Guns",
        "sources": [
           {"url": "media/transcodes/Dana Lyons_Cows with Guns_01_Cows with Guns.ogg",
            "transcode": true,
            "mime": "audio/ogg"},
           {"url": "media/transcodes/Dana Lyons_Cows with Guns_01_Cows with Guns.mp3",
            "transcode": true,
            "mime": "audio/mp3"}
        ],
        "length": 314.49333333333334,
        "id": 1
       },
       {"album": "Still Alive (The Theme From Mirror's Edge) - The Remixes",
        "artist": "Lisa Miskovsky",
        "poster": "media/albumart/Still%20Alive%20%28The%20Theme%20From%20Mirror%27s%20Edge%29%20-%20The%20Remixes.jpg",
        "title": "Still Alive (Theme From Mirror's Edge)",
        "sources": [
           {"url": "media/music/still alive (the theme from mirror's edge) - the remixes - 01.ogg",
            "transcode": false,
            "mime": "audio/ogg"},
           {"url": "media/transcodes/still alive (the theme from mirror's edge) - the remixes - 01.transcode.mp3",
            "transcode": true,
            "mime": "audio/mp3"}
        ],
        "length": 260.29333333333335,
        "id": 2},

        // Continues on for the rest of the tracks
    ]
"""

from django.conf.urls import patterns, url


urlpatterns = patterns('cadence.apps.backend.views',
    url(r"^media/$", "media"),
    url(r"^media/(?P<item_id>\d+)/$", "media_details"),
    url(r"^albums/(?P<item_id>\d+)/tracks/$", "album_tracks"),
    #url(r"^albums/(?P<albumID>\d+)/$", "album_details"),
    url(r"^albums/$", "albums"),
    url(r"^artists/(?P<item_id>\d+)/tracks/$", "artist_tracks"),
    #url(r"^artists/(?P<artistID>\d+)/$", "artist_details"),
    url(r"^artists/$", "artists"),
    url(r"^playlists/(?P<item_id>\d+)/tracks/$", "playlist_tracks"),
    #url(r"^playlists/(?P<playlistID>\d+)/$", "playlist_details"),
    url(r"^playlists/$", "playlists"),
)
