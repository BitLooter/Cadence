/********************************************************************
 * serverdata.js - Functions for accessing data from the server
 ********************************************************************/


/* Functions
 ************/

/*************************************
 requestPlaylist
 ---------------
 Tries to recieve the playlist with the given id from the server.
 
 Exceptions raised: ServerPlaylistError
 *************************************/
function requestPlaylist(id, callback) {
    makeRequest("data/playlists/"+id+"/", function(r){
        if (r.status == 200) {
            var response = JSON.parse(r.responseText);
            var playlist = response.items;
            playlist.id = response.id;
            playlist.name = response.name;
            callback(playlist);
        } else {
            throw new ServerPlaylistError(r);
        }
    });
}

/*************************************
 requestPlaylistList
 -------------------
 Retrieves a list of playlists from the server
 
 Exceptions raised: ServerPlaylistListError
 *************************************/
function requestPlaylistList(callback) {
    makeRequest("data/playlists/", function(r){
        if (r.status == 200) {
            callback(JSON.parse(r.responseText));
        } else {
            throw new ServerPlaylistListError(r);
        }
    });
}

/*************************************
 requestLibraryItems
 -------------------
 Gets a list of media items in the library from the server
 *************************************/
function requestLibraryItems(callback) {
    makeRequest("data/library/", function(r){
        callback(JSON.parse(r.responseText));
    });
}

/*************************************
 requestAlbumList
 ----------------
 Gets a list of track's albums from the server
 *************************************/
function requestAlbumList(callback) {
    //TODO: more error handling
    makeRequest("data/library/albums/", function(r){
        callback(JSON.parse(r.responseText));
    });
}

/*************************************
 requestAlbum
 ------------
 Gets an album from the server
 *************************************/
function requestAlbum(id, callback) {
    //TODO: more error handling
    makeRequest("data/library/albums/" + id + "/", function(r){
        callback(JSON.parse(r.responseText));
    });
}

/*************************************
 requestArtistList
 ----------------
 Gets a list of artists from the server
 *************************************/
function requestArtistList(callback) {
    //TODO: more error handling
    makeRequest("data/library/artists/", function(r){
        callback(JSON.parse(r.responseText));
    });
}

/*************************************
 requestArtist
 ------------
 Gets an artist's tracks from the server
 *************************************/
function requestArtist(id, callback) {
    //TODO: more error handling
    makeRequest("data/library/artists/" + id + "/", function(r){
        callback(JSON.parse(r.responseText));
    });
}

/*************************************
 savePlaylist
 ------------
 Sends a playlist to the server to save there.
 
 Exceptions raised: ServerPlaylistError
 *************************************/
function savePlaylist(tracks, name) {
    var request = new XMLHttpRequest();
    var idList = [];
    for (var i = 0; i < tracks.length; i++) {
        idList.push(parseInt(tracks[i].id));
    }
    var text = JSON.stringify({"name": name, "tracks": idList});
    makeRequest("data/saveplaylist/", function(r){
        if (r.status != 201) {
            throw new ServerPlaylistError(r);
        }
        nav.updatePlaylists();
    }, text);
}