/********************************************************************
 * exceptions.js - Exceptions that can be raised by the code
 ********************************************************************/

/*************************************
 ServerPlaylistError
 -------------------
 Exception raised when an error is encountered getting a playlist from
 the server.
 
 Parameters:
  request
   XmlHttpRequest object related to the error
 *************************************/
function ServerPlaylistError(request) {
    this.request = request;
    this.message = request.responseText + "\n\nResponse code: " + request.status;
}

function ServerPlaylistListError(request) {
    this.request = request;
    this.message = "Error requesting playlists!\n\n" + request.responseText + "\n\nResponse code: " + request.status;
}
