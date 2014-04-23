var Im_Suggestion = function(idField,oOptions){

    this.DEFAULT_MIN_CHARS = 2;
    this.DEFAULT_MAX_HEIGHT = 200;
    this.DEFAULT_MAX_RESULTS = 10;
	this.DEFAULT_PLACEHOLDER_COLOR = "#7A7A7A";
	this.DEFAULT_TEXT_COLOR = "#000";
    this.qs = "";
	this.keyupDelay = 100;
    this.results = null;
	this._digiting = false;
    this.mouseOverEnabled = true;
    this._selectedIndex = -1;
	this._blockOnBlurEvent = false;
	this.placeHolderText = "";
    this.status = "closed";
    if (!idField)
        throw("Missing param idField");
    
    this.idField = idField;
    this.id  = "Im_Suggestion_"+this.idField;
    if (!document.getElementById(this.idField))
        throw("Element "+idField+" does not exist");
    
    this.field = document.getElementById(this.idField);
    
    disableAutoComplete("#"+this.idField);
    
    this.field.onkeypress = function(event){return this._disableEnterKey(event)}.bind(this);
    this._lastKeyPressed = null;
	
    this._setOptions(oOptions); 
    this._createComponents();
    this._attachEvents();
	addEvent(document,"mouseup",function(){ this._blockOnBlur( this.options.blockOnBlur ); }.bind(this));
	addEvent(window,"unload",function(){purgeDomObj(this)}.bind(this));
}



Im_Suggestion.prototype._disableEnterKey = function(e)
{
     var key;     
     if(window.event)
          key = window.event.keyCode; //IE
     else
        key = e.which; //firefox
	
	this._lastKeyPressed = key;
	
    return (key != 13);
}

Im_Suggestion.prototype._setOptions = function(oOptions){
    
    this.options = typeof oOptions == "object" ? oOptions : {};
    
    this.options.maxResults = (typeof this.options.maxResults != "undefined") ? this.options.maxResults : this.DEFAULT_MAX_RESULTS;
    
    this.options.selectRowOnOver = (typeof this.options.selectRowOnOver != "undefined") ? this.options.selectRowOnOver : false;
    
    this.options.hideOnMouseOut = (typeof this.options.hideOnMouseOut != "undefined") ? this.options.hideOnMouseOut : false;
	
	this.options.resetQsFieldOnNotSel = (typeof this.options.resetQsFieldOnNotSel != "undefined") ? this.options.resetQsFieldOnNotSel : false;
    
    this.options.maxHeight = (typeof this.options.maxHeight != "undefined") ? parseInt(this.options.maxHeight) : this.DEFAULT_MAX_HEIGHT;
	
	this.options.placeholderText = (typeof this.options.placeholderText != "undefined") ? this.options.placeholderText : "";
	this.options.placeholderColor = (typeof this.options.placeholderColor != "undefined") ? this.options.placeholderColor : this.DEFAULT_PLACEHOLDER_COLOR;
	
	this.options.textColor = (typeof this.options.textColor != "undefined") ? this.options.textColor : this.DEFAULT_TEXT_COLOR; 
    this.options.focusedElementOnSelect = (typeof this.options.focusedElementOnSelect != "undefined") ? this.options.focusedElementOnSelect : ""; 
	
    this.options.onmouseover = (typeof this.options.onmouseover == "function") ? this.options.onmouseover : function(){};
	
    this.options.onclick = (typeof this.options.onclick == "function") ? this.options.onclick : function(){};
    
    this.options.onselect = (typeof this.options.onselect == "function") ? this.options.onselect : function(){};
    
    this.options.onsearch = (typeof this.options.onsearch == "function") ? this.options.onsearch : function(){ return true; };
	
	this.options.onreset = (typeof this.options.onreset == "function") ? this.options.onreset : function(){};
	
	this.options.autoselectFirstItem = (typeof this.options.autoselectFirstItem != "undefined") ? this.options.autoselectFirstItem : true;
	
	this.options.showEmptyResOnBlur = (typeof this.options.showEmptyResOnBlur != "undefined") ? this.options.showEmptyResOnBlur : false;
	this.options.getResultOnFocus = (typeof this.options.getResultOnFocus != "undefined") ? this.options.getResultOnFocus : true;
	
	this.options.initValue = (typeof this.options.initValue != "undefined") ? this.options.initValue : this.field.value;
    //this.options.parentNode = (typeof this.options.parentNode != "undefined") ? this.options.parentNode : document.body;
    this.options.parentNode = (0 && this.field.parentNode) ? this.field.parentNode : document.body; //forced parentNode to the body

	this.options.hideNoResultDiv = (typeof this.options.hideNoResultDiv != "undefined") ? this.options.hideNoResultDiv : false;
	//# gestione title #
	this.options.titleNoClick = (typeof this.options.titleNoClick != "undefined") ? this.options.titleNoClick : false;
	this.options.activeTitle = (typeof this.options.activeTitle != "undefined") ? this.options.activeTitle : false;
	this.options.titleClosed = false; //inizialmente false
	this.lastQsDigited = ''; //inizialmente vuoto
	//##################

	this.options.blockOnBlur = (typeof this.options.blockOnBlur != "undefined") ? this.options.blockOnBlur : false;


	this.options.inOverlay = (typeof this.options.inOverlay != "undefined") ? this.options.inOverlay : false;
	this.qs = this.default_value = this.field.value = this.options.initValue;

    this.options.nazione = (typeof this.options.nazione != "undefined") ? this.options.nazione : false;

}

