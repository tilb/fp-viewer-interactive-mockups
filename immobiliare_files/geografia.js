var timeout = 0;

function showLocalitaSelect (show){
	var localitaSelect = document.getElementById( "LocalitaSelect" );
	if(localitaSelect) {
		attivaSelect(localitaSelect, show);
	}
}

function showZoneSelect( show , idDiv) {
	if (idDiv)
		var zoneSelect = document.getElementById( idDiv );
	else
		var zoneSelect = document.getElementById( "ZoneSelect" );
	if(zoneSelect) {
		attivaSelect(zoneSelect, show);
	}
	
}

function attivaSelect(zoneSelect, show){
	clearTimeout(timeout);
	if (show){
		zoneSelect.style.display = "block";
	}else {
		timeout = setTimeout(function() { zoneSelect.style.display = "none"; }, 500);
	}
}


function hideBoxZone(){
	if (typeof zonePopBox != "undefined"){
		zonePopBox.hide();
	}
}


function pushZones(resp){
	
}

function showZoneSelectWithMap(idDiv) {
	try{
		zonePopBox.objRef = document.getElementById('zone_descrizione');
		zonePopBox.toggle();
	}catch(e){
		
	}
}

function createZoneSelectWithMap(idDiv){
	
	if (idDiv)
		var zoneSelect = document.getElementById( idDiv );
	else{
		idDiv = "zone";
		var zoneSelect = document.getElementById( "ZoneSelect" );
	}
	
	if ( !document.getElementById( idDiv ) && !document.getElementById( "ZoneSelect" ) )
		return null;
	
	_formSection = "zoneMapBox";
	if (typeof oPpFactory == "undefined"){
		oPpFactory = new MEPopBoxFactory();
	}
	if (typeof zonePopBox == "undefined" || !zonePopBox){
		
		zoneSelect.style.position = "relative";
		//zoneSelect.parentNode.removeChild(zoneSelect);
		
		var IE7 = (navigator.appVersion.indexOf('MSIE 7.')==-1) ? false : true;
		var top = IE7 ? 'top:-30px' : '';
		
		var zoneCont = document.createElement("div");
		var html = '<form style="width:680px;" id="zoneSelectInputForm">\
						<div class="topRicerca" style="height:30px;width:100%;font-weight:bold;'+top+'">\
							<div id="tooltip_map">\
							</div>\
						</div>\
						<div style="padding:10px">\
							<div id="errorMessageCartinaZone"></div>\
							<div id="CartinaGrande">\
							</div>\
							<div id="zoneSelectContainer" style="float:left"></div>\
							<div class="clear"></div>\
						</div>\
					</form>';
		
		zoneCont.innerHTML = html;		
	
		zonePopBox = oPpFactory.getPopBox(idDiv+"_popBox",document.getElementById("selectZoneMapButton"));
		
		zonePopBox.appendContentElement(zoneCont);
		zonePopBox.boxOffsetLeft = 15;
		var zoneSelectCont = document.getElementById("zoneSelectContainer");
		zoneSelectCont.appendChild(zoneSelect);
		xajax_getMapAjaxZonePagRicerca(document.dati.idComune.value,document.dati.idProvincia.value);
		var pathDiv = document.getElementById("tooltip_map");
		
        // ottengo il nome del comune dalla suggestion o dalla select
        if (typeof __jsSection != "undefined" && __jsSection == "trovacasaStatic" && window.document.getElementById("suggestComune").value != null){
            var nomeComune = window.document.getElementById("suggestComune").value;            
        } else if (window.document.dati.idComune.options) {
            var nomeComune = window.document.dati.idComune.options[window.document.dati.idComune.selectedIndex].innerHTML;            
        } else if (typeof searchForm != "undefined" && searchForm) {
            var nomeComune = searchForm.getNomeComune();
		}
        
        var comune = createPathLink(nomeComune,function(){return false});
		pathDiv.appendChild(comune);
		zoneSelect.style.display = "block";
	
		//addEvent(document.getElementById('form_raffina_nc'),"submit",pushSelectedZonesOnMapInForm.bind(document.getElementById('form_raffina_nc')));
		addEvent(window,"unload",function(){zoneSelect = null})
		addEvent(window,"unload",function(){zoneSelectCont = null})
		addEvent(window,"unload",function(){pathDiv = null})
		return zonePopBox;
	}
}


function pushSelectedZonesOnMapInForm(){
	if (this.zone_descrizione)
		for (i=0; i < zone_selected.length ;i++){
			var oZone = document.createElement('input');
			oZone.type="hidden";
			oZone.value=zone_selected[i];
			oZone.name = "idMZona[]";
			this.appendChild(oZone);
		}
 }

