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
    ListViewControl.apply(this, arguments);
    // clearPlaylist will reset things to a default state
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
    // Returns of list of selected track IDs
    TrackListControl.prototype.getSelectedTracks = function() {
        // First get selected row indexes
        selected = this.getSelected();
        // Then get track IDs from it
        tracks = new Array();
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
            trackTitle = this.tracks[tracknum].title;
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
    TrackListControl.apply(this, arguments);
    //TODO: see if there's an 'official' way of doing custom events in javascript
    this.onrowclicked = function(rowIndex) {
        this.playItem(rowIndex);
    }
    document.getElementById("queueContainer").appendChild(this.listElement);
    this.currentlyPlaying = null;   // null == nothing playing
}
    QueueControl.prototype = new TrackListControl();
    QueueControl.prototype.clearPlaylist = function() {
        this.setPlaylist(new Playlist());
    }
    QueueControl.prototype.setPlaylist = function( playlist ) {
        this.playlist = playlist;
        this.setTracks.call(this, playlist.tracks);
    }
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

function Playlist(tracks, name) {
    if (tracks == undefined) {
        tracks = [];
    }
    if (name == undefined) {
        name = "<Unnamed>";
    }
    this.tracks = tracks;
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
    window.dom = list;
}