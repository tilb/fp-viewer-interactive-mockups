var __debugging_doLog = true;

/* *********************************************************************************************** */

// Oggetto per interazioni MEAjax

function getMEAjaxObj(){
    var MEAjax = new Object();
    MEAjax.isUpdating = true;


    MEAjax.Request = function(method, url, callback, async )
    {
	this.url = url;
	this.sendData = url;
	this.isUpdating = true;
	this.callbackMethod = callback;
	this.request = (window.XMLHttpRequest)? new XMLHttpRequest(): new ActiveXObject("MSXML2.XMLHTTP");

	if ( typeof async == 'undefined' )
		async = true;

	this.request.onreadystatechange = function() { MEAjax.checkReadyState(); };
	if (method == "POST"){
	    var nPos = url.search(/\?/);
	    this.sendData = "";
	    if (nPos >= 0) {
    	    this.url = url.substr(0, nPos);
    	    this.sendData = url.substr(nPos + 1);

	    }

        //alert("ORIGINAL URL: " + url + "\nURL:" + this.url + "\nDATA: " + this.sendData + "\nLENGTH: " + this.sendData.length);

	    this.request.open(method, this.url, async);
	    this.request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	    //this.request.setRequestHeader("Content-length",this.sendData.length);
	    //this.request.setRequestHeader("Connection","close");
	}else{
	    this.request.open(method, this.url, async);
	}
	this.request.send(this.sendData);
    };


    MEAjax.checkReadyState = function(_id){
	switch(this.request.readyState)
	{
	    case 1: break;
	    case 2: break;
	    case 3: break;
	    case 4:
		this.isUpdating = false;
		this.callbackMethod(this.request);
	}
    };

    MEAjax.updateHTML = function(method, url, idElement){
	this.url = url;
	this.sendData = url;
	this.isUpdating = true;
	this.callbackMethod = function(doc){document.getElementById(idElement).innerHTML = doc.responseText;};
	this.request = (window.XMLHttpRequest)? new XMLHttpRequest(): new ActiveXObject("MSXML2.XMLHTTP");

	this.request.onreadystatechange = function() { MEAjax.checkReadyState(); };
	if (method == "POST"){
	    var nPos = url.search(/\?/);
	    this.sendData = "";
	    if (nPos >= 0) {
    	    this.url = url.substr(0, nPos);
    	    this.sendData = url.substr(nPos + 1);
	    }

        //alert("ORIGINAL URL: " + url + "\nURL:" + this.url + "\nDATA: " + this.sendData + "\nLENGTH: " + this.sendData.length);

	    this.request.open(method, this.url, true);
	    this.request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	    this.request.setRequestHeader("Content-length",this.sendData.length);
	    this.request.setRequestHeader("Connection","close");
	}else{
	    this.request.open(method, this.url, true);
	}
	this.request.send(this.sendData);
    };
    return MEAjax;
}
/* *********************************************************************************************** */

/*
	@obj oggetto dom
	@ev quale avento registrare (click,mouseover,mouseout....)
	@fn handler a funzione da eseguire al catch dell'evento
	@captureMethod true=capturingEventMethod, false bubblingEventMethos
*/
function addEvent(obj,ev,fn,captureMethod){

	if (typeof obj=="undefined" || !obj)
		return;

	try{
		removeEvent(obj,ev,fn);
	}catch(e){
		//no event to remove
	}

	if (typeof captureMethod == "undefined")
		captureMethod = false;

	if(obj.addEventListener){
		// metodo w3c
		obj.addEventListener(ev, fn, captureMethod);
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
			obj['on'+ev]=function(){if(f)f();fn();};
		}
		// altrimenti setto la funzione per il gestore
		else obj['on'+ev]=fn;
	}
}

function removeEvent(obj,ev,fn,captureMethod){
	if (typeof captureMethod == "undefined")
		captureMethod = false;
  if(obj.removeEventListener)
	obj.removeEventListener(ev,fn,captureMethod);
  else if(obj.detachEvent){
    obj.detachEvent('on'+ev,fn);
    obj['on'+ev]=null;
    obj['on'+ev]=null;
  }
}

/* *********************************************************************************************** */
//ricerca elementi in base alla classe

function getElementsByClass(searchClass,node,tag) {
	var classElements = new Array();
	if ( node == null )
		node = document;
	if ( tag == null )
		tag = '*';
	var els = node.getElementsByTagName(tag);
	var elsLen = els.length;
	var pattern = new RegExp("(^|.*[\\s]+)"+searchClass+"([\\s]+.*|$)");
	for (var i = 0, j = 0; i < elsLen; i++) {
		if ( pattern.test(els[i].className) ) {
			classElements[j] = els[i];
			j++;
		}
	}

	return classElements;
}



/*
	restituisce un array di elementi che coincidono con il prametro tagl contenuti nel nodo node
*/
function _getElementsByTagName(tag,node) {
	var classElements = new Array();
	if ( node == null )
		node = document;
	if ( tag == null )
		tag = '*';
	var els = node.getElementsByTagName(tag);

	return els;
}

/* *********************************************************************************************** */

/*
function hide(el){
    el.style.display='none';
}
function show(el){
    el.style.display='block';
}
*/

function hideClass(className){
	var els = getElementsByClass(className);
	for (i=0;i<els.length;i++)
		els[i].style.display = "none";
}
function showClass(className){
	var els = getElementsByClass(className);
	for (i=0;i<els.length;i++)
		els[i].style.display = "";
}
/* ********************************************************************************************** */

// elimina spazi prima e dopo di una stringa

function trim(stringa){
	if (typeof stringa != "number" && typeof stringa != "object")
		return stringa.replace(/^\s*/, '').replace(/\s*$/, '');
	else
		return stringa;
}

function trim2(stringa,symbol){
	if (typeof stringa == "number" || typeof stringa == "object")
		return stringa;

	if (!!symbol){
		if (typeof symbol == "string"){
			var x = new RegExp("^["+symbol+"]*","");
			var y = new RegExp("["+symbol+"]*$","");
			return stringa.replace(x, '').replace(y, '');
		}
		else
			if (typeof symbol[0] != "undefined"){
				for (var i=0;i<symbol.length;i++){
				var x = new RegExp("^"+symbol[i]+"*","ig");
				var y = new RegExp(""+symbol[i]+"*$","ig");
				return_string =  stringa.replace(x, '').replace(y, '');
		}
		return return_string;
		}
	}
	return stringa.replace(/^\s*/, '').replace(/\s*$/, '');
}

/* ********************************************************************************************** */

function evidenzia(img,valore){
	img.style.opacity = valore/10;
	img.style.filter = 'alpha(opacity=' + valore*10 + ')';
}