function salvaZone(type,formId) {
	var obj;
	
	if (typeof type == "undefined" || !type)
		type = "";
	
	if (typeof __isInserimentoAnnuncio !="undefined" && __isInserimentoAnnuncio){
		type = "PUB"
	}
		
	if (typeof formId == "undefined" || !formId){
		var formZone = document.getElementById("form_raffina_nc");
		if (!formZone)
			formZone = document.getElementById("dati");
	}else{
		var formZone = document.getElementById(formId);
	}
	
	var descrizione = '';
	var zoneIDs = "";
	var divZoneIDs = null;
	var divId = null;
	
	switch (type.toLowerCase()){
		case "localita" :
			divId = "localita_descrizione";
			break;
		case "ti" :
			divZoneIDs = "zoneTI_ids";
			break;
		case "pub" :
			divZoneIDs = "idMZona";
			break;
		default :
			divId = "zone"+ type + "_descrizione";
			divZoneIDs = "zone" + type + "_ids";
		break;
	}
	
	if (!divId)
		divId = "zone"+ type + "_descrizione";
		
	if (!document.getElementById(divId))
		return;
	
	document.getElementById(divId).value=descrizione;
	var nChecked = 0;
	with(window.document) {
		for( var i=0; i<formZone.elements.length; i++) {
			var idZona = null;
			if (formZone.elements[i].type=='checkbox')
				if( formZone.elements[ i ].checked ){
					obj = getElementById("div_" + formZone.elements[ i ].id);
					var idZona = parseInt(formZone.elements[ i ].id);
					if (obj){
						nChecked++;
						if(descrizione.length > 0) {
							descrizione += ', ';
							zoneIDs +=",";
						}
						if (type.toLowerCase() == "localita")
							descrizione += obj.innerHTML;
						else{
							zoneIDs += idZona;
							if (type.toLocaleLowerCase() == "pub")
								descrizione += obj.innerHTML;
							else
								descrizione += obj.innerHTML.substring(0,obj.innerHTML.indexOf(' -'));
						}
						
					}
				}
			
		}
		if (descrizione==''){   
		    if (type!="TI" && type!="PUB") {
				if (typeof __immobiliareSection != "undefined" && __immobiliareSection == 'homepage')
					descrizione = "Scegli una o più zone dalla lista";
				else
					descrizione = 'Scegli zona da lista';
			} else{
				descrizione = 'Nessuna';
				zoneIDs  = "";
		    }
		}
		if ( divZoneIDs && document.getElementById(divZoneIDs) )
			getElementById(divZoneIDs).value=zoneIDs;
		
		if ( nChecked >= 1 ) {
			descrizione = ( nChecked == 1 ? "Una zona selezionata" : nChecked + " zone selezionate" );
		}
		
		getElementById(divId).value=descrizione;
	}
	if (typeof resetTIFields!="undefined" && type=="TI")
		resetTIFields(divId);
	
	if (type.toLowerCase() == 'localita') {
		if ( nChecked > 0 ) {
			forceTypeSearch('zona');
			jq('#modifica_zona').show();
		} else {
			switchOffBtn('zona');
			jq('#modifica_zona').hide();
		}
	}
	
}

