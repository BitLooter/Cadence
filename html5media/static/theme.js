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
        // Set bottom pane to take whatever height the player pane doesn't
        window.bottom.style.height = window.innerHeight - window.playerPane.offsetHeight + "px";
        
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
        nav.filterPane.style.visibility = "visible";
    }
    
    this.hideFiltersPane = function() {
        nav.filterPane.style.visibility = "hidden";
    }
}
