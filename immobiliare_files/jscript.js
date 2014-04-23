function cleanTxt(){
		var txt = tinyMCE.activeEditor.getContent();
		txt = txt.replace(/<!--.*?-->/g,'');
		txt = txt.replace(/&lt;!--.*?--&gt;/g,'');
		tinyMCE.activeEditor.setContent(txt);
	}

var testo_form_dettaglio_immobile = "Il tuo messaggio: scrivi qui le tue richieste per ricevere informazioni più dettagliate";
function check_boxes(form, field, state) {
    for (i=0; i<form.length; i++){
		 if (form.elements[i].name == field)
		     form.elements[i].checked = state;
    }
}

/* Procedura per eliminazione bottone nel backoffice */
function reset_button(btn_num){
	$("imgact"+btn_num).value="del";
	$("image"+btn_num).src="";
	tinyMCE.get("testoPrinc"+btn_num.substr(2)).setContent("");
	$("preview"+btn_num.substr(2)).innerHTML="";
	if ($("anteprima_img"+btn_num.substr(2)))
		$("anteprima_img"+btn_num.substr(2)).src="";
	if ($("testoPrinc"+btn_num.substr(2)))
	$("testoPrinc"+btn_num.substr(2)).value="";
	alert("Conferma modifiche per completare la cancellazione");
}

function popupCartina(url){
	window.open(url,"popupcartina","location=no,width=600,height=400");
}

function popupPrivacy(){
	window.open("/casa/informazioni/politica-di-privacy.php","privacy","location=no,width=600,height=400,scrollbars=yes,resizable=yes,top=" + ((screen.height-400)/2) + ",left=" + ((screen.width-600)/2));
}
function popupCondizioniGenerali(){
	window.open("/casa/informazioni/condizioni-generali.php","condizioni_generali","location=no,width=600,height=400,scrollbars=yes,resizable=yes,top=" + ((screen.height-400)/2) + ",left=" + ((screen.width-600)/2));
}

function popupfoto(imgURL){
	window.open(imgURL,"popupfoto","location=no,width=730,height=600");
}

function textCounter(field, countfield, maxlimit) {
	if (field.value.length > maxlimit - 500){
		if (document.getElementById('remLenContent'))
			document.getElementById('remLenContent').style.display="block";
	}
	if (field.value.length > maxlimit)
		field.value = field.value.substring(0, maxlimit);
	else{
		 countfield.value = maxlimit - field.value.length;
		 if (countfield.value < (maxlimit/10))
		 	countfield.style.color = 'red';
		 else
		 	countfield.style.color = '#000000';
	}
	
}

function centerThumb(img, width, height){
	if (img.width)
			imgwidth = img.width;
	else
			imgwidth=width;
	if (img.height)
			imgheight=img.height;
	else
			imgheight=height;
	moveleft = Math.round((width - imgwidth) / 2);
	if (moveleft>0)
			img.style.marginLeft= moveleft + "px";
	movetop = Math.round((height - imgheight) / 2);
	if (movetop>0)
			img.style.marginTop= movetop + "px";
}
function show(tagId){
	if (document.getElementById(tagId))
		document.getElementById(tagId).style.display='';
}
function hide(tagId){
	if (document.getElementById(tagId))
		document.getElementById(tagId).style.display='none';
}

function toggleVisible(tagId){
	if (document.getElementById(tagId)){
		visibilityStatus = document.getElementById(tagId).style.display;
		if (visibilityStatus=='none')
			document.getElementById(tagId).style.display='block';
		else
		document.getElementById(tagId).style.display='none';
	}
}

//RICCARDO: due funzioni per la gestione della scritta di default nella
// form delle newsletter e il controllo se l'utente ci ha scritto dentro
function showFormText(oEl, sText) {
	var formContent = oEl.value;
	if(formContent.length == 0)
	{
		oEl.value = sText;
	}
}

function hideFormText(oEl, sText) {
	var formContent = oEl.value;
	if(formContent == sText)
	{
		oEl.value = '';
	}
}