Im_Suggestion.prototype._attachEvents = function(){

    //addEvent(this.field,"keydown",this._chooseOperation.bind(this));
	addEvent(this.field,"keydown",this._onkeydown.bind(this));
	addEvent(this.field,"keyup",this._onkeyup.bind(this));
    
    //addEvent(this.field,"click",this._getSuggestion.bind(this));
    addEvent(this.field,"blur",this._onblur.bind(this));
    addEvent(this.field,"focus",this._onfocus.bind(this));
    addEvent(this.field,"mouseout",this._onmouseout.bind(this));
	addEvent(this.field,"mouseover",this._clearHideTimeout.bind(this));
    addEvent(document,"mousemove",function(){this.mouseOverEnabled = true}.bind(this));
    addEvent(this.suggestCont,"mouseover",this._clearHideTimeout.bind(this));
    
}

Im_Suggestion.prototype._onkeydown = function(ev){
	this._digiting = true;
	this.field.style.color = this.options.textColor;
	this._chooseOperation(ev);
}

Im_Suggestion.prototype._onkeyup = function(){
	this._digiting = false;
}


Im_Suggestion.prototype._onmouseout = function(){
	
	if (this.options.hideOnMouseOut){
		this._hideDelayed.apply(this,new Array("1000"));
		this._hideDelayed.apply(this,new Array("1000"));
	}
}

Im_Suggestion.prototype._addRow= function(index){
	
}

Im_Suggestion.prototype._blockOnBlur = function(flag){
	if (typeof flag == "undefined")
		return this._blockOnBlurEvent;
	return this._blockOnBlurEvent = flag;
}

Im_Suggestion.prototype._onblur = function(){
	
	if (this._blockOnBlur()){
		return;
	}

	this._digiting = false;
	
	if (this._selectedIndex > -1 && (this.qs.toLowerCase() == this.results[this._selectedIndex].row_value.toLowerCase())){
		this._selectRow(this.results[this._selectedIndex].domDiv);
	}
	
	if (!this.options.resetQsFieldOnNotSel && this.options.placeholderText && this.field.value.trim() == ""){
		this.setPlaceHolder();
	}
	
    this._hideDelayed.apply(this,new Array("100"));
}