function swapZona(val,type){
	
	var suffix;
	var obj;
	var objDesc;
	var formZone;
	var zoneIDs = "";
	var divZoneIDs = null;
	var countSelected = 0;
	var descrizione = '';
	
	if (typeof _formSection != "undefined" && _formSection == "zoneMapBox"){
		formId = "zoneSelectInputForm";
	}
	
	if (typeof formId != "undefined" && formId){
		formZone = document.getElementById(formId);
	}
	
	if (typeof __isTrovaImmobili!="undefined" && __isTrovaImmobili){
		type = "TI";
		formZone = document.getElementById("trova_immobili");
		divZoneIDs = "zoneTI_ids";
	}else
	if (typeof __isInserimentoAnnuncio !="undefined" && __isInserimentoAnnuncio){
		type = "PUB"
		divZoneIDs = "idZona"
	}else {
		type = "";
		divZoneIDs = "zone" + type + "_ids";
	}
	
	if (!formZone)
		formZone = document.getElementById("form_raffina_nc");
	
	if (!formZone)
		formZone = document.getElementById("dati");
	var nChecked = 0;
	with(window.document) {
		
		objDesc = getElementById("zone"+type+"_descrizione");
		
		for( var i=0; i<formZone.elements.length; i++){
			if (formZone.elements[i].type=='checkbox'  && getElementById( "div_" + formZone.elements[ i ].id )) {
				obj = getElementById( "div_" + formZone.elements[ i ].id );
				if (type.toLocaleLowerCase() == "pub")
					numeroZona = obj.innerHTML;
				else
					numeroZona = obj.innerHTML.substring(0,obj.innerHTML.indexOf(' -'));
				if( parseInt(formZone.elements[ i ].id)==val && type.toLocaleLowerCase() != "pub"){					
					if (formZone.elements[ i ].checked){
						hideImageZone();
						formZone.elements[ i ].checked = false;
					}
					else
						formZone.elements[ i ].checked = true;
				}
				if( formZone.elements[ i ].checked ){
					if(descrizione.length > 0) {
						descrizione += ', ';
						zoneIDs +=",";
					}
					nChecked++;
					descrizione += numeroZona;
					zoneIDs += parseInt(formZone.elements[ i ].id);
				}
			}
		}
		
        if (descrizione==''){   
		    if (type!="TI" && type != "PUB") {
				if (typeof __immobiliareSection != "undefined" && __immobiliareSection == 'homepage')
					descrizione = 'Scegli una o più zone dalla lista';
				else
					descrizione = 'Scegli zone da lista';
			} else {
				descrizione = 'Nessuna';
				zoneIDs  = "";
		    }
		}
		/* @TODO: DA CONTROLLARE XKE NON C'ERANO NEL MERGE
		if ( document.getElementById('area_mappa') )
			MEhide('area_mappa');
		if ( document.getElementById('area_mappa') )
			MEshow('zone_cartina');
		*/
		if (document.getElementById(divZoneIDs))
			document.getElementById(divZoneIDs).value=zoneIDs;
		
		if (nChecked == 1) {
			descrizione = "Una zona selezionata";
		} else if ( nChecked > 1 ) {
			descrizione = nChecked + " zone selezionate";
		}
		
		objDesc.value=descrizione;
	}
}

function svuotaSelect(oggetto){
	var options = oggetto.options;
	for (i=options.length-1;i>0;i--)
		options[i]=null;
}

function riempiSelect(sorgente,destinazione){
	
	var options = destinazione.options;
	svuotaSelect(destinazione);
	var j=1;
	for (i=0;i<sorgente.length;i=i+2)
		destinazione[j++]=new Option(sorgente[i+1],sorgente[i]);
}

//Riempe la select delle province nel caso di livello 2
function riempiSelectProvince(sorgente,destinazione){
	
	var options = destinazione.options;
	svuotaSelect(destinazione);
	destinazione[0]=new Option(sorgente[1],sorgente[0]);
}

function patchZoneIE(idZoneSelect){
	if (typeof idZoneSelect == "undefined" || !idZoneSelect)
		idSelect = "ZoneSelect";
	if (navigator.userAgent.toLowerCase().indexOf("msie")!=-1 && navigator.userAgent.toLowerCase().indexOf("msie 7")==-1 && navigator.userAgent.toLowerCase().indexOf("msie 8")==-1){
		divSelect = document.getElementById(idZoneSelect);
		if(divSelect) {
			divSelect.innerHTML = "<iframe frameborder='0'></iframe>" + divSelect.innerHTML;
		}
		divSelect = document.getElementById("LocalitaSelect");
		if(divSelect) {
			divSelect.innerHTML = "<iframe frameborder='0'></iframe>" + divSelect.innerHTML;
		}
	}
}

function destroy_div(id){	 
	var oClear = window.document.getElementById(id);
	if(oClear){
		oClear.innerHTML="";
	}
}


function enableSelect(idSelect) {
	var oDiv = window.document.getElementById(idSelect);
	if(oDiv) {
		oDiv.disabled="";
	}
}

//valida il form con i filtri per la ricerca annunci per l'Italia
function validateForm(){
    if (document.dati.idProvincia && document.dati.idProvincia.value!='') {
		if (jq("#tipoRicerca").val() == 'mappa') {
			jq("#gm_area").attr("disabled", false);
			uncheckZone(document.dati.idProvincia.value);
		} else {
			jq("#gm_area").val('');
			jq("#gm_area").attr("disabled", true);
		}
	    return true;
    }else{
	    alert("Il campo provincia è obbligatorio");
	    return false;
    }
}

//valida il form con i filtri per la ricerca annunci per l'estero
function validateFormEstero() {
	var result = true;
    if (document.dati.idRegione && document.dati.idRegione.value!=''){
	    // se sto nel caso dei due livelli
    	if (document.dati.idRegione.value == "skip_regione" && document.dati.idProvincia.value=='') {
	    	result = false;	    	
	    }
    }else{
    	result = false;
    }
    //se false lancio errore
    if (!result)
    	alert("Il campo regione è obbligatorio");
    
    return result;
}