function switchText(node, tagId, showText, hideText){
	if (document.getElementById(tagId)){
		visibilityStatus = document.getElementById(tagId).style.display;
		if (visibilityStatus=='none')
			node.innerHTML = showText;
		else
			node.innerHTML = hideText;
	}

}

function addToFavorites(url, title) {
	var sURL = window.location;
	var sText = title;

	try
	{	if (window.sidebar)
			window.sidebar.addPanel(sText, sURL, "");
		else if (window.external)
			window.external.AddFavorite(sURL, sText);
		else if (window.opera && window.print)
		{	var oA = document.createElement('a');
			oA.setAttribute('rel','sidebar');
			oA.setAttribute('href', sURL);
			oA.setAttribute('title', sText);
			oA.click();
		}
	}
	catch (e)
	{	
	}
}

function setAsHome(url){
	if (window.external){ //IE
		document.body.style.behavior='url(#default#homepage)';
		document.body.setHomePage(url);
	}
		else alert("Spiacenti, il tuo browser non supporta questa funzione");
}

function clickCounter(counterID){
	counterImg = new Image;
	counterImg.src='/img2/blank.gif?counter=' + counterID + '&amp;ts=' + (new Date()).getTime();
}

function	validateFormContatti(formObj){
	formObj.nome.value=formObj.nome.value.replace(/obbligatorio/, '');
	formObj.nome.value=formObj.nome.value.replace(/^\s+|\s+$/, '');
	formObj.telefono.value=formObj.telefono.value.replace(/obbligatorio tel. o email/, '');
	formObj.telefono.value=formObj.telefono.value.replace(/^\s+|\s+$/, '');
	formObj.email.value=formObj.email.value.replace(/obbligatorio tel. o email/, '');
	formObj.email.value=formObj.email.value.replace(/^\s+|\s+$/, '');
	
	errore ="";
	if (formObj.nome.value=="" || formObj.nome.value=="Il tuo nome")
		errore = errore + " - è obbligatorio indicare il nome\n";
    else
    if (document.getElementById('ti_utente_nome')) {
                document.getElementById('ti_utente_nome').value = formObj.nome.value;
        }
        
  if (formObj.source.value != "beez")
		if ((formObj.email.value=="" || formObj.email.value=="La tua email") && (formObj.telefono.value=="" || formObj.telefono.value=="Il tuo telefono"))
			errore = errore + " - è obbligatorio indicare almeno uno tra email e telefono\n";
  
	if (formObj.email.value!="" && formObj.email.value!="La tua email" && !checkEmail(formObj.email.value))
		errore = errore + " - indirizzo email non valido\n";
    else{
        if (document.getElementById('ti_utente_mail')) {
                document.getElementById('ti_utente_mail').value = formObj.email.value;
        }
    }
   
  if (formObj.source.value == "beez"){
		if (formObj.telefono.value=="" || formObj.telefono.value=="Il tuo telefono")
		errore = errore + " - è obbligatorio indicare il telefono\n";
		
		if (formObj.email.value=="" || formObj.email.value=="La tua email")
		errore = errore + " - è obbligatorio indicare l'email\n";
  }
	

	if (formObj.telefono.value!="" && formObj.telefono.value!="Il tuo telefono" && !/^(\+)?[\s\d()\-\/.]+$/.test(formObj.telefono.value))
		errore = errore + " - telefono non valido (non può contenere lettere, può iniziare con ' + ', può contenere numeri e ( ) / - . )\n";

    else
    if (formObj.telefono.value!="" && document.getElementById('ti_utente_telefono')) {
                document.getElementById('ti_utente_telefono').value = formObj.telefono.value;
        }
    
	if (!formObj.privacy.checked)
		errore = errore + " - conferma di aver letto la normativa sulla privacy e di acconsentire al trattamento dei dati \n";

	if (errore!=""){
		errore = "Errori nei dati:\n" + errore;
		alert(errore);
		return false;
	}else{
		return true;
	}
}
var objOmbra;
var objImage;
var objImageOver;
var objImg;

var position = "out";
var idFoto = 0;
var aperta = false;

