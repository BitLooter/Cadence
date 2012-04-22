REST Database Interface
=======================

All urls are relative to the data URL root, by default `/data`.

.. http:get:: /library
   
   Every track on the server, the whole shebang. May be disabled on some servers
   depending on the configuration for performance or security reasons.
   
   **Example request**:
   
   .. sourcecode:: http
   
      GET /data/library HTTP/1.1
      Host: example.com
      Accept: application/json, text/javascript
   
   **Example response**:
   
   .. note::
      Data below is subject to change if the database layout changes. If you're the
      developer, try to keep this up to date.
      
      Also, it might be best to describe the JSON structure elsewhere so we don't
      clutter this part up.
   
   .. sourcecode:: http
   
      HTTP/1.1 200 OK
      Content-Type: application/json
      
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
        ...
        <Continues on for the rest of the tracks in the library>
      ]

   :statuscode 200: No error
   :statuscode 403: Full library view disabled


.. http:get:: /library/artists
   
   A list of artists in the server database, along with associated metadata.
   
   **Example request**:
   
   .. sourcecode:: http
   
      GET /data/library/artists HTTP/1.1
      Host: example.com
      Accept: application/json, text/javascript
   
   **Example response**:
   
   .. note::
      Data below is subject to change if the database layout changes. If you're the
      developer, try to keep this up to date.
      
      Also, it might be best to describe the JSON structure elsewhere so we don't
      clutter this part up.
   
   .. sourcecode:: http
   
      HTTP/1.1 200 OK
      Content-Type: application/json
      
      [
         {
            "id": 1,
            "name": "Lisa Miskovsky"},
         {
            "id": 2,
            "name": "Dana Lyons"},
         ...
         <Continues on for the rest of the artists in the database>
      ]

   :statuscode 200: No error


.. http:get:: /library/artists/(int:artist_id)
   
   All tracks by an artist matching the given artist ID.
   
   **Example request**:
   
   .. sourcecode:: http
   
      GET /data/library/artists/2 HTTP/1.1
      Host: example.com
      Accept: application/json, text/javascript
   
   **Example response**:
   
   .. note::
      Data below is subject to change if the database layout changes. If you're the
      developer, try to keep this up to date.
      
      Also, it might be best to describe the JSON structure elsewhere so we don't
      clutter this part up.
   
   .. sourcecode:: http
   
      HTTP/1.1 200 OK
      Content-Type: application/json
      
      [
         {"album": "Cows with Guns",
         "artist": "Dana Lyons",
         "poster": "",
         "title": "Cows with Guns",
         "sources": [
            {"url": "media/music/Dana Lyons_Cows with Guns_01_Cows with Guns.ogg",
             "transcode": false,
             "mime": "audio/ogg"},
            {"url": "media/transcodes/Dana Lyons_Cows with Guns_01_Cows with Guns.mp3",
             "transcode": true,
             "mime": "audio/mp3"}
         ],
         "length": 314.49333333333334,
         "id": 1}
         ...
         <Continues on for the rest of the tracks by the artist>
      ]
   
   :statuscode 200: No error
   :statuscode 404: Artist ID does not exist in database


.. http:get:: /library/albums
   
   A list of albums in the server database, along with associated metadata.
   
   **Example request**:
   
   .. sourcecode:: http
   
      GET /data/library/albums HTTP/1.1
      Host: example.com
      Accept: application/json, text/javascript
   
   **Example response**:
   
   .. note::
      Data below is subject to change if the database layout changes. If you're the
      developer, try to keep this up to date.
      
      Also, it might be best to describe the JSON structure elsewhere so we don't
      clutter this part up.
   
   .. sourcecode:: http
   
      HTTP/1.1 200 OK
      Content-Type: application/json
      
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
         ...
         <Continues on for the rest of the albums in the database>
   
   :statuscode 200: No error


