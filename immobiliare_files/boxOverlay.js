/*Script per gestione box Overlay (pseudo LightBox)*/
if (!document.getElementById('boxOverlayContainer'))
	document.write("<div id=\"boxOverlayContainer\"></div>");

var boxOverlay = function(idBox,theme,options){
	this.idBox = idBox;	
	this.header = null;
	this.footer = null;
	this.footer_cont = null;
	this.hasFooter = false;
	this.content = null;
	this.closeEvents = null;
	this.showEvents = null;
	this.divBoxOverlay = null;
	this.doubleBorder = false;
	this.divBoxOverlayIframe = null;
	this.boxWrapper = null;
	this.closeButton = null;
	this.bottomBorder = null;
	this.scroll = null;
	this.destroyOnClose = true;
	this.box = null;
	this.theme = theme ? theme.charAt(0).toUpperCase() + theme.substr(1).toLowerCase() : "";
	this.blockScroll = false;
	this.fixedPosition = true;
	this.stop_event_bubbling = false;
	this.stop_event_bubbling_added = false;
	this.fixedCoords = {};
	this.isOpen = false;
	this.firstShow = true;
	this.onlyColoumnCenter = false;
	this.whiteHeader = false;
	this.manageConflicts = true;
	this.zIndex = null;
	this.closeLabel = "Chiudi";
	this.closeLabelTranslate = {"it": "Chiudi", "en": "Close", "es": "Cerrar", "fr": "Fermer", "de": "Schließen", "pt": "Fechar", "gr": "Κλείνω", "ru": "Закрыть"};
	
	if (typeof(options) != "undefined" && typeof(options.lang) != "undefined"){
		this.lang = options.lang;
	} else {
		this.lang = this.getPageLang();
	}

	if (this.lang){
		this.closeLabel = this.closeLabelTranslate[this.lang] ? this.closeLabelTranslate[this.lang] : "Chiudi";
	}

	/**
	 * Se true indica che la chiusura del boxOverlay sara' impedita. Default a false
	 */
	this.avoidClosing = (typeof(options) != 'undefined' && typeof(options.avoidClosing) != "undefined") ? options.avoidClosing : false;
	this.exitOnEsc(this); 
	
	this._hideOnlyBox = false;
	
	addEvent(window,"unload",this.destroy.bind(this))
	
	if (typeof options!="undefined"){
		if (typeof options.onlyColoumnCenter != "undefined" && options.onlyColoumnCenter)
			this.onlyColoumnCenter = true;
			
		if (typeof options.whiteHeader != "undefined" && options.whiteHeader)
			this.whiteHeader = true;
	}
	
	this.init();
	this.isOpen = false;
	
	return this;
};

boxOverlay.prototype.getPageLang = function(){
	if (document.getElementsByTagName('html')[0].getAttribute('lang')){
		return document.getElementsByTagName('html')[0].getAttribute('lang');
	}
}

boxOverlay.prototype.init = function(){
	this.appendCss();
	this.createBox();
	this.initVars();
}

boxOverlay.prototype.initVars = function(){
	if (!this.idBox){
		throw("oggetto istanziato in maniera non corretta. Utilizzare  new boxOverlay('<idBox>')");
		return;
	}
	
	/* gestione closeButton */
	if(!this.avoidClosing){
		this.closeButton = document.getElementById("close_"+this.idBox);
		if (this.closeButton)
			this.closeButton.onclick = this.close.bind(this);
	}
	this.title = document.getElementById(this.idBox+"_title");
	this.footer = document.getElementById(this.idBox+"_footer");
	this.bottomBorder = document.getElementById(this.idBox+"_bottom_border") ? document.getElementById(this.idBox+"_bottom_border") : null;
	this.footer_cont = document.getElementById(this.idBox+"_footer_cont");
	this.divBoxOverlayIframe = document.getElementById("boxOverlayIFrame"+(this.theme ? "_"+this.theme : "")+(this.idBox ? "_"+this.idBox : ""));
	
	this.content = document.getElementById(this.idBox+"_content");
	this.box = document.getElementById(this.idBox);
	
	
	var ovShadow = getElementsByClass("divBoxOverlayShadow"+(this.theme ? "_"+this.theme : ""));
	if (ovShadow.length > 0) {
		this.divBoxOverlay = ovShadow[0];
	}

    /*
    if (this.divBoxOverlay)
        addEvent(this.divBoxOverlay,"click",this.close.bind(this));
    */
    _ovShOnBoxRes = this.reShowOnResize;
    this.addEvent(window,"resize", _ovShOnBoxRes.bind(this));
	
	//if (this.blockScroll){
		addEvent(window,"scroll",this.catchScroll.bind(this))
	//}
}

