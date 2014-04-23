/* this file nedd functions.js to work properly*/

var expand = new Array();
var expandw = new Array();
var collapse = new Array();
var speed = 20;

var MErestrictTimer= new Array();
var MEenlargeTimer= new Array();
var transition = false;

function ME(prop){
    var first = prop.charAt(0);
    var id = prop.split(first)[1];
    if (first=='#')
    return document.getElementById(id) ? document.getElementById(id) : null;
        else if (first=='.')
            return MEgetElementsByClass(id);
return null;
}

function MEhide(id){
 var div;
 if (typeof id == "string")
	div = document.getElementById(id);
 else
	div = id;

 if (div){
	if (typeof div._initDisplay == "undefined"){
		div._initDisplay = MEgetDefaultProp(div,"display");
	}
	div.style.display='none';
 }
}

function MEshow(id){
	var div;
 if (typeof id == "string")
	div = document.getElementById(id);
 else
	div = id;
 if (div){
	if (typeof div._initDisplay == "undefined"){
		div._initDisplay = MEgetDefaultProp(div,"display");
	}
	if (div._initDisplay && div._initDisplay != "none"){
		div.style.display=div._initDisplay;
	}else{
		div.width = parseInt(MEgetWidth(div)) + "px";
		div.style.display='inline-block';
	}
 }

}

function MEtoggle(id){
	var div;
	if (typeof id == "string")
		div = document.getElementById(id);
	else
		div = id;
	div = document.getElementById(id);
    if (div)
		if (typeof div._initDisplay == "undefined"){
			div._initDisplay = MEgetDefaultProp(div,"display");
		}
		if (div.style.display=='none')
			MEshow(id);
		else
			MEhide(id);
}

function MEexpand(id,speed,height){
   var div = document.getElementById(id);
   actheight = div.style.height;

   actheight = parseInt(actheight);

   if (!speed){
		div.style.display = "block";
		div.style.height = "";
		expand[id]=false;
		return;
   }

   if (actheight > height-speed){

    div.style.height = "";
    expand[id]=false;
    div.open = true;
	div.closed = false;

   }else{
      actheight+=speed;
      div.style.height=actheight+"px";
      slide_div = setTimeout("MEexpand('"+id+"',"+speed+",'"+height+"')",0);
   }
}

function MEcollapse(id,speed,originalDivHeight){

   var div = document.getElementById(id);
   var actHeight = MEgetHeight(div);
   if (!speed){
		div.style.display = "none";
		div.style.height = "auto";
		collapse[id] = false;
		return;
   }

   var actHeight = parseInt(actHeight);
   if (actHeight <= speed){
      var pos = div.style.position
      div.style.display='none';
      div.style.visibility='visible';
      div.style.height = originalDivHeight;
      div.closed = true;
	  div.open = false;
      collapse[id] = false;
   }else{
      actHeight-=speed;
      if (actHeight<0)
		actHeight=0;
		div.style.height=actHeight+"px";
        setTimeout("MEcollapse('"+id+"',"+speed+",'"+originalDivHeight+"')",0);
   }
}


function MEgetHeight(div){
	if ( typeof div == "undefined" || !div )
		return 0;

	  var pos;
	  var vis;
	  var dis;
      pos = MEgetComputedProp(div,"position");

	  vis = MEgetComputedProp(div,"visibility");
	  dis = MEgetComputedProp(div,"display");

      if (dis && dis == "none"){
		if (pos)
			div.style.position='absolute';
		div.style.visibility='hidden';
		div.style.display='block';
	  }

	  var stopHeight = div.clientHeight ? div.clientHeight : div.offsetHeight;

      if (dis && dis == "none"){
		if (pos)
			div.style.position=pos;
		div.style.display=dis;
		div.style.visibility=vis;
	  }
      return stopHeight;
}

