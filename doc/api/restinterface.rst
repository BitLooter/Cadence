REST database Interface
=======================

All urls are relative to the data URL root, by default /data.

.. http:get:: /library
   
   Request entire library from server. May be disabled on some servers depending
   on the configuration for performance or security reasons.
   
   **Example request**:
   
   .. sourcecode:: http
   
      GET /users/123/posts/web HTTP/1.1
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

   :statuscode 200: No error
   :statuscode 403: Full library view disabled
