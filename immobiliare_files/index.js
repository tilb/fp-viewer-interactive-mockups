var __SSOaccounts = new Array();
__SSOaccounts.push(new Array("facebook","oauth"));
__SSOaccounts.push(new Array("google","openid"));
//__SSOaccounts.push(new Array("google","oauth"));

var zone_selected=new Array();
var zone_selected_TI=new Array();
var localita_selected=new Array();

function _fnShSbTim() {
	setTimeout('show_search_box()',5000);
}

function force_search_box_show(){
	//assicura la visualizzazione del form anche in presenza di errori javascript nella pagina
	addEvent(window,'load',_fnShSbTim);
}

function getScrollPosition(name){
	scrolly = (document.all)?document.documentElement.scrollTop:window.pageYOffset;
	scrollx = (document.all)?document.documentElement.scrollLeft:window.pageXOffset;
	createCookie(name+'_yPos',scrolly,0,0,5);
	createCookie(name+'_yPos',scrolly,0,0,5);
}

function resetCookies(){
 createCookie('ricerca_immobili_yPos',0,0,0,5);
 createCookie('ricerca_agenzie_yPos',0,0,0,5);
 createCookie('nuove_costruzioni_yPos',0,0,0,5);
 
}

function setScrollPosition(name){
    var yPos = readCookie(name+'_yPos');
    var xPos = readCookie(name+'_xPos');
   
    if (yPos || xPos){
	window.scrollTo(xPos,yPos);
	setTimeout("resetCookies()",1000);
    }
	
}

function setHomeSection(cat){
	createCookie('home_section',cat);
}

function cambia_categoria_nc(obj){
	var id=obj.id;
	var menus = document.getElementsByClassName("nc_tab");
	for (var i=0; i<menus.length; i++){
		menus[i].setAttribute('class',"nc_tab"); 
	}
	var menu = document.getElementById(obj.id);
	menu.setAttribute('class','nc_tab selected');
	
	
	
	var subid;
	subid = "sub_"+obj.id;
	var submenus = document.getElementsByClassName("sub_idCategoria");
	for (var i=0; i<submenus.length; i++){
		submenus[i].style.visibility='hidden'; 
	}
	var submenu = document.getElementById(subid);
	submenu.style.visibility='visible';
	
}

function resettaEstero(valore){	
	
		if ((valore == 0)&&(window.document.dati.idNazione.value!='')) {

			window.document.getElementById("divEsteroCittaDirette").style.display = 'none';
			window.document.getElementById("linkEsteroDirettiCitta").style.display = 'none';
	
	
		}else{
			window.document.getElementById("divEsteroCittaDirette").style.display = 'none';
			if (!window.document.dati.idNazione.value){
			/*	window.document.getElementById("linkEsteroDirettiCitta").style.display = 'block';
				window.document.getElementById("showLinkEsteroDirettiCitta").style.display = 'block';
*/
			}
			
		}	
	
}

function validateFormHomeRes(){
	var ret_value = false;
	
	if (document.dati.idProvincia && document.dati.idProvincia.value!=''){
		document.dati.azione.value='avviaricerca';
		ret_value = true;
	}
	
	if (!ret_value)
		alert("I campi regione e provincia sono obbligatori");
	
	if (ret_value) {
		if (jq("#tipoRicerca").val() == 'mappa') {
			uncheckZone(document.dati.idProvincia.value);
		} else {
			jq("#gm_area").val('');
			jq("#gm_area").attr("disabled", true);
		}
	}
	return ret_value;
}

function roomManager(fkCategoria,catStanze){
	
	document.getElementById('idCategoria').value = catStanze;
	xajax_getAjaxTipologiaPagIndex(catStanze);
	if( document.getElementById("radio_idContratto1") )
		document.getElementById("radio_idContratto1").onclick= function(){resetForm(fkCategoria);};
	if( document.getElementById("radio_idContratto2") )
		document.getElementById("radio_idContratto2").onclick= function(){resetForm(fkCategoria);};
}

function resetForm(fkCategoria){
	
	if ( document.getElementById("radio_idContratto1") )
		document.getElementById("radio_idContratto1").onclick = null;
	if ( document.getElementById("radio_idContratto2") )
		document.getElementById("radio_idContratto2").onclick = null;
	if ( document.getElementById("idCategoria") )
		document.getElementById('idCategoria').value = fkCategoria;
	xajax_getAjaxTipologiaPagIndex(fkCategoria);
}

function checkTerreno(){
	var _oSel = document.getElementById("idTipologia");
	var sValue = _oSel.value;
	if (sValue == 28){
		document.dati.idCategoria.value = 2;
		document.dati.sottotipologia.value = 67;
	}else{
		document.dati.idCategoria.value = 1;
		document.dati.sottotipologia.value = "";
	}
}

function getProvLink(id){
	var provId = id.replace("_citta","");
	provId = provId.replace(/_\d$/,"");
	if (provId){
		var provTxt = document.getElementById(provId).alt;
		var provLink = createPathLink("Provincia di "+provTxt,null,{id:"path_provincia"});
		return provLink;
	}
}
__dontChangeSearchPath = false;
function enableTooltip(id_zona,clearPath){
	if (isMobile.any())
		return true;
	if (__dontChangeSearchPath == true){
		__dontChangeSearchPath = false;
		return;
	}
	if (document.getElementById('tooltip_map')){
		var oArea=document.getElementById(id_zona);
		titolo=oArea.getAttribute("alt");
		var pathDiv = document.getElementById("tooltip_map");
		tit = titolo;
		var zone = createPathLink(tit,function(){return false;});
		pathDiv.appendChild(zone);
		return;
	}
		
	var pathDiv = document.getElementById("searchPath");
	if (typeof clearPath != "undefined" && clearPath == true){
		if (pathDiv){
			pathDiv.innerHTML = "";
			
		}
	}
	


	var oArea=document.getElementById(id_zona);
	titolo=oArea.getAttribute("alt");
	var _lastMouseOver = createPathLink(titolo,null,{id:"path_regione"});	
	if(window.document.dati.idRegione && window.document.dati.idRegione.value && !(window.document.dati.idComune && window.document.dati.idComune.value)){
		if (document.getElementById('path_provincia')){
			pathDiv.removeChild(document.getElementById('path_provincia'));
		}
		if (document.getElementById('path_comune')){
			pathDiv.removeChild(document.getElementById('path_comune'));
		}	
		if (typeof sitemap !="undefined" && sitemap=="on"){
		    _lastMouseOver = createPathLink(Provincia+" - "+titolo,null,{id:"path_provincia"});
		}else{
		    if (oArea.id.search("citta") > 0){
				var provLink = getProvLink(oArea.id);
				pathDiv.appendChild(provLink);
				_lastMouseOver = createPathLink(titolo,null,{id:"path_comune"});
				
		    }
			else{
				_lastMouseOver = createPathLink("Provincia di "+titolo,null,{id:"path_provincia"});
			}
		}
	}else{
		if (window.document.dati.idComune && window.document.dati.idComune.value){
		if (isNaN(oArea.id)){
			if (document.getElementById('path_provincia')){
			pathDiv.removeChild(document.getElementById('path_provincia'));
		    }
		    if (document.getElementById('path_comune')){
			pathDiv.removeChild(document.getElementById('path_comune'));
		    }
		    if (oArea.id.search("citta") > 0){
			var provLink = getProvLink(oArea.id);
			pathDiv.appendChild(provLink);
			_lastMouseOver = createPathLink(titolo,null,{id:"path_comune"});
		    }else{
			if (typeof sitemap !="undefined" && sitemap=="on"){
				_lastMouseOver = createPathLink(Provincia+" - "+titolo,null,{id:"path_provincia"});
			}else{
				_lastMouseOver = createPathLink("Provincia di "+titolo,null,{id:"path_provincia"});
			}
		    }
		}else{
		    tit = titolo;
		    _lastMouseOver = createPathLink(tit,null);
		}
	    }
	}
	pathDiv.appendChild(_lastMouseOver);
}
	
function disableTooltip(e){
	if (isMobile.any())
		return true;
	__dontChangeSearchPath = false;
	if (document.getElementById('tooltip_map')){
		var pathDiv = document.getElementById("tooltip_map");
		pathDiv.innerHTML = "";
		var nomeComune = "";
		if (typeof __isInserimentoAnnuncio!= "undefined" && __isInserimentoAnnuncio) {
			nomeComune =  window.document.dati._textComune.value;

		} else if ( ( typeof _isAlertEmail != "undefined" && _isAlertEmail ) || ( typeof _isSearchModify != "undefined" && _isSearchModify ) ) {
			if (typeof TI_agComuneField != "undefined") {
				nomeComune = TI_agComuneField.getNome();
			} else {
				var idComune = document.getElementById('TI_comune');
				nomeComune = idComune.options[idComune.selectedIndex].innerHTML;
			}
		} else {                                                            			                        
            // ottengo il nome del comune dalla suggestion o dalla select
            if (typeof __jsSection != "undefined" && __jsSection == "trovacasaStatic" && window.document.getElementById("suggestComune").value != null){
                var nomeComune = window.document.getElementById("suggestComune").value;                
            } else if (window.document.dati.idComune.options) {                
				nomeComune = window.document.dati.idComune.options[window.document.dati.idComune.selectedIndex].innerHTML;
            } else if (typeof searchForm != "undefined" && searchForm) {
                nomeComune = searchForm.getNomeComune();
			}
		}
		var comune = createPathLink(nomeComune,function(){return false});
		pathDiv.appendChild(comune);
		return;
	}
	
	if (document.getElementById("searchPath"))
		writePath();
	
}

function writePath(){
	try{	
	var pathDiv = document.getElementById("searchPath");
	pathDiv.innerHTML = "";
	for (var i=0;i<path.length;i++){
	    var oa = document.createElement("a");
		oa.innerHTML = path[i].innerHTML;
		if (path[i].onclick){
			oa.onclick = path[i].onclick;
		}
		oa.id = path[i].id;
		oa.className = path[i].className;
		pathDiv.appendChild(oa);
	}
	}catch(e){
		
	}
}

function createPathLink(label,action,pars){
	if (typeof action=="undefined")
		action=null;
	var a = document.createElement("a");
	a.innerHTML = label;
	if (action)
		a.onclick = action;
	
	if (typeof pars=="object"){
		if (pars.className)
			a.className = pars.className;
		if (pars.id)
			a.id = pars.id;
	}
	
	return a;
}

function enableBack(ricerca){
	ricerca = null;
	path = new Array();
	
	if (typeof nazione == "undefined"){
	    if (typeof sitemap !="undefined" && sitemap=="on"){
		nazione = multiItalia;
	    }else{
		nazione = "Italia";
	    }
	}

       	gestioneCitta();

	//path.push(createPathLink(Italia,function(){xajax_getAjaxProvincePagIndex('','IT');},{className:"first"}));
	path.push(createPathLink(nazione,function(){xajax_getAjaxProvincePagIndex('','IT');},{className:""}));
	var oDiv = document.getElementById("div_back");

	var isVacanze = typeof searchForm != "undefined" && searchForm && searchForm.isVacanze();
	if (isVacanze) {
		path = searchForm.getBackPath();
	} else if (window.document.dati.idRegione && window.document.dati.idRegione.value!=""){
		path.push(createPathLink(window.document.dati.idRegione.options[window.document.dati.idRegione.selectedIndex].innerHTML,function(){xajax_getAjaxProvincePagIndex(window.document.dati.idRegione.value,"IT");document.getElementById('linkcitta').style.display = '';},{id:"path_regione"}));
		
		if(window.document.dati.idProvincia && window.document.dati.idProvincia.value!=""){
		        if (typeof sitemap !="undefined" && sitemap=="on"){
			    path.push(createPathLink(Provincia+" - "+window.document.dati.idProvincia.options[window.document.dati.idProvincia.selectedIndex].innerHTML,function(){return xajax_getAjaxComuniPagIndex(window.document.dati.idProvincia.value, window.document.dati.idRegione.value);},{id:"path_provincia"}));
		        }else{
			    path.push(createPathLink("Provincia di "+window.document.dati.idProvincia.options[window.document.dati.idProvincia.selectedIndex].innerHTML,function(){return xajax_getAjaxComuniPagIndex(window.document.dati.idProvincia.value, window.document.dati.idRegione.value);},{id:"path_provincia"}));
		        }

			if (window.document.dati.idComune && window.document.dati.idComune.value!=""){
				path.push(createPathLink(window.document.dati.idComune.options[window.document.dati.idComune.selectedIndex].innerHTML,function(){return false;},{id:"path_comune"}));
				
			}
		}
	}

	writePath();
}

function gestioneCitta() {
	if (typeof searchForm != "undefined" && searchForm.isVacanze()) {
		return;
	}
	if( document.getElementById("divCittaDirette") != null) {
		var oDivCitta = document.getElementById("divCittaDirette");
		var oLinkCitta = document.getElementById("linkDirettiCitta");
		var oShowLinkCitta = document.getElementById("showLinkDirettiCitta");
		var olinksContainer = document.getElementById("linkcitta");

		if (window.document.dati.idRegione && window.document.dati.idRegione.value){
			if(window.document.dati.idProvincia && window.document.dati.idProvincia.value){
			    if (oLinkCitta) oLinkCitta.style.display = "none";
			    if (oDivCitta) oDivCitta.style.display = "none";
			    if (oShowLinkCitta) oShowLinkCitta.style.display="none";
			    if (olinksContainer) olinksContainer.style.display="none";
			}
		}else {
		    if (oShowLinkCitta) oShowLinkCitta.style.display = "none";
		    if (oLinkCitta) oLinkCitta.style.display = "block";
		    if (oDivCitta) oDivCitta.style.display = "block";
		    if (olinksContainer) olinksContainer.style.display="block";
		}
	}
}

function enableBack_NC(ricerca){
	ricerca = null;
	path = new Array();
	
	if (typeof nazione == "undefined"){
		nazione = "Estero";
	}
		
	//path.push(createPathLink(Italia,function(){xajax_getAjaxProvincePagIndex('','IT');},{className:"first"}));
	path.push(createPathLink(nazione,function(){},{className:""}));
	writePath();
}

function hideShowLinkCitta(){
	try{
	if(window.document.dati.idRegione.value){
		var newDiv = document.getElementById("showLinkDirettiCitta");
		var oDiv = document.getElementById("linkDirettiCitta");
		if (!oDiv || !newDiv)
			return;
		var childDiv = oDiv.childNodes;
		var numShowCitta = 0;
		svuota_cointainer(newDiv);
		for (var i=0; i< childDiv.length ; i++){
			if(childDiv[i].id && childDiv[i].id.indexOf("link_" + window.document.dati.idRegione.value) > -1 ){
				if(numShowCitta){
					var oSpan = document.createElement("span");
					oSpan.innerHTML +=", ";
					newDiv.appendChild(oSpan);
				}		
				var oHref = document.createElement("a");
				oHref.setAttribute("href","#");
				oHref.className="linkHome";
				oHref.setAttribute("id","show_"+ childDiv[i].id);
				oHref.innerHTML += childDiv[i].innerHTML;
				oHref.setAttribute("onclick",childDiv[i].getAttribute("onclick"));
				newDiv.appendChild(oHref);
				numShowCitta++;
			}
		}
		document.getElementById("linkDirettiCitta").style.display = "none";
		if(!numShowCitta){
			document.getElementById("divCittaDirette").style.display = "none";
			document.getElementById("showLinkDirettiCitta").style.display = "none";
			document.getElementById("linkcitta").style.display = "none";
		}else{
			if (!(window.document.dati.idComune && window.document.dati.idComune.value) && document.getElementById('ricercaAvanzata') && document.getElementById('ricercaAvanzata').style.display=='none'){
				document.getElementById("linkcitta").style.display = "block";
				document.getElementById("divCittaDirette").style.display = "block";
				document.getElementById("showLinkDirettiCitta").style.display = "block";
			}else{
				document.getElementById("linkcitta").style.display = "none";
			}
		}
	}
	}catch(e){
		_doLog(e,"error");
	}
}


function hideShowLinkEsteroCitta(){

        if (window.document.dati.idNazione.value || window.document.dati.idProvincia ) {
		
		var newDiv = document.getElementById("showLinkEsteroDirettiCitta");
		var oDiv = document.getElementById("linkEsteroDirettiCitta");
		
		var childDiv = oDiv.childNodes;
		var numShowCitta = 0;
		svuota_cointainer(newDiv);

		for (var i=0; i< childDiv.length ; i++){
			if(childDiv[i].id && childDiv[i].id.indexOf("link_" + window.document.dati.idNazione.value) > -1 ){
				if(numShowCitta){
					var oSpan = document.createElement("span");
					oSpan.innerHTML +=", ";
					newDiv.appendChild(oSpan);
				}		
				var oHref = document.createElement("a");
				oHref.setAttribute("href","#");
				oHref.setAttribute("id","show_"+ childDiv[i].id);
				oHref.innerHTML += childDiv[i].innerHTML;
				
				oHref.setAttribute("onclick",childDiv[i].getAttribute("onclick"));
				newDiv.appendChild(oHref);
				numShowCitta++;
			}
		}

		//document.getElementById("linkEsteroDirettiCitta").style.display = "none";

		if(!numShowCitta || (window.document.dati.idRegione && window.document.dati.idRegione.value) || document.getElementById("idCategoria3").className == 'selected' || document.getElementById("idCategoria4").className == 'selected' ){
			document.getElementById("divEsteroCittaDirette").style.display = "none";
			document.getElementById("showLinkEsteroDirettiCitta").style.display = "none";
		}
	}
	else
	{
		document.getElementById("divEsteroCittaDirette").style.display = "block";
		document.getElementById("linkEsteroDirettiCitta").style.display = "block";

	}
}


function manage_new_search_button(action){
	if (!document.getElementById("new_search") || __noSearchRestored)
		return;
	var btn = document.getElementById("new_search");
	switch (action){
		case "show" :
			btn.style.display = "block";
			break;
		default :btn.style.display = "none";
	}
	
}