Im_Suggestion.prototype.setPlaceHolder = function(){
	if (!this._digiting){
		this.field.value = this.options.placeholderText;
		this.field.style.color = this.options.placeholderColor;
	}
	
}

Im_Suggestion.prototype._onfocus = function(){
	this._clearHideTimeout.bind(this);
	this._blockOnBlur(false);
	this.field.style.color = this.options.textColor;
	if (this.field.value == this.options.placeholderText){		
		this.field.value = "";
	}
	if( this.options.getResultOnFocus ) {
		if (this.field.value){			
			this._getSuggestion();			
		}
	}		
    
}



Im_Suggestion.prototype._chooseOperation = function(ev){
    
    var keys = new Array();
    
    keys[13] = "RETURN";
    keys[9] = "TAB";
    keys[27] = "ESC";
    
    
    keys[112] = "F1";
    keys[113] = "F2";
    keys[114] = "F3";
    keys[115] = "F4";
    keys[116] = "F5";
    keys[117] = "F6";
    keys[118] = "F7";
    keys[119] = "F8";
    keys[120] = "F9";
    keys[121] = "F10";
    keys[122] = "F11";
    keys[123] = "F12";
    
    keys[145] = "SCROLLOCK";
    keys[20] =  "CAPSLOCK";
    keys[144] = "NUMLOCK";
    
    
    keys[16] = "SHIFT";
    keys[19] = "PAUSE";
    keys[18] = "ALT";
    keys[17] = "CTRL";
    
    keys[33] = "PAGEUP";
    keys[34] = "PAGEDOWN";
    keys[35] = "END";
    keys[36] = "HOME";
    
    keys[37] = "ARRSX";
    keys[38] = "ARRUP";
    keys[39] = "ARRDX";
    keys[40] = "ARRDW";
    
    keys[45] = "INS";
    
    //keys[0] = "WIN";
    keys[91] = "LEFTWIN";
    keys[92] = "RIGHTWIN";
    
    var key = (window.event) ? window.event.keyCode : ev.keyCode;
	var btn = keys[key];
    switch (btn){
        case "ARRDW":
			//caretPos = this.getCaretPosition(this.field);            
            if (this.status == "closed"){
                this._getSuggestion();
            }
            else
                this._nextRow();
			//this.setCaretPosition(this.field,caretPos);
            break;
        case "ARRSX":
        case "ARRDX":
        case "PAGEUP":
        case "PAGEDOWN":
        case "HOME":
        case "SHIFT":
        case "ALT":
        case "WIN":
        case "PAUSE":
        case "CTRL":
        case "END":
        case "INS":        
        case "F1":
        case "F2":
        case "F3":
        case "F4":
        case "F5":
        case "F6":
        case "F7":
        case "F8":
        case "F9":
        case "F10":
        case "F11":
        case "F12":
        case "SCROLLOCK":
        case "CAPSLOCK":
        case "NUMLOCK":
        case "LEFTWIN":
        case "RIGHTWIN":
            break;
        case "ARRUP":
			//caretPos = this.getCaretPosition(this.field);
            this._prevRow();
			//this.setCaretPosition(this.field,caretPos);
            break;
        case "ESC":
            this.hide(this.options.resetQsFieldOnNotSel);
            this.field.blur();
            break;
		case "TAB":			
        case "RETURN":
		
            if (this.status == "closed"){
                this._getSuggestion();
            }
            else{
				if (this.results[this._selectedIndex] && this.results[this._selectedIndex])
					this._selectRow(this.results[this._selectedIndex].domDiv,true);	
            }
			if (btn != "TAB")
				this.nextFocus();
            
            break;
        default:
            this._getSuggestion();
            break;
    }
	return true;
}

