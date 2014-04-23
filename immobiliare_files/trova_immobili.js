 _lastErrMsgSetting = false;
 _isAlertEmail = false;
 _isSearchModify = false;
 _isNoGrazie = false;
 _disableAlertPopUp = false;
 __TI_servizio_1 = false;
 __TI_servizio_2 = false;
 __zone_showed = false;
 __blockTIAutoPopup = false;
 __tiReloadOnClose = false;

 /* preload images */
 preloadImages(new Array("/img2/loader7.gif"));

 function resetTIFields(field){
    if (typeof field=="undefined")
        field = null;
	
    if ( field ) {
		var tagName = mapErrorFieldName( field );
		removeError( tagName, false, true );

    }else{
      if (document.getElementById('TI_servizio_1_txt'))
        document.getElementById('TI_servizio_1_txt').style.color="";

      if (document.getElementById('TI_comune_txt'))
        document.getElementById('TI_comune_txt').style.color="";

      if (document.getElementById('TI_comune'))
        document.getElementById('TI_comune').style.borderColor="";

      if (document.getElementById('zoneTI_descrizione'))
         document.getElementById('zoneTI_descrizione').style.borderColor="";

      if (document.getElementById('zoneTI_descrizione_txt'))
         document.getElementById('zoneTI_descrizione_txt').style.color="";

      if (document.getElementById('TI_email_txt'))
         document.getElementById('TI_email_txt').style.color="";

      if (document.getElementById('TI_email'))
         document.getElementById('TI_email').style.borderColor="";

      if (document.getElementById('TI_password_txt'))
         document.getElementById('TI_password_txt').style.color="";

      if (document.getElementById('TI_password'))
         document.getElementById('TI_password').style.borderColor="";

      if (document.getElementById('TI_nome_txt'))
         document.getElementById('TI_nome_txt').style.color="";

      if (document.getElementById('TI_nome'))
         document.getElementById('TI_nome').style.borderColor="";

      if (document.getElementById('TI_cognome_txt'))
         document.getElementById('TI_cognome_txt').style.color="";

      if (document.getElementById('TI_cognome'))
         document.getElementById('TI_cognome').style.borderColor="";

      if (document.getElementById('TI_privacy_txt'))
         document.getElementById('TI_privacy_txt').style.color="";

      if (document.getElementById('TI_privacy'))
         document.getElementById('TI_privacy').style.borderColor="";

      if (document.getElementById('TI_messaggio_txt'))
         document.getElementById('TI_messaggio_txt').style.color="";

      if (document.getElementById('TI_messaggio'))
         document.getElementById('TI_messaggio').style.borderColor="";
	 
      if (document.getElementById('tipologia'))
         document.getElementById('tipologia').style.borderColor="";
	 
      if (document.getElementById('tipologia_txt'))
         document.getElementById('tipologia_txt').style.color="";
	 
      if (document.getElementById('prezzoMax_txt'))
         document.getElementById('prezzoMax_txt').style.color="";
	 
      if (document.getElementById('prezzoMax'))
         document.getElementById('prezzoMax').style.borderColor="";
	 
      if (document.getElementById('supMin_txt'))
         document.getElementById('supMin_txt').style.color="";
	 
      if (document.getElementById('supMin'))
         document.getElementById('supMin').style.borderColor="";
   }
 }

 function closeAndReloadTI(){
    var html = "<div style=\"margin:0 auto;padding:20px;width:200px;\"><h3>Aggiornamento dei dati in corso...</h3><img src=\"/img2/loader3.gif\" /></div>";
    _rel_mail_alert_box = new boxOverlay('rel_mail_alert_box','Grey');
    _rel_mail_alert_box.setContent(html);
    _rel_mail_alert_box.setTitle("Aggiornamento dati");
    _rel_mail_alert_box.show();
    window.location.reload();
 }


 function getTiSource(){
   oEl = document.getElementById('TI_source');
   if (oEl)
      return oEl.value;
   return null;
 }

function checkServiceActivated(service){
   service_id = null;
   switch (service){
      case "ricevi":
         service_id = 1;
         break;
      case "invia":
         service_id = 2;
         break;
      default:
         return false;
   }

   oEl = document.getElementById('TI_servizio_'+service_id)
   if (oEl){
      if (oEl.type == "checkbox"){
         if(document.getElementById('TI_servizio_'+service_id).checked)
            return true;
      }else{
         if(document.getElementById('TI_servizio_'+service_id).value)
            return true;
      }
   }

   return false;
}

 function display_trovakasa_result(data){
    var xmlDoc = data.responseXML;
    var errorMessage;
    var risposta = xmlDoc.getElementsByTagName('risposta');
    if (risposta.length == 0){
        errorMessage = "Si è verificato un errore la preghiamo di riprovare più tardi grazie. <br />Ci scusiamo per l'inconveniente"
        showErrMsg(errorMessage);
      if (document.getElementById('trova_immobili'))
         document.getElementById('trova_immobili').innerHTML = "";
      if (document.getElementById('TILoaderCont'))
         document.getElementById('TILoaderCont').style.display = "none";
         _mail_alert_box.show();
        return;
    }

    var esito = risposta[0].getAttribute("success");
    var errors = xmlDoc.getElementsByTagName('errori');
    var pagedata = xmlDoc.getElementsByTagName('dati');
    var instructions = xmlDoc.getElementsByTagName('instructions');
	var tipo_servizio = xmlDoc.getElementsByTagName('tipo_servizio');
	var idRicerca = xmlDoc.getElementsByTagName('idRicerca');
    var ricerca_area = xmlDoc.getElementsByTagName('ricerca_area');

    if (instructions.length > 0){
        var inst = instructions[0].childNodes;

        for (var i=0;i<inst.length;i++){
            switch (inst[i].tagName){
                case "reload":
                    if(parseInt(inst[i].childNodes[0].nodeValue) == 1 && !_isSearchModify ){
                        __tiReloadOnClose = true;
                    }
                    else
                        __tiReloadOnClose = false;
                    break;
            }
        }
    }

    if (pagedata.length > 0){
        var dati = pagedata[0].childNodes;
        for (var i=0;i<dati.length;i++){
            switch (dati[i].tagName){
                case "user":
                    var userdata = dati[i].childNodes;
                    for (var i=0;i<userdata.length;i++){
                        switch (userdata[i].tagName){
                            case "nome":
                                if(document.getElementById("TI_logged_user_data"))
                                document.getElementById("TI_nome_l").value=userdata[i].childNodes[0].nodeValue;
                                break;
                            case "cognome":
                            if(document.getElementById("TI_logged_user_data"))
                                document.getElementById("TI_cognome_l").value=userdata[i].childNodes[0].nodeValue;
                                break;
                            case "telefono":
                            if(document.getElementById("TI_logged_user_data"))
                                document.getElementById("TI_telefono_l").value=userdata[i].childNodes[0].nodeValue;
                                break;
                            case "email":
                            if(document.getElementById("TI_logged_user_data")){
                                document.getElementById("TI_email_l").value=userdata[i].childNodes[0].nodeValue;
                                document.getElementById("user_email_l").innerHTML=userdata[i].childNodes[0].nodeValue;
                            }
                                break;

                        }
                    }
                    if (document.getElementById("TI_logged_user_data")){
                        document.getElementById("TI_user_data").style.display = "none";

                        document.getElementById("TI_logged_user_data").style.display = "";
                    }
                    break;
            }
        }
    }

    if (errors.length > 0){
	    document.body.style.cursor = 'default';
        var errori = errors[0].childNodes;
        errorMessage = "<span class=\"TI_err_msg_icon TI_err_title\">Verifica le seguenti informazioni: </span>";
        for (var i=0;i<errori.length;i++){
            errorMessage+="<span>"+errori[i].childNodes[0].nodeValue+"</span>";
            if (i!=errori.length-1)
                errorMessage+=", ";

			if ( __TI_servizio_2 && document.getElementById('responseBox') )
			   document.getElementById('responseBox').style.display = 'none';
		   
		    var erroreCaratteristicheImmobile = false;
		
			var tagNameError = mapErrorFieldName( errori[i].tagName );
			setErrorFieldTC( tagNameError );
			
            switch ( tagNameError ) {
			    case "erroreTentativi":
					modificaDatiAlertEmail( 6 );
					return;
				break;
			    case "zona" :
					modificaDatiAlertEmail( 5 );
					showZoneSelectForm();
					showErrMsg(errorMessage);
                    return;                
				break;
			  	case "tipologia" :
				case "prezzoMax" :
				case "supMin" :
					erroreCaratteristicheImmobile = true;                
				break;
				case "TI_comune" :					
					modificaDatiAlertEmail( 7 );
					return;
				break;			            
            }
        }
		addPlaceHolderCompatibility();
		
		if( erroreCaratteristicheImmobile )
			modificaDatiAlertEmail( 1 );
		else
			modificaDatiAlertEmail( 2 );
		
		 _lastErrMsg = errorMessage;
		 _lastErrMsgSetting = true;
		errorMessage = '<span class=\"TI_err_msg_icon\">Verifica i campi evidenziati</span>'; 
        showErrMsg(errorMessage);
		display_zone_confirm_button();
    }else{
		removeError( 'TI_username' );
        hideErrMsg();
		var form_trovaimmobili = document.getElementById('form_trovaimmobili');

		if ( ricerca_area.length > 0 && ricerca_area[0].childNodes[0].nodeValue == '1') {
			if( document.getElementById('closeAlertEmail') )
				document.getElementById('closeAlertEmail').style.display = 'block';
			
			if( document.getElementById('contentBoxTrovaImmobili') )
				document.getElementById('contentBoxTrovaImmobili').style.display = 'none';
			
			if( document.getElementById('trovaImmobiliContainer') )
				document.getElementById('trovaImmobiliContainer').style.minHeight = '50px';
		}
		if ( _isAlertEmail ) {
			//parametro che dice al php di simulare l'attivazione dei servizi al solo scopo di verificare se tutto è ok..
			//questo perchè fare il check e attivare i servizi contemporaneamnte pora a lunghi tempi di attesa per attendere
			//la risposta ddal server dopo che ha inviato tutte le mail alle agenzie interessate

			if (document.getElementById("trova_immobili") && document.getElementById("trova_immobili").isCheckRequest)
			   document.getElementById("trova_immobili").isCheckRequest.value = 1;

			//Se è la modifica ricerca chiude la finestra e fa il reload in caso contrario apre il trovaimmobili
			if ( _isSearchModify ) {
	  		   writeSearchItem();
			   return;
			} else {
			   _mail_alert_box.setTitle( "<div style='font-size:16px'>Alert Email: Salva la ricerca e ricevi gli annunci via email</div>" );
			   document.getElementById( 'idRicerca' ).value = idRicerca[0].childNodes[0].nodeValue;
			   trackPage( '/trovakasa.php?type=mailAlert' );
			   modificaDatiAlertEmail(8);
			}

		 } else {			 
			//le prossime richieste non sono di check.....
			if ( !_isAlertEmail && document.getElementById("trova_immobili") && document.getElementById("trova_immobili").isCheckRequest){
				if (_lastTypeModifica != 2){
					document.body.style.cursor = 'default';
					modificaDatiAlertEmail( 2 );
					return;
				}
			}
				document.getElementById("trova_immobili").isCheckRequest.value=0;
			//Attivazione e Invio effettivo delle email e serizio
			__TI_servizio_1 = true;
			trackPage( '/trovakasa.php?type=trova' );
			submitAjaxForm('trova_immobili',function(){});
			//form_trovaimmobili.innerHTML = create_success_box();
			if ( _isSearchModify && !_isNoGrazie ) {
				var idRicerca = document.getElementById( 'idRicerca' ).value;
				document.getElementById( 'inviaRicercaTxt_'+idRicerca ).onclick = function(){};
				document.getElementById( 'inviaRicercaTxt_'+idRicerca ).style.cursor = 'default';
				document.getElementById( 'inviaRicercaTxt_'+idRicerca ).style.color = '#318000';
				document.getElementById( 'inviaRicercaTxt_'+idRicerca ).innerHTML = 'Ricerca inviata';
			  }
			modificaDatiAlertEmail(9);
		 }
        _mail_alert_box.show();
    }
 }