boxOverlay.prototype.close = function(){
	if (this.closeEvents && !this.avoidClosing){
		for (var i=0; i<this.closeEvents.length; i++){
			this.closeEvents[i]();
		}	
	}
    if(!this.avoidClosing){
		if (!this._hideOnlyBox && this.hide)
			this.hide();
		else
        if (this.hideOnlyBox)
			this.hideOnlyBox();

		if (this.destroyOnClose){
			this.destroy();
		}
	}
}

boxOverlay.prototype.createBox = function(){
	if (document.getElementById(this.idBox)){
		document.getElementById(this.idBox).parentNode.removeChild(document.getElementById(this.idBox));
		//throw("overlayBox con nome '" + this.idBox +"' esistente");
		//return;
	}
	if (!this.idBox){
		throw("oggetto istanziato in maniera non corretta. Utilizzare  new boxOverlay('<idBox>')");
		return;
	}
	var divBoxOverlayShadowClassSelector = "divBoxOverlayShadow"+(this.theme ? "_"+this.theme : "");
	var ovShadow = getElementsByClass(divBoxOverlayShadowClassSelector);
	
	if (!ovShadow.length){
		var html = "<div class=\""+divBoxOverlayShadowClassSelector+" divBoxOverlay"+(this.theme ? "_"+this.theme : "")+"\"></div>";
		var oDiv = document.createElement("div");
		oDiv.innerHTML = html;
		this.divBoxOverlay = oDiv;
		document.getElementById("boxOverlayContainer").appendChild(oDiv);
		
	}else{
		this.divBoxOverlay = ovShadow[0];
	}
	
	if (!document.getElementById("boxOverlayIFrame"+(this.theme ? "_"+this.theme : "")+(this.idBox ? "_"+this.idBox : ""))){
		var iframeHTML = "<iframe id=\"boxOverlayIFrame"+(this.theme ? "_"+this.theme : "")+(this.idBox ? "_"+this.idBox : "")+"\" class=\"boxOverlayIFrame"+(this.theme ? "_"+this.theme : "")+"\" src=\"about:blank\" style=\"z-index:101;display:none;border:none;\" border=\"none\" scrolling=\"no\"  frameborder=\"0\" vspace=\"0\" hspace=\"0\" marginheight=\"0\" marginwidth=\"0\"></iframe>";
		var oDiv = document.createElement("div");
		oDiv.innerHTML = iframeHTML;
		document.getElementById("boxOverlayContainer").appendChild(oDiv);
	}
	html = this.getBox();

	this.boxWrapper = document.createElement("div");
	this.boxWrapper.id = "boxOverlayWrap_"+this.idBox;
	this.boxWrapper.innerHTML = html;
	document.getElementById("boxOverlayContainer").appendChild(this.boxWrapper);

}

boxOverlay.prototype.appendCss = function(){
	if (!document.getElementById('overlayCss_'+this.theme)){
		var headID = document.getElementsByTagName("head")[0];         
		var cssNode = document.createElement('link');
		cssNode.type = 'text/css';
		cssNode.rel = 'stylesheet';
		cssNode.id = 'overlayCss_'+this.theme;
		cssNode.href = '/includes/overlayBox/boxOverlay'+(this.theme ? this.theme : "")+'.css' + (typeof __gvs_EXTERNAL_LIBRARY_VERSION != 'undefined' ? __gvs_EXTERNAL_LIBRARY_VERSION : '');
		cssNode.media = 'screen';
		headID.appendChild(cssNode);
	}
}

boxOverlay.prototype.catchScroll = function(){
	if (this.blockScroll && this.scroll)
		Page.scroll(this.scroll);
	}

