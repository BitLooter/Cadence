/********************************************************************
 * player.js - Functions for the media player part of the page
 ********************************************************************/
//TODO: Cache commonly used DOM nodes
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
    this.currentlyPlaying = null;   // null == nothing playing
}
    Queue.prototype.playItem = function( trackIndex ) {
        var track = this.playlist[trackIndex]
        var player = document.getElementById("audioPlayer");
        player.src = track.url;
        // TODO: more detailed metadata display
        var playerMeta = document.getElementById("metadata");
        playerMeta.innerHTML = track.title;
        // Start playing
        player.play();
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
        // listElements is used to associate playlist items with DOM elements
        this.listElements = [];
        var queuePane = document.getElementById("queue");
        clearElement(queuePane);
        var queueList = document.createElement("ul");
        for (tracknum in this.playlist) {
            trackTitle = this.playlist[tracknum].title;
            var trackItem = document.createElement("li");
            trackItem.trackIndex = tracknum;
            trackItem.onclick = function(){
                queue.playItem(this.trackIndex);
            }
            this.listElements.push(trackItem);
            trackItem.appendChild(document.createTextNode(unescape(trackTitle)));
            queueList.appendChild(trackItem);
        }
        queuePane.appendChild(queueList);
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

// Removes all children from a DOM element
function clearElement( node ) {
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
}

/* Init code 
 ************/
function playerInit() {
    // Instance the queue
    window.queue = new Queue();
    
    // Sent up events
    document.getElementById("audioPlayer").addEventListener("ended", trackFinished, false);
    
    // Get default playlist
    //TODO: implement default playlist
    
    // Display the queue on the page
    // (only needed for default playlists, implement that first)
    //queue.updatePage();
}

window.addEventListener("load", playerInit, false);
