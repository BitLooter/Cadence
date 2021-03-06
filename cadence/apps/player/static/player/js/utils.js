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

// Make an ajax request
function makeRequest(url, callback, post) {
    var request = new XMLHttpRequest();
    // Normally I prefer addEventListener to bind events, but it doesn't work
    // on Opera for an XMLHttpRequest object.
    request.onreadystatechange = function(evt) {
        if (this.readyState == 4) {
            callback(this);
        }
    };
    var method = (post == undefined ? "GET" : "POST");
    var csrftoken = getCookie("csrftoken");
    request.open(method, url, false);
    request.setRequestHeader("X-CSRFToken", csrftoken);
    request.send(post);
}

// Gets a cookie with the given name
function getCookie(name) {
    var cookies = document.cookie.split("; ");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].split("=");
        if (cookie[0].trim() == name) {
            return cookie[1];
        }
    }
    // If we made it this far, the cookie was not found
    return null;
}