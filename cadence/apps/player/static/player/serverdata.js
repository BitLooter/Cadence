/********************************************************************
 * serverdata.js - Functions for accessing data from the server
 ********************************************************************/


/* Functions
 ************/

/*************************************
 serverRequest
 -------------
 Wrapper for makeRequest that handles errors and exceptions with an error callback
 *************************************/
function serverRequest(url, callback, errorCallback, postdata) {
    try {
        makeRequest(url, function(r){
            if (r.status == 200) {
                callback(JSON.parse(r.responseText));
            } else {
                // Call the error callback if anything went wrong, if one was given
                if (errorCallback != undefined) {
                    errorCallback(r);
                }
            }
        }, postdata);
    } catch (e) {
        // Do nothing, error handling here is done above
    }
}

/*************************************
 requestPlaylist
 ---------------
 Tries to recieve the playlist with the given id from the server.
 *************************************/
function requestPlaylist(id, callback, errorCallback) {
    serverRequest("data/playlists/"+id+"/media/", callback, errorCallback);
}

/*************************************
 requestPlaylistList
 -------------------
 Retrieves a list of playlists from the server
 *************************************/
function requestPlaylistList(callback, errorCallback) {
    serverRequest("data/playlists/", callback, errorCallback);
}

/*************************************
 requestLibraryItems
 -------------------
 Gets a list of media items in the library from the server
 *************************************/
function requestLibraryItems(callback, errorCallback) {
    serverRequest("data/media/", callback, errorCallback);
}

/*************************************
 requestMediaDetails
 -------------------
 Gets detailed information about a specific media item
 *************************************/
function requestMediaDetails(id, callback, errorCallback) {
    serverRequest("data/media/" + id + "/", callback, errorCallback);
}

/*************************************
 requestAlbumList
 ----------------
 Gets a list of track's albums from the server
 *************************************/
function requestAlbumList(callback, errorCallback) {
    serverRequest("data/albums/", callback, errorCallback);
}

/*************************************
 requestAlbum
 ------------
 Gets an album from the server
 *************************************/
function requestAlbum(id, callback, errorCallback) {
    serverRequest("data/albums/" + id + "/media/", callback, errorCallback);
}

/*************************************
 requestArtistList
 ----------------
 Gets a list of artists from the server
 *************************************/
function requestArtistList(callback, errorCallback) {
    serverRequest("data/artists/", callback, errorCallback);
}

/*************************************
 requestArtist
 ------------
 Gets an artist's tracks from the server
 *************************************/
function requestArtist(id, callback, errorCallback) {
    serverRequest("data/artists/" + id + "/media/", callback, errorCallback);
}

/*************************************
 savePlaylist
 ------------
 Sends a playlist to the server to save there.
 *************************************/
function savePlaylist(tracks, name, errorCallback) {
    // First prepare the data to a JSON-ready server format
    var idList = [];
    for (var i = 0; i < tracks.length; i++) {
        idList.push(parseInt(tracks[i].id));
    }
    var text = JSON.stringify({"name": name, "tracks": idList});
    // Now send it to the server
    serverRequest("data/playlists/", callback, errorCallback, text);
}
