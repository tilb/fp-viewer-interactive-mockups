var __selectedOvBox; //variabile globale che tiene traccia del box aperto attualmente

function create_salvaBox(idAnnuncio){
    __selectedOvBox = new boxOverlay('salvaAnnuncioBox_'+idAnnuncio,'grey');
    var salvaAnnuncioUrl = "/bookmarkannunci.php?action=add&amp;id="+idAnnuncio;
    var loginOptions = {loginType : "U"}
    __selectedOvBox = create_accediBox("U", loginOptions);
    createCookie("salvaAnnuncio",idAnnuncio);
    __selectedOvBox.show();
	return __selectedOvBox;
}

function salvaAnnuncio(idAnnuncio){
	
	__blockTIAutoPopup = true;
	salvaAnnuncio_boxes[idAnnuncio].box.show();
	__selectedOvBox = salvaAnnuncio_boxes[idAnnuncio].box;
	selectedSA = salvaAnnuncio_boxes[idAnnuncio];
	return false;
}

function confirmAnnuncioSalvato(aId){
	
	if (document.getElementById("salva_"+aId))
		document.getElementById("salva_"+aId).className = "link_salvato";
	
	if (document.getElementById("vetrina_salva_"+aId))
		document.getElementById("vetrina_salva_"+aId).className = "link_salvato";
	
	if (document.getElementById("map_save_icon_"+aId))
		document.getElementById("map_save_icon_"+aId).src = "/img2/icone/icona-check.png";
}


function create_inviaBox(idAnnuncio,type){
	__blockTIAutoPopup = true;
    document.body.style.cursor = "wait";	
    var inviaAmicoBox = new boxOverlay('inviaAmicoBox_'+idAnnuncio,'grey');
    inviaAmicoBox.setTitle("<strong>Invia questo annuncio ad un amico/a</strong>");
    inviaAmicoBox.stop_event_bubbling = true;
    
    
    var ajaxObj = getMEAjaxObj();
    var url;
		if (type=="progetto"){
				url = "/invia_amico_nc.php?getForm=1&id="+idAnnuncio;
		} else {
			url = "/invia_amico.php?getForm=1&id="+idAnnuncio;
		}


    ajaxObj.Request("POST", url, function(data){
                                   inviaAmicoBox.setContent(data.responseText);
                                   inviaAmicoBoxContent = inviaAmicoBox.getContent();
                                    
												document.body.style.cursor = "default";
												inviaAmicoBox.show();
                                                });
		return inviaAmicoBox;
}

function createInviaBoxRicerca(urlRicerca,page) {
	__blockTIAutoPopup = true;
	if(urlRicerca != null && urlRicerca.length > 0) {
		urlRicerca = Url.encode(urlRicerca);
		var url = "/invia_ricerca_amico.php?getForm=1&url="+urlRicerca+"&page="+page;
		document.body.style.cursor = "wait";		
		
		var inviaRicercaAmicoBox = new boxOverlay('inviaAmicoBox_ricerca','grey');
		inviaRicercaAmicoBox.stop_event_bubbling = true;
		
		var ajaxObj = getMEAjaxObj();
        
        if( page == "home")
            var title = '<div>Segnala Immobiliare.it</div>';
        else if( page == "ricerca" || page == "risultati")
            var title = 'Invia questa ricerca ad un amico/a';
        
		ajaxObj.Request("POST", url, function(data){
								   inviaRicercaAmicoBox.setTitle(title);
                                   inviaRicercaAmicoBox.setContent(data.responseText);
                                   inviaRicercaAmicoBoxContent = inviaRicercaAmicoBox.getContent();
                                    
												document.body.style.cursor = "default";
												inviaRicercaAmicoBox.show();
                                                });
		return inviaRicercaAmicoBox;
	}
	return false;
}

function create_segnalaErroreBox(idAnnuncio,type){
    document.body.style.cursor = "wait";	
    var segnalaErroreBox = new boxOverlay('segnalaErroreBox_'+idAnnuncio,'grey');
    segnalaErroreBox.setTitle("<div><strong>Segnala un errore in questo annuncio</strong></div>");
    
    var ajaxObj = getMEAjaxObj();
		var url;		
		if (type=="progetto"){
				 url = "/segnala_errore.php?getForm=1&idProgetto="+idAnnuncio;
		}else
				url = "/segnala_errore.php?getForm=1&idAnnuncio="+idAnnuncio;

    ajaxObj.Request("POST", url, function(data){
	segnalaErroreBox.setContent(data.responseText);
	segnalaErroreBoxContent = segnalaErroreBox.getContent();

	document.body.style.cursor = "default";	                                                
	segnalaErroreBox.show();
	});

    return segnalaErroreBox;
}
function show_IkeaBox(title,content){
	if (typeof IkeaBox=="undefined"){
		 	document.body.style.cursor = "wait";	
    		IkeaBox = new boxOverlay('ikeaBox','grey');
    		IkeaBox.setTitle("<strong>Metti su casa con IKEA</strong>");
    		var ajaxObj = getMEAjaxObj();
			var url;		
			url = "ikea_box.php";
    		ajaxObj.Request("POST", url, function(data){
         	IkeaBox.setContent(data.responseText);
				document.body.style.cursor = "default";	                                                
				IkeaBox.show();
			});
	}
	else
		IkeaBox.show();
	
}

function create_contattaBox(idAnnuncio,idAgenzia,nomeAgenzia){
	idBox = idAnnuncio ? idAnnuncio : idAgenzia;
	var __selectedOvBox = new boxOverlay('contatta_'+idBox,'grey');
	//__selectedOvBox.fixedPosition = false;
	if (idAgenzia) {
		if(nomeAgenzia) 
			nomeAgenzia = '"'+nomeAgenzia+'"';
		else
			nomeAgenzia = "";
		__selectedOvBox.setTitle('<strong>Contatta l\'agenzia '+nomeAgenzia+'</strong>');
	} else
		__selectedOvBox.setTitle("<strong>Contatta l'inserzionista</strong>");
    __selectedOvBox.setContent("<div style=\"height:210px;text-align:center;\"><h3>Caricamento in corso...</h3><br /><span style=\"\"><img src=\"/img2/loader6.gif\"></span></div>");
    return __selectedOvBox;
}

function show_contattaBox(idAnnuncio,idAgenzia,nomeAgenzia,isNC){
	_disableAlertPopUp = true;
	__blockTIAutoPopup = true;
	
	document.body.style.cursor = "wait";
	__selectedOvBox = new Object();	
	__selectedOvBox = create_contattaBox(idAnnuncio,idAgenzia,nomeAgenzia);
	__selectedOvBox.setContent("<div style=\"height:210px;text-align:center;\"><h3>Caricamento in corso...</h3><br /><span style=\"\"><img src=\"/img2/loader6.gif\"></span></div>");
	__selectedOvBox.show();

	var source = _mailSection;
	var tabActivated = jq('#risultati_ricerca').find('.tab_selector.act');
	if (typeof tabActivated != 'undefined') {
		switch (tabActivated.attr('id')) {
			case 'tab_btn_listaAnnunci':
				source = 'lista_annunci';
				break;
			case 'tab_btn_mapContainer':
				source = 'dettaglio_annuncio_mappa';
				break;
			case 'tab_btn_fgAnnunci':
				source = 'lista_annunci_fg';
				break;
		}
	}

	//parametri chiamata POST
	var params = {};
	params["getForm"] = 1;
	params["source"] = source;

	if (idAnnuncio)
		params["id"] = idAnnuncio;
	var url;
	
	if (idAgenzia) {
		if (!isNC)
			url = "/contatta_agenzia.php";
		else
			url = "/invia_email_nc.php";
		params["idAgenzia"] = idAgenzia;
	} else {
		url = "/contatta_utente.php";
		params["idAnnuncio"] = idAnnuncio;
	}
	
	jq.post(url, 
			params,
			function(data){
				__selectedOvBox.setContent(data);
				setContattaBoxEvent();
				document.body.style.cursor = "default";	
				_disableAlertPopUp = false;

                if (readCookie("cntct_prvcy_disc"))
                    jq("#privacy").attr("checked","checked")
			});	
}


