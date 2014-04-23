var MEPopBoxFactory = function(){
    this.init();
}

if (!document.getElementById('popBoxContainerDiv'))
	document.write("<div id=\"popBoxContainerDiv\" style=\"\"></div>");

MEPopBoxFactory.prototype.init = function(){
    appendCss("/includes/popBox/popBox.css","MEPB_css");
    //addEvent(document.body,"mousemove",this.setMousePosition.bind(this));
	addEvent(document.body,"click",this.setMousePosition.bind(this));
    this.instances = new Array();
    MEPB_hide = new Array();
    MEPB_show = new Array();
	MEPB_mOut = new Array();
    
}

MEPopBoxFactory.prototype.setMousePosition = function(e){

    if (typeof e == "undefined"){
        this.mouseX = window.event.clientX +10;
        this.mouseY = window.event.clientY;
    }
    else{
        this.mouseX = e.clientX +10;
        this.mouseY = e.clientY;
    }
}

MEPopBoxFactory.prototype.getPopBox = function(id,objRef){
	
    if (typeof this.instances[id] == "undefined" || !this.instances[id]){
        this.instances[id] = new MEpopBox(id);
		this.instances[id].parentObj = this;
	}
    if (typeof objRef != "undefined"){
			this.instances[id].objRef = objRef;
    }
	return this.instances[id]
}


var MEpopBox = function(idPopBox){
    this.parentObj = null;
    this.id = null;
    this.urlPars = null;
    this.url = "/MEpopBox/php/getPopBoxBox.php";
	this.divBox = null;
	this.divBoxContent = null;
    this.thumbs = new Array();
	this.bigImage = null;
	this.hidden = true;
	this.objRef = null;
	this.donthide = false;
	this.reset ();
	this.closeEvents = new Array();
    if (typeof idPopBox == "undefined" || !idPopBox){
        this.id = null;
    }else
        this.id = idPopBox;
//    addEvent(window,"unload",this.destroy.bind(this));
    return this.init();
}

MEpopBox.prototype.reset = function() {
	this.hideClose = false;
	this.forceToRight = false;
	this.forceToLeft = false;
	this.forcePopupStyle = false;
	this.boxOffsetLeft = 5;
	this.hideOnEsc = true;
	this.arrowOffsetTop = -10;
}

MEpopBox.prototype.setObjRefFromId = function(idObj){
	this.objRef = document.getElementById(idObj);
}

MEpopBox.prototype.bodyClick = function(e){
	if (!this.hidden)
		this.hide();
}

MEpopBox.prototype.mouseClick = function(e){	
	if (window.event)
		window.event.cancelBubble = true
	else
		e.stopPropagation();
}

MEpopBox.prototype.init = function(){
    if (!this.id){
        alert("called MEPopBox without id");
        return null;
    }
	this.exitOnEsc();
	return this.createBox();
}

MEpopBox.prototype.createBox = function(){
    
	/*try{
	*/
		var html = this.getBoxHtml();
		this.divBox = document.createElement("div");
		this.divBox.id = "MEPB_DIV_"+this.id;
		this.divBox.innerHTML = html;
		document.getElementById('popBoxContainerDiv').appendChild(this.divBox);
		this.divBox.style.display = "none";
		var aCont = getElementsByClass("center_content",this.divBox);
		this.divBoxContent = aCont[0];
	
		var aArrow = getElementsByClass("MEPB_arrow",this.divBox);
		this.divBox.arrow = aArrow[0];
		var aClose = getElementsByClass("MEPB_close",this.divBox);
		this.divBox.close = aClose[0];
		addEvent(this.divBox.close,"click",this.hide.bind(this),false);
		addEvent(this.divBox,"click",this.mouseClick.bind(this),false);
	
		//addEvent(this.divBox,"mouseover",this.mover.bind(this));
		//addEvent(this.divBox,"mouseout",this.mout.bind(this));
		return this;
		
/*	}catch(e){
        alert(e.description ? e.description : e.message);
		this.hide();
	}*/
}
MEpopBox.prototype.setBoxStyle = function(){
    this.divBox.style.width = MEgetWidth(this.divBoxContent.parentNode.parentNode) + MEgetWidth(this.divBox.arrow) + 10 + "px" ;
    if (!this.forcePopupStyle) {
    	this.divBox.style.position = "absolute";
    	this.divBox.style.zIndex = "150";
    }
}


