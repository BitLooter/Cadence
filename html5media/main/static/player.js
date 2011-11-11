/********************************************************************
 * player.js - Functions for the media player part of the page
 ********************************************************************/


/* Classes
 **********/

/* Definition for the Queue class, which manages the current playlist.
 * The queue is basically a specialized, anonymous playlist that other
 * code uses to control the player. There should only be one instance
 * of the queue, because more than one doesn't make sense. If for some
 * reason you need more you should probably just use a regular playlist */
function Queue() {
    this.currentlyPlaying = null;
}
    Queue.prototype.playItem = function( trackIndex ) {
        var url = this.playlist[trackIndex];
        var player = document.getElementById("audioPlayer");
        player.src = url;
        player.play();
        var playerMeta = document.getElementById("metadata");
        playerMeta.innerHTML = url;
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
        var queueList = document.createElement("ul");
        for (tracknum in this.playlist) {
            track = this.playlist[tracknum];
            var trackItem = document.createElement("li");
            trackItem.trackIndex = tracknum;
            trackItem.onclick = function(){
                queue.playItem(this.trackIndex);
            }
            this.listElements.push(trackItem);
            trackItem.appendChild(document.createTextNode(unescape(track.replace("/static/", ""))));
            queueList.appendChild(trackItem);
        }
        queuePane.appendChild(queueList);
    }


/* Functions
 ************/

function requestPlaylist() {
    var request = new XMLHttpRequest();
    request.open("GET", "http://127.0.0.1:8000/data/getplaylist/", false);
    request.send(null);
    return JSON.parse(request.responseText);
}

// Called when a track is done playing and starts the next track
function trackFinished() {
    if (queue.currentlyPlaying < queue.playlist.length) {
        //TODO: vary behavior depending on options (autoplay off, shuffle, etc.)
        queue.playItem(queue.currentlyPlaying + 1);
    }
}


/* Init code 
 ************/
window.onload = function() {
    // Instance the queue
    window.queue = new Queue();
    
    // Sent up events
    document.getElementById("audioPlayer").onended = trackFinished;
    
    // Get default playlist
    var playlist = requestPlaylist();
    queue.setPlaylist(playlist);
    
    // Display the queue on the page
    queue.updatePage();
}