function fotoplus(indice,imageid,op,outmin){

	//settiamo i valori per fa vedere la fotoplus
	if (op=='none' && position == "over" && idFoto != 0){
		if (!aperta || !outmin || (idFoto != indice))
		{
			position = "out";
			idFoto = 0;
			hideFotoPlus(indice,imageid);
		}
	}
	else{
		position = "over";
		idFoto = indice;
		setTimeout("showFotoPlus(" + indice + "," + imageid + ")", 1000);
	}
}

function showFotoPlus(indice,imageid){

	objOmbra = window.document.getElementById('popupOmbra_'+indice);
	objImage = window.document.getElementById('popupImage_'+indice);
	objImageOver = window.document.getElementById('popupImageOverlay_'+indice);
	objImg = window.document.getElementById('img_'+indice);

	if (position == "over" && idFoto == indice && !aperta){
		objImage.style.display='block';
		objOmbra.style.display='block';
		objImageOver.style.display='block';
		objImg.onload=initImage;
		objImg.src = __gvs_MEDIA_SERVER_IMAGE + "image/" + imageid + "/print.jpg";
		aperta = true;
		
	}
}

function hideFotoPlus(indice,imageid){

	objOmbra = window.document.getElementById('popupOmbra_'+indice);
	objImage = window.document.getElementById('popupImage_'+indice);
	objImageOver = window.document.getElementById('popupImageOverlay_'+indice);
	objImg = window.document.getElementById('img_'+indice);
	if (aperta){
		objImage.style.display='none';
		objOmbra.style.display='none';
		objImageOver.style.display='none';
		objImg.style.visibility='hidden';
		aperta = false;
	}
}

function initImage() {
	objImg.style.marginLeft = Math.round((600-objImg.width)/2) + "px";
	objImg.style.marginTop = Math.round((440-objImg.height)/2) + "px";
	setOpacity(0);
	objImg.style.visibility='visible';
	fadeIn(0);
}

function setOpacity(opacity) {
  opacity = (opacity == 100)?99.999:opacity;
  // IE/Win
  objImg.style.filter = "alpha(opacity:"+opacity+")";
  
  // Safari<1.2, Konqueror
  objImg.style.KHTMLOpacity = opacity/100;
  
  // Older Mozilla and Firefox
  objImg.style.MozOpacity = opacity/100;
  
  // Safari 1.2, newer Firefox and Mozilla, CSS3
  objImg.style.opacity = opacity/100;
}

function fadeIn(opacity) {
    if (opacity <= 100) {
      setOpacity(opacity);
      opacity += 10;
      window.setTimeout("fadeIn("+opacity+")", 50);
    }
}

function checkMessageForm(num) {
        var hasError = false;
        var cform = document.forms[ num ];
        if( cform.nome.value.length == 0 )
        {
                alert( "Il campo NOME e' obbligatorio" );
                hasError = true;
        }
        else if(!cform.telefono.value && !cform.email.value)
        {
                alert( "I campi TELEFONO ed EMAIL non possono essere entrambi vuoti" );
                hasError = true;
        }
        else if( cform.telefono.value && !cform.telefono.value.match( /^[0-9]{5,}$/ ) )
        {
                alert( "Il valore inserito nel campo TELEFONO non e' valido" );
                hasError = true;
        }
        else if( cform.email.value && !cform.email.value.match( /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/ ) )
        {
                alert( "Il valore inserito nel campo EMAIL non e' valido" );
                hasError = true;
        }
        else if( cform.commento.value.length == 0 )
        {
                alert( "Il campo MESSAGGIO e' obbligatorio" );
                hasError = true;
        }
        else if( !cform.privacy.checked )
        {
                alert( "E' necessario autorizzare il trattamento dei dati personali" );
                hasError = true;
        }       
        if( !hasError )
                cform.submit();
}

function hideContratto(id){
	var oDivContratto = window.document.getElementById(id);
	if (oDivContratto && oDivContratto.style.display){
		if (oDivContratto.style.display != 'none'){
			oDivContratto.style.display = 'none';
			setTimeout (function() {window.document.getElementById('idContratto2').checked= 'checked'; }, 1000); 
		}
	}
}

