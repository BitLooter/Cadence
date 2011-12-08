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