MEpopBox.prototype.display = function(){
    
    
    this.setPosition();
    if (this.divBox.style.display != "block"){
		setTimeout(function(){this.divBox.style.display = "block";}.bind(this),0);
    }
    this.hidden = false;
    document.body.style.cursor = "";
}

MEpopBox.prototype.toggle = function(){
	if (this.hidden)
		this.show();
	else
		this.hide();
}

MEpopBox.prototype.show = function(){
	/*try{
	*/

		if (this.hideClose && this.objRef){
			this.divBox.close.style.display = "none";
		}else{
			this.divBox.close.style.display = "block";
		}
		if (this.hidden)
		    document.body.style.cursor = "wait";
		if (typeof this.toTimer != "undefined")
		    clearTimeout(this.toTimer);
		
		MEPB_show[this.id] = this._show.bind(this);
		this.showTimer = setTimeout("MEPB_show['"+this.id+"']()",0);
	/*}catch(e){
		alert(e.description ? e.description : e.message);
		this.hide();
	}*/
}

MEpopBox.prototype._show = function(){
	/*try{
	*/
		
		this.display();
		
	/*}catch(e){
		alert(e.description ? e.description : e.message);
		this.hide();
	}*/
}



MEpopBox.prototype.hide = function(){

    if (typeof this.showTimer != "undefined")
        clearTimeout(this.showTimer);
    document.body.style.cursor = "";
    MEPB_hide[this.id] = this._hide.bind(this);
    this.toTimer = setTimeout("MEPB_hide['"+this.id+"']()",0);
}

MEpopBox.prototype._hide = function(){

	for (var i=0; i<this.closeEvents.length;i++){
		if (typeof this.closeEvents[i] == "function")
			this.closeEvents[i]();
	}
	if (this.divBox != null )
	    this.divBox.style.display = "none";
	this.hidden = true;
}

MEpopBox.prototype.mover = function(){
    this.show();
}

MEpopBox.prototype.mout = function(){
    this.hide();
}

MEpopBox.prototype.getMousePosition = function(){
    var coords = new Array();
    coords["x"] = this.parentObj.mouseX;
    coords["y"] = this.parentObj.mouseY;
    return coords;
}
MEpopBox.prototype.getRefLeftPoint = function(obj){
	var pos = getPosition(obj);
	var width = MEgetWidth(obj);
	
	return parseInt(pos.x) + parseInt(width);
}

MEpopBox.prototype.getRefTopPoint = function(obj){
	var pos = getPosition(obj);
	return parseInt(pos.y);
}