//Utilizzata in pubblicazione annunci privati
function showSingleZoneSelectWithMap(idDiv) {
	if (typeof zonePopBox == "undefined")
		return;
		
	zonePopBox.objRef = document.getElementById('zonePUB_descrizione');
	if (typeof suggPopBox != "undefined")
		suggPopBox.hide();
	zonePopBox.toggle();
}

//Utilizzata in pubblicazione annunci privati
function createSingleZoneSelectWithMap(idDiv) {
	if (idDiv)
		var zoneSelect = document.getElementById( idDiv );
	else{
		idDiv = "zone";
		var zoneSelect = document.getElementById( "ZoneSelect" );
	}
	_formSection = "zoneMapBox";
	if (typeof oPpFactory == "undefined"){
		oPpFactory = new MEPopBoxFactory();
	}
	if (typeof zonePopBox == "undefined" || !zonePopBox){
		
		zoneSelect.style.position = "relative";
		//zoneSelect.parentNode.removeChild(zoneSelect);
		
		var zoneCont = document.createElement("div");
	
		var html = '<form style="width:680px;" id="zoneSelectInputForm">\
						<div class="topRicerca" style="height:30px;width:100%;font-weight:bold;">\
							<div id="tooltip_map">\
							</div>\
						</div>\
						<div style="padding:10px">\
							<div id="CartinaGrande">\
							</div>\
							<div id="zoneSelectContainer" style="float:left"></div>\
							<div class="clear"></div>\
						</div>\
					</form>';
		
		zoneCont.innerHTML = html;		
	
		zonePopBox = oPpFactory.getPopBox(idDiv+"_popBox",document.getElementById("selectZoneMapButton"));
		zonePopBox.appendContentElement(zoneCont);
		zonePopBox.boxOffsetLeft = 40;
		zonePopBox.addEventOnClose(function(){document.getElementById('indirizzo_annuncio_fake').focus();});
		zonePopBox.objRef = document.getElementById('zonePUB_descrizione');
		var zoneSelectCont = document.getElementById("zoneSelectContainer");
		zoneSelectCont.appendChild(zoneSelect);
		
		xajax_getMapAjaxZone(document.dati.idComune.value,document.dati.idProvincia.value,false);
		var pathDiv = document.getElementById("tooltip_map");
		
		var comune = createPathLink(window.document.dati._textComune.value,function(){return false});
		pathDiv.appendChild(comune);
		zoneSelect.style.display = "block";
	
		addEvent(document.dati,"submit",pushSelectedZonesOnMapInForm.bind(document.dati));
		addEvent(window,"unload",function(){zoneSelect = null})
		addEvent(window,"unload",function(){zoneSelectCont = null})
		addEvent(window,"unload",function(){pathDiv = null})
	}
}

//elimina le option dei comuni e mette quella di default
// Solo Estero
function resetComuni() {
	document.getElementById("field_comune").innerHTML = "<option class='noselect' value=''>Tutti</option>";
}

//elimina le option delle province compresa quella di default
//Solo Estero
function eraseProvince() {
	document.getElementById("idProvincia").innerHTML = "";
}

/**
 * Popola la select delle tipologie della categoria commerciale senza l'option dei terreni
 */
function riempiSelectTerreno(sorgente,destinazione){
	riempiSelect(sorgente,destinazione);
	deleteTerreno();
}
/**
 * Elimina l'option terreno dalla select delle tipologie
 */
function deleteTerreno() {
	var selTipo = document.getElementById('selectTipologia');

	for ( var i = 0; i < selTipo.length; i++ ) { 
		if ( selTipo[i].value == 28 ) //28 --> TERRENO
			selTipo.removeChild(selTipo[i]);
	}
}

function uncheckZone(idProv) {
	var aCheckboxes = null;
	var isZona = true;
	if ( document.getElementById('LocalitaSelect') ) {
		var aCheckboxes = document.getElementById('LocalitaSelect').getElementsByTagName('input');
		var isZona = false;
	} else if ( document.getElementById('ZoneSelect') ) {
		var aCheckboxes = document.getElementById('ZoneSelect').getElementsByTagName('input');
	} else if ( document.getElementById('zoneContainerHp') ) {
		var aCheckboxes = document.getElementById('zoneContainerHp').getElementsByTagName('input');		
	} else {
		return false;
	}
	for (var i = 0; i < aCheckboxes.length; i++) {
		var oCheck = aCheckboxes[i];
		if (oCheck.checked) {
			oCheck.checked = false;
			if (isZona)
				selectZona(idProv, oCheck.value);
		}
	}
	if (isZona)
		salvaZone();
	else
		salvaZone('localita');
	
	return true;
}