/**
 * Metodo che mappa i caratteri dei campi degli errori
 * @param {string} tagName
 * @returns {String}
 */
 function mapErrorFieldName( tagName ) {
	switch( tagName ) {
		case "agComune": 
			return 'TI_agComuneField';
		break;
		case "email": 
			return 'TI_username';
		break;
		case "zona" :
		case "tipologia": 
		case "erroreTentativi":
			return tagName;
		break;
		case "prezzoMassimo": 
		case "prezzoMax":
			return 'prezzoMax';
		break;
		case "superficieMinima": 
		case "supMin":
			return 'supMin';
		break;		 
		default: 
			return 'TI_' + tagName;
		break;
	}
 }

function removeError( field ) {	
	jq( '#' + field ).removeClass(  'input_error' );
	if( document.getElementById( field + '_txt' ) )
		document.getElementById( field + '_txt' ).style.color="";
	
	if( field == "TI_username" ) {
		if( document.getElementById( field + '_ricerca_txt' ) )
			document.getElementById( field + '_ricerca_txt' ).style.color="";					
		jq( '#' + field + '_ricerca' ).removeClass(  'input_error' );
	}
	
	if( field == "TI_privacy" ) {
		if( document.getElementById( field + '_ricerca_txt' ) )
			document.getElementById( field + '_ricerca_txt' ).style.color="";					
	}	
}


/**
 * Metodo che accende o spenge gli errori del form del trovacasa e della ricerca
 * @param {string} field [ Nome del campo per cui settare o cancellare l'errore ]
 * @param {boolean} [Variabile booleana che determina de visualizzare gli errori o se rimuoverli, se true li visualizza, se false li toglie]
 * @returns {void}
 */