function changeImageNaz(nazione) {
	manage_new_search_button("hide");
	var ShowItem = document.getElementById("div_nazioni");
	ShowItem.style.backgroundImage = 'url(/img2/cartine/' + nazione + '_selected.gif' + getVersion() + ')';
	return true;
}

function hideImageNaz(nazione) {
	manage_new_search_button("show");
	var ShowItem = document.getElementById("div_nazioni");
	ShowItem.style.backgroundImage = 'url(/img2/cartine/transparent.gif)';
	return true;
}
		
function changeImage(region) {
	manage_new_search_button("hide");
	var ShowItem = document.getElementById("div_regioni");
	ShowItem.style.backgroundImage = 'url(/img2/cartine/' + region + '_selected.gif' + getVersion() + ')';
	return true;
}

function hideImage(region) {
	manage_new_search_button("show");
	var ShowItem = document.getElementById("div_regioni");
	if (ShowItem)
	    ShowItem.style.backgroundImage = 'url(/img2/cartine/transparent.gif)';
	return true;
}

function changeImageProv(provincia) {
	manage_new_search_button("hide");
	var oDiv = document.getElementById("div_provincie");
	if (oDiv)
	    oDiv.style.backgroundImage = 'url(/img2/cartine/' + window.document.dati.idRegione.value + '/select_' + provincia + '.gif' + getVersion() + ')';		
}

function hideImageProv(provincia) {
	manage_new_search_button("show");
	var oDiv = document.getElementById("div_provincie");
	if (oDiv)
	    oDiv.style.backgroundImage = 'url(/img2/cartine/transparent.gif)';	
}

function changeImageZone(zona) {
	var suffix = "";
	
	if (typeof window.document.dati.idRegione != "undefined")
		var idRegione = window.document.dati.idRegione.value;

	if (typeof window.document.dati.idProvincia != "undefined")
		var idProvincia = window.document.dati.idProvincia.value;
	
	if (typeof __isTrovaImmobili!="undefined" && __isTrovaImmobili) {
		suffix = "_TI";
		if (isTIVacanze() && TI_agComuneField && TI_agComuneField.getProvincia()) {
			var provincia = TI_agComuneField.getProvincia();
			var idRegione = provincia.regione.idObject;
			var idProvincia = provincia.idObject;
		} else if ( typeof window.document.dati.regione != "undefined")
			var idRegione = window.document.dati.regione.value;
	}
	if ( typeof idRegione == "undefined" || typeof idProvincia == "undefined")
		return;
	
	//ie sulla onclick della zona ricaricando l'immagine della zona cliccata fa scattare anche l'evento mouseover
	//che va inibito sul click
	manage_new_search_button("hide");
	var oDiv = document.getElementById("div_zone"+suffix);
	
	if(oDiv) {
		oDiv.style.backgroundImage = 'url(/img2/cartine/' + idRegione + '/' + idProvincia +'/map_zona_' + zona + '.gif' + getVersion() + ')';
	}
}

function hideImageZone() {
	var suffix;
	if (typeof __isTrovaImmobili!="undefined" && __isTrovaImmobili)
		suffix = "_TI";
	else
		suffix = "";
	manage_new_search_button("show");
	if( document.getElementById("div_zone"+suffix) ) {
		var oDiv = document.getElementById("div_zone"+suffix);
		oDiv.style.backgroundImage = 'url(/img2/cartine/transparent.gif)';
	}	
}

function selectLocalita(citta, zone) {
	var new_selected=new Array();
	var flag=0;

	if (zone_selected.length != 0 ){
		for (i=0,j=0; i< zone_selected.length ;i++){
			if (zone_selected[i] != zone){
				new_selected[j] = zone_selected[i];
				document.getElementById(new_selected[j]).checked = "checked";
				j++;				
			}else {
				flag=1;
			} 
		}
		if (!flag){ 
			new_selected[zone_selected.length] = zone;
		}
		zone_selected=new_selected;
	}else { 
			zone_selected[0] = zone;
	}
	return true;
}

function selectPreselectedZone(citta) {
	if (typeof zone_selected == "undefined" || zone_selected[0] == "undefined" )
		return;
	selectZona(citta, zone_selected[0]);
	
}

function selectZona(citta, zone,type) {
	__dontChangeSearchPath = true; 
	var flag = 0;
	var IE7 = false;
	
	if (typeof window.document.dati.idRegione != "undefined")
		var idRegione = window.document.dati.idRegione.value;
	
	if (typeof __isInserimentoAnnuncio != "undefined"){
		for (i=0,j=0; i< zone_selected.length ;i++)
			if (typeof zone_selected[i] != "undefined"){
				document.getElementById(zone_selected[i]).checked = false;
			}
		document.getElementById(zone).checked = true;
		zone_selected = new Array();
	}
	
	if (typeof __isTrovaImmobili!="undefined" && __isTrovaImmobili){
		type = "TI";
		if (isTIVacanze() && TI_agComuneField && TI_agComuneField.getRegione()) {
			var idRegione = TI_agComuneField.getRegione().idObject;
		} else if ( typeof window.document.dati.regione != "undefined")
			var idRegione = window.document.dati.regione.value;
	}else
	if (typeof type=="undefined")
		type=null;
		
	if (typeof zone=="undefined"){
		flag = 1;
	}
	
	var url_map = "/img2/cartine/" + idRegione + "/" + citta + "/map_zona_";
	
	var oContainer = document.getElementById("zone_container"+ (type ? "_"+type : ""));
	var browser = getBrowser();
	if ( browser && browser[0].toLowerCase().indexOf("explorer")!=-1 && parseInt(browser[1]) < 8){
	//if ( browser && browser.indexOf("msie")!=-1){
		oContainer.style.position ="relative";
		oContainer.style.left = "-150px";
	}
	var new_selected=new Array();
	var zone_sel;
	svuota_cointainer(oContainer);
	
	if (type=="TI")
		zone_sel = zone_selected_TI;
	else
		zone_sel = zone_selected;
	
	if (zone_sel.length != 0 ){
		for (i=0,j=0; i< zone_sel.length ;i++){
			if (typeof zone_sel[i] != "undefined" && zone_sel[i] != zone){
				if (typeof __isInserimentoAnnuncio!="undefined" && __isInserimentoAnnuncio && !!zone){
					document.getElementById(zone_sel[i]).checked = false;
				}else{
					new_selected[j] = zone_sel[i];
					createDivMap(oContainer, new_selected[j], url_map);
					//document.getElementById(new_selected[j]).checked = "checked";
					j++;
				}
			} else {flag=1;} 
		}
		if (!flag){ 
			new_selected[zone_sel.length] = zone;
			createDivMap(oContainer, zone, url_map);
		}
		if (!type)
			zone_selected=new_selected;
		else
		if (type=="TI")
			zone_selected_TI=new_selected;
	}else
	if (typeof zone !="undefined"){
		if (!type){
			zone_selected[0] = zone;
		}
		else
		if (type=="TI")
			zone_selected_TI[0] = zone;
		createDivMap(oContainer, zone, url_map);	
	}
	//TODO invertire chiamate swapZona e SelectZona su alcune mappe (ordine esatto prima selectZona poi SwapZona)
	if (typeof __isInserimentoAnnuncio !="undefined" && __isInserimentoAnnuncio){
		swapZona(zone,type);
	}
	
	if (zone_selected.length > 0) {
		forceTypeSearch('zona');
	} else {
		switchOffBtn('zona');
		jq("#modifica_zona").hide();
	}
	
	return true;
}

function selectProvincia(provincia) {
	var oContainer = document.getElementById("provincie_container");
	var oDivChild = document.createElement("div");
	var oImg = document.createElement("img");
	var browser = getBrowser();
	if ( browser && browser[0].toLowerCase().indexOf("explorer")!=-1 && parseInt(browser[1]) < 8){
	//if ( browser && browser.indexOf("msie")!=-1){
		oContainer.style.position ="relative";
		oContainer.style.left = "-150px";
	}

	svuota_cointainer(oContainer);
	
	oDivChild.style.position="absolute";
	oDivChild.id = provincia;
	oImg.src ="/img2/cartine/" + window.document.dati.idRegione.value + "/select_" + provincia + ".gif"+ getVersion();
	oImg.useMap="#Map";
	oImg.border="0";
	oDivChild.appendChild(oImg);
	oContainer.appendChild(oDivChild);
	
	var oArea = document.getElementById("_map_" + provincia);
	if (oArea)
		oArea.removeAttribute("shape");
}
function selectNazione(nazione) {
	var oContainer = document.getElementById("nazioni_container");
	var oDivChild = document.createElement("div");
	var oImg = document.createElement("img");
	var browser = getBrowser();
	if ( browser && browser[0].toLowerCase().indexOf("explorer")!=-1 && parseInt(browser[1]) < 8){
	//if ( browser && browser.indexOf("msie")!=-1){
		oContainer.style.position ="relative";
		oContainer.style.left = "-150px";
	}

	svuota_cointainer(oContainer);
	
	oDivChild.style.position="absolute";
	oDivChild.id = nazione;
	oImg.src ="/img2/cartine/" + window.document.dati.idNazione.value + "_selected.gif"+ getVersion();
	oImg.useMap="#nazioni";
	oImg.border="0";
	oDivChild.appendChild(oImg);
	oContainer.appendChild(oDivChild);
	
	//var oArea = document.getElementById("_map_" + nazione);
	//oArea.removeAttribute("shape");
}

function createDivMap(oContainer, id_zona, url_map){
	if( typeof(oContainer) == 'undefined' || oContainer == null || typeof id_zona == 'undefined' || !id_zona || !parseInt(id_zona) )
		return;
	
	var oDiv = document.createElement("div");
	var oImg = document.createElement("img");
	
	oDiv.id = "map_zona_" + id_zona;
	oDiv.style.position = "absolute";
	if ( id_zona != '-1' )
		oImg.src = url_map + id_zona + ".gif"+ getVersion();
	else
		oImg.src = '/img2/cartine/transparent.gif'+ getVersion();
		
	oImg.useMap = "#Map";
	oImg.border="0";
	oDiv.appendChild(oImg);
	oContainer.appendChild(oDiv);
}

function svuota_cointainer(oContainer){
	if(oContainer) {
		while (oContainer.hasChildNodes())
			oContainer.removeChild(oContainer.firstChild);
	}
}

function svuotaDivContainer(idDiv)
{
	oDivParent = window.document.getElementById(idDiv);
	if (oDivParent)
		svuota_cointainer(oDivParent);
}


function preloadImageEstero(){
	var oMapNazioni = document.getElementById("nazioni");
	if (oMapNazioni){
		var childDiv = oMapNazioni.childNodes;
		var version = getVersion();
		for (var i=0; i< (childDiv.length - 1) ; i++){
			var imageLoad = new Image();
			if(childDiv[i].id)
				imageLoad.src = "/img2/cartine/" + childDiv[i].id.substring(5) + "_selected.gif" + version;

		}
	}
}

function preloadImageNazione(){
	if (!document.getElementById("regioni"))
		return (null);

	var oMapRegioni = document.getElementById("regioni");
	var aRegioni = oMapRegioni.getElementsByTagName('area');
	var imageLoad = new Image();
	var version = getVersion();
	if (typeof __loaded_regione_index == "undefined")
		__loaded_regione_index = 0;
	else
		__loaded_regione_index++;
		
	if (__loaded_regione_index < aRegioni.length){
		var sPathImg = "/img2/cartine/" + aRegioni[__loaded_regione_index].id.substring(5) + "_selected.gif" + version;
		imageLoad.src = sPathImg;
		imageLoad.onload = preloadImageNazione;
	}
}




function preloadImageProvincie(regione, image){
		var imageLoad = new Image();
		imageLoad.src = "/img2/cartine/" + regione + "/select_prov_" + image + ".gif"+ getVersion();
}

function preloadImageZone(comune, image){
		var imageLoad = new Image();
		imageLoad.src = "/img2/cartine/" + window.document.dati.idRegione.value + "/" + comune + "/map_zona_" + image + ".gif"+ getVersion();
}

function abilitaCitta() {
	var oDivNewCitta = window.document.getElementById("otherLinkDirettiCitta");
	var oDivCitta = window.document.getElementById("linkDirettiCitta");
	if (oDivNewCitta && oDivCitta){
		oDivAltre = window.document.getElementById("linkAltreCitta");
		if(oDivAltre)
			oDivAltre.style.display="none";
		oDivCitta.innerHTML += oDivNewCitta.innerHTML;
	}
}

String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
};
String.prototype.ltrim = function() {
	return this.replace(/^\s+/,"");
};
String.prototype.rtrim = function() {
	return this.replace(/\s+$/,"");
};

function createAnimatedButton(className,divContainer,onclickEvent,name,value,id){
	//permitted className = bottoneCerca - bottoneTrova - bottoneInvia - bottoneAttivaServizio
	var div;
	if (typeof divContainer == "string")
		div = document.getElementById(divContainer);
	else
		div = divContainer;
	
	var btn = document.createElement('input');
	btn.className = className;
	if(typeof name!='undefined')
		btn.name=name;
	if(typeof id!='undefined')
		btn.id=id;
	
	if (onclickEvent){
		addEvent(btn,"click",onclickEvent);
		btn.type="button";
	}else{
		btn.type="submit";
		
	}
	if (value)
		btn.value = value;
	else
		btn.value = "";
	
	//devo fare il bind perchè co explorer non funziona
	btn.style.position='relative';
	btn.onmousedown = function(){this.style.top='1px';this.style.left='1px';};
	btn.onmouseup = function(){this.style.top='0px';this.style.left='0px';};
	btn.onmouseout = function(){this.style.top='0px';this.style.left='0px';};
	btn.onmouseover = function(){this.style.backgroundPosition='bottom';};
	btn.onmouseout = function(){this.style.backgroundPosition='top';};
	btn.onfocus = function(){this.blur();};
	
	div.appendChild(btn);

	addEvent(window,"unload",function(){purgeDomObj(btn);});

}

function createCss3Button(color,className,divContainer,onclickEvent,tagType,name, value){
	var btnContainer;
	if (typeof divContainer == "string")
		btnContainer = document.getElementById(divContainer);
	else
		btnContainer = divContainer;
	//creo div esterno del gradiente colore
	var btnGradient = document.createElement('div');
	btnGradient.className = "buttonCss3 "+ color;
	//creo div bordo 
	var btnBorder = document.createElement('div');
	btnBorder.className = "bordoBtnCss3 ";
	
	if(typeof tagType !='undefined' && tagType == 'span') {
		var btn = document.createElement('span');
		if (onclickEvent){
			addEvent(btn,"click",onclickEvent);
		}
		if (value)
				btn.innerHTML = value;
			else
				btn.innerHTML = "";
	} else {
		
		var btn = document.createElement('input');
		
		if(typeof name!='undefined') btn.name=name;

		if (onclickEvent){
			addEvent(btn,"click",onclickEvent);
			btn.type="button";
		}else{
			btn.type="submit";
		}
		
		if (value){
			btn.value = value;
		}else{
			btn.value = "";
		}
	}
	btn.className = className;
	
	btnContainer.appendChild(btnGradient).appendChild(btnBorder).appendChild(btn);

}

function disableAnimatedButton(className,divContainer){
	var div;
	if (typeof divContainer == "string")
		div = document.getElementById(divContainer);
	else
		div = divContainer;
	var oButtons = getElementsByClass(className,div);
	for(var i = 0; i < oButtons.length; i++)
	{
		oButtons[i].style.cursor='default';
		evidenzia(oButtons[i], 3);
	}
}

function toggleDiv(idCont,el,openedText,closedText){
    if (typeof el.isShowingDiv == undefined){
        el.isShowingDiv == false;
    }
    if (el.isShowingDiv){
        MEslideDown(idCont,0);
        el.isShowingDiv = false;
        el.innerHTML = closedText;
    }else{
        MEslideUp(idCont,0);
        el.isShowingDiv = true;
        el.innerHTML = openedText;
    }
    el.blur();
}

function closeOpenDiv(closeCont, openCont){
    MEslideUp(openCont,0);
    MEslideDown(closeCont,0);
}

function getVersion() {
	if(typeof version_map != "undefined") {
		return version_map;
	}
	return ""; 
}


function __homePageLoginAnimationForm(){
    jq("#containerAccessoHome a[data-toggle='tab']").each(function(){
		jq(this).attr("hideFocus", "true");
        jq(this).click(function(e){
            jq("#containerAccessoHome .nav-tabs li").removeClass("active");
            jq(this).parent().addClass("active");

            jq("#containerAccessoHome .tab-pane").removeClass("active").removeClass("in");
            var y = jq(jq(this).attr("related-tab")).addClass("active").fadeIn();
            var x = function(){
                y.addClass("in");
            }
            setTimeout(x,50);
            e.preventDefault();
            return false;
        })
    });
}

