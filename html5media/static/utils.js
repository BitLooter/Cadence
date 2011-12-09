/*****************************************************************************
 * utils.js
 * ========
 * Assorted code that doesn't fit anywhere else
 *****************************************************************************/


// Removes all children from a DOM element
function clearElement( node ) {
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
}

// Sends a click event to an element
function simulateClick(element) {
    var e = document.createEvent("MouseEvents");
    e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    element.dispatchEvent(e);
}

// Converts a time in seconds to x:xx format
function makeTimeStr(time) {
    var minutes = Math.floor(time/60);
    // Round down so we don't get edge cases like 2:60
    var seconds = Math.floor(time - minutes*60);
    return minutes + ":" + (seconds < 10 ? "0" + seconds.toString() : seconds.toString());
}
