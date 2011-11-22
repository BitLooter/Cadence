/*****************************************************************************
 * inteface.js
 * ===========
 * Classes and functions relating to the media player interface.
 *****************************************************************************/

/* Classes
 **********/

/*************************************
 TrackListControl
 ----------------
 Specialized version of a ListViewControl made to display media items - 
 specifically, playlists. May be subclassed, e.g. the queue makes use of
 a subclass of this to add queue control functionality.
 *************************************/
function TrackListControl() {
    ListViewControl.call(this);
    var headers = ["Title"];
    this.changeHeader(headers);
    // clearTracks will reset things to a default state
    this.clearTracks();
}
    TrackListControl.prototype = new ListViewControl();
    // clearPlaylist() is like clear(), but also sets the playlist to an empty one
    TrackListControl.prototype.clearTracks = function() {
        this.setTracks([]);
    }
    TrackListControl.prototype.setTracks = function( tracks ) {
        this.tracks = tracks;
        //TODO: Probably better to set up the row information then call parent's _render
        this._render();
    }
    TrackListControl.prototype.appendTrack = function(track) {
        this.tracks.push(track);
        this.appendRow(track.title, track);
    }
    // Returns of list of selected track IDs
    TrackListControl.prototype.getSelectedTracks = function() {
        // First get selected row indexes
        var selected = this.getSelected();
        // Then get track IDs from it
        var tracks = new Array();
        for (i in selected) {
            tracks.push(this.rows[selected[i]].extra);
        }
        return tracks;
    }
    // Extends base class to also remove the item from the track list
    TrackListControl.prototype.deleteItem = function(index) {
        this.tracks.splice(index, 1);
        ListViewControl.prototype.deleteItem.call(this, index);
    }
    // Private methods --------------
    // Recreates every row
    TrackListControl.prototype._render = function() {
        this.clear();
        for (var tracknum in this.tracks) {
            var trackTitle = this.tracks[tracknum].title;
            this.appendRow(trackTitle, this.tracks[tracknum]);
        }
    }

/*************************************
 QueueControl
 ------------
 Definition for the Queue class, which manages the current playlist.
 The queue is basically a specialized subclass of a TrackListControl
 that adds methods for controlling the player and playlist management.
 *************************************/
function QueueControl() {
    TrackListControl.call(this);
    this.currentlyPlaying = null;   // null == nothing playing
    // Events
    page.audio.addEventListener("ended", this.trackFinished, false);
    this.listElement.addEventListener("rowclick", function(e) {
        // Subtract one here to correct for the header row
        e.listControl.playItem(e.row.rowIndex-1);
    }, false);
    // Stick it in the DOM
    document.getElementById("queueContainer").appendChild(this.listElement);
}
    QueueControl.prototype = new TrackListControl();
    QueueControl.prototype.clearPlaylist = function() {
        this.setPlaylist(new Playlist());
    }
    QueueControl.prototype.setPlaylist = function( playlist ) {
        this.playlist = playlist;
        this.setTracks(playlist.items);
    }
    QueueControl.prototype.playItem = function( trackIndex ) {
        var track = this.playlist.items[trackIndex];
        page.audio.src = track.url;
        // TODO: more detailed metadata display
        page.meta.innerHTML = track.title;
        // Start playing
        page.audio.play();
        // Update currently playing highlight
        this.highlightRow(parseInt(trackIndex));
        this.currentlyPlaying = parseInt(trackIndex);
    }
    // Event handlers -----------
    QueueControl.prototype.trackFinished = function(e) {
        if (queue.currentlyPlaying < queue.tracks.length-1) {
            //TODO: vary behavior depending on options (autoplay off, shuffle, etc.)
            queue.playItem(queue.currentlyPlaying + 1);
        }
    }

function Playlist(items, name) {
    if (items == undefined) {
        items = [];
    }
    if (name == undefined) {
        name = "<Unnamed>";
    }
    this.items = items;
    this.name = name;
}

/* Functions
 ************/

// Helper function that gets called at page load and builds a LUT for DOM elements
function bindElementList() {
    list = new Object();
    
    list.queue =   document.getElementById("queuePane");
    list.sidebar = document.getElementById("sidebarPane");
    list.library = document.getElementById("libraryPane");
    list.audio =   document.getElementById("audioPlayer");
    list.meta =    document.getElementById("metadata");
    
    // Place it in the global namespace for easy access
    window.page = list;
}