function create_accediBox(_type,options){
	if (typeof _type == "undefined")
		type = "U";
	else
		type = _type;
		
	if (type!="A" && type!="U"){
		alert("wrong type for create_accedi_box");
		return false;
	}
	preloadImages(new Array("/img2/loader3.gif"));
	selAccediBox = new Object;
	var prefix = "";
	boxLoginPars = new Array();
	switch (type){
		case "A":
			prefix = "AG_";
			selAccediBox.form_action = "/accesso_agenzie.php";
			selAccediBox.form_onsubmit = eseguiAccessoAg;
			selAccediBox.title = "<div class=\"box_header title\" ><div id=\"icona_login_agenzia\"></div></div>";
			selAccediBox.footer = "<div style=\"height:20px;margin-top:10px;width:350px;font-size:13px;\">Cerchi, vendi o affitti casa? <a class=\"link_blu\" style=\"font-weight:bold;\" href=\"/accedi.php\">Accedi a<span style=\"margin:0px 3px;\"><img src=\"/img2/box_accesso/logo_box_accedi_myImmo_btm.png\" alt=\"MyImmobiliare\"/></a></div>";
			selAccediBox.registrationLink = "/agenzia/registra-nuova-agenzia.php";
			if( imm_FB != null && typeof imm_FB != 'undefined' )
				imm_FB.stopAutoLogin();
			break;
		default:
			selAccediBox.form_action = "/accedi.php";
			selAccediBox.form_onsubmit = eseguiAccesso;
			selAccediBox.title = "<div class=\"box_header title\"><div id=\"icona_login_utente_piccola\"></div></div>";
			selAccediBox.footer = "<div style=\"height:20px;margin-left: 10px;margin-top:5px;width:350px;font-size:13px;\">Sei un professionista? <a class=\"link_blu\" style=\"font-weight:bold;\" href=\"/accesso_agenzie.php\">Accedi a</a><span style=\"margin:0px 3px;\"></span><a href=\"/accesso_agenzie.php\" class=\"link_blu\" style=\"font-weight:bold;\"><img src=\"/img2/box_accesso/logo_box_accedi_imPro_btm.png\" alt=\"ImmobiliarePro\"/></div>";
			selAccediBox.registrationLink = "/casa/informazioni/registrati.php";
			break;
	}

    selAccediBox.loginType = "";
    selAccediBox.backurl = "";
	if (typeof options == "object"){
		selAccediBox.backurl = options.backurl ? options.backurl : "";
        selAccediBox.loginType = options.loginType ? options.loginType : "";
        selAccediBox.callback = typeof options.callback == "function" ? options.callback : "";


	}
	var ac_backurl = (typeof selAccediBox.backurl != "undefined") && (selAccediBox.backurl != "") ? selAccediBox.backurl : "";

	accediBoxContent = '';
	var that = new Object();
	that.accediBoxContent = accediBoxContent;
	that.type = type;
	that.prefix = prefix;
    that.loginType = selAccediBox.loginType;
    that.callback = typeof  selAccediBox.callback == "function" ?  selAccediBox.callback : null;
		
	selAccediBox.box = new boxOverlay(prefix+'accediBox','grey',{'onlyColoumnCenter':true,'whiteHeader':true });
	selAccediBox.box.onlyColoumnCenter = true;
	selAccediBox.box.setFooter(selAccediBox.footer);
	selAccediBox.box.setTitle("<strong>"+selAccediBox.title+" <img src=\"/img2/LoadingSmall.gif\" style=\"display:none;margin:10px 0px\" id=\""+prefix+"accedi_box_loader\"/></strong>");
	selAccediBox.box.setContent('<div style="width:250px;margin:0px auto;" id="loading_div"><img src="/img2/loader6.gif" id="loading_image"/></div>');
	
	var oAjax = new getMEAjaxObj();
	var ulrAjax = '/login.php?prefix='+prefix+'&type='+type+'&ac_backurl='+ac_backurl+"&loginType="+selAccediBox.loginType;
	oAjax.Request( 'POST' , ulrAjax , function( response ){  writeLogin( response, this.accediBoxContent, this.type, this.prefix  ); if (typeof this.callback == "function") this.callback(); }.bind( that ) );
    trackGAClickEvent("boxLoginEvents","requestLogin",type);
	return selAccediBox.box;
}


function enterSubmitCheck(e, elemento, callback) {
    var el = jq(elemento);
    var kC  = (window.event) ? window.event.keyCode : (e.keyCode ? e.keyCode : e.which); /* MSIE or Firefox? */
    if (kC != 13)
        return;

    var attachEvent = false;
    //3 checks undefined jquery, typeof undefined nativo, check stringa su cast di undefined di jquery
    if (el.attr("old-val") == undefined || typeof el.attr("old-val") == "undefined" || el.attr("old-val") == 'undefined')
        attachEvent = true;

    el.attr("old-val",el.val());

    if (attachEvent){
        //el.on("keyup",function(e){
        //    enterSubmit(e,el,callback);
        //});
        //el.attr("click",function(e){alert(1);});
        var that = {};
        that.e = e;
        that.el = el;
        that.callback = callback;
        __entSubCheck = function(){enterSubmit(this.e,this.el,this.callback);}.bind(that);

        el[0].setAttribute("onkeyup","__entSubCheck()");
    }

    function enterSubmit(e, elemento, callback) {
        var kC  = (window.event) ? window.event.keyCode : (e.keyCode ? e.keyCode : e.which); /* MSIE or Firefox? */
        if (kC != 13)
            return;
        var el = jq(elemento);
        if (el.val() == el.attr("old-val")){
            callback();
        }
        else{
            el.attr("old-val",el.val());
        }

    }
}

function writeLogin( response, accediBoxContent, type, prefix ) {
	//recupero html login
	accediBoxContent+= response.responseText;
	selAccediBox.box.stop_event_bubbling = true;
	selAccediBox.box.setContent(accediBoxContent);
	selAccediBox.initContent = selAccediBox.box.getContent();
	createAnimatedButton("bottoneAccediBoxLogin",prefix+"accediButton_container",function(){return selAccediBox.form_onsubmit(document.getElementById(prefix+'box_accedi_form'));});
	addPlaceHolderCompatibility(prefix+'box_accedi_form');

    jq( '#usernameLoginInput' ).keydown( function( e ) {
        enterSubmitCheck(e,this,function(){selAccediBox.form_onsubmit( document.getElementById ( prefix+'box_accedi_form' ) );});
    });
    trackGAClickEvent("boxLoginEvents","rendered",type);
	
	if( typeof imm_FB != 'undefined' && imm_FB != null )
		imm_FB.initListnerClickStopAutoLogin();
}

/**
* Funzione per la gestione del contenuto dei campi input del login
* @option obj sender -> Elemento chiamante la funzione
* @option string value -> Valore che l'elemento chiamante assume al momento della chiamata
* @option e string -> Stringa che determina il tipo di evento che ha chiamato la funzione
*/
function controlInputLogin( sender, value, e ) {
	if ( e == 'focus' && sender.value == value ) {
		if ( sender.type == 'text' && sender.name != "email" && sender.name != "username") {
			sender.name = 'password';
			sender = changeInputType( sender, 'password' );
		}
	sender.value = '';
	jq(sender).addClass("textInput").removeClass("placeHolder");
	setTimeout(function(){ sender.focus(); },400);
	}else if (e == 'focus' && sender.value !== value){
		jq(sender).addClass("textInput").removeClass("placeHolder");
	}
	if ( e == 'blur' && sender.value == '' ) {
	if ( sender.type == 'password' && sender.name != "email") {
		sender.name = '';
		sender = changeInputType( sender, 'text' );
	}
	sender.value = value;
	jq(sender).addClass("placeHolder").removeClass("textInput");
	} else if (e == 'blur' && sender.value !== '' && sender.value !== value){
		jq(sender).addClass("textInput").removeClass("placeHolder");
	}
} 
/**
 * Funzione che cambia il tipo ad un campi input
 * @option obj oldObject -> Riferimento all'elemento input a cui cambiare il tipo
 * @option string type -> Il tipo che si vuole assegnare al campo input ( 'text', 'password', 'hidden' )
 */
function changeInputType(oldObject, oType) {
	var LTIE7 = false;
	var browser = getBrowser();
	if ( browser && browser[0].toLowerCase().indexOf("explorer")!=-1 && parseInt(browser[1]) <= 7 ){
        LTIE7 = true;
	}
	//Bug fix creazione tag name su ie7
	if ( LTIE7 ){
		var newObject = document.createElement( '<input type="'+oType+'" placeholder="Password" name="'+oldObject.name+'" />' );
	}
	else{
		var newObject = jq('<input/>', {
		'placeholder':'Password',
		name:oldObject.name,
		type:oType
		});
		
		var newObject = newObject[0];
	}

	//Recupera tutti gli attributi del vecchio oggetto e li setta nel nuovo
	var a = oldObject.attributes;
	if ( a ) {
		l = a.length;
		for ( var i = 0; i < l; i += 1) {

			n = a[i].name;

			if ( n != 'type' && n!= 'placeholder' ) {
				if ( n == 'class' )
					newObject.className = oldObject.className;
				else if ( typeof oldObject[n] == 'function' ){
					newObject.setAttribute( n, oldObject.getAttribute( n ) );
                }
				else
					newObject.setAttribute( n, oldObject[n] );
			}
		}
	}

	oldObject.parentNode.replaceChild( newObject, oldObject );
	if (typeof(oldObject._chtAttachedEvents) == "undefined"){ /*verifica se gli eventi focus/blur sono stati già associati al nuovo oggetto newObject */
        oldObject._chtAttachedEvents = 1;		
		jq(document).on("focus","#"+newObject.id,function () {
			var el=document.getElementById(newObject.id);												    
			if (jq(this).attr('placeholder') != '' && jq(this).val() == jq(this).attr('placeholder')) {
				jq(this).val('').removeClass('placeHolder').addClass('textInput').select();
				if(el.type=="text"){
					var nuovo_campo_inputPassword=changeInputType(el,"password");
					setTimeout(function(){ nuovo_campo_inputPassword.focus(); },300);	
				}
			}
		});
        jq(document).on("blur","#"+newObject.id,function () {
			var el=document.getElementById(newObject.id);
			if (jq(this).attr('placeholder') && (jq(this).attr('placeholder') != '') && (jq(this).val() == '' || jq(this).val() == jq(this).attr('placeholder'))) {
				jq(this).val(jq(this).attr('placeholder')).addClass('placeHolder').removeClass('textInput');
				if(el.type=="password"){	
					changeInputType(el,"text");
				}
			}
		});
	}
					
	return newObject;
}



/*function checkOpenedSession(){

	if (!readCookie("IMMSESSID")){
		return false;
	}
	
	showAlertTip("<strong>Recupero sessione precedente in corso.....</strong>","info");
	
	var hostname = document.location.host;
	if (document.getElementById("accedi_box_loader"))
		document.getElementById("accedi_box_loader").style.display="";
	
	if (typeof SSOwindow != "undefined")
		SSOwindow.close();
	
	var checkurl = "http://"+hostname+"/accedi.php?action=checkSession";
	var aj = getMEAjaxObj();
	var obj = {};
	
	aj.Request("POST",checkurl,function(response){
		var url;
		
		if (parseInt(response.responseText) == 1){
			showAlertTip("<strong>Sessione recuperata con successo, eseguo Login.....</strong>","info");
			var rechargeHtml = "<div style=\"width:100%;padding:40px 0px;text-align:center\"><h3>Ripristino Sessione in corso...</h3><img src=\"/img2/loader3.gif\" alt=\"loading\"/></div>";
			var box = new boxOverlay('SSOaccediBox','grey');
			box.setTitle("<div class=\"box_header title\"><div id=\"icona_login_utente\"></div></div>");
			box.setContent(rechargeHtml);
			box.show();
			setTimeout(function(){
				window.location.href = getOnAccessRelocationUrl();
			},2000);
			if (document.getElementById("accedi_box_loader"))
				document.getElementById("accedi_box_loader").style.display="none";
			return true;
		}else{
			
			showAlertTip("<strong>La sessione non è più valida, rieseguire l'accesso.</strong>","error",2000);
		}
		if (document.getElementById("accedi_box_loader"))
			document.getElementById("accedi_box_loader").style.display="none";
		return false;
	}.bind(obj));
	
	return true;
	
}
*/
function getOnAccessRelocationUrl(url){
	
	//array contente le url per cui eseguire il redirect alla pagina specificata o in home page se non specificata
	//myRegExp.push(new Array(/<url attuale da verificare>/, "<url a cui eseguire la redirect> - [opzionale]"));

	var myRegExp = new Array();	
	myRegExp.push(new Array(/registrati\.php/));
	myRegExp.push(new Array(/singleSignOn\.php/));
    myRegExp.push(new Array(/accedi\.php/));
	myRegExp.push(new Array(/pubblica_annuncio_privato\.php/,"/inserimento_annuncio_privati.php"));
	
	var loc = url;
	
	if (typeof url=="undefined" || !url)
		loc = window.location;
	else
	if (!checkUrl(url))
		loc = "/";
	
	for (var regExp in myRegExp){		
		var re = new RegExp(myRegExp[regExp][0]);
		var m = re.exec(loc);		
		if (m != null) {
			if (typeof myRegExp[regExp][1] != undefined)
				return  myRegExp[regExp][1] != undefined ?  myRegExp[regExp][1] : "/";
		}
	}
	
	return loc;
	        
}

function SSOLogin(account,mode,options){
	deleteCookie('autoSyncFacebook');
	__can_close_SSOpopup = true;
	
	/*if (typeof account=="undefined"){
		throw("Called SSO without 'account' parameter");
		return false;
	}
	
	if (typeof mode=="undefined"){
		throw("Called SSO without 'mode' parameter");
		return false;
	}
	*/
	
	var hostname = document.location.host;
	if (typeof SSOwindow != "undefined")
		SSOwindow.close();
		
	if (typeof account=="undefined" || !account || typeof mode=="undefined" || !typeof mode){
		var url = "http://"+hostname+"/singleSignOn.php?action=dologin&accountType="+account+"&mode="+mode;
	}else{
		var url = "http://"+hostname+"/singleSignOn.php?action=dologin&accountType="+account+"&mode="+mode;
		if (document.getElementById('persistent_flag') && document.getElementById('persistent_flag').checked){
			url+="&persistent=1";
		}
	}
	
	var syncFacebook = false;
	var forceClose = false;
	if (typeof options == "object"){
		if (options.extraUrlPars)
			url+="&"+options.extraUrlPars;
		if (options.syncOpenGraph)
			var syncFacebook = true;
		if (options.forceClose)
			var forceClose = true;

		if (options.facebook_scope){
			url+="&sso_scope="+options.facebook_scope;
		}
	}
	
	if (document.getElementById("accedi_box_loader"))
		document.getElementById("accedi_box_loader").style.display="";
	
	SSOwindow = popup(url,"MyImmobiliare","900","500");
	if (typeof selAccediBox == "undefined" || selAccediBox.box != null){
		create_accediBox("U");
		if (!syncFacebook)
			selAccediBox.box.show();
	}
	
	selAccediBox.box.hideOnlyBox();
	selAccediBox.box.addEventOnClose(function(){
		if (SSOwindow && typeof SSOwindow != "undefined") {
			SSOwindow.close();
			if (typeof checkPopupInterval!="undefined")
				clearInterval(checkPopupInterval);
		}
		deleteCookie('actionAD');
	});
	if (forceClose) {
		window.location.reload();
		__can_close_SSOpopup = true;
	}

	if (SSOwindow && typeof SSOwindow != "undefined") {
		checkPopup(options);
	}

	return true;
}

function checkPopup(options) {
	options = options || {};
	checkPopupInterval = setInterval(function () {
		if (SSOwindow.closed) {
			if (__can_close_SSOpopup) {
				selAccediBox.box.close();
				if (typeof options.handler == 'function') {
					options.handler();
				}
			}
			clearInterval(checkPopupInterval);
		}
	}, 500);
}


function checkAndSSOLogin(account,mode){
	if (typeof account=="undefined"){
		throw("Called SSO without 'account' parameter");
		return false;
	}
	if (typeof account=="undefined"){
		throw("Called SSO without 'mode' parameter");
		return false;
	}
	
	
	var hostname = document.location.host;
	if (document.getElementById("accedi_box_loader"))
		document.getElementById("accedi_box_loader").style.display="";
	
	if (typeof SSOwindow != "undefined")
		SSOwindow.close();
	
	var url = "http://"+hostname+"/singleSignOn.php?action=start&accountType="+account+"&mode="+mode;
	SSOwindow = popup(url,"MyImmobiliare","500","300");
	selAccediBox.box.hide();
	
	var checkurl = "http://"+hostname+"/singleSignOn.php?action=checktoken&accountType="+account+"&mode="+mode;
	var aj = getMEAjaxObj();
	var obj = {};
	obj.account = account;
	obj.mode = mode;
	obj.checkOnly = checkOnly;
	aj.Request("POST",checkurl,function(response){
		var url;
		var account = this.account;
		var mode = this.mode;
		var checkOnly = this.checkOnly;
		
		if (parseInt(response.responseText) == 1){
			var rechargeHtml = "<div style=\"width:100%;padding:40px 0px;text-align:center\"><h3>Accesso in corso...</h3><img src=\"/img2/loader3.gif\" alt=\"loading\"/></div>";
			var box = new boxOverlay('SSOaccediBox','grey');
			box.setContent(rechargeHtml);
			
			window.location.reload();
			document.getElementById("accedi_box_loader").style.display="none";
			return true;
		}else{
			
			switch (account){
				case "google":
					if (mode=="openid")
						url = "http://"+hostname+"/singleSignOn.php?action=start&accountType=google&mode=openid";
					else
						url = "http://"+hostname+"/singleSignOn.php?action=start&mode=oauth&accountType=google";
					break;
				case "facebook":
					url = "http://"+hostname+"/singleSignOn.php?action=start&mode=oauth&accountType=facebook";
					break;
			}
		
			SSOwindow = popup(url,"MyImmobiliare","500","300");
			selAccediBox.box.hide();
		}
		if (document.getElementById("accedi_box_loader"))
			document.getElementById("accedi_box_loader").style.display="none";
		return false;
	}.bind(obj));
}

