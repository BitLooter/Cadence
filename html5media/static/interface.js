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
    this.clearPlaylist();
}
    TrackListControl.prototype = new ListViewControl();
    // clearPlaylist() is like clear(), but also sets the playlist to an empty one
    TrackListControl.prototype.clearPlaylist = function() {
        this.setPlaylist(new Playlist());
        this.clear();
    }
    TrackListControl.prototype.setPlaylist = function( playlist ) {
        this.playlist = playlist;
        //TODO: Probably better to set up the row information then call parent's _render
        this._render();
    }
    // Private methods --------------
    // Recreates every row
    TrackListControl.prototype._render = function() {
        this.clear();
        for (var tracknum in this.playlist.tracks) {
            trackTitle = this.playlist.tracks[tracknum].title;
            this.appendRow(trackTitle, this.playlist[tracknum]);
        }
    }

function Playlist() {
    this.tracks = [];
    this.name = "<Unnamed>";
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
