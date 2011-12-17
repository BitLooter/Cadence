/*****************************************************************************
 * playercontrols.js
 * =================
 * Code dealing with the player input and output
 *****************************************************************************/

controlsHandler = {
    init: function() {
        this.scrubber = document.getElementById("playerScrubber");
        this._scrubberProgress = document.getElementById("playerScrubberProgress");
        this.scrubber.addEventListener("click", this._scrubberClicked, false);
    },
    updateScrubber: function(newTime) {
        this._scrubberProgress.style.width = ((newTime / player.track.length) * 100) + "%";
    },
    // -- Event handlers ---------
    _scrubberClicked: function(e) {
        var event = document.createEvent("CustomEvent");
        event.initEvent("tracked", true, true);
        event.newTime = player.track.length * (e.offsetX/200);
        player.controls.scrubber.dispatchEvent(event);
    } 
}