MEpopBox.prototype.setClosePosition = function(){
    //this.divBox.close.style.marginLeft = cWidth - closeWidth - 20 + "px";
}
MEpopBox.prototype.setPosition = function(){
	
    this.divBox.style.display = "block";
    this.divBox.style.visibility = "hidden";
	
	this.setBoxStyle();
	
    var mouseCoords  = this.getMousePosition();
    var wHeight = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight;
	var wWidth = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth;
    var scrollY = (document.all)?document.documentElement.scrollTop:window.pageYOffset;
    bHeight = MEgetHeight(this.divBox);
    bWidth = MEgetWidth(this.divBox);
	cWidth = MEgetWidth(this.divBoxContent);
	closeWidth = MEgetWidth(this.divBox.close);

	this.setClosePosition();

	var boxStartLeft = 0;
	if (!this.objRef)
		boxStartLeft = mouseCoords["x"] + this.boxOffsetLeft;
	else
		boxStartLeft = this.getRefLeftPoint(this.objRef) + this.boxOffsetLeft;

	var sPositionArrow = 'left';
	// controlla se il box ha lo spazio per essere visualizzato a destra a meno che le impostazioni non lo impongano
	
	var ipoteticLeftPosition;
	if (!this.objRef)
			ipoteticboxStartLeft = mouseCoords["x"] - this.boxOffsetLeft - bWidth;
		else
			ipoteticboxStartLeft = this.getRefLeftPoint(this.objRef) - this.boxOffsetLeft - bWidth - MEgetWidth(this.objRef);
	
	if ( (!this.forceToRight && (boxStartLeft + bWidth > wWidth) && (ipoteticboxStartLeft > 0)) || this.forceToLeft) {
		
			boxStartLeft = ipoteticboxStartLeft + this.boxOffsetLeft; //gli tolgo l'offset
			sPositionArrow = 'right';
	}
	
	this.divBox.style.left = boxStartLeft + "px";
    
	var newPos;
	var clickedY;
	var iHeight;
	if (!this.objRef || (this.objRef.tagName.toLowerCase() == "select")){
		newPos = mouseCoords["y"]  - (bHeight/2);	
		clickedY = mouseCoords["y"];
	}
	else{
		
		iHeight = MEgetHeight(this.objRef);
		
		newPos = this.getRefTopPoint(this.objRef) - scrollY - bHeight/2 + iHeight/2 +5;
		clickedY = this.getRefTopPoint(this.objRef) - scrollY;
	}
	
	
    var diffPos = 0;
	while (newPos + bHeight > wHeight){
        var backupPos = newPos;
        newPos = newPos - 10;
        diffPos = Math.abs(backupPos - newPos);
    }
	
	newPos = newPos + scrollY;
	if (newPos < scrollY){
        var backupPos = newPos;
        newPos = scrollY + 10;
        diffPos = Math.abs(backupPos - newPos);
    }
	
	this.divBox.style.top = newPos + "px";
    this.setArrowPosition(clickedY - newPos + (iHeight ? iHeight/2 : 0) + scrollY + this.arrowOffsetTop, sPositionArrow);
    this.divBox.style.display = "none";
    this.divBox.style.visibility = "visible";
	
}

MEpopBox.prototype.forcePosition = function(pos){
	if (typeof pos == "undefined")
		pos = "left";
	
	if (pos == "right"){
		this.forceToLeft = false;
		this.forceToRight = true;
	}else{
		this.forceToLeft = true;
		this.forceToRight = false;
	}
}

MEpopBox.prototype.setArrowPosition = function(nTop, sPosition){
	
    if (sPosition == 'right') {
        
		//this.divBox.arrow.style.left = ( MEgetWidth(this.divBox) - 21 )+ "px";
		
		var contByCl = getElementsByClass("center_content_cont",this.divBox);
		var cont = contByCl[0];
		this.divBox.arrow.style.left = ( MEgetWidth(cont)) + 9 +"px"; //9 è la larghezza dell'immagine - 2 px per posizionarla sul bordo
		
        this.divBox.arrow.style.backgroundImage = "url('/img2/popBox/arrow_right.png')";
        this.divBox.arrow.style.backgroundPosition = "-2px 0px";
    }else{
		//default
		var contByCl = getElementsByClass("center_content_cont",this.divBox);
		var cont = contByCl[0];
		this.divBox.arrow.style.left =  0 +"px"; //9 è la larghezza dell'immagine - 2 px per posizionarla sul bordo
		
        this.divBox.arrow.style.backgroundImage = "url('/img2/popBox/arrow.png')";
        this.divBox.arrow.style.backgroundPosition = "0px 0px";
	}
    if (typeof nTop != "undefined"){
        if (nTop < 0)
            nTop = 0;
        if (nTop > MEgetHeight(this.divBox))
            nTop = MEgetHeight(this.divBox);
        this.divBox.arrow.style.marginTop = nTop + "px";
        return;
    }
    var mouseCoords  = this.getMousePosition();
    this.divBox.arrow.style.marginTop = MEgetHeight(this.divBox)/2 + "px";
}