boxOverlay.prototype.show = function(){

	if (!this.idBox || !this.box){
		throw("box non presente");
		return;
	}
	if (typeof reshow == "undefined") {
		reshow = false;
	}
	if (this.stop_event_bubbling && !this.stop_event_bubbling_added){
		this.stop_event_bubbling_added = true;
		addEvent( this.box , "click",  stop_event_bubbling) 
		addEvent( this.divBoxOverlay , "click",  stop_event_bubbling)
	}
	
	if (this.hasFooter){
		this.footer_cont.style.display="";
	}else{
		if (document.getElementById(this.idBox+"_pop_content") && this.firstShow){
			document.getElementById(this.idBox+"_pop_content").className += " ov_white_border";
		}		
	}
	
	if (this.firstShow){
		//addEvent(window,"load",this.show.bind(this))
		this.firstShow = false;
	}
	
	if (this.doubleBorder)
		document.getElementById(this.idBox+"_doubledBorder").style.padding="10px";
		
	var pWidth = document.body.clientWidth ? document.body.clientWidth : document.documentElement.clientWidth;
	var pHeight = document.body.clientHeight ? document.body.clientHeight : document.documentElement.clientHeight;
	
	var sWidth = window.innerWidth ? window.innerWidth : (document.documentElement.clientWidth ? document.documentElement.clientWidth : pWidth);
	var sHeight = window.innerHeight ? window.innerHeight : (document.documentElement.clientHeight ? document.documentElement.clientHeight : pHeight);
    
	this.box.style.position = "absolute";
	
	var divWidth = MEgetWidth(this.box);
	var divHeight = MEgetHeight(this.box);
	
	
	//Se la risoluzioni è ugale o più piccola della dimensione del box
    if ( sWidth <= divWidth || sHeight <= divHeight ) {		
        this.fixedPosition = false;
    }
    
	var info = this._getBrowser();
	if (info && info["name"].search(/explorer/i) && info["version"] < 9) {
		if (parseInt(pHeight) == parseInt(sHeight)) {
			this.fixedPosition = false;
			this.divBoxOverlay.style.position = "absolute";
			this.divBoxOverlay.style.zIndex = 101;
		}
	}
	
	if (this.zIndex)
		this.box.style.zIndex = this.zIndex;
	
	if (this.fixedPosition)
		this.box.style.position = "fixed";
	
	var IE6 = false /*@cc_on || @_jscript_version < 5.7 @*/;
	if (IE6)
		this.box.style.position = "absolute";
	
	var scrolly = 0;
	if (!this.fixedPosition)
		scrolly = (document.all)?document.documentElement.scrollTop:window.pageYOffset;
	this.scroll=Page.scroll();
	this.divBoxOverlay.style.top =  "0px";
	/*if (pHeight > sHeight)
		this.divBoxOverlay.style.height = pHeight + "px";
	else
	*/
		this.divBoxOverlay.style.height = sHeight + "px";
	
	/*if (parseInt(sWidth) <= 1024){
		this.divBoxOverlay.style.width = "993px";
	}else{
	*/
		this.divBoxOverlay.style.width = "100%";
	//}
	
	this.divBoxOverlay.style.display="block";
	var top;
	if (!this.fixedCoords.top){
      top = scrolly + (sHeight/2 - divHeight/2);
      /*if (top<175) top = 175;*/
	}else
		top = scrolly + this.fixedCoords.top;
	
	if (sHeight<=divHeight)
		top = scrolly + 5;
		
	top+="px";

	var left
	if (!this.fixedCoords.left){
		left = (sWidth/2 - divWidth/2);
	}else{
		left = this.fixedCoords.left;
	}
	left+="px";
	
	var iFrame = this.divBoxOverlayIframe;
	if (this.fixedPosition)
		iFrame.style.position = "fixed";
	else	
		iFrame.style.position = "absolute";
	var IE6 = false /*@cc_on || @_jscript_version < 5.7 @*/;
	if (IE6)
		iFrame.style.position = "absolute";
	
	iFrame.style.height = divHeight + "px";
	iFrame.style.width = divWidth + "px";
	iFrame.style.left = left;
	iFrame.style.top = top;
	var IE6 = false /*@cc_on || @_jscript_version < 5.7 @*/;
	if (IE6)
		iFrame.style.display="inline";
	else
		iFrame.style.display="none";	

	document.getElementById(this.idBox).style.top = top;
	document.getElementById(this.idBox).style.left = left;

	if (this.manageConflicts)
		this.manageConflictComponents('hide');
	
	if (document.getElementById(this.idBox).style.display!="block") {
		this.isOpen = true;
		document.getElementById(this.idBox).style.visibility="visible";
		document.getElementById(this.idBox).style.display="block";
	}
	
	try{
		if (this.showEvents){
			for (var i in this.showEvents){
				this.showEvents[i]();
			}	
		}
	}catch(e){
	
	}
}

