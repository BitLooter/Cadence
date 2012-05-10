/*****************************************************************************
 * playercontrols.js
 * =================
 * Code dealing with the player input and output
 *****************************************************************************/

controlsHandler = {
    init: function(thePlayer) {
	    document.getElementById("playerPlay").addEventListener("click",
	    	function(){ player.togglePlay() }, false);
	    document.getElementById("playerStop").addEventListener("click",
	    	function(){ player.stop() }, false);
	    document.getElementById("playerNext").addEventListener("click",
	    	function(){ queue.playNext() }, false);
	    document.getElementById("playerPrev").addEventListener("click",
	    	function(){ queue.playPrev() }, false);
	    document.getElementById("playerMute").addEventListener("click",
	    	function(){ player.toggleMute() }, false);
	    
        this.scrubber = document.getElementById("playerScrubber");
        this._scrubberProgress = document.getElementById("playerScrubberProgress");
        this.scrubber.addEventListener("click", this.scrubberClicked, false);
	    this.scrubber.addEventListener("tracked", this.scrubberTracked, false);
    },
    updateScrubber: function(newTime) {
        this._scrubberProgress.style.width = ((newTime / player.track.length) * 100) + "%";
    },
    // -- Event handlers ---------
	scrubberTracked: function(e) {
		// Note that currentTime is read-only in Chrome with the Django dev server
        player.audioElement.currentTime = e.newTime;
    },
    scrubberClicked: function(e) {
        var event = document.createEvent("CustomEvent");
        event.initEvent("tracked", true, true);
        event.newTime = player.track.length * (e.offsetX/e.currentTarget.offsetWidth);
        player.controls.scrubber.dispatchEvent(event);
    } 
}
