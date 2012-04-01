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
function TrackListManager(parent) {
    ListViewControl.call(this, parent);
    var headers = ["Title", "Length"];
    this.changeHeader(headers);
    // Default message for blank lists (an empty div, not attached to the DOM)
    this.emptyMessage = document.createElement("div");
    // clearTracks will reset things to a default state
    this.clearTracks();
}
    TrackListManager.prototype = Object.create(ListViewControl.prototype);
    // clearTracks() is like clear(), but also sets the playlist to an empty one
    TrackListManager.prototype.clearTracks = function() {
        this.setTracks([]);
    }
    TrackListManager.prototype.setTracks = function( tracks ) {
        this.tracks = tracks;
        this.clear();
        for (var i = 0; i < this.tracks.length; i++) {
            var trackTitle = this.tracks[i].title;
            this._appendTrackRow(tracks[i]);
        }
    }
    TrackListManager.prototype.appendTrack = function(track) {
        this.tracks.push(track);
        this._appendTrackRow(track);
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
    // -- Private functions -----------
    // Adds a row to the control with the track data
    TrackListManager.prototype._appendTrackRow = function(track) {
        this.appendRow([track.title, makeTimeStr(track.length)], track);
    }


/*************************************
 QueueManager
 ------------
 Definition for the Queue class, which manages the current playlist.
 The queue is basically a specialized subclass of a TrackListManager
 that adds methods for controlling the player and playlist management.
 *************************************/
function QueueManager() {
    TrackListManager.call(this, document.getElementById("queueContainer"));
    
    // - DOM elements
    // Root element
    this.element = document.getElementById("queuePane");
    
    // Header - contains title, subheading, and toolbar
    this.head = document.getElementById("queueHead");
    
    // Subheading (text node)
    var subheading = document.getElementById("queueSubheading");
    clearElement(subheading);
    this.subheadingNode = document.createTextNode("NO DATA");
    subheading.appendChild(this.subheadingNode);
    
    // Toolbar
    this.toolbar = new ToolbarControl(document.getElementById("queueToolbar"));
    this.toolbar.addButton("Save playlist", this._savePlaylistClicked);
    this.toolbar.addButton("Remove", this._removeItemClicked);
    
    // Set the parent to the outside container
    // this.parent = document.getElementById("queuePane")
    
    // Set up message for a blank queue
    this.emptyMessage = document.getElementById("queueBlankMessage");
    
    // Init important variables
    this.currentlyPlaying = null;   // null == nothing playing
    
    // Events
    player.audioElement.addEventListener("ended", this._trackFinished, false);
    this.listElement.addEventListener("rowclick", this._rowClicked, false);
}
    QueueManager.prototype = Object.create(TrackListManager.prototype);
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
            // If we're close to the beginning of the track, skip to the one before
            if (player.audioElement.currentTime < 5) {
                queue.playItem(queue.currentlyPlaying - 1);
            } else {
                player.stop();
                player.play();
            }
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
        e.listControl.playItem(e.row.rowIndex);
    }


/*************************************
 LibraryManager
 --------------
 Takes care of the library view on the page.
 *************************************/