function MEgetWidth(div){
	if ( typeof div == "undefined" || !div )
		return 0;

	var pos;
	var vis;
	var dis;

    pos = MEgetComputedProp(div,"position");

	vis = MEgetComputedProp(div,"visibility");
	dis = MEgetComputedProp(div,"display");

	if (dis && dis == "none"){
		if (pos)
			div.style.position='absolute';
		div.style.visibility='hidden';
		div.style.display='block';
	}
     var stopWidth = div.clientWidth ? div.clientWidth : div.offsetWidth;

     if (dis && dis == "none"){
		if (pos)
			div.style.position=pos;
		div.style.display=dis;
		div.style.visibility=vis;
	  }

    return stopWidth;
}

function slideTo( id, speed, stop ) {
	var div = document.getElementById( id );
	var start = MEgetHeight(div);

	if ( start < stop ) {
		slideToDown( id, speed, stop );
	} else {
		slideToUp( id, speed , stop );
	}
}

function slideToUp( id, speed, stop ) {
	var div = document.getElementById( id );
	var actHeight = MEgetHeight(div);

	var nextHeight = actHeight - speed;
	if ( nextHeight < stop ) {
		div.style.height = stop+'px';
		return;
	}
	div.style.height = nextHeight+'px';
	setTimeout("slideToUp('"+id+"',"+speed+","+stop+")",0);
}

function slideToDown( id, speed, stop ) {
	var div = document.getElementById( id );
	var actHeight = MEgetHeight(div);

	var nextHeight = actHeight + speed;
	if ( nextHeight > stop ) {
		div.style.height = stop+'px';
		return;
	}
	div.style.height = nextHeight+'px';
	setTimeout("slideToDown('"+id+"',"+speed+","+stop+")",0);
}

function MEslideUp(id,speed){

    if (typeof MESlideUpTimer != "undefined"){
		clearTimeout(MESlideUpTimer);
    }

	if (typeof document.getElementById(id).MESlideUpStatus!="undefined" && document.getElementById(id).MESlideUpStatus == "open"){
		return;
	}

	document.getElementById(id).MESlideUpStatus="open";
    if (collapse[id]){
        setTimeout("MEslideUp('"+id+"',"+speed+")",0);
    }else{
    expand[id] = true;
		var div = document.getElementById(id);
     if (div){
      var stopHeight = MEgetHeight(div);
      div.style.height='0px';
	  div.style.visibility = "visible";
	  div.style.display = "block";
	  div.style.overflowY = "hidden";
      MEexpand(id,speed,stopHeight);
    }else{
      throw('ERROR - No id='+id+' element in SlideUp function');
   }
    }
}

function MEslideDown(id,speed){
    if (expand[id]){
        setTimeout("MEslideDown('"+id+"',"+speed+")",0);
    }else{
		if (typeof document.getElementById(id).MESlideUpStatus!="undefined" && document.getElementById(id).MESlideUpStatus == "closed"){
			//MESlideUpTimer = setTimeout("MEslideDown('"+id+"',"+speed+")",5000);
			return;
		}
		document.getElementById(id).MESlideUpStatus="closed";
			var div = document.getElementById(id);
			if (div){

				var originalDivHeight = div.style.height;
				if (div.style.display!='none'){
					collapse[id]=true;
					MEcollapse(id,speed,originalDivHeight);
				}

			}else{
				throw('ERROR - No id='+id+' element in SlideDown function');
			}

	}
}

function MEtoggleSlide(div,speed){
	var oDiv = document.getElementById(div);
	if (oDiv){
		if (oDiv.style.display!='none') MEslideDown(div,speed);
			else MEslideUp(div,speed);
	}


}


function MEresizeDivWidth(div,width,speed){
    var oDiv = document.getElementById(div);
    var divWidth = MEgetWidth(oDiv);
    if (parseInt(divWidth)>parseInt(width)) MErestrict(div,width,speed);
	else MEenlarge(div,width,speed);
}

function MEenlarge(div,targetWidth,speed){

    var oDiv = document.getElementById(div);
    var divWidth = oDiv.style.width;
    if (!divWidth) divWidth = MEgetWidth(oDiv);

    if (parseInt(divWidth)>parseInt(targetWidth)-parseInt(speed)){
	if (MEenlargeTimer)
	    clearTimeout(MEenlargeTimer[div]);
	oDiv.style.width=targetWidth+"px";
    }else{

	oDiv.style.width=(parseInt(divWidth) + parseInt(speed))+"px";
	//clearTimeout(MEenlargeTimer);
	MEenlargeTimer[div] = setTimeout("MEenlarge('"+div+"','"+targetWidth+"',"+speed+")",0);
    }
}

