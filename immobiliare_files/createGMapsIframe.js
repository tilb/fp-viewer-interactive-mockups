
var polygonMapLoadCompleted = false;
var boxPolygonSearch = null;
var boxPolygonMapSection = null;

function createDinamicGoogleMaps(action, options, title)
{
	forceRecharge = false;
	if ( typeof options == "undefined" )
		options = new Array();
	else
		if (typeof options.forceRecharge != "undefined" && options.forceRecharge)
			forceRecharge = true;
	
	if (/*isMobile.any() &&*/ typeof __appendedBoxPolygonSearchBoxEvent == "undefined"){
		addEvent(window,"resize",function(){
			if (boxPolygonSearch.isOpen && boxPolygonSearch.titleLabel){
				options.forceRecharge = true;				
				createDinamicGoogleMaps('', options, boxPolygonSearch.titleLabel);				
			}
		});
		__appendedBoxPolygonSearchBoxEvent = true;
	}
	
	if (!forceRecharge && (polygonMapLoadCompleted && (typeof options.section != "undefined" && boxPolygonMapSection == options.section)) ) {
		
		if ( typeof options.hideOnlyBox != "undefined" && options.hideOnlyBox) {
			boxPolygonSearch.setHideOnlyBox(true);
		} else {
			boxPolygonSearch.setHideOnlyBox(false);
		}
		
		boxPolygonSearch.show();
		setPositionBoxMappa();
		return false;
	}
	
	if (boxPolygonSearch && typeof boxPolygonSearch.destroy == "function")
		boxPolygonSearch.destroy();
	
	if ( document.getElementById('box_mappa') ) {
		var divBox = document.getElementById('box_mappa');
		divBox.onclick = '';
	}
	
	document.body.style.cursor = 'wait';
	
	var __g_forceCenter = 0;
	if ( typeof __g_zoom == "undefined" )
		__g_zoom = 10;

	boxPolygonMapSection = typeof options.section != "undefined" ? options.section : '';
	switch ( boxPolygonMapSection ) {
		case 'homepage':
			options.idProvincia = jq('#divP select[name="idProvincia"]').length ? jq('#divP select[name="idProvincia"]').val() : '';
			options.idComune = jq('#divC select[name="idComune"]').length ? jq('#divC select[name="idComune"]').val() : '';
			break;
		case 'ricerca':
			options.idProvincia = jq('#divP select[name="idProvincia"]').length ? jq('#divP select[name="idProvincia"]').val() : '';
			options.idComune = jq('#divC select[name="idComune"]').length ? jq('#divC select[name="idComune"]').val() : '';
			break;
		case 'alertemail':
			options.idProvincia = jq('#trova_immobili input[name="provincia"]').length ? jq('#trova_immobili input[name="provincia"]').val() : '';
			options.idComune = jq('select#TI_comune').length ? jq('select#TI_comune').val() : '';
			break;
		default:
			break;
	}
	var bHasPdi 			= ( typeof options.hasPdi != "undefined" ) ? options.hasPdi : 1;
	var personalizedControl = ( typeof options.personalizedControl != "undefined" ) ? options.personalizedControl : 1;
	var controlPosition 	= ( typeof options.controlPosition != "undefined" ) ? options.controlPosition : '';
	var openInPage 			= ( typeof options.openInPage != "undefined" ) ? options.openInPage : 0;
	var map_width 			= ( typeof options.width != "undefined" && options.width ) ? options.width : 750;
	var map_height 			= ( typeof options.height != "undefined" && options.height ) ? options.height : 500;
	var mapControls 		= ( typeof options.mapControls != "undefined" ) ? options.mapControls : 0;
	var showMarker 			= ( typeof options.showMarker != "undefined" ) ? options.showMarker : 1;
	var zoom 				= ( typeof options.zoom != "undefined" && options.zoom ) ? options.zoom : __g_zoom;
	var readonlyPolygon		= ( typeof options.readonlyPolygon != "undefined" && options.readonlyPolygon ) ? options.readonlyPolygon : false;
	var idProvincia			= ( typeof options.idProvincia != "undefined" && options.idProvincia ) ? options.idProvincia : '';
	var idComune			= ( typeof options.idComune != "undefined" && options.idComune ) ? options.idComune : '';
	var idMZona				= ( typeof options.idMZona != "undefined" && options.idMZona ) ? options.idMZona : '';

	if (typeof action != "undefined" && action == "zoomin"){
		zoom += 1;
	} else if (typeof action != "undefined" && action == "zoomout") {
		zoom -= 1;
	}
	
	if ( typeof options.lat != "undefined" && typeof options.lng != "undefined" ) {
		__g_latitudine = options.lat;
		__g_longitudine = options.lng;
		__g_forceCenter = 1;
		if ( typeof options.forceCenter != "undefined" ) {
			__g_forceCenter = options.forceCenter;
		}
	};
	
	// calcolo la dimensione massima a disposizione
	if ( typeof options.maximizeDimension != "undefined" && typeof jq != "undefined" ) {
		map_height = jq(window).height() - Math.round( jq(window).height() * 0.15 );
		map_width =  Math.min(950, ( jq(window).width() - jq('#overlay_box_mappa').outerWidth() ) );
	}
	
	if ( typeof options.drawPolygon != "undefined" && options.drawPolygon ) {
		drawPolygon = options.drawPolygon;
		map_width = 950; // nel caso della ricerca per area fisso la larghezza
	} else {
		drawPolygon = 0;
	}
	
	
	// Aggiunto il tracciamento per il click sulla mappa
	var trackGACategory;
	if (typeof options.trackGACategory != "undefined") {
		trackGACategory = options.trackGACategory;
	} else {
		trackGACategory = ((typeof drawPolygon != "undefined") && drawPolygon) ? 'ricercaAnnunciEvents' : 'dettaglioAnnuncioEvents';
	}
	var trackAction = "mappa_annuncio_btn";
	if (typeof options.trackGAAction != "undefined") {
		trackAction =  options.trackGAAction;
	}
	trackGAClickEvent(trackGACategory,trackAction,'click');

	var srcIFrame = '/generateGMaps.php'+
		'?lat='+__g_latitudine+
		'&lng='+__g_longitudine+
		'&zoom='+zoom+
		'&idProvincia='+idProvincia+
		'&idComune='+idComune+
		'&idMZona='+idMZona+
		'&mapHeight='+map_height+
		'&mapWidth='+(map_width-2)+
		'&showMarker='+showMarker+
		'&drawPolygon='+(typeof drawPolygon != "undefined" ? drawPolygon : "")+
		'&readonlyPolygon='+(typeof readonlyPolygon != "undefined" ? readonlyPolygon : "")+
		'&showMapControl='+mapControls+
		'&enlargeOnSw=1'+
		'&hasPdi='+bHasPdi+
		'&personalizedControl='+personalizedControl+
		'&controlPosition='+controlPosition+
		'&mapSection='+boxPolygonMapSection+
		'&trackGACategory='+trackGACategory;
		if (typeof options.mapLang != "undefined")
			srcIFrame+="&mapLang="+options.mapLang;
		if (typeof options.adminLevel != "undefined")
			srcIFrame+="&adminLevel="+options.adminLevel;

	if (__g_forceCenter) {
		srcIFrame += '&forceCenter='+__g_forceCenter;
	}

	if (((typeof drawPolygon != "undefined") && drawPolygon) || ((typeof readonlyPolygon != "undefined") && readonlyPolygon)) {
		if (boxPolygonMapSection == 'alertemail') {
			var jArea = jq("#gm_area_TI").val();
		} else {
			var jArea = jq("#gm_area").val();
		}
		var area = jQuery.parseJSON(jArea);
		var mode = (area) ? area.mode : '';
		if ( mode == 'polygon' ) {
			var polygon = area.area;
			srcIFrame += "&vrt=";
			for (var i = 0; i < polygon.length; i++) {
				srcIFrame += polygon[i][0] + "," + polygon[i][1]+";";
			}
		}
	}
	
	var patchIE = '';
	var IE6 = (navigator.appVersion.indexOf('MSIE 6.')==-1) ? false : true;
	var IE7 = (navigator.appVersion.indexOf('MSIE 7.')==-1) ? false : true;
	if ( IE6 || IE7 ) {
		var patchIE = 'padding-top:100px;height:235px;';
	}
	var posCaricamento = ( map_height / 2 ) - 100;
	var iframe_HTML = '<iframe skipOverlayManageConflict="true" name="iframe_box_mappa" id="iframe_box_mappa" src="'+srcIFrame+'" width="'+map_width+'" height="100%" marginheight="0" marginwidth="0" frameborder="0" scrolling="no" style="display:block;padding:0x;margin:0px;width:'+map_width+'px;background: url(/img2/loader6.gif) no-repeat center center"></iframe>';
	box_mappa_HTML =
	'<div id="box_mappa" style="width:'+map_width+'px;height:'+(map_height+1)+'px;overflow:hidden; display:block;">'+
		'<div id="preload" class="preload" style="width:'+map_width+'px; height:'+map_height+'px; line-height: '+map_height+'px;'+patchIE+'">'+
			'<img src="/img2/loader6.gif"/>'+
			'<div id="caricamento_mappa" style="display:none; bottom:'+posCaricamento+'px;">Caricamento mappa...</div>'+
		'</div>'+
		iframe_HTML +
	'</div>';
	
	if (!openInPage) {
		openOverlayMapGoogle( box_mappa_HTML, title, options);
		if (drawPolygon)
			jq("#caricamento_mappa").fadeIn('fast');
	} else {
		jq("#box_mappa").html( iframe_HTML ).fadeIn();
	}
	
	return true;
}