function LibraryManager() {
    TrackListManager.call(this, document.getElementById("libraryContainer"));
    
    // - DOM elements
    // Root element
    this.element = document.getElementById("libraryPane");
    
    // Header - contains title, subheading, and toolbar
    this.head = document.getElementById("libraryHead");
    
    // Subheading (text node)
    var subheading = document.getElementById("librarySubheading");
    clearElement(subheading);
    this.subheadingNode = document.createTextNode("NO DATA");
    subheading.appendChild(this.subheadingNode);
    
    // Toolbar
    this.toolbar = new ToolbarControl(document.getElementById("libraryToolbar"));
    this.toolbar.addButton("Queue", this._queueEvent);
}
    LibraryManager.prototype = Object.create(TrackListManager.prototype);
    LibraryManager.prototype.populateAlbum = function(album) {
        library.subheadingNode.nodeValue = "Album: " + album.name;
        requestAlbum(album.id, function(t){library.setTracks(t)});
    }
    LibraryManager.prototype.populateArtist = function(artist) {
        library.subheadingNode.nodeValue = "Artist: " + artist.name;
        requestArtist(artist.id, function(t){library.setTracks(t)});
    }
    LibraryManager.prototype.populateAll = function() {
        requestLibraryItems(function(t){library.setTracks(t)});
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
    this.filterPane = document.getElementById("filterPane");
    // Filter title (text node)
    var titleElement = document.getElementById("filterTitle");
    clearElement(titleElement);
    this.filterTitleNode = document.createTextNode("");
    titleElement.appendChild(this.filterTitleNode);
    // Filter UL
    this.filterList = document.getElementById("filterList");
    
    // Fill data
    this.updatePlaylists();
    this.updateLibTree();
}
    // Updates the list of available playlists in the sidebar
    NavigationManager.prototype.updatePlaylists = function() {
        var lists = undefined;
        try {
            requestPlaylistList(function(l){lists = l});
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
        var albums = document.createElement("li");
        albums.appendChild(document.createTextNode("By album"));
        albums.addEventListener("click",
                                function(){nav.showFilterSelector(requestAlbumList,
                                                                  "Select an album",
                                                                  library.populateAlbum)},
                                false);
        this.libTree.appendChild(albums);
        var artists = document.createElement("li");
        artists.appendChild(document.createTextNode("By artist"));
        artists.addEventListener("click",
                                 function(){nav.showFilterSelector(requestArtistList,
                                                                   "Select an artist",
                                                                   library.populateArtist)},
                                 false);
        // artists.addEventListener("click", this._artistsClicked, false);
        this.libTree.appendChild(artists);
    }
    /* showFilterSelector
     *  Requests data from the server and uses it to display a list of filters
     *  Parameters:
     *   reqFunc        Function that gets the data to use
     *   message        Text to display in header of filter pane
     *   callback       Function to call when a filter item is clicked */
    NavigationManager.prototype.showFilterSelector = function(reqFunc, message, callback) {
        //TODO: properly disable library when the filter pane is up
        // library.disable();
        // Get list of albums from the server
        // items is expected to be an array of objects with name and id properties
        var items = undefined;
        reqFunc(function(a){items=a});
        // Fill out the filter list with them
        var filters = [];
        for (var i = 0; i < items.length; i++) {
            filters.push({"text": items[i].name, "data": items[i]});
        }
        nav._setFilters(message, filters, callback);
        theme.showFiltersPane();
    }
    // -- Events ---------
    NavigationManager.prototype._playlistClicked = function(e) {
        queue.disable("Loading playlist");
        //TODO: figure out why chrome refuses to show the overlay without some sort of delay here
        // alert("Make Chrome show overlay");
        try {
            requestPlaylist(e.currentTarget.playlistID, function(p){queue.setTracks(p)});
        } catch (error) {
            alert(error.message);
            throw error;
        }
        queue.enable();
    }
    // -- Private functions ----------
    /* _setFilters - fills out the filter pane with data
     *  title: Text that goes in the filter pane's header
     *  filters: List of objects containing text/data pairs for the list
     *  callback: Function that takes an argument that will contain a list item's data */
    NavigationManager.prototype._setFilters = function(title, filters, callback) {
        clearElement(this.filterList);
        this.filterTitleNode.nodeValue = title;
        for (var i = 0; i < filters.length; i++) {
            var filter = filters[i];
            var element = document.createElement("li");
            element.appendChild(document.createTextNode(filter.text));
            element.data = filter.data;
            element.addEventListener("click",
                                     function(e){callback(e.target.data);
                                                 theme.hideFiltersPane();},
                                     false);
            this.filterList.appendChild(element);
        }
    }


/*************************************
 PlayerManager
 -------------
 Code used to control the player, providing methods to play, stop, pause, etc.
 *************************************/
function PlayerManager() {
    // Get some common elements
    this.audioElement = document.createElement("audio"); // Does not need to be on the DOM
    this.titleElement = document.getElementById("playerTitle");
    this.artistElement = document.getElementById("playerArtist");
    this.albumElement = document.getElementById("playerAlbum");
    this.timeElement = document.getElementById("playerTime");
    this.lengthElement = document.getElementById("playerLength");
    this.metaElement = document.getElementById("metadata");
    this.coverElement = document.getElementById("playerCover");
    
    // Ready the controls
    this.controls = controlsHandler;
    this.controls.init();
    
    // Prepare metadata elements
    clearElement(this.titleElement);
    clearElement(this.artistElement);
    clearElement(this.albumElement);
    clearElement(this.timeElement);
    clearElement(this.lengthElement);
    this.titleText = document.createTextNode("");
    this.artistText = document.createTextNode("");
    this.albumText = document.createTextNode("");
    this.timeText = document.createTextNode("");
    this.lengthText = document.createTextNode("");
    this.titleElement.appendChild(this.titleText);
    this.artistElement.appendChild(this.artistText);
    this.albumElement.appendChild(this.albumText);
    this.timeElement.appendChild(this.timeText);
    this.lengthElement.appendChild(this.lengthText);
    
    // Set player to default state
    this.clearMeta();
    
    // Assign events
    this.audioElement.addEventListener("timeupdate", this.timeUpdate, false);
    //TODO: store these controls in controlsHandler
    document.getElementById("playerPlay").addEventListener("click", this.playClicked, false);
    document.getElementById("playerStop").addEventListener("click", this.stopClicked, false);
    document.getElementById("playerNext").addEventListener("click", this.nextClicked, false);
    document.getElementById("playerPrev").addEventListener("click", this.prevClicked, false);
    document.getElementById("playerMute").addEventListener("click", this.muteClicked, false);
    this.controls.scrubber.addEventListener("tracked", this.scrubberTracked, false);
}
    PlayerManager.prototype.setTrack = function(track) {
        this.track = track;
        clearElement(this.audioElement);
        // Set the audio tag's source. Scans through list and uses the first
        // compatible type; preferred order (e.g. transcodes last) is handled
        // server-side.
        for (var i = 0; i < track.sources.length; i++) {
            var source = track.sources[i];
            if (this.audioElement.canPlayType(source.mime))
            {
                this.audioElement.src = source.url;
                break;
            }
        }
        // Track metadata display
        this.titleText.nodeValue = track.title;
        this.artistText.nodeValue = track.artist;
        this.albumText.nodeValue = track.album;
        this.lengthText.nodeValue = makeTimeStr(track.length);
        if (track.poster != "") {
            this.coverElement.src = track.poster;
        } else {
            this.coverElement.src = "static/player/nocover.svg";
        }
    }
    PlayerManager.prototype.playTrack = function(track) {
        this.setTrack(track);
        this.play();
    }
    PlayerManager.prototype.stop = function() {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
    }
    PlayerManager.prototype.play = function() {
        //TODO: take a parameter indicating start position
        this.audioElement.play();
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
        player.timeText.nodeValue = makeTimeStr(e.target.currentTime);
        player.controls.updateScrubber(e.target.currentTime);
    }
    PlayerManager.prototype.scrubberTracked = function(e) {
        player.audioElement.currentTime = e.newTime;
    }
    PlayerManager.prototype.muteClicked = function(e) {
        player.audioElement.muted = player.audioElement.muted == false ? true : false;
    }
    // -- Private functions ----------