.. http:get:: /library/albums/(int:album_id)
   
   All tracks contained in an album matching the given album ID.
   
   **Example request**:
   
   .. sourcecode:: http
   
      GET /data/library/albums/2 HTTP/1.1
      Host: example.com
      Accept: application/json, text/javascript
   
   **Example response**:
   
   .. note::
      Data below is subject to change if the database layout changes. If you're the
      developer, try to keep this up to date.
      
      Also, it might be best to describe the JSON structure elsewhere so we don't
      clutter this part up.
   
   .. sourcecode:: http
   
      HTTP/1.1 200 OK
      Content-Type: application/json
      
      [
         {"album": "Still Alive (The Theme From Mirror's Edge) - The Remixes",
          "artist": "Lisa Miskovsky",
          "poster": "media/albumart/Still%20Alive%20%28The%20Theme%20From%20Mirror%27s%20Edge%29%20-%20The%20Remixes.jpg",
          "title": "Still Alive (Theme From Mirror's Edge)",
          "sources": [
            {"url": "media/music/mirror/still alive (the theme from mirror's edge) - the remixes - 01.ogg",
             "transcode": false,
             "mime": "audio/ogg"},
            {"url": "media/transcodes/mirror.still alive (the theme from mirror's edge) - the remixes - 01.transcode.mp3",
             "transcode": true,
             "mime": "audio/mp3"}
          ],
          "length": 260.29333333333335,
          "id": 2},
         {"album": "Still Alive (The Theme From Mirror's Edge) - The Remixes",
          "artist": "Lisa Miskovsky",
          "poster": "media/albumart/Still%20Alive%20%28The%20Theme%20From%20Mirror%27s%20Edge%29%20-%20The%20Remixes.jpg",
          "title": "Still Alive (Benny Benassi Mix)",
          "sources": [
            {"url": "media/music/mirror/still alive (the theme from mirror's edge) - the remixes - 02.ogg",
             "transcode": false,
             "mime": "audio/ogg"}
          ],
          "length": 505.25333333333333,
          "id": 3},
         ...
         <Continues on for the rest of the tracks in the album>
      ]
   
   :statuscode 200: No error
   :statuscode 404: Album ID does not exist in database


.. http:get:: /playlists
   
   A list of playlists stored on the server.
   
   **Example request**:
   
   .. sourcecode:: http
   
      GET /data/playlists HTTP/1.1
      Host: example.com
      Accept: application/json, text/javascript
   
   **Example response**:
   
   .. note::
      Data below is subject to change if the database layout changes. If you're the
      developer, try to keep this up to date.
      
      Also, it might be best to describe the JSON structure elsewhere so we don't
      clutter this part up.
   
   .. sourcecode:: http
   
      HTTP/1.1 200 OK
      Content-Type: application/json
      
      [
         {"name": "Hits of the 80's",
          "id": 1},
         {"name": "Party like it's 1899",
          "id": 2},
         {"name": "Music to annoy dubstep fans",
          "id": 3}
      ]
   
   :statuscode 200: No error


.. http:get:: /playlists/(int:playlist_id)
   
   Details on a specific playlist matching `playlist_id`.
   
   **Example request**:
   
   .. sourcecode:: http
   
      GET /data/playlists/3 HTTP/1.1
      Host: example.com
      Accept: application/json, text/javascript
   
   **Example response**:
   
   .. note::
      Data below is subject to change if the database layout changes. If you're the
      developer, try to keep this up to date.
      
      Also, it might be best to describe the JSON structure elsewhere so we don't
      clutter this part up.
   
   .. sourcecode:: http
   
      HTTP/1.1 200 OK
      Content-Type: application/json
      
      [
         {"album": "Cows with Guns",
         "artist": "Dana Lyons",
         "poster": "",
         "title": "Cows with Guns",
         "sources": [
            {"url": "media/music/Dana Lyons_Cows with Guns_01_Cows with Guns.ogg",
             "transcode": false,
             "mime": "audio/ogg"},
            {"url": "media/transcodes/Dana Lyons_Cows with Guns_01_Cows with Guns.mp3",
             "transcode": true,
             "mime": "audio/mp3"}
         ],
         "length": 314.49333333333334,
         "id": 741}
         ...
         <Continues on for the rest of the tracks in the playlist>
      ]
   
   :statuscode 200: No error
   :statuscode 404: No playlist matching `playlist_id`.
   