function setErrorFieldTC( field ) {		
	if( document.getElementById( field ) )
		jq( '#' + field ).addClass(  'input_error' );
		
	if( document.getElementById( field + '_txt' ) )
			document.getElementById( field + '_txt' ).style.color="#D10100";
		
	if( field == "TI_username" ) {
		if( document.getElementById( field + '_ricerca_txt' ) )
			document.getElementById( field + '_ricerca_txt' ).style.color="#D10100";					

		if( document.getElementById( field + '_ricerca' ) ) { 
			jq( '#' + field + '_ricerca' ).addClass(  'input_error' );
		}
	}
	
	if( field == "TI_privacy" ) {				
		if( document.getElementById( field + '_ricerca_txt' ) )
			document.getElementById( field + '_ricerca_txt' ).style.color="#D10100";					
	}
}

 function resetTrovaImmobili(){
    _mail_alert_box.close();
     if (__tiReloadOnClose)
        closeAndReloadTI();
 }

 function submitTIForm(handler, disableCheckService){
   load_zone_confirm_button();
   _lastErrMsgSetting = false;
	hideErrMsg();	

	if ( typeof disableCheckService == 'undefined' || !disableCheckService ) {
	  __TI_servizio_1 = checkServiceActivated("ricevi")
	  __TI_servizio_2 = checkServiceActivated("invia")
	}
	__TI_source = getTiSource();

	
	 if( document.getElementById('TI_servizio_2').value == 'off' )
		document.getElementById('TI_username').value = document.getElementById('TI_username_ricerca').value;

	if ( !_isAlertEmail ) {
		document.body.style.cursor = 'wait';		
	}
	
	cleanPlaceHolder( 'trova_immobili' );
		
   if (typeof handler == "function")
      submitAjaxForm('trova_immobili',handler);
   else
      submitAjaxForm('trova_immobili',display_trovakasa_result);
 }

 function hideErrMsg(){
   if (document.getElementById("TI_errors"))
    document.getElementById("TI_errors").innerHTML = "";
   if (document.getElementById("TI_err_box"))
    document.getElementById("TI_err_box").style.display = "none";
 }

 function showErrMsg($msg){
    if (document.getElementById("sendOk"))
        document.getElementById("sendOk").style.display = "none";
    if ( document.getElementById("TI_errors") )
	  document.getElementById("TI_errors").innerHTML = $msg;
    if ( document.getElementById("TI_err_box") )
	  document.getElementById("TI_err_box").style.display = "block";
 }

 function create_success_box(reload,service_proposed){
    if ( _isSearchModify && !_isNoGrazie ) {
	  var idRicerca = document.getElementById( 'idRicerca' ).value;
	  document.getElementById( 'inviaRicercaTxt_'+idRicerca ).onclick = function(){};
	  document.getElementById( 'inviaRicercaTxt_'+idRicerca ).style.cursor = 'default';
	  document.getElementById( 'inviaRicercaTxt_'+idRicerca ).style.color = '#318000';
	  document.getElementById( 'inviaRicercaTxt_'+idRicerca ).innerHTML = 'Ricerca inviata';
	}
    var res = "";

    if (typeof service_proposed == "undefined")
        service_proposed = 0;
    else
        service_proposed = parseInt(service_proposed);
    res = "<div class=\"TI_success_box\">";
            if ( !_isSearchModify && (service_proposed == 0 || service_proposed == 1 ) ){
                res+="<div class=\"TI_confirm_box_row "+(__TI_servizio_1 ? "active" : "")+"\" style=\"float:left\">"+
                    "<div style=\"display: inline-block;*display:inline;*zoom:1;\">";
                        if (__TI_servizio_1)
                            res+="<img src=\"/img2/icone/alertEmailActiveIcon.png\"/>";
                        else
                            res+="<img src=\"/img2/icone/alert-email-disattivato.png\"/>";
                    res+="</div>"+
                    "<div class=\"TI_service_res\">"+
                        "<div class=\"TI_service_name "+(__TI_servizio_1 ? "active" : "")+"\">Alert email</div>"
                        +"<div class=\"TI_service_msg\">"
                            if (__TI_servizio_1)
                                res+="Il servizio è stato attivato";
                            else
                                res+="Il servizio non è stato attivato";
                        res+="</div>";
                        res+="<div class=\"clear\"></div>";
                    res+="</div></div>";
            }
            if (service_proposed == 0 || service_proposed == 2){
                res+="<div class=\"TI_confirm_box_row "+(__TI_servizio_2 ? "active" : "")+"\" style=\"width: 520px;border-top:1px solid #DDDDDD;margin-bottom:-19px;margin-top:14px;padding-top: 11px;float:left;\">"+
                    "<div style=\"display:inline-block;*display:inline;*zoom:1\">";
                        if (__TI_servizio_2)
                            res+="<img src=\"/img2/icone/trovacasaActiveIcon.png\"/>";
                        else
                            res+="<img src=\"/img2/icone/trovacasaIcon.png\"/>";
                    res+="</div>"+
                    "<div class=\"TI_service_res\">"+
                        "<div class=\"TI_service_name "+(__TI_servizio_2 ? "active" : "")+"\">Trovaimmobili</div>"
                        +"<div class=\"TI_service_msg\">";
                            if (__TI_servizio_2)
                                //res+="Il messaggio è stato inviato alle agenzie di zona";
                                res+="La tua ricerca è stata inviata alle agenzie della zona";
                            else
                                //res+="Il messaggio non è stato inviato alle agenzie di zona";
                                res+="La tua ricerca non è stata inviata alle agenzie della zona";
                        res+="</div>";
                        res+="<div class=\"clear\"></div>";
                    res+=" </div>"+
                    "<div class=\"clear\"></div>"+
                "</div>";
            }
			   res+= "<div style=\"float: right;margin:17px 0 10px;\" id=\"TI_chiudi_btn_container\">"+
					 "<input type=\"button\" onclick=\"resetTrovaImmobili();\" value=\"\" class=\"bottoneChiudiLungo\"></div></div>";

    document.body.style.cursor = 'default';

    return res;
}

   function closeProcess() {
		__TI_servizio_1 = true;
		__TI_servizio_2 = false;
		_isNoGrazie = true;
		resetTrovaImmobili();
   }

   function writeSearchItem() {
	 var idRicerca = document.getElementById( 'idRicerca' );
	 var that = new Object();
     that.idRicerca = idRicerca.value;
	 var oAjax = new getMEAjaxObj();
	 var ulrAjax = '/bookmarkricerche.php?getDataSearchModify=1&idRicerca='+idRicerca.value;
	 oAjax.Request( 'POST' , ulrAjax , function( response){ writeMofifyResponse( response, this.idRicerca ); }.bind( that ) );
   }


   //Funzione che gestisce i vari passaggi per il processo Alert Email e Trova Immobili
   function modificaDatiAlertEmail( type, restoreError ) {
		_lastTypeModifica = type;
		document.getElementById('close_mail_alert_box').style.display = 'block';
		document.getElementById('titleAlertEmail').style.display = 'block';
		document.getElementById('alertEmailContainer').style.display = 'block';

		 // STEP DEI PARAMETRI
		if ( type == 1 ) {
			selectTabAlertEmail('#formAlertEmailContainer');
			document.getElementById('TI_err_box').style.width = 'auto';			
			hideErrMsg();
			document.getElementById('containerSelezioneZone').style.display = 'none';
			document.getElementById('formAlertEmailGeografia').style.display = 'none';
			document.getElementById('alertEmailDetail').style.display = 'none';
			document.getElementById('formAlertEmailContainer').style.display = 'block';
			document.getElementById('close_mail_alert_box').onclick = function(){ _mail_alert_box.close() };
			
			var searchFormTI = new SearchFormTI();
			searchFormTI.init();
			
		} else if ( type == 2 ) {
		 selectTabAlertEmail('#alertEmailDetail');
		  // STEP DEL RIEPILOGO
		 if ( restoreError )
			   hideErrMsg();
			document.getElementById('TI_err_box').style.width = 'auto';
			document.getElementById('formAlertEmailGeografia').style.display = 'none';
			document.getElementById('alertEmailDetail').style.display = 'block';
			document.getElementById('formAlertEmailContainer').style.display = 'none';
			document.getElementById('containerSelezioneZone').style.display = 'none';
			_mail_alert_box.setTitle("<div style='font-size:16px'>Alert Email: Salva la ricerca e ricevi gli annunci via email</div>");
			document.getElementById('close_mail_alert_box').onclick = function(){ _mail_alert_box.close() };
		} else if ( type == 3 ) {
			// SELEZIONE ZONE
			document.getElementById('TI_err_box').style.width = '635px';
			document.getElementById('containerSelezioneZone').style.display = 'block';
			document.getElementById('alertEmailContainer').style.display = 'none';
			document.getElementById('titleAlertEmail').style.display = 'none';
			document.getElementById('close_mail_alert_box').onclick = function(){ restoreSelectedZonePopup(); modificaDatiAlertEmail( 7 ); };

		} else if ( type == 4 ) {
			_mail_alert_box.setTitle( "<div style='font-size:16px'>TrovaImmobili: Invia la ricerca alle agenzie della zona</div>" );
			
			document.getElementById('titleBox').innerHTML = "Descrivi l'immobile che stai cercando, le zone e le caratteristiche e<br> invia la ricerca alle agenzie. &Egrave; gratis!";
			
			document.getElementById('responseTrovacasaRicerca').style.display = 'none';	
			document.getElementById('form_trovaimmobili').style.display = 'block';						
			
			document.getElementById('iconAlertEmail').src = '/img2/trovaImmobili/icona-1.png';
			selectTabAlertEmail('#alertEmailDetail');
			
			document.getElementById('TI_servizio_1').value = 'off';
			document.getElementById('TI_servizio_2').value = 'on';
			
			jq( '#TI_username' ).removeClass( 'placeholder' );
			
			var prefix = !_isAlertEmail ? '_TI' : '';
			if ( document.getElementById( 'TILoaderCont'+prefix ) )
				document.getElementById( 'TILoaderCont'+prefix ).style.display = "none";
			if ( document.getElementById( 'TI_btn_sub'+prefix ) ) {
				document.getElementById( 'TI_btn_sub'+prefix ).style.display = "block";
				document.getElementById( 'TI_btn_sub'+prefix ).onclick = function(){ submitTIForm();this.blur(); };
			}
			document.getElementById( 'noGrazieButton' ).style.display = "block";
			if( document.getElementById('TI_username_txt') != null )
					document.getElementById('TI_username_txt').style.color="";
				document.getElementById('TI_username').style.borderColor="";
			
			document.getElementById('boxDataUserTrovacasa').style.display = 'block';
			document.getElementById('boxDataUserRicerca').style.display = 'none';			
			document.getElementById('responseBox').style.display = 'block';			

			document.getElementById('TI_servizio_1').value = 'off';
			document.getElementById('TI_servizio_2').value = 'on';
			_isAlertEmail = false;
			
			document.getElementById('TI_privacy_ricerca_txt').innerHTML = '';
			
			if ( document.getElementById('TI_privacy') )
				document.getElementById('TI_privacy').checked = '';
			
			
			//document.getElementById('TI_usernameTrovacasa').value = document.getElementById('TI_username').value;
			//document.getElementById('TI_usernameTrovacasa').disabled = true;
			
			document.body.style.cursor = 'default';
			document.getElementById('close_mail_alert_box').onclick = function(){ _mail_alert_box.close() };
			addPlaceHolderCompatibility();
			
		} else if ( type == 5 ) {
			document.getElementById('TI_err_box').style.width = 'auto';
			document.getElementById('formAlertEmailGeografia').style.display = 'none';
			document.getElementById('alertEmailDetail').style.display = 'block';
			document.getElementById('alertEmailContainer').style.display = 'none';
			document.getElementById('titleAlertEmail').style.display = 'none';
			document.getElementById('containerSelezioneZone').style.display = 'block';
			if( document.getElementById('trovaImmobiliContainer') )
				document.getElementById('trovaImmobiliContainer').style.display = 'none';
			document.getElementById('close_mail_alert_box').style.display = 'none';

		} else if ( type == 6 ) {
			document.getElementById('alertEmailContainer').style.display = 'none';
			document.getElementById('titleAlertEmail').style.display = 'none';
			if( document.getElementById('trovaImmobiliContainer') )
				document.getElementById('trovaImmobiliContainer').style.display = 'none';

			document.getElementById('errorAttemptsContainer').style.display = 'block';
			document.getElementById('close_mail_alert_box').onclick = function(){ _mail_alert_box.close() };

		} else if (type == 7) {
			// STEP MODIFICA LUOGO
			selectTabAlertEmail('#formAlertEmailGeografia');

			document.getElementById('TI_err_box').style.width = 'auto';
			document.getElementById('formAlertEmailGeografia').style.display = 'block';
			document.getElementById('formAlertEmailContainer').style.display = 'none';
			document.getElementById('alertEmailDetail').style.display = 'none';
			document.getElementById('containerSelezioneZone').style.display = 'none';
			if( document.getElementById('trovaImmobiliContainer') )
				document.getElementById('trovaImmobiliContainer').style.display = 'none';
            addEvent(document.getElementById('textZonaBtn'),"click",function(){document.getElementById('gm_area_TI').value = "";})
            document.getElementById('close_mail_alert_box').onclick = function(){ _mail_alert_box.close() };
			managePreviewImage();
		} else if( type == 8 ) {			
			document.body.style.cursor = '';
			document.getElementById('form_trovaimmobili').style.display = 'none';			
			document.getElementById('responseTrovacasaRicerca').style.display = 'block';			
			document.getElementById('responseTrovacasaRicescaStep1').style.display = 'block';
			document.getElementById('responseTrovacasaRicescaStep2').style.display = 'none';
			document.getElementById('messageServiceTrovacasa1').style.display = 'block';
			document.getElementById('messageServiceTrovacasa2').style.display = 'none';			
			document.getElementById('responseTrovacasaIcon').src = '/img2/icone/trovacasaIcon.png';			
			
			
		} else if( type == 9 ) {			
			document.body.style.cursor = '';
			document.getElementById('form_trovaimmobili').style.display = 'none';			
			document.getElementById('responseTrovacasaRicerca').style.display = 'block';	
			document.getElementById('responseTrovacasaRicescaStep1').style.display = 'none';
			document.getElementById('responseTrovacasaRicescaStep2').style.display = 'block';
			document.getElementById('messageServiceTrovacasa2').style.display = 'block';
			document.getElementById('messageServiceTrovacasa1').style.display = 'none';	
			document.getElementById('responseTrovacasaIcon').src = '/img2/icone/trovacasaActiveIcon.png';
		} 
		
		_mail_alert_box.show();
	}

   function restoreSelectedZonePopup() {
	  var idProvincia = getIDProvincia();
	  if (!idProvincia)
		 return;

	  var totZonePopup = popupAlertZoneSelected.length;

	  var formInput = document.getElementById( 'ZoneSelectTI' ).getElementsByTagName( 'input' );
	  for( var x = 0; x < formInput.length; x++ ) {
		 if ( formInput[x].checked ) {
			selectZona( idProvincia, formInput[x].value );
		 }
		 formInput[x].checked = '';
	  }

	  for( var x = 0;  x < totZonePopup; x++ ) {
		 selectZona( idProvincia, popupAlertZoneSelected[x] );
		 swapZona( popupAlertZoneSelected[x] );
	  }
   }


   /**
    * Funzione che popola il riepilogo del primo step dell'alert email
    * popolandolo con i valori modificati o inseriti nel form dello step 2
    */
   function controllaDatiFormAlertEmail( type ) {
	     
		var initName = document.getElementById( 'initName' ).innerHTML;
		initName = trimText(initName);

	    if (!isTIVacanze()) {
			//Cambia tipo contratto nel riepilogo
			var selection = document.getElementsByName('contratto');
			for (i=0; i<selection.length; i++){
				if (selection[i].checked == true) {
					var tipoContratto = selection[i].value;
				}
			}
			if ( document.getElementById('nomeContratto') ) {
				var nomeContratto = document.getElementById('nomeContratto');
				if ( tipoContratto == 1 ) {
					document.getElementById( 'contrattoRicerca' ).innerHTML = "<strong>Contratto:</strong>&nbsp;Vendita";
					nomeContratto.innerHTML = 'vendita';
				} else if ( tipoContratto == 2 ) {
					document.getElementById( 'contrattoRicerca' ).innerHTML = "<strong>Contratto:</strong>&nbsp;Affitto";
					nomeContratto.innerHTML = 'affitto';
				}
			}
		}

		var tipologia = document.getElementById('tipologia');
		var sottotipologia = document.getElementById('sottotipologia');
		var nomeTipologia = 'Immobili';

		if (document.getElementById('categoria_TI') && document.getElementById('categoria_TI').value == 4){
			
			var _nomeCategoria = "Stanza o posto letto";
			var _nomeTipologiaStanza = "";
			
			var selCategoriaStanzaTI = jq("#selCategoriaStanzaTI");
			var selTipologiaStanzaTI = jq("#selTipologiaStanzaTI");
			var nomeCategoria = jq("#nomeCategoria");
			var categoriaRicerca = jq("#categoriaRicerca");
			var nomeTipologiaStanza =  jq("#nomeTipologiaStanza");
			var tipologiaStanzaRicerca = jq("#tipologiaStanzaRicerca");
			
			if (selCategoriaStanzaTI.val() > 0){
				_nomeCategoria = selCategoriaStanzaTI.find(":selected").text();
			}
			
			if (selTipologiaStanzaTI.val() > 0){
				_nomeTipologiaStanza = selTipologiaStanzaTI.find(":selected").text();
			}
		
			nomeCategoria.html(_nomeCategoria);
			categoriaRicerca.html("<strong>Cetegoria:</strong>&nbsp;" + _nomeCategoria);

			nomeTipologiaStanza.html(_nomeTipologiaStanza);
			tipologiaStanzaRicerca.html("<strong>Tipo stanza:</strong>&nbsp;" + _nomeTipologiaStanza);

			if (selTipologiaStanzaTI.val() > 0){
				tipologiaStanzaRicerca.fadeIn("slow");
			} else {				
				tipologiaStanzaRicerca.fadeOut("slow");
			}
		} else {
			if ( document.getElementById('sottotipologia') && document.getElementById('nomeSottotipologia')) {
				var sottotipologia = document.getElementById('sottotipologia');
				var nomeSottotipologia = sottotipologia.options[sottotipologia.selectedIndex].innerHTML;
				document.getElementById('nomeSottotipologia').innerHTML = nomeSottotipologia;
				document.getElementById('nomeTipologia').innerHTML = '';
				document.getElementById( 'tipologiaRicerca' ).innerHTML = "<strong>Tipologia:</strong>&nbsp;" + nomeSottotipologia;
			} else {
				//Se sto nella categoria terreni
				if (tipologia.value == 28) {
					nomeTipologia = sottotipologia.options[sottotipologia.selectedIndex].innerHTML;
					if (nomeTipologia == "Tutti")
						nomeTipologia = "Terreni";
				} else if ( tipologia.value != 0 && tipologia.value != 14) {
					nomeTipologia = tipologia.options[tipologia.selectedIndex].innerHTML;
				}
				if (document.getElementById('nomeSottotipologia'))
					document.getElementById('nomeSottotipologia').innerHTML = '';
				document.getElementById('nomeTipologia').innerHTML = nomeTipologia;
				document.getElementById( 'tipologiaRicerca' ).innerHTML = "<strong>Tipologia:</strong>&nbsp;" + nomeTipologia;
			}
		}

		if ( initName.toLowerCase() == document.getElementById( 'TI_nomeRicerca' ).value.toLowerCase() ) {
			var initName = document.getElementById( 'initName' ).innerHTML;
			initName = trimText(initName);
			document.getElementById( 'TI_nomeRicerca' ).value = initName;
		}
		
		//Recupera i per la fascia prezzo
		var isPrezzo = false;
		if ( document.getElementById('prezzoMin') && document.getElementById('prezzoMax') ) {
			var prezzoMin = document.getElementById('prezzoMin').value;
			var prezzoMax = document.getElementById('prezzoMax').value;
			var prezzoRicerca = '<strong>Prezzo:</strong>';
			var prefPrezzo = prezzoMin != '' ? '&nbsp;a&nbsp;': '&nbsp;fino&nbsp;a&nbsp;';
			if ( prezzoMin != '' ) {
				prezzoRicerca += ' da '+prezzoMin+'&nbsp;&euro;';
				isPrezzo = true;
			}
			if ( prezzoMax != '' ) {
				prezzoRicerca += prefPrezzo+prezzoMax+'&nbsp;&euro;';
				isPrezzo = true;
			}
			if ( isPrezzo ) {
				document.getElementById('prezzoRicerca').innerHTML = prezzoRicerca;
			} else {
				document.getElementById('prezzoRicerca').innerHTML = '';
			}
		}

		//Recupera i valori per la fascia di superficie
		var isSuperfRicerca = false;
		if ( document.getElementById('supMin') && document.getElementById('supMax') ) {
			var supMin = document.getElementById('supMin').value;
			var supMax = document.getElementById('supMax').value;
			var superfRicerca = '';
			var contSuperfRicerca = '';
			var prefSuperf = supMin != '' ? '&nbsp;a&nbsp;': '&nbsp;fino&nbsp;a&nbsp;';
			if ( supMin != '' ) {
				contSuperfRicerca += ' da '+supMin+'&nbsp;m&sup2;';
				isSuperfRicerca = true;
			}
			if ( supMax != '' ) {
				contSuperfRicerca += prefSuperf+supMax+'&nbsp;m&sup2;';
				isSuperfRicerca = true;
			}
			if ( isSuperfRicerca ) {
				superfRicerca = '<strong>Superficie:</strong>'+contSuperfRicerca;
				document.getElementById('superficieRicerca').innerHTML = superfRicerca;
			} else {
				document.getElementById('superficieRicerca').innerHTML = '';
			}
		}

		//Recupera i valori per il numero dei locali
		var isLocMin = false;
		if ( document.getElementById('locMin') && document.getElementById('locMax') ) {
			var locMin = document.getElementById('locMin').value;
			var locMax = document.getElementById('locMax').value;
			var localiRicerca = '<strong>Locali:</strong>';
			var prefLocali = locMin ? '&nbsp;a&nbsp;' : '&nbsp;fino&nbsp;a&nbsp;';
			if ( locMin != '' ) {
				localiRicerca += ' da '+locMin;
				isLocMin = true;
			}
			if ( locMax != '' ) {
				localiRicerca += prefLocali+locMax;
				isLocMin = true;
			}
			if ( isLocMin ) {
			   document.getElementById('localiRicerca').innerHTML = localiRicerca;
			} else {
			   document.getElementById('localiRicerca').innerHTML = '';
			}
		}

		if ( document.getElementById('bagni') ) {
			var bagni = document.getElementById('bagni');
			if ( bagni.value != 0 ) {
			   document.getElementById('bagniRicerca').innerHTML = (isLocMin ? '&nbsp;|&nbsp;' : '') + '<strong>Bagni:</strong>&nbsp;'+bagni.options[bagni.selectedIndex].innerHTML;
			} else {
			   document.getElementById('bagniRicerca').innerHTML = '';
			}
		}

		isFkStato = false;
		if ( document.getElementById('fkStato') ) {
			var stato = document.getElementById('fkStato');
			if ( stato.value  != 0 ) {
			   isFkStato = true;
			   document.getElementById('statoRicerca').innerHTML = '<strong>Stato:</strong>&nbsp;'+stato.options[stato.selectedIndex].innerHTML;
			} else {
			   document.getElementById('statoRicerca').innerHTML = '';
			}
		}

		if ( document.getElementById('boxautoTI') ) {
			var postoAuto = document.getElementById('boxautoTI');
			if ( postoAuto.value  != 0 ) {
			   document.getElementById('boxPostoRicerca').innerHTML = (isFkStato ? '&nbsp;|&nbsp;' : '') + '<strong>Box/Posto auto:</strong>&nbsp;'+postoAuto.options[postoAuto.selectedIndex].innerHTML;
			} else {
			   document.getElementById('boxPostoRicerca').innerHTML = '';
			}
		}

		//Recupera i valori per il campo altri dati
		 var altriDati = '';
		 if ( document.getElementById('altriDati') ) {

			if ( document.getElementById( 'tipoProprieta' ) ) {
				var tipoPropr = document.getElementById('tipoProprieta');
				if ( tipoPropr.value != 0 )
					altriDati += '<strong>Tipo propriet&agrave;:</strong>&nbsp;'+
										tipoPropr.options[tipoPropr.selectedIndex].innerHTML+
										'&nbsp;| ';
			}

			if ( document.getElementById('riscaldamento') ) {
				var riscaldamento = document.getElementById('riscaldamento');
				if ( riscaldamento.value != 0 )
					altriDati += '<strong>Riscaldamento:</strong>&nbsp;'+riscaldamento.options[riscaldamento.selectedIndex].innerHTML+'&nbsp;| ';
			}

			if ( document.getElementById('terrazzoTI') ) {
				var terrazzo = document.getElementById('terrazzoTI').checked;
				if ( terrazzo )
					altriDati += '<strong>Terrazzo:</strong>&nbsp;sì&nbsp;| ';
			}

            if ( document.getElementById('balconeTI') ) {
                var flagBalcone = document.getElementById('balconeTI').checked;

                if ( flagBalcone ){
                    altriDati += '<strong>Balcone:</strong>&nbsp;sì&nbsp;| ';
                }
            }

			if ( document.getElementById('giardinoTI') ) {
				var giardino = document.getElementById('giardinoTI').checked;
				if ( giardino )
					altriDati += '<strong>Giardino:</strong>&nbsp;sì&nbsp;| ';
			}

			if ( document.getElementById('arredatoTI') ) {
				var arredato = document.getElementById('arredatoTI').checked;
				if ( arredato )
					altriDati += '<strong>Arredato</strong>:&nbsp;sì&nbsp;| ';
			}

			//IN ASTA
			if ( document.getElementById('inAstaTI') ) {
				var inAsta = document.getElementById('inAstaTI').checked;
				if ( inAsta )
					altriDati += '<strong>In asta</strong>:&nbsp;sì&nbsp;| ';
			}

			// A REDDITO
			if ( document.getElementById('aRedditoTI') ) {
				var aReddito = document.getElementById('aRedditoTI').checked;
				if ( aReddito )
					altriDati += '<strong>A reddito</strong>:&nbsp;sì&nbsp;| ';
			}

			if ( document.getElementById('animaliTI') ) {
				var animali = document.getElementById('animaliTI').checked;
				if ( animali )
					altriDati += '<strong>Animali</strong>:&nbsp;sì&nbsp;| ';
			}
			
			if ( document.getElementById('fumatoreTI') ) {
				var fumatore = document.getElementById('fumatoreTI').checked;
				if ( fumatore )
					altriDati += '<strong>Fumatori</strong>:&nbsp;sì&nbsp;| ';
			}			
			
			if ( document.getElementById('ascensoreTI') ) {
				var ascensore = document.getElementById('ascensoreTI').checked;
				if ( ascensore )
					altriDati += '<strong>Ascensore</strong>:&nbsp;sì&nbsp;| ';
			}
			
			if ( document.getElementById('giardinoTI') ) {
				var giardinoTI = document.getElementById('giardinoTI');
				if ( giardinoTI.value != 0 )
					altriDati += '<strong>Giardino:</strong>&nbsp;'+giardinoTI.options[giardinoTI.selectedIndex].innerHTML+'&nbsp;| ';
			}
			
			if ( document.getElementById('classeEnergeticaTI') ) {
				var classeEnergeticaTI = document.getElementById('classeEnergeticaTI');
				if ( classeEnergeticaTI.value != 0 )
					altriDati += '<strong>Classe energetica:</strong>&nbsp;'+classeEnergeticaTI.options[classeEnergeticaTI.selectedIndex].innerHTML+'&nbsp;| ';
			}
		
			document.getElementById('altriDati').innerHTML = trim2( altriDati, '| ' );
		 }

	   if ( false && typeof type != 'undefined' ) {
		   // viene uniformato il comportamento tra alert email e bookmark ricerche.
		   // per portalo allo stato iniziale togliere il "false"
		   submitTIForm();
	   } else {
			if( __TI_servizio_2 )
				submitTIForm();
			else
				modificaDatiAlertEmail( 2 );
	   }
   }

   function checkLocation() {
	  var idComune = document.getElementById( 'TI_comune' ).value;
	  if (isTIVacanze()) {
		  var idAreaGeografica = document.getElementById("TI_areaGeografica").value;
	  }
	  var gmAreaTI = document.getElementById('gm_area_TI').value;
	  var tipoRicercaTI = document.getElementById('tipoRicerca_TI').value;
	  var idsZone = document.getElementById('zoneTI_ids').value;
	  var isCittaConZona = document.getElementById('cittaConZona').value == 1 ? true : false;
	  var isEnabledZone = document.getElementById('enabledZone').value == 1 ? true : false;
      var nomeProvincia = document.getElementById('nomeProvincia').value;
	  var initName = document.getElementById( 'initName' ).innerHTML;
	  initName = trimText(initName);

	  if (isTIVacanze()) {
		  var agLocalitaValue = document.getElementById("TI_agComuneField").value;
		  document.getElementById('localitaRicerca').innerHTML = "<strong>Località:</strong>&nbsp;" + agLocalitaValue;
		  document.getElementById('nomeLocalitaRicerca').innerHTML = agLocalitaValue;
      } else if (document.getElementById( 'nomeComuneRicerca' )) {
		 var selectComune = document.getElementById('TI_comune');
		 var nomeComune = selectComune.options[selectComune.selectedIndex].innerHTML

		 var valueComune = selectComune.options[selectComune.selectedIndex].value;
			if (!gmAreaTI){
                if ( !valueComune)
                    nomeComune = "?";

                document.getElementById( 'congiunction_geo' ).innerHTML = " a ";
		        document.getElementById( 'nomeComuneRicerca' ).innerHTML = nomeComune;
		        document.getElementById( 'comuneRicerca' ).innerHTML = "<strong>Comune:</strong>&nbsp;" + nomeComune;
				if ( document.getElementById( 'provinciaRicerca' ) )
					document.getElementById( 'provinciaRicerca' ).innerHTML = "";
            }else{
                document.getElementById( 'congiunction_geo' ).innerHTML = " in provincia di ";
                document.getElementById( 'nomeComuneRicerca' ).innerHTML = nomeProvincia;
				if ( document.getElementById( 'provinciaRicerca' ) )
					document.getElementById( 'provinciaRicerca' ).innerHTML = "<strong>Provincia:</strong>&nbsp;" + nomeProvincia;
                document.getElementById( 'comuneRicerca' ).innerHTML = "";
            }

	  }
	  
	  if ( initName.toLowerCase() == document.getElementById( 'TI_nomeRicerca' ).value.toLowerCase() ) {
		 var initName = document.getElementById( 'initName' ).innerHTML;
		 initName = trimText(initName);
		 document.getElementById( 'TI_nomeRicerca' ).value = initName;
	  }

	   if (!isTIVacanze() && !idComune && !jq("#gm_area_TI").val()) {
		   errorMessage = "<span class=\"TI_err_msg_icon TI_err_title\">Attenzione: </span><span>Seleziona un comune oppure disegna un'area sulla mappa</span>";
		   showErrMsg( errorMessage );
		   return;
	   } else if ( (isEnabledZone && isCittaConZona) && ( ((idsZone == '' || idsZone == 0) && tipoRicercaTI == '') || (gmAreaTI == '' && tipoRicercaTI == 'mappa') ) ) {
		   if (isTIVacanze()) {
			   errorMessage = "<span class=\"TI_err_msg_icon TI_err_title\">Attenzione: </span><span>Seleziona almeno una zona</span>";
		   } else {
			   errorMessage = "<span class=\"TI_err_msg_icon TI_err_title\">Attenzione: </span><span>Seleziona almeno una zona o disegna un'area sulla mappa</span>";
		   }
		   showErrMsg( errorMessage );
		   return;
	   }

	  hideErrMsg();

	  if (isEnabledZone && isCittaConZona && tipoRicercaTI == '') {
		 var oAjax = new getMEAjaxObj();
		 var ulrAjax = '/eseguiServizioTrovakasa.php?trova_immobili=1&elencoZone='+idsZone+'&comune='+idComune;
		 oAjax.Request( 'POST' , ulrAjax , function( response ){ setNewZone( response ); loadPreviewZone(); });
	  } else {
		 if (document.getElementById('nomeNumeroZone')) {
			 if ( tipoRicercaTI == 'mappa' && gmAreaTI != '' ) {
			   loadGoogleMapStaticImage('riepilogo', true);
			   document.getElementById('nomeNumeroZone').innerHTML = '<strong>Area:</strong> disegnata su mappa';
			 } else {
			   document.getElementById('nomeNumeroZone').innerHTML = '';
			 }
		 }
		 if (document.getElementById('totZoneAlertEmail'))
			document.getElementById('totZoneAlertEmail').innerHTML = '';
		 if (document.getElementById('zoneRicerca'))
			document.getElementById('zoneRicerca').innerHTML = '';
	  }
	  document.getElementById('fkComune_TI').value = idComune;
	  if (isTIVacanze() && TI_agComuneField.getObject().type == "areaGeografica") {
		  document.getElementById('idAreaGeografica_TI').value = idAreaGeografica;
		  jq("#prev_img_confini_comune").prop('src', TI_agComuneField.getUrlCartina());
	  } else {
		  // Carico la cartina con i confini del comune.
		  if( !isEstero() )
			xajax_getAjaxComuneImage('prev_img_confini_comune', idComune);
	  }

	  if ( _lastTypeModifica == 5 ) {
			modificaDatiAlertEmail( 1, true );
	  } else {
			managePreviewImage('prev_')
			modificaDatiAlertEmail( 2 );
	  }
   }

	 function isEstero() {
		 fkNazione = document.getElementById('fkNazione').value;
		 if( fkNazione == '' || fkNazione == 'IT' )
			 return false;
		 return true;
	 }

	//Funzione che recupera il nome delle zone selezionate per stamparle nell'etichetta del riepilogo
	function settaInputZonePopup() {
	  var errorMessage = '';
	  //if ( _isAlertEmail ) {
		 var idsZone = '';
		 var totZone = 0;
		 oRadio = document.getElementById('ZoneSelectTI').getElementsByTagName('input');
		 for( var i = 0; i < oRadio.length; i++ ) {
			 if( oRadio[i].checked ) {
				 idsZone += oRadio[i].value+',';
				 if ( !in_array( oRadio[i].value, popupAlertZoneSelected ) )
					 popupAlertZoneSelected.push( oRadio[i].value );

				 totZone++;
			 }
		 }
		 var testoBtn = 'Scegli la zona';
		 if ( totZone > 0 ) {
			testoBtn = "Zone, " + totZone + (totZone == 1 ? " selezionata" : " selezionate");
		 } else {
			errorMessage = "<span class=\"TI_err_msg_icon TI_err_title\">Mancano le seguenti informazioni: </span><span>Seleziona almeno una zona</span>";
			testoBtn = "Scegli la zona";
		 }
		 document.getElementById( 'textZonaBtn' ).innerHTML = testoBtn;
		 jq("#modifica_zona_TI").show();
	  /*}else{
          submitTIForm();
      }*/

	  if ( errorMessage ) {
		 showErrMsg( errorMessage );
		 return;
	  }

	  hideErrMsg();
	  loadPreviewZone(true)
	  if ( _lastTypeModifica == 5 )
		  modificaDatiAlertEmail( 7, true );
	  else
		  modificaDatiAlertEmail( 7 );
   }

   /**
    * Funzione stampa nel riepilogo le zone ed il numero recuperati dalla chiamata ajax
    */
   function setNewZone( response ) {
	  if( document.getElementById( 'zoneRicerca' ) ) {
		 var zoneRicerca = document.getElementById( 'zoneRicerca' );
		 zoneRicerca.innerHTML = response.responseText;
		 var totNuoveZone = document.getElementById('totZoneAlertEmail').value;
		 if (totNuoveZone > 0)
			document.getElementById('nomeNumeroZone').innerHTML = '<strong>' + ( totNuoveZone == 1  ? 'Zona selezionata' : 'Zone selezionate' ) + ' ('+totNuoveZone+'):</strong>';
		 else
			document.getElementById('nomeNumeroZone').innerHTML = '';
	  }
   }

   //Funzione che resetta le zone selezionate
   function resetZone() {
		if ( document.getElementById( 'zoneTI_descrizione' ) )
			document.getElementById( 'zoneTI_descrizione' ).value = '';

		if ( document.getElementById( 'zoneTI_ids' ) )
			document.getElementById( 'zoneTI_ids' ).value = '';

		if ( document.getElementById( 'zoneRicerca' ) )
			document.getElementById( 'zoneRicerca' ).value = '';

		if ( document.getElementById( 'zoneRicerca' ) )
			document.getElementById( 'zoneRicerca' ).innerHTML = '';

		if ( document.getElementById( 'nomeNumeroZone' ) )
			document.getElementById( 'nomeNumeroZone' ).innerHTML = '';

		__zone_showed = false;
		zone_selected_TI = new Array();
	   popupAlertZoneSelected = new Array();
   }

   function resetPolygon() {
	  jq("TI_poligono").val('');
   }
   /**
    * Funzione che controlla che nella selezione zone del trovacasa siano state selezionate zone e che non siano più di 4
   */
   function closeZoneTrovaImmobili() {
	  var numZone = 0;
	  var zoneSelectTI = document.getElementById('ZoneSelectTI');
	  var idsZone =  zoneSelectTI.getElementsByTagName('input');
	  for( var x = 0; x < idsZone.length; x++ ) {
		 if ( idsZone[x].checked )
			numZone++;
	  }

	  if ( numZone > 0 && numZone < 5 ) {
		 hideErrMsg();
		 document.getElementById('TI_err_box').style.width = '435px';
		 document.getElementById('containerSelezioneZone').style.display = 'none';
		 document.getElementById('trovaImmobiliContainer').style.display = 'block';
		 document.getElementById('close_mail_alert_box').onclick = function(){ _mail_alert_box.close() };
	  } else if ( numZone == 0 ) {
		 errorMessage = "<span class=\"TI_err_msg_icon TI_err_title\">Mancano le seguenti informazioni: </span><span>Seleziona almeno una zona</span>";
		 showErrMsg( errorMessage );
	  } else if ( numZone > 4 ) {
		 errorMessage = "<span class=\"TI_err_msg_icon TI_err_title\">Mancano le seguenti informazioni: </span><span>Non è possibile selezionare più di 4 zone</span>";
		 showErrMsg( errorMessage );
	  }
   }

   function errorMessageTrovaImmabili( errorMessage ) {
	  document.getElementById('responseBox').style.display = 'none';
	  showErrMsg( errorMessage );
   }

   function startMailAlertProcess(oForm,type){
	   if(_disableAlertPopUp)
		   return false;
		

     _isNuoveCostruzioni = false;
	 if ( document.getElementById('categoria') )
	   _isNuoveCostruzioni = document.getElementById('categoria').value == '6' ? true :false;

	  _isAlertEmail = true;
	  appendCss("/includes/trova_immobili.css","mail_alert_css");
	  appendCss('/includes/btn_bootstrap.css','btn_bootstrap.css');
	  appendCss('/includes/tab_bootstrap.css','tab_bootstrap.css');
	  appendCss('/includes/radiobutton-ui.css','radiobutton-ui.css');

    if (typeof __ti_preloaded=="undefined"){
        preloadImages(new Array("/img2/loader3.gif","/img2/loader6.gif"));
        __ti_preloaded = true;
    }
    __TI_activeForm = oForm;
    zone_selected_TI = new Array();
    __zone_showed=false;

	popupAlertZoneSelected = new Array();
	if ( document.getElementById( 'zoneTI_ids' ) ) {
		 var iDs = trim2( document.getElementById( 'zoneTI_ids' ).value, ',' );
		 popupAlertZoneSelected = iDs.split(",");
	}


    if (typeof type == "undefined")
        if (oForm.email.value == oForm.email.getAttribute("startvalue") || oForm.email.value == ""){
         oForm.email.value = '';

        }
        else
        if (!checkEmail(oForm.email.value)){
            alert("inserisci una email valida");
            return false;
        }

    //if (typeof _mail_alert_box!="undefined" && _mail_alert_box.close && typeof _mail_alert_box.close == "function")
        //_mail_alert_box.destroy();

    hideMailAlertBottomBanner();

	if ( typeof _mail_alert_box == "undefined" || !_mail_alert_box.isOpen ) {
	  selAccediBox = {};
	  selAccediBox.box = _mail_alert_box = new boxOverlay('mail_alert_box','Grey');

	  showLoader(_mail_alert_box);
	  _mail_alert_box.setTitle("<div style='font-size:16px'>Alert Email: Salva la ricerca e ricevi gli annunci via email</div>");
	  _mail_alert_box.show();

	  var bckEmail = "";
	  if (typeof type!="undefined" && type<=3){
		  oForm.formType.value=type;
		  /*if (oForm.email)
			  oForm.email.value = "";
		  if (oForm.password)
			  oForm.email.password = "";
		*/
	  }
	  submitAjaxForm(oForm,
		  function(data){
			  _mail_alert_box.setContent(data.responseText);
			  _mail_alert_box.addEventOnClose(function(){ __isTrovaImmobili = false; _mail_alert_box.manageConflicts = true; });
			  _mail_alert_box.show();
			  _mail_alert_box.manageConflicts = false;
			  __isTrovaImmobili = true;
			  initAlertEmailArea();			  
			  document.getElementById('boxDataUserRicerca').style.display = 'block';
			  document.getElementById('boxDataUserTrovacasa').style.display = 'none';
			  document.getElementById('responseBox').style.display = 'none';
			  _mail_alert_box.show();
			  addPlaceHolderCompatibility();			  
		  },
		  "/eseguiServizioTrovakasa.php"
	  );
	}
    return true;
   }

   function startSearchModify( idRicerca, type ) {
	  _isAlertEmail = true;
	  _isSearchModify = true;

	  nomeRicerca = document.getElementById( 'value_nomeRicerca_'+idRicerca ).value;
	  appendCss("/includes/trova_immobili.css","mail_alert_css");
	  appendCss('/includes/btn_bootstrap.css','btn_bootstrap.css');
	  appendCss('/includes/tab_bootstrap.css','tab_bootstrap.css');
	  appendCss('/includes/radiobutton-ui.css','radiobutton-ui.css');

	  if ( typeof __ti_preloaded=="undefined" ) {
		 preloadImages( new Array("/img2/loader3.gif","/img2/loader6.gif" ) );
		 __ti_preloaded = true;
	  }
	  zone_selected_TI = new Array();
	  __zone_showed=false;

	  hideMailAlertBottomBanner();

	  selAccediBox = {};
	  selAccediBox.box = _mail_alert_box = new boxOverlay('mail_alert_box','Grey');
	  //_mail_alert_box.fixedPosition = false;
	  showLoader( _mail_alert_box );

	  if ( nomeRicerca.toUpperCase() == nomeRicerca )
		 nomeRicerca = nomeRicerca.toLowerCase()

	  if ( nomeRicerca.length > 75 )
		 nomeRicerca = nomeRicerca.substr(0,75)+'...';

	  _mail_alert_box.setTitle( "<div style='font-size:16px;'>"+nomeRicerca+"</div>" );
	  _mail_alert_box.show();

	  var oAjax = new getMEAjaxObj();
	  var ulrAjax = '/eseguiServizioTrovakasa.php?idRicerca='+idRicerca+'&getForm=1&trova_immobili=1&formType=1';
	  oAjax.Request( 'POST' , ulrAjax , function( response ){ writeSearchModify( response, type ); } );

   }

   function writeSearchModify( data, type ) {
	  _mail_alert_box.setContent( data.responseText );
	  _mail_alert_box.addEventOnClose( function(){ __isTrovaImmobili = false; _mail_alert_box.manageConflicts = true; } );
	  popupAlertZoneSelected = new Array();
	  if ( document.getElementById( 'zoneTI_ids' ) ) {
		 var iDs = trim2( document.getElementById( 'zoneTI_ids' ).value, ',' );
		 popupAlertZoneSelected = iDs.split(",");
	  }


	  popupAlertZoneSelected = new Array();
	  if ( document.getElementById( 'zoneTI_ids' ) ) {
		 var iDs = trim2( document.getElementById( 'zoneTI_ids' ).value, ',' );
		 popupAlertZoneSelected = iDs.split(",");
	  }

	  if ( type == 1 ) {
		 modificaDatiAlertEmail( 2 );
	  } else {
		 modificaDatiAlertEmail( 4 );
		 document.getElementById("trova_immobili").isCheckRequest.value = 1;
	  }
	  _mail_alert_box.show();
	  _mail_alert_box.manageConflicts = false;
	  __isTrovaImmobili = true;
	  initAlertEmailArea();

	  /**
	   * nel caso in cui carico una ricerca salvata devo cancellare eventuali mappe aperte.
	   * boxPolygonSearch è definita in createGMapsIframe.js
	   */
	  if ( boxPolygonSearch || polygonMapLoadCompleted) {
		 polygonMapLoadCompleted = false;
		 if (typeof boxPolygonSearch.destroy === 'function')
			boxPolygonSearch.destroy();
		 boxPolygonSearch = null;
	  }

      var searchFormTI = new SearchFormTI();
      searchFormTI.init();
   }

   function showZoneSelectForm(){
	  var idProvincia = getIDProvincia();
	  if (!idProvincia)
		 return;

    if (__zone_showed){
         display_zone_confirm_button();
         return;
    }
    __zone_showed=true;
    var zoneSelect = document.getElementById( "ZoneSelectTI" );
   __TI_source = getTiSource();

	/**
	  '<input type="hidden" id="TI_servizio_1" name="ricevi" '+(__TI_servizio_1 ? 'value="on"' : '')+'>'+
	  '<input type="hidden" id="TI_servizio_2" name="invia" '+(__TI_servizio_2 ? 'value="on"' : '')+'>'+
	 **/

    var html =  '<input type="hidden" id="zoneTI_descrizione" name="zona_desc" readonly="readonly" />'+
                '<input type="hidden" id="TI_source" name="source" '+(__TI_source ? 'value="'+__TI_source+'"' : '')+'>'+
                '<div class="zone_title">'+
                '   <div class="zone_title_text">'+
                '       <strong style="font-size:14px;">Per fornirti un servizio migliore ti chiediamo di indicare le zone di tuo interesse</strong>'+
                '       <div id="tooltip_map" style="margin-left: 0px;">'+
                '       </div>'+
                '   </div>'+
                '</div>'+
                '<div>'+
                '    <div id="CartinaGrandeTI">'+
                '    </div>'+
                '    <div id="zoneSelectContainerTI" style="float:left"></div>'+
                '    <div class="clear"></div>'+
                '</div>';
    document.getElementById("TI_form_input_data").innerHTML = html;

    //_mail_alert_box.addEventOnClose(function(){TI_undoService(2)});
	_mail_alert_box.show();

	var zoneSelectCont = document.getElementById("zoneSelectContainerTI");
    zoneSelectCont.appendChild(zoneSelect);
	idComune = document.getElementById('TI_comune');
	xajax_getMapAjaxZonePagRicerca(idComune.value, idProvincia, "TI");

    var pathDiv = document.getElementById("tooltip_map");
	if ( idComune.tagName  == 'INPUT' ) {
		if (typeof TI_agComuneField != "undefined" && TI_agComuneField) {
			nomeComune = TI_agComuneField.getNome();
		} else {
			nomeComune = document.getElementById('nomeComune').value;
		}
	  var comune = createPathLink(nomeComune,function(){return false});
   } else {
	  var comune = createPathLink(idComune.options[idComune.selectedIndex].innerHTML,function(){return false});
   }

	pathDiv.appendChild(comune);
    zoneSelect.style.display = "block";

    addEvent(window,"unload",function(){zoneSelect = null})
	addEvent(window,"unload",function(){zoneSelectCont = null})
	addEvent(window,"unload",function(){pathDiv = null})

    _mail_alert_box.show();
    display_zone_confirm_button();
   }

   function display_zone_confirm_button(){
	  var prefix = !_isAlertEmail ? '_TI' : '';
      if (document.getElementById('TILoaderCont'+prefix))
        document.getElementById('TILoaderCont'+prefix).style.display = "none";
      if (document.getElementById('TI_btn_sub'+prefix)) {
         document.getElementById('TI_btn_sub'+prefix).style.display = "";
		 document.getElementById('TI_btn_sub'+prefix).onclick = function(){submitTIForm();this.blur();};
      }
   }

   function load_zone_confirm_button() {
	  var prefix = '';
	  if ( !_isAlertEmail ) {
		 prefix = '_TI';
		 //document.getElementById('noGrazieButton').style.display = "none";
	  }
      if (document.getElementById('TI_btn_sub'+prefix)) {
         document.getElementById('TI_btn_sub'+prefix).style.display = "none";
         document.getElementById('TI_btn_sub'+prefix).onclick = function(){};
      }
      if (document.getElementById('TILoaderCont'+prefix))
        document.getElementById('TILoaderCont'+prefix).style.display = "inline";
   }

   function setZoneSelected( siglaProv ){
      var sIds = document.getElementById("zoneTI_ids").value;
      var aZoneIds = sIds.split(",");
      for (i=0;i<aZoneIds.length;i++)
	  if (aZoneIds[i]!=""){
		 selectZona(siglaProv,aZoneIds[i],'TI');
		 swapZona(aZoneIds[i],"TI");
	  }
   }

   function TI_undoService(num){
        if (!num)
            return;
         if (!document.getElementById("trova_immobili"))
            return;
        if (num==1){
            __TI_servizio_1 = false;
            if (document.getElementById("trova_immobili").ricevi)
               document.getElementById("trova_immobili").ricevi.value=0;
        }
        else
        if (num==2){
            __TI_servizio_2 = false;
            if (document.getElementById("trova_immobili").invia)
               document.getElementById("trova_immobili").invia.value=0;
        }

      submitAjaxForm('trova_immobili',function(){});
      document.getElementById('form_trovaimmobili').innerHTML = create_success_box();
   }

    function showLoader(box){
        box.setContent("<div style=\"height:210px;text-align:center;\"><h3>Caricamento in corso...</h3><br /><span style=\"\"><img src=\"/img2/loader6.gif\"></span></div>");
    }


    function showMailAlertBottomBanner(){
        if (typeof __isTrovaImmobili!="undefined" && __isTrovaImmobili)
            return;
        MEslideUp("mail_alert_banner_bottom",5);
        var pushUpage = document.createElement("Div");
        pushUpage.id = "pushUpPage";
        document.body.appendChild(pushUpage);
        pushUpage.style.display = "block";
        pushUpage.style.backgroundImage="none";
        pushUpage.style.backgroundColor="#B8B8B8";
        pushUpage.style.position="relative";
        pushUpage.style.height="128px";
    }

    function hideMailAlertBottomBanner(clickedCloseButton){
        if (clickedCloseButton)
            saveCloseMaBannerCookie();
        if (document.getElementById('mail_alert_banner_bottom'))
            MEslideDown("mail_alert_banner_bottom",10);
        var pushUpPage = document.getElementById('pushUpPage') ? document.getElementById('pushUpPage') : null;
        if (pushUpPage)
            pushUpPage.parentNode.removeChild(pushUpPage);
    }

    function drawMailAlertBottomBanner(email,categoria,contratto){
        if (typeof email=="undefined")
            email="";
        if (typeof categoria=="undefined")
            categoria = null;
        if (typeof contratto=="undefined")
            contratto = 0;
        if (!getMaBannerCookie(categoria,contratto) || !categoria){
            saveMaBannerCookie(categoria,contratto);
            preloadImages(new Array("/img2/trova_immobili_banner_content_bkg.png","/img2/trova_immobili_banner_bkg.png"));
            document.write('<div class="mail_alert_box1" id="mail_alert_banner_bottom" style="display:none;">\
                     <input type="hidden" name="eventTrackName" value="mailAlertSearchBottomBanner" />\
                    <div class="mail_alert_box_bck" >\
                        <div class="mail_alert_banner_close" onclick="hideMailAlertBottomBanner(true)"></div>\
                        <div class="banner_content" id="ma_banner_content">\
                            <div class="mail_alert_email">\
                                <input type="text" name="email" '+(email ? 'value="'+email+'" disabled' : 'value="inserisci la tua email" startvalue="inserisci la tua email"')+' onclick="if (this.value==\'inserisci la tua email\') this.value=\'\'" onblur="this.value = this.value.trim();if (this.value==\'\') this.value=\'inserisci la tua email\'" />\
                            </div>\
                            <div class="bottoneAttMailAlertContainer">\
                                <input type="submit" class="bottoneAttivaServizio2" onclick="this.blur();" value=""/>\
                            </div>\
                            <div class="clear"></div>\
                        </div>\
                    </div>\
                </div>');
            if (typeof showMailAlertBottomBanner == "function")
                addEvent(window,"load",showMailAlertBottomBanner);
        }
    }