Im_Suggestion.prototype.nextFocus = function(){
	
	var nextField = null;
	
	if (this.options.focusedElementOnSelect === null)
		return;
	if (typeof this.options.focusedElementOnSelect != "undefined" && this.options.focusedElementOnSelect){
		nextField = this.options.focusedElementOnSelect;
	}else{		
		var parent = this.field.parentNode;
		
		while (parent && parent.tagName.toLowerCase() != "form"){				
			parent=parent.parentNode;		
		}
		
		var els = parent.elements;
		for(i=0;i<els.length;i++){
			if (els[i] == this.field)
				break;		
		}
		while (typeof els[i++] != "undefined")
		{
			if (els[i].type!="hidden"){
				nextField = els[i];
				break;
			}
		}
		
	}
	if (nextField){
		var fn = function(){try{nextField.focus();}catch(e){}};
		setTimeout(fn,100);
	}
	
}

Im_Suggestion.prototype._createComponents = function(){
    
    appendCss("/includes/Im_Suggestion.css");
    
    this.suggestCont = document.createElement("div");
    this.suggestCont.id = "Im_suggestion_container_"+this.idField;
	this.suggestCont.className = "Im_suggestion_container "+"Im_suggestion_container_"+this.idField; 
    
    this.suggestIframe = document.createElement("iframe");
    this.suggestIframe.id = "Im_suggestion_iframe_"+this.idField;
	this.suggestIframe.className = "Im_suggestion_iframe "+"Im_suggestion_iframe_"+this.idField; 
    this.suggestIframe.src = "";
    
    this.resultCont = document.createElement("div");
    this.resultCont.id = "Im_suggestion_results_"+this.idField;
	this.resultCont.className = "Im_suggestion_results "+"Im_suggestion_results_"+this.idField; 
    this.suggestCont.appendChild(this.resultCont);
    
    this.loaderCont = document.createElement("div");
    this.loaderCont.id = "Im_suggestion_loader_"+this.idField;
	this.loaderCont.className = "Im_suggestion_loader "+"Im_suggestion_loader_"+this.idField; 
    
    this.wrapper = document.createElement("div");
	this.wrapper.id = "Im_suggestion_wrapper_"+this.idField;
    this.wrapper.className = "Im_suggestion_wrapper "+"Im_suggestion_wrapper_"+this.idField; 
	
    this.wrapper.appendChild(this.suggestIframe);
    this.wrapper.appendChild(this.loaderCont);
    this.wrapper.appendChild(this.suggestCont);

    this.options.parentNode.appendChild(this.wrapper);
    if (this.field.value.trim() == "" && this.options.placeholderText)
		this.setPlaceHolder();
	if (this.field.value == this.options.placeholderText){
		this.field.style.color = this.options.placeholderColor;
	}
	
    this.setPosition(true);
    
}

Im_Suggestion.prototype.setPosition = function(hideSugg){

	if (typeof hideSugg == "undefined")
		hideSugg = false;
    //var pos = getPosition(this.field, true);
    var pos = getPosition(this.field);
    var fW = MEgetWidth(this.field);
    var fH = MEgetHeight(this.field);
    var lH = MEgetHeight(this.loaderCont);
    var lW = MEgetWidth(this.loaderCont);
    
	var position = this.options.inOverlay ? "fixed" : "absolute";

	if (hideSugg)
		this.suggestCont.style.display = "none";
    this.suggestCont.style.width = fW + "px";
    this.suggestCont.style.position = position;
    this.suggestCont.style.zIndex = "1000";
    this.suggestCont.style.top = parseInt(pos.y) + fH + 2 +"px";
    this.suggestCont.style.left = parseInt(pos.x) + "px";
    
    this.suggestIframe.style.backgroundColor = "#FFF";
    if (hideSugg)
		this.suggestIframe.style.display = "none";
    this.suggestIframe.style.width = fW + "px";
    this.suggestIframe.style.height = parseInt(MEgetHeight(this.suggestCont)) + "px";
    this.suggestIframe.style.position = position;
    this.suggestIframe.style.zIndex = "100";
    this.suggestIframe.style.top = parseInt(pos.y) + fH + 2 +"px";
    this.suggestIframe.style.left = parseInt(pos.x) + "px";
    this.suggestIframe.style.border="none";
    
	if (hideSugg)    
		this.loaderCont.style.display = "none";
    this.loaderCont.style.position = position;
    this.loaderCont.style.top = parseInt(pos.y) + fH/2 -lH/2 +"px";
    this.loaderCont.style.left = parseInt(pos.x) + fW - lW +"px";
}