function showContratto(id, contratto){
	if (window.document.getElementById(id) == null)
		return false;
	var oDivContratto = window.document.getElementById(id);
	if (oDivContratto && oDivContratto.style.display){
		if (oDivContratto.style.display == 'none'){
			oDivContratto.style.display = 'block';
			if (contratto && contratto != "") {
				if (window.document.getElementById('idContratto' + contratto) == null)
					return false;
				window.document.getElementById('idContratto' + contratto).checked= 'checked';
			}
		}
	}
}

function VediPassword(divId)
	{
		sDivStatus = eval("document.getElementById('pwd"+divId+"').style.display");
		if(sDivStatus == '')
			{
				sDivOp = "document.getElementById('pwd"+divId+"').style.display='none';";
				sDivOp2 = "document.getElementById('hide"+divId+"').style.display='';";
				
			}
		else
			{
				sDivOp = "document.getElementById('pwd"+divId+"').style.display='';";
				sDivOp2 = "document.getElementById('hide"+divId+"').style.display='none';";
			}
		
		eval(sDivOp);
		eval(sDivOp2);
	}
function NascondiPassword(divId)
	{
		sDivId = "document.getElementById('pwd"+divId+"').style.display='none';";
		eval(sDivId);
	}
function CaricaServizi(sUrl)
	{
		document.location.href="http://"+location.host+"/casa/informazioni/prestiti.php";
	}
function MostraDescrizioneSw(DivID)
	{
		sCommand = "document.getElementById('sw" + DivID + "').style.display='none'";
		eval(sCommand);
		sCommand = "document.getElementById('sw" + DivID + "_ext').style.display='block'";
		eval(sCommand);	
	}
function NascondiDescrizioneSw(DivID)
	{
		sCommand = "document.getElementById('sw" + DivID + "').style.display='block'";
		eval(sCommand);
		sCommand = "document.getElementById('sw" + DivID + "_ext').style.display='none'";
		eval (sCommand);	
	}

function switchText2(node, tagId, showText, hideText, hideTagId, heightTag){

	if (document.getElementById(tagId)){
		visibilityStatus = document.getElementById(tagId).style.display;

		if (visibilityStatus=='none'){
			node.innerHTML = showText;
			if (document.getElementById('linkcitta'))
			    document.getElementById('linkcitta').style.display='block';
		}
		else{
			node.innerHTML = hideText;
			if (document.getElementById('linkcitta'))
			    document.getElementById('linkcitta').style.display='none';
		
		}
	}
	node.blur();
}

function hideRicercaAvanzata(hideTag,hideText){
	
	if (document.getElementById(hideTag))
		document.getElementById(hideTag).style.display = 'none';
	if (document.getElementById(hideText))
		document.getElementById(hideText).style.display = 'none';
	
}



function showRicercaAvanzata(hideTag,hideText,tagId,hideTagId,heightTag){
	if (document.getElementById(tagId)){
		visibilityStatus = document.getElementById(tagId).style.display;

		if (visibilityStatus=='block'){
		    if (document.getElementById('contCitta'))
			document.getElementById('contCitta').style.display='none';
			document.getElementById('linkRa').innerHTML = '&#9658; Ricerca base';
		}
		else{
			if (visibilityStatus!='none'){
				if (document.getElementById(hideTag)){
					document.getElementById(hideTag).style.display = 'block';
					
				}
			}
			if (document.getElementById('contCitta'))
			    document.getElementById('contCitta').style.display='block';
			document.getElementById('linkRa').innerHTML = '&#9658; Ricerca avanzata';
		}
		document.getElementById(hideText).style.display = 'block';
	}

}

function isNumberKeyPressed(charCode) {
        if (charCode > 31 && (charCode < 48 || charCode > 57 )) 
        		return false;
        return true;
}
	


function checkCurrencys(evt,alertMsg) {
	evt = (evt) ? evt : window.event;
	var charCode = (evt.charCode) ? evt.charCode : 
		((evt.keyCode) ? evt.keyCode :
			((evt.which) ? evt.which : 0)
		);
	var res=isNumberKeyPressed(charCode);
	if( typeof alertMsg!="undefined" && alertMsg==true ){
		var msg="In questo campo è possibile inserire solo numeri";
		if( !res )
			alert(msg);
	}
	return res;
}

