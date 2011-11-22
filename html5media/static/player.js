/********************************************************************
 * player.js - Functions for the media player part of the page
 ********************************************************************/
//TODO: Create an object to handle the sidebar?
//BUG: Chrome freaks out and becomes unresponsive if you play the last item
// in the queue. Untested on other browsers.


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

function requestLibraryItems() {
    var request = new XMLHttpRequest();
    //TODO: make asynchronous, check for errors
    request.open("GET", "http://localhost/html5media/data/libraryitems/", false);
    request.send(null);
    return JSON.parse(request.responseText);
}

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
    updatePlaylists();
}

function playlistClicked(e) {
    try {
        var playlist = requestPlaylist(e.target.playlistID);
    } catch (error) {
        alert(error.message);
        throw error;
    }
    queue.setPlaylist(playlist);
}

// Updates the list of available playlists in the sidebar
function updatePlaylists() {
    try {
        var lists = requestPlaylistList();
    } catch (error) {
        alert(error.message);
        throw error;
    }
    var plElement = document.getElementById("sbPlaylists");
    clearElement(plElement);
    for (var i in lists) {
        var listItem = document.createElement("a");
        listItem.appendChild(document.createTextNode(lists[i].name + " "));
        listItem.playlistID = lists[i].id;
        listItem.addEventListener("click", playlistClicked, false);
        //TODO: remove this line once we start styling things
        listItem.style.color = "blue";
        plElement.appendChild(listItem);
    }
}

function populateLibrary(items) {
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
    updatePlaylists();
    
    // Display the library
    //TODO: do not display library on init
    populateLibrary(requestLibraryItems());
    
    // Get default playlist
    //TODO: implement default playlist
}

window.addEventListener("load", playerInit, false);
