/********************************************************************
 * player.js - Functions for the media player part of the page
 ********************************************************************/

function populateQueue (tracklist) {
    var queuePane = document.getElementById("queue");
    var queueList = document.createElement("ul");
    for (tracknum in tracklist) {
        track = queue[tracknum];
        var trackItem = document.createElement("li");
        trackItem.setAttribute("onclick", "playTrack('" + track + "')");
        trackItem.appendChild(document.createTextNode(track));
        queueList.appendChild(trackItem);
    }
    queuePane.appendChild(queueList);
}

function requestPlaylist() {
    var request = new XMLHttpRequest();
    request.open("GET", "http://127.0.0.1:8000/data/getplaylist/", false);
    request.send(null);
    return JSON.parse(request.responseText);
}

function playTrack(url) {
    var playerPane = document.getElementById("player");
    playerPane.innerHTML = "<audio src=" + url + " type='audio/ogg' controls autoplay />";
    var playerMeta = document.getElementById("metadata");
    playerMeta.innerHTML = url;
}
