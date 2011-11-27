/********************************************************************
 * player.js - Functions for the media player part of the page
 ********************************************************************/
//TODO: Create an object to handle the sidebar?


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
    return JSON.parse(request.responseText);
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
    //TODO: better query system
    var request = new XMLHttpRequest();
    //TODO: make asynchronous, check for errors
    request.open("GET", "http://localhost/html5media/data/libraryitems/" + query, false);
    request.send(null);
    return JSON.parse(request.responseText);
}

//TODO: move savePlaylist to a QueueControl method?
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

function populateLibrary(items) {
    library.clearTracks()
    for (i in items) {
        library.appendRow(items[i].title, items[i]);
    }
}


/* Init code 
 ************/
function playerInit() {
    // Build our DOM look up table
    bindElementList();
    
    // Instance the queue and other objects
    window.queue = new QueueControl();
    window.library = new TrackListControl();
    document.getElementById("libraryContainer").appendChild(library.listElement);
    
    // Set up events
    document.getElementById("queueButton").addEventListener("click",
        function(e){
            tracks = library.getSelectedTracks();
            for (var i in tracks) {
                queue.appendTrack(tracks[i]);
            }
        },
        false
    )
    document.getElementById("savePlaylistButton").addEventListener("click",
        function(e){
            name = prompt("Enter a name for the playlist:", "<Unnamed>");
            try {
                savePlaylist(queue.tracks, name);
            } catch(error) {
                alert(error.message);
            }
        },
        false
    )
    document.getElementById("removeButton").addEventListener("click",
        function(e){
            var items = queue.getSelected().reverse();
            for (i in items) {
                queue.deleteItem(items[i]);
            }
        },
        false
    )
    
    // Set up the sidebar
    window.nav = new NavigationManager();
    
    // Display the library
    //TODO: do not display library on init
    populateLibrary(requestLibraryItems(""));
    
    // Get default playlist
    //TODO: implement default playlist
}

window.addEventListener("load", playerInit, false);