function eseguiAccesso(oForm, handlerFn){
	if (document.getElementById("accedi_box_loader"))
		document.getElementById("accedi_box_loader").style.display="";
	oForm.mode.value = "xml";
	var error = false;
	if(document.getElementById("loginHomeError")){
		jq("#loginHomeError").css({"height":"0px", "margin-bottom":"0px"}).text("");
	}else{
		jq("#accediBoxError").css("display","none").text("");
	}

	jq("#usernameLoginInput").prev().css("height","0px").text("");
	jq("#passwordLoginInput").prev().css("height","0px").text("");
	if (!oForm.email.value || oForm.email.value=="Username"){
		jq("#usernameLoginInput").prev().css("height","21px").text("Inserisci la tua email");
		jq(oForm.email).addClass('input_error');
		error = true;
	}else
	if (!checkEmail(oForm.email.value)){
		jq("#usernameLoginInput").prev().css("height","21px").text("Inserisci una email valida");
		jq(oForm.email).addClass('input_error');
		error = true;
	} else {
		jq(oForm.email).removeClass('input_error');
	}
	if (!oForm.password || !oForm.password.value || oForm.password.value=="Password"){
		jq("#passwordLoginInput").prev().css("height","21px").text("Inserisci la tua password");
		jq(oForm.password).addClass('input_error');
		error = true;
	} else {
		jq(oForm.password).removeClass('input_error');
	}
	if (!error){
		if (typeof handlerFn == "undefined")
			handlerFn = doLogin;
		submitAjaxForm(oForm,handlerFn);
	}else{
		if (document.getElementById("accedi_box_loader"))
			document.getElementById("accedi_box_loader").style.display="none";
	}
return false;
}

function connectAccountAndLogin(response)
{
	if (trim(response.responseText) == ""){
		window.location.reload();
	}else
	if (checkUrl(response.responseText)){
		window.location.href=response.responseText;
	}
	else{
		var loginErr = document.getElementById("accediBoxError");
		var loginTr3 = document.getElementById("accediBoxErrorTr3");
		loginErr.innerHTML = response.responseText;
		loginTr3.style.display="";
	}
}
function onLoginEvents(who){
    trackGAClickEvent("boxLoginEvents","accesso",who);
	if (document.getElementById('loaderLogin')){
		document.getElementById('loaderLogin').style.display="";
		
	}else{
    var rechargeHtml = "<div style=\"width:100%;padding:40px 0px;text-align:center\">Accesso in corso...<img src=\"/img2/loader3.gif\" alt=\"loading\"/></div>";
    
	if (typeof selAccediBox != "undefined")
		selAccediBox.box.innerHTML= rechargeHtml;
	else{
		if (document.getElementById('contentAccedi'))
			document.getElementById('contentAccedi').innerHTML= rechargeHtml;
	}
	}
}
function doLogin(response){
    var trackLoginType = jq("#trackLoginFormType").val() ? trim(jq("#trackLoginFormType").val()) : "U";
	if (trim(response.responseText) == ""){
        onLoginEvents(trackLoginType);
		setTimeout(function(){
            window.location.reload();
        },500);
	}else
	if (checkUrl(response.responseText)){
        onLoginEvents(trackLoginType);
        setTimeout(function(){
		    window.location.href=response.responseText;
        },500);
	}
	
	else{
		jq("#usernameLoginInput").prev().css("height","0px");
		jq("#passwordLoginInput").prev().css("height","0px");
		jq("#passwordLoginInput,#usernameLoginInput").addClass('input_error');

        var err_width = "307px";
        if(document.getElementById("loginHomeError"))
            err_width = "276px";

        /* Calcolo altezza del div che conterrà l'errore */

        var errDivAppoggio = document.createElement("div");
        jq(document.body).append(errDivAppoggio);
        jq(errDivAppoggio).css("position","absolute").css("width",err_width).css("visibility","hidden").css("display","block").html(response.responseText);
        var err_height = jq(errDivAppoggio).height() + "px";
        jq(errDivAppoggio).remove();

        /* Fine calcolo altezza del div che conterrà l'errore */


		if(document.getElementById("loginHomeError")){
			jq("#loginHomeError").css("width",err_width).html(response.responseText).css({"height":err_height,"margin-bottom":"5px"});
		}else{
			jq("#accediBoxError").css("display","block").css("width",err_width).html(response.responseText).css("height",err_height);
		}
		//loginErr.innerHTML = response.responseText;
		//loginErr.style.display="block";
	}
	if (document.getElementById("accedi_box_loader"))
	document.getElementById("accedi_box_loader").style.display="none";
}

function eseguiAccessoAg(oForm){
	document.getElementById("AG_accedi_box_loader").style.display="";
	oForm.mode.value = "xml";
	
	var error = false;
	jq("#AG_accediBoxError").css("display","none");
	jq("#usernameLoginInput").prev().css("height","0px").text("");
	jq("#passwordLoginInput").prev().css("height","0px").text("");
	
	if (!oForm.email.value || oForm.email.value=="Username"){
		jq("#usernameLoginInput").prev().css("height","21px").text("Inserisci la tua email");
		jq(oForm.email).addClass('input_error');
		error = true;
	}else
	if (!checkEmail(oForm.email.value)){
		jq("#usernameLoginInput").prev().css("height","21px").text("Inserisci una email valida");
		jq(oForm.email).addClass('input_error');
		error = true;
	} else {
		jq("#"+oForm.email.id).removeClass('input_error');
	}

	if (!oForm.password || !oForm.password.value || oForm.password.value=="Password"){
		jq("#passwordLoginInput").prev().css("height","21px").text("Inserisci la tua password");
		jq(oForm.password).addClass('input_error');
		error = true;
	} else {
		jq("#"+oForm.password.id).removeClass('input_error');
	}
	
	if (!error){
		submitAjaxForm(oForm,doLoginAg);
	}else{
		if (document.getElementById("AG_accedi_box_loader"))
		document.getElementById("AG_accedi_box_loader").style.display="none";
	}
	
}

function doLoginAg(response){
	if (isNumeric(response.responseText)){
		var target = document.accedi_form.getAttribute('target');
        onLoginEvents("A");
            setTimeout(function(){
                if (selAccediBox.backurl){
                    if(target == '_parent'){
                        parent.location.href=selAccediBox.backurl;
                    }else{
                        window.location.href=selAccediBox.backurl;
                    }
                    return;
                }
                switch(parseInt(response.responseText)){
                    case 0 :
                        break;
                    case 1 :
                        if(target == '_parent'){
                            parent.location.href="/home_gestionale.php";
                        }else{
                            window.location.href="/home_gestionale.php";
                        }

                        break;
                    case 2 :
                        if(target == '_parent'){
                            parent.location.href="/amministrazione.php";
                        }else{
                            window.location.href="/amministrazione.php";
                        }

                        break;
                    default :
                        if(target == '_parent'){
                            parent.location.href="/index.php";
                        }else{
                            window.location.href="/index.php";
                        }

                        break;
                }
                return;
            },500);
        }

        else{
            var loginErr = document.getElementById("AG_accediBoxError");
            jq("#passwordLoginInput,#usernameLoginInput").addClass('input_error');
			jq("#usernameLoginInput").prev().css("height","0px");
			jq("#passwordLoginInput").prev().css("height","0px");
            loginErr.innerHTML = response.responseText;
            loginErr.style.display="";

        }

        document.getElementById("AG_accedi_box_loader").style.display="none";
}

function checkContratto(idContratto){
	document.getElementById('radio_idContratto'+idContratto).checked = 'checked';
	if (parseInt(idContratto) == 3){
		roomManager(fkCategoria,catStanze);
	}
}

function saveLastSearchCookie(categoria,opzioni, tipologia){
	if (typeof opzioni == "undefined" || typeof categoria == "undefined"){
		_raiseError("called function with empty requested argument");		
	}
	try{
		var sCookie = readCookie('imm_lss1');
		var oCookie = new Object();
		if (sCookie){
			sCookie = Base64.decode(sCookie);
			oCookie = eval( "(" + sCookie + ")" );
		}
		if ( opzioni.tipologia != null)
			categoria = categoria+"_"+opzioni.tipologia;
		oCookie[categoria] = opzioni;
		sCookie = Base64.encode(stringify(oCookie));
		createCookie("imm_lss1",sCookie,90,0,0);
	}catch(e){
		deleteCookie("imm_lss1");
		_raiseError(e);
	}
}
function cleanLastSearch(categoria){
	if (typeof categoria == "undefined"){
		_raiseError("called function with empty requested argument");		
	}
	try{
		var sCookie = readCookie('imm_lss1');
		var oCookie = new Object();
		if (sCookie){
			sCookie = Base64.decode(sCookie);
			oCookie = eval( "(" + sCookie + ")" );
		}
		oCookie[categoria] = null;
		sCookie = Base64.encode(stringify(oCookie));
		createCookie("imm_lss1",sCookie,90,0,0);
		
		manage_new_search_button("hide");
		__noSearchRestored = true;
	}catch(e){
		deleteCookie("imm_lss1");
		_raiseError(e);
	}
}

function getLastSearchCookie(categoria){
	deleteCookie("imm_lss");
	oCookie = null;
	try{
		var sCookie = readCookie('imm_lss1');
		var oCookie = null;
	
		if (sCookie){
			sCookie = Base64.decode(sCookie);
			oCookie = eval( "(" + sCookie + ")" );
		}
	}catch(e){
		deleteCookie("imm_lss1");
		_raiseError(e);
		
	}
	return oCookie;
}

function restoreLastSearchForm(categoria, tipologia, searchForm){
	__noSearchRestored = true;
	if ( typeof tipologia != 'undefined' && tipologia != null )
		categoria = categoria+"_"+tipologia;
	try{
		var oCookie = null;
		oCookie = getLastSearchCookie(categoria);
		if (oCookie && typeof oCookie == "object" && oCookie[categoria] && typeof oCookie[categoria] == "object"){
			if (document.getElementById("new_search"))
				document.getElementById("new_search").style.display = "block";

			if (typeof searchForm != "undefined" && searchForm != null && categoria == "annunci_turistici") {
				searchForm.setFromCookieData (oCookie);
			} else if (oCookie[categoria].provincia != "") {
				xajax_getAjaxProvinciaAndComuniPagIndex(oCookie[categoria].comune,oCookie[categoria].provincia, oCookie[categoria].regione, oCookie[categoria].contratto, stringify(oCookie[categoria]), categoria);
			}
			__noSearchRestored = false;
		}else{
			show_search_box();
		}
	}catch(e){
		show_search_box();
		_raiseError(e);
	}
}

function show_search_box(){
	if (document.getElementById('box_ricerca_HP'))
		document.getElementById('box_ricerca_HP').style.display="";
	if (document.getElementById('box_ricerca_LOAD'))
		document.getElementById('box_ricerca_LOAD').style.display="none";
	if (typeof searchForm != "undefined" && searchForm) {
		searchForm.show();
	}		
}


function selectZoneHome(prov,sCookie){
		oCookie = eval("(" + sCookie + ")");
		zone_selected = new Array();
		if (oCookie.zone){
			zone_selected = new Array();
			for (var i = 0; i < oCookie.zone.length; i++){
				zone_selected.push(oCookie.zone[i]);
				swapZona(oCookie.zone[i]);
			}
			selectZona(prov);
		}
		if (oCookie.localita){
			zone_selected = new Array();
			for (var i = 0; i < oCookie.localita.length; i++){
				zone_selected.push(oCookie.localita[i]);
			}
			selectLocalita(prov);
			salvaZone('localita');
		}	
}


/*
questa funzione effettua il check se ci sono le condizioni per visualizzare la pagina in modalità estesa e quindi
eseguire la funzione specificata come parametro in caso positivo.
@fAction = funzione da eseguire in caso di test positivo
*/

function _ifWidePage(fAction){
	var __widepage = false;
	
	try{
		if (screen.width >= 1280){
			__widepage = true;
		}
	}catch(e){
		__widepage = false;
		
	}

	if (__widepage == true){
		if (typeof fAction == "function")
			fAction();
	}
	return __widepage;
}

function setPageH() {
	var nHeightToBottom = 0;
	
	var viewportHeight = jq( window ).height();
	var headerContainerHeight = jq( '#header_container' ).outerHeight( true );
	var corpoHeight = jq("#corpo").length > 0 ? jq( '#corpo' ).outerHeight( true ) : jq( '#contenuto_backoffice' ).outerHeight( true );
	var footerHeight = jq( '#footer' ).outerHeight( true ); 
	
	try {
		if ( viewportHeight && jq( '#header_container' ) && (jq( '#corpo' ) || jq('#contenuto_backoffice')) && jq( '#footer' ) )
			nHeightToBottom = ( ( viewportHeight ) - ( headerContainerHeight ) - ( corpoHeight ) - ( footerHeight ) );
		if ( nHeightToBottom > 0 )
			jq( '#spacerToFooter' ).css( 'height', nHeightToBottom + 'px' );	
	} catch( error )	{
		;
	}
}
			
	/*		
function setPageW(){
	try{
		var cH = document.getElementById("corpo").getWidth();
		var wH = document.viewport.getWidth();
		//alert("wH:"+wH+" < cH:"+cH+" && wH:"+wH+"< 1024");
		if (wH <= cH && wH < 1000){
			document.getElementById("header_container").style.width = "1000px";
			document.getElementById("footer").style.width = "1000px";
			document.getElementById("corpo_container").style.width = "1000px";
			
		
		}else{
			document.getElementById("header_container").style.width = "auto";
			document.getElementById("footer").style.width = "auto";
			document.getElementById("corpo_container").style.width ="auto";
		
		}
	}catch(r){
	
	}
}
*/
function leoHeader()
{var bLoadLeoHdr = false;
	if (window.location.search.match('utm_source=leonardo&utm_medium=banner')) {
		bLoadLeoHdr = true;
		var dtNow = new Date();
		var dtExpires = new Date();
		dtExpires.setTime(dtNow.getTime() + 1200000 /* 20 minuti */);
		document.cookie = "leoHdr=true;expires=" + dtExpires.toGMTString() + ";path=/";
	}
	if (!bLoadLeoHdr) {
		var asCookies = document.cookie.split("; ");
		for (var nCnt = 0; nCnt < asCookies.length; nCnt++)
		{var asCookie = asCookies[nCnt].split("=");
			if (asCookie[0] == 'leoHdr' && unescape(asCookie[1]) == 'true') {
				bLoadLeoHdr = true;
				break;
			}
		}
	}
	if (bLoadLeoHdr) {
		document.write('<'+'script type="text/javascript" src="http://www.leonardo.it/script/Leonardo_Intruder.php?idEditore=157"'+'><'+'/script'+'>');
	}
}
			
function datiSoc(file,w,h) {
  var l = Math.floor((screen.width-w)/2);
  var t = Math.floor((screen.height-h)/2);
  window.open(file,"","width=" + w + ",height=" + h + ",top=" + t + ",left=" + l +",");
}

function toggleVetrina(){
	var vetrina = document.getElementById('wrap_vetrina_ricerca_container');
	var btn = document.getElementById('toggleVetrina');
	if (vetrina.style.display == "none"){
		vetrina.style.display = "block";
		btn.innerHTML = "nascondi";
		btn.style.backgroundImage = "url(/img2/freccetta_up.png)";
	}else{
		btn.innerHTML = "mostra";
		vetrina.style.display = "none";
		btn.style.backgroundImage = "url(/img2/freccetta_down.png)";
	}
}

function signUpNews(){
	if (checkEmail(document.getElementById('newsLetter_email').value)){
		submitAjaxForm("newsletter_sign",confirmSignupNewsletter,"/signupNewsletter.php");
		document.getElementById('btn_news_letter_cont').innerHTML = "<img src=\"/img2/loader7.gif\" style=\"margin-top:4px\"/>";
	}else{
		alert("Digita una email valida");
	}
}


function confirmSignupNewsletter(res){
	signup_box = new boxOverlay('signupNewsLetter','grey');

	var splittedRes = res.responseText.split(",");
	
	var flag = typeof splittedRes[0] != "undefined" ? splittedRes[0] : "KO";
	var errcode = typeof splittedRes[1] != "undefined" ? splittedRes[1] : 0;
	var uemail = typeof splittedRes[2] != "undefined" ? splittedRes[2] : "";
	
	if (flag=="OK"){
		var response = "Iscrizione avvenuta con successo.";
		var message = "<div>Grazie per esserti iscritto alla newsletter di immobiliare.it.<br /><strong>Abbiamo inviato una mail all'indirizzo email \""+uemail+"\" contenente il link per confermare l'iscrizione</strong>.<br /><br />Riceverai le notizie più interessanti del mercato immobiliare, tutto ciò che è casa ed abitare, e infine le novità e le curiosità scovate dal nostro team editoriale, direttamente nella tua casella di posta.</div>";
	}else{
		var response = "<span style=\"margin:5px 0px;color:red\">Non è stato possibile effettuare l'iscrizione</span>";
		switch(parseInt(errcode)){
			case 1:
				var message = "<div>L'indirizzo email <strong>"+uemail+"</strong> risulta già iscritto alla newsletter di Immobiliare.it</div>";
				break;
			case 2:
				var message = "<div>L'indirizzo email inserito non è valido.</div>";
				break;
			default:
				var message = "<div>Si sono verificati degli errori durante la fase di iscrizione.<br />La preghiamo di riprovare più tardi</div>";
				break;
		}
	}
		signup_box.setContent("<div style=\"width:450px;padding:10px 0px;\"><img style=\"float:left\" src=\"/img2/icone/newsImmobiliare.png\" /><div style=\"float:right;width:350px;\"><div style=\"margin-bottom:5px;font-size:14px\"><strong style=\"margin-bottom:5px;\">"+response+"</strong></div><div class=\"clear\"></div><div style=\"font-size:12px\">"+message+"</div></div>");
		signup_box.setTitle("<strong>Newsletter Immobiliare.it </strong>&nbsp;");
		signup_box.show();
		
		/* reset form*/
		//document.getElementById('newsLetter_email').value="";
		//document.getElementById('newsLetter_email').onblur();
		document.getElementById('btn_news_letter_cont').innerHTML = "";
		createAnimatedButton("puls_freccetta","btn_news_letter_cont", signUpNews);
}


/*crea il boxettino per la conferma della cancellazione annunci pubblicati/preferiti/ricerche salvate relativa agli utenti registrati*/

/*
* sDivContainer: div a cui viene appeso il box overlay
* iWidth, iHeight: dimensioni in px del box
* iIdElToRemove: id annuncio pubblicato/id ricerca da cancellare
* sBookmark: il tipo di bookmark. pubblicati, preferiti, ricerche salvate
*/