function checkCurrencysFloat(evt) {
	evt = (evt) ? evt : event;
	var charCode = (evt.charCode) ? evt.charCode : 
		((evt.keyCode) ? evt.keyCode :
			((evt.which) ? evt.which : 0)
		);
	var carSpec = evt.keyCode;

	if (carSpec == 46 || carSpec ==37 || carSpec ==39) 
		return true;

	if (charCode == 44) 
		return true;
	
	if (charCode > 31 && (charCode < 48 || charCode > 57 )) {
			alert("In questo campo sono ammessi solo numeri\nI decimali devono essere separati da virgola (es:124,58)");
			return false;
	}
	
	return true;
}


function checkCurrencysGetrix(evt,input) {
	evt = (evt) ? evt : event;
	var charCode = (evt.charCode) ? evt.charCode : 
		((evt.keyCode) ? evt.keyCode :
			((evt.which) ? evt.which : 0)
		);
	var carSpec = evt.keyCode;

	if (carSpec == 46 || carSpec ==37 || carSpec ==39 || carSpec == 8) 
		return true;

	if ( ((charCode > 31 && (charCode < 48 || charCode > 57 ) && charCode!=45) || input.value=='-1' ) || ( input.value=='-' && charCode != 49) ) 
			return false;

	return true;
}
/**
 * Metodo per la validazione lato client del campo provincia in ricerca agenzie box a lato
 */
function validateSearchAgency(){
	if(jq('#idProvincia').length > 0){
		var idp = jq('#idProvincia').val();
		if(typeof(idp) == 'undefined' || idp == '' || idp == 0){
			 alert("Il campo provincia è obbligatorio");
			 return false;
		}else{
			jq('#form_raffina_nc').submit();
		}
	}else{
		jq('#form_raffina_nc').submit();
	}
}

/**
 * Metodo che toglie il value di default di un campo input se non modificato
 */
function exChangeValue( sMeInput, sMeDiv ) {
	if (!jq( '#'+sMeDiv ) || !jq( '#'+sMeInput ) )
		return false;

	if ( jq( '#'+sMeDiv ).css( 'display' ) == 'block' || jq( '#'+sMeDiv ).css( 'display' ) == '' ) {
		jq( '#'+sMeDiv ).hide();
		jq( '#'+sMeInput ).focus();
	}
	return true;
}
 
function vDivHidden( sMeDiv, sMeInput ) {
	if ( jq( '#'+sMeDiv ).css( 'display' ) == 'none' ){
		if ( !jq( sMeInput ).val() ){
			jq( '#'+sMeDiv ).show();
		}
	}
}

function aggPrezzo(nMoltiplicatore,sDiv,nValue){
nValue=parseFloat(nValue);
nValue=nValue.toFixed(2);
	if (!document.getElementById(sDiv).innerHTML)
		return null;
	nMoltiplicatore++;
	sEuro =nValue*nMoltiplicatore;
	sEuro = sEuro.toFixed(2);
	document.getElementById(sDiv).innerHTML = " € " + sEuro.replace(".",",");
	return true;
	
	
}




/************ BORSELLINO CAMBIO STATO****************************/
function alertCambioStato(obj,pending) {
	prec = $('tipoStatoAttuale').value;
	if ( (obj.value == 2 || obj.value == 5)){
	
		if (pending>1){
			testoAlert= "ci sono " + pending + " ricariche";
		}else{
			testoAlert= "c'e' una " + pending + " ricarica";
		}

		if (!confirm("Attenzione " + testoAlert + " in sospeso. Passando dallo stato di 'prova' a 'contratto/sospeso', tutti i dati riguardanti i pagamenti del borsellino non attivi e non pagati, verrano eliminati. Premere annulla per procedere manualmente.")){
			option = $('idTipologiaAgenzia').options;
			for (var i=0;i<option.length;i++) {
				if (option[i].value==prec){ 
					option[i].selected=true;
				}
			}
		}
	}
}


