var fbImagesLove = null;

/**
 * Costruttore della classe
 * @returns {FbImagesLove}
 */
FbImagesLove = function( content, isFacebookUser, options ) {	
	this.selectedImage = null;	
	
	this.cookie_action	= typeof options != 'undefined' && typeof options.cookieName	!= 'undefined' ? options.cookieName : 'actionAD';
	this.boxThumb		= typeof options != 'undefined' && typeof options.boxThumb		!= 'undefined' ? options.boxThumb	: '.box_thumb';
	this.loveBox		= typeof options != 'undefined' && typeof options.loveBox		!= 'undefined' ? options.loveBox	: '#loveImagesDetail';
	this.syncPopup		= typeof options != 'undefined' && typeof options.syncPopup		!= 'undefined' ? options.syncPopup	: false;
		
	this.contentFatherFbImages	= typeof options != 'undefined' && typeof options.contentFatherFbImages != 'undefined' ? options.contentFatherFbImages	: '#dettaglio';
	this.fatherBoxThumb			= typeof options != 'undefined' && typeof options.fatherBoxThumb		!= 'undefined' ? options.fatherBoxThumb			: '.box_thumb';
		
	this.detail = jq( '#' + content );
	this.boxThumb = jq( this.detail ).find( this.boxThumb );
	this.loveImagesDetail = jq( this.detail ).find( this.loveBox );				
	this.isFacebookUser = isFacebookUser;
	
	
	//Se è la pagina di anteprima non avvia la classe
	if( typeof anteprimaPage != 'undefined' && anteprimaPage ) {
		this.loveImagesDetail.hide();
		this.detail.find( '.labelLove' ).hide();
		return false;
	}
	
}

/**
 * Metodo che avvisa gli ascoltatori della classe
 */
FbImagesLove.prototype.initListeners = function() {
	var that = this;
	this.oFacebookAction = new facebookAction();
		
	this.boxThumb.click( function(){		
		that.setLoveImage( this );
	});
	this.loveImagesDetail.click( function(){
		that.actionLoveImage( this );
	});	
}

/**
 * Metodo che setta l'immagine del like da caricare per la foto corrente
 * @param {obj} 
 * sender
 */
FbImagesLove.prototype.setLoveImage = function( sender, id ) {
	if ( typeof id != 'undefined' )
		sender = jq( this.detail ).find( '#thumb_id_'+id );
			
	var idImg = jq( sender ).attr( 'data-idImg' );
	var dataLove = jq( sender ).attr( 'data-love' );
	
	this.loveImagesDetail.attr( 'data-idImg', idImg );
	this.loveImagesDetail.attr( 'data-love', dataLove );
	this.changeStatusImage( dataLove );
	
}

/**
 * Metodo che cambia le classi per la gestione dell'icona delle azioni fb sull'immagine grande del dettaglio
 * @param {int} dataLove
 * @param {obj} loveImagesDetail
 */
FbImagesLove.prototype.changeStatusImage = function( dataLove, loveImagesDetail ) {
	var loveImages = typeof loveImagesDetail != 'undefined' ? loveImagesDetail : this.loveImagesDetail;
	if ( dataLove == 0 ) {
		jq( loveImages ).removeClass( 'love' );
		jq( loveImages ).removeClass( 'deleteLove' );
	} else {
		jq( loveImages ).addClass( 'love' );
		jq( loveImages ).addClass( 'deleteLove' );
	}		
	
	if( readCookie( this.cookie_action ) )
		jq( this.detail ).find( '#thumb_id_' + jq( loveImages ).attr( 'data-idimg' ) ).attr( 'data-love', newDataLove );
}

/**
 * Metodo che cambia il valore del love nell'immagine grande e nella thumb
 * @param {obj} sender
 */