function SegnalaErroreMappa(){
	jq("#preload").fadeOut('fast');
	window["iframe_box_mappa"].showSegnalaEcontattaBox();

}

function openOverlayMapGoogle( content, title, options ) {
	
	boxPolygonSearch = new boxOverlay("overlay_box_mappa","grey");
	boxPolygonSearch.zIndex = 500;
	boxPolygonSearch.stop_event_bubbling = true;
	if ( typeof options != "undefined" && options.hideOnlyBox) {
		boxPolygonSearch.setHideOnlyBox(true);
	}
	__hardBlockEvent = function(e){stop_event_bubbling(e,true)};
	
	boxPolygonSearch.addEventOnShow( function(){ addEvent( document, "keydown", __hardBlockEvent ) } );
	boxPolygonSearch.addEventOnClose( function(){ removeEvent( document, "keydown", __hardBlockEvent ) } );
	
	if (options.drawPolygon) {
		boxPolygonSearch.addEventOnClose(function(){
				if (!polygonMapLoadCompleted) {
					document.body.style.cursor = 'auto';
					boxPolygonSearch.destroyOnClose = true;
				}
			});
		title = 'Cerca su mappa';
	}
	
	boxPolygonSearch.setTitle("<div class=\"titolo_annuncio fLeft\" style=\"color:#555; font-size: 14px;\">"+title+"</div>"+(options.drawPolygon ? "<div id=\"segnala_errore_mappa\" class=\"rounded-all\" onclick=\"SegnalaErroreMappa()\">Che ne pensi del servizio?</div>" : ""));
	if ( typeof(options) != "undefined" && typeof(options.closeBtnLabel) != "undefined" && typeof(options.closeBtnLabel) != "" )
		document.getElementById("close_overlay_box_mappa").innerHTML = options.closeBtnLabel;
	boxPolygonSearch.titleLabel = title;
	boxPolygonSearch.setContent( content );
	boxPolygonSearch.destroyOnClose = false;
	
	boxPolygonSearch.show();
	if ( typeof(options) != "undefined" && typeof(options.maximizeDimension) != "undefined" ) {
		setPositionBoxMappa();
	}
	
	isOpenOverlayGoogle = true;
}


function setPositionBoxMappa()
{
	jq('#box_mappa').outerHeight()
	jq('#overlay_box_mappa').css("top", Math.max(0, ((jq(window).height() - jq('#overlay_box_mappa').outerHeight()) / 3) ) + "px");
	jq('#overlay_box_mappa').css("left", Math.max(0, ( (jq(window).width() - jq('#overlay_box_mappa').outerWidth()) / 2) ) + "px");
}

function showOverlayMap() {
	if( typeof isOpenOverlayGoogle != "undefined" && isOpenOverlayGoogle ) {
		boxPolygonSearch.show();
		setPositionBoxMappa();
		return true;
	}
	return false;
}
