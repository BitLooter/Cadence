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
function Queue() { }
Queue.prototype.playItem = function( trackIndex ) {
    var url = this.playlist[trackIndex];
    var playerPane = document.getElementById("player");
    playerPane.innerHTML = "<audio src=" + url + " type='audio/ogg' controls autoplay />";
    var playerMeta = document.getElementById("metadata");
    playerMeta.innerHTML = url;
}
Queue.prototype.setPlaylist = function( playlist ) {
    this.playlist = playlist;
}
Queue.prototype.updatePage = function() {
    var queuePane = document.getElementById("queue");
    var queueList = document.createElement("ul");
    for (tracknum in this.playlist) {
        track = this.playlist[tracknum];
        var trackItem = document.createElement("li");
        trackItem.trackIndex = tracknum;
        trackItem.onclick = function(){
            queue.playItem(this.trackIndex);
            this.classList.add("currentlyPlaying");
        }
        trackItem.appendChild(document.createTextNode(track));
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


/* Init code 
 ************/
window.onload = function() {
    // Instance the queue
    window.queue = new Queue();
    
    // Get default playlist
    var playlist = requestPlaylist();
    queue.setPlaylist(playlist);
    
    // Display the queue on the page
    queue.updatePage();
}