/* Nascondo i frame perchè i contentuti flash esterni non settati con wmode transparent vengono al di sopra del box overlay */
boxOverlay.prototype.manageConflictComponents = function(action){
	var Iframes = document.getElementsByTagName('iFrame');
	switch (action){
		case 'hide':
			var IntIframes = _getElementsByTagName('iFrame',document.getElementById(this.idBox));
			for (i=0; i< Iframes.length;i++){
				var skipConflict = Iframes[i].getAttribute('skipOverlayManageConflict');
				
				if (!skipConflict && Iframes[i]!=this.divBoxOverlayIframe && !in_array(Iframes[i],IntIframes)){										
					Iframes[i].style.visibility = 'hidden';
				}
			}
			break;
			
		case 'show':
			var IntIframes = _getElementsByTagName('iFrame',document.getElementById(this.idBox));
			for (i=0; i< Iframes.length;i++){
				var skipConflict = Iframes[i].getAttribute('skipOverlayManageConflict');
				
				if (!skipConflict && Iframes[i]!=this.divBoxOverlayIframe && !in_array(Iframes[i],IntIframes)){					
					Iframes[i].style.visibility = 'visible';
				}
			}
			break;
	}
}

boxOverlay.prototype.checkExitBtn = function(e){
		var kC  = (window.event) ?    // MSIE or Firefox?
	           window.event.keyCode : (e.keyCode ? e.keyCode : e.which);
		var Esc = (window.event) ?   
	          27 : e.DOM_VK_ESCAPE // MSIE : Firefox  
		if(kC==Esc){
			if (this.close)
			  this.close();
		}
   }
boxOverlay.prototype._reShowOnResize = function(){
	if (document.getElementById(this.idBox).style.display=="block"){
		this.show();
	}
}

boxOverlay.prototype.reShowOnResize = function(){
	if (typeof this.resizeTimeout != "undefined")
		clearTimeout(this.resizeTimeout);
	try{
		this.resizeTimeout = setTimeout(this._reShowOnResize.bind(this),100);
	}	catch(e){
	
	}
}

   
boxOverlay.prototype.hideOnlyBox = function(){
	
	if (!this.idBox || !document.getElementById(this.idBox)){
		throw("box non presente");
		return;
	}
	this.box.style.display="none";
	this.isOpen = false;
	
}
   
boxOverlay.prototype.hide = function()
{
		
		var idBox;
		var closeEvent;
		//removeEvent(document,"keyup", this.checkExitBtn.bind(this));
		this.scroll = null;
	
		idBox = this.idBox;
		closeEvent = this.closeEvent ? this.closeEvent : null;
		
		if (!idBox || !document.getElementById(idBox)){
			throw("box non presente");
			return;
		}

		this.divBoxOverlay.style.display="none";
		this.divBoxOverlayIframe.style.display="none";
		if (this.manageConflicts)
			this.manageConflictComponents('show');
		this.box.style.display="none";
		this.isOpen = false;
		
		/*if (this.stop_event_bubbling){
			setTimeout(function(){
					try{
						removeEvent( this.box , "click",  stop_event_bubbling) 
						removeEvent( this.divBoxOverlay , "click",  stop_event_bubbling)
					}catch(e){
						
					}
				}.bind(this),1000);
		}*/
	}

boxOverlay.prototype.setTitle = function(headerContent){
	if (!this.idBox || !this.box){
		throw("box non presente");
		return;
	}
	this.title.innerHTML = headerContent; 
	
}
boxOverlay.prototype.setFooter = function(footerContent){
	
	if (!this.idBox || !this.box){
		throw("box non presente");
		return;
	}
	if (typeof footerContent == "undefined" || !footerContent){
		this.hasFooter = false;
	}else{
		this.hasFooter = true;
	}
	this.footer.innerHTML = footerContent;
}
boxOverlay.prototype.setContent = function(bodyContent){
	if (!this.idBox || !this.box){
		throw("box non presente");
		return;
	}
	this.content.innerHTML = bodyContent;
	if (this.isOpen){
		this.hide();
        this.show();
    }
}

boxOverlay.prototype.getContent = function(){
	
	return this.content.innerHTML; 
}
boxOverlay.prototype.addEventOnClose = function(func){

	if (!this.closeEvents)
		this.closeEvents = new Array();
	if(!this.avoidClosing)
		this.closeEvents.push(func);
}