MEpopBox.prototype.getBoxHtml = function(nTop){
	var html = ''+
	'<div class="MEPB_PopBox">'+
		'<div class="MEPB_arrow">'+
		'</div>'+
		'<table class="MEPB_content" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">'+
			'<tr>'+
				'<td class="top left"></td><td class="top center"></td><td class="top right"></td>'+
			'</tr>'+
			'<tr>'+
				'<td class="center left"></td>'+
				'<td class="center_content_cont">'+
				'<div class="MEPB_close"><a href="javascript:">chiudi</a></div>'+
				'<div class="center_content"></div>'+
				'</td>'+
				'<td class="center right"></td>'+
			'</tr>'+
			'<tr>'+
				'<td class="bottom left"></td><td class="bottom center"></td><td class="bottom right"></td>'+
			'</tr>'+
		'</table>'+
	'</div>';
	return html;
}

MEpopBox.prototype.exitOnEsc = function(){
    addEvent(document,"keyup", function(e){
		if (this.hideOnEsc){
			var kC  = (window.event) ?    // MSIE or Firefox?
		       window.event.keyCode : (e.keyCode ? e.keyCode : e.which);
			var Esc = (window.event) ?   
			      27 : e.DOM_VK_ESCAPE // MSIE : Firefox
			if(kC==Esc)
			   this.hide();
		}
   }.bind(this));
}

MEpopBox.prototype.setContent = function(htmlContent){
	this.divBoxContent.innerHTML = htmlContent;
	return this;
}

MEpopBox.prototype.getContentElement = function(){
	return this.divBoxContent;
}

MEpopBox.prototype.clearContent = function(){
	this.divBoxContent.innerHTML = "";
	return this;
}

MEpopBox.prototype.appendContentElement = function(oHtmlElement){
	this.divBoxContent.appendChild(oHtmlElement);
	return this;
}

MEpopBox.prototype.destroy = function(){
	this.parentObj.instances[this.divBox.id] = null;
    this.divBox.parentNode.removeChild(this.divBox);
	removeEvent(window,"unload",this.destroy.bind(this))	
	this.purgeDomObj(this.divBox);
    this.cleanVars();
}

MEpopBox.prototype.cleanVars = function(){	
	for (var i in this){
		try{
			if (this[i] && typeof this[i] == "Object"){	
				this.cleanVars(this[i]);
			}else
				this[i] = null;
		}catch(e){
			//alert(e)
		}
	}
}


MEpopBox.prototype.addEventOnClose = function(func){	
	this.closeEvents.push(func);
}

MEpopBox.prototype.removeEventOnClose = function(func){	
	
	for (var i=0; i<this.closeEvents.length;i++)
		if (this.closeEvents[i] == func)
			this.closeEvents[i] = null;
}

MEpopBox.prototype.purgeDomObj = function(d){
//IE memory leak purge
	try{
		if (typeof d == "undefined" || !d){
		  return;
		}
		var a = d.attributes, i, l, n;
		var b = d.childNodes;
		
			for (var i in d){
				if (d[i] && typeof d[i] == "Object"){			
					d.purgeDomObj(d[i]);
				}
			}
		
		
			if (a) {
				l = a.length;
				for (i = 0; i < l; i += 1) {
					n = a[i].name;
					if (typeof d[n] === 'function') {
						d[n] = null;
					}
				}
			}
		
			if (b) {
				l = b.length;
				for (i = 0; i < l; i += 1) {
					
					if (d.childNodes[i]){
						purgeDomObj(d.childNodes[i]);
						d.removeChild(d.childNodes[i]);
					}
				}
				
			}
		d.innerHTML = "";
		d = null;
	}catch(e){
		//_doLog("error:"+e,'error');
	}
}

MEpopBox.prototype.renderVisibleOnPopup = function(func){	
	this.divBox.style.position = "fixed";
	this.divBox.style.zIndex = "301";
	this.forcePopupStyle = true;
}