Im_Suggestion.prototype.show = function(){
    this.setPosition();
    this.status = "opened";
	if((!this.results.length && this.options.hideNoResultDiv) ||
		(this.options.activeTitle && this.options.titleClosed)
		)
		this.suggestCont.style.display = "none";
	else
		this.suggestCont.style.display = "";
    this.suggestIframe.style.display = "";
	this.wrapper.style.display = "";
}

Im_Suggestion.prototype._clearHideTimeout = function(){
    if (this.hideTimer!="undefined")
        clearTimeout(this.hideTimer);
}


Im_Suggestion.prototype.setCaretPosition = function (oField, iCaretPos) {
	
    if (!iCaretPos)
        iCaretPos = this.field.value.length;
         
    if (document.selection) { // IE
    
       var oSel = document.selection.createRange ();
       oSel.moveStart ('character', -oField.value.length);
       oSel.moveStart ('character', iCaretPos);
       oSel.moveEnd ('character', 0);
       oSel.select();
    }
    else
    if (oField.selectionStart || oField.selectionStart == '0') {// Firefox & other
       oField.selectionStart = iCaretPos;
       oField.selectionEnd = iCaretPos;
       oField.focus();
    }
}


Im_Suggestion.prototype.getCaretPosition = function(oField) {

  // Initialize
  var iCaretPos = 0;

  // IE Support
  if (document.selection) {

    // Set focus on the element
    oField.focus ();

    // To get cursor position, get empty selection range
    var oSel = document.selection.createRange ();

    // Move selection start to 0 position
    oSel.moveStart ('character', -oField.value.length);

    // The caret position is selection length
    iCaretPos = oSel.text.length;
  }

  // Firefox support
  else if (oField.selectionStart || oField.selectionStart == '0')
    iCaretPos = oField.selectionStart;

  // Return results
  return (iCaretPos);
}

Im_Suggestion.prototype._hideDelayed = function(delay){
    this._clearHideTimeout();
    this.hideTimer = setTimeout(function(){this.hide(this.options.resetQsFieldOnNotSel);}.bind(this),delay);
}

Im_Suggestion.prototype.hide = function(resetQsField){
    this.suggestCont.style.display = "none";
    this.suggestIframe.style.display = "none";
	this.wrapper.style.display = "none";

    if (this._selectedIndex>-1)
        this._unSelectDivRow(this._selectedIndex);
    this._selectedIndex = -1;
    this.status = "closed";
    if (resetQsField)
        this.resetField();
	
	if (this.field.value.trim() == this.options.placeholderText && !this._digiting)
		this.setPlaceHolder();

}

Im_Suggestion.prototype.resetField = function(){
	
    if (this.default_value && this.status == "closed"){
        this.field.value = this.default_value;
        this.field.style.color = this.options.textColor;
    }
	
	if (this.default_value.trim() == "" && this.options.placeholderText)
		this.setPlaceHolder();
		
	if (typeof this.options.onreset != "undefined")
		this.options.onsearch(this.qs);
}

Im_Suggestion.prototype.reset = function(){
    this.default_value = "";
}

Im_Suggestion.prototype.initialize = function(){
	this.field.value = "";
	this.default_value = "";
	this.qs = "";
	if (this.options.placeholderText)
		this.setPlaceHolder();
}