FbImagesLove.prototype.actionLoveImage = function( sender ) {		
	var dataIdimg = jq( sender ).attr( 'data-idimg' );
	var dataLove = jq( sender ).attr( 'data-love' );
	var newDataLove = dataLove == 1 ? 0 : 1;
	var action = dataLove == 1 ? 'unlove' : 'love';
	
	jq( sender ).attr( 'data-love', newDataLove );
	jq( this.detail ).find( '#thumb_id_'+dataIdimg ).attr( 'data-love', newDataLove );
	this.idAd = jq( this.detail ).find( '#thumb_id_'+dataIdimg ).attr( 'data-id-ad' );
		
	if ( this.isFacebookUser == 0 ) {
		var nameCookie = this.cookie_action;
		var valueCookie = '{"action":"'+action+'", "idAnnuncio":"'+this.idAd+'", "idImmagine":"'+dataIdimg+'"}';	
		createCookie( nameCookie, valueCookie); 
		SSOLogin( "facebook","oauth", {extraUrlPars:'context=openGraph', syncOpenGraph:true, forceClose:false, facebook_scope:'read_write'} );
		return true; 
	}	
	
	//Se è attivo il sync sincronizza i dati dell'immagne cliccata nel popuo con quella nella pagina
	if( this.syncPopup ) {
		jq( this.contentFatherFbImages ).find( '#thumb_id_'+dataIdimg ).attr( 'data-love', newDataLove );
		var loveImagesDetail =  jq( this.contentFatherFbImages ).find( '#loveImagesDetail' );
		
		if( loveImagesDetail.attr( 'data-idimg' ) == dataIdimg ) {						
			loveImagesDetail.attr( 'data-love', newDataLove );
			this.changeStatusImage( newDataLove, loveImagesDetail );
		}		
	}
	
	this.oFacebookAction.doAction( action, this.idAd, dataIdimg );	
	this.setClassLove( action );
}

/**
 * Metodo che setta la classe del pulsante love
 * @param {string} action
 */
FbImagesLove.prototype.setClassLove = function( action ) { 
	if ( action == 'love' ) {
		this.loveImagesDetail.addClass( 'love' );
		this.loveImagesDetail.addClass( 'deleteLove' );
	} else {
		this.loveImagesDetail.removeClass( 'love' );
		this.loveImagesDetail.removeClass( 'deleteLove' );		
	}
}

/**
 * Metodo che setta le immagini con lo stato love a 1 modalità di chiamata ajax
 * @param {string json} action
 */
FbImagesLove.prototype.setLovedImagesToAjax = function( response ) { 
	var that = this;	
	var dataLove = 1;
	var imagesLoved = jQuery.parseJSON( response );
 	for( var idImage in imagesLoved ) {
		jq( '#dettaglio' ).find( '#thumb_id_'+idImage ).attr( 'data-love', dataLove );
		
		//Setta la proprietà della prima immagine
		if ( that.loveImagesDetail.attr( 'data-idimg' ) == idImage ) {
			that.loveImagesDetail.attr( 'data-love', dataLove );
			that.changeStatusImage( dataLove );
		}
	}
}

/**
 * Metodo che sincronizza tutti i valori dei love dei dati in pagina con quelli non popup
 */
FbImagesLove.prototype.synchronize = function() { 
	var that = this;	
	jq( this.contentFatherFbImages ).find( this.fatherBoxThumb ).each( function() {
		var dataLove = jq( this ).attr( 'data-love' );		
		var dataIdimg = jq( this ).attr( 'data-idimg' );		
		jq( that.detail ).find( '#thumb_id_'+dataIdimg ).attr( 'data-love', dataLove );
	
		//Setta la proprietà della prima immagine
		if ( that.loveImagesDetail.attr( 'data-idimg' ) == jq( this ).attr( 'data-idimg' ) ) {
			that.loveImagesDetail.attr( 'data-love', dataLove );
			that.changeStatusImage( dataLove );
		}
	});
}

/**
 * Metodo che gestisce l'errore di un azione
 * @param {string} action
 */
FbImagesLove.prototype.errorAction = function( action, idImage ) { 
	if ( action == 'love' ) {
		this.loveImagesDetail.removeClass( 'love' );
		this.loveImagesDetail.removeClass( 'deleteLove' );
		this.loveImagesDetail.attr( 'data-love', 0 );		
		jq( this.detail ).find( '#thumb_id_' + idImage ).attr( 'data-love', 0 );
	} else {
		this.loveImagesDetail.addClass( 'love' );
		this.loveImagesDetail.addClass( 'deleteLove' );		
		this.loveImagesDetail.attr( 'data-love', 1 );
		jq( this.detail ).find( '#thumb_id_' + idImage ).attr( 'data-love', 1 );
	}
}

