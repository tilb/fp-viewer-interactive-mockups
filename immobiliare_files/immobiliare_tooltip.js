
function createTootltipIframe(){

	var iFr = document.createElement("iFrame");
	iFr.name = "iFrameTooltip";
	iFr.id= "iFrameTooltip";
	iFr.width = "0";
	iFr.height = "0";
	iFr.border = "0";
	iFr.style.width = "0px";
	iFr.style.height = "0px";
	iFr.style.border = "none";
	iFr.style.position = "absolute";
	iFr.style.top = "0px";
	iFr.style.visibility = "hidden";
	iFr.style.display = "none";
	document.body.appendChild(iFr);

}

appendCss("/includes/immobiliare_tooltip.css","immobiliare_tooltip_css");
function showToolTip(caller,e,_msg,extraOptions){
	try{
		if (!document.getElementById('iFrameTooltip')){
			createTootltipIframe();
		}
		var extraOptionsWidth = null;
		var autoCloseDelay  = null;
		var contentWidth = null;
		var msg;
		if (typeof extraOptions!="undefined"){
			if (typeof extraOptions.width != "undefined"){
				var extraOptionWidth = parseInt(extraOptions.width);
			}
			if (typeof extraOptions.autoCloseDelay != "undefined"){
				autoCloseDelay = parseInt(extraOptions.autoCloseDelay);
			}
		}
		if (typeof autoCloseDelay == "undefined")
			autoCloseDelay = null;
		var scrollY = (document.all)?document.documentElement.scrollTop:window.pageYOffset;
		var scrollX = (document.all)?document.documentElement.scrollLeft:window.pageXOffset;
		var wHeight = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight;
		var wWidth = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth;
		var callH = MEgetHeight(caller);
		var mouseX = 0;
		var mouseY = 0;
		var delay = 0;
		pos = getPosition(caller);
		mouseX = pos.x;
		mouseY = pos.y;
		if (mouseX < 0){tempX = 0}
		if (mouseY < 0){tempY = 0}
		
		if (typeof _msg == "string"){
			msg = new Array();
			msg['msg'] = "<span style=\"font-size:11px; word-wrap: break-word;\">"+_msg+"</span>";
		}else
		if (typeof _msg == "object"){
			msg = _msg;
		}else{
			throw("nessun messaggio specificato");
			return false;
		}
		if (msg){
			if (!document.getElementById("MEtoolTipDiv"))
				toolTip = document.createElement('div');
			toolTip.className = "MEtoolTipDiv";
			toolTip.id = "MEtoolTipDiv";
			toolTip.style.position="absolute";
			toolTip.style.zIndex="100";
			toolTip.style.top="0px";
			toolTip.innerHTML="";
			closeButton = "";
			if (parseInt(autoCloseDelay) >= 0){
				addExitOnEsc();
				closeButton+="<a href=\"#\" class=\"closeTooltip\" style=\"float:right;color:#E6B0B0;font-size:15px;font-weight:bold;margin-right:5px;\" onclick=\"hideToolTip(toolTip);return false\">x</a>";
			}
			toolTip.innerHTML+="<table style=\"\">";
			if (msg["title"]){
				toolTip.innerHTML+="<tr><td class=ToolTipTD><div style=\"float:left;\" class='title'>"+msg['title']+"</div>"+closeButton+"<div class=\"clear\"></div></td></tr>";
			}else{
				if (closeButton)
					toolTip.innerHTML+=closeButton;
			}
			if (extraOptionWidth && autoCloseDelay>=0){
				contentWidth = "width:" + (extraOptionWidth - 20) + "px";
			}
			if (msg["msg"])
				toolTip.innerHTML+="<tr ><td class=ToolTipTD><div class='msg' style=\"float:left;"+contentWidth+"\">"+msg['msg']+"</div><div class=\"clear\"></td></tr>";
			if (msg['suggerimento'])
				toolTip.innerHTML+="<tr><td class=ToolTipTD><div class='sugg'><span class='title'>Suggerimento:</span><br /> "+msg['suggerimento']+"</div></td></tr>";
			if(msg['warning']) 
				toolTip.innerHTML+="<tr><td class=ToolTipTD><div class='sugg'><span class='title'>Attenzione:</span><br /> "+msg['warning']+"</div></td></tr>"; 
			toolTip.innerHTML+="</table>";
			if (autoCloseDelay > 0 || autoCloseDelay == null)
				addEvent(caller,"mouseout",function(){ return hideToolTip(toolTip)})
			toolTip.style.visibility="hidden";
			document.body.appendChild(toolTip);
			tWidth = MEgetWidth(toolTip);
			if (tWidth > extraOptionWidth){
				toolTip.style.width = extraOptionWidth + "px";
				tWidth = MEgetWidth(toolTip);
			}
			tHeight = MEgetHeight(toolTip);
			
			if (mouseX + tWidth  > wWidth )
				toolTip.style.left=(mouseX - tWidth)+"px";
			else
			if ((mouseX - tWidth/2 )<0 )
				toolTip.style.left=(mouseX)+"px";
			else	
				toolTip.style.left=(mouseX - tWidth/2)+"px";
						
			if (mouseY - tHeight -5< scrollY )
				toolTip.style.top=(mouseY  + callH +10)+"px";
			else
				toolTip.style.top=(mouseY - tHeight -5)+"px";
	
			function x(){
				dispToolTip(toolTip);
				if (typeof autoCloseDelay != "undefined" && autoCloseDelay > 0){
					toolTip._timer = setTimeout("hideToolTip(toolTip)",autoCloseDelay);
				}
			}
			toolTip._timer = setTimeout(x,delay);
		}
		return toolTip;
	}catch(e){
		_doLog(e,"error");
	}
}


function dispToolTip(toolTip){
	
	var iFrameTooltip = document.getElementById("iFrameTooltip");
	iFrameTooltip.style.height = MEgetHeight(toolTip) +"px";
	iFrameTooltip.style.width = MEgetWidth(toolTip) + "px";
	iFrameTooltip.style.zIndex = "100";
	

	iFrameTooltip.style.left = toolTip.style.left;
	iFrameTooltip.style.top = toolTip.style.top;
	iFrameTooltip.style.visibility = "visible";
	iFrameTooltip.style.display = "";
	toolTip.style.visibility="visible";
}

function hideToolTip(toolTip){
	if (typeof toolTip != "undefined" && typeof toolTip._timer != "undefined")
		clearTimeout(toolTip._timer);
	try{
		var iFrameTooltip = document.getElementById("iFrameTooltip");
		iFrameTooltip.style.visibility = "hidden";
		document.body.removeChild(toolTip);
		toolTip=null;
	}catch(e){
		//throw(e);
	}
}

function addExitOnEsc(){
addEvent(document,"keyup", function(e){
var kC  = (window.event) ?    // MSIE or Firefox?
   window.event.keyCode : (e.keyCode ? e.keyCode : e.which);
var Esc = (window.event) ?   
  27 : e.DOM_VK_ESCAPE // MSIE : Firefox
if(kC==Esc)
   hideToolTip(toolTip);
})
}