function submitBoxForm(idForm){
	document.body.style.cursor = "wait";
	var position = idForm.search('contatto_');
	__selectedOvBox.show();
	var idBox;
	//prendo il form
	var form = document.getElementById(idForm);

	jq("input,textarea" , "#"+idForm).each(function() {
        if (jq(this).attr('placeholder') != '' && jq(this).val() == jq(this).attr('placeholder')) {
            jq(this).val('').removeClass('placeHolder').addClass('textInput');
        }
    });

	//mostro la rotellina per la chiamata
	jq("#ajax_contatta").show();
	//faccio una chiamata POST aspettandomi un JSON
	jq.post(form.action, 
				jq("#"+idForm).serialize(), 
				function(data){ 
					//è un JSON mostro gli errori
					showErrorContatta(data, "contact_box_", true);
					//setto il titolo
					__selectedOvBox.setTitle("Errore nei dati");
				}, 
				"json")
				//non è un JSON, mostro il messaggio HTML
				.error(function(data){
					__selectedOvBox.setContent(data.responseText);
					if(document.getElementById('sendOk'))
					    __selectedOvBox.setTitle("Messaggio inviato con successo");
					else
					    __selectedOvBox.setTitle("Errore nei dati");
				})
				//eseguo ultime funzioni a fine chiamata
				.complete(function(data){
					document.body.style.cursor = "default";
					retrieveTrackPage(data.responseText);
				});

	addPlaceHolderCompatibility();	
	function retrieveTrackPage(page){
		var fileName;
		var myRegExp = /%%SUCCESS%%/;
		var re = new RegExp(myRegExp);
		var m = re.exec(page);
		if (m != null) {
			var pageToTrack = /%%FILE:(.*)%%/;
			re = new RegExp(pageToTrack);
			m = re.exec(page);
			
			if (m != null){
					fileName = m[1];
					if (fileName){
							trackPage(fileName);
					}
			}
			/* Questo snippet traccia le conversione AdWords->Contatti Specifici
				Può essere anche effettuato via html tramite una img nella pagina inviaContattoResponse
				Se si vuole utilizzare il tracciamento via javascript bisogna eliminare la img dal file sopra citato per non rischiare
				di	avere duplicati e viceversa (Usare in maniera esclusiva i due tipi di tracciamento)
			*/
			var contactType = /%%Tipo:(.*)%%/;
			re = new RegExp(contactType);
			m = re.exec(page);
			if (m != null && m[1]=="S"){
				RegisterAdWordsConversion();
			}
		}
	}
}

/**
 * Valida il campo ed in caso mostra l'errore
 * @param (string) type --> tipo del campo @example telefono, email, ...
 * @param (HTML Element) input ---> Elemento html dell'input da validare
 * @param (string) id ---> id del campo da stilizzare
 */
function checkField(type, input, id){
	//salta il controllo sull'espressione regolare
	var skipRegExp = false;
	//in base al tipo scelgo il controllo da fare
		switch (type) {
		case "telefono":
			var filter = /^(\+)?[\s\d()\-\/.]+$/;
			break;
		case "email": 
			var filter = /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/;
			break;
		case "privacy": 
			if (jq('#'+input.id).attr("checked"))
				skipRegExp = true;
			break;
		case "nome":
			if(jq('#'+input.id).val()!="")

				skipRegExp = true;
			break;
		default:
			skipRegExp = true;		
	}
	
	//controllo se valido
	if(input.value=="" || input.value=="jq('#'+id).attr('placeholder')"){
		jq("#"+id+" .iconControl").hide().attr("src");
	}
	else if (skipRegExp || (input.value && filter && filter.test(input.value))) {
		jq("#"+id).removeClass("field_error");	//elimino la classe d'errore
		//se presente mostro l'iconcina di successo nell'input
		if (jq("#"+id+" .iconControl"))
			jq("#"+id+" .iconControl").show().attr("src", "/img2/flag.png");
	} else {
		//se presente mostro l'iconcina di errore nell'input
		if (jq("#"+id+" .iconControl") )
			jq("#"+id+" .iconControl").show().attr("src", "/img2/errore.gif");
	}
	
	//se non ci sono errori nascondo il box di errore
	if(jq("#contatta_agenzia_box .field_error").length <= 0)
		jq("#showError").slideUp();
}

/**
 * Controlla che tra uno tra mail e telefono sia compilato
 * @param (HTML Element) input ---> Elemento html dell'input da validare
 * @param (string) id ---> id dell'altro campo da controllare
 */
function checkPhoneOrEmail(input, id){
	//se uno dei due ha la classe d'errore e l'altro no li ritengo entrambi validi
	if (!jq("#contact_box_"+input.id).hasClass("field_error") && jq("#"+id).hasClass("field_error")) {
		jq("#"+id).removeClass("field_error");	
		jq("#"+id+" .iconControl").hide();
		
		//se non ci sono errori nascondo il box di errore
		if(jq("#contatta_agenzia_box .field_error").length <= 0)
			jq("#showError").slideUp();
	}
}
/**
 * Funzione che assegna lo stesse funzioni per ogni input del form nel caso di "onchange" e "onkeyup"
 */
function setContattaBoxEvent(){
		 addPlaceHolderCompatibility();
	//prendo tutti gli elementi di input e li scorro
	jq(".field-box input").each(function() {
		
		//assegno all'onchange all'onkeyup la seguente funzione
		jq(this).bind("keyup", function() {
			htmlElem = jq(this).get(0);	//prende l'elemento HTML dall'object JQuery
			//controlla il campo
			checkField(htmlElem.id, htmlElem, 'contact_box_'+htmlElem.id);
			//se telefono | email controlla se uno dei due è compilato
			if (htmlElem.id == "telefono")
				checkPhoneOrEmail(htmlElem, 'contact_box_email');
			else if (htmlElem.id == "email")
				checkPhoneOrEmail(htmlElem, 'contact_box_telefono');
		})
	})

}

function trackCustomVars(pageCustomVars){
	
	if (typeof pageCustomVars != "object")
		pageCustomVars = {};
		
	if (typeof _gaq != "undefined"){
		for (var cVar=0 ; cVar < pageCustomVars.length; cVar++){
			if (typeof pageCustomVars[cVar]=="object" && pageCustomVars[cVar].name && pageCustomVars[cVar].value && pageCustomVars[cVar].deep &&  pageCustomVars[cVar].level){
				var value = trim(pageCustomVars[cVar].value);
				var name = trim(pageCustomVars[cVar].name);
				_gaq.push(['_setCustomVar',
					pageCustomVars[cVar].deep,	// Profondità CVar (livallo categorizzazione)
					pageCustomVars[cVar].name,	// Nome variabile custom
					value,	// Valore custom var
					pageCustomVars[cVar].level	//Livello Variabile (1-Sessione, 2-utente, 3 - pagina)
				]);
				if (typeof __debugging_doLog!="undefined" && __debugging_doLog)
					_doLog("_gaq_push(['"+pageCustomVars[cVar].deep+"','"+name+"','"+value+"','"+pageCustomVars[cVar].level+"']);");

				if (typeof ga != "undefined"){
					ga('set',name, value);
					if (typeof __debugging_doLog!="undefined" && __debugging_doLog)
						_doLog("_gaq_push('"+name+"','"+value+"');");
				}
			}	
		}
	}
}