Im_Suggestion.prototype._showLoader = function(){
    this.setPosition();
    this.loaderCont.style.display = "";
    this.fieldFocus();
}

Im_Suggestion.prototype._hideLoader = function(){
    this.loaderCont.style.display = "none";
}

Im_Suggestion.prototype._getSuggestion = function(force){
    if (typeof force=="undefined")
        force=false;
    clearTimeout(this.suggTimer);
    this._selectedIndex = -1;
	this._overSelectedIndex = -1;
    var minChars = this.options.minChars ? this.options.minChars : this.DEFAULT_MIN_CHARS;
	
    if (!force && ((this.field.value.length+1 < minChars) || this.checkIfSelected())){
        this.hide(false);
        this._hideLoader();
        return;
    }
	
    if (!this.options.onsearch( this.field.value ))
		return;
    this._showLoader();
    this.suggTimer = setTimeout(this._makeSuggestionReq.bind(this),this.keyupDelay);
}


Im_Suggestion.prototype.checkIfSelected = function(url){
    
    var selText = "";
    if (window.getSelection) {      // Firefox, Opera, Google Chrome and Safari
        if (document.activeElement && 
                (document.activeElement.tagName.toLowerCase () == "textarea" || 
                 document.activeElement.tagName.toLowerCase () == "input")) 
        {
            var text = document.activeElement.value;
            selText = text.substring (document.activeElement.selectionStart, 
                                      document.activeElement.selectionEnd);
        }
        else {
            var selRange = window.getSelection ();
            selText = selRange.toString ();
        }
    }
    else {
        if (document.selection.createRange) {       // Internet Explorer
            var range = document.selection.createRange ();
            selText = range.text;
        }
    }
    
    if (selText !== "")
        return true ;
    else
        return false;
}

Im_Suggestion.prototype.setUrl = function(url){
    this.options.url = url;
}
Im_Suggestion.prototype.getUrl = function(url){
    return this.options.url;
}

Im_Suggestion.prototype._makeSuggestionReq = function(){
    var aj = getMEAjaxObj();
    var url = this.options.url;
    
    this.qs = this.field.value;
    
    if (url.search(/\?/)==-1)
        url+="?";
    else
        url+="&";
    url+="s="+Url.encode(this.qs);
	if (this.options.maxResults)
		url+="&maxRes="+this.options.maxResults;
    if (this.options.nazione)
        url+="&n="+this.options.nazione;

    aj.Request("POST",url,this._manageSuggestionResults.bind(this));
}

Im_Suggestion.prototype._manageSuggestionResults = function(result){

	this.response = {};

	//con gestione titolo attiva
	if(this.options.activeTitle){
		if(this.options.titleClosed && (this.qs != this.lastQsDigited))
			this.options.titleClosed = false;
	}

	if(!jq.isEmpty(result.responseText))
   	 	eval("this.response = "+result.responseText);
	else
		this._emptyResults();

    if (this.response["qs"] != this.qs){
		this._hideLoader();
        return;
    }
	
    this.errors = this.response["errors"];
    this.results = this.all_results = this.response["results"];
    
        
    if (this.errors.length == 0 && this.results){
        var arrayLimit = 0;
        
        if (this.options.maxResults && this.options.maxResults < this.results.length){
            arrayLimit = this.options.maxResults;
        }else
            arrayLimit = this.results.length;
        
        this.results = new Array();
        for (var i=0; i<arrayLimit;i++){
            
            this.results[i] = this.response["results"][i];
        }
        
    }
    
    this._selectedIndex = -1;
    if (this.results)
        this._createResultDiv();
         
	
	if (this.field != document.activeElement && this.results.length > 0){
		this._selectedIndex = 0;
		
		if (this.qs.toLowerCase() == this.results[this._selectedIndex].row_value.toLowerCase()){
			
			this._selectRow(this.results[this._selectedIndex].domDiv);
	
		}
		return;
	}
	
	this._hideLoader();

	if (this.field == document.activeElement)
		this.show();
    //this.fieldFocus();

	if( this.options.autoselectFirstItem ) {
		this._nextRow();
		//this._selectRow( false, true );
	}

	//con gestione titolo attiva
	if(this.options.activeTitle){
		this.lastQsDigited = this.qs;
	}
}