boxOverlay.prototype.addEventOnShow = function(func, idHandler){
	
	if (!this.showEvents)
		this.showEvents = new Array();
	if (typeof idHandler != 'undefined')
		this.showEvents[idHandler] = func;
	else
		this.showEvents.push(func);
}

boxOverlay.prototype.resetEventsOnShow = function(){
	this.showEvents = new Array();
}

boxOverlay.prototype.removeEventOnClose = function(func){
	if (this.closeEvents){
		for (var i=0; i<this.closeEvents.length; i++){
			if (this.closeEvents[i] == func){
				this.closeEvents[i] = function(){};
			}
		}	
	}
}

boxOverlay.prototype.resetEventsOnClose = function(){
	if (this.closeEvents){
		this.closeEvents = new Array();
	}
}

boxOverlay.prototype.removeEventOnShow = function(idHandler){
	if (this.showEvents){
		for (var i in this.showEvents){
			if (i == idHandler){
				this.showEvents[i] = function(){};
			}
		}	
	}
}


boxOverlay.prototype.destroy = function(){
	
	try{
		if (!this.idBox || !this.box){
			throw("box non presente");
			return;
		}
		this.box.parentNode.removeChild(this.box);
		removeEvent(window,"unload",this.destroy.bind(this));
		this.purgeDomObj(this.boxWrapper);
		this.cleanVars();
	}catch(e){
		//alert(e);
	}
}

boxOverlay.prototype.exitOnEsc = function(obj){
	this.addEvent(document,"keyup", this.checkExitBtn.bind(this));
}

boxOverlay.prototype.addEvent = function(obj,ev,fn){
	if(obj.addEventListener) {
		// metodo w3c
		obj.addEventListener(ev, fn, false);
	} else if(obj.attachEvent) {
		// metodo IE
		obj.attachEvent('on'+ev, fn);
	} else {
		// se i suddetti metodi non sono applicabili
		// se esiste gia' una funzione richiamata da quel gestore evento
		if(typeof(obj['on'+ev])=='function'){
			// salvo in variabile la funzione gia' associata al gestore
			var f=obj['on'+ev];
			// setto per quel gestore una nuova funzione 
			// che comprende la vecchia e la nuova
			obj['on'+ev]=function(){if(f)f();fn()}
		}
		// altrimenti setto la funzione per il gestore
		else obj['on'+ev]=fn;
	}
}

boxOverlay.prototype.getPosition = function(){
	var position=new Object();
	position.top = this.box.style.top;
	position.left = this.box.style.left;
	return position;
}

boxOverlay.prototype.setPosition = function(obj){
	
	this.fixedCoords = {};

	if (typeof obj != "object" || (!obj.top && !obj.left)){
		return;
	}
	
	if (!obj.top && !obj.left)
		return;
	
	if (obj.top)
		this.fixedCoords.top = parseInt(obj.top);
		
	if (obj.left)
		this.fixedCoords.left = parseInt(obj.left);
	
}

boxOverlay.prototype.getBox = function(){
	var html = "";
	
	switch (this.theme){
		case "Grey" :
			return this.greyBox();
			break;
		default :
			return this.defaultBox();
	}
	
}

boxOverlay.prototype.defaultBox = function(){
var html = "<div style=\"display:none\" id=\""+this.idBox+"\" class=\"boxOverlay"+(this.theme ? "_"+this.theme : "")+"\">"+
"	<table  cellspacing=\"0\" cellpadding=\"0\" border=\"0\" >"+
"		<tr>"+
"			<td class=\"pop_topleft \"></td>"+
"			<td class=\"pop_borderTop\"></td>"+
"			<td class=\"pop_topright\"></td>"+
"		</tr>"+
"		<tr>"+
"			<td class=\"pop_borderLateral\"></td>"+
"			<td class=\"pop_content\" style=\"\">"+
"				<div id=\""+this.idBox+"_doubledBorder\" class=\"doubleBorder\">"+
"				<div class=\"boxHeader\">"+
"					<div id=\""+this.idBox+"_title\" class=\"title\">"+
"					</div>";

if(!this.avoidClosing){
html += "			<a id=\"close_"+this.idBox+"\" class=\"closeButton\">"+ this.closeLabel + "&nbsp;</a>";
}
html += "			<div style=\"clear:both\"></div>"+
"				</div>"+


"					<div id=\""+this.idBox+"_content\" class=\"boxBody\">"+
"					</div>"+

		
"				</div>"+
"				<div id=\""+this.idBox+"_footer_cont\" class=\"boxFooter\" style=\"display:none\">"+
"					<div id=\""+this.idBox+"_footer\">"+
"					</div>"+
"					<div style=\"clear:both\"></div>"+
"			</div>"+
			"</td>"+
"			<td class=\"pop_borderLateral\"></td>"+
"		</tr>"+
"		<tr>"+
"			<td class=\"pop_bottomleft\"></td>"+
"			<td class=\"pop_borderTop\"></td>"+
"			<td class=\"pop_bottomright\"></td>"+
"		</tr>"+
"</table>"+
"</div>";

return html;
}