function fnConfirmAction(sDivContainer,iWidth,iHeight,iIdElToRemove,sBookmark){
	
	if (typeof ___removeElId != "undefined")
		undoRemove(___removeElId);
	var oParentlayer = document.getElementById(sDivContainer);
	
		
	iHeight = MEgetHeight(oParentlayer);
	iWidth = MEgetWidth(oParentlayer) -2;
	
	var oConfirmLayer = document.createElement("div");
	oConfirmLayer.id="confirm_layer_"+iIdElToRemove;
	oConfirmLayer.style.backgroundColor="#aeaeae";
	oConfirmLayer.style.position="absolute";
	oConfirmLayer.style.filter="alpha(opacity = 80)";
	oConfirmLayer.style.opacity="0.8";
	
	oConfirmLayer.style.border="1px solid";
	oConfirmLayer.style.width=iWidth+"px";
	oConfirmLayer.style.height=iHeight+"px";
	oConfirmLayer.style.zIndex="140";
	
	var oConfirmControl = document.createElement("div");
	oConfirmControl.id = "controls_confirm_container_"+iIdElToRemove;
	oConfirmControl.style.filter="alpha(opacity = 100)";
	oConfirmControl.style.opacity = "1";
	oConfirmControl.style.zIndex = "150";
	oConfirmControl.style.width = iWidth+"px";
	oConfirmControl.style.height = iHeight+"px";
	
	oConfirmControl.style.position = "absolute";
	
	//dimensioni contenitore bottoni
	var iControlsDivWidth = 240; 
	var iControlsDivHeight = 35;
	
	var iControlsMargin =  Math.floor(((iHeight/2)-(iControlsDivHeight/2)))+"px "+" auto";
	
		
	var sHTMLControlContainer = "<div class=\"confirm_control\"></div>";
	
	var sHTMLButtons = "";
	if ( sBookmark == 'preferiti' ) {
		iControlsDivHeight = 70;
		iControlsDivWidth = 250;
		iControlsMargin =  Math.floor(((iHeight/2)-(iControlsDivHeight/2)))+"px "+" auto"
		sHTMLButtons += "<div class=\"rounded-all\" style=\"padding:5px 0px 5px 5px; background:#FFF;position:relative;opacity:1;filter:alpha(opacity = 100);z-index:150;width:"+iControlsDivWidth+"px;margin:"+iControlsMargin+"\">";
		sHTMLButtons += "<div style='font-size:13px; margin:5px;'>Verr&agrave; cancellata anche la nota personale</div>";
		sHTMLButtons += "<div style='float:left; font-size: 13px; margin-top:9px;margin-left:5px;'><strong>Sicuro?</strong></div>";
	} else {
		sHTMLButtons += "<div style=\"position:relative;opacity:1;filter:alpha(opacity = 100);z-index:150;width:"+iControlsDivWidth+"px;height:"+iControlsDivHeight+"px;background-image:url('/img2/fondo-box.png');margin:"+iControlsMargin+"\">";
	}
	sHTMLButtons += "<div class=\"bottoneAnnulla\" onclick=\"undoRemove('"+iIdElToRemove+"')\"></div>";
	
	switch(sBookmark){
	    case('pubblicati'):
	   	sHTMLButtons += "<div class=\"bottoneCancella\" onclick=\"location.href='pubblicaAnnunci.php?action=delete&id="+iIdElToRemove+"';\"></div>";
		break;
	    case('ricerche'):
		sHTMLButtons += "<div class=\"bottoneCancella\" onclick=\"location.href='bookmarkricerche.php?action=delete&idRicerca="+iIdElToRemove+"';\"></div>";
		break;
	    case('preferiti'):
		sHTMLButtons += "<div class=\"bottoneCancella\" onclick=\"location.href='bookmarkannunci.php?action=delete&id="+iIdElToRemove+"';\"></div>";
		break;
	}
	
	sHTMLButtons += "<div class=\"clear\"></div>";
	
	sHTMLButtons += "</div>";
	
	oConfirmControl.innerHTML = sHTMLButtons;
	
	oConfirmLayer.innerHTML = sHTMLControlContainer;
	
	
	oParentlayer.insertBefore(oConfirmLayer,oParentlayer.firstChild);
	
	//disattivo il rollover sul div padre
	//oConfirmLayer.parentNode.className += "_confirm_box";
	
	
	oParentlayer.insertBefore(oConfirmControl,oParentlayer.firstChild);
	
	___removeElId = iIdElToRemove;
	addEvent(document,"keyup", removeConfirmOnEsc);	
	
	return false;
}

function undoRemove(idElToRemove){
	if (typeof idElToRemove == "undefined" || !idElToRemove)
		return;
	fnRemoveNodeById("controls_confirm_container_"+idElToRemove);
	fnRemoveNodeById("confirm_layer_"+idElToRemove);
}

function removeConfirmOnEsc(e){
	
	var kC  = (window.event) ?    // MSIE or Firefox?
		   window.event.keyCode : (e.keyCode ? e.keyCode : e.which);
	var Esc = (window.event) ?   
		  27 : e.DOM_VK_ESCAPE; // MSIE : Firefox
	if(kC==Esc){
		undoRemove(___removeElId);
		removeEvent(document,"keyup", removeConfirmOnEsc);
	}
	
	
}

addEvent(window,'load',setPageH);
addEvent(window,'resize',setPageH);
//addEvent(window,'load',setPageW);
//addEvent(window,'resize',setPageW);
		
 
function createBannerAnnunciSimili(listaId) {
	var idElement = 'box_simili_top';
	var div = document.createElement("div");
	div.id = idElement;
	var parent = document.getElementById("banner_top_container");
	parent.appendChild(div);
	getBannerAnnunciSimili(idElement, listaId);
}

function getBannerAnnunciSimili(idElement, listaId){
	var ajReq = new getMEAjaxObj();
	ajReq.updateHTML("GET","/getAnnunciSimili.php?type=banner_top&section=dettaglio&ids="+listaId, idElement);
}

function togglePannelloSimili(idToggler, idElement)
{
	var oEl = document.getElementById(idElement);
	var oToggler = document.getElementById(idToggler);
	if (oEl && oToggler) {
		if (oEl.style.display=='none') {
			oEl.style.display = 'block';
			oToggler.className = 'icona_box_grigio riduci';
			oToggler.innerHTML = 'chiudi';
			oEl.parentNode.style.borderBottom = '1px none';
		} else {
			oEl.style.display = 'none';
			oToggler.className = 'icona_box_grigio espandi';
			oToggler.innerHTML = 'apri';
		}
	}
}

/**
 * Metodo che rimuove i box per le azioni dell'utente c
 * @returns {undefined}
 */
function removeUserAction() {
	jq( '#bookmarks_left' ).hide();
	jq( '#bookmarksCenter' ).hide();
	jq( '.btn_salva' ).each( function() {
		jq( this ).hide();
	});
}

var mario_i = 0;
function adattaBookmarks(forceSide)
{

	var attattaBookmarksOnScroll = function(){

		if (typeof addattaBookMarksTO != "undefined")
			clearTimeout(addattaBookMarksTO);

		addattaBookMarksTO = setTimeout(adattaBookmarks,0);

	};

	jq(window).unbind('scroll', attattaBookmarksOnScroll);

	if (typeof forceSide == "undefined")
		forceSide = null;
		
	if( typeof anteprimaPage != 'undefined' && anteprimaPage ) {
		removeUserAction();
		return true;
	}
		
    var windowWidth = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth;
    var windowHeight = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight;
	var divContenuto = document.getElementById('contenuto');

    var dimContenuto = MEgetWidth(divContenuto);

	var divRicercaRight = document.getElementById('ricerca_nc_right');
    if( sezioneBookmarks == 'ricerca' && divRicercaRight){
        var ricerca_nc_right= MEgetWidth(divRicercaRight);
        dimContenuto = ( parseInt(dimContenuto) + parseInt(ricerca_nc_right) ) + 20;
    }

    if ( parseInt(windowHeight) < 600 || ( parseInt(dimContenuto) + 98 ) > parseInt(windowWidth) || isIE6() || forceSide == "right") {
		if (document.getElementById('bookmarks_left'))
			document.getElementById('bookmarks_left').style.display = 'none';
		if (document.getElementById('bookmarksCenter'))
			document.getElementById('bookmarksCenter').style.display = 'block';

    } else {

		jq(window).on('scroll', attattaBookmarksOnScroll);


		if (document.getElementById('bookmarks_left'))
			document.getElementById('bookmarks_left').style.display = 'block';
		if (document.getElementById('bookmarksCenter'))
			document.getElementById('bookmarksCenter').style.display = 'none';

		if (windowWidth < 1650){
			jq('#bookmarks_left').addClass("pull-down");
			var scrolly = (document.all)?document.documentElement.scrollTop:window.pageYOffset;
			if (!!scrolly && scrolly >= 940){
				jq('#bookmarks_left').addClass("to-absolute")
			}else{
				jq('#bookmarks_left').removeClass("to-absolute")
			}

		}else{
			jq('#bookmarks_left').removeClass("pull-down");
		}


    }  
}

function slide(id, pos, speed, direction)
{
	div = document.getElementById(id);
	var left = parseInt(div.style.left) ? parseInt(div.style.left) : 0;
	
	if (direction == 'left') {
		if (left >= pos-speed){
			div.style.left = pos+"px";
		}else{
			left += speed;
			div.style.left = left+"px";
			slide_div = setTimeout("slide('"+id+"',"+pos+", "+speed+", '"+direction+"')", 0);
		}
	} else {
		if (left <= pos-speed){
			div.style.left = pos+"px";
		}else{
			left += speed;
			div.style.left = left+"px";
			slide_div = setTimeout("slide('"+id+"',"+pos+", "+speed+", '"+direction+"')", 0);
		}
	}
}

function slidePage(direction, idSlide, section, width)
{
	var speed = 30;
	var maxPage = getElementsByClass('box_'+section).length - 1;
	var lista = document.getElementById(idSlide);
	var offset = parseInt(lista.style.left) ? parseInt(lista.style.left) : 0;
	var currentPage = Math.abs(parseInt(offset / width));
	
	if (direction == 'next')
	{
		if (currentPage >= maxPage)
			return false;
		
		if (currentPage == 0)
			document.getElementById('prev_'+section).style.backgroundPosition = '0px -24px';
		
		if (currentPage+1 >= maxPage)
			document.getElementById('next_'+section).style.backgroundPosition = '0px 0px';
		
		var newPos = -1 * width * (currentPage+1);
		slide(idSlide, newPos, -speed, 'right');
	}
	else if (direction == 'prev')
	{
		if (currentPage <= 0)
			return false;
		
		if (currentPage == maxPage)
			document.getElementById('next_'+section).style.backgroundPosition = '0px -24px';

		if (currentPage-1 <= 0)
			document.getElementById('prev_'+section).style.backgroundPosition = '0px 0px';
		
		var newPos = -1 * width * (currentPage-1);
		slide(idSlide, newPos, speed, 'left');
	}
}


function clickFunction(idElement,e){
	var el = e.target ? e.target : e.srcElement;
	try{
		var elId = el.id;
		switch (elId){
			case "sito_"+idElement:
			case "lista_"+idElement:
			case "link_"+idElement:
				break;
			default:
				var oA = document.getElementById("link_"+idElement);
				if (!oA)
					return true;
				simulateClickOnLink(oA);
				break;
		}
	}catch(e){
		return true;
	}
	return false;
}

/******************************************************* CLASSE Im_ImgTracking PER IL TRACCIAMENTO ********************************************************/

var Im_ImgTracking = function(){
  this.tracker = new ImgTracking();
};
/**
 * Funzione che traccia il click sul un mostra telefono di un agenzia
 * @params string idItem -> nome dell'id o della classe su cui si vuole lavorare
 * @params string name -> da questa stringa si ricava se si vuole lavorare per id o per classe, e qualè sia il nome dell'id o della classe da recuperare
 * @params int idAgenzia -> id dell'agenzia per il tracciamento
 * @params fieldTrack -> tipo di campo telefono dell'agenzia da incrementare
 */
Im_ImgTracking.prototype.openContactAgency = function ( idItem, name, idAgenzia, fieldTrack, event ) {
  var dataTracking = this.getTypeTracking( name );
  var managemenType = dataTracking['managemenType'];
  var nameType = dataTracking['nameType'];
  var link = '/stats/statsAgenzia.php?idAgenzia='+idAgenzia+'&typeTrack=mostraTelefono&fieldTrack='+fieldTrack;
  this.trackInvertVisibility(managemenType,nameType,idItem,link,event); 
};

/**
 * Funzione che inverte la visibilita tra due div
 * @params string managemenType id -> cambia visibilita solo all'elemento cliccato, class -> la cambia a tutti gli elemtni con quella classe 
 * @params string nameType -> nome del div o della classe su cui lavorare
 * @params string idItem -> qualora managemenType si settato ad id allora il campo idItem accodato a nameType identifica il div univoco su cui lavorare
 * @params string actionUrl -> ulr da chiamare per tracciare l'evento
 */
Im_ImgTracking.prototype.trackInvertVisibility = function ( managemenType, nameType, idItem, actionUrl, event ) {
  if( managemenType == 'id' ) {
      document.getElementById( nameType+'_MT_'+idItem ).style.display = 'none';
      document.getElementById( nameType+'_'+idItem ).style.display = 'block';
    
  } else if( managemenType == 'class' ) {
    /* Gestione a classi apre tutti i numeri di telefono */
    var closeDiv = getElementsByClass( nameType+'_MT' );
    if ( closeDiv.length > 0 ) {
      for( var x=0; x < closeDiv.length ; x++ ) {
        closeDiv[x].style.display = 'none';
      }
    }
    var openDiv = getElementsByClass( nameType );  
    if ( openDiv.length > 0 ) {
      for( var x=0; x < openDiv.length ; x++ ) {
        openDiv[x].style.display = 'block';
      }
    } 
  } 
  this.tracker.trackEvent( actionUrl, event );
};

/**
 * Funzione che ricava se si dovra lavorare a classi o per id e il nome del relativo id o classe
 * @params string name -> da questa stringa si ricava se si vuole lavorare per id o per classe, e qualè sia il nome dell'id o della classe da recuperare
 */
Im_ImgTracking.prototype.getTypeTracking =  function ( name ) {
  var nameType = '';
  var managemenType = 'id';
  
  if( name.charAt( 0 ) == "#" ) {
    nameType =  name.split("#"); 
    nameType = nameType[1];
    
  } else if( name.charAt( 0 ) == "." ) {
    nameType =  name.split( "." ); 
    nameType = nameType[1];
    managemenType = 'class';
  
  } else {
    nameType = name;
  } 
  return {"nameType":nameType, "managemenType":managemenType};
};

im_imgTracking = new Im_ImgTracking();

/******************************************************* FINE CLASSE Im_ImgTracking PER IL TRACCIAMENTO ********************************************************/


function checkIpadSlash() {
    //Se i cookie sono abilitati parte il roconoscimento dello userAgent per visualizzare lo splash 
    if( navigator.cookieEnabled ) {
        var is_iPad = navigator.userAgent.match(/\biPad\b/) != null;
        if( is_iPad && !readCookie('splashIpad') ) 
            location.href = VHOST_URL_HOST+'mobile/splashIpad.php';
    }
}

function patchOpera() {
    /* Include il file di patch grafica se il broswer è opera */
    var userBrowser = getBrowser();
    if( userBrowser['name'].toLowerCase() == 'opera' )
        appendCss( VHOST_URL_HOST+'includes/operaPatch.css' );    
}

function changeClass( sender, myClass ) {
   if( typeof sender.toLowerCase() == "string" )
        document.getElementById(sender).className = myClass;
   else
        sender.className = myClass;
}



/************************************** Input Suggestion su Cool-out ***********************************************************/

var suggIndex= 0;
if (typeof oSuggPpFactory == "undefined" && typeof MEPopBoxFactory == 'function'){
	oSuggPpFactory = new MEPopBoxFactory();
	
}

/*
 * @params string options[afterMessageContent] -> Stringa HTML da inserire dopo il messaggio.
 * @params string options[boxOffsetLeft] -> Offset in pixel a sinistra del box.
 */