function saveMaBannerCookie(categoria,contratto){
	if (typeof categoria == "undefined"){
		_raiseError("called function with empty requested argument");
	}
	try{
		var sCookie = readCookie('maSearchBanner');
        if (typeof sCookie == "string" && sCookie=="closed"){
            return true;
        }
		var oCookie = new Object();
		if (sCookie){
			sCookie = Base64.decode(sCookie)
			oCookie = eval( "(" + sCookie + ")" );
		}
        if (!oCookie[categoria])
            oCookie[categoria] = new Array();
        oCookie[categoria][contratto] = 1;

        /* set COOKIE */
        /* ENCODED COOKIE */
		sCookie = Base64.encode(stringify(oCookie));
        createCookie("maSearchBanner",sCookie,90,0,0);

        /* ******** */

	}catch(e){
		deleteCookie("maSearchBanner");
		_raiseError(e);
	}
}


function saveCloseMaBannerCookie(){

	try{
		var sCookie = "closed";
        sCookie = Base64.encode(sCookie);
        createCookie("maSearchBanner",sCookie,90,0,0);

	}catch(e){
		deleteCookie("maSearchBanner");
		_raiseError(e);
	}
}


function getMaBannerCookie(categoria,contratto){
	oCookie = null;
	try{
		var sCookie = readCookie('maSearchBanner');
		var oCookie = null;
        var val = null;
		if (sCookie){
			sCookie = Base64.decode(sCookie);
            if (typeof sCookie == "string" && sCookie=="closed"){
                 return true;
            }
			oCookie = eval( "(" + sCookie + ")" );
		}
        if (oCookie){
            if (oCookie[categoria] && contratto){
                if(oCookie[categoria][contratto])
                    val = oCookie[categoria][contratto]
                else
                    val = null;
            }else
            if (!contratto)
                val = oCookie[categoria] ? oCookie[categoria] : null;
        }
	}catch(e){
		deleteCookie("maSearchBanner");
		_raiseError(e);
        return null;
	}
	return val;
}

