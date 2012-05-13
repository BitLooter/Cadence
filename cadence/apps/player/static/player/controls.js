/* ***************************************************************************
 * controls.js
 * ===========
 * Reusable complex UI controls implemented in Javascript are placed here.
 * 
 * Dependencies: utils.js
 *****************************************************************************/

/* Classes
 **********/

/*************************************
 ToolbarControl
 --------------
 Used for creating a set of controls to issue commands to the application by
 the user.
 
 Parameters
  container
   The DOM element that controls are put in. Will be cleared at init.
 *************************************/
function ToolbarControl(container) {
    clearElement(container);
    this.element = container;
}
    ToolbarControl.prototype.addButton = function(label, callback) {
        button = document.createElement("button");
        button.type = "button";
        button.appendChild(document.createTextNode(label));
        button.addEventListener("click", callback, false);
        this.element.appendChild(button);
    }

/*************************************
 ListViewControl
 ---------------
 Manages a tabular data view, similar to the ListView controls you find in
 OS APIs.
 
 Control is implemented as two separate <table> elements. This allows the
 content to scroll independantly of the headers if needed. Early versions of
 the control contained both parts in the same table, but it eventually
 proved difficult to operate properly with CSS and JS.
 
 Parameters
  parent
   DOM element that will hold the control. New element will be appended to it.
 
 CSS styling
    Every element generated by the control is given a class name, so it can be
   styled with CSS. To prevent conflicts with other classes used on the page,
   all names are prefixed with uilc (UI List Control). Class tree follows:
   
   <table> - Head table - uilcHeadTable
   \- <thead> - Header container - uilcHead
    \- <tr> - Header row - uilcHeadRow
     |- <th> - Header cell (selection check) - uilcHeadSelectBox
     |\- <input> - Select all checkbox - uilcHeadSelect
     |- <th> - Header cell (header item) - uilcHeadItem
     |- ...
     \- <th> - Header scroll bar buffer (no content) - uilcHeadScrollBuffer
   <table> - Main element - uilcTable
   \- <tbody> - Main body - uilcBody
    \- <tr> - Display row - uilcRow
    ||- <th> - Selection cell - uilcSelectBox
    ||\- <input> - Selection checkbox - uilcSelect
    ||- <td> - Display cell - uilcCell
    |\- ...
    |- ...
    \- <tr> - Display row (highlighted) [alongside normal class] - uilcHighlight
 *************************************/
