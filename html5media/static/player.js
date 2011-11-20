/********************************************************************
 * player.js - Functions for the media player part of the page
 ********************************************************************/
//TODO: Create an object to handle the sidebar?
//BUG: Chrome freaks out and becomes unresponsive if you play the last item
// in the queue. Untested on other browsers.


/* Functions
 ************/

function requestPlaylist(id) {
    var request = new XMLHttpRequest();
    //TODO: validate this data, security hole
    //TODO: make asynchronous, check for errors
    request.open("GET", "http://localhost/html5media/data/playlist/?id=" + id, false);
    request.send(null);
    return JSON.parse(request.responseText);
}

function requestPlaylistList() {
    var request = new XMLHttpRequest();
    //TODO: make asynchronous, check for errors
    request.open("GET", "http://localhost/html5media/data/playlistlist/", false);
    request.send(null);
    return JSON.parse(request.responseText);
}

function requestLibraryItems() {
    var request = new XMLHttpRequest();
    //TODO: make asynchronous, check for errors
    request.open("GET", "http://localhost/html5media/data/libraryitems/", false);
    request.send(null);
    return JSON.parse(request.responseText);
}

function playlistClicked(e) {
    var playlist = requestPlaylist(e.target.playlistID);
    queue.setPlaylist(playlist);
}

// Updates the list of available playlists in the sidebar
function updatePlaylists() {
    var lists = requestPlaylistList();
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

function savePlaylist(tracks, name) {
    var request = new XMLHttpRequest();
    var idList= [];
    for (i in tracks) {
        idList.push(tracks[i].id);
    }
    //TODO: make asynchronous, check for errors
    //TODO: use encodeURIComponent here
    //TODO: check to make sure data is cleaned here and on the server
    request.open("POST", "http://localhost/html5media/data/saveplaylist/", false);
    //TODO: probably better to send this as JSON, not form data
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.send("name=" + name + "&tracks=" + idList.join());
    //TODO: check response
    updatePlaylists();
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
            //TODO: this should add tracks, not replace the whole thing
            queue.setPlaylist(new Playlist(tracks));
        },
        false
    )
    document.getElementById("savePlaylistButton").addEventListener("click",
        function(e){
            name = prompt("Enter a name for the playlist:", "<Unnamed>");
            savePlaylist(queue.tracks, name);
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