function checkTrovaImmobiliForm(oForm){
        return true;
}

function sendSearchToAgency(email,nome,telefono,typeService){
   load_zone_confirm_button();
   appendCss("/includes/trova_immobili.css","mail_alert_css");
   _mail_alert_box = __selectedOvBox;
    //_mail_alert_box.fixedPosition = false;
    //showLoader(_mail_alert_box);

	if ( typeof typeService != 'undefined' && typeService == 'ricevi' ) {
		_mail_alert_box.setTitle("AlertEmail");
		__TI_servizio_1 = true;
		__TI_servizio_2 = false;
		document.getElementById( 'TI_servizio_2' ).value = '';
		document.getElementById( 'TI_servizio_1' ).value = 'on';
		var service_proposed = 1;
	} else {
		_mail_alert_box.setTitle("TrovaImmobili");
		__TI_servizio_1 = false;
		__TI_servizio_2 = true;
		document.getElementById( 'TI_servizio_2' ).value = 'on';
		document.getElementById( 'TI_servizio_1' ).value = '';
		var service_proposed = 2;
	}
    _mail_alert_box.show();


   document.getElementById('ti_utente_mail').value=email;
   document.getElementById('ti_utente_nome').value=nome;
   document.getElementById('ti_utente_telefono').value=telefono;
   document.getElementById('isCheckRequest').value='1';

   submitTIForm(function(data){
           document.getElementById('isCheckRequest').value=0;
           var xmlDoc = data.responseXML;
           var errors = xmlDoc.getElementsByTagName('errori');
           errorMessage = "";
            if (errors.length > 0){
                var errori = errors[0].childNodes;
                errorMessage = "<span class=\"TI_err_msg_icon TI_err_title\">Mancano le seguenti informazioni: </span>";
                for (var i=0;i<errori.length;i++){
					if ( errori[i].tagName == "erroreTentativi" ) {
						showErrorAttempts();
						document.body.style.cursor = 'default';
						return;
					} else {
					 errorMessage+="<span>"+errori[i].childNodes[0].nodeValue+"</span>";
					}
                    if (i!=errori.length-1)
                        errorMessage+=", ";
                }
                showErrMsg(errorMessage);
                display_zone_confirm_button();
            }else{
               _mail_alert_box.setContent(create_success_box(false,service_proposed ));
			   trackPage( '/trovakasa.php?type=mailAlert' );
                submitAjaxForm('trova_immobili',function(){});
            }
           _mail_alert_box.show();
   },true);
}