function trackClickEvent(type,cat){

	if (typeof type == "undefined")
		return false;
	
	if (typeof cat != "undefined")
		cat = trim(cat.ucwords().replace(/\s+/g,""));
	else
		cat = "";
	
	if (typeof _gaq == "undefined")
		return false;

	var category = null;
	var action = null;
	var opt_label = null;
	
	//type = [mappa, tabella, fotogallery, nuove_costruzioni, ]
	category = "ricercaAnnunciEvents";
	
	switch (type){
		
		case "visualizzazione_vetrina_ricerca":
			action = 'vetrina_ricerca';
			opt_label = 'visualizzazione_vetrina_ricerca';
			break;
			
		case "dettaglio_vetrina_ricerca":
			action = 'vetrina_ricerca';
			opt_label = 'dettaglio_annuncio_vetrina_ricerca';
			break;
	
		case "lista":
			action = 'tab_lista';
			opt_label = 'apertura-'+cat;
			break;
			
		case "dettaglio_annuncio_lista":
			action = 'tab_lista';
			opt_label = 'dettaglio_annuncio-'+cat;
			break;
			
		case "mappa":
			action = 'tab_mappa';
			opt_label = 'apertura-'+cat;
			break;
			
		case "click_annuncio_mappa":
			
			action = 'tab_mappa';
			opt_label = 'click_annuncio-'+cat;
			break;
			
		case "dettaglio_annuncio_mappa":
		
			action = 'tab_mappa';
			opt_label = 'dettaglio_annuncio-'+cat;
			break;
			
		case "tabella":
		
			action = 'tab_tabella';
			opt_label = 'apertura-'+cat;
			break;
			
		case "dettaglio_annuncio_tabella":
		
			action = 'tab_tabella';
			opt_label = 'dettaglio_annuncio-'+cat;	
			break;
			
		case "fotogallery":
		
			action = 'tab_fotogallery';
			opt_label = 'apertura-'+cat;
			break;
			
		case "dettaglio_annuncio_fotogallery":
		
			action = 'tab_fotogallery';
			opt_label = 'dettaglio_annuncio-'+cat;
			break;
			
		case "nuove_costruzioni":
		
			action = 'tab_nuove_costruzioni';
			opt_label = 'apertura-'+cat;
			break;
			
	}
	
	if (category!=null && action && opt_label){
	
		_gaq.push(['_trackEvent', category, action, opt_label]);
		if (typeof __debugging_doLog!="undefined" && __debugging_doLog)
			_doLog("_gaq.push(['_trackEvent','"+category+"','"+ action+ "','"+opt_label+"']);");

		if (typeof ga != "undefined"){
			ga('send', 'event', category, action, opt_label);
			if (typeof __debugging_doLog!="undefined" && __debugging_doLog)
				_doLog("ga('send','event','"+category+"','"+ action+ "','"+opt_label+"');");

		}
	}
	
	return true;
	
}

function trackViewedAdEvent(label){

	//tracciamento versioning algoritmo di generazione ancore, title, url (AUT)
	
	if (typeof label=="undefined" || !label)
		return false;
	
	if (typeof _gaq == "undefined")
		return false;
		
	category = "dettaglioAnnuncioEvents";
	action = 'AUT'; //acronimo per Ancora Url Title
	opt_label = label; //csv dei corrispondenti valori di versione
	
	_gaq.push(['_trackEvent', category, action, opt_label]);
	if (typeof __debugging_doLog!="undefined" && __debugging_doLog)
		_doLog("_gaq.push(['_trackEvent','"+category+"','"+ action+ "','"+opt_label+"']);");

	if (typeof ga != "undefined"){
		ga('send', 'event', category, action, opt_label);
		if (typeof __debugging_doLog!="undefined" && __debugging_doLog)
			_doLog("ga('send,'event','"+category+"','"+ action+ "','"+opt_label+"');");

	}

	return true;
	
}

function RegisterAdWordsConversion(){
	var img = document.createElement("img");
	img.style.width="1px";
	img.style.height="1px";
	img.style.border="none";
	img.src="http://www.googleadservices.com/pagead/conversion/1066595945/?label=-I_RCLPR7wEQ6ezL_AM&amp;guid=ON&amp;script=0";
	document.body.appendChild(img);
}
		

function fnScrollThumbsDown(iNumImg,iMaxImg) {
	for(var i=9;i<=iNumImg;i++)
		document.getElementById('thumb_'+(i-iMaxImg)).style.display="none";
	for(var i=9;i<=iNumImg;i++)
		document.getElementById('thumb_'+i).style.display="block";
	document.getElementById('vetrina_thumbs_down').style.visibility="hidden";
	document.getElementById('vetrina_thumbs_up').style.visibility="visible";
}

function fnScrollThumbsUp(iNumImg,iMaxImg) {
	for(var i=9;i<=iNumImg;i++)
		document.getElementById('thumb_'+i).style.display="none";
	for(var i=9;i<=iNumImg;i++)
		document.getElementById('thumb_'+(i-iMaxImg)).style.display="block";
	document.getElementById('vetrina_thumbs_down').style.visibility="visible";
	document.getElementById('vetrina_thumbs_up').style.visibility="hidden";
}

function showThumb(idOImg,imgUrl){

	var oImg = document.getElementById(idOImg);
	if (typeof idOImg == "undefined" || !oImg || typeof imgUrl == "undefined" || !oImg)
		return;
	oImg.originalSrc = oImg.src;
	oImg.src = "/img2/loader7.gif";
	oImg.src = imgUrl;
	
	addEvent(this,"mouseout",function(){
			oImg.src = oImg.originalSrc;
		
	})
}

function toggleFilter(idFilterBtn,idFilterDiv){
	var oDiv = document.getElementById(idFilterDiv);
	var oBtn = document.getElementById(idFilterBtn);
	if (oDiv.style.display == "none"){
		oDiv.style.display = "block";
		oBtn.innerHTML = "nascondi";
		oBtn.style.backgroundImage = "url(/img2/freccetta_down.png)";
	}else{
		oBtn.innerHTML = "mostra";
		oDiv.style.display = "none";
		oBtn.style.backgroundImage = "url(/img2/freccetta.png)";
	}

}    

function showPhotoplus(id,tipo,refObj){
	
	if (typeof __activeFotoplusId != "undefined"){
		
		oFpFactory.getPhotoPlus(__activeFotoplusId).hide(); 
	}
	if (typeof oFpFactory == "undefined"){
		oFpFactory = new MEPhotoPlusFactory();
	}
	pars = "idAnnuncio="+id+"&tipo="+tipo;
	oFpFactory.getPhotoPlus(id).setUrlPars(pars);
	
	if (typeof refObj!="undefined")
		oFpFactory.getPhotoPlus(id).objRefLeft = refObj;
	
	oFpFactory.getPhotoPlus(id).show();
	__activeFotoplusId = id;
	
}

function hidePhotoplus(id){
	if (typeof oFpFactory!="undefined" && oFpFactory.getPhotoPlus(id))
		oFpFactory.getPhotoPlus(id).hide(true); 
} 

