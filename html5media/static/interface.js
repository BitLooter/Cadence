/* Classes
 **********/

function ListViewControl() {
    //TODO: handle indexes better once insertion and deletion are added
    this.listElement = document.createElement("ul");
    // Put a reference here so we can get to it from event handlers
    this.listElement.listControl = this;
    this.rows = [];
}
    ListViewControl.prototype.appendRow = function(rowData) {
        // rowData is an array containing all the columns for a row
        rowElement = this._createRow(rowData);
        rowElement.index = this.rows.length;
        this.listElement.appendChild(rowElement);
        this.rows.push( rowData );
    }
    // Delete all the rows, reset it to before data was added
    ListViewControl.prototype.clear = function() {
        this.rows = [];
        this.render();
    }
    // Generates the DOM tree from the list's data
    ListViewControl.prototype.render = function() {
        clearElement(this.listElement);
        for (index in this.rows) {
            row = this.rows[index];
            rowElement = this._createRow(row);
            rowElement.index = index;
        }
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
