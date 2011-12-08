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
    player.audioElement.addEventListener("ended", this._trackFinished, false);
    this.listElement.addEventListener("rowclick", this._rowClicked, false);
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
        player.playTrack(this.tracks[trackIndex]);
        // Update currently playing highlight
        this.highlightRow(parseInt(trackIndex));
        this.currentlyPlaying = parseInt(trackIndex);
    }
    QueueManager.prototype.playNext = function( trackIndex ) {
        if (queue.currentlyPlaying < queue.tracks.length-1) {
            //TODO: vary behavior depending on options (autoplay off, shuffle, etc.)
            queue.playItem(queue.currentlyPlaying + 1);
        } else {
            // If it's at the end of the playlist, mark currentlyPlaying as such
            this.currentlyPlaying = null;
            this.highlightRow();
            // Stop playing, if a track is in progress
            player.clearMeta();
            player.stop();
        }
    }
    QueueManager.prototype.playPrev = function( trackIndex ) {
        if (queue.currentlyPlaying > 0) {
            //TODO: if too far into the track, skip to beginning instead of previous track
            queue.playItem(queue.currentlyPlaying - 1);
        } else {
            // If it's at the beginning of the playlist, play first track again
            queue.playItem(0);
        }
    }
    // -- Event handlers -----------
    QueueManager.prototype._savePlaylistClicked = function(e) {
        var name = prompt("Enter a name for the playlist:", "<Unnamed>");
        if (name != null) {
            try {
                savePlaylist(queue.tracks, name);
            } catch(error) {
                alert(error.message);
            }
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
        queue.playNext();
    }
    QueueManager.prototype._rowClicked = function(e) {
        // Subtract one here to correct for the header row
        e.listControl.playItem(e.row.rowIndex-1);
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
    // Set DOM elements
    this.libTree = document.getElementById("sbLibrary");
    
    // Fill data
    this.updatePlaylists();
    this.updateLibTree();
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
    // Updates the library catagories
    NavigationManager.prototype.updateLibTree = function() {
        clearElement(this.libTree);
        var albumHead = document.createElement("li");
        albumHead.appendChild(document.createTextNode("Albums"));
        this.libTree.appendChild(albumHead);
        var albums = requestAlbumList();
        //TODO: implement a treeview control
        var albumUL = document.createElement("ul");
        for (var album in albums) {
            var albumLI = document.createElement("li");
            albumLI.appendChild(document.createTextNode(albums[album].name));
            albumLI.albumID = albums[album].id;
            albumLI.addEventListener("click", this._libraryClicked, false);
            albumUL.appendChild(albumLI);
        }
        this.libTree.appendChild(albumUL);
    }
    // -- Events ---------
    NavigationManager.prototype._libraryClicked = function(e) {
        library.populate("?album=" + e.target.albumID);
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


/*************************************
 PlayerManager
 -------------
 Code used to control the player, providing methods to play, stop, pause, etc.
 *************************************/
function PlayerManager() {
    // Get some common elements
    this.audioElement = document.getElementById("playerAudio");
    this.titleElement = document.getElementById("playerTitle");
    this.artistElement = document.getElementById("playerArtist");
    this.albumElement = document.getElementById("playerAlbum");
    this.timeElement = document.getElementById("playerTime");
    this.lengthElement = document.getElementById("playerLength");
    this.metaElement = document.getElementById("metadata");
    
    // Prepare metadata elements
    clearElement(this.titleElement);
    clearElement(this.artistElement);
    clearElement(this.albumElement);
    clearElement(this.timeElement);
    clearElement(this.lengthElement);
    this.titleText = document.createTextNode();
    this.artistText = document.createTextNode();
    this.albumText = document.createTextNode();
    this.timeText = document.createTextNode();
    this.lengthText = document.createTextNode();
    this.titleElement.appendChild(this.titleText);
    this.artistElement.appendChild(this.artistText);
    this.albumElement.appendChild(this.albumText);
    this.timeElement.appendChild(this.timeText);
    this.lengthElement.appendChild(this.lengthText);
    
    // Set player to default state
    this.clearMeta();
    
    // Assign events
    this.audioElement.addEventListener("timeupdate", this.timeUpdate, false);
    document.getElementById("playerPlay").addEventListener("click", this.playClicked, false);
    document.getElementById("playerStop").addEventListener("click", this.stopClicked, false);
    document.getElementById("playerNext").addEventListener("click", this.nextClicked, false);
    document.getElementById("playerPrev").addEventListener("click", this.prevClicked, false);
    document.getElementById("playerMute").addEventListener("click", this.muteClicked, false);
}
    PlayerManager.prototype.playTrack = function(track) {
        this.audioElement.src = track.url;
        // TODO: more detailed metadata display
        // this.metaElement.innerText = track.title;
        // TODO: length from database, not the player
        this.titleText.nodeValue = track.title;
        this.artistText.nodeValue = track.artist;
        this.albumText.nodeValue = track.album;
        this.lengthText.nodeValue = this._makeTimeStr(track.length);
        this.audioElement.play();
    }
    PlayerManager.prototype.stop = function() {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
    }
    // Resets to player to a default state with no track loaded
    PlayerManager.prototype.clearMeta = function() {
        this.titleText.nodeValue = "Nothing playing";
        this.artistText.nodeValue = "--";
        this.albumText.nodeValue = "--";
        this.timeText.nodeValue = "-:--";
        this.lengthText.nodeValue = "-:--";
    }
    // -- Event handlers -----------
    PlayerManager.prototype.playClicked = function(e) {
        if (player.audioElement.paused) {
            player.audioElement.play();
        } else {
            player.audioElement.pause();
        }
    }
    PlayerManager.prototype.stopClicked = function(e) {
        player.stop();
    }
    PlayerManager.prototype.prevClicked = function(e) {
        queue.playPrev();
    }
    PlayerManager.prototype.nextClicked = function(e) {
        queue.playNext();
    }
    PlayerManager.prototype.timeUpdate = function(e) {
        player.timeText.nodeValue = player._makeTimeStr(e.target.currentTime);
    }
    PlayerManager.prototype.muteClicked = function(e) {
        player.audioElement.muted = player.audioElement.muted == false ? true : false;
    }
    // -- Private functions ----------
    PlayerManager.prototype._makeTimeStr = function(time) {
        minutes = Math.floor(time/60);
        // Round down so we don't get edge cases like 2:60
        seconds = Math.floor(time - minutes*60);
        return minutes + ":" + (seconds < 10 ? "0" + seconds.toString() : seconds.toString());
    }