/*************************************************************** FINE CLASSE FACEBOOK LOVE ***********************************************************************/


/* FUNZIONE PER GESTIRE IMMAGINI NEL DETTAGLIO */
function setCurrent(index, type){
	var $type = jq.isEmpty(type) ? 'image' : type;
	var $_suff = ($type == 'plan') ? "_"+$type : '';
	var $_arr = ($type == 'image') ? immagini : immagini_plan;
	var $_didascalie = ($type == 'image') ? didascalie : didascalie_plan;
	var $_numimages = ($type == 'image') ? num_images : num_images_plan;
	var $_prefUrlImg = ($type == 'image') ? pref : pref_plan; 
	var $_skipImg = ($type == 'image') ? ((typeof skip_images != 'undefined') ? skip_images : 0) : ((typeof skip_images_plan != 'undefined') ? skip_images_plan : 0);

	if(typeof $_arr != 'undefined'){		
		var currentImage = document.getElementById("mainimage"+$_suff);
		currentImage.src = "/img2/loader6.gif";
		
		if((index - $_skipImg) >= 0)
			index = ((index - $_skipImg) % $_numimages) + $_skipImg;
		else 
			index = $_numimages- 1 + $_skipImg; 
	   
		var currentImage = document.getElementById("mainimage"+$_suff);
		var newimgid = $_arr[index];
		currentImage.setAttribute('imgid',newimgid);
		($type == 'plan') ? currentImg_plan = index : currentImg = index;
		if(typeof(newimgid) != 'undefined')
			currentImage.src = __gvs_MEDIA_SERVER_IMAGE + $type + "/" + $_prefUrlImg + "_" + newimgid + ".jpg";
		
		$titleBigImg = document.getElementById( 'didascalia'+$_suff );
		if ( $titleBigImg ) {
			//$titleBigImg.className = $_didascalie[index] == '' ? 'titleDetailBigImageOff' : '';
			$titleBigImg.innerHTML = $_didascalie[index] != '' ? $_didascalie[index] : 'Ingrandisci';
		}
		
		var numImgDivs = ME('.num_img'+$_suff);

		for (i=0; i<numImgDivs.length; i++)
			numImgDivs[i].innerHTML = ($type == 'image') ? currentImg+(1-$_skipImg) : currentImg_plan+(1-$_skipImg);
	}
}

/*  FUNZIONI SUBMIT INVIA AMICO E SEGNALAZIONI ERRORI */

function submitEvent(){
	setTimeout("salvaAnnuncioBox.hide()",0);
	return true;
}
									
//FUNZIONI VARIE

browser = navigator.userAgent.toLowerCase();
		if (browser.indexOf("msie 7.0")!=-1){
			document.write("<" + "style type='text/css'>\n");
			document.write(".top_box_IE7{height:360px!important}\n");
			document.write("</" +"style>");
		}
	
function goBack()
{
	if ((typeof(pos) !== 'undefined') && pos<0 )
		document.location.href= back_url;
	else	history.back(-1);
}

function popupVideo(idVideo) 
        { 
                        height = 270; 
                        width  = 330; 
                        movetop = ( screen.height - height ) / 2; 
                        moveleft = ( screen.width - width ) / 2;
                        window.open( __gvs_MEDIA_SERVER + "videopopup.php?idVideo=" + idVideo, 
                                                 "video", 
                                                 "width=" + width + ",height=" + height + ",left=" + moveleft + ",top=" + movetop + ",toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes" ); 

        } 
        