function showAlertTip(message,type,closeAfter,top){

	if (typeof message=="undefined" || message == ''){
		if (typeof _msg_tip!="undefined")
			_msg_tip.parentNode.removeChild(_msg_tip);
		return;
	}
	if (typeof top!="undefined")
		top = parseInt(top) + "px";
	else
		top = "10px";
	if (typeof type== "undefined"){
		type = "info";
	}

	if (typeof _msg_tip == "undefined"){
		_msg_tip = document.createElement("div");
		_msg_tip.className = "top_message_tip";
	}
	switch (type){
		case "error":
			_msg_tip.style.backgroundColor="red";
			//_msg_tip.style.backgroundImage="url(/img2/transparent_red.png)";
			break;

		default:
			_msg_tip.style.backgroundColor="green";
			//_msg_tip.style.backgroundImage="url(/img2/transparent_green.png)";

			break;
	}

	if (typeof _msg_tip_timer!="undefined")
		clearTimeout(_msg_tip_timer);

	_msg_tip.style.padding="10px 10px 10px 10px";
	_msg_tip.style.color="#FFF";
	_msg_tip.style.position="fixed";
	_msg_tip.style.top=top;

	_msg_tip.style.zIndex="999";
	_msg_tip.style.border="2px solid #AEAEAE";
	_msg_tip.innerHTML=message;
	_msg_tip.visibility="hidden";

	_msg_tip.style.fontWeight="bold";
	_msg_tip.style.fontSize="15px";
	_msg_tip.style.textAlign = "center";
	document.body.appendChild(_msg_tip);

	var sWidth = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth;
	var tWidth = MEgetWidth(_msg_tip);


	_msg_tip.style.left= sWidth/2 - tWidth/2 - 4 + "px";

	MEfadeIn(_msg_tip);
	if (typeof closeAfter=="undefined" || !closeAfter){
		closeAfter = 5000;
	}
	if (closeAfter)
		_msg_tip_timer = setTimeout(function(){MEfadeOut(_msg_tip);},closeAfter);

}


function popUp(url){
	window.open(url,'','toolbar=no,scrollbars=1');
}

function popup(page,title,width,height){
var win=null;
var winl='';
var wint='';

if (width)
	winl = (screen.width-width)/2;
if (height)
	wint = (screen.height-height)/2;

 params = "toolbar=0,";

params += "location=0,";

params += "directories=0,";

params += "status=0,";

params += "menubar=0,";

params += "titlebar=0,";

params += "scrollbars=1,";

params += "resizable=0,";

params += "top="+wint+",";

params += "left="+winl+",";

params += "width="+width+",";

params += "height="+height;
win=window.open(page,title,params);
return win;
}

function qsFromForm(form)
{

    var params = "";
    var length = form.elements.length;
    for( var i = 0; i < length; i++ )
    {

	element = form.elements[i];
	if (!element.name)
		continue;

	if (params == '')
	    parSep = "?";
	else
	    parSep = "&";

	if(element.tagName.toLowerCase() == 'textarea' )
        {
                params+=parSep+element.name+"="+Url.encode(element.value);

        }
        else if( element.tagName.toLowerCase() == 'input' )
        {
                if( element.type == 'text' || element.type == 'hidden' || element.type == 'password' || element.type == 'email')
                {
                        params+=parSep+element.name+"="+Url.encode(element.value);
                }
                else if( element.type == 'radio' && element.checked )
                {
                        if( !element.value )
                                params+=parSep+element.name+"="+"on";
                        else
                                params+=parSep+element.name+"="+Url.encode(element.value);

                }
                else if( element.type == 'checkbox' )
                {
                        if(element.checked)
                            params+=parSep+element.name+"="+Url.encode(element.value);
						//else
						//    params+=element.name+"="+"";

                }

        }else if (element.tagName.toLowerCase()=="select"){
	    if(element.type=="select-one"){
		if (element.selectedIndex>=0)
		    params += parSep+element.name+"="+Url.encode(element.options[element.selectedIndex].value);
	    }
	}
    }
    return params;

}

function emptyForm(form)
{
    var length = form.elements.length;
    for( var i = 0; i < length; i++ )
    {

    element = form.elements[i];
	if(element.tagName.toLowerCase() == 'textarea' )
        {
                element.innerHTML = "";
        }
        else if( element.tagName.toLowerCase() == 'input' )
        {
                if( element.type == 'text' || element.type == 'hidden' || element.type == 'password' || element.type == 'email')
                {
                        element.value = "";
                }
                else if( element.type == 'radio' && element.checked )
                {
                        element.checked = false;

                }
                else if( element.type == 'checkbox' )
                {
                        element.checked = false;
                }

        }else if (element.tagName.toLowerCase()=="select"){
	    if(element.type=="select-one"){
			element.value = "";
		    element.selectedIndex = 0;
		}
	}
    }
    return true;

}


function emptyField(element)
{
	if (!element)
		throw("missing required parameter for function emptyField");
	if(element.tagName.toLowerCase() == 'textarea' )
        {
                element.innerHTML = "";

        }
        else if( element.tagName.toLowerCase() == 'input' )
        {
                if( element.type == 'text' || element.type == 'hidden' || element.type == 'password' || element.type == 'email')
                {
                        element.value = "";
                }
                else if( element.type == 'radio' && element.checked )
                {
                        element.checked = false;

                }
                else if( element.type == 'checkbox' )
                {
                        element.checked = false;
                }

        }else if (element.tagName.toLowerCase()=="select"){
	    if(element.type=="select-one"){
			element.value = "";
		    element.selectedIndex = 0;
		}
	}

    return true;

}


function checkUrl(url) {

	var urlRegEx = /^(http(s)?:\/\/)([a-z0-9-]+)(\.[a-z0-9-]+)*(\:[0-9]+)*(\/.*)?$/ig;
	url = url.toLowerCase();
	if (!url.match(urlRegEx)) return false;
	 else return true;
}