//aggiunto page_section per la vetrina ricerca, ci potrebbe essere un annuncio che è presente in pagina nella lista e nella vetrina con lo stesso id
function toggle_remaining_desc(id,page_section){
	var section = (typeof page_section == "undefined") ? '' : page_section+"_";
	var desc = document.getElementById(section+"descrizione_"+id);
	var toggler = document.getElementById(section+"toggle_descrizione_"+id);
	var toggler_img = document.getElementById(section+"toggle_descrizione_img_"+id);
	var toggler_testo = document.getElementById(section+"toggle_link_testo_"+id);
	var reduceText = "riduci";
	var readMoreText = "continua a leggere";
	var lang = getPageLang();

	if (lang){
		var reduceTextTranslate = {"it": "riduci", "en": "reduce", "es": "reducir", "fr": "réduire", "de": "reduzieren", "pt": "reduzir", "gr": "μείωση", "ru": "уменьшить"};
		var reduceText = reduceTextTranslate[lang] ? reduceTextTranslate[lang] : "riduci";

		var readMoreTextTranslate = {"it": "continua a leggere", "en": "read more", "es": "leer más", "fr": "en savoir plus", "de": "mehr lesen", "pt": "leia mais", "gr": "διαβάστε περισσότερα", "ru": "читать далее"};
		var readMoreText = readMoreTextTranslate[lang] ? readMoreTextTranslate[lang] : "continua a leggere";
	}
	
	if (desc.open){
		desc.open = false;
		desc.style.height = desc.origHeight + "px";
		if (toggler_img){
			toggler_img.src = "/img2/icone/plus.png";
			toggler_img.alt="[+]";
			toggler_img.title="leggi di più";
		}else{
			toggler.innerHTML = "(continua a leggere)";
		}
		if(toggler_testo)
		    toggler_testo.innerHTML = readMoreText;
		
	}else{
		desc.open = true;
		desc.style.height = "";
		if (toggler_img){
			toggler_img.src = "/img2/icone/minus.png";
			toggler_img.alt="[-]";
			toggler_img.title="leggi di meno";
		}else{
			toggler.innerHTML = "(riduci)";
		}
		if(toggler_testo)
		    toggler_testo.innerHTML = reduceText;
	}
	
}

function getPageLang(){
	if (document.getElementsByTagName('html')[0].getAttribute('lang')){
		return document.getElementsByTagName('html')[0].getAttribute('lang');
	}
}

//aggiunto page_section per la vetrina ricerca, ci potrebbe essere un annuncio che è presente in pagina nella lista e nella vetrina con lo stesso id
function setDescProps(id,height,page_section){
    var section = (typeof page_section == "undefined") ? '' : page_section+"_";
    var desc = document.getElementById(section+"descrizione_"+id);
    var toggler = document.getElementById(section+"toggle_descrizione_"+id);
    var txtHeight = 0;
    
    if (!desc.textHeight){
	desc.style.height = height;
	desc.style.overflow= "hidden";
	var txt = desc.innerHTML;
	var oDiv = document.createElement('div');
	oDiv.innerHTML = txt;
	oDiv.style.display="none";
	desc.appendChild(oDiv);
	txtHeight = MEgetHeight(oDiv);
	desc.removeChild(oDiv);
	desc.textHeight = txtHeight;
    
    
	if (!desc.origHeight)
	    desc.origHeight = MEgetHeight(desc);
    
	if (txtHeight > desc.origHeight){
	    toggler.style.display = "inline";
	}else
	    desc.style.height = "";
    }
    
}


function bookmarkAnnuncio(idAnnuncio, isLogged, section, doFbAction ){
	
	if (typeof section == "undefined" || !section)
		section = 'ricerca';
	
	if ( typeof doFbAction == "undefined" )
		doFbAction = true;
	
	if( typeof __userLogged__ == 'undefined' )
		__userLogged__ = false;
	
	var userLogged = typeof isLogged != "undefined" &&  isLogged != null ? isLogged : __userLogged__;
	
	if ( userLogged ){
		fnSalvaAnnuncioAjax('bookmarkannunci.php','add', idAnnuncio, userLogged, section, doFbAction);
	} else {
		create_salvaBox(idAnnuncio);
	}
}


/*gestore ajax per salva annuncio*/
/*invio richiesta*/
function fnSalvaAnnuncioAjax( sUrlPage, sAction, sIdItem, isLogged, section, doFbAction ){
    //costruisco la URL a cui inoltro la richiesta
	
	savingLoading(isLogged,sIdItem,section);
	sUrlRequestPage = "/"+sUrlPage+"?action="+sAction+"&id="+sIdItem+"&mode=xml";
	var oAjax = new getMEAjaxObj();
	
	oAjax.Request('GET',sUrlRequestPage,function(data){fnUpdateCounter(data, sIdItem, 0, section, doFbAction);});
}


function savingLoading(isLogged,aId,section){
	
	if (document.getElementById("vetrina_salva_"+aId))
		document.getElementById("vetrina_salva_"+aId).className = "link_salva loader_background";
	
	if (document.getElementById("salva_"+aId)) {
		if (section == 'dettaglio'){
			document.getElementById('salva_'+aId).className = "link_salvato dettaglio";
		} else if ( section == 'ricerca-mappa' ) {
			document.getElementById('salva_'+aId).className = "ico-stella on";
			document.getElementById('salva_'+aId).title = "Annuncio salvato nei preferiti";
		} else {
			document.getElementById("salva_"+aId).className = "link_salva loader_background";
		}
	}
	if (document.getElementById("ann_map_map_save_icon_"+aId))
		document.getElementById("ann_map_map_save_icon_"+aId).src = "/img2/LoadingSmall.gif";

}

/*gestione della risposta, aggiornamento contatore*/
function fnUpdateCounter(data, sIdItem, times, section, doFbAction){

	if (typeof times == "undefined")
		times = 0;
	if (typeof doFbAction == "undefined")
		doFbAction = true;
	
	var sResponse = data.responseText;
	
	if (sResponse == "NOT_LOGGED") {
		if ( document.getElementById('salva_'+sIdItem) ) {
			if ( section == 'dettaglio' )
				document.getElementById('salva_'+sIdItem).className = "link_salva dettaglio";
			else if (section == 'ricerca-mappa') {
				document.getElementById('salva_' + sIdItem).className = "ico-stella action-bookmark-annuncio";
				document.getElementById('salva_' + sIdItem).title = "Memorizza questo annuncio tra i tuoi preferiti per ritrovarlo più velocemente";
			}
		}
		__selectedOvBox.show();
		return;
	}else
	if (sResponse == "ERROR"){
		if ( document.getElementById('salva_'+sIdItem) ) {
			if ( section == 'dettaglio' )
				document.getElementById('salva_'+sIdItem).className = "link_salva dettaglio";
			else if (section == 'ricerca-mappa') {
				document.getElementById('salva_' + sIdItem).className = "ico-stella action-bookmark-annuncio";
				document.getElementById('salva_' + sIdItem).title = "Memorizza questo annuncio tra i tuoi preferiti per ritrovarlo più velocemente";
			}
		}
		return;
	}
	
	if(sResponse!=""){
	    _reload = true;
		try{
		var oCounter = document.getElementById('count_salvati');
		if ( section == 'ricerca-mappa') {
			document.getElementById('salva_' + sIdItem).className = "ico-stella on";
			if (oCounter) { //se utente è loggato
				oCounter.innerHTML = parseInt(sResponse);
			}
		} else if (oCounter){ //se utente è loggato
		    _reload = false;
		    oCounter.innerHTML = parseInt(sResponse);
			//tolgo il link salva annuncio e metto annuncio salvato
			if (document.getElementById('salva_'+sIdItem)){
				if (section != 'dettaglio') {
					document.getElementById('salva_'+sIdItem).className = "link_salvato";
					document.getElementById('salva_'+sIdItem).innerHTML = "<strong> Salvato </strong>";
				}
				document.getElementById('salva_'+sIdItem).href="/bookmarkannunci.php?idAnnuncio="+sIdItem;
				document.getElementById('salva_'+sIdItem).onclick='';
				if ( doFbAction )
					boxSalvaAnnuncioFacebook(sIdItem);
			}
			//aggiungo il cambio anche per l'annuncio in vetrina
			if (document.getElementById('vetrina_salva_'+sIdItem)){
				document.getElementById('vetrina_salva_'+sIdItem).className = "label_salvato";
				document.getElementById('vetrina_salva_'+sIdItem).innerHTML = "<strong> Salvato </strong>";
				document.getElementById('vetrina_salva_'+sIdItem).href="/bookmarkannunci.php?idAnnuncio="+sIdItem;
				document.getElementById('vetrina_salva_'+sIdItem).onclick='';
			}
			
			if (document.getElementById('ann_map_salva_an_map_'+sIdItem)){
				document.getElementById('ann_map_salva_an_map_'+sIdItem).innerHTML = "<img src=\"/img2/icone/icona-check.png\" />Salvato";
				document.getElementById('ann_map_salva_an_map_'+sIdItem).href="/bookmarkannunci.php?idAnnuncio="+sIdItem;
				document.getElementById('ann_map_salva_an_map_'+sIdItem).onclick='';
			}
			confirmAnnuncioSalvato(sIdItem);
		}else{
			window.location.reload();
		}
		
		}catch(e){
		    //alert(e);
		}
	}
}


