/********************************************************************
 * player.js - Functions for the media player part of the page
 ********************************************************************/


/* Init code 
 ************/
function playerInit() {
    // Instance the queue and other objects
    window.player = new PlayerManager();
    window.queue = new QueueManager();
    window.library = new LibraryManager();
    window.nav = new NavigationManager();
    
    window.addEventListener("resize", theme.windowResized, false);
    theme.windowResized();
    
    // Display the library
    library.populateAll();
    
    // Get default playlist
    var playlistID = localStorage.getItem("last_playlist");
    if (playlistID === null) {
        // If no default playlist stored in the browser (e.g. first visit), use
        // the playlist specified in the settings.
        playlistID = DEFAULT_PLAYLIST;
    }
    // Only load a default playlist from the server if one defined
    if (playlistID !== null)
    {
        queue.loadPlaylist(playlistID);
    }
}

window.addEventListener("load", playerInit, false);
