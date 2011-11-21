/* ***************************************************************************
 * controls.js
 * ===========
 * Reusable complex UI controls implemented in Javascript are placed here.
 *****************************************************************************/

/* Classes
 **********/

/*************************************
 ListViewControl
 ---------------
 Manages a tabular data view, similar to the ListView controls you find in
 OS APIs.
 *************************************/
function ListViewControl() {
    //TODO: handle indexes better once insertion and deletion are added
    // Create initial DOM framework
    this.listElement = document.createElement("table");
    this.listHead = document.createElement("thead");
    this.listHead.appendChild(document.createElement("tr"));
    this.listElement.appendChild(this.listHead);
    this.listBody = document.createElement("tbody");
    this.listElement.appendChild(this.listBody);
    // Put a reference here so we can get to it from event handlers
    this.listElement.listControl = this;
    // Rows are stored as an array of DOM elements, with the values (visible
    //  data) and extra (associated data) as attributes on each
    this.rows = [];
    this.currentHighlight = null;
}
    ListViewControl.prototype.changeHeader = function(headers) {
        var headRow = document.createElement("tr");
        // Create the select-all checkbox
        var toggleAllCheck = document.createElement("input");
        toggleAllCheck.type = "checkbox";
        toggleAllCheck.style.display = "none"; // Remove this line when toggle all is implemented
        var toggleAllCell = document.createElement("th");
        toggleAllCell.appendChild(toggleAllCheck);
        headRow.appendChild(toggleAllCell);
        // Add the headers
        for (var i in headers) {
            var thisHead = document.createElement("th");
            thisHead.appendChild(document.createTextNode(headers[i]));
            headRow.appendChild(thisHead);
        }
        clearElement(this.listHead);
        this.listHead.appendChild(headRow);
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
        // Don't do anything if it was the checkbox that was clicked
        if (e.target.tagName != "INPUT") {
            rowEvent = document.createEvent("CustomEvent");
            rowEvent.initEvent("rowclick", true, true);
            rowEvent.row = e.currentTarget;
            rowEvent.listControl = e.currentTarget.parentNode.parentNode.listControl
            // parent is <tbody>, and its parent is the <table> where we dispatch the event
            e.currentTarget.parentNode.parentNode.dispatchEvent(rowEvent);
        }
    }
    // _createRow handles the DOM stuff, code should normally use appendRow
    ListViewControl.prototype._createRow = function(data) {
        rowElement = document.createElement("tr");
        // Selection checkbox
        rowSelect = document.createElement("input");
        rowSelect.type = "checkbox";
        rowSelectTD = document.createElement("th");
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