function MErestrict(div,targetWidth,speed){

    var oDiv = document.getElementById(div);
    var divWidth = oDiv.style.width;
    if (!divWidth) divWidth = MEgetWidth(oDiv);

    if (parseInt(targetWidth)>parseInt(divWidth)-parseInt(speed)){
	if (MErestrictTimer)
	    clearTimeout(MErestrictTimer[div]);
	oDiv.style.width=targetWidth+"px";
    }else{

	oDiv.style.width=(parseInt(divWidth)-parseInt(speed))+"px";
	//clearTimeout(MErestrictTimer);
	MErestrictTimer[div] = setTimeout("MErestrict('"+div+"','"+targetWidth+"',"+speed+")",0);
    }
}



/* Accordion Instructions
*
* Set the accordions elements in this way : <element class="myClass" id="myClass_Id">....</element> where id is unique for each Element
*
* To use the accordion set the onclick property like this :  onclick="MEaccordion(IdToExpand,speed)"
*
*/

function MEaccordion(id,speed){
   if (collapse[id] || expand[id]){
    setTimeout("MEaccordion('"+id+"',"+speed+")",0);
    return;
   }

   var div = document.getElementById(id);
   if (div.style.display=='block'){

      MEslideDown(id,speed);
   }else{

   var accClass = id.split("_")[0];
   var accDivs = getElementsByClass(accClass);
   for(i=0; i<accDivs.length; i++){
	if (accDivs[i].id != id){
		collapse[accDivs[i]] = true;
		MEslideDown(accDivs[i].id,speed);
		collapse[accDivs[i]] = false;
	}
   }

   div.style.display="block";
	MEslideUp(id,speed);
   }

}

function MEevidenzia(id,valore){

        div = document.getElementById(id);
        if (div){
        div.style.opacity = valore/10;
	div.style.filter = 'alpha(opacity=' + valore*10 + ')';
        }
}

function popUp(url){
window.open(url,'','toolbar=no,width=,height=,scrollbars=1');
}

function MEpopup(page,title,width,height){
var win;
 params = "toolbar=0,";

params += "location=0,";

params += "directories=0,";

params += "status=0,";

params += "menubar=0,";

params += "titlebar=0,";

params += "scrollbars=0,";

params += "resizable=0,";

params += "top=0,";

params += "left=50,";
 params += "width="+width+",";

params += "height="+height;
win=window.open(page,title,params);
}

function MEgetElementsByClass(searchClass,node,tag) {
	var classElements = new Array();
	if ( node == null )
		node = document;
	if ( tag == null )
		tag = '*';
	var els = node.getElementsByTagName(tag);
	var elsLen = els.length;
	var pattern = new RegExp("(^|\\\\s)"+searchClass+"(\\\\s|$)");
	for (i = 0, j = 0; i < elsLen; i++) {
		if ( pattern.test(els[i].className) ) {
			classElements[j] = els[i];
			j++;
		}
	}
	return classElements;
}

function MEmove(id,pos,speed){

   div = document.getElementById(id);
   var left = parseInt(div.style.left) ? parseInt(div.style.left) : 0;
   //div.style.position="relative";

   if (left > pos-speed){

    div.style.left = pos+"px";
    //move[id]=false;
   }else{
      left+=speed;
      div.style.left=left+"px";
      slide_div = setTimeout("MEmove('"+id+"',"+pos+",'"+speed+"')",0);
   }
}

function changeMenu_Icon(el,updateMyImg){
	if (typeof updateMyImg == "undefined")
	    updateMyImg = true;
	var menus = document.getElementsByClassName('menus');

	var className = el.className;
	var flag = className.search(/sel/);

		for (i=0;i<menus.length;i++){
			menus[i].style.backgroundImage="url(/img2/mail_template_cat.png)";
		}
		if (updateMyImg)
		    el.className="menus";
		if (flag<0 && updateMyImg){
			el.className="menus sel";
			el.style.backgroundImage="url(/img2/mail_template_cat_minus.png)";
		}

}