function fnUpdateSaved(data,agArrayId){
        var sResponse = data.responseText;
        agArraySalvati = sResponse.split(',');
        for(var i=0;i<agArrayId.length;i++){
                if(document.getElementById('salva_loading_'+agArrayId[i]))
                    document.getElementById('salva_loading_'+agArrayId[i]).style.display="none";
                if(sResponse.search(agArrayId[i])>0)
                     document.getElementById('salvato_'+agArrayId[i]).style.display="inline";
                else
                     document.getElementById('salva_'+agArrayId[i]).style.display="inline";
        }
                
}

function checkIfSaveAd(isLogged, section){
	
	try{
		if (isLogged){
			var idAnnuncio = readCookie("salvaAnnuncio");
	
			if (idAnnuncio){
				bookmarkAnnuncio(idAnnuncio, true, section);
				selectOnlyAd(idAnnuncio,true);
			}
		}
		deleteCookie("salvaAnnuncio");
	}catch(e){
		deleteCookie("salvaAnnuncio");
	}
}

function sendMessage(context) {
	var url;
	var invia = true;
	if(context == 'ricerca') {
		invia = controllaFormInviaAmico();
	}
        
    url = "/invia_ricerca_amico.php?invia=s&url="+document.getElementById("urlRicerca").value;
    url += "&nomeMittente="+document.getElementById("mittente").value;
    url += "&nomeDestinatario="+document.getElementById("destinatario").value;
    url += "&emailMittente="+document.getElementById("mailMittente").value;
    url += "&emailDestinatario="+document.getElementById("mailDestinatario").value;
    url += "&testo="+document.getElementById("messaggio").value;
    url += "&privacy=S";
    url += "&page="+document.getElementById("page").value;
    
    if(invia) {
		var ajaxObj = new getMEAjaxObj();
		ajaxObj.Request('POST',url,function(data){ __selectedOvBox.setContent(data.responseText);});
	}
}

function controllaFormInviaAmico() {
    var invia = true;
    if(typeof document.getElementById("destinatario") == "undefined" ||  trim(document.getElementById("destinatario").value).length == 0 ||  trim(document.getElementById("destinatario").value) == 'Campo obbligatorio') {
        campoObbligatorio("destinatario");
        invia = false;
    }
    if(typeof document.getElementById("mittente") == "undefined" ||  trim(document.getElementById("mittente").value).length == 0 ||  trim(document.getElementById("mittente").value) == 'Campo obbligatorio') {
        campoObbligatorio("mittente");
        invia = false;
    }
    if(typeof document.getElementById("mailDestinatario") == "undefined"  ||  trim(document.getElementById("mailDestinatario").value).length == 0 || !isEmail(document.getElementById("mailDestinatario").value) ||  trim(document.getElementById("mailDestinatario").value) == 'Campo obbligatorio') {
        campoObbligatorio("mailDestinatario");
        invia = false;
    }
    if(typeof document.getElementById("mailMittente") == "undefined" ||  trim(document.getElementById("mailMittente").value).length == 0 || !isEmail(document.getElementById("mailMittente").value) ||  trim(document.getElementById("mailMittente").value) == 'Campo Obbligatorio') {
        campoObbligatorio("mailMittente");
        invia = false;
    }
    if(typeof document.getElementById("privacy") == "undefined" ||  document.getElementById("privacy").checked == 0) {
        campoObbligatorio("privacy");
        invia = false;
    }
    return invia;
}

function clearObbligatorio( sender ) {
    var etichetta = 'etichetta_'+ sender.name;
	
    sender.style.borderColor = "#AAAAAA";
    document.getElementById( etichetta ).style.color = "#000000";    
}

function campoObbligatorio( campo ) {
    var etichetta = 'etichetta_'+document.getElementById( campo ).name;
    document.getElementById( campo ).style.borderColor = "#FF0000";
    document.getElementById( etichetta ).style.color = "#FF0000";
}


function setListAnnuncioEvents(aInfoAnnuncio){
	
	/* Mini map*/
	/* solo se c'è indirizzo e flagIndirizzo = segnalino (1) */
	if ( typeof __box_mappa_enabled != "undefined" && (parseFloat(aInfoAnnuncio.latitudine) || parseFloat(aInfoAnnuncio.longitudine) ) && aInfoAnnuncio.flagIndirizzo == 1){
		
		if (typeof small_map_markers == "undefined")
			small_map_markers = new Array();
		var seg = new Object();
		seg.id = aInfoAnnuncio.idAnnuncio;
		seg.lat = aInfoAnnuncio.latitudine;
		seg.lon = aInfoAnnuncio.longitudine;
		if (typeof getImmobiliareMapIcon != "undefined")
			seg.icon = getImmobiliareMapIcon();
		small_map_markers.push(seg);
	}
	
	var __adUrl = aInfoAnnuncio.url;
	var __adId = aInfoAnnuncio.idAnnuncio;
	
	addEvent(document.getElementById(aInfoAnnuncio.idAnnuncio),"mouseover",
			function(e){
				var el = e.target ? e.target : e.srcElement;
				try{
					var elId = el.id;
					var pos = elId.search("vetrina_");
					if (pos==0){
						elId = elId.substr(8);
					}
					switch (elId){
						case "toggle_descrizione_img_"+aInfoAnnuncio.idAnnuncio:
						case "salvaAd_"+aInfoAnnuncio.idAnnuncio:
						case "link_contattaAd_"+aInfoAnnuncio.idAnnuncio:
						case "link_cancellaAd_"+aInfoAnnuncio.idAnnuncio:
						case "fotoPlus_annuncio_"+aInfoAnnuncio.idAnnuncio:
							document.getElementById(aInfoAnnuncio.idAnnuncio).style.cursor="";
							break;
						default:
							document.getElementById(aInfoAnnuncio.idAnnuncio).style.cursor="pointer";
							
							break;
					}
					
					addEvent(document.getElementById(aInfoAnnuncio.idAnnuncio),"mousedown",registerBtnPress.bind(document.getElementById(aInfoAnnuncio.idAnnuncio)));
					addEvent(document.getElementById(aInfoAnnuncio.idAnnuncio),"mouseup",unregisterBtnPress.bind(document.getElementById(aInfoAnnuncio.idAnnuncio)));
				}catch(e){
					
				}
			}
		);
	
	addEvent(document.getElementById(aInfoAnnuncio.idAnnuncio),"mouseout",
		function(e){
			removeEvent(document.getElementById(aInfoAnnuncio.idAnnuncio),"mousedown",registerBtnPress.bind(document.getElementById(aInfoAnnuncio.idAnnuncio)));
			removeEvent(document.getElementById(aInfoAnnuncio.idAnnuncio),"mouseup",unregisterBtnPress.bind(document.getElementById(aInfoAnnuncio.idAnnuncio)));
		}
	);
	
	
	//addEvent(document.getElementById(idAnnuncio),"click",clickAnnuncio);
	
	/* Associazione annuncio con box mappa a sx*/
	
	if (typeof selectAd == "function"){
		addEvent(document.getElementById(aInfoAnnuncio.idAnnuncio),"mouseover",selectAd.bind(document.getElementById(aInfoAnnuncio.idAnnuncio)));
		addEvent(document.getElementById(aInfoAnnuncio.idAnnuncio),"mouseout",deselectClickedAd.bind(document.getElementById(aInfoAnnuncio.idAnnuncio)));
	}
	
}
_isCtrlPressed = false;

