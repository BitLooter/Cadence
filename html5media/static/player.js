/********************************************************************
 * player.js - Functions for the media player part of the page
 ********************************************************************/
//TODO: Create an object to handle the sidebar?
//BUG: Chrome freaks out and becomes unresponsive if you play the last item
// in the queue. Untested on other browsers.


/* Classes
 **********/

/* Definition for the Queue class, which manages the current playlist.
 * The queue is basically a specialized subclass of a TrackListControl
 * that adds methods for controlling the player. */
function QueueControl() {
    TrackListControl.apply(this, arguments);
    //TODO: see if there's an 'official' way of doing custom events in javascript
    this.onrowclicked = function(rowIndex) {
        this.playItem(rowIndex);
    }
    document.getElementById("queueContainer").appendChild(this.listElement);
    this.currentlyPlaying = null;   // null == nothing playing
}
    QueueControl.prototype = new TrackListControl();
    QueueControl.prototype.playItem = function( trackIndex ) {
        var track = this.playlist.tracks[trackIndex];
        dom.audio.src = track.url;
        // TODO: more detailed metadata display
        dom.meta.innerHTML = track.title;
        // Start playing
        dom.audio.play();
        // Update currently playing highlight
        this.highlightRow(parseInt(trackIndex));
        this.currentlyPlaying = parseInt(trackIndex);
    }


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

// Called when a track is done playing and starts the next track
function trackFinished() {
    if (queue.currentlyPlaying < queue.playlist.length-1) {
        //TODO: vary behavior depending on options (autoplay off, shuffle, etc.)
        queue.playItem(queue.currentlyPlaying + 1);
    }
}

function playlistClicked(e) {
    playlist = requestPlaylist(e.target.playlistID);
    queue.setPlaylist(playlist);
}

// Updates the list of available playlists in the sidebar
function updatePlaylists() {
    lists = requestPlaylistList();
    plElement = document.getElementById("sbPlaylists");
    clearElement(plElement);
    for (i in lists) {
        listItem = document.createElement("a");
        listItem.appendChild(document.createTextNode(lists[i].name + " "));
        listItem.playlistID = lists[i].id;
        listItem.addEventListener("click", playlistClicked, false);
        //TODO: remove this line once we start styling things
        listItem.style.color = "blue";
        plElement.appendChild(listItem);
    }
}

function savePlaylist(tracks) {
    var request = new XMLHttpRequest();
    //TODO: make asynchronous, check for errors
    //TODO: use encodeURIComponent here
    request.open("POST", "http://localhost/html5media/data/saveplaylist/", false);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.send("tracks=" + tracks.join());
    //TODO: check response
    updatePlaylists();
}

function populateLibrary(items) {
    //TODO: aaaggh, globals BAD
    list = new ListViewControl();
    for (i in items) {
        trackTitle = items[i].title;
        list.appendRow(trackTitle, items[i]);
    }
    lib = document.getElementById("libraryContainer");
    clearElement(lib);
    lib.appendChild(list.listElement);
}


/* Init code 
 ************/
function playerInit() {
    // Build our DOM look up table
    bindElementList();
    
    // Instance the queue
    window.queue = new QueueControl();
    
    // Set up events
    dom.audio.addEventListener("ended", trackFinished, false);
    document.getElementById("queueButton").addEventListener("click",
        function(e){
            selected = list.getSelected();
            for (i in selected) {
                track = list.rowsExtra[selected[i]];
                queue.playlist.push(track);
                queue.updatePage();
            }
        },
        false
    )
    document.getElementById("savePlaylistButton").addEventListener("click",
        function(e){
            // name = prompt("Enter a name for the playlist:");
            p = [];
            //TODO: get a list comprehension working
            for (i in queue.playlist) {
                p.push(queue.playlist[i].id);
            }
            savePlaylist(p)
        },
        false
    )
    document.getElementById("removeButton").addEventListener("click",
        function(e){
            //BUG: it's skipping some items
            var items = queue.listControl.getSelected();
            for (i in items) {
                queue.playlist.splice(items[i], 1);
            }
            queue.updatePage();
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
    
    // Display the queue on the page
    // (only needed for default playlists, implement that first)
    //queue.updatePage();
}

window.addEventListener("load", playerInit, false);
