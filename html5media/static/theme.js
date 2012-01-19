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
        // Queue and library panes should have the list take up exactly how
        // much is left over from the headers and toolbars.
        library.listBody.style.height = library.element.offsetHeight -
                                        library.head.offsetHeight -
                                        library.listHead.offsetHeight + "px";
        queue.listBody.style.maxHeight = queue.element.offsetHeight -
                                         queue.head.offsetHeight -
                                         queue.listHead.offsetHeight + "px";
    }
    
    this.showFiltersPane = function() {
        nav.filterPane.style.visibility = "visible";
    }
    
    this.hideFiltersPane = function() {
        nav.filterPane.style.visibility = "hidden";
    }
}