/* ***************************************************************************
 * controls.js
 * -----------
 * Reusable complex UI controls implemented in Javascript are placed here.
 *****************************************************************************/

/* Classes
 **********/

function ListViewControl() {
    //TODO: handle indexes better once insertion and deletion are added
    this.listElement = document.createElement("table");
    this.listBody = document.createElement("tbody");
    this.listElement.appendChild(this.listBody);
    // Put a reference here so we can get to it from event handlers
    this.listElement.listControl = this;
    // Rows are stored as an array of DOM elements, with the values (visible
    //  data) and extra (associated data) as attributes on each
    this.rows = [];
    // this.rowsExtra = [];
    // this.rowElements = [];
    this.currentHighlight = null;
}
    ListViewControl.prototype.appendRow = function(rowValues, rowExtra) {
        element = this._createRow(rowValues);
        // Add additional row data
        element.listIndex = this.rows.length;
        element.values = rowValues;
        element.extra = rowExtra;
        this.rows.push( element );
        // Done setting it up, stick it on the DOM
        this.listBody.appendChild(element);
    }
    // Delete all the rows, reset it to before data was added
    ListViewControl.prototype.clear = function() {
        this.rows = [];
        clearElement(this.listBody);
    }
    // Generates the DOM tree from the list's data
    //TODO: is this function even needed?
    // ListViewControl.prototype.render = function() {
        // clearElement(this.listElement);
        // this.rowElements = [];
        // for (index in this.rows) {
            // row = this.rows[index];
            // rowElement = this._createRow(row);
            // rowElement.index = index;
            // this.rowElements.push(rowElement);
        // }
    // }
    ListViewControl.prototype.getSelected = function() {
        //TODO: we can probably speed this up by handling click events
        var checkedList = new Array();
        for (i in this.rows) {
            var element = this.rows[i];
            // Checkbox will be the first input element in the row
            var checkbox = element.getElementsByTagName("input")[0];
            if (checkbox.checked) {
                checkedList.push(i);
            }
        }
        return checkedList;
    }
    ListViewControl.prototype.deleteItem = function(index) {
        //TODO: merge these into one
        removed = this.rows[index];
        this.rows.splice(index, 1);
        this.listBody.removeChild(removed);
    }
    // Highlights a specific row
    ListViewControl.prototype.highlightRow = function(index) {
        //TODO: rename currentlyPlaying when CSS rules are added to the control
        // Only one row can be highlighted
        if (this.currentHighlight != null) {
            this.rows[this.currentHighlight].classList.remove("currentlyPlaying");
        }
        this.rows[index].classList.add("currentlyPlaying");
        this.currentHighlight = index;
    }
    /// Private functions --------------
    ListViewControl.prototype._handleRowClick = function(e) {
        // parent is <tbody>, and its parent is the <table> where we get to listControl
        //TODO: this may need changing if we upgrade the event handling
        //TODO: don't do anything if it was the checkbox that was clicked
        e.currentTarget.parentNode.parentNode.listControl.onrowclicked(e.currentTarget.listIndex);
    }
    // _createRow handles the DOM stuff, code should normally use appendRow
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
        rowElement.addEventListener("click", this._handleRowClick, false);
        rowElement.appendChild(element)
        return rowElement;
    }