function showErrorAttempts() {
   var oAjax = new getMEAjaxObj();
   var ulrAjax = '/trovakasa.php?action=showErrorAttempts';
   oAjax.Request( 'POST' , ulrAjax , function( response){ _mail_alert_box.setContent( response.responseText );
	  _mail_alert_box.show();
	});
 }

function checkIfSaveSearch(isLogged,$page_md5){
	try{
		if (isLogged){
			var ricerca = readCookie("salvaRicerca");
			if (ricerca == $page_md5){
				startMailAlertProcess(document.getElementById('salva_ricerca_top_form'),1);
			}
		}
		deleteCookie("salvaRicerca");
	}catch(e){
		deleteCookie("salvaRicerca");
	}
}


var __iPopupMaxTimes = 3;

function checkAndShowTIPopop(canonicalUrl,tipoUtente,maxTimes){
   try{
      maxTimes = typeof maxTimes != "undefined" ? parseInt(maxTimes) : __iPopupMaxTimes;
      var  num_vis_pap_ti = 0;
      var url = "";
      var pap_ti_ck = readCookie( 'IM_PAP_TI');

      if ( pap_ti_ck) {
          pap_ti_ck = Base64.decode(pap_ti_ck);
          pap_ti_ck = eval("("+pap_ti_ck+")");
          var num_vis_pap_ti = pap_ti_ck["num"];
          url = pap_ti_ck["url"];
      }
	  if (num_vis_pap_ti < (maxTimes-1) && url != canonicalUrl ){
         num_vis_pap_ti++;
         addEvent( window, "load" , function() {
			if (__blockTIAutoPopup)
			   return;
			startMailAlertProcess( document.getElementById( 'salva_ricerca_top_form' ), tipoUtente );
			pap_ti_ck = new Object();
			pap_ti_ck.num = num_vis_pap_ti;
			pap_ti_ck.url = canonicalUrl;

			pap_ti_ck = Base64.encode(stringify(pap_ti_ck));
			pap_ti_ck = stringify(pap_ti_ck);

			createCookie( 'IM_PAP_TI', pap_ti_ck,7);
		 } );
	  }
   }catch(e){}
}

