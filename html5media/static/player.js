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
        if (this.currentlyPlaying != null) {
            this.listElements[this.currentlyPlaying].classList.remove("currentlyPlaying");
        }
        this.listElements[trackIndex].classList.add("currentlyPlaying");
        this.currentlyPlaying = parseInt(trackIndex);
    }
    Queue.prototype.setPlaylist = function( playlist ) {
        this.playlist = playlist;
    }
    Queue.prototype.updatePage = function() {
        this.listControl.clear();
        // var list = new ListViewControl();
        for (tracknum in this.playlist) {
            trackTitle = this.playlist[tracknum].title;
            this.listControl.appendRow(trackTitle)
        }
    }


/* Functions
 ************/

function requestPlaylist(playlistName) {
    var request = new XMLHttpRequest();
    //TODO: validate this data, security hole
    //TODO: make asynchronous, check for errors
    request.open("GET", "http://localhost/html5media/data/getplaylist/?name=" + playlistName, false);
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

// Called when a track is done playing and starts the next track
function trackFinished() {
    if (queue.currentlyPlaying < queue.playlist.length-1) {
        //TODO: vary behavior depending on options (autoplay off, shuffle, etc.)
        queue.playItem(queue.currentlyPlaying + 1);
    }
}

// Fills the queue with a named playlist
function queuePlaylist( playlistName ) {
    playlist = requestPlaylist(playlistName);
    queue.setPlaylist(playlist);
    queue.updatePage();
}

// Updates the list of available playlists in the sidebar
function updatePlaylists() {
    lists = requestPlaylistList();
    //TODO: this only works when only playlists are here, play nice and don't blow things away
    clearElement(dom.sidebar);
    //TODO: really ugly hack resulting from me doing this at 10:30 at night, use the DOM
    newHTML = ""
    for (i in lists) {
        newHTML += '<a href="javascript: queuePlaylist(\'' + lists[i] + '\')">' + lists[i] + '</a> ';
    }
    dom.sidebar.innerHTML = newHTML;
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
    
    // Sent up events
    dom.audio.addEventListener("ended", trackFinished, false);
    
    // Set up the sidebar
    updatePlaylists();
    
    // Get default playlist
    //TODO: implement default playlist
    
    // Display the queue on the page
    // (only needed for default playlists, implement that first)
    //queue.updatePage();
}

window.addEventListener("load", playerInit, false);