function ListViewControl(parent) {
    this.parent = parent;
    //TODO: handle indexes better once insertion and deletion are added
    // Create initial DOM framework
    this._generateDOMFramework();
    
    // Put a reference here so we can get to it from event handlers
    this.listElement.listControl = this;
    // Rows are stored as an array of DOM elements, with the values (visible
    //  data) and extra (associated data) as attributes on each
    this.rows = [];
    this.selectedRows = [];
    this.currentHighlight = null;
}
    ListViewControl.prototype.changeHeader = function(headers) {
        var headRow = document.createElement("tr");
        headRow.className = "uilcHeadRow";
        // Create the select-all checkbox
        var selectAllCheck = document.createElement("input");
        selectAllCheck.type = "checkbox";
        selectAllCheck.className = "uilcHeadSelect";
        selectAllCheck.addEventListener("click", this._allSelected, false);
        // Add a reference to the list control for the event handler to find
        selectAllCheck.listControl = this;
        // And a reference to the checkbox on the control for other code to find
        this.selectAllCheck = selectAllCheck;
        var selectAllCell = document.createElement("th");
        selectAllCell.appendChild(selectAllCheck);
        selectAllCell.className = "uilcHeadSelectBox";
        headRow.appendChild(selectAllCell);
        // Add the headers
        for (var i in headers) {
            var thisHead = document.createElement("th");
            thisHead.appendChild(document.createTextNode(headers[i]));
            thisHead.className = "uilcHeadItem";
            headRow.appendChild(thisHead);
        }
        // Add one more for a scroll bar buffer
        var scrollBuffer = document.createElement("th");
        scrollBuffer.className = "uilcHeadScrollBuffer"
        headRow.appendChild(scrollBuffer);
        // Add it all to the DOM
        clearElement(this.listHead);
        this.listHead.appendChild(headRow);
        
        // Setup column info
        clearElement(this.listColgroup);
        // Empty column for checkbox
        this.listColgroup.appendChild(document.createElement("col"));
        // Create one for each data column
        this.cols = [];
        for (var i = 0; i < headers.length; i++) {
            var col = document.createElement("col");
            this.listColgroup.appendChild(col);
            this.cols.push(col);
        }
        // Add one on the right for the scroll bar
        var scrollCol = document.createElement("col");
        //TODO: Number is a little arbitrary, calculate it somehow
        scrollCol.style.width = "20px";
        this.listColgroup.appendChild(scrollCol);
    }
    ListViewControl.prototype.appendRow = function(rowValues, rowExtra) {
        element = this._createRow(rowValues);
        // Add additional row data
        element.listIndex = this.rows.length;
        //TODO: make values an array
        element.values = rowValues;
        element.extra = rowExtra;
        this.rows.push( element );
        // Done setting it up, stick it on the DOM
        this.listBody.appendChild(element);
        this._updateSelectAllBox();
        this._updateBlankMessage();
    }
    // Delete all the rows, reset it to before data was added
    ListViewControl.prototype.clear = function() {
        this.rows = [];
        clearElement(this.listBody);
        this._updateBlankMessage();
    }
    ListViewControl.prototype.getSelected = function() {
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
        removed = this.rows[index];
        this.listBody.removeChild(removed);
        this.rows.splice(index, 1);
        // Correct for an edge case - without this, removing all leaves the
        // 'select all' box status undefined when the the list is emptied
        this.selectAllCheck.checked = false;
        this._updateBlankMessage();
    }
    // Highlights a specific row
    ListViewControl.prototype.highlightRow = function(index) {
        // Only one row can be highlighted
        if (this.currentHighlight != null) {
            this.rows[this.currentHighlight].classList.remove("uilcHighlight");
        }
        // If no index was passed, highlight nothing
        if (index != undefined) {
            this.rows[index].classList.add("uilcHighlight");
            this.currentHighlight = index;
        }
    }
    ListViewControl.prototype.disable = function(message) {
        // Places an overlay on the control preventing input
        this.listElement.style.position = "relative";
        this.disabledOverlay.style.display = "block";
    }
    ListViewControl.prototype.enable = function() {
        this.disabledOverlay.style.display = "none";
    }
    // Resets column widths after a resize
    ListViewControl.prototype.fixWidths = function() {
        //TODO: handle automatically?
        // usable width is the table width minus the checkbox and scroll bar
        var usableWidth = this.parent.offsetWidth -
                          this.listHeadElement.getElementsByClassName("uilcHeadSelectBox")[0].offsetWidth -
                          this.listHeadElement.getElementsByClassName("uilcHeadScrollBuffer")[0].offsetWidth;
        /*var a = this.parent.offsetWidth;
        var b = this.listHeadElement.getElementsByClassName("uilcHeadSelectBox")[0].offsetWidth;
        var bb = this.listHeadElement.getElementsByClassName("uilcHeadScrollBuffer")[0].offsetWidth;
        var c = a - b - bb;*/
        //TODO: Sizes should NOT be hardcoded here
        this.cols[0].style.width = Math.round(usableWidth * 0.9) + "px";
        this.cols[1].style.width = Math.round(usableWidth * 0.1) + "px";
        // Now copy column data to the table body
        // First remove the old data, if any
        var oldCols = this.listElement.getElementsByTagName("colgroup")[0];
        if (oldCols != undefined) this.listElement.removeChild(oldCols);
        // Then add the new
        this.listElement.insertBefore(this.listColgroup.cloneNode(true), this.listElement.firstChild);
    }
    // -- Event handlers --------------
    ListViewControl.prototype._handleRowClick = function(e) {
        // Don't do anything if it was the checkbox that was clicked
        if (e.target.tagName != "INPUT") {
            rowEvent = document.createEvent("CustomEvent");
            rowEvent.initEvent("rowclick", true, true);
            rowEvent.row = e.currentTarget;
            // parent is <tbody>, and its parent is the <table> where we find the control
            rowEvent.listControl = e.currentTarget.parentNode.parentNode.listControl
            rowEvent.listControl.listElement.dispatchEvent(rowEvent);
        }
    }
    ListViewControl.prototype._rowSelected = function(e) {
        var row = e.target.parentElement.parentElement;
        var selectedIndex = e.target.listControl.selectedRows.indexOf(row);
        if (selectedIndex == -1) {
            e.target.listControl.selectedRows.push(row);
        } else {
            e.target.listControl.selectedRows.splice(selectedIndex, 1);
        }
        e.target.listControl._updateSelectAllBox();
    }
    ListViewControl.prototype._allSelected = function(e) {
        var selectedRows = e.target.listControl.selectedRows;
        var rows = e.target.listControl.rows;
        var control = e.target.listControl;
        // If all selected, deselect all rows
        if (e.target.listControl.selectedRows.length == e.target.listControl.rows.length) {
            for (var i = 0; i < rows.length; i++) {
                rows[i].firstChild.firstChild.checked = false;
                control.selectedRows = [];
            }
        // Otherwise select them all
        } else {
            for (var i = 0; i < rows.length; i++) {
                rows[i].firstChild.firstChild.checked = true;
                control.selectedRows = rows.slice(0);
            }
        }
    }
    // -- Private functions --------------
    // Generates initial DOM structure, called by the init code
    ListViewControl.prototype._generateDOMFramework = function() {
        // Header and body are seperate to allow for independant scrolling
        // Head
        this.listHeadElement = document.createElement("table");
        this.listColgroup = document.createElement("colgroup");
        this.listHeadElement.appendChild(this.listColgroup);
        this.listHead = document.createElement("thead");
        this.listHeadElement.appendChild(this.listHead);
        
        // Body
        this.listElement = document.createElement("table");
        this.listBody = document.createElement("tbody");
        this.listElement.appendChild(this.listBody);
        
        // Overlay for disabled controls
        this.disabledOverlay = document.createElement("div");
        // Note: If you encapsulate this control in another div, you may need to
        // move this element to the appropriate location in the DOM.
        this.listElement.appendChild(this.disabledOverlay);
        
        // Add CSS styles
        this.listHeadElement.className = "uilcHeadTable";
        this.listHead.className = "uilcHead";
        this.listElement.className = "uilcTable";
        this.listBody.className = "uilcBody";
        this.disabledOverlay.className = "disabledOverlay"
        // Put it all on the DOM
        this.parent.appendChild(this.listHeadElement);
        this.parent.appendChild(this.listElement);
    }
    // _createRow handles the DOM stuff, code should normally use appendRow
    ListViewControl.prototype._createRow = function(data) {
        rowElement = document.createElement("tr");
        rowElement.className = "uilcRow";
        
        // Selection checkbox
        rowSelect = document.createElement("input");
        rowSelect.className = "uilcSelect";
        rowSelect.type = "checkbox";
        rowSelect.addEventListener("click", this._rowSelected, false);
        // Place a reference to the control for the event handler
        rowSelect.listControl = this;
        rowSelectCell = document.createElement("th");
        rowSelectCell.className = "uilcSelectBox";
        rowSelectCell.appendChild(rowSelect);
        rowElement.appendChild(rowSelectCell);
        
        // Event handlers
        rowElement.addEventListener("click", this._handleRowClick, false);
        
        // Table data
        rowElement.values = data;
        for (var i = 0; i < data.length; i++) {
            var element = document.createElement("td");
            element.className = "uilcCell";
            element.appendChild(document.createTextNode(data[i]));
            rowElement.appendChild(element)
        }
        
        return rowElement;
    }
    ListViewControl.prototype._updateSelectAllBox = function() {
        if (this.selectedRows.length == this.rows.length) {
            this.selectAllCheck.checked = true;
        } else {
            this.selectAllCheck.checked = false;
        }
    }
    ListViewControl.prototype._updateBlankMessage = function(track) {
        if (this.rows.length == 0) {
            this.emptyMessage.style.display = "block";
        } else {
            this.emptyMessage.style.display = "none";
        }
    }
