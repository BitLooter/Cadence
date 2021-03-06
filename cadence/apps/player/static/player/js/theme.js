/* ***************************************************************************
 * interfacecontroller.js
 * ======================
 * Code specific to the current skin goes here
 *****************************************************************************/


var theme = new function() {
    /* windowResized
     *  Resizes window elements to appropriates sizes. CSS is insufficient for
     *  our purposes, some JS is needed to make things fit right. Should be
     *  called on load and resize events. */
    this.windowResized = function() {
        // Give the player scrubber as much room as the other elements don't take
        player.controls.scrubber.style.width =
            window.innerWidth - player.coverElement.offsetWidth*2 + "px";
        
        // Set bottom pane to take whatever height the player pane doesn't
        document.getElementById("bottom").style.height =
            window.innerHeight - document.getElementById("playerPane").offsetHeight + "px";
        
        // Queue and library panes should have the list take up exactly how
        // much is left over from the headers and toolbars.
        library.listElement.style.height = library.element.offsetHeight -
                                           library.head.offsetHeight -
                                           library.listHead.offsetHeight + "px";
        library.fixWidths();
        queue.listElement.style.maxHeight = queue.element.offsetHeight -
                                            queue.head.offsetHeight -
                                            queue.listHead.offsetHeight + "px";
        queue.fixWidths();
    }
    
    this.showFiltersPane = function() {
        nav.filterPane.style.display = "block";
        library.disable();
    }
    
    this.hideFiltersPane = function() {
        nav.filterPane.style.display = "none";
        library.enable();
    }
}
