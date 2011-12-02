/********************************************************************
 * player.js - Functions for the media player part of the page
 ********************************************************************/


/* Init code 
 ************/
function playerInit() {
    // Build our DOM look up table
    bindElementList();
    
    // Instance the queue and other objects
    window.queue = new QueueManager();
    window.library = new LibraryManager();
    window.nav = new NavigationManager();
    window.player = new PlayerManager();
    
    // Display the library
    //TODO: do not display library on init
    library.populate();
    //populateLibrary(requestLibraryItems(""));
    
    // Get default playlist
    //TODO: implement default playlist
}

window.addEventListener("load", playerInit, false);