function showInputSuggestion(input,message,showCloseBtn,neverClose,forceSide,options,isPopup){
	var nomeClasse = '';
	var afterMessageContent = '';
	var boxOffsetLeft = null;
	if ( typeof options != 'undefined' ) {
		if ( typeof options.nomeClasse != 'undefined' )
			nomeClasse = options.nomeClasse;
		if (typeof options.afterMessageContent != 'undefined')
			afterMessageContent = options.afterMessageContent;
		if (typeof options.boxOffsetLeft != 'undefined')
			boxOffsetLeft = options.boxOffsetLeft;
	}
	
	if (typeof neverClose == "undefined")
		neverClose = false;
	if (typeof forceSide == "undefined")
		forceSide = "right";
	
	if (typeof showCloseBtn == "undefined")
		showCloseBtn = false;

	var imgIconClassName = "";

	var inputClass = (typeof input.className != 'undefined') ? input.className : '';
	if ( inputClass.search(/error/)>=0)
		imgIconClassName = " err";

	if(typeof options != 'undefined' && typeof options.changeIcon != 'undefined')
		imgIconClassName += " "+options.changeIcon;
	
	var timeOpen = 1000;
	if(typeof options != 'undefined' && typeof options.openTime != 'undefined')
		timeOpen = options.openTime;
	
	var bCloseButton = (typeof options != 'undefined' && typeof options.closeButton != 'undefined') ? options.closeButton : false;

	var htmlCont = "<div class=\"popupSugg "+nomeClasse+"\">"+
		"<div class=\"icon"+imgIconClassName+"\"></div>"+
		"<div class=\"text\">"+message+"</div>"+afterMessageContent;
		
	if(bCloseButton)
		htmlCont += "<div class=\"MEPB_close buttonCloseLight\"><a href=\"javascript:\">Chiudi</a></div>";

	htmlCont += "<div class=\"clear\"></div>"+
				"</div>";
		
	var postFix = "";
	
	if (typeof showCloseBtn != "undefined" && showCloseBtn){
		postFix = "_1";
	}
	
	suggPopBox = oSuggPpFactory.getPopBox("suggPopBox"+postFix,input);
	suggPopBox.reset ();
	suggPopBox.hideOnEsc = true;
	
	if (forceSide == "left"){
		suggPopBox.forcePosition("left");
		//suggPopBox.forceToLeft = true;
		//suggPopBox.forceToRight = false;
	}
	else{
		suggPopBox.forcePosition("right");
		//suggPopBox.forceToLeft = false;
		//suggPopBox.forceToRight = true;
	}
		
		
	if (showCloseBtn && !neverClose){
		suggPopBox.hideClose = false;	
	}
	else{
		suggPopBox.hideClose = true;
	}
	
	if (neverClose){
		suggPopBox.hideOnEsc = false;
	}

	if (boxOffsetLeft != null) {
		suggPopBox.boxOffsetLeft = boxOffsetLeft;
	}

	suggPopBox.destroyOnClose = true;
	suggPopBox.setContent(htmlCont);
	suggPopBox.timeout = setTimeout(function(){suggPopBox.show();}, timeOpen);
	if (input.id == "not_valid_email"){
		if (typeof _checkValidationCookieInt == "undefined" || !_checkValidationCookieInt)
			_checkValidationCookieInt = setInterval(checkForValidatedEmail,3000);
		
		suggPopBox.addEventOnClose(function(){
			if (typeof _checkValidationCookieInt != "undefined")
				clearInterval(_checkValidationCookieInt);
				_checkValidationCookieInt = false;
			}
		);
	}	
	if (!neverClose)
		addEvent(input, "blur",function(){hideInputSugg(this);}.bind(suggPopBox));
	
	//se è su un popup metto position: fixed e z-index > 300
	if (isPopup)
		suggPopBox.renderVisibleOnPopup();
	
	return suggPopBox;
}

function hideInputSugg(box){
	if (typeof box=="undefined" || !box)
		box = this;
		
	if (box) {
		clearTimeout (box.timeout);
		setTimeout(function(){try{box.hide();}catch(e){}},0);
	}
}

/******************* DETTAGLIO AGENZIA ************************************/
/**
 * Apertura popup orario in dettaglio agenzia
 */
function showOrarioApertura(input,message){
	var nomeClasse = " divorario";
    var imgIconClassName = " orario";
    
	var htmlCont = "<div class=\"popupSugg"+nomeClasse+"\"><div class=\"icon icon"+imgIconClassName+"\">Orari apertura</div><div class=\"text\">"+message+"</div><div class=\"clear\"></div></div>";
	
	suggPopBox = oSuggPpFactory.getPopBox("suggPopBoxOrarioAg",input);
	suggPopBox.hideOnEsc = true;
	suggPopBox.forceToRight = true;	
	suggPopBox.hideClose = false;	
	
	//suggPopBox.destroyOnClose = true;
	suggPopBox.setContent(htmlCont);
	setTimeout(function(){suggPopBox.show();},0);
	
	/*if (!neverClose)
		addEvent(input, "blur",function(){hideInputSugg(this)}.bind(suggPopBox));
*/
}
/**
 * Classe che gestisce lo switch(di visibilita') tra due elementi chiamati master e slave.
 */
var oMultimediaSwitchToggle = function( options ){
	this.plsId = (typeof(options.idpls) != 'undefined') ? options.idpls : "multimediaPlsId";
	this.elMaster = (typeof(options.containermaster) != 'undefined') ? options.containermaster : "idmaster";
	this.elSlave = (typeof(options.containerslave) != 'undefined') ? options.containerslave : "idslave";
	this.plsClass = (typeof(options.classpls) != 'undefined') ? options.classpls : ".multimediaPlsCls";
	this.containerId = (typeof(options.container) != 'undefined') ? options.container : "multimedia";
	this.multiContainer = (typeof(options.multicontainer) != 'undefined') ? options.multicontainer : "multi_container";
	this.type = (typeof(options.type) != 'undefined') ? options.type : 1;
	this.adjustHeightContainer = (typeof(options.adjustheight) != 'undefined') ? options.adjustheight : false;
	
	this._jqPlsId = jq('#'+this.plsId);
	this._jqPlsClass = jq( this.plsClass );
	this._jqContainer = jq('#'+this.containerId);
	this._jqMultiContainer = jq('#'+this.multiContainer);
	this.a_jqElement = { "master": jq('#'+this.elMaster) , "slave": jq('#'+this.elSlave) };
	this.aTxtActive = { "master":"Mostra video", "slave":"Mostra foto" };

	/* lo slave inizialmente display none */
	this.a_jqElement['slave'].css('display','none');
	/* setto data del pulsante di switch, inizialmente master e aggiorno testo pulsante */
	this.setActive('master');
	this.attachListnerEvent();
};
oMultimediaSwitchToggle.prototype.attachListnerEvent = function(){
	var oMulti = this;
	
	if(1 == this.type){
		this._jqPlsId.on("click", function(event){
			//loader
			oMulti.showLoader();
			var sOldActive = jq.data(oMulti._jqPlsId, 'active');
			//change data
			var sNewActive = (sOldActive == 'master') ? 'slave' : 'master';
			oMulti.setActive(sNewActive);
			//animation
			oMulti.a_jqElement[sOldActive].fadeToggle( 600, 'swing', function(){ 
				oMulti.a_jqElement[sNewActive].fadeToggle( 300, 'swing', oMulti.hideLoader() ) ;
			} );
		});
		//HIDE e remove type2 pulsantiera
		jq('#type2').css('display','none').remove();
	}else if(2 == this.type){
		this._jqPlsClass.on("click", { multi: oMulti }, oMulti.oneClick);
		//HIDE e remove type1 pulsantiera
		jq('#type1').css('display','none').remove();
	}
};

oMultimediaSwitchToggle.prototype.oneClick = function(event){
	var btn = event.target;
	var multiManager = event.data.multi;
	
	if( jq( btn ).hasClass('selected') )
		return false;
	
	multiManager.showLoader();

	var sNewActive = jq( btn ).attr('data-show');
	var sibling = jq( btn ).siblings();
	var sOldActive = jq( sibling ).attr('data-show');

	multiManager.setActive(sNewActive);
	jq( multiManager.plsClass+"[data-show='"+sOldActive+"']" ).removeClass('selected');	
	//animation
	multiManager.a_jqElement[sOldActive].fadeToggle( 600, 'swing', function(){ 
		multiManager.a_jqElement[sNewActive].fadeToggle( 300, 'swing', multiManager.hideLoader() ) ;
	} );
};

oMultimediaSwitchToggle.prototype.setActive = function(sActive){
	jq.data(this._jqPlsId, 'active', sActive);
	this._jqPlsId.text( this.aTxtActive[sActive] );
	
	if(2 == this.type){
		jq( this.plsClass+"[data-show='"+sActive+"']" ).addClass('selected');	
	}
};
oMultimediaSwitchToggle.prototype.hideLoader = function(){
	var oMulti = this;
	
	/* height multimedia adjust */
	if(this.adjustHeightContainer){
		var multiHeight = this._jqContainer.height();
		var paddingMulti = this._jqContainer.outerHeight(true) - multiHeight;
		var elHeight = this.a_jqElement[ jq.data(this._jqPlsId, 'active') ].height();
		var diff = Math.round( (multiHeight - elHeight) / 2 );
		(multiHeight > elHeight) ? this._jqContainer.height( multiHeight - diff) : this._jqContainer.height( elHeight + paddingMulti + diff);
	}
	
	setTimeout(function(){ oMulti._jqMultiContainer.removeClass('loader'); }, 900);
};
oMultimediaSwitchToggle.prototype.showLoader = function(){
	this._jqMultiContainer.addClass('loader');
};
/************************************************************************/
/**
* Classe che gestisce la verifica sui domini email
*/
var oEmailDomaniVerification = function( options ){
	//utility
	__DOT = '.';
	__SHARP = '#';
	__R_MOUSEIN = /^mouse(enter|over)/i;

	this.action = (typeof(options._action) != 'undefined') ? options._action : "reg";
	this.emailId = (typeof(options.emailid) != 'undefined') ? options.emailid : "emailRegistrazione";
	this.repemailId = (typeof(options.repemailid) != 'undefined') ? options.repemailid : "emailRegRepeat";
	this.btnSubmitContainer = (typeof(options.btnSubmitContId) != 'undefined') ? options.btnSubmitContId : "bottoneRegistratiContainer";
	this.aBtnSubmit = (typeof(options.btnSubmit) != 'undefined') ? options.btnSubmit : {"r":"btnRegistrati", "a": "btnAggiorna"};

	this.fieldMail = (typeof(options.fieldMail) != 'undefined') ? jq(options.fieldMail) : jq('<input type="text" maxlength="100" name="email" value="" />');
	this.fieldMail.attr('id', this.emailId);
	this.conteinerFieldMail = (typeof(options.containerMailField) != 'undefined') ? jq(__SHARP+options.containerMailField) : jq('#boxContainerMail');

	this.txtPopupFieldMail = (typeof(options.txtPopupMail) != 'undefined') ? options.txtPopupMail : "";
	this.classFieldMail = (typeof(options.clsInputMail) != 'undefined') ? options.clsInputMail : "";
	this.directionPopup = (typeof(options.dirPopup) != 'undefined') ? options.dirPopup : null;

	this._jqEmailId = jq(__SHARP+this.emailId);
	this._jqEmailRepeatId = jq(__SHARP+this.repemailId);
	this._jqSuggestionBox = jq( this.suggestionBox );
	this._jqBtnSubCont = jq(__SHARP+this.btnSubmitContainer);
	this._jqBtnSubmit = (this.action != 'update') ? jq(__SHARP+this.aBtnSubmit["r"]) : jq(__SHARP+this.aBtnSubmit["a"]);

	this.aSuggestionOptions = (typeof(options.suggestOptions) != 'undefined') ? options.suggestOptions : {"divContainerId":"resultVerificationMail","textContainerClass":"text","suggestedMailClass":"suggestedMail"};
	this.aTxtSuggestion = { "f":"Forse intendevi: ", "s":"Non hai inserito un indirizzo email valido!" };

	this.urlVerification = '/services/checkMailDomain.php';
	this.dataVerification = {"soglia": 1000,"maxResult": 5, "mail":""};

	//add mail fild to form
	this.conteinerFieldMail.append(this.fieldMail);
	if(!jq.isEmpty(this.classFieldMail))
		jq(this.fieldMail).addClass( this.classFieldMail );

	/* attachEvent */
	this.attachListnerEvent();
};
oEmailDomaniVerification.prototype.attachListnerEvent = function(){
	var oEDV = this;

	/** var delay su keyup */
	var beLate = (function(){
		var timer_ = 0;
		return function(callback, ms){
			clearTimeout (timer_);
			timer_ = setTimeout(callback, ms);
		};
	})();

	this.fieldMail.on('keyup',function() {
		beLate(function(){

			var contentMail = oEDV.fieldMail.val();
			if(isEmail(contentMail)){
				oEDV.checkCorrectEmail( false );
			}
		}, 500 );
	});


	this.fieldMail.on('blur', function (ev) {
		var containerSuggest = jq('#' + oEDV.aSuggestionOptions['divContainerId']);
		//se non ho risultati, e per caso il suggerimento è ancora aperto...
		if (jq.isEmpty(containerSuggest) || containerSuggest.is(":hidden"))
			oEDV.checkCorrectEmail(true);
	});

	this.fieldMail.on('focus', function(){
		showInputSuggestion(this, oEDV.txtPopupFieldMail,null,null, oEDV.directionPopup);
	});
};

oEmailDomaniVerification.prototype.checkCorrectEmail = function( closeSuggestDiv ){
	var oEDV = this;
	var closeSuggest = (typeof closeSuggestDiv == 'undefined') ? true : closeSuggestDiv;


	var contentMail = oEDV.fieldMail.val();
	if(isEmail(contentMail)){
		oEDV.dataVerification['mail'] = contentMail;

		var rMailVerification = jq.getJSON( oEDV.urlVerification, oEDV.dataVerification )
			.done(function( data ) {
				oEDV.manageResult( data, closeSuggest );
			})
			.fail(function() {
				_doLog("Check emailVerification class!");
			})
			.always(function() {
				// faccio partire il timeout/
			});
	}else if(!jq.isEmpty( contentMail )){
		oEDV.errorMail();
	}
};

oEmailDomaniVerification.prototype.attachListenerSuggestedMail = function(){
	var oEDV = this;

	jq('.'+this.aSuggestionOptions['suggestedMailClass']).on('click', function(){
		var mInsert = jq( this ).attr('data-email');
		var containerSuggest = jq(__SHARP+oEDV.aSuggestionOptions['divContainerId']);
		if(!jq.isEmpty(mInsert)){
			oEDV.fieldMail.val( mInsert );

			if(!jq.isEmpty(oEDV._jqEmailRepeatId)){
				oEDV._jqEmailRepeatId.val('');
				oEDV._jqEmailRepeatId.focus();
			}

			if(!jq.isEmpty( containerSuggest ) && containerSuggest.is(":visible"))
			 	containerSuggest.fadeOut(300);
		}
	});
};

oEmailDomaniVerification.prototype.manageResult = function( data, closeSuggest ){
	var closeSuggest = (typeof closeSuggest == 'undefined') ? true : closeSuggest;

	var oEDV = this;
	if(!jq.isEmpty(data) && (data.results.length > 0)){

		var txt = "<strong style='color:#CF0103;'>"+this.aTxtSuggestion['f']+"</strong>";
		var suggMail = [];

		jq.each( data.results, function( i, item ) {
			suggMail.push("<a href='#' class='"+oEDV.aSuggestionOptions['suggestedMailClass']+"' data-email='"+item.row_label+"'>"+item.row_label+"</a>");
		});

		txt = txt + suggMail.join(", ");

		jq(__SHARP+this.aSuggestionOptions['divContainerId']+' td' + __DOT + this.aSuggestionOptions['textContainerClass']).html( txt );
		jq(__SHARP+this.aSuggestionOptions['divContainerId']).fadeIn(300);

		if(closeSuggest){
			setTimeout(function(){
				oEDV.closeContainer();
			}, 8000);
		}

		this.attachListenerSuggestedMail();
	}else{
		this.closeContainer();
	}
};

oEmailDomaniVerification.prototype.errorMail = function( data ){
	var oEDV = this;

	setTimeout(function(){
		oEDV.fieldMail.val('');
	}, 500);

	if(!jq.isEmpty(this._jqEmailRepeatId))
		this._jqEmailRepeatId.val('');

	var txt = "<strong style='color:#CF0103;'>"+this.aTxtSuggestion['s']+"</strong>";
	jq(__SHARP+this.aSuggestionOptions['divContainerId']+' td'+ __DOT +this.aSuggestionOptions['textContainerClass']).html( txt );
	jq(__SHARP+this.aSuggestionOptions['divContainerId']).fadeIn(300);

	this.fieldMail.focus();

	setTimeout(function(){
		oEDV.closeContainer();
	}, 3000);
};

oEmailDomaniVerification.prototype.closeContainer = function( ){

	var containerSuggest = jq('#'+this.aSuggestionOptions['divContainerId']);
	//se non ho risultati, e per caso il suggerimento è ancora aperto...
	if(!jq.isEmpty( containerSuggest ) && containerSuggest.is(":visible"))
		containerSuggest.fadeOut(300);

};

/***********************************************************************/
function goToFormFirstError(){
	
	var errs = getElementsByClass("input_error");
	var errsLab = getElementsByClass("errore_inserimento");
	if (errs.length){
		var first_error = errs[0];
		var pos = getPosition(first_error);
		if (pos.y > 50)
			scrollTo(0,(pos.y - 250));

		for (var i=0;i<errs.length;i++){
			errs[i].label = errsLab[i];
			//addEvent(errs[i],"blur",manageErrorLabels.bind(errs[i]));
		}
		
		errs[0].focus();
	}
	
}
/************************************** Fine Input Suggestion su Cool-out ***********************************************************/


function cleanInput(oInput){
	if (oInput.value == oInput.defaultValue){
		oInput.value = "";
		oInput.style.color="#000";
	}
	oInput.onblur = function(){resetDefault(oInput);};
}

function resetDefault(oInput){
	
	if (oInput.value ==""){
		oInput.value = oInput.defaultValue;
		oInput.style.color="#888";
	}
}

/*** OPEN SPOT TV **/
function openPubblicitaTv(baseurl){
    var box = new boxOverlay("box_pubblicitatv","grey");
    
    objPubblicita = new Object;
    objPubblicita.frameVideo = baseurl+"spotTv.php";
    objPubblicita.title = "Video Spot Immobiliare.it";
    objPubblicita.content = "<div style='margin:5px'><iframe src="+objPubblicita.frameVideo+" width=\"631\" height=\"460px\" marginheight=\"0\" marginwidth=\"0\" frameborder=\"0\" scrolling=\"no\" style=\"margin-top: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; display: block; \"></iframe></div>";

    box.stop_event_bubbling = true;
    box.setTitle(objPubblicita.title);
    box.setContent(objPubblicita.content);
    box.initContent = box.getContent();
    box.show();

}

function fnAutosaveAds(autosaveValue)
{
	var objAutosaveFacebook = new getMEAjaxObj();
	objAutosaveFacebook.Request("GET", "/manage_facebook_user.php?action=autosave&autosave="+autosaveValue, function(){});
}

/*---------------------------------------------------------------------------------*
 * funzione che inizializza i pulsanti per la creazione della mappa in home page.
 * --------------------------------------------------------------------------------*/