function MEfadeOut(el,value,speed,stopValue){

	if (typeof stopValue == "undefined"){
		stopValue = 0;
	}

	if (typeof speed=="undefined" || speed == 0) {
		speed = 0.5;
	}

	if (typeof el == "undefined" || !el){
		return;
	}

	if (typeof value=="undefined")
		value = 10;

	if (value<=stopValue){
		//if (el) el.style.visibility="hidden";
		return;
	}else{
		value=value-speed;
		evidenzia(el,value);
		el.style.visibility="visible";
		setTimeout(function(){MEfadeOut(el,value,speed,stopValue)},0);
	}
}

function MEfadeIn(el,value,speed,stopValue){
	evidenzia(el,0);
	if (typeof speed=="undefined" || speed == 0) {
		speed = 0.5;
	}
	_MEfadeIn(el,value,speed,stopValue);
}

function _MEfadeIn(el,value,speed,stopValue){

	if (typeof stopValue == "undefined")
		stopValue = 10;

	if (typeof el == "undefined" || !el){
		return;
	}

	if (typeof value=="undefined"){
		value = 0;
		el.style.visibility="hidden";
		MEshow(el.id)
	}

	if (value>stopValue){
		el.style.visibility="visible";
		MEshow(el.id)
		return;
	}else{
		value=value+speed;
		evidenzia(el,value);
		MEshow(el.id);

		el.style.visibility="visible";
		setTimeout(function(){_MEfadeIn(el,value,speed,stopValue)},0);
	}
	MEshow(el)
}

function MEgetDefaultProp(el,cssProp){
	try{

	var oEl = document.createElement(el.tagName);

	document.body.appendChild(oEl);
	var defaultProp = MEgetComputedProp(oEl,cssProp);
	oEl.parentNode.removeChild(oEl);

	return defaultProp;

	}catch(e){
		return null;
	}

	return null;
}

function MEgetComputedProp(el,cssProp){
	try{
		if (window.getComputedStyle){
			var compStyle = window.getComputedStyle(el,null);
			return compStyle.getPropertyValue(cssProp);
		}

		if (document.defaultView && document.defaultView.getComputedStyle)
			return document.defaultView.getComputedStyle(el, "")[cssProp];

		if ( el.currentStyle ){
			cssProp = cssProp.replace(/\-(\w)/g, function (strMatch, p1) {
				return p1.toUpperCase();
			});
			return el.currentStyle[cssProp];
		}

		return el.style[cssProp];
	}
	catch(e){

	}
	return null;
}

function MEslideBySide(id,speed){

    if (typeof MEslideBySideTimer != "undefined"){
		clearTimeout(MEslideBySideTimer);
    }

	document.getElementById(id).MESlideStatus="open";

    if (collapse[id]){
        setTimeout("MEslideBySide('"+id+"',"+speed+")",0);
    }else{
		expandw[id] = true;
		var div = document.getElementById(id);
		if (div){
			var stopWidth = MEgetWidth(div);
			div.style.width='0px';
			div.style.visibility = "visible";
			div.style.display = "block";
			div.style.overflowY = "hidden";
			MEexpandByWidth(id,speed,stopWidth);
		}else{
			throw('ERROR - No id='+id+' element in SlideBySide function');
		}
    }
}

function MEexpandByWidth(id,speed,width){
   var div = document.getElementById(id);
   actwidth = div.style.width;

   actwidth = parseInt(actwidth);

   if (!speed){
		div.style.display = "block";
		div.style.width = "";
		expandw[id]=false;
		return;
   }

   if (actwidth > width-speed){

    div.style.width = "";
    expandw[id]=false;
    div.open = true;
	div.closed = false;

   }else{
      actwidth+=speed;
      div.style.width=actwidth+"px";
      slide_div = setTimeout("MEexpandByWidth('"+id+"',"+speed+",'"+width+"')",0);
   }
}