function checkTrovaImmobiliForm(oForm){
        return true;
}


function ordina(criterio){
	criteria = criterio.split('-');
	document.dati.criterio.value=criteria[0];
	document.dati.ordine.value=criteria[1];
    pushSelectedZonesOnMapInForm.bind(document.getElementById('form_raffina_nc'))();
	document.dati.submit();
}

function toggleTipologieDiv(idProgetto){
	idCont = 'tipologie_'+idProgetto;
	closedText = "Nascondi tipologie";
	openedText = "Vedi tipologie";
		
	if ( window.jQuery ) {
		if ( jq( '#'+idCont ).css( 'display' ) == 'none' )
			jq( '#toggler_'+idProgetto ).html( closedText );
		else
			jq( '#toggler_'+idProgetto ).html( openedText );
		jq( '#'+idCont ).slideToggle( 500 );
		
	} else {
		el = document.getElementById('toggler_'+idProgetto);
		toggleDiv( idCont,el,openedText,closedText );
	}
	return false;
}

//Gestione placeholders campi input
function addPlaceHolderCompatibility(containerID){
	if(typeof containerID !== "undefined"){
		container = "#"+containerID;
		}else{
		container = document;
		}
   jq.support.placeholder = false;
   test = document.createElement('input');
   if('placeholder' in test) jq.support.placeholder = true;

   if(!jq.support.placeholder) {
 
	jq(":text,textarea,.inputEmailType,.inputPasswordType", container).focus( function () {
		if (jq(this).attr('placeholder') != '' && jq(this).val() == jq(this).attr('placeholder')) {
            jq(this).val('').removeClass('placeHolder').addClass('textInput').select();
         }
	});
	 
	jq(":text,textarea,.inputEmailType,.inputPasswordType", container).blur(function () {
																					  
   		if (jq(this).attr('placeholder') && (jq(this).attr('placeholder') != '') && (jq(this).val() == '' || jq(this).val() == jq(this).attr('placeholder'))) {
            jq(this).val(jq(this).attr('placeholder')).addClass('placeHolder').removeClass('textInput');
			if(jq(this).hasClass("inputPasswordType") && jq(this).attr("type")=="password"){
				var el= jq(this);
				var el = document.getElementById(el[0].id);
				changeInputType(el,"text");		
			}	
         }
	});
     
      jq(":text,textarea,.inputEmailType,.inputPasswordType", container).blur();

   }
}
  

function cleanPlaceHolder(idForm){
    jq("input,textarea,.inputEmailType,.inputPasswordType", "#"+idForm).each(function() {
    if (jq(this).attr('placeholder') != '' && jq(this).val() == jq(this).attr('placeholder')) {
		jq(this).val('').removeClass('placeHolder').addClass('textInput');
    }
    });
}


//Funzione per la gestione della selezione delle date nelle statistiche del backoffice
function statsDateChangeEvent(){
	setTimeout(function(){
		var dataInizio = document.getElementById('dataInizio').value,
			dataFine = document.getElementById('dataFine').value;
			
		var firstValue = dataInizio.split('/');
		var secondValue = dataFine.split('/');
		
		var firstDate = new Date();
		firstDate.setFullYear(firstValue[2],(firstValue[1] - 1 ),firstValue[0]);
		
		var secondDate=new Date();
		secondDate.setFullYear(secondValue[2],(secondValue[1] - 1 ),secondValue[0]);
		
		if (firstDate > secondDate) {
			document.getElementById('getStats').style.display = 'none';
			document.getElementById('boxEsportaCSVstats').style.display = 'none';
			alert("Attenzione! Errore nella selezione delle date!");
			return false;
		}
		
		if(dataInizio != "" && dataFine != ""){
			document.getElementById('getStats').style.display = '';
			document.getElementById('boxEsportaCSVstats').style.display = '';
		}else{
			document.getElementById('getStats').style.display = 'none';
			document.getElementById('boxEsportaCSVstats').style.display = 'none';
		}
	},500);
}