function checkEmail(email) {

//var emailRegEx = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

var emailRegEx = /^[a-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/ig;
email = email.toLowerCase();
if (!email.match(emailRegEx)) return false;
 else return true;
}
//definisco un alias per la funzione di verifica email
isEmail = checkEmail;

function getValue(name)
{
    var str=window.location.search;
    if (str.indexOf(name)!=-1){
      var pos_start=str.indexOf(name)+name.length+1;
      var pos_end=str.indexOf("&",pos_start);
      if (pos_end==-1){
	 return str.substring(pos_start);
      }else{
	 return str.substring(pos_start,pos_end);
      }
   }else{
      return null;
 }
}

function createCookie(name,value,days,hours,mins) {
	var interval=0;
        if (typeof days != "undefined" && days!='')  interval = interval + (parseInt(days) * 24 * 60 * 60);
        if (typeof hours != "undefined" && hours!='')  interval = interval + (parseInt(hours) * 60 * 60);
        if (typeof mins != "undefined" && mins!='')  interval = interval + (parseInt(mins) * 60);

        if (interval>0){
            interval = interval * 1000;
		var date = new Date();
		date.setTime(date.getTime()+interval);
		var expires = "; expires="+date.toGMTString();
        }
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function deleteCookie(name) {
	var date = new Date();
	var expires = "; expires="+date.toGMTString();
	value = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function getCookie(c_name)
{
var i,x,y,ARRcookies=document.cookie.split(";");
for (i=0;i<ARRcookies.length;i++)
{
  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
  x=x.replace(/^\s+|\s+$/g,"");
  if (x==c_name)
    {
    return unescape(y);
    }
  }
}

/**
 * Metodo che verifica se i cookie sono attivi
 */
function checkCookiesEnabled() {
	createCookie( 'checkCookie', '1') ;
	if ( !readCookie("checkCookie") ) {
		return false;
	} else {
		deleteCookie( "checkCookie");
		return true;
	}
}

/************** URL UTF8 ENCODE E DECODE ************************/

var Url = {

    // public method for url encoding
    encode : function (string) {
		return encodeURIComponent(string);
        //return encodeURIComponent(this._utf8_encode(string));
    },

    // public method for url decoding
    decode : function (string) {
		return decodeURIComponent(string);
        //return this._utf8_decode(decodeURIComponent(string));
    },

	// public method for absolutizing an url
	absolute : function (url) {
		if (url.match(/^http:\/\//) || url.match(/^https:\/\//)) {
			return url;
		}
		if (url.charAt(0) != "/") {
			var path = window.location.pathname;
			if (path.charAt(path.length-1) != "/") {
				components = path.split("/");
				path = components.splice(0, components.length-1).join("/") + "/";
			}
			url = path + url;
		}
		return window.location.protocol+"//"+window.location.host+url;
	},

    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = 0;
		var c1 = 0;
		var c2 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

};


/* Base 64 encode/decode */

/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/

var Base64 = {

	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = 0;
		var c1 = 0;
		var c2 = 0;

		while ( i < utftext.length ) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}

};

/***************  AGGIUNGI CSS RUNTIME ******************/

function appendCss(file,idCss){
    var headID = document.getElementsByTagName("head")[0];
    var cssNode = document.createElement('link');
    cssNode.type = 'text/css';
    cssNode.rel = 'stylesheet';
    if (typeof idCss !="undefined" && idCss!="")
	cssNode.id = idCss;
    else
    	idCss = file;
    cssNode.href = file + (typeof __gvs_EXTERNAL_LIBRARY_VERSION != 'undefined' ? __gvs_EXTERNAL_LIBRARY_VERSION : '');
    cssNode.media = 'screen';
    if (!document.getElementById(idCss))
		headID.appendChild(cssNode);
}

/************** RESTITUISCE INFO SUL BROWSER ********************/

function getBrowser(){
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

var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "UNKNOW_BROWSER";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "UNKNOW_VERSION";
		this.OS = this.searchString(this.dataOS) || "UNKNOW_OS";
		
		return this;
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// Netscapes(6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		//Netscapes(4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{	   
			string: navigator.userAgent,
			subString: "iPad",
			identity: "iPad"
	    },
		{		// Android
			string: navigator.userAgent,
			subString: "Android",
			identity: "Android"
		},
		{
			string: navigator.userAgent,
			subString: "iPhone",
			identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]
};

/************** CENTRA UN DIV IN MEZZO ALLA PAGINA *********************/
	function MEcenterDiv(divId){
		document.getElementById(divId).style.position="absolute";

		var pWidth= document.body.clientWidth? document.body.clientWidth: document.documentElement.clientWitdh;
		var pHeight = document.body.clientHeight ? document.body.clientHeight : document.documentElement.clientHeight;

		var sWidth= window.innerWidth ? window.innerWidth: document.documentElement.clientWidth;
		var sHeight = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight;

		prevVis = document.getElementById(divId).style.visibility;
		prevDisp = document.getElementById(divId).style.display;
		document.getElementById(divId).style.visibility="hidden";
		document.getElementById(divId).style.display="block";

		var divWidth= document.getElementById(divId).clientWidth;
		var divHeight = document.getElementById(divId).clientHeight;
		if (sWidth<= divWidth){
			sWidth= pWidth;
		}

		if (sHeight <= divHeight){
			sHeight = pHeight;
		}
		var scrolly = (document.all)?document.documentElement.scrollTop:window.pageYOffset;

		var top = scrolly + (sHeight/2 - divHeight/2);
	    if (top<0) top = 10;
	    top+="px";
		var left = (sWidth/2 - divWidth/2) + "px";
		document.getElementById(divId).style.top =  top;

		document.getElementById(divId).style.left = left;
		document.getElementById(divId).style.visibility=prevVis;
		document.getElementById(divId).style.display=prevDisp;
	}

/* submit di un form mediante una POST ajax */

	function submitAjaxForm(form,handleFunction,action){

				if (typeof action == "undefined"){
					action = form.action;
				}
				if (typeof form == "string")
					var form = document.getElementById(form);

				var pars = qsFromForm(form);

				if (action)
					action += pars;
				else
					action = form.action + pars;

				var ajaxObj = getMEAjaxObj();
				ajaxObj.Request("POST", action, handleFunction);
	}

/* effettua il submit del form premendo enter - l'evento deve essere associato a keypress sui campi input del form */

	function submitOnEnter(e,oForm){
		var kC  = (window.event) ?    // MSIE or Firefox?
	           window.event.keyCode : (e.keyCode ? e.keyCode : e.which);
		var returnCode = 13;
		if (kC == returnCode)
			oForm.submit();
	}

/* esegue una azione sulla pressione di invio l'evento deve essere associato a keypress sui campi input del form */
	function eventOnEnter(e,handler){
		var kC  = (window.event) ?    // MSIE or Firefox?
	           window.event.keyCode : (e.keyCode ? e.keyCode : e.which);
		var returnCode = 13;
		if (kC == returnCode)
			handler();
	}

/* Bind di funzioni per non perdere il riferimento all'oggetto originario */
/* Estende le funzioni di javascript */

Function.prototype.bind=function(obj,arguments){
  var fx=this;
  return function(){
    return fx.apply(obj,arguments);
  };
};


/**
/* IMPLEMENTAZIONE DEL MERGE_SORT PER ORDINARE IN AMNIERA VELOCE UN ARRAY E POTER USARE LA RICERCA BINARIA ER SELEZIONARE GLI ELEMENTI*/
/* @metodoConfronto(a,b)  funzione utilizzata per esffettuare il confronto (restituisce 1 se a>b, -1 se a<b, 0 se a == b)
/* 							se non specificata ne usa una di default che effettua il confronto tra stringhe (_defaultMetodoConfronto)




																																		*/
//merge_sort ricorsivo

function mergeSort(items,metodoConfronto){
	if (!metodoConfronto)
		metodoConfronto = _defaultMetodoConfronto;
    if (items.length == 1) {
        return items;
    }

    var middle = Math.floor(items.length / 2),
        left    = items.slice(0, middle),
        right   = items.slice(middle);

    return merge(mergeSort(left,metodoConfronto), mergeSort(right,metodoConfronto),metodoConfronto);
}



function merge(left, right, metodoConfronto){
    var result = [];

    while (left.length > 0 && right.length > 0){

//		alert(left[0]+" - "+ right[0] +" = " + metodoConfronto(left[0],right[0]));
        if (metodoConfronto(left[0],right[0]) < 0){
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }
    return result.concat(left).concat(right);
}

function _defaultMetodoConfronto(left, right)
{
	if(left == right)
		return 0;
	else if(left < right)
		return -1;
	else
		return 1;
}

/**
/* IMPLEMENTAZIONE DEL MERGE_SORT PER ORDINARE IN AMNIERA VELOCE UN ARRAY E POTER USARE LA RICERCA BINARIA ER SELEZIONARE GLI ELEMENTI*/
/* @metodoConfronto(a,b)  funzione utilizzata per effettuare la ricerca Binaria in un array ordinato
/* Restituisce l'indice dell'elemento nell'array se esiste, -1 altrimenti
/* 							se non specificata ne usa una di default che effettua il confronto tra stringhe (_defaultMetodoConfronto)
															*/
function binarySearch (needle, haystack, metodoConfronto ) {
	if (typeof(haystack) === 'undefined' || !haystack.length) return -1;

	var high = haystack.length - 1;
	var low = 0;
	while (low <= high) {
		mid = parseInt((low + high) / 2);
		element = haystack[mid];
		if (metodoConfronto(element,needle)==1) {
			high = mid - 1;
		} else if (metodoConfronto(element,needle)==-1) {
			low = mid + 1;
		} else {
			return mid;
		}
	}

	return -1;
};


function getPosition(oElement,relative)
{
	var pos = {};
	pos.y = 0;
	pos.x = 0;
	while( oElement != null ){
		pos.y += oElement.offsetTop ?  oElement.offsetTop : 0;
		pos.x += oElement.offsetLeft ?  oElement.offsetLeft : 0;
		oElement = oElement.offsetParent;
        if (relative)
            break;
	}
	return pos;
}


function getMousePosition(e){
  try{
	tempX = e.pageX ? e.pageX : event.clientX + document.body.scrollLeft;
	tempY = e.pageY ? e.pageY : event.clientY + document.body.scrollTop;
	// catch possible negative values in NS4
	if (tempX < 0){tempX = 0;}
	if (tempY < 0){tempY = 0;}
	// show the position values in the form named Show
	// in the text fields named MouseX and MouseY
	var pos = {};
	pos.x = tempX;
	pos.y = tempY;
  }catch(e){
	return null;
  }
  return pos;
}

/******* PseudoAjax Image Upload ********************/


function get(theVar){
	return document.getElementById(theVar);
}

function removeElement(element){
	if (typeof element == "string")
		var element = document.getElementById(element);
    try{
	    element.parentNode.removeChild(element);
	}catch(e)
	{
		//alert(e);
	}
}

function submitImgForm(form,resultContainer){
 	var loaderImg = document.createElement("img");
 	loaderImg.setAttribute("src","/img2/loader7.gif");
 	get(resultContainer).appendChild(loaderImg);
	function doUpload(){
		removeEvent(get('iFrameImg'),"load", doUpload);
		if (typeof resultContainer!="undefined"){
			var cross = "javascript: ";
			cross += "window.parent.get('"+resultContainer+"').innerHTML = document.body.innerHTML;void(0);";
			get('iFrameImg').src  = cross;
            doUpload2();
		}
	}
    function doUpload2(){

        removeEvent(get('iFrameImg'),"load", doUpload2);

        setTimeout("removeElement('"+_uploader_iframeContainer.id+"')",1000);
    }
try{
	_uploader_iframeHTML = "<iframe name=\"iFrameImg\" id=\"iFrameImg\" width=\"0\" height=\"0\" border=\"0\" style=\"width: 0; height: 0; border: none;\";></iframe>";
	_uploader_iframeContainer = document.createElement("div");
	_uploader_iframeContainer.id = "iFrameImgContainer";
	_uploader_iframeContainer.innerHTML = _uploader_iframeHTML;
	get(resultContainer).parentNode.appendChild(_uploader_iframeContainer);
	iFrameImg = document.getElementById("iFrameImg");

	_target = form.getAttribute("target");
	_method = form.getAttribute("method");
	_enctype = form.getAttribute("enctype");
	_encoding = form.getAttribute("encoding");

	form.setAttribute("target","iFrameImg");
	form.setAttribute("method","post");
	form.setAttribute("enctype","multipart/form-data");
	form.setAttribute("encoding","multipart/form-data");
	addEvent(get('iFrameImg'),"load", doUpload);
	form.submit();
	if (!_target)
		form.setAttribute("target","");
	else
		form.setAttribute("target",_target);
	form.setAttribute("method",_method);
	form.setAttribute("enctype",_enctype);
	form.setAttribute("encoding",_encoding);
}
catch(e){
}
	return false;
}

/***************************************************/

//variabile globale per testare se si tratta di internet explorer 6
function isIE6() {
	return false /*@cc_on || @_jscript_version < 5.7 @*/;
}
function isIE(){
	var br = getBrowser();
	var br = br["name"];
	if (br.search(/Internet Explorer/) > 0)
		return true;
	else
		return false;
}



function addJS(script_filename,id) {

    var html_doc = document.getElementsByTagName('head').item(0);
    var js = document.createElement('script');

	if (typeof id == "undefined")
		id = script_filename;

    js.setAttribute('language', 'javascript');
    js.setAttribute('type', 'text/javascript');
    js.setAttribute('src', script_filename);
	js.setAttribute('id', id);

	if (!document.getElementById(id)) {
		html_doc.appendChild(js);
	}

    return false;
}


/* FUNIONE ESPANZIONE TEXTAREA AUTO */
function espandiBox(id){
    setTimeout("_espandiBox('"+id+"')",500);
}
function _espandiBox(id){

	/* oDiv = document.getElementById(div); */
	oTxtArea=document.getElementById(id);

	if (typeof oTxtArea.isExpanding !="undefined" && oTxtArea.isExpanding == true)
		return;
	else
		oTxtArea.isExpanding = true;
	if (typeof oTxtArea.initRows == "undefined")
		oTxtArea.initRows = oTxtArea.rows;

	if (oTxtArea.rows * oTxtArea.cols < 0)
		return;

	a = oTxtArea.value.split('\n');
	b=0;
	for (x=0;x < a.length; x++) {
		if (a[x].length >= oTxtArea.cols) b+= Math.floor(a[x].length/oTxtArea.cols);
	}

	b+=a.length;

	if (b > oTxtArea.initRows)
		oTxtArea.rows = b;
	else{
		oTxtArea.rows = oTxtArea.initRows;
	}
	oTxtArea.isExpanding = false;
	oTxtArea.focus();
}


function isNumeric(input)

{
   if (typeof input == "undefined" || input == "")
	return false;

   var ValidChars = "0123456789,.";
   var IsNumber=true;
   var Char;


   for (var i = 0; i < input.length && IsNumber == true; i++)
      {
      Char = input.charAt(i);
      if (ValidChars.indexOf(Char) == -1)
         {
         IsNumber = false;
         }
      }
   return IsNumber;

}

function getFuncName(oFunction){
	if (typeof oFunction != "function" || !oFunction)
		return "main";
	var fn = oFunction.toString();

	var fname = fn.substring(fn.indexOf("function") + 8, fn.indexOf('(')) || 'anonymous';
	return fname;

}

function _raiseError(message){
	if (typeof message=="undefined")
		message = "no description";
		throw new Error('[error] '+ (getFuncName(arguments.callee.caller)) + ': '+message+"\n\n StackTrace : "+getStackTrace().join(",\n\n"));
}

function _doLog(message, type) {
	try{		
		if (typeof console!="undefined" && console[type || 'debug']){			
			console[type || 'debug'](getFuncName(arguments.callee.caller), message);
		}else{
			if (typeof console!= "undefined" && console.log)
				console.log(message);
		}
	}catch(e){
				
	}
}


//restituisce stringa con var dump
function var_dump(variable,full,maxDeep,_count) {

	var message = "";
	try{
		if (!maxDeep)
			maxDeep = 2;

		if (!full)
			full = false;

		if (!_count)
			_count = 0;

		_count = _count + 1;

		var type = typeof variable;


		tabs = "";
		tabs_1 = "";
		for (var i = 0; i< _count;i++)
			tabs= tabs+"\t";
		for (var i = 0; i< _count-1;i++)
			tabs_1= tabs_1+"\t";

		if (_count == 1)
			message+=type+"\n";

		if (type == "object"){

			if (_count>maxDeep){
				for (var name in variable){
					message = message + tabs +name+" = \""+(typeof variable[name])+"\" { .... },\n";
				}
			}else{
				for (var name in variable){
					message = message + (typeof variable[name] == "object" ? "\n"+tabs_1 : tabs) +name+" = \""+(typeof variable[name])+"\" {"+(typeof variable[name] == "object" ? "\n"+tabs_1 : "")+" "+_var_dump(variable[name],full,maxDeep,_count)+(typeof variable[name] == "object" ? "\n"+tabs_1 : "")+"},\n";
				}

			}
			message+="\n";
		}else{

			if ((type == "function" && full) || type!="function"){
				message+=variable;

			}else{
				message+="....... (set full = 1 to see the func body)";
			}
		}

	}catch(e){
		return message;
	}

	return(message);
}

function getStackTrace() {
  var callstack = [];
  var isCallstackPopulated = false;
  var i = null;
  try {
    i.dont.exist+=0; //doesn't exist- that's the point
  } catch(e) {
    if (e.stack) { //Firefox
      var lines = e.stack.split('\n');
      for (var i=0, len=lines.length; i<len; i++) {
        if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
          callstack.push(lines[i]);
        }
      }
      //Remove call to printStackTrace()
      callstack.shift();
      isCallstackPopulated = true;
    }
    else if (window.opera && e.message) { //Opera
      var lines = e.message.split('\n');
      for (var i=0, len=lines.length; i<len; i++) {
        if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
          var entry = lines[i];
          //Append next line also since it has the file info
          if (lines[i+1]) {
            entry += "&quot; at &quot;" + lines[i+1];
            i++;
          }
          callstack.push(entry);
        }
      }
      //Remove call to printStackTrace()
      callstack.shift();
      isCallstackPopulated = true;
    }
  }
  if (!isCallstackPopulated) { //IE and Safari
    var currentFunction = arguments.callee.caller;
    while (currentFunction) {
	  var fn = currentFunction.toString();
      var fname = fn.substring(fn.indexOf("function") + 8, fn.indexOf('(')) || 'anonymous';
      callstack.push(fname);
      currentFunction = currentFunction.caller;
    }
  }
  return callstack;
}


stringify = function (obj) {
	var t = typeof (obj);
	if (t != "object" || obj === null) {
		// simple data type
		if (t == "string") obj = '"'+obj+'"';
			return String(obj);
		}
		else {
			var n, v, json = [], arr = (obj && obj.constructor === Array);
			//voglio glia array sempre associativi (obj jSon)
			//arr = obj.constructor === Array;
			for (n in obj) {

				v = obj[n]; t = typeof(v);
				if (t == "function")
					continue;
				if (t == "string") v = '"'+v+'"';
				else if (t == "object" && v !== null) v = stringify(v);

				if (arr)
					json.push(String(v));
				else
					json.push( ('"' + n + '":') + String(v));
			}

			return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
		}
	};

/*
	cerca un elemento (neddle) dentro ad  un array (haystack)
*/
function in_array(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++){
        if(haystack[i] == needle) return true;
    }
    return false;
}


