/********************************************************************
 * player.js - Functions for the media player part of the page
 ********************************************************************/
//TODO: Create an object to handle the sidebar?
//BUG: Chrome freaks out and becomes unresponsive if you play the last item
// in the queue. Untested on other browsers.


/* Classes
 **********/

/* Definition for the Queue class, which manages the current playlist.
 * The queue is basically a wrapper for an anonymous playlist that other
 * code uses to control the player. There should only be one instance
 * of the queue, because more than one doesn't make sense. If for some
 * reason you need more you should probably just use a regular playlist */
function Queue() {
    this.listControl = new ListViewControl();
    //TODO: see if there's an 'official' way of doing custom events in javascript
    this.listControl.onrowclicked = function(rowIndex) {
        queue.playItem(rowIndex);
    }
    dom.queue.appendChild(this.listControl.listElement);
    this.currentlyPlaying = null;   // null == nothing playing
}
    Queue.prototype.playItem = function( trackIndex ) {
        var track = this.playlist[trackIndex]
        dom.audio.src = track.url;
        // TODO: more detailed metadata display
        dom.meta.innerHTML = track.title;
        // Start playing
        dom.audio.play();
        // Update currently playing highlight
        this.listControl.highlightRow(parseInt(trackIndex));
        this.currentlyPlaying = parseInt(trackIndex);
    }
    Queue.prototype.setPlaylist = function( playlist ) {
        this.playlist = playlist;
    }
    Queue.prototype.updatePage = function() {
        this.listControl.clear();
        for (tracknum in this.playlist) {
            trackTitle = this.playlist[tracknum].title;
            this.listControl.appendRow(trackTitle, playlist[tracknum]);
        }
    }
    // Returns of list of selected track IDs
    Queue.prototype.getSelectedTracks = function() {
        // First get selected row indexes
        rows = this.listControl.getSelected();
        // Then get track IDs from it
        tracks = new Array();
        for (i in rows) {
            tracks.push(this.listControl.rowsExtra[rows[i]].id);
        }
        return tracks;
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
    queue.updatePage();
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
}

function populateLibrary(items) {
    var list = new ListViewControl();
    for (i in items) {
        trackTitle = items[i].title;
        list.appendRow(trackTitle);
    }
    clearElement(dom.library);
    dom.library.appendChild(list.listElement);
}

// Removes all children from a DOM element
function clearElement( node ) {
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
}

/* Init code 
 ************/
function playerInit() {
    // Build our DOM look up table
    bindElementList();
    
    // Instance the queue
    window.queue = new Queue();
    
    // Set up events
    dom.audio.addEventListener("ended", trackFinished, false);
    document.getElementById("savePlaylistButton").addEventListener("click",
        function(e){
            alert("<" + queue.getSelectedTracks() + ">");
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