function initGoogleMapRicercaArea( section, adminLevel, options ) {
	if (typeof options == "undefined") {
		options = new Array();
	}
	
	if (typeof boxPreviewAreaMap != "undefined")
		boxPreviewAreaMap.hide();
	
	if ( typeof section == "undefined" )
		section = '';
	
	if (section == 'homepage')
		createMapOverlay('CartinaGrande');
	
	var map_options =
		{'width':900,'height':500,'zoom':15,'markerType':0,'radius':0,'showMarker':0,'drawPolygon':1,'hasPdi':0,
			'personalizedControl':0,'maximizeDimension':1,'mapControls':0,'adminLevel':adminLevel,'section':section
		};

	if (typeof options != "undefined")
		map_options = jq.extend( {}, map_options, options );

	var __createMapHandler = function() {
		createDinamicGoogleMaps('', map_options, 'Disegna l\'area d\'interesse');
	};

	if ( section == 'alertemail' ) {
		var __openMapHandler = function(opt) {
			if ( jq("#gm_area_TI").val() != '') {
				forceTypeSearch('area', '_TI');
				jq('#zone_cartina_TI').hide();
				jq('#overlay_opacity_map_TI').show();
				jq("#tipoRicerca_TI").val('mappa');
			} else {
				createDinamicGoogleMaps('', opt, 'Disegna l\'area d\'interesse');
			}
		};
		var __deletePolyHandler = function() {
				jq('#zone_cartina_TI').show();
				jq('#overlay_opacity_map_TI').hide();
				jq("#tipoRicerca_TI").val('');
				var isCittaConZona = jq("#cittaConZona").val();
				var isEnabledZone = jq("#enabledZone").val();
				var selectedZone = jq("#zoneTI_ids").val();
				if (parseInt(isCittaConZona) && parseInt(isEnabledZone) && (selectedZone == '0' || selectedZone == '')) {
					jq('#modifica_zona_TI').click();
				}
			};
		jq('#modifica_area_TI').unbind('click').click(__createMapHandler);
		jq('#overlay_opacity_map_TI').unbind('click').click(__createMapHandler);
		jq('#btn_area_TI').unbind('click').click( function(){ __openMapHandler(map_options); } );
		jq('#btn_zone_TI').unbind('click').click(__deletePolyHandler).click( function(event) { switchBtnClass(this, '_TI'); } );
	} else {
		jq('.ui-radio input[type|="radio"]').click(function(){
			if ( jq(this).hasClass('ui-icon-radio-on') )
				jq(this).attr('checked', 'checked');
			else
				jq(this).removeAttr('checked');
		});
		
		var __deletePolyHandler = function() {
				jq('#zone_cartina').show();
				jq('#area_mappa').hide();
				jq('#overlay_opacity_map').hide();
				jq("#tipoRicerca").val('');
			};
		
		jq(".ui-radio div").mouseenter( function() {
			jq(this).removeClass('ui-btn-up-c');
			jq(this).addClass('ui-btn-hover-c');
		}).mouseleave( function() {
			jq(this).removeClass('ui-btn-hover-c');
			jq(this).addClass('ui-btn-up-c');
		});
		
		var isCittaConZona = typeof jq("#infoComuneArea").val() != "undefined" && jq("#infoComuneArea").val() == 'zona';
		var isCittaConLocalita = typeof jq("#infoComuneArea").val() != "undefined" && jq("#infoComuneArea").val() == 'localita';
		var isEnabledZone = jq("#enabledZone").val();
		
		if ( section == 'homepage' || section == 'ricerca' ) {
			jq('#modifica_zona').bind('click').click(function(event) {
				event.stopPropagation();
				manageSelectArea(section, true);
			});
			
			var __openMapHandler = function() {
				
				var input = jq(this).find("input").get(0);
				var selected = input.checked;
				
				manageSelectArea(section, false);				
				if ( !selected && ( typeof jq("#gm_area").val() != "undefined" && jq("#gm_area").val() != '' ) ) {
					forceTypeSearch('area');
					jq('#overlay_opacity_map').show();
					jq("#tipoRicerca").val('mappa');
					jq('#modifica_area').show();
				} else {
					createDinamicGoogleMaps('', map_options, 'Disegna l\'area d\'interesse');
				}
				jq('#modifica_zona').hide();
			};
			
			var __deletePolyHandler = function() {
				jq('#modifica_area').hide();
				jq('#overlay_opacity_map').hide();
				jq("#tipoRicerca").val('');
				
				var input = jq(this).find("input[type=radio]").get(0);				
				var selected = input.checked;
				if (isCittaConZona) {
					var selectedZone = jq("#zone_descrizione").val();
					selectedZone = jq.trim(selectedZone);
					if (selected ||  (isEnabledZone && ( selectedZone.match(/Scegli/g) != null || selectedZone.match(/Tutte/g) != null)) ) {
						jq('#modifica_zona').click();
					} else {
						forceTypeSearch('zona');
						jq('#modifica_zona').show();
					}
				} else if (isCittaConLocalita) {
					var selectedLoc = jq("#localita_descrizione").val();
					selectedLoc = jq.trim(selectedLoc);
					if (selected || selectedLoc.match(/Scegli/g) != null || selectedLoc.match(/Tutte/g) != null) {
						jq('#modifica_zona').click();
					} else {
						forceTypeSearch('zona');
						jq('#modifica_zona').show();
					}
				} else {
					forceTypeSearch('zona');
				}
			};

			jq('#overlay_opacity_map').click(__createMapHandler);
			jq('#btn_area').bind('click').click(__openMapHandler);
			jq('#btn_zone').bind('click').click(__deletePolyHandler);
		}
		
		jq('#ricerca_area').click(__openMapHandler);
		jq('#delete_area').click(__deletePolyHandler);
		jq('#area_testo').click(__createMapHandler);
	}
}

function createMapOverlay(idContent) {
	jq('#'+idContent).append("<div id=\"overlay_opacity_map\" class='overlay_opacity_map_hp' style='display:none;'></div>");
}

function generateUrlPolygonArea(mode, area, google_key, width, height) {
	if (typeof width == "undefined")
		width = 260;
	if (typeof height == "undefined")
		height = 260;
	
	var imgUrl = '';
	switch( mode ) {
		case 'circle':
			var radius = area.radius;
			var center = area.center;
			var lat = area.center[0];
			var lng = area.center[1];
			var options = {'width':width, 'height':height, 'markerType':2, 'radius':radius, 'enableControl':0, 'enableFunction':0, 'style': 'feature:road|element:labels|visibility:off', 'fillColor':'0x005A9B44', 'fillOpacity':'44', 'strokeColor':'0x0E4E73FF', 'strokeOpacity':'FF', 'strokeWeight':2};
			var oStaticMap = new static_GMap('', lat, lng, 0, google_key, options);
			imgUrl = oStaticMap.getUrlStaticMap(false);
			break;
		case 'polygon':
			if (area.length)
				area.push(area[0]);
			var numPoints = null;
			if (typeof __gvs_MAX_STATIC_POLYGON_THUMB_PREVIEW_POINTS != "undefined" && __gvs_MAX_STATIC_POLYGON_THUMB_PREVIEW_POINTS > 0)
				numPoints = __gvs_MAX_STATIC_POLYGON_THUMB_PREVIEW_POINTS;
			var options = {'width':width, 'height':height, 'markerType':3, 'path':area, 'enableControl':0, 'enableFunction':0, 'style': 'feature:road|element:labels|visibility:off', 'fillColor':'0x005A9B44', 'fillOpacity':'44', 'strokeColor':'0x0E4E73FF', 'strokeOpacity':'FF', 'strokeWeight':2, 'numPoints':numPoints};
			var oStaticMap = new static_GMap('', 0, 0, 0, google_key, options);
			imgUrl = oStaticMap.getUrlStaticMap(false);
			break;
	}
	
	return imgUrl;
}

function staticMapHP(oDivContainer, mode, area, google_key, sufix, width, height) {
	if (typeof width == "undefined")
		width = 260;
	if (typeof height == "undefined")
		height = 260;
	
	if (typeof area !== "object")
		return false;
	
	if (!oDivContainer)
		return false;
	
	if (typeof sufix == 'undefined')
		sufix = '';
	
	jq(oDivContainer).empty();
	jq(oDivContainer).append( jq("<img/>").attr('class', 'google_map_loader').attr('id','img_google_map_loader'+sufix).attr('src', '/img2/loader6.gif') );
	
	var imgUrl = generateUrlPolygonArea(mode, area, google_key, width, height);
	if (imgUrl != '') {
		jq(oDivContainer).append( jq("<img/>").attr('style', 'display:none;').attr('class', 'google_map_static').attr('id', 'img_google_map_statics'+sufix) );
		jq('#img_google_map_statics'+sufix).load(function() {
				jq('#img_google_map_loader'+sufix).fadeOut('slow', function(){ jq("#img_google_map_statics"+sufix).fadeIn('slow'); });
			}).attr('src', imgUrl);
		return true;
	}
	
	return false;
}

function staticMapList(oDivContainer, mode, area, google_key) {
	if (typeof area !== "object")
		return false;
	
	if (!oDivContainer)
		return false;
	
	jq(oDivContainer).empty();
	
	var imgUrl = generateUrlPolygonArea(mode, area, google_key);
	
	if (imgUrl != '') {
		jq(oDivContainer).append( jq("<img/>").attr('id', 'img_google_map_statics').attr('src', imgUrl));
		return true;
	}
	
	return false;
}

function resetDrawingMap(scope, idProvincia, idComune) {
	if (typeof window.frames["iframe_box_mappa"] == "undefined")
		return false;
	var win = window.frames["iframe_box_mappa"].window;
	if ( typeof win.generateMap != "object" || typeof win.generateMap.drawingManager != "object" )
		return false;

	win.generateMap.drawingManager.resetMap();
	var fnForceBoundPosition = function() {
			jQuery('#preload').show();
			win.generateMap.forcePolygonPosition( scope, idProvincia, idComune, null, true );
			win.generateMap.drawingManager.switchSubmitBtn(false);
			setTimeout(function(){ jQuery('#preload', parent.document).fadeOut('fast'); }, 1500);
			boxPolygonSearch.removeEventOnShow('fnForceBoundPosition');
		};
	
	boxPolygonSearch.addEventOnShow(fnForceBoundPosition, 'fnForceBoundPosition');
	
	return true;
}

function saveLastSearchArea(categoria, jsonArea, opzioni) {
	if ( typeof opzioni != 'undefined' && opzioni.tipologia != null)
		categoria = categoria+"_"+opzioni.tipologia;
		
	var nameStorage = 'imm_area';
	jq("#gm_area").val(jsonArea);
	
	oStorage = new webStorage();
	var oStoredArea = oStorage.getJSON(nameStorage);
	if (!oStoredArea || typeof oStoredArea != "object")
		oStoredArea = new Object();
	
	oStoredArea[categoria] = jq.parseJSON(jsonArea);
	oStorage.set(nameStorage, stringify(oStoredArea));
}

function createPreviewAreaMap(adminLevel) {
	if (typeof adminLevel == "undefined")
		adminLevel = 3;
	
	var jGMArea = jq("#gm_area").val();
	var GMArea = jq.parseJSON(jGMArea);
	var mode = (GMArea) ? GMArea.mode : '';
	var area = (GMArea) ? GMArea.area : '';
	if (typeof FactoryPopBox == "undefined")
		FactoryPopBox = new MEPopBoxFactory();
	boxPreviewAreaMap = FactoryPopBox.getPopBox("box_preview_area_mappa", document.getElementById('modifica_area'));
	boxPreviewAreaMap.hideClose = true;
	boxPreviewAreaMap.setContent('<div id="preview_area_mappa" style="padding:10px 10px 4px;width:260px;height:260px; line-height:260px; cursor:pointer;"></div>');
	
	var map_options =
		{'width':900,'height':500,'zoom':15,'markerType':0,'radius':0,'showMarker':0,'drawPolygon':1,'hasPdi':0,
			'personalizedControl':0,'maximizeDimension':1,'mapControls':0,'adminLevel':adminLevel
		};
	var __createMapHandler = function() {
			createDinamicGoogleMaps('', map_options, 'Disegna l\'area d\'interesse');
		};
	
	var oPreviewContainer = jq("#preview_area_mappa");
	staticMapList(oPreviewContainer, mode, area, google_key);
	oPreviewContainer.mouseenter(function(){ clearTimeout(fadeOutPreviewMap); });
	oPreviewContainer.mouseleave(closePreviewAreaMap);
	oPreviewContainer.click(__createMapHandler);
}

function showPreviewAreaMap() {
	boxPreviewAreaMap.objRef = document.getElementById('modifica_area');
	if (typeof fadeOutPreviewMap != "undefined") {
		clearTimeout(fadeOutPreviewMap);
	}
	if (jq("#MEPB_DIV_box_preview_area_mappa").css("display") == 'none') {
		boxPreviewAreaMap.show();
	}
}

function closePreviewAreaMap() {
	fadeOutPreviewMap = setTimeout(function() { jq("#MEPB_DIV_box_preview_area_mappa").fadeOut(400);}, 150);
}

function checkOpenPreviewMapHP(categoria) {
	var oStorage = new webStorage();
	var jsonAllDrawedArea = oStorage.get('imm_area');
	
	var allDrawedArea = jQuery.parseJSON(jsonAllDrawedArea);
	var oArea = allDrawedArea[categoria];
	
	if ( oArea && typeof oArea !== "undefined" ) {
		jq('#area_mappa').show();
		jq('#zone_cartina').hide();
		jq("#gm_area").val(stringify(oArea));
		jq("#tipoRicerca").val('mappa');
		jq('#textAreaBtn').html('Area disegnata');
		forceTypeSearch('area', '');
		var bDone = staticMapHP(document.getElementById('overlay_opacity_map'), oArea.mode, oArea.area, google_map_key);
		if (bDone)
			jq('#overlay_opacity_map').show();
	}
}

/******************************************
 * FINE GESTIONE MAPPE
 ******************************************/

/**
 * Disabilita il bottone di conferma al click sulla checkbox
 * @param check ---> HTML element
 */
function disableConferma(check) {
	if (check.checked == false)
		jq(".bottoneConferma").attr("disabled", "disabled");
	else
		jq(".bottoneConferma").removeAttr("disabled");
	
}

/**
 * Mostra gli errori di un form
 * @param (JSON) data ---> array associativo degli errori field->error @example 'nome'->'Nome obbligatorio'
 */
function showErrorContatta(data, id, disableMsg){
	//nascondo la rotella ajax
	jq("#ajax_contatta").hide();
	//scorro tutti i campi e levo la classe degli errori
	jq(".field-box,.field-check-box").each(function(i){
		jq(this).removeClass("field_error");
	});
	//scorro tutti gli elementi del JSON e assegno gli errori ai rispettivi campi
	jq.each(data, function(key, value){
		if (!disableMsg)
			jq("#showError").text(value);
		
		jq("#"+id+key).addClass("field_error")
					  .find("textarea").addClass("input_error");
	});
	//mostro il messaggio degli errori
	jq("#showError").slideDown();
}

function forceTypeSearch(type, sufix) {
	if (typeof sufix == 'undefined')
		sufix = '';
	
	var idElement = '';
	if (type == 'area') {
		idElement = '#btn_area'+ sufix;
	} else if (type == 'zona') {
		idElement = '#btn_zone'+ sufix;
	} else {
		return;
	}
	switchBtnClass(idElement, sufix);
}

function switchOffBtn(type) {
	if (type == 'area') {
		idElement = '#btn_area';
	} else if (type == 'zona') {
		idElement = '#btn_zone';
	} else {			
		jq('.ui-radio div').each(function(){
			jq(this).find('span.ui-icon').addClass('ui-icon-radio-off').removeClass('ui-icon-radio-on');
			jq(this).find('input[type|="radio"]').removeAttr('checked');
		});
		jq(this).find('span.ui-icon').addClass('ui-icon-radio-off').removeClass('ui-icon-radio-on');
		return true;
	}
	
	jq('.ui-radio div').each(function(){
		if ( jq(this).attr('id') == jq(idElement).attr('id') ) {
			jq(this).addClass('ui-radio-off').removeClass('ui-radio-on');
			jq(this).find('span.ui-icon').addClass('ui-icon-radio-off').removeClass('ui-icon-radio-on');
			jq(this).find('input[type|="radio"]').removeAttr('checked');
		}
	});
	
	return true;
}

function switchBtnClass(element, sufix) {
	if (typeof sufix == 'undefined')
		sufix = '';
	
	if ( jq(element).hasClass('ui-radio-on') )
		return;
	
	var isEnabledZone = typeof jq("#enabledZone").val() != "undefined" && parseInt(jq("#enabledZone").val()) == 1;
	if (sufix == '_TI') {
		var isCittaConZona = typeof jq("#cittaConZona").val() != "undefined" && parseInt(jq("#cittaConZona").val()) == 1;
		var isCittaConLocalita = typeof jq("#cittaConLocalita").val() != "undefined" && parseInt(jq("#cittaConLocalita").val()) == 1;
	} else {
		var isCittaConZona = typeof jq("#infoComuneArea").val() != "undefined" && jq("#infoComuneArea").val() == 'zona';
		var isCittaConLocalita = typeof jq("#infoComuneArea").val() != "undefined" && jq("#infoComuneArea").val() == 'localita';
	}
	if ( jq(element).attr('id') == 'btn_zone' + sufix) {
		jq('#modifica_area' + sufix).hide();
		jq('#btn_zone' + sufix + ' input[type|="radio"]').attr('checked', 'checked');
		jq('#btn_area' + sufix + ' input[type|="radio"]').removeAttr('checked');
		if ((sufix == '' && isCittaConLocalita) || (isCittaConZona && isEnabledZone))
			jq('#modifica_zona' + sufix).show();
		else
			jq('#modifica_zona' + sufix).hide();
	} else {
		jq('#modifica_area' + sufix).show();
		jq('#modifica_zona' + sufix).hide();
		jq('#btn_area' + sufix + ' input[type|="radio"]').attr('checked', 'checked');
		jq('#btn_zone' + sufix + ' input[type|="radio"]').removeAttr('checked');
	}
	jq('.ui-radio div').each(function(){
		if (jq(this).attr('id') == jq(element).attr('id')) {
			jq(this).removeClass('ui-radio-off').addClass('ui-radio-on');
			jq(this).find('.ui-icon').removeClass('ui-icon-radio-off').addClass('ui-icon-radio-on');
		} else {
			jq(this).addClass('ui-radio-off').removeClass('ui-radio-on');
			jq(this).find('.ui-icon').addClass('ui-icon-radio-off').removeClass('ui-icon-radio-on');
		}
	});
}


