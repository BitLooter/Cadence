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
    
    // Display the library
    //TODO: do not display library on init
    library.populateAll();
    
    // Get default playlist
    //TODO: implement default playlist
}

window.addEventListener("load", playerInit, false);