function registerKeyPress(e){
	__lastKeyReleased = null;
	var key = (window.event) ? window.event.keyCode : e.keyCode;
	__lastKeyPressed = key;
	if (_ctrlPressed()){
		setCtrlPressed();
	}
	
}


function registerKeyRelease(e){
	__lastKeyPressed = null;
	var key = (window.event) ? window.event.keyCode : e.keyCode;
	__lastKeyReleased = key;
	
	if (_ctrlReleased())
		unsetCtrlPressed();
}

function _ctrlPressed(){
	if (parseInt(__lastKeyPressed) == 17 || parseInt(__lastKeyPressed) == 224 || parseInt(__lastKeyPressed) == 91){ //CTRL Premuto
		return true;	
	}
	return false;
}

function _ctrlReleased(){
	if (parseInt(__lastKeyReleased) == 17 || parseInt(__lastKeyReleased) == 224 || parseInt(__lastKeyReleased) == 91){ //CTRL rilasciato
		return true;	
	}
	return false;
}

function setCtrlPressed(){
	_isCtrlPressed = true;
}
function unsetCtrlPressed(){
	_isCtrlPressed = false;
}
function isCtrlPressed(){
	return _isCtrlPressed;
}

function _isCtrl_clickSx(){
	if (typeof __lastBtnPressed != "undefined" && __lastBtnPressed == 1 && isCtrlPressed()){ //CTRL + click sinistro
		return true;	
	}
	return false;
}


function _clickSx(){
	if (typeof __lastBtnPressed != "undefined" && __lastBtnPressed == 1){ // click sinistro
		return true;	
	}
	return false;
}



function registerBtnPress(e){
	__ad_opened = false;
	var btn = (window.which) ? window.event.which : e.which;
	__lastBtnPressed = btn;
	
}

function unregisterBtnPress(e){
	
	var el = e.target ? e.target : e.srcElement;
	if (parseInt(__lastBtnPressed) == 2){
		var searchClass = "riga_annuncio";
		var pattern = new RegExp("(^|.*[\\s]+)"+searchClass+"([\\s]+.*|$)");
		while (!pattern.test(el.className) && el.parentNode){
			el = el.parentNode;
		}
		if (el && pattern.test(el.className)){
			clickAnnuncio(el.id,e);
			//el.onclick();
			__ad_opened = true;
			stop_event_bubbling(e);
		}
	}
}

function _checkNewWin(){
	forceNewWin = false;
	if (isCtrlPressed()){
		forceNewWin = true;
	}

	if (typeof __lastBtnPressed != "undefined" && parseInt(__lastBtnPressed) == 2){
		forceNewWin = true;
		__lastBtnPressed = null;
	}
	return forceNewWin;
}

	function clickAnnuncio(idAnnuncio,e){
		try{
			stop_event_bubbling(e);
			var el = document.getElementById(idAnnuncio);
		
			if (typeof e != "undefined")	
				var el = e.target ? e.target : e.srcElement;
		
			var elId = el.id;
			var pos = elId.search("vetrina_");
			if (pos==0){
				elId = elId.substr(8);
			}
			var clickStatus = true;
			switch (elId){
				case "toggle_descrizione_img_"+idAnnuncio:				
				case "salva_"+idAnnuncio:
				case "fbActionSave_"+idAnnuncio:
				case "facebookStatus_"+idAnnuncio:
				case "link_salvaAd_"+idAnnuncio:
				case "link_cancellaAd_"+idAnnuncio:
				case "link_contattaAd_"+idAnnuncio:
                case "toggler_"+idAnnuncio:
				case "fotoPlus_annuncio_"+idAnnuncio:
				case "annuncio_new_tools_"+idAnnuncio:
					clickStatus = false;
					break;
				case "link_ad_"+idAnnuncio:					
					if ((!_isCtrl_clickSx() && !_clickSx()) || jq.browser.webkit){		
						clickStatus = false;
						break;
					}
				default:

                    if (el.className && el.className.indexOf("noClickAd") >= 0 ){
						clickStatus = false;
                        break;
                    }
                    
					var oA = document.getElementById("link_ad_"+idAnnuncio);
					
					if (oA){
						__forceNewWin = _checkNewWin();
						if (typeof __ad_opened == "undefined" || !__ad_opened){
							simulateClickOnLink(oA,__forceNewWin);
						}
					}
					
					break;
			}
			return clickStatus;
		}catch(e){
			return true;
		}
		return false;
	}
	
	function clickAgenzia(idAnnuncio,e){
	
		try{
			stop_event_bubbling(e);
			var el = document.getElementById(idAnnuncio);
		
			if (typeof e != "undefined")	
				var el = e.target ? e.target : e.srcElement;
		
			var elId = el.id;
			
			switch (elId){
				case "link_mail_"+idAnnuncio:				
				case "link_scopri_"+idAnnuncio:				
				
					break;
				case "link_ad_"+idAnnuncio:
					
					if (!_isCtrl_clickSx() && !_clickSx()){
						break;
					}
				default:
					
					var oA = document.getElementById("link_ad_"+idAnnuncio);
					
					if (oA){
						__forceNewWin = _checkNewWin();
						if (typeof __ad_opened == "undefined" || !__ad_opened){
							simulateClickOnLink(oA,__forceNewWin);
						}
					}
					
					break;
			}
		}catch(e){
			return true;
		}
		return false;
	}
    
    function clickAgenziaFranchising(idAnnuncio,e){
	
		try{
			stop_event_bubbling(e);
			var el = document.getElementById(idAnnuncio);
		
			if (typeof e != "undefined")	
				var el = e.target ? e.target : e.srcElement;
		
			var elId = el.id;
			
			switch (elId){
				case "link_ad_"+idAnnuncio:
					
					if (!_isCtrl_clickSx() && !_clickSx()){
						break;
					}
				default:
					
					var oA = document.getElementById("link_ad_"+idAnnuncio);
					
					if (oA){
						__forceNewWin = _checkNewWin();
						if (typeof __ad_opened == "undefined" || !__ad_opened){
							simulateClickOnLink(oA,__forceNewWin);
						}
					}
					
					break;
			}
		}catch(e){
			return true;
		}
		return false;
	}