boxOverlay.prototype.greyBox = function(){

var bgColor = this.whiteHeader ? 'style="background: none repeat scroll 0 0 #FFFFFF;"' : '';
var tlClass = this.whiteHeader ? 'tlWhite' : '';
var trClass = this.whiteHeader ? 'trWhite' : '';

var html = "<div style=\"display:none\" id=\""+this.idBox+"\" class=\"boxOverlay"+(this.theme ? "_"+this.theme : "")+"\">"+
"	<table  cellspacing=\"0\" cellpadding=\"0\" border=\"0\" >"+
"		<tr class=\"pop_headerCont\">"+
"			<td class=\"\" style=\"\" >"+
"				<div class=\"boxHeader\" "+bgColor+">"+
"					<div class=\"pop_centerTitleContent\" "+bgColor+">"+
"						<div id=\""+this.idBox+"_title\" class=\"title\"></div>";
if(!this.avoidClosing){
html += "				<a id=\"close_"+this.idBox+"\" class=\"closeButton\">"+ this.closeLabel + "&nbsp;</a>";
}
html += "				<div class='clear'></div>"+
"					</div>"+
"				</div>"+
"			</td>"+
"		</tr>"+
"		<tr class=\"content_row\">";

	if ( !this.onlyColoumnCenter ) {
		html +="<td class=\"pop_content\" id=\""+this.idBox+"_pop_content\">"+
		"			<div id=\""+this.idBox+"_content\" class=\"boxBody\">"+
		"			</div>"+
		"		</td>";
	} else {
		html +="<td class=\"pop_content\" colspan=\"3\" style=\"padding:0\" id=\""+this.idBox+"_pop_content\">"+
		"			<div id=\""+this.idBox+"_content\" class=\"boxBody\">"+
		"			</div>"+
		"		</td>";
	}
	
	html +=""+
"		</tr>"+
"		<tr>"+
"			<td>"+
"				<div class=\"boxFooter pop_footerCont\" id=\""+this.idBox+"_footer_cont\" style=\"display:none\">"+
"					<div  cellspacing=\"0\" cellpadding=\"0\" border=\"0\">"+
"						<div>"+
"							<div class=\"pop_centerTitleContent\"><div id=\""+this.idBox+"_footer\" class=\"title\"></div></div>"+
"						</div>"+
"					</div>"+
"					<div style=\"clear:both\"></div>"+
"				</div>"+
"				<div style=\"clear:both\"></div>"+
"			</td>"+	
"		</tr>"+
/*"		<tr>"+
"			<td class=\"pop_borderBottom\"><div id=\""+this.idBox+"_bottom_border\" class=\"ov_white_border\"></div></td>"+
"		</tr>"+
*/
"	</table>"+
"</div>";

return html;
}

boxOverlay.prototype.setHideOnlyBox = function(hideOnly) {
	this._hideOnlyBox = hideOnly;
}

boxOverlay.prototype.cleanVars = function(){	
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

boxOverlay.prototype.purgeDomObj = function(d){
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
		d.parentNode.removeChild(d);
		d = null;
	}catch(e){
		
		//_doLog("error:"+e,'error');
	}
}


boxOverlay.prototype._getBrowser = function(){	
	try{
		var info = Array();
		var browser=navigator.appName;
		info["name"] = info[0] = browser;
    
		var b_version=navigator.appVersion;
		var version = "";

		if (browser.toLowerCase().search(/explorer/)>=0){
			var x = b_version.split(';');
			var version=parseInt(x[1].split(" ")[2]);
		}else{
			var x = b_version.split(' ');
			var version=parseInt(x[0]);
		}
		info["version"] = info[1] = version;
		
		return info;
	}catch(e){
		return null;
	}
	
}