Im_Suggestion.prototype._emptyResults = function(){
	this.wrapper.style.display = "none";
    this.suggestCont.innerHTML = "";
}

Im_Suggestion.prototype._setResultDivProps = function(){
	
    if (this.DEFAULT_MAX_RESULTS > 0)
        return;
	
    this.suggestCont.style.height="auto";
    this.suggestCont.style.overflowY="auto";
    this.suggestCont.style.visibility = "hidden";
    this.show();
    var cH = MEgetHeight(this.suggestCont);
    
    if (cH > this.options.maxHeight){
        this.suggestCont.style.height=this.options.maxHeight+"px";
        this.suggestCont.style.overflowY="scroll";
    }else{
        this.suggestCont.style.height="auto";
        this.suggestCont.style.overflowY="auto";
    }
    this.suggestCont.style.visibility = "visible";
    
	
}

Im_Suggestion.prototype._addEmptyRow= function(){

    var oRow = document.createElement("div");
    oRow.className = "Im_suggestion_row";
    oRow.innerHTML = "Nessun risultato trovato";
    this.suggestCont.appendChild(oRow);
    
}

Im_Suggestion.prototype._addRow= function(index){
    
    var row = this.results[index];
    var oRow = document.createElement("div");
    
    oRow.className = "Im_suggestion_row";
    oRow.innerHTML = row.row_label;
    
    oRow.suggIndex = index;
    addEvent(oRow,"mousedown",function(){this._blockOnBlur(true)}.bind(this));

    if (typeof this.options.onclick == "function")
        addEvent(oRow,"click",function(){this.options.onclick.apply(this,new Array(row))}.bind(this));
    addEvent(oRow,"click",function(e){this._clickRow.apply(this,new Array(oRow,e))}.bind(this));
    
    addEvent(oRow,"mouseover",function(){this._onRow.apply(this,new Array(row,oRow))}.bind(this));
    if (typeof this.options.onmouseover == "function")
        addEvent(oRow,"mouseover",function(){this.options.onmouseover.apply(this,new Array(row))}.bind(this));
    
    this.suggestCont.appendChild(oRow);
    return oRow;
}

Im_Suggestion.prototype._addTitleRow = function( title, index ){
	var oSuggestion = this;

	var oRow = document.createElement("div");

	oRow.className = "Im_suggestion_row title";
	oRow.innerHTML = title+" <span class='close'>&times;</span>";
	oRow.suggIndex = index;

	jq(oRow).attr('data-type','title'); //!important
	addEvent(oRow,"click",function(e){this._clickRow.apply(this,new Array(oRow,e))}.bind(this));

	if (typeof this.options.onmouseover == "function")
		addEvent(oRow,"mouseover",function(){this.options.onmouseover.apply(this,new Array(oRow))}.bind(this));

	this.suggestCont.appendChild(oRow);
	return oRow;
}

Im_Suggestion.prototype._createResultDiv = function(){

    this._emptyResults();

    if (this.results.length == 0){
		
        if ((this.field == document.activeElement || this.options.showEmptyResOnBlur) && !this.options.hideNoResultDiv){
			this._addEmptyRow();
        }
    }
    else{

		if(this.options.activeTitle){
			if(!this.options.titleClosed && !jq.isEmpty(this.options.titleNoClick)){
				var _i = -1;
				var length = this.results.length;

				this._addTitleRow( this.options.titleNoClick, _i );
				_i = 1;
				length++;

				for (var i = _i; i < length; i++){
					this.results[i-1].domDiv = this._addRow(i-1);
				}
			}
		}else{
			for (var i = 0; i < this.results.length; i++){
				this.results[i].domDiv = this._addRow(i);
			}
		}

		this._setResultDivProps();
	}
    
}

