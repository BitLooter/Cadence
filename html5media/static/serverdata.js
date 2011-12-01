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
function requestPlaylist(id) {
    var request = new XMLHttpRequest();
    //TODO: make asynchronous
    request.open("GET", "http://localhost/html5media/data/playlist/?id=" + id, false);
    request.send(null);
    if (request.status != 200) {
        throw new ServerPlaylistError(request);
    }
    response = JSON.parse(request.responseText);
    playlist = response.items;
    playlist.id = response.id;
    playlist.name = response.name;
    return playlist;
}

function requestPlaylistList() {
    var request = new XMLHttpRequest();
    //TODO: make asynchronous, check for errors
    request.open("GET", "http://localhost/html5media/data/playlistlist/", false);
    request.send(null);
    if (request.status != 200) {
        throw new ServerPlaylistListError(request);
    }
    return JSON.parse(request.responseText);
}

function requestLibraryItems(query) {
    if (query == undefined) {
        query = "";
    }
    //TODO: better query system
    var request = new XMLHttpRequest();
    //TODO: make asynchronous, check for errors
    request.open("GET", "http://localhost/html5media/data/libraryitems/" + query, false);
    request.send(null);
    return JSON.parse(request.responseText);
}

/*************************************
 savePlaylist
 ------------
 Sends a playlist to the server to save there.
 
 Exceptions raised: ServerPlaylistError
 *************************************/
function savePlaylist(tracks, name) {
    var request = new XMLHttpRequest();
    var idList= [];
    for (i in tracks) {
        idList.push(parseInt(tracks[i].id));
    }
    text = JSON.stringify({"name": name, "tracks": idList});
    //TODO: make asynchronous
    request.open("POST", "http://localhost/html5media/data/saveplaylist/", false);
    request.send(text);
    if (request.status != 201) {
        throw new ServerPlaylistError(request);
    }
    nav.updatePlaylists();
}