function updateContTIPopup(canonicalUrl, maxTimes){
	try{
		maxTimes = typeof maxTimes != "undefined" ? parseInt(maxTimes) : __iPopupMaxTimes;
		//aggiornamento cookie
		pap_ti_ck = new Object();
		pap_ti_ck.num = maxTimes;
		pap_ti_ck.url = canonicalUrl;
		pap_ti_ck = Base64.encode(stringify(pap_ti_ck));
		pap_ti_ck = stringify(pap_ti_ck);

		createCookie( 'IM_PAP_TI', pap_ti_ck,7);
	 }catch(e){}
}


function selectTabAlertEmail(idToggleElement) {
   jq("#alertEmailContainer .nav-tabs li").each( function() {
	  if ( jq(this).attr('data-toggle') == idToggleElement ) {
		 jq(this).addClass('active');
	  } else {
		 jq(this).removeClass('active');
	  }
   });
}
/* GESTIONE AREA POLIGONO */

function loadPreviewZone(onlyModificaLuogo) {
   onlyModificaLuogo = typeof onlyModificaLuogo == "undefined" ? false : onlyModificaLuogo;
   /* ANTEPRIMA ZONA COMUNE */
   if ( !document.getElementById( 'zoneTI_ids' ) ) {
	  return;
   }

   var iDs = trim2( document.getElementById( 'zoneTI_ids' ).value, ',' );
   var zoneSelected = iDs.split(",");

	if (isTIVacanze() && TI_agComuneField && TI_agComuneField.getRegione()) {
		var idRegione = TI_agComuneField.getRegione().idObject;
	} else if (typeof document.dati.idRegione != "undefined")
	  var idRegione = document.dati.idRegione.value;
   else if (typeof document.dati.regione != "undefined")
	  var idRegione = document.dati.regione.value;
	else
	  return;

   var idProvincia = getIDProvincia();
   if (!idProvincia)
	  return;

   if (onlyModificaLuogo) {
	  jq("#box_zone_TI").empty();
   } else {
	  jq("#prev_box_zone_TI").empty();
	  jq("#box_zone_TI").empty();
   }

   jq("#ZoneSelectTI input").each(function() {
	  for (var i = 0; i < zoneSelected.length; i++) {
		 if (zoneSelected[i] == jq(this).val()) {
			var src = '/img2/cartine/'+idRegione+'/'+idProvincia+'/map_zona_'+zoneSelected[i]+'.gif?v=2';
			if (onlyModificaLuogo) {
			   jq("#box_zone_TI").append("<img src='"+src+"' />");
			} else {
			   jq("#box_zone_TI").append("<img src='"+src+"' />");
			   jq("#prev_box_zone_TI").append("<img src='"+src+"' />");
			}

			break;
		 }
	  }
   });
}

function loadPreviewMapAlertEmail() {
   loadGoogleMapStaticImage("geografia");
   loadGoogleMapStaticImage("riepilogo")
}

function loadGoogleMapStaticImage(section, forceReload) {
   if (typeof forceReload == "undefined")
	  forceReload = false;

   var baseId = '#img_google_map_statics';

   if (section == "riepilogo") {
	  var idContainer = 'prev_overlay_opacity_map_TI';
	  var sufix = '_prev_TI';
   } else {
	  var idContainer = 'overlay_opacity_map_TI';
	  var sufix = '_TI';
   }

   baseId += sufix;
   if ( !forceReload && jq(baseId) && typeof jq(baseId).attr('src') != 'undefined' && jq(baseId).attr('src') != '' ) {
	  return true;
   }
   var jsonDrawedArea = jq("#gm_area_TI").val();
   if (jsonDrawedArea == '') {
	  return false;
   }

   var oArea = jQuery.parseJSON(jsonDrawedArea);
   var bDone = staticMapHP(document.getElementById(idContainer), oArea.mode, oArea.area, google_map_key, sufix, 150, 150);
   return bDone;
}

function initAlertEmailArea() {

	var suggestion = new Im_Suggestion("TI_username_ricerca",
		{
			selectRowOnOver       : false,
			hideOnMouseOut        : false,
			hideNoResultDiv		  : true,
			blockOnBlur			  : true,
			focusedElementOnSelect: null,
			activeTitle			  : true,
			titleNoClick		  : "Forse intendevi...",
			inOverlay		      : true,
			minChars              : 2,
			maxResults            : 4,
			url                   : "/services/checkMailDomain.php?soglia=1000",
			onselect              : function (selectedItem) {},
			onsearch              : function (qs) {
				return checkEmail(qs) ? true : false;
			},
			autoselectFirstItem   : false,
			getResultOnFocus      : true,
			resetQsFieldOnNotSel  : false
		}
	);

	// viene posizionato il focus sulla mail
   if (!jq("#TI_username_ricerca").attr('disabled')) {
	  jq("#TI_username_ricerca").focus();
   }

   jq(".ui-radio div").mouseenter( function() {
	  jq(this).removeClass('ui-btn-up-c');
	  jq(this).addClass('ui-btn-hover-c');
   }).mouseleave( function() {
	  jq(this).removeClass('ui-btn-hover-c');
	  jq(this).addClass('ui-btn-up-c');
   });

   jq('#alertEmailContainer .nav-tabs li a').click( function(){ jq(this).blur(); });

   jq('#modifica_zona_TI').click(function(event){
	  event.stopPropagation();
	  modificaDatiAlertEmail( 3 );
	  showZoneSelectForm();
   });

   if (document.getElementById('comune_lat')) {
	  var latitudine = document.getElementById('comune_lat').value;
	  var longitudine = document.getElementById('comune_lng').value;
	  initGoogleMapRicercaArea('alertemail', 3, {lat:latitudine, lng:longitudine, forceCenter:0, hideOnlyBox:1, mapSection:'alertemail'});
   } else {
	  initGoogleMapRicercaArea('alertemail', 3, {hideOnlyBox:1, mapSection:'alertemail'});
   }

   loadPreviewZone();
   loadPreviewMapAlertEmail();
   managePreviewImage('prev_');
   manageVacanze();

   var searchFormTI = new SearchFormTI();
   searchFormTI.init();
}