function boxSalvaAnnuncioFacebook(idAnnuncio)
{
	var disabledBox = readCookie('autosaveDisabled');
	/*autosaveAds => definita in dettaglio.tpl e in ricerca.tpl*/
	if (typeof autosaveAds != "undefined" && autosaveAds) {
		oFacebookAction.doAction('save', idAnnuncio);
	} else if (disabledBox == null || !disabledBox) {
		var objBoxFacebook = new getMEAjaxObj();
		objBoxFacebook.Request("GET", "/boxPubblicaFacebook.php?content=save&idAnnuncio="+idAnnuncio, salvaAnnuncioFacebook);
		boxCondividi = new boxOverlay('save_fb', 'grey');
		boxCondividi.setTitle("<div style='font-size:14px'>Salva il tuo annuncio su facebook</div>");
	}
}

function salvaAnnuncioFacebook(data)
{
	var content = data.responseText;
	boxCondividi.setTitle("<div style='font-size:14px'>Salva il tuo annuncio su facebook</div>");
	boxCondividi.setContent(content);
	boxCondividi.show();
}

addEvent(window,"blur",function(){setTimeout(unsetCtrlPressed,500)});
addEvent(document,"keydown",registerKeyPress);
addEvent(document,"keyup",registerKeyRelease);

/**
 * Permette di digitare solo numeri e shortcut in un campo input.
 * 
 * Per usarlo nel mettere campo input "onkeydown='onlyNumberDigit(event);'"
 * @param event ---> Evento KeyPress
 */
function onlyNumberDigit(event) {
	var segnopiu = (window.event) ? 187:171;
	var keyCode = (window.event) ?    // MSIE or Firefox?
			   window.event.keyCode : (event.keyCode ? event.keyCode : event.which);
	// Allow: backspace, delete, tab, escape, and enter
	if ( keyCode == 46 || keyCode == 8 || keyCode == 9 || keyCode == 27 || keyCode == 13 || keyCode == segnopiu || 
		 // Allow: Ctrl+A
		(keyCode == 65 && event.ctrlKey === true) || 
		 // Allow: Ctrl+C
		(keyCode == 67 && event.ctrlKey === true) || 
		 // Allow: Ctrl+V
		(keyCode == 86 && event.ctrlKey === true) || 
		 // Allow: Ctrl+X
		(keyCode == 88 && event.ctrlKey === true) || 
		 // Allow: +
		(keyCode == 107) ||
		 // Allow: home, end, left, right
		(keyCode >= 35 && keyCode <= 39)) {
			 // let it happen, don't do anything
			 return;
	}
	else {
		// Ensure that it is a number and stop the keypress
		if (keyCode == 16 || (keyCode < 48 || keyCode > 57) && (keyCode < 96 || keyCode > 105 )) {
			if(event.preventDefault) 
				event.preventDefault();
			else {
				event.returnValue = false;
				return false;
			}
		}   
	}
}

// GESTIONE Bookmark
function ManagerNoteAd( options )
{
	this.options = typeof options != "undefined" ? options : new Array();
	
	this.isLogged = typeof this.options.isLogged != "undefined" ? this.options.isLogged : false;
	
	this.checkBookmarked = typeof this.options.checkBookmarked != "undefined" ? this.options.checkBookmarked : false;
	this.section = typeof this.options.section != "undefined" ? this.options.section : null;
	
	this.onSave = typeof this.options.onSave != "undefined" ? this.options.onSave : function(){};
	this.onDelete = typeof this.options.onDelete != "undefined" ? this.options.onDelete : function(){};
	
	this.boxAlwaysOpened = typeof this.options.boxAlwaysOpened != "undefined" ? this.options.boxAlwaysOpened : 1; // differenzia il comportamento tra bookmark e dettaglio
	
	this.minRowsTextArea = 1;
	this.maxRowsTextArea = 10;
}

ManagerNoteAd.prototype.init = function() {
	var that = this;
	jq(".action-note").unbind();
	jq(".action-note").each(function(){
		jq(this).on('click', function(){
			var idAnnuncio = jq(this).attr('data-id');
			var action = jq(this).attr('data-action');
			var isBookmarked = jq(this).attr('data-bookmarked');
			that.actionNote( idAnnuncio, action, isBookmarked );
		});
	});
	
	// controllo se esiste un cookie associato alla creazione di una nota.
	if ( this.section == 'dettaglio' )
		this.checkCookieNoteAd();
}

ManagerNoteAd.prototype.eventOnDelete = function( idAnnuncio ) {
	if ( !this.boxAlwaysOpened ) {
		jq("#nota-annuncio-" + idAnnuncio).slideUp(500, function(){ jq(this).removeClass('bg-white'); });
		jq("#testo-nota-" + idAnnuncio).html('');
	} else {
		jq("#box-testo-nota-" + idAnnuncio).hide();
		jq("#box-init-nota-" + idAnnuncio).show();
		jq("#testo-nota-" + idAnnuncio).html('');
		jq("#box-modifica-nota-" + idAnnuncio).slideUp(500, function(){ jq("#box-nota-"+idAnnuncio).fadeIn(300, function(){ jq("#nota-annuncio-" + idAnnuncio).removeClass('bg-white'); }); });
	}
	if ( this.section == 'bookmark_annunci' )
		jq("#blocco_note_"+idAnnuncio).slideDown();
	
	this.onDelete();
}

ManagerNoteAd.prototype.eventOnUpdate = function( idAnnuncio, text ) {
	jq("#box-testo-nota-" + idAnnuncio).show();
	jq("#box-init-nota-" + idAnnuncio).hide();
	jq("#testo-nota-" + idAnnuncio).html( text );
	
	jq("#overlaybox-action-note-"+idAnnuncio).slideUp(500, function(){
		jq("#box-modifica-nota-"+idAnnuncio).hide();
		jq("#nota-annuncio-" + idAnnuncio).removeClass( 'bg-white' );
		jq("#box-nota-"+idAnnuncio).show();
	});
	
	this.onSave();
}

ManagerNoteAd.prototype.limitTextareaLine = function(elem, ev) {
	// se ho superato il numero di righe massimo disabilito il tasto invio
	if ( (ev.keyCode || ev.which) == 13 && jq(elem).val().split('\n').length >= this.maxRowsTextArea ) {
		ev.preventDefault();
		return false;
	}
}

ManagerNoteAd.prototype.eventOnEdit = function( idAnnuncio, html, isBookmarked ) {
	if ( this.section == 'bookmark_annunci' )
		jq("#blocco_note_"+idAnnuncio).slideUp();
	
	if ( !this.boxAlwaysOpened ) {
		jq("#nota-annuncio-" + idAnnuncio).slideDown(500);
	}
	
	var noteWithText = jq("#box-testo-nota-" + idAnnuncio).is(":visible");
	jq("#box-modifica-nota-" + idAnnuncio).html( html );
	jq("#nota-annuncio-" + idAnnuncio).addClass('bg-white');
	
	if ( noteWithText ) {
		jq("#box-nota-" + idAnnuncio).hide();
		jq("#box-modifica-nota-" + idAnnuncio).show();
		jq("#overlaybox-action-note-" + idAnnuncio).slideDown();
		jq("#modifica-nota-" + idAnnuncio).focus();
	} else {
		jq("#box-nota-" + idAnnuncio).fadeOut(300, function(){
			jq("#overlaybox-action-note-" + idAnnuncio).show();
			jq("#box-modifica-nota-" + idAnnuncio).slideDown();
			jq("#modifica-nota-" + idAnnuncio).focus();
		});
	}
	
	// Aggiungo ai pulsanti del boxoverlay gli eventi.
	var that = this;
	jq("#box-contenitore-blocconote-"+idAnnuncio+" .action-note").on('click', function() {
		// se i pulsanti dentro il boxoverlay sono disabilitati fermo l'evento
		if ( jq(this).hasClass('disabled') )
			return;

		var action = jq(this).attr('data-action');
		var idAnnuncio = jq(this).attr('data-id');
		that.actionNote( idAnnuncio, action, isBookmarked );
	});
}