function getBox(idAnnuncio, box, type) {
	
	switch (box) {
		case 'salvaAnnuncioBox':
			if (!salvaAnnuncioBoxActive){
				salvaAnnuncioBox = create_salvaBox(idAnnuncio);
				__selectedOvBox = salvaAnnuncioBox;
				salvaAnnuncioBoxActive = true;
			}
			salvaAnnuncioBox.show();
			selectedBox = salvaAnnuncioBox;
		break;
		case 'inviaAmicoBox':
			if (!inviaAmicoBoxActive){
				inviaAmicoBox = create_inviaBox(idAnnuncio, type);
				__selectedOvBox = inviaAmicoBox;
				inviaAmicoBoxActive = true;
			}else {
				inviaAmicoBox.show();
			}
			selectedBox = inviaAmicoBox;
		break;
		case 'segnalaErroreBox':
			if (!segnalaErroreBoxActive){
				segnalaErroreBox = create_segnalaErroreBox(idAnnuncio, type);
				__selectedOvBox = segnalaErroreBox;
				segnalaErroreBoxActive = true;
			}else {
				segnalaErroreBox.show();
			}
			selectedBox = segnalaErroreBox;
		break;
	}
	return false;
}

function onLoadEvent(idCont,latitudine,longitudine,zoom,showMarker,bMapControls){
	document.getElementById(idCont).style.display="block";
	var center = new GLatLng(latitudine,longitudine);
	
    map = createMap(idCont,center,zoom);
	if (typeof fnAddMapControls!="undefined")
		fnAddMapControls(map,1,bMapControls);		
	icon = getImmobiliareMapIcon();
	if (showMarker == 1){
		addMarker(map,latitudine,longitudine,icon)
	}else
	if (showMarker == 2){
		designArea(map,latitudine,longitudine,LOCALIZZAZIONE_RAGGIO_AREA);
	}
	
	//map.addControl(new GScaleControl());
	//map.addControl(new GSmallMapControl());
	map.add_zoom_buttons();
    map.disegna_rettangolo = disegna_rettangolo;
    map.f_rettangoli=f_rettangoli;
    map.f_simmetria_lat=f_simmetria_lat;
    map.f_simmetria_lng=f_simmetria_lng;
    map.f_simmetria=f_simmetria;
    map.f_rettangoli=f_rettangoli;
    //map.debug_rettangoli=1;
	if (typeof addPdiControl!="undefined" && typeof sPdiDefault!="undefined"){
		addPdiControl(map,"controllo_pdi",sPdiDefault,sPdiPrincipali);
	}
    fnCenterMap(map);
}

function showIntVideo(idVideo){
	selectVideoThumb(idVideo);
	if (document.getElementById("externalVideo"))
		document.getElementById("externalVideo").style.display="none";
	if (document.getElementById("internalVideo"))
		document.getElementById("internalVideo").style.display="";
}

function selectVideoThumb(idVideo){
	var thumbs = getElementsByClass("videoThumbsCont",document.getElementById('lista_video_ext'));
	for (i=0; i<thumbs.length;i++){
		thumbs[i].style.backgroundColor = "#FFF";
		thumbs[i].style.borderColor="#DDDDDD";
	}
	document.getElementById("videoThumbsCont_"+idVideo).style.background="#F3F6FB";
	document.getElementById("videoThumbsCont_"+idVideo).style.borderColor="#d10100";
}

function showExtVideo(idVideo){	
    if (!idVideo)
		return;
    selectVideoThumb(idVideo);
	var ajReq = new getMEAjaxObj();
	var pars = "?act=show&idVideo="+idVideo+"&idAnnuncio="+idAnnuncio+"&tipo="+tipoAnnuncio;
	if (document.getElementById("internalVideo"))
		document.getElementById("internalVideo").style.display="none";
	if (document.getElementById("externalVideo")){
		document.getElementById("externalVideo").style.display="";
		document.getElementById("externalVideo").innerHTML="<img src='/img2/videoLoader.gif' width='320' height='265'/>";
	}
	ajReq.Request("GET","/gestioneVideoExt.php"+pars,showExtVideoPlayer);  
}


function showExtVideoByUrl(idVideo){	
    if (!idVideo)
		return;
	else
		idVideo = Url.encode(idVideo);
    //selectVideoThumb(idVideo);
	var ajReq = new getMEAjaxObj();
	var pars = "?act=show&urlVideo="+idVideo+"&idAnnuncio="+idAnnuncio+"&tipo="+tipoAnnuncio;
	
	if (document.getElementById("internalVideo"))
		document.getElementById("internalVideo").style.display="none";
	
	if (document.getElementById("externalVideo")){
		document.getElementById("externalVideo").style.display="";
		document.getElementById("externalVideo").innerHTML="<img src='/img2/videoLoader.gif' width='320' height='265'/>";
	}
	ajReq.Request("GET","/gestioneVideoExt.php"+pars,showExtVideoPlayer);  
}


