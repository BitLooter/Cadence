/********************************************************************
 * serverdata.js - Functions for accessing data from the server
 ********************************************************************/


/* Functions
 ************/

/*************************************
 serverRequest
 -------------
 Wrapper for makeRequest that ignores exceptions and errors - the various request
 functions will supply their own error handlers.
 *************************************/
function serverRequest(url, handler, postdata) {
    try {
        makeRequest(url, handler, postdata);
    } catch (e) {
        // Do nothing, error handling here is done in the handler
    }
}


/*************************************
 requestPlaylist
 ---------------
 Tries to recieve the playlist with the given id from the server.
 *************************************/
function requestPlaylist(id, callback, errorCallback) {
    serverRequest("data/playlists/"+id+"/", function(r){
        if (r.status == 200) {
            var response = JSON.parse(r.responseText);
            var playlist = response.items;
            playlist.id = response.id;
            playlist.name = response.name;
            callback(playlist);
        } else {
            // Call the error callback if anything went wrong, if one was given
            if (errorCallback != undefined) {
                errorCallback(r);
            }
        }
    });
}

/*************************************
 requestPlaylistList
 -------------------
 Retrieves a list of playlists from the server
 *************************************/
function requestPlaylistList(callback, errorCallback) {
    serverRequest("data/playlists/", function(r){
        if (r.status == 200) {
            callback(JSON.parse(r.responseText));
        } else {
            // Call the error callback if anything went wrong, if one was given
            if (errorCallback != undefined) {
                errorCallback(r);
            }
        }
    });
}

/*************************************
 requestLibraryItems
 -------------------
 Gets a list of media items in the library from the server
 *************************************/
function requestLibraryItems(callback, errorCallback) {
    serverRequest("data/library/", function(r){
        if (r.status == 200) {
            callback(JSON.parse(r.responseText));
        } else {
            // Call the error callback if anything went wrong, if one was given
            if (errorCallback != undefined) {
                errorCallback(r);
            }
        }
    });
}

/*************************************
 requestAlbumList
 ----------------
 Gets a list of track's albums from the server
 *************************************/
function requestAlbumList(callback, errorCallback) {
    serverRequest("data/library/albums/", function(r){
        if (r.status == 200) {
            callback(JSON.parse(r.responseText));
        } else {
            // Call the error callback if anything went wrong, if one was given
            if (errorCallback != undefined) {
                errorCallback(r);
            }
        }
    });
}

/*************************************
 requestAlbum
 ------------
 Gets an album from the server
 *************************************/
function requestAlbum(id, callback, errorCallback) {
    serverRequest("data/library/albums/" + id + "/", function(r){
        if (r.status == 200) {
            callback(JSON.parse(r.responseText));
        } else {
            // Call the error callback if anything went wrong, if one was given
            if (errorCallback != undefined) {
                errorCallback(r);
            }
        }
    });
}

/*************************************
 requestArtistList
 ----------------
 Gets a list of artists from the server
 *************************************/
function requestArtistList(callback, errorCallback) {
    serverRequest("data/library/artists/", function(r){
        if (r.status == 200) {
            callback(JSON.parse(r.responseText));
        } else {
            // Call the error callback if anything went wrong, if one was given
            if (errorCallback != undefined) {
                errorCallback(r);
            }
        }
    });
}

/*************************************
 requestArtist
 ------------
 Gets an artist's tracks from the server
 *************************************/
function requestArtist(id, callback, errorCallback) {
    serverRequest("data/library/artists/" + id + "/", function(r){
        if (r.status == 200) {
            callback(JSON.parse(r.responseText));
        } else {
            // Call the error callback if anything went wrong, if one was given
            if (errorCallback != undefined) {
                errorCallback(r);
            }
        }
    });
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
    serverRequest("data/playlists/", function(r){
        if (r.status != 201) {
            errorCallback(r);
        } else {
            nav.updatePlaylists();
        }
    }, text);
}