/* Scroll Progressivo*/


/*
 * getPageSize()
 *
 * Returns array with page width, height and window width, height
 *
 */
function getPageSize(){

 var xScroll, yScroll;

 if (window.innerHeight && window.scrollMaxY) {
     xScroll = document.body.scrollWidth;
     yScroll = window.innerHeight + window.scrollMaxY;
 } else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
     xScroll = document.body.scrollWidth;
     yScroll = document.body.scrollHeight;
 } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
     xScroll = document.body.offsetWidth;
     yScroll = document.body.offsetHeight;
 }

 var windowWidth, windowHeight;
 if (self.innerHeight) {    // all except Explorer
     windowWidth = self.innerWidth;
     windowHeight = self.innerHeight;
 } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
     windowWidth = document.documentElement.clientWidth;
     windowHeight = document.documentElement.clientHeight;
 } else if (document.body) { // other Explorers
     windowWidth = document.body.clientWidth;
     windowHeight = document.body.clientHeight;
 }

 // for small pages with total height less then height of the viewport
 if(yScroll < windowHeight){
     pageHeight = windowHeight;
 } else {
     pageHeight = yScroll;
 }

 // for small pages with total width less then width of the viewport
 if(xScroll < windowWidth){
     pageWidth = windowWidth;
 } else {
     pageWidth = xScroll;
 }

 return [ pageWidth,pageHeight,windowWidth,windowHeight ];
}

