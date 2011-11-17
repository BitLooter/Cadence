/* Classes
 **********/

function ListViewControl() {
    //TODO: handle indexes better once insertion and deletion are added
    this.listElement = document.createElement("ul");
    // Put a reference here so we can get to it from event handlers
    this.listElement.listControl = this;
    this.rows = [];
    this.rowElements = [];
    this.currentHighlight = null;
}
    ListViewControl.prototype.appendRow = function(rowData) {
        // rowData is an array containing all the columns for a row
        rowElement = this._createRow(rowData);
        rowElement.index = this.rows.length;
        this.listElement.appendChild(rowElement);
        this.rows.push( rowData );
        this.rowElements.push( rowElement );
    }
    // Delete all the rows, reset it to before data was added
    ListViewControl.prototype.clear = function() {
        this.rows = [];
        this.render();
    }
    // Generates the DOM tree from the list's data
    //TODO: is this function even needed?
    ListViewControl.prototype.render = function() {
        clearElement(this.listElement);
        this.rowElements = [];
        for (index in this.rows) {
            row = this.rows[index];
            rowElement = this._createRow(row);
            rowElement.index = index;
            this.rowElements.push(rowElement);
        }
    }
    // Highlights a specific row
    ListViewControl.prototype.highlightRow = function(index) {
        //TODO: rename currentlyPlaying when CSS rules are added to the control
        // Only one row can be highlighted
        if (this.currentHighlight != null) {
            this.rowElements[this.currentHighlight].classList.remove("currentlyPlaying");
        }
        this.rowElements[index].classList.add("currentlyPlaying");
        this.currentHighlight = index;
    }
    /// Private functions --------------
    ListViewControl.prototype._handleRowClick = function(e) {
        if (e.target.parentNode.listControl != undefined) {
            e.target.parentNode.listControl.onrowclicked(e.target.index);
        }
    }
    ListViewControl.prototype._createRow = function(data) {
        element = document.createElement("li");
        element.appendChild(document.createTextNode(data));
        element.data = data;
        element.addEventListener("click", this._handleRowClick, false);
        return element;
    }

/* Functions
 ************/

// Helper function that gets called at page load and builds a LUT for DOM elements
function bindElementList() {
    list = new Object();
    
    list.queue =   document.getElementById("queuePane");
    list.sidebar = document.getElementById("sidebarPane");
    list.audio =   document.getElementById("audioPlayer");
    list.meta =    document.getElementById("metadata");
    
    // Place it in the global namespace for easy access
    window.dom = list;
}
