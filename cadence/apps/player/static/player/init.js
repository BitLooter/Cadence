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
    
    // Get default playlist (last viewed playlist)
    var playlistID = localStorage.getItem("default_playlist");
    // Only load a default playlist from the server if one defined
    if (playlistID !== null)
    {
        queue.loadPlaylist(playlistID);
    } //TODO: load a default default playist if one is configured
}

window.addEventListener("load", playerInit, false);