//IE memory leak purge
function purgeDomObj(d) {
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

function updateVisibilita(id,field,obj){
    if (!obj || !id || field.trim()=="") return;
    var oAjax = new getMEAjaxObj();
    var value=0;
    if (obj.checked) value=1;
    var pars = "id="+id+"&field="+field+"&value="+value;
    var url = "/backoffice/updateVisibilita.php?"+pars;
    oAjax.Request('POST',url, updateVisibilitaH);
}

function updateVisibilitaH(data){
    if (data.responseText=="-1"){
	alert("Si è verificato un problema, riprovare l'operazione");
	return;
    }
}

function preloadImages(aImages,onloadF){
	__ti_preload_imgs_idx = 0;
	var img = document.createElement("img");
	img.onload = function(){
		if (aImages.length > ++__ti_preload_imgs_idx){
			this.src = aImages[__ti_preload_imgs_idx];
		}else{
			this.onload = function(){};
			if (typeof onloadF == "function")
			onloadF();
		}
	};
	img.src = aImages[0];
}


/*confronta due array passati per argomento e ritorna true se l'array2 contiene gli stessi elementi dell'array1, anche in ordine diverso, altrimenti ritorna false*/
function fnSameElemArray(aArray1, aArray2){
    if(aArray1.length != aArray2.length)
		bSame = false;
    else{
        bSame = true;
        var iCounter = 0;
        var aSorted1 = mergeSort(aArray1);
        var aSorted2 = mergeSort(aArray2);
	for(var i=0;i<aSorted1.length;i++)
	    if(aSorted1[i] != aSorted2[i]){
		bSame = false;
		break;
	    }
    }
    return bSame;
}


/*elimina un nodo dal dom passandogli il suo id*/
function fnRemoveNodeById(sNode){
    var oNodeToRemove = document.getElementById(sNode);
	if (oNodeToRemove)
		oNodeToRemove.parentNode.removeChild(oNodeToRemove);
    return;
}

function disableAutoComplete(selector){

    if (!selector)
		return;
	var first = selector.charAt(0);
    var id =selector.split(first)[1];
    if (first=='#'){
		var inputElement = document.getElementById(id);
        if (inputElement)
			inputElement.setAttribute("autocomplete","off");
	}
    else
	if (first=='.'){
        var inputElements = document.getElementsByClass(id);
        for (i=0; inputElements[i]; i++) {
                inputElements[i].setAttribute("autocomplete","off");
        }
    }
}

function trackGAClickEvent(category,action,opt_label){

	if (typeof category == "undefined" || typeof action == "undefined" || typeof opt_label == "undefined"){
		if (typeof __debugging_doLog!="undefined" && __debugging_doLog)
			_doLog("Missing Required Field");
		return false;
	}
	if (typeof _gaq == "undefined"){
		if (typeof __debugging_doLog!="undefined" && __debugging_doLog)
			_doLog("_gaq is undefined");
		return false;
	}


	if (typeof(_gaq) != 'undefined' && category!=null && action && opt_label){
		_gaq.push(['_trackEvent', category, action, opt_label]);
		if (typeof __debugging_doLog!="undefined" && __debugging_doLog)
			_doLog("_gaq.push(['_trackEvent','"+category+"','"+ action+ "','"+opt_label+"']);");
	}

	if (typeof ga != "undefined"){
		ga('send', 'event', category, action, opt_label);
		if (typeof __debugging_doLog!="undefined" && __debugging_doLog)
			_doLog("ga('send','event','"+category+"','"+ action+ "','"+opt_label+"');");

	}

	return true;

}

Function.prototype.clone=function(obj){
	function F(){}
	F.prototype = obj;
	return new F();
};


String.prototype.ucwords = function(){
    return this.replace(/\w+/g, function(a){
        return a.charAt(0).toUpperCase() + a.substr(1).toLowerCase();
    });
};

if (typeof Event != "undefined" && typeof Event.prototype != "undefined")
Event.prototype.stopBubbling = function(){
	try{
		this.cancelBubble = true;
		this.stopPropagation();
	}catch(e){
		_doLog(e);
	}
};

function simulateClickOnLink(oA,forceNewWindow) {
	if (typeof forceNewWindow == "undefined")
		forceNewWindow = false;
	if (typeof(oA.click) != 'undefined' && /msie/i.test(navigator.userAgent)) {
		var fakeLink = document.createElement("a");
		fakeLink.href = oA.href;
		if (forceNewWindow)
			fakeLink.target = "_blank";
		else
			fakeLink.target = oA.target;
		document.body.appendChild(fakeLink);
		fakeLink.click();
	} else {
		if ((oA.target && oA.target == "_blank") || forceNewWindow) {
			window.open(oA.href);
			setTimeout(function(){document.body.focus();},0);
		} else {
			document.location.href = oA.href;
		}
	}
}

stop_event_bubbling=function(e,hard){
	/*il parametro
		hard = true
	   fa si che su IE/Safari oltre a stoppare la propagazione dell'evento,
	   blocca anche il comportamento predefinito del browser sull'evento stesso.
	*/
	if (typeof hard == "undefined"){
		hard = false;
	}

    if (!e)
		e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
	if (hard){
		if (typeof Event != "undefined" && Event.stop)
			Event.stop(e);
	}

};

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/\bAndroid\b/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/\bBlackBerry\b/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/\b(iPhone|iPad|iPod)\b/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/\bOpera Mini\b/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/\bIEMobile\b/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

function checkAndFormatCurrency(input,event,blurOnCheck,acceptDecimal){

		if (!input || !input.value)
			return false;
		if (typeof acceptDecimal == "undefined")
			acceptDecimal = false;

    var ev = event ? event : window.event;

        var prezzo = input.value.replace(/\./g,'');
		var iLength_init = input.value.length;
		if (!prezzo || parseInt(prezzo) <= 0){
			input.value = "";
			return false;
		}

		var caretPos;
		if (ev)
			caretPos = getCaretPosition(input);
		var length = prezzo.length;

        var prezzo_old = prezzo;

        prezzo = "";
		alreadyAddedDecSep = false;
        for (var i=0;i<length;i++){
            if ( isNumeric(prezzo_old.charAt(i))){
				if (prezzo_old.charAt(i)==","){
					if(!acceptDecimal || alreadyAddedDecSep)
						continue;
					alreadyAddedDecSep = true;
				}
                prezzo = prezzo + "" + prezzo_old.charAt(i);
            }else{
                if (i < caretPos)
                    caretPos--;
            }
        }
		var decimal = "";
		var hasDecimal = prezzo.search(/,/);
		if (hasDecimal > 0){
			var aPrezzo = prezzo.split(",");
			if (2 == aPrezzo.length){
				prezzo = aPrezzo[0];
				decimal = aPrezzo[1];
			}
		}

        length = prezzo.length;
        var newPrice = new Array();
        var newPriceIdx = 0;
        var digitCounter = 1;
		for (var i=length;i>=1;i--){
				newPrice[newPriceIdx++] = prezzo.charAt(i-1);
				if (((i-1 % 3) != 0) && ((digitCounter % 3) == 0)){
						digitCounter = 1;
						newPrice[newPriceIdx++] = ".";
				}else{
						digitCounter++;
				}
		}

		var output = "";
		for (var i=newPrice.length-1;i>=0;i--){
				output+=newPrice[i];
		}

		if (hasDecimal > 0)
		 output+=","+decimal;

		if ( output != input.value ) {
			jq( input ).change();
		}
		input.value = output;
		var iLength_post = input.value.length;

		if (iLength_post > iLength_init)
			caretPos++;

		if (ev)
			setCaretPos(input,caretPos);

		return true;
}

function getCaretPosition(oField) {

  // Initialize
  var iCaretPos = 0;

  // IE Support
  if (document.selection && jq(oField).is(':visible')) { // su IE effettuare il focus su un elemento non visibile genera un errore js che rompe la pagina

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

function setCaretPos(fieldOrId,pos){

    var oField = (typeof fieldOrId == "string" || fieldOrId instanceof String) ? document.getElementById(fieldOrId) : fieldOrId;

    if(!oField){
        return false;
    }else if(oField.createTextRange){
        var textRange = oField.createTextRange();
        textRange.collapse(true);
        textRange.moveEnd('character',pos);
        textRange.moveStart('character',pos);
        textRange.select();


        return true;
    }else if(oField.setSelectionRange){

        oField.setSelectionRange(pos,pos);
        return true;
    }

    return false;
}


/* Classe per la gestione dei tracciamenti tramite immegine 1x1px*/
var ImgTracking = function(){};

ImgTracking.prototype.trackEvent = function ( actionUrl, event ) {
  var charRandom = actionUrl.indexOf( "&" )!= -1 ? '&' : '?';

  /* Simula chiamata ajax per incremento contatori */
  var imagecount = document.createElement( 'img' );
  imagecount.src = actionUrl + charRandom + Math.random();

  /* Stoppa la propagazione del click nel div contenitore*/
  stop_event_bubbling(event);
};

function trackGMapImpression(section,type){

	if (typeof section == "undefined" || !in_array(type.toLowerCase(),new Array("static","v3","v2")))
		return false;

	trackGAClickEvent(section,'mappa_google','impressions_'+type.toLowerCase());
}

function checkCurrencysPercentual(evt,value) {

	evt = (evt) ? evt : event;
	var charCode = (evt.charCode) ? evt.charCode :
		((evt.keyCode) ? evt.keyCode :
			((evt.which) ? evt.which : 0)
		);

	var carSpec = evt.keyCode;


	if (carSpec == 46 || carSpec ==37 || carSpec ==39 )
		return true;

	if (charCode == 44)
		return true;

	if (charCode > 31 && (charCode < 48 || charCode > 57 )) {
		alert("In questo campo sono ammessi solo numeri");
		return false;
	}

	var numero = charCode-48;
	var realnumero = String(value) + String(numero);


	if ((realnumero>100) || (realnumero<1) && (realnumero!='') ){
			alert("In questo campo sono ammessi solo numeri\ncompresi tra 1 e 100");
			return false;
	}

	return true;
}

/* FUNZIONE PER IL TRACCIAMENTO GOOGLE ANALYTICS*/
function trackPage(page, pageCustomVars){
	if (typeof pageCustomVars != "object")
		pageCustomVars = null;

	if (page && typeof _gaq != "undefined"){
		/* TRACCIAMENTO GOOGLE */
		if (pageCustomVars)
			trackCustomVars(pageCustomVars);

		_gaq.push(['_trackPageview',page]);

		if (typeof __debugging_doLog != "undefined" && __debugging_doLog)
			_doLog("_gaq.push(['trackPageview','"+page+"']);");

		if (typeof ga != "undefined"){
			ga('send', 'pageview');
			if (typeof __debugging_doLog != "undefined" && __debugging_doLog)
				_doLog("ga('send','pageView','"+page+"');");
		}

		return true;
	}
	return false;
}

/******************************** CONTROLLO LEVENSHTEIN *******************************************/
/**
 * Attua il confronto di Levenshtein tra due stringhe ritornando la distanza
 * @param {String} str1 Prima stringa da confrontare
 * @param {String} str2 Seconda stringa da confrontare
 * @returns {Integer} Distanza di Levenshtein tra le 2 stringhe 
 **/
function getLevenshteinDistance(str1, str2){
	if (str1 == str2) return 0;
	var str1_len = (str1.length !== 0) ? str1.length : str2.length;
	var str2_len = (str2.length !== 0) ? str2.length : str1.length;
	if(str1.length === 0) return str1_len;
	if(str2.length === 0) return str2_len;

	var split = false;
	try{split=!("0")[0];}catch(i){split=true;};
	if (split) { str1 = str1.split(''); str2 = str2.split(''); }

	var v0 = new Array(str1_len + 1), v1 = new Array(str1_len + 1);
	var str1_idx = 0, str2_idx = 0, cost = 0;
	for (str1_idx = 0; str1_idx < str1_len + 1; str1_idx++) {
		v0[str1_idx] = str1_idx;
	}
	var char_str1 = '',
	char_str2 = '';
	for (str2_idx = 1; str2_idx <= str2_len; str2_idx++) {
		v1[0] = str2_idx;
		char_str2 = str2[str2_idx - 1];

		for (str1_idx = 0; str1_idx < str1_len; str1_idx++) {
			char_str1 = str1[str1_idx];
			cost = (char_str1 == char_str2) ? 0 : 1;
			var m_min = v0[str1_idx + 1] + 1;
			var b = v1[str1_idx] + 1;
			var c = v0[str1_idx] + cost;
			m_min = (b < m_min) ? b : m_min;
			m_min = (c < m_min) ? c : m_min;
			v1[str1_idx + 1] = m_min;
		}
		var v_tmp = v0;
		v0 = v1;
		v1 = v_tmp;
	}
	return v0[str1_len];
};

/********************************* FUNZIONI PER STRINGA ********************************************/

String.prototype.capitalize = function()
{
   return this.toLowerCase().replace(/^.|\s\S/g, function(a) { return a.toUpperCase(); });
};

/******** POLYFILL/FALLBACKS *****/
/**
 * Rewrite String.contains for browser that not support this method
 */
if(!('contains' in String.prototype))
	String.prototype.contains = function(str, startIndex) { return -1 !== String.prototype.indexOf.call(this, str, startIndex); };

/***
 * Funzione che sostituisce tutte le accentate con la veersione non accentata del carattere stesso
 *
 * str = "\xc0\xc1\xc2\xc3\xc4\xc5\xe0\xe1\xe2\xe3\xe4\xe5\xd2\xd3\xd4\xd5\xd6\xd8\xf2\xf3\xf4\xf5\xf6\xf8\xc8\xc9\xca\xcb\xe9\xe8\xea\xeb\xc7\xe7\xcc\xcd\xce\xcf\xec\xed\xee\xef\xd9\xda\xdb\xdc\xf9\xfa\xfb\xfc\xff\xd1\xf1";
 * removeDiacritics(str) = 'AAAAAAaaaaaaOOOOOOooooooEEEEeeeeCcIIIIiiiiUUUUuuuuyNn';
 *
****/
function removeDiacritics(str) {

	var defaultDiacriticsRemovalMap = [
    {'base':'A', 'letters':/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},
    {'base':'AA','letters':/[\uA732]/g},
    {'base':'AE','letters':/[\u00C6\u01FC\u01E2]/g},
    {'base':'AO','letters':/[\uA734]/g},
    {'base':'AU','letters':/[\uA736]/g},
    {'base':'AV','letters':/[\uA738\uA73A]/g},
    {'base':'AY','letters':/[\uA73C]/g},
    {'base':'B', 'letters':/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
    {'base':'C', 'letters':/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
    {'base':'D', 'letters':/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},
    {'base':'DZ','letters':/[\u01F1\u01C4]/g},
    {'base':'Dz','letters':/[\u01F2\u01C5]/g},
    {'base':'E', 'letters':/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},
    {'base':'F', 'letters':/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
    {'base':'G', 'letters':/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},
    {'base':'H', 'letters':/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},
    {'base':'I', 'letters':/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},
    {'base':'J', 'letters':/[\u004A\u24BF\uFF2A\u0134\u0248]/g},
    {'base':'K', 'letters':/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},
    {'base':'L', 'letters':/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},
    {'base':'LJ','letters':/[\u01C7]/g},
    {'base':'Lj','letters':/[\u01C8]/g},
    {'base':'M', 'letters':/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
    {'base':'N', 'letters':/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},
    {'base':'NJ','letters':/[\u01CA]/g},
    {'base':'Nj','letters':/[\u01CB]/g},
    {'base':'O', 'letters':/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},
    {'base':'OI','letters':/[\u01A2]/g},
    {'base':'OO','letters':/[\uA74E]/g},
    {'base':'OU','letters':/[\u0222]/g},
    {'base':'P', 'letters':/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
    {'base':'Q', 'letters':/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
    {'base':'R', 'letters':/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},
    {'base':'S', 'letters':/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},
    {'base':'T', 'letters':/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},
    {'base':'TZ','letters':/[\uA728]/g},
    {'base':'U', 'letters':/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},
    {'base':'V', 'letters':/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
    {'base':'VY','letters':/[\uA760]/g},
    {'base':'W', 'letters':/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
    {'base':'X', 'letters':/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
    {'base':'Y', 'letters':/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g},
    {'base':'Z', 'letters':/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g},
    {'base':'a', 'letters':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g},
    {'base':'aa','letters':/[\uA733]/g},
    {'base':'ae','letters':/[\u00E6\u01FD\u01E3]/g},
    {'base':'ao','letters':/[\uA735]/g},
    {'base':'au','letters':/[\uA737]/g},
    {'base':'av','letters':/[\uA739\uA73B]/g},
    {'base':'ay','letters':/[\uA73D]/g},
    {'base':'b', 'letters':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
    {'base':'c', 'letters':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g},
    {'base':'d', 'letters':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g},
    {'base':'dz','letters':/[\u01F3\u01C6]/g},
    {'base':'e', 'letters':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g},
    {'base':'f', 'letters':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
    {'base':'g', 'letters':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g},
    {'base':'h', 'letters':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g},
    {'base':'hv','letters':/[\u0195]/g},
    {'base':'i', 'letters':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g},
    {'base':'j', 'letters':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
    {'base':'k', 'letters':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g},
    {'base':'l', 'letters':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g},
    {'base':'lj','letters':/[\u01C9]/g},
    {'base':'m', 'letters':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
    {'base':'n', 'letters':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g},
    {'base':'nj','letters':/[\u01CC]/g},
    {'base':'o', 'letters':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g},
    {'base':'oi','letters':/[\u01A3]/g},
    {'base':'ou','letters':/[\u0223]/g},
    {'base':'oo','letters':/[\uA74F]/g},
    {'base':'p','letters':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
    {'base':'q','letters':/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
    {'base':'r','letters':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g},
    {'base':'s','letters':/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g},
    {'base':'t','letters':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g},
    {'base':'tz','letters':/[\uA729]/g},
    {'base':'u','letters':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g},
    {'base':'v','letters':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
    {'base':'vy','letters':/[\uA761]/g},
    {'base':'w','letters':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
    {'base':'x','letters':/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
    {'base':'y','letters':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g},
    {'base':'z','letters':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g}
];

    for(var i=0; i<defaultDiacriticsRemovalMap.length; i++) {
        str = str.replace(defaultDiacriticsRemovalMap[i].letters, defaultDiacriticsRemovalMap[i].base);
    }

    return str;
}

/**************************** FINE FUNZIONI PER STRINGA *************************************/

/*
 * Visualizza un pulsante per la cancellazione del campo input
 * @param string inputId identificativo del campo input
 */
InputCleaner = function(inputId){

   var oInputCleaner = this;

   this.input = jq('#' + inputId);
   this.button = jq('<div class="divInputClear"></div>');

   // Inserisco la div
   this.button.insertAfter(this.input);

   // Nascondo il bottone
   this.hideButton();

   // Timer
   this.timer = null;

   // Quando il mouse si trova sul campo input visualizzo il bottone
   this.input.hover(
       function (event) { // in
			if (oInputCleaner.timer){
				clearTimeout(oInputCleaner.timer);
			}
			oInputCleaner.showButton();
       },
       function (event) { // out
           oInputCleaner.timer = setTimeout(function(){
               oInputCleaner.hideButton();
           }, 2000);
       }
   );

   // Quando viene cliccato il bottone pulisco il
   this.button.click(function(event){
       oInputCleaner.cleanInput();
   });
};

/**
 * Visualizza / nasconde il bottone per la cancellazione
 */
InputCleaner.prototype.showButton = function(){
   if (this.input.val() == ''){
       this.button.hide();
   } else {
       this.button.show();
   }
};

/**
 * Nasconde il bottone per la cancellazione
 */
InputCleaner.prototype.hideButton = function(){
   this.button.hide();
};

/**
 * Pulisce il campo input
 */
InputCleaner.prototype.cleanInput = function(){
   this.input.val('');
};

/******************************************************************************/

var Page = {

	doctype : function() {
		if (typeof document.doctype == "undefined" || !document.doctype) {
			return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">';
		}

		var node = document.doctype;
		var doctype = "<!DOCTYPE "
			+ node.name
			+ (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '')
			+ (!node.publicId && node.systemId ? ' SYSTEM' : '') 
			+ (node.systemId ? ' "' + node.systemId + '"' : '')
			+ '>';
		return doctype;
	},

	snapshot : function() {
		var doctype = Page.doctype();
		var elements;
		var body;
		var head;

		if (!jq.support.htmlSerialize) {
			var div = document.createElement ("div");
			div.innerHTML = jq("body")[0].innerHTML;
			body = jq(div);
			elements = body;
		} else {
			jq("body *").each (function () {
				var n = jq(this);
				var tag = this.tagName.toLowerCase();
				if (tag == "input") {
					n.attr("checked", n.prop("checked"));
				} else if (tag == "option") {
					n.attr("selected", n.prop("selected"));
				}
			});
			body = jq("body").clone();
			head = jq("head").clone();
			elements = jq([head[0], body[0]]);
		}

		elements.find("*").each (function () {
			var n = jq(this);
			var tag = this.tagName.toLowerCase();
			if (tag == "script") {
				n.remove();
				return;
			} else if (tag == "a" || tag == "link") {
				var href = n.attr("href");
				if (href && !href.match(/^mailto:/) && !href.match(/^#/)) {
					n.attr("href", Url.absolute (href));
				}
			} else if (tag == "img") {
				var src = n.attr("src");
				if (src && !src.match(/^data:/)) {
					n.attr("src", Url.absolute (src));
				}
			}
			var bg = n.css("background-image");
			if (bg && bg.match(/^url\(/)) {
				var url;
				if (bg[4] == "'" || bg[4] == '"') {
					url = Url.absolute (bg.substr(5,bg.length-7));
				} else {
					url = Url.absolute (bg.substr(4,bg.length-5));
				}
				n.css("background-image", 'url("'+url+'")');
			}
		});

		var headStr;
		if (!jq.support.htmlSerialize) {
			headStr = jq("head").html().replace(/<script[\s\S]*?<\/script>/gmi, '');
			headStr = headStr.replace(/href="(.+?)"/gmi, function(match, url) {
				return 'href="'+Url.absolute(url)+'"';
			});
		} else {
			headStr = head.html();
		}

		var result = doctype+"<html><head>"+headStr+"</head><body>"+body.html()+"</body></html>";
		return result;
	},

	scroll : function(scroll) {
		if (typeof scroll != "undefined") {
			window.scrollTo(scroll.x, scroll.y);
		} else {
			scrolly = (document.all) ? document.documentElement.scrollTop : window.pageYOffset;
			scrollx = (document.all) ? document.documentElement.scrollLeft : window.pageXOffset;
			return {x: scrollx, y: scrolly};
		}
	},

	/**
	 * Scroller progressivo verso elemento passato con Id
	 * @param Int/String id identificativo elemento
	 * @param Int/String marginFromTop Margine dall'offset superiore della view
	 * @returns Void
	 */
	scrollTo : function(id, marginFromTop) {	
		setTimeout(function(){
			jq('html,body').animate({scrollTop: jq(id).offset().top - marginFromTop}, 'slow');
		}, 400);
	}
};

function getBoxPopUp(metodo,box,iframe)
{
	action = "/services/checkSession.php";
	var ajaxObj = getMEAjaxObj();
	ajaxObj.Request("POST",
					action,
					function(data)
					{
						var text = data.responseText;
						var json = eval('('+text+')');
						if( json.session == true )
						{
							eval(metodo);
						}
						else
						{
							getBox = new boxOverlay('richiestaBox',"red");
							getBox.setTitle("<strong class=\"titolo_annuncio\"></strong>");
							
							if(iframe == 1)
							{
								getBox.setContent('<iframe src="/services/getPopUpBox.php?type='+box+'" width="820" height="250" frameBorder="0" marginheight="0" marginwidth="0"></iframe>');
							}
							else
							{
								action = '/services/getPopUpBox.php?type='+box;
								var ajaxObj = getMEAjaxObj();
								ajaxObj.Request("POST", action, function(data){
																getBox.setContent(data.responseText);
																}
												);
							}
							
							getBox.show();
						}
					}
	);
};

function deselectAllText() {
	setTimeout(function() { try{document.getSelection().removeAllRanges();}catch(e){} }, 0);
}

if (getValue('debug'))
	__debugging_doLog = true;


/**
 * Formatta un numero.
 * @param decimals: numero di decimali da avere
 * @param decimal_sep: carattere usato come separatore dei decimali, se omesso di defaults è ','
 * @param thousands_sep: carattere usato come separatore delle migliaia, se omesso di defaults è '.'
 * @returns {string}
 */
Number.prototype.formatNumber = function(decimals, decimal_sep, thousands_sep)
{
	var n = this,
		c = isNaN(decimals) ? 2 : Math.abs(decimals), //if decimal is zero we must take it, it means user does not want to show any decimal
		d = decimal_sep || ',',
		t = (typeof thousands_sep === 'undefined') ? '.' : thousands_sep,
		sign = (n < 0) ? '-' : '',
		i = parseInt(n = Math.abs(n).toFixed(c)) + '',
		j = ((j = i.length) > 3) ? j % 3 : 0;
	return sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
}
