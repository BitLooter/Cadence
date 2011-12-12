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
    makeRequest("data/playlist/"+id+"/", function(r){
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
    makeRequest("data/playlistlist/", function(r){
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
function requestLibraryItems(query, callback) {
    if (query == undefined) {
        query = "";
    }
    //TODO: better query system
    makeRequest("data/library/" + query, function(r){
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
