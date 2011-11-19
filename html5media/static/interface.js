/* Classes
 **********/

function ListViewControl() {
    //TODO: handle indexes better once insertion and deletion are added
    this.listElement = document.createElement("table");
    // Put a reference here so we can get to it from event handlers
    this.listElement.listControl = this;
    this.rows = [];
    this.rowsExtra = [];
    this.rowElements = [];
    this.currentHighlight = null;
}
    ListViewControl.prototype.appendRow = function(rowData, rowExtra) {
        // rowData is an array containing all the columns for a row
        rowElement = this._createRow(rowData);
        rowElement.index = this.rows.length;
        this.listElement.appendChild(rowElement);
        this.rows.push( rowData );
        if (rowExtra != undefined) {
            this.rowsExtra.push(rowExtra);
        }
        else {
            this.rowsExtra.push(null);
        }
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
    ListViewControl.prototype.getSelected = function() {
        //TODO: we can probably speed this up by handling click events
        var checkedList = new Array();
        for (i in this.rowElements) {
            var element = this.rowElements[i];
            // Checkbox will be the first input element in the row
            var checkbox = element.getElementsByTagName("input")[0];
            if (checkbox.checked) {
                checkedList.push(i);
            }
        }
        return checkedList;
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
        rowElement = document.createElement("tr");
        // Selection checkbox
        rowSelect = document.createElement("input");
        rowSelect.type = "checkbox";
        rowSelectTD = document.createElement("td");
        rowSelectTD.appendChild(rowSelect);
        rowElement.appendChild(rowSelectTD);
        // Table data
        element = document.createElement("td");
        element.appendChild(document.createTextNode(data));
        element.data = data;
        element.addEventListener("click", this._handleRowClick, false);
        rowElement.appendChild(element)
        return rowElement;
    }

/* Functions
 ************/

// Helper function that gets called at page load and builds a LUT for DOM elements
function bindElementList() {
    list = new Object();
    
    list.queue =   document.getElementById("queuePane");
    list.sidebar = document.getElementById("sidebarPane");
    list.library = document.getElementById("libraryPane");
    list.audio =   document.getElementById("audioPlayer");
    list.meta =    document.getElementById("metadata");
    
    // Place it in the global namespace for easy access
    window.dom = list;
}