function manageSelectArea(section, show) {
	var isCittaConZona = typeof jq("#infoComuneArea").val() != "undefined" && jq("#infoComuneArea").val() == 'zona';
	var isCittaConLocalita = typeof jq("#infoComuneArea").val() != "undefined" && jq("#infoComuneArea").val() == 'localita';
	var isEnabledZone = typeof jq("#enabledZone").val() != "undefined" && parseInt(jq("#enabledZone").val()) == 1;
	
	if (!isEnabledZone)
		return;
	
	if (show) {
		if (isCittaConZona) {
			if (section == 'homepage')
				showZoneSelect(true);
			else
				showZoneSelectWithMap();
		} else if (isCittaConLocalita) {
			showLocalitaSelect(true);
		}
	} else {
		if (isEnabledZone && isCittaConZona) {
			if (section == 'homepage')
				showZoneSelect(false);
			else
				hideBoxZone();
		} else if (isCittaConLocalita) {
			showLocalitaSelect(false);
		}
	}
}

function manageFormCategoriaTipologiaStanza(){
	
	var selCategoriaStanza = jq("#selCategoriaStanza");
	var divTipologiaStanza = jq("#divTipologiaStanza");
	
	selCategoriaStanza.change(function() {
		if (selCategoriaStanza.val() >= 1){
			divTipologiaStanza.fadeIn("slow");
		} else {
			divTipologiaStanza.removeAttr('selected');
			divTipologiaStanza.find('option:first').attr('selected', 'selected');
			divTipologiaStanza.fadeOut("slow");
		}
	});
}

/********************************************************************************************************************************************************/
/********************************************************* CLASSE GESTIONE AUTO LOGIN UTENTI CON FACEBOOK *********************************************/

//Manager Chiamate
var imm_FB = null;
managerUserAutoLoginFB = function( params ) {	
	var valCookie = readCookie( "autoLoginUserFacebook" );
	if( valCookie == 1 )
 		return false;
	
	imm_FB = new Imm_FB( params );
	imm_FB.onLogin = function() { 
		__userLogged__ = 1; 
		imm_ManagerUpdatePage = new Imm_ManagerUpdatePage( params );
	};
}

//Inizio Classe
var Imm_FB = function( options ) {
	var that = this;
	if( jq.isEmpty( options ) || jq.isEmpty( options.clientIdFb ) )
		return false;
	
	this.stopProcess = false;
	this.pageSection = typeof options != 'undefined' && typeof options.pageSection != 'undefined' ? options.pageSection : false;
	this.clientIdFb = options.clientIdFb;	
	this.initListnerClickStopAutoLogin();
	this.detectUserIsLoggedFb();
	this.userToken = null;	
	this.runLogin = false;
}

/**
 * Metodo che avvia gli ascolatori sui bottoni per interrompere l'auto login
 * @returns {void}
 */
Imm_FB.prototype.initListnerClickStopAutoLogin = function() {
	var that = this;
	if( !that.stopProcess ) {
		this.autoLoadLoginFbWait = jq( '.autoLoadLoginFbWait' );
		this.loaderAutoLogin = jq( '#loaderAutoLogin' );		
		this.autoLoadLoginFbWait.click( function() { that.stopAutoLogin(); });		
	}
	if ( this.runLogin )
		this.autoLoadLoginFbWait.show();
}

/**
 * Metodo che effettua la chiamata a facebook per controllare se c'è un utente loggato sul social network 
 * in caso ci sia ed abbia accettato l'app di Immobiliare ne ritorna i dati
 * @returns {void}
 */
Imm_FB.prototype.detectUserIsLoggedFb = function() {
	var that = this;	
	trackGAClickEvent( "boxLoginEvents", "autoLogin", "FB_Request" );
	window.fbAsyncInit = function(){
		FB.init( { appId:that.clientIdFb, status:true,  cookie:true, xfbml:true, oauth: true } );
		FB.getLoginStatus( function( response ) {
			if ( response.status != "unknown" ) {				
				if( !that.stopProcess )
					that.autoLoadLoginFbWait.show();
							
				var authResponse = FB.getAuthResponse();
				if( authResponse != null && typeof authResponse != 'undefined' && typeof authResponse['accessToken'] != 'undefined' ) {
					that.runLogin = true;
					that.userToken = FB.getAuthResponse()['accessToken'];				
					FB.api('/me', function( response ) {				
						if( typeof response['error'] == 'undefined' ) {
							trackGAClickEvent( "boxLoginEvents", "autoLogin", "FB_Logged" );
							that.getCodeLogin( response );
						}
					});
				} else	{
					that.autoLoadLoginFbWait.hide();
				}
			} else {
				that.autoLoadLoginFbWait.hide();
			}		
		});			
	};

	// Load the SDK Asynchronously
	(function( d ) {
		var js, id = 'facebook-jssdk'; 
		if ( d.getElementById( id ) )
			return;		
		js = d.createElement( 'script' );
		js.id = id; 
		js.async = true;
		js.src = "//connect.facebook.net/en_US/all.js";
		d.getElementsByTagName('head')[0].appendChild( js );
	}( document ) );	
}

/**
 * Metodo che recupera il codice utile per il login di un utente
 * @param {object} response
 * @returns {void}
 */
Imm_FB.prototype.getCodeLogin = function( response ) {
	var that= this;
	var request = jq.ajax({
		url: '/autoLoginUserFb.php',
		type: "POST",
		data: {
			action : 'getCodeAutoLogin',
			userID : response['id'],
			email  : response['email'],
			token  : that.userToken			
		},
		dataType: "html"
	});
	request.done( function( code ) {
		createCookie( "autoLoginUserFacebook", 1 );		
		that.autoLoginUserToImm( code, response );
	}); 
}

/**
 * Metodo che effettua il login dell'utente
 * @param {string} code
 * @returns {void}
 */
Imm_FB.prototype.autoLoginUserToImm = function( code, userFb ) {
	var that = this;
	
	if( this.stopProcess )
		return false;
	
	trackGAClickEvent( "boxLoginEvents", "autoLogin", "IMM_Login" );
	var request = jq.ajax({
		url: '/autoLoginUserFb.php?code=' + code,
		type: "POST",		
		dataType: "html",
		data: {
			action : 'autoLoginUserFb',
			userID : userFb['id'],
			email  : userFb['email'],
			token  : that.userToken			
		}
	});
	request.done( function( response ) {			
		if( response == '1' ) {
			trackGAClickEvent( "boxLoginEvents", "autoLogin", "IMM_Done" );
			if ( typeof that.onLogin == "function" ) {
				if( that.stopProcess ) {
					that.stopProcessAutoLogin();
					return false;
				} else {
					if( typeof selAccediBox != 'undefined' && typeof selAccediBox.box != 'undefined' )
						selAccediBox.box. close();
					that.onLogin();						
				}
			}
		} else {
			that.autoLoadLoginFbWait.hide();
		}
	}); 
}

/**
 * Metodo che setta la variabile per bloccare l'auto login a true e elimina il bottone dell'auto login
 * @returns {void}
 */
Imm_FB.prototype.stopAutoLogin = function() {
	this.stopProcess = true;
	if( typeof this.autoLoadLoginFbWait != 'undefined' && this.autoLoadLoginFbWait )
		this.autoLoadLoginFbWait.hide();
}

/**
 * Metodo che stoppa l'auto login ed effettua il logout
 * @returns {undefined}
 */
Imm_FB.prototype.stopProcessAutoLogin = function() {
	var request = jq.ajax({
		url: '/logout.php',
		type: "POST",
		dataType: "html"
	});
}

/*********************************************************************************************************************************************/
/********************************************** CLASSE GESTIONE SNIPPED IMMOBILIARE.IT *******************************************************/


/**
 * Classe che gestisce la creazione degli snipped del sito effettua chiamata ajax e stampa risultati nell 'html
 * @param {string} pageSection
 * @returns {void}
 */
var Imm_ManagerUpdatePage = function( params ) {
	this.idAd = typeof params.idAd != 'undefined' ? params.idAd : null;
	this.listAds = typeof params.listAds != 'undefined' ? params.listAds : null;
	this.backUrl = typeof params != 'undefined' && typeof params.backUrl != 'undefined' ? params.backUrl : false;
	this.pageSection = typeof params != 'undefined' && typeof params.pageSection != 'undefined' ? params.pageSection : false;
	this.contentImagesDetail = typeof params != 'undefined' && typeof params.contentImagesDetail != 'undefined' ? params.contentImagesDetail : 'dettaglio';
		
	switch( this.pageSection ) {
		case 'accedi' : 
			this.getAccediSectionAction();
		case 'home' : 
			this.getSnippedBox( 'getBoxUserLoggedMenu', '#containerAccessoHome' );			
		break;
		case 'ricerca' : 
			this.getSnippedBox( 'getToplink_utente', '#alfBoxLinksHeader' );
			this.getSavedAdsUser();
		break;
		case 'dettaglio' : 
			this.getSnippedBox( 'getToplink_utente', '#alfBoxLinksHeader' );
			this.getIfSavedAd();
			this.autofillFormContactDetail();
			this.getLovedImages();
			this.getUserNotes();
			this.getIsLikeAd();
		break;
	}	
}

/**
 * Metodo che effettua la redirect verso la backurl settata dopo il login
 * @returns {void}
 */
Imm_ManagerUpdatePage.prototype.getAccediSectionAction = function() {	
	location.href = this.backUrl;
}

/**
 * Wrapper chiamata controllo se annuncio dettaglio è salvato
 * @returns {undefined}
 */
Imm_ManagerUpdatePage.prototype.getIfSavedAd = function() {	
	this.checkSavedAdsUser( this.idAd );
}

/**
 * Metodo che concatena gli id degli annunci
 * @returns {Boolean}
 */
Imm_ManagerUpdatePage.prototype.getSavedAdsUser = function() {	
	if( this.listAds == null )
		return false;
	
	var that = this;
	var idsString = '';
	for( var x = 0; x < this.listAds.length ; x++ ) {
		idsString += this.listAds[x]['idAnnuncio']+',';
	}
	idsString = idsString.substr( 0, ( idsString.length -1 ) ); 	
	this.checkSavedAdsUser( idsString );
}

/**
 * Metodo che effettua la chiamata ajax per determinare tra gli annunci in pagina quali sono stati salvati dall'utente
 * @returns {Boolean}
 */
Imm_ManagerUpdatePage.prototype.checkSavedAdsUser = function( ids ) {
	var that = this;
	var request = jq.ajax({
		url: '/imm_ManagerUpdatePage.php?action=getWhichAdsIsSaved',
		type: "POST",		
		dataType: "html",
		data: {
			'idsString' : ids 
		}
	});
	request.done( function( response ) {
		that.activeSavedAdsBtn( jQuery.parseJSON( response ) );	
	});		
}

/**
 * Metodo che accente il link degli annunci salvati
 * @param {string} ids
 * @returns {void}
 */
Imm_ManagerUpdatePage.prototype.activeSavedAdsBtn = function( ids ) {
	if( typeof ids == 'undefined' )
		return false;
	
	for( var x = 0; x < ids.length; x++ ) {
		jq( '#salva_'+ ids[x] ).removeClass( 'link_salva' ).addClass( 'link_salvato' );		
		jq( '#salva_'+ ids[x] ).attr( 'onclick', '' );
		jq( '#salva_'+ ids[x] ).attr( 'href', '/bookmarkannunci.php?idAnnuncio='+ids[x] );
		if( this.pageSection == 'ricerca' )
			jq( '#salva_'+ ids[x] ).html( '<strong>Salvato</strong>' );
	}
}

Imm_ManagerUpdatePage.prototype.getIsLikeAd = function() {
	var that = this;
	var request = jq.ajax({
		url: '/imm_ManagerUpdatePage.php?action=getIsLikeAd',
		type: "POST",		
		dataType: "html",
		async : false,
		data: {
			'idAd' : that.idAd 
		}
	});
	request.done( function( response ) {
		if( response == 1 )
			jq( '#fbActionLike_'+that.idAd ).removeClass( 'ico_fb_like' ).addClass( 'ico_fb_liked' );
	});
}

/**
 * Metodo che setta recupera le immagini lovvate e le accende
 * @returns {Boolean}
 */
Imm_ManagerUpdatePage.prototype.getLovedImages = function() {
	if( this.idAd == null )
		return false;
	
	var that = this;
	var request = jq.ajax({
		url: '/imm_ManagerUpdatePage.php?action=getLovedImages',
		type: "POST",		
		dataType: "html",
		async : false,
		data: {
			'idAd' : that.idAd 
		}
	});
	request.done( function( jsonResponse ) {
		fbImagesLove = new FbImagesLove( that.contentImagesDetail, true );
		fbImagesLove.setLovedImagesToAjax( jsonResponse );
	});
}

/**
 * Metodo che recupera la nota dell'utente se inserita per l'annuncio corrente
 * @returns {void}
 */
Imm_ManagerUpdatePage.prototype.getUserNotes = function() {
	var that = this;
	
	var noteOptions = { 'checkBookmarked' : 1, 'isLogged' : 1, 'section' : this.pageSection}	
	var request = jq.ajax({
		url: '/imm_ManagerUpdatePage.php?action=getUserNotes',
		type: "POST",		
		dataType: "html",
		async : false,
		data: {
			'idAd' : that.idAd 
		}
	});
	request.done( function( response ) {	
		if( response ) {
			jq( '#box-init-nota-' + that.idAd ).fadeOut( 'slow', function() {
				jq( '#box-testo-nota-' + that.idAd ).html( '<div class="edit-note"></div><div class="testo-nota" id="testo-nota-'+that.idAd+'">'+response+'</div>' ).fadeIn();
				var managerNoteAd = new ManagerNoteAd( noteOptions );
				managerNoteAd.init();
			});					
		}		
	});
}

/**
 * Metodo che recupera i dati dell'utente
 * @returns {undefined}
 */
Imm_ManagerUpdatePage.prototype.getDataUser = function() {
	var that = this;
	var request = jq.ajax({
		url: '/imm_ManagerUpdatePage.php?action=getDataUser',
		type: "POST",		
		dataType: "html",
		async : false
	});
	request.done( function( response ) {
		that.user = jQuery.parseJSON( response );
	});
}

/**
 * Metodo che recupera i dati dell'utente e poi chiama la funzione per settarli nel form dei contatti
 * @returns {undefined}
 */
Imm_ManagerUpdatePage.prototype.autofillFormContactDetail = function( user ) {
	var that = this;	
	if( typeof user != 'undefined' ) {
		var dataUser = user;
	} else {
		this.getDataUser();
		var dataUser = this.user;
	}
	
	if( jq( '#contatta_costruttore_formUp' ).exist() ) {
		jq( '#contatta_costruttore_formUp input' ).each( function() {
			that.setFieldContact( this, dataUser );
		});
	}
	if( jq( '#contatta_costruttore_formDown' ).exist() ) {
		jq( '#contatta_costruttore_formDown input' ).each( function() {
			that.setFieldContact( this, dataUser );
		});
	}
}

/**
 * Metodo che compila i form dei contatti con i dati dell'utente corrente
 * @param {type} sender
 * @param {type} user
 * @returns {undefined}
 */
Imm_ManagerUpdatePage.prototype.setFieldContact = function( sender, user ) {
	switch( jq( sender ).attr( 'name' ) ) {
		case 'nome' : jq( sender ).val( user['nome'] );
			break;
		case 'telefono' : jq( sender ).val( user['telefono'] );
			break;
		case 'email' : jq( sender ).val( user['email'] );
			break;			
	}
}

/**
 * Metodo che recupera lo snipped del box richiesto se l'utente è loggato
 * @param {strin} action
 * @param {string|object} boxReplace
 * @returns {void}
 */
Imm_ManagerUpdatePage.prototype.getSnippedBox = function( action, boxReplace ) {
	var request = jq.ajax({
		url: '/imm_ManagerUpdatePage.php?action='+action,
		type: "POST",		
		dataType: "html"
	});
	request.done( function( boxHtml ) {
		jq( boxReplace ).fadeOut( 'slow', function() {
			jq( boxReplace ).html( boxHtml );
			jq( boxReplace ).show();
			if ( action == 'getBoxUserLoggedMenu' )
				jq( '#spotTvBannerContentIframe' ).hide();
		});				
	});		
}


sendContactJob = function () {
    var form = jq('#formCV');

    var error = false;

    form.find('#name').removeClass('inputError');
    if (form.find('#name').val() == '') {
        error = true;
        form.find('#name').addClass('inputError');
    }

    form.find('#surname').removeClass('inputError');
    if (form.find('#surname').val() == '') {
        error = true;
        form.find('#surname').addClass('inputError');
    }

    form.find('#email').removeClass('inputError');
    if (!validateEmail(form.find('#email').val())) {
        error = true;
        form.find('#email').addClass('inputError');
    }

    form.find('#phone').removeClass('inputError');
    if (form.find('#phone').val() == '') {
        error = true;
        form.find('#phone').addClass('inputError');
    }

    form.find('#origin').removeClass('inputError');
    if (form.find('#origin').val() == '') {
        error = true;
        form.find('#origin').addClass('inputError');
    }

    form.find('#cv_wrap').removeClass('inputError');
    if (form.find('#cv').val() == '') {
        error = true;
        form.find('#cv_wrap').addClass('inputError');
    }

    if (!error)
        form.submit();
}


function validateEmail( email ) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