Im_Suggestion.prototype._selectDivRow = function(oDiv){
    
    oDiv.className = "Im_suggestion_row_selected";
    var suggIndex = oDiv.suggIndex;
    oDiv.onmouseout = function(){
        this.className= "Im_suggestion_row";
    }
    this.fieldFocus();
}
    
Im_Suggestion.prototype.fieldFocus = function(){
    this.field.focus();
    this.setCaretPosition(this.field);
}

Im_Suggestion.prototype._unSelectDivRow = function(index){
    if (index > -1)
        if (this.results && this.results.length && this.results[index])
            this.results[index].domDiv.className = "Im_suggestion_row";
}

Im_Suggestion.prototype._selectRow = function(oRow,closeSearch,automatic){
	
    if (oRow.suggIndex<0)
        return;
	
    var item = this.results[oRow.suggIndex];
    
	if( typeof automatic == 'undefined' )
		automatic = false;
	
    if ( !automatic && item.row_value)
        this.field.value = item.row_value;
    
    this.qs = this.field.value;
    this.default_value = this.qs;
    
    this.options.onselect(item);
    if (closeSearch)
        this.hide();
}

Im_Suggestion.prototype._clickRow = function(oRow,ev){

    this._selectedIndex = oRow.suggIndex;
	this._selectRow(oRow);
    this.hide();
	this.nextFocus();

	/* ONLY FOR ROW SUGGESTION TITLE */
	if(this.options.activeTitle){
		var _target = (!jq.isEmpty(ev.target)) ? ev.target.className : (!jq.isEmpty(ev.srcElement) ? ev.srcElement.className : '');
		var actionSuggMail = 'accepted';
		if((jq(oRow).attr('data-type') == 'title') && (_target == 'close')){  //pulsante di chiusura
			this.options.titleClosed = true;
			actionSuggMail = 'rejected';
		}
		if ( typeof trackGAClickEvent != 'undefined' )
			trackGAClickEvent('suggerimentoEmailEvents', 'suggerimento_dominio_email', actionSuggMail);
	}

    try{
        if (ev){
            ev.stopBubbling();
        }
    }catch(e){
        window.event.cancelBubble = true;
    }

}

Im_Suggestion.prototype._onRow = function(item,divRow){
    if (!this.mouseOverEnabled)
        return;

	this._unSelectDivRow(this._selectedIndex);	
	this._selectedIndex = -1;
	this._overSelectedIndex = divRow.suggIndex;
	if (this.options.selectRowOnOver)
        this._selectRow(divRow.suggIndex);
    
    
    this._selectDivRow(divRow);
}

Im_Suggestion.prototype._nextRow = function(){

    if (!this.results || this.results.length==0)
        return;
    this.mouseOverEnabled = false;
    if (this._selectedIndex >= this.results.length-1)
        return;
    else
        if (this._selectedIndex > -1)
            this._unSelectDivRow(this._selectedIndex);
    this.show();

    var index = ++this._selectedIndex;
    var item = this.results[index];
    
    var divRow = this.results[index].domDiv;

    if (this.options.selectRowOnOver)
        this._selectRow(divRow);
    
    this._selectDivRow(divRow);
}

Im_Suggestion.prototype._prevRow = function(){
    
    if (!this.results || this.results.length==0)
        return;
    this.mouseOverEnabled = false;
    if (this._selectedIndex <= 0){
        this.hide();
        return;
    }
    else
        this._unSelectDivRow(this._selectedIndex);
    
    this.show();
    
    var index = --this._selectedIndex;
    var item = this.results[index];
    
    var divRow = this.results[index].domDiv;

    if (this.options.selectRowOnOver)
        this._selectRow(divRow);
    
    this._selectDivRow(divRow);
}