ManagerNoteAd.prototype.eventOnConfirm = function( idAnnuncio, html ) {
	this.box =  new boxOverlay( 'notaAnnunio', 'grey' );
	this.box.setTitle( "<div style='font-size:14px; margin-top:3px; float:left; color:#666;'>Nota personale</div>" );
	this.box.setContent( html );
	this.box.show();
	
	var that = this;
	jq("#conferma-nota-"+idAnnuncio+" .action-note").on('click', function() {
		// se i pulsanti dentro il boxoverlay sono disabilitati fermo l'evento
		var action = jq(this).attr('data-action');
		var idAnnuncio = jq(this).attr('data-id');
		that.actionNote( idAnnuncio, action, 1 );
		that.box.close();
	});
}

ManagerNoteAd.prototype.doAjax = function( idAnnuncio, action, nota, isBookmarked, isFroomCookie ) {
	if ( typeof isFroomCookie == "undefined" )
		isFroomCookie = 0;
	
	var that = this;
	jq.ajax({
		type : "POST",
		url : VHOST_URL_HOST + "bloccoNote.php",
		dataType : "xml",
		data : {
			idAnnuncio : idAnnuncio,
			action : action,
			nota : nota,
			isFroomCookie : isFroomCookie
		}
	}).done(function( mixed ) {
		var action = jq(mixed).find('action').text();
		var message = jq(mixed).find('message').text();
		var html = jq(mixed).find('html').text();
		var errorCode = jq(mixed).find('errorcode').text();
		
		if ( action == 'edit-note' ) {
			that.eventOnEdit( idAnnuncio, html, isBookmarked );
		} else if ( action == 'delete-note' ) {
			if ( errorCode != '' ) {
				jq("#error-message-note-"+idAnnuncio).html( message );
				jq("#error-message-note-"+idAnnuncio).slideDown();
			} else {
				that.eventOnDelete( idAnnuncio );
			}
		} else if ( action == 'save-note' ) {
			if ( errorCode != '' ) {
				jq("#error-message-note-"+idAnnuncio).html( message );
				jq("#error-message-note-"+idAnnuncio).slideDown();
			} else {
				if ( message != '' )
					that.eventOnUpdate( idAnnuncio, message );
			}
		} else if ( action == 'confirm-note' ) {
			that.eventOnConfirm( idAnnuncio, html );
		}
	});
	return true;
}

// controlla la lunghezza quando viene inserita una nota
ManagerNoteAd.prototype.checkLengthNote = function( elem, idAnnuncio, maxLength ) {
	var bChecked = false;
	while ( elem.rows > this.minRowsTextArea && elem.scrollHeight <= elem.offsetHeight ) {
		elem.rows--;
		bChecked = true;
	}
	while ( elem.rows < this.maxRowsTextArea && elem.scrollHeight > elem.offsetHeight ) {
		elem.rows++;
		bChecked = true;
	}
	if ( bChecked && elem.rows < this.maxRowsTextArea )
		elem.rows++;
	
	var len = jq(elem).val().length;
	if ( len == 0 ) {
		jq("#overlaybox-action-note-"+ idAnnuncio +" .action-note[data-action='save-note']").addClass( "disabled" );
	} else {
		jq("#overlaybox-action-note-"+ idAnnuncio +" .action-note[data-action='save-note']").removeClass( "disabled" );
		jq("#overlaybox-action-note-"+ idAnnuncio +" .action-note[data-action='delete-note']").removeClass( "disabled" );
	}
	textCounter( elem, document.getElementById('len-nota-'+idAnnuncio), maxLength);
}

ManagerNoteAd.prototype.actionNote = function( idAnnuncio, action, isBookmarked ) {
	switch ( action ) {
		case 'save-note':
			var testoNota = typeof jq("#modifica-nota-"+idAnnuncio).val() != 'undefined' ? jq("#modifica-nota-"+idAnnuncio).val() : '';
			if ( this.checkSession( idAnnuncio, action, testoNota, isBookmarked ) ) {
				this.bookmarkAd( idAnnuncio, isBookmarked );
				this.doAjax( idAnnuncio, action, testoNota, isBookmarked );
			}
			break;
		case 'delete-note':
			if ( this.checkSession( idAnnuncio, action, "", isBookmarked ) )
				this.doAjax( idAnnuncio, action, "", isBookmarked );
			break;
		case 'edit-note':
			this.doAjax( idAnnuncio, action, "", isBookmarked );
			break;
		case 'expand-note':
			if ( this.section != 'dettaglio' )
				this.expandNote( idAnnuncio );
			break;
		case 'close-note':
			this.eventOnDelete( idAnnuncio );
			break;
		default:
			break;
	}
}

ManagerNoteAd.prototype.createSSOBox = function( idAnnuncio ) {
    __selectedOvBox = new boxOverlay( 'salvaAnnuncioBox_'+idAnnuncio, 'grey' );
    var loginOptions = {loginType : "U"}
    __selectedOvBox = create_accediBox( 'U', loginOptions );
    __selectedOvBox.show();
}

ManagerNoteAd.prototype.checkCookieNoteAd = function() {
	try {
		if ( this.isLogged ) {
			var oNota = jq.parseJSON( Base64.decode( readCookie( "notaAnnuncio" ) ) );
			if ( oNota && oNota.idAnnuncio ) {
				this.bookmarkAd( oNota.idAnnuncio, oNota.isBookmarked );
				this.doAjax( oNota.idAnnuncio, oNota.action, unescape(oNota.nota), oNota.isBookmarked, 1 );
			}
		}
		deleteCookie( "notaAnnuncio" );
	} catch(e) {
		deleteCookie( "notaAnnuncio" );
	}
}

ManagerNoteAd.prototype.bookmarkAd = function( idAnnuncio, isBookmarked ) {
	if ( this.checkBookmarked && parseInt(isBookmarked) == 0 ) {
		bookmarkAnnuncio( idAnnuncio, this.isLogged, this.section, false );
		jq(".action-note[data-id='"+idAnnuncio+"']").each(function(){ jq(this).attr('data-bookmarked', 1); });
	}
}

ManagerNoteAd.prototype.checkSession = function( idAnnuncio, action, testonota, isBookmarked ) {
	if ( !this.isLogged ) {
		createCookie( "notaAnnuncio", Base64.encode( stringify( { idAnnuncio : idAnnuncio, nota : escape(testonota), action : action, isBookmarked : isBookmarked } ) ) );
		this.createSSOBox( idAnnuncio );
		return false;
	}
	return true;
}

ManagerNoteAd.prototype.expandNote = function( idAnnuncio ) {
	if ( jq('#testo-nota-' + idAnnuncio).hasClass('nota-aperta') ) {
		jq('#testo-nota-' + idAnnuncio).animate({ 'max-height':'16px'}, 500, function(){ jq(this).toggleClass('nota-aperta');});
	} else {
		jq('#testo-nota-' + idAnnuncio).animate({ 'max-height':'100px'}, 500, function(){ jq(this).toggleClass('nota-aperta');});
	}
}