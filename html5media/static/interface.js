/*****************************************************************************
 * inteface.js
 * ===========
 * Classes and functions relating to the media player interface.
 *****************************************************************************/

/* Classes
 **********/

/*************************************
 TrackListManager
 ----------------
 Specialized version of a ListViewControl made to display media items - 
 specifically, playlists. May be subclassed, e.g. the queue makes use of
 a subclass of this to add queue control functionality.
 *************************************/
function TrackListManager() {
    ListViewControl.call(this);
    var headers = ["Title"];
    this.changeHeader(headers);
    // clearTracks will reset things to a default state
    this.clearTracks();
}
    TrackListManager.prototype = new ListViewControl();
    // clearTracks() is like clear(), but also sets the playlist to an empty one
    TrackListManager.prototype.clearTracks = function() {
        this.setTracks([]);
    }
    TrackListManager.prototype.setTracks = function( tracks ) {
        this.tracks = tracks;
        //TODO: Probably better to set up the row information then call parent's _render
        this._render();
    }
    TrackListManager.prototype.appendTrack = function(track) {
        this.tracks.push(track);
        this.appendRow(track.title, track);
    }
    // Returns of list of selected track IDs
    TrackListManager.prototype.getSelectedTracks = function() {
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
    TrackListManager.prototype.deleteItem = function(index) {
        this.tracks.splice(index, 1);
        ListViewControl.prototype.deleteItem.call(this, index);
    }
    // Private methods --------------
    // Recreates every row
    TrackListManager.prototype._render = function() {
        this.clear();
        for (var i = 0; i < this.tracks.length; i++) {
            var trackTitle = this.tracks[i].title;
            this.appendRow(trackTitle, this.tracks[i]);
        }
    }

/*************************************
 QueueManager
 ------------
 Definition for the Queue class, which manages the current playlist.
 The queue is basically a specialized subclass of a TrackListManager
 that adds methods for controlling the player and playlist management.
 *************************************/
function QueueManager() {
    TrackListManager.call(this);
    this.currentlyPlaying = null;   // null == nothing playing
    // Set up toolbar
    this.toolbar = new ToolbarControl(document.getElementById("queueToolbar"));
    this.toolbar.addButton("Save playlist", this._savePlaylistClicked);
    this.toolbar.addButton("Remove", this._removeItemClicked);
    // Events
    page.audio.addEventListener("ended", this._trackFinished, false);
    this.listElement.addEventListener("rowclick", function(e) {
        // Subtract one here to correct for the header row
        e.listControl.playItem(e.row.rowIndex-1);
    }, false);
    // Stick it in the DOM
    document.getElementById("queueContainer").appendChild(this.listElement);
}
    QueueManager.prototype = new TrackListManager();
    QueueManager.prototype.setTracks = function( tracks ) {
        // We need to do some extra queue management when we set a playlist
        TrackListManager.prototype.setTracks.call(this, tracks);
        // Set up the queue so the first item starts playing after the current
        // track - but only if something is playing
        if (this.currentlyPlaying != null) {
            this.currentlyPlaying = -1;
        }
    }
    QueueManager.prototype.playItem = function( trackIndex ) {
        var track = this.tracks[trackIndex];
        page.audio.src = track.url;
        // TODO: more detailed metadata display
        page.meta.innerHTML = track.title;
        // Start playing
        page.audio.play();
        // Update currently playing highlight
        this.highlightRow(parseInt(trackIndex));
        this.currentlyPlaying = parseInt(trackIndex);
    }
    // -- Event handlers -----------
    QueueManager.prototype._savePlaylistClicked = function(e) {
        var name = prompt("Enter a name for the playlist:", "<Unnamed>");
        try {
            savePlaylist(queue.tracks, name);
        } catch(error) {
            alert(error.message);
        }
    }
    QueueManager.prototype._removeItemClicked = function(e) {
        // Process the list in reverse, because indexes change when we remove items
        var items = queue.getSelected().reverse();
        for (i in items) {
            queue.deleteItem(items[i]);
        }
    }
    QueueManager.prototype._trackFinished = function(e) {
        if (queue.currentlyPlaying < queue.tracks.length-1) {
            //TODO: vary behavior depending on options (autoplay off, shuffle, etc.)
            queue.playItem(queue.currentlyPlaying + 1);
        } else {
            // If it's at the end of the playlist, mark currentlyPlaying as such
            queue.currentlyPlaying = null;
            queue.highlightRow();
        }
    }


/*************************************
 LibraryManager
 --------------
 Takes care of the library view on the page.
 *************************************/
function LibraryManager() {
    TrackListManager.call(this);
    // Stick it in the DOM
    document.getElementById("libraryContainer").appendChild(this.listElement);
    this.toolbar = new ToolbarControl(document.getElementById("libraryToolbar"));
    this.toolbar.addButton("Queue", this._queueEvent);
}
    LibraryManager.prototype = new TrackListManager();
    LibraryManager.prototype.populate = function(query) {
        //TODO: better query system
        items = requestLibraryItems(query);
        this.setTracks(items)
    }
    // -- Event handlers ----------
    LibraryManager.prototype._queueEvent = function(e) {
        // Find all selected tracks and stick them on the queue
        tracks = library.getSelectedTracks();
        for (var i in tracks) {
            queue.appendTrack(tracks[i]);
        }
    }
    


/*************************************
 NavigationManager
 -----------------
 Handles sidebar tasks, such as the available playlists, library access, links,
 and other navigation elements.
 *************************************/
function NavigationManager() {
    this.updatePlaylists();
    //TODO: replace this hardcoded data
    var libList = document.getElementById("sbLibrary");
    libList.innerHTML = "<li onclick='javascript: nav._libraryClicked()'>Mirror</li>"
}
    // Updates the list of available playlists in the sidebar
    NavigationManager.prototype.updatePlaylists = function() {
        try {
            var lists = requestPlaylistList();
        } catch (error) {
            alert(error.message);
            throw error;
        }
        var plElement = document.getElementById("sbPlaylists");
        clearElement(plElement);
        for (var i in lists) {
            var listItem = document.createElement("li");
            var linkItem = document.createElement("a");
            linkItem.appendChild(document.createTextNode(lists[i].name));
            listItem.appendChild(linkItem);
            listItem.playlistID = lists[i].id;
            listItem.addEventListener("click", this._playlistClicked, false);
            //TODO: remove this line once we start styling things
            listItem.style.color = "blue";
            plElement.appendChild(listItem);
        }
    }
    // -- Events ---------
    NavigationManager.prototype._libraryClicked = function(e) {
        library.populate("?album=1");
    }
    NavigationManager.prototype._playlistClicked = function(e) {
        try {
            var playlist = requestPlaylist(e.currentTarget.playlistID);
        } catch (error) {
            alert(error.message);
            throw error;
        }
        queue.setTracks(playlist);
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
