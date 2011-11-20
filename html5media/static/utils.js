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