function isTIVacanze() {
	return (document.forms.trova_immobili && document.forms.trova_immobili.vacanze && document.forms.trova_immobili.vacanze.value) ||
		(typeof document.getElementById("TI_agComuneField") != "undefined" && document.getElementById("TI_agComuneField") != null);
}

var TI_agComuneField = null;
function manageVacanze() {
	if (!isTIVacanze()) {
		return;
	}

	if (!jq("#TI_agComuneField").length) {
		return;
	}

	var agOptions = {
		areaHiddenInput: jq("#TI_areaGeografica")[0],
		comuneHiddenInput: jq("#TI_comune")[0],
		suggestionOptions: { parentNode: jq("#TI_agComuneField").parent()[0],
							 inOverlay: true }		
	};

	TI_agComuneField = new AGComuneField ('TI_agComuneField', agOptions);
	TI_agComuneField.init();
	jq(TI_agComuneField).on('change', function () {
		resetInfoLuogoVacanze();
	});
}

function resetInfoLuogoVacanze() {
	var object = TI_agComuneField.getObject();
	if (object.type == "areaGeografica") {
		resetZone();
		jq('#modifica_zona_TI').hide();
		jq('#modifica_area_TI').hide();

		jq('#cittaConZona').val(0);

		jq('#cartina_comune').hide();
		jq('#cartina_comune_senza_zone').show();

		jq('#prev_cartina_comune').hide();
		jq('#prev_cartina_comune_senza_zone').show();

		jq('#textZonaBtn').html('Tutta la località');

		jq('#img_confini_comune').attr('src', TI_agComuneField.getUrlCartina());
	} else {
		resetInfoComune(object.idObject, object.provincia.idObject);
	}
	deselectAllText();
}

function resetInfoComune(idComune, idProvincia) {
   var isEnabledZone = document.getElementById('enabledZone').value == 1 ? true : false;
   var ricercaSuMappaAbilitata = document.getElementById('ricercaSuMappaAbilitata').value == 1 ? true : false;
   resetZone();
   if (ricercaSuMappaAbilitata)
	  xajax_getAjaxResetAreaMappa(idProvincia, idComune, 'alertemail');
   if (isEnabledZone) {
	  xajax_getMapAjaxZonePagRicerca(idComune, idProvincia);
	  xajax_getAjaxAsZoneTrovaImmobili(idComune, idProvincia);
   } else {
	  changeLocationImage(0, idComune);
   }
   jq('#modifica_zona_TI').hide();
   jq('#modifica_area_TI').hide();
}

function changeLocationImage(isCittaConZona, idComune) {
   if ( isCittaConZona ) {
	  loadPreviewZone();
	  jq('#cartina_comune').show();
	  jq('#cartina_comune_senza_zone').hide();

	  jq('#prev_cartina_comune').show();
	  jq('#prev_cartina_comune_senza_zone').hide();

	  jq('#textZonaBtn').html('Scegli la zona');
   } else {
	  // Carico la cartina con i confini del comune.
	  if( !isEstero() )
		xajax_getAjaxComuneImage('img_confini_comune', idComune);

	  jq('#cartina_comune').hide();
	  jq('#cartina_comune_senza_zone').show();

	  jq('#prev_cartina_comune').hide();
	  jq('#prev_cartina_comune_senza_zone').show();

	  jq('#textZonaBtn').html('Tutta la citt&agrave;');
   }

   forceTypeSearch('zona', '_TI');

   jq('#zone_cartina_TI').show();
   jq('#prev_zone_cartina_TI').show();

   jq('#overlay_opacity_map_TI').hide().html('');
   jq('#prev_overlay_opacity_map_TI').hide().html('');

   jq('#textAreaBtn').html('Disegna su mappa');
   jq('#gm_area_TI' ).val('');
   jq('#tipoRicerca_TI' ).val('');
}

function trimText(s) {
   s.trim();
   s = s.replace(/(<([^>]+)>)/ig,"");
   s = s.replace(/[\t\s\n]+/ig," ");
   s = s.trim();

   return s;
}

function managePreviewImage(prefix) {
   if ( typeof prefix == "undefined")
	  prefix = '';

   var tipoRicerca = jq('#tipoRicerca_TI').val();

   if (tipoRicerca == 'mappa') {
	  jq("#"+prefix+"zone_cartina_TI").hide();
	  jq("#"+prefix+"overlay_opacity_map_TI").show();
   } else {
	  jq("#tipoRicerca_TI").val('');
	  jq("#"+prefix+"zone_cartina_TI").show();
	  jq("#"+prefix+"overlay_opacity_map_TI").hide();
   }
}

function getIDProvincia() {
   var idProvincia = null;
	if (isTIVacanze() && TI_agComuneField && TI_agComuneField.getProvincia()) {
		idProvincia = TI_agComuneField.getProvincia().idObject;
	} else if (typeof document.form_alert_email != "undefined" && typeof document.form_alert_email.provincia != "undefined") {
	  idProvincia = document.form_alert_email.provincia.value;
   } else if (typeof document.dati.idProvincia != "undefined") {
	  idProvincia = document.dati.idProvincia.value;
   }

   return idProvincia;
}

var SearchFormTI = function(){
	this.speedSlide = 'fast';
}

SearchFormTI.prototype.init = function(){
	
	var self = this;

	this.categoria = jq('#categoria_TI');
	
	if (this.categoria.val() == 4){
		this.categoriaStanza = jq('#selCategoriaStanzaTI');
		this.tipologiaStanza = jq('#divTipologiaStanzaTI');
		this.categoriaStanza.change(function(){
			self.onCategoriaStanzaChange();
		});
		self.onCategoriaStanzaChange();
	} else {
		this.tipologia = jq('#tipologia');
		this.tipologia.change(function(){
			self.onTipologiaChange();
		});
		self.onTipologiaChange();
	}
}

SearchFormTI.prototype.onTipologiaChange = function(){
		
	var tipologiaVal = this.tipologia.val();
	var tipologiaValCustom = new Array('6', '7', '11', '12', '13');

	var tipologiaFieldsDefault = {
		divAscensoreTI:{actions:['showDiv']},
		divGiardinoTI:{actions:['showDiv']},
		divLocaliTI:{actions:['showDiv']},
		divRiscaldamentoTI:{actions:['showDiv']},
		divBoxAutoTI:{actions:['showDiv']},
		divArredatoTI:{actions:['showDiv']},
		divTerrazzoTI:{actions:['showDiv']},
		divBalconeTI:{actions:['showDiv']}
	}

	var tipologiaFields = {
		'6': jq.extend({}, tipologiaFieldsDefault, {
				ascensoreTI:{actions:['resetCheckbox']},
				divAscensoreTI:{actions:['hideDiv']},
				giardinoTI:{actions:['resetSelect']},
				divGiardinoTI:{actions:['hideDiv']},
				locMin:{actions:['resetField']},
				locMax:{actions:['resetField']},
				divLocaliTI:{actions:['hideDiv']},
				riscaldamento:{actions:['resetSelect']},
				divRiscaldamentoTI:{actions:['hideDiv']},
				boxautoTI:{actions:['resetSelect']},
				divBoxAutoTI:{actions:['hideDiv']},
				arredatoTI:{actions:['resetCheckbox']},
				divArredatoTI:{actions:['hideDiv']},
				terrazzoTI:{actions:['resetCheckbox']},
				divTerrazzoTI:{actions:['hideDiv']},
				balconeTI:{actions:['resetCheckbox']},
				divBalconeTI:{actions:['hideDiv']}
			}),
		'7': jq.extend({}, tipologiaFieldsDefault, {
				ascensoreTI:{actions:['resetCheckbox']},
				divAscensoreTI:{actions:['hideDiv']}
			}),
		'11': jq.extend({}, tipologiaFieldsDefault, {
				ascensoreTI:{actions:['resetCheckbox']},
				divAscensoreTI:{actions:['hideDiv']}
			}),
		'12': jq.extend({}, tipologiaFieldsDefault, {
				ascensoreTI:{actions:['resetCheckbox']},
				divAscensoreTI:{actions:['hideDiv']}
			}),
		'13': jq.extend({}, tipologiaFieldsDefault, {
				ascensoreTI:{actions:['resetCheckbox']},
				divAscensoreTI:{actions:['hideDiv']}
			})
	}

	if (tipologiaVal && (jq.inArray(tipologiaVal, tipologiaValCustom) > -1)){
		var fields = tipologiaFields[tipologiaVal];
	} else {
		var fields = tipologiaFieldsDefault;
	}

	for (var field in fields){
		var actions = fields[field]['actions'];
		for (var action in actions){
			this[actions[action]](field);
		}
	}
}


SearchFormTI.prototype.onCategoriaStanzaChange = function(){
	
	var categoriaStanzaVal = this.categoriaStanza.val();
	var categoriaStanzaValCustom = new Array('1', '2');

	var categoriaStanzaFieldsDefault = {}

	var categoriaStanzaFields = {
		'2': jq.extend({}, categoriaStanzaFieldsDefault, {
				divTipologiaStanzaTI:{actions:['showDiv']}
			}),
		'1': jq.extend({}, categoriaStanzaFieldsDefault, {
				selTipologiaStanzaTI:{actions:['resetSelect']},
				divTipologiaStanzaTI:{actions:['hideDiv']}
			})
	}

	if (categoriaStanzaVal && (jq.inArray(categoriaStanzaVal, categoriaStanzaValCustom) > -1)){
		var fields = categoriaStanzaFields[categoriaStanzaVal];
	} else {
		var fields = categoriaStanzaFieldsDefault;
	}

	for (var field in fields){
		var actions = fields[field]['actions'];
		for (var action in actions){
			this[actions[action]](field);
		}
	}
}

SearchFormTI.prototype.showDiv = function(id){
	var div = jq('#'+id);
	if (div.is(':visible') == false){
		div.show();
	}
}
	
SearchFormTI.prototype.hideDiv = function(id){
	var div = jq('#'+id);
	if (div.is(':visible') == true){
		div.hide();
	}
}
	
SearchFormTI.prototype.resetField = function(id){
	var field = jq('#'+id);
	field.val('');
}
	
SearchFormTI.prototype.resetSelect = function(id){
	var select = jq('#'+id);
	select.find('option:first').attr('selected','selected');
}

SearchFormTI.prototype.resetCheckbox = function(id){
	var checkbox = jq('#'+id);
	checkbox.attr('checked', false);
}