function showExtVideoPlayer(response){
	var html = response.responseText;
	if (html){
		if (document.getElementById("externalVideo"))
			document.getElementById("externalVideo").innerHTML=html;
	}else{
		alert("Si è verificato un errore, impossibile visualizzare il video");
	}
}


function scrollDiv(idDiv,idContainer,offset){
	var oDiv = document.getElementById(idDiv);
	var oCont = document.getElementById(idContainer);
	var contHeight = MEgetHeight(oCont);
	var divHeight = MEgetHeight(oDiv);
	var maxScroll = divHeight - contHeight;
	if (oDiv){
		var marginTop = (parseInt(oDiv.style.marginTop) ? parseInt(oDiv.style.marginTop) : 0) + parseInt(offset);
		if (marginTop<=0 && marginTop > -maxScroll)
			oDiv.style.marginTop = marginTop + "px";
	}
}


function popIframe(url,width,height,title){
	if (typeof url=="undefined")
		return false;
	if (typeof title=="undefined")
		title = "";
	var popBoxVt = new boxOverlay('virtualTourPopBox','grey');
	popBoxVt.setTitle(title);
	var html = "<iframe src='"+url+"' width='"+width+"' height='"+height+"' frameborder='0' style='overflow:hidden;'>I frame non supportato dal browser.</iframe>";
	popBoxVt.setContent(html);
	popBoxVt.show();
	return popBoxVt;
}

function enablePaginazione(){
	var pages = getElementsByClass('box_simili');
	for(var i = 0; i< pages.length; i++){
		pages[i].className = "box_simili left";
	}
	
	var paginazione = document.getElementById('pagSimili');
	paginazione.style.visibility = 'visible';
	paginazione.style.display = 'block';
}

function showRicercaAvanzata(){
	var oEl = document.getElementById('ricercaAvanzata');
	var oArrow = document.getElementById('arrowRicerca');
	if (oEl.style.display == 'none'){
		oArrow.style.backgroundPosition = "0 -24px";
		oEl.style.display = '';
	}else{
		oArrow.style.backgroundPosition = "0 0";
		oEl.style.display = 'none';
	}
}

function ipe_do_write(what){
	switch (what){
		case "im_es":
			document.write("<em>Immobile non soggetto all'obbligo di certificazione energetica</em>");
			break;
		case "im_att_cert":
			document.write("<em>Classe energetica e indice prestazione energetica sono in attesa di certificazione</em>");
			break;
	}
}

function apriMutuo() {
	window.open ( 'http://pubads.g.doubleclick.net/gampad/jump?iu=/4767090/Link_Mutui_Dettaglio_Annuncio&sz=1x1' );
}

function apriConsulenzaMutuo(){
	/*window.open ( 'http://pubads.g.doubleclick.net/gampad/jump?iu=/4767090/Link_ConsulenzaMutui_Dettaglio_Annuncio&sz=1x1');*/
	//popIframe('/consulenzaMutui.php?a=get',535,350,'Consulenza Mutui');
	/*	fnOpenConsMutui(); */

	boxOverCons=new boxOverlay("consulenza_mutuo_popup",'grey');
	boxOverCons.setTitle("Scegli la migliore consulenza per il tuo mutuo");
	/*boxOverCons.setContent('<iframe src="/mutui/iFrameConsulenzaMutui.html" width="765px" height="370px" scrolling="no" frameborder="0"></iframe>');*/
		boxOverCons.show();

	boxOverCons.setContent("<div id='div-gpt-ad-1394794068105-0' style='width:750px; height:360px;'>\
                            </div>");

	/*boxOverCons.hide();
    	fnOpenConsMutui();
*/
	googletag.cmd.push(function() { googletag.display('div-gpt-ad-1394794068105-0'); });
                                


}