function InviaRichiesta(fonte,tipo){
    if (tipo=="invia"){
	var r=validate();;
	if (!r){
	    return r;
	}
    }
    // Aggiorno il contatore su DB
    // ---------------------------
    var oAjax = new getMEAjaxObj();
    var url = "/statisticaLeadMutuo.php?fonte="+fonte;
    oAjax.Request('POST',url,function InviaRichiestaH(){});
    return true;
}

function validate(){
        var eta=document.getElementById('MTF_eta').value;
        var impiego=document.getElementById('MTF_impiego').value;
        var reddito=document.getElementById('MTF_reddito').value;
        var domicilio=document.getElementById('MTF_domicilio').value;
        var finalita=document.getElementById('MTF_finalita').value;
        var tasso=document.getElementById('MTF_tasso').value;
        var durata=document.getElementById('MTF_durata').value;
        var valore=document.getElementById('MTF_valore').value;
        valore = valore.replace(/\./g,'');
        var importo=document.getElementById('MTF_importo').value;
        importo = importo.replace(/\./g,'');
        errori=new Array();
        errori[0] = new Array();
        errori[1] = new Array();
        errori[0][0]="Il campo Età è obbligatorio";
        errori[0][1]=eta+" non è un valore valido per Eta'";
        errori[0][2]="Il richiedente deve essere maggiorenne";
        errori[0][3]="Il campo Impiego è obbligatorio";
        errori[0][4]="Il campo Reddito è obbligatorio";
        errori[0][5]=reddito+" non è un valore valido per Reddito:inserire un numero intero";
        errori[0][6]="Il campo Domicilio è obbligatorio";
        errori[0][7]="Il campo Finalita' è obbligatorio";
        errori[0][8]="Il campo Tipo tasso è obbligatorio";
        errori[0][9]="Il campo Durata è obbligatorio";
        errori[0][10]="Il campo Valore immobile è obbligatorio";
        errori[0][11]=valore+" non è un valore valido per Valore immobile: inserire un valore intero compreso tra 1000 e 4000000.";
        errori[0][12]="Il campo Importo richiesto è obbligatorio e deve essere inferiore al Valore";
        errori[0][13]=importo+" non è un valore valido per Importo richiesto";
        errori[0][14]=importo+" non è un valore valido per Importo richiesto: inserire un valore intero compreso tra 1000 e "+valore;
        //check eta
        if (eta=='') {
        errori[1][0]=1;
        } else {       
                var re_eta=/^[0-9]*$/;
                if (!re_eta.test(eta)) {
                        errori[1][1]=1;
                } else if (eta<18) {
                        errori[1][2]=1;
                }
        }
        //check impiego
        if (impiego=='0'){
                errori[1][3]=1;
        }
        //check reddito
        if (reddito=='' || reddito=='Mensile netto') {
                errori[1][4]=1;
        } else {
                var re_reddito=/^[0-9.]*$/;
                if (!re_reddito.test(reddito)) {
                        errori[1][5]=1;
                } else if (reddito==0) {
                        errori[1][5]=1;
                }
        }
        //check domicilio
        if (domicilio=='') {
                errori[1][6]=1;
        }
        //check finalita
        if (finalita=='') {
                errori[1][7]=1;
        }
       
        //check tasso
        if (tasso=='') {
                errori[1][8]=1;
        }
        //check durata
        if (durata=='') {
                errori[1][9]=1;
        }
        //check valore
        var flag_valore=0;
        if (valore=='') {
                errori[1][10]=1;
        } else {
                var re_valore=/^[0-9]*$/;
                if (!re_valore.test(valore)) {
                        errori[1][11]=1;
                } else if (valore<1000 || valore>4000000) {
                        errori[1][11]=1;
                }
        }
        //check importo
        if (importo=='' || parseInt(importo)>parseInt(valore)) {
                errori[1][12]=1;
        } else {
                var re_importo=/^[0-9]*$/;
                if (!re_importo.test(importo)) {
                        errori[1][13]=1;
                } else if (importo<1000) {
                        errori[1][14]=1;
                } else if (flag_valore==1 && parseInt(importo)>parseInt(valore)) {
                        errori[1][14]=1;
                }
        }
        // Controllo eventuali errori
        var messaggi="";
        for (i=0; i<errori[0].length; i=i+1){
                if (errori[1][i]==1 && errori[0][i]!="") messaggi=messaggi+errori[0][i]+"\n";
        }
        if (messaggi != "") {
                alert(messaggi);
                return false;
        }
        //Form è ok:
	return true;
}

f_reddito_focus=function(){
    if (app=document.getElementById("MTF_reddito")) app.value="";
}

f_reddito_onblur=function(){
    if (app=document.getElementById("MTF_reddito")){
	if (app.value=="") app.value="Mensile netto";
    }
}

var formMutui="\
  <div id=\"MT_form_home\" class=\"MT_dettaglio\">\
  <img src=\"/img2/loghi_mutui_it/logo_new_300x60.png\"/>\
    <form id=\"MT_form_dati\" class=\"MT_dettaglio\" action=\"http://www.mutui.it/risultati.php\"  method=\"post\" onsubmit=\"return InviaRichiesta('CALCOLA_MUTUO_MOSTRAMI_MUTUI','invia');\" target=\"_blank\"> \
      <div>\
	<input type=\"hidden\" name=\"MTF_frequenza\" id=\"MTF_frequenza\" value=\"1\" />\
      </div>\
      <div class=\"MT_form_field\">\
	<label for=\"MTF_eta\">Età </label>\
	<input type=\"text\" name=\"MTF_eta\" id=\"MTF_eta\" />\
      </div>\
      <div class=\"MT_form_field\">\
	<label for=\"MTF_impiego\">Impiego</label>\
	<select name=\"MTF_impiego\" id=\"MTF_impiego\">\
	  <option value=\"\">Seleziona l'impiego</option>\
	  <option value=\"1\">Dipendente a tempo indeterminato</option>\
	  <option value=\"2\">Dipendente a tempo determinato</option>\
	  <option value=\"3\">Autonomo con P.IVA</option>\
	  <option value=\"4\">Pensionato</option>\
	  <option value=\"5\">Libero professionista</option>\
	</select>\
      </div>\
      <div class=\"MT_form_field\">\
	<label for=\"MTF_reddito\">Reddito mensile (&euro;)<a href=\"#\" onfocus=\"document.getElementById('MTF_reddito').focus();\" title=\"Reddito complessivo netto mensile dei richiedenti . Inserire il reddito netto mensile dei richiedenti del mutuo derivante dall'attivit&agrave; lavorativa e da rendite di altro genere. <br>Inserire un valore intero\" class=\"MT_info_tooltip\"></a></label>\
	<input type=\"text\" name=\"MTF_reddito\" id=\"MTF_reddito\" value=\"Mensile netto\" onclick=\"f_reddito_focus();\" onblur=\"f_reddito_onblur();\" />\
      </div>\
      <div class=\"MT_form_field\">\
	<label for=\"MTF_domicilio\">Domicilio</label>\
	<select name=\"MTF_domicilio\" id=\"MTF_domicilio\">\
	  <option value=\"\">Seleziona la provincia</option>\
	  <option value=\"AG\">Agrigento</option>\
	  <option value=\"AL\">Alessandria</option>\
	  <option value=\"AN\">Ancona</option>\
	  <option value=\"AO\">Aosta</option>\
	  <option value=\"AR\">Arezzo</option>\
	  <option value=\"AP\">Ascoli Piceno</option>\
	  <option value=\"AT\">Asti</option>\
	  <option value=\"AV\">Avellino</option>\
	  <option value=\"BA\">Bari</option>\
	  <option value=\"BL\">Belluno</option>\
	  <option value=\"BN\">Benevento</option>\
	  <option value=\"BG\">Bergamo</option>\
	  <option value=\"BI\">Biella</option>\
	  <option value=\"BO\">Bologna</option>\
	  <option value=\"BZ\">Bolzano</option>\
	  <option value=\"BS\">Brescia</option>\
	  <option value=\"BR\">Brindisi</option>\
	  <option value=\"CA\">Cagliari</option>\
	  <option value=\"CL\">Caltanissetta</option>\
	  <option value=\"CB\">Campobasso</option>\
	  <option value=\"CI\">Carbonia-Iglesias</option>\
	  <option value=\"CE\">Caserta</option>\
	  <option value=\"CT\">Catania</option>\
	  <option value=\"CZ\">Catanzaro</option>\
	  <option value=\"CH\">Chieti</option>\
	  <option value=\"CO\">Como</option>\
	  <option value=\"CS\">Cosenza</option>\
	  <option value=\"CR\">Cremona</option>\
	  <option value=\"KR\">Crotone</option>\
	  <option value=\"CN\">Cuneo</option>\
	  <option value=\"EN\">Enna</option>\
	  <option value=\"FE\">Ferrara</option>\
	  <option value=\"FI\">Firenze</option>\
	  <option value=\"FG\">Foggia</option>\
	  <option value=\"FC\">Forlì Cesena</option>\
	  <option value=\"FR\">Frosinone</option>\
	  <option value=\"GE\">Genova</option>\
	  <option value=\"GO\">Gorizia</option>\
	  <option value=\"GR\">Grosseto</option>\
	  <option value=\"IM\">Imperia</option>\
	  <option value=\"IS\">Isernia</option>\
	  <option value=\"AQ\">L'Aquila</option>\
	  <option value=\"SP\">La Spezia</option>\
	  <option value=\"LT\">Latina</option>\
	  <option value=\"LE\">Lecce</option>\
	  <option value=\"LC\">Lecco</option>\
	  <option value=\"LI\">Livorno</option>\
	  <option value=\"LO\">Lodi</option>\
	  <option value=\"LU\">Lucca</option>\
	  <option value=\"MC\">Macerata</option>\
	  <option value=\"MN\">Mantova</option>\
	  <option value=\"MS\">Massa - Carrara</option>\
	  <option value=\"MT\">Matera</option>\
	  <option value=\"VS\">Medio Campidano</option>\
	  <option value=\"ME\">Messina</option>\
	  <option value=\"MI\">Milano</option>\
	  <option value=\"MO\">Modena</option>\
	  <option value=\"NA\">Napoli</option>\
	  <option value=\"NO\">Novara</option>\
	  <option value=\"NU\">Nuoro</option>\
	  <option value=\"OG\">Ogliastra</option>\
	  <option value=\"OT\">Olbia Tempio</option>\
	  <option value=\"OR\">Oristano</option>\
	  <option value=\"PD\">Padova</option>\
	  <option value=\"PA\">Palermo</option>\
	  <option value=\"PR\">Parma</option>\
	  <option value=\"PV\">Pavia</option>\
	  <option value=\"PG\">Perugia</option>\
	  <option value=\"PU\">Pesaro E Urbino</option>\
	  <option value=\"PE\">Pescara</option>\
	  <option value=\"PC\">Piacenza</option>\
	  <option value=\"PI\">Pisa</option>\
	  <option value=\"PT\">Pistoia</option>\
	  <option value=\"PN\">Pordenone</option>\
	  <option value=\"PZ\">Potenza</option>\
	  <option value=\"PO\">Prato</option>\
	  <option value=\"RG\">Ragusa</option>\
	  <option value=\"RA\">Ravenna</option>\
	  <option value=\"RC\">Reggio Calabria</option>\
	  <option value=\"RE\">Reggio Nell'Emilia</option>\
	  <option value=\"RI\">Rieti</option>\
	  <option value=\"RN\">Rimini</option>\
	  <option value=\"RM\">Roma</option>\
	  <option value=\"RO\">Rovigo</option>\
	  <option value=\"SA\">Salerno</option>\
	  <option value=\"SS\">Sassari</option>\
	  <option value=\"SV\">Savona</option>\
	  <option value=\"SI\">Siena</option>\
	  <option value=\"SR\">Siracusa</option>\
	  <option value=\"SO\">Sondrio</option>\
	  <option value=\"TA\">Taranto</option>\
	  <option value=\"TE\">Teramo</option>\
	  <option value=\"TR\">Terni</option>\
	  <option value=\"TO\">Torino</option>\
	  <option value=\"TP\">Trapani</option>\
	  <option value=\"TN\">Trento</option>\
	  <option value=\"TV\">Treviso</option>\
	  <option value=\"TS\">Trieste</option>\
	  <option value=\"UD\">Udine</option>\
	  <option value=\"VA\">Varese</option>\
	  <option value=\"VE\">Venezia</option>\
	  <option value=\"VB\">Verbano-Cusio-Ossola</option>\
	  <option value=\"VC\">Vercelli</option>\
	  <option value=\"VR\">Verona</option>\
	  <option value=\"VV\">Vibo Valentia</option>\
	  <option value=\"VI\">Vicenza</option>\
	  <option value=\"VT\">Viterbo</option>\
	</select>\
      </div>\
      <div class=\"MT_form_field\">\
	<label for=\"MTF_finalita\">Finalità </label>\
	<select name=\"MTF_finalita\" id=\"MTF_finalita\">\
	  <option value=\"\">Seleziona la finalità </option>\
	  <option value=\"1\">Acquisto prima casa</option>\
	  <option value=\"2\">Acquisto  seconda casa</option>\
	  <option value=\"3\">Surroga</option>\
	  <option value=\"4\">Sostituzione e Liquidità </option>\
	  <option value=\"5\">Completamento costruzione</option>\
	  <option value=\"6\">Ristrutturazione</option>\
	  <option value=\"7\">Consolidamento debiti</option>\
	  <option value=\"8\">Liquidità </option>\
	</select>\
      </div>\
      <div class=\"MT_form_field\">\
	<label for=\"MTF_tasso\">Tipo tasso</label>\
	<select name=\"MTF_tasso\" id=\"MTF_tasso\">\
	  <option value=\"\">Seleziona il tipo di tasso</option>\
	  <option value=\"1\">Fisso</option>\
	  <option value=\"2\">Variabile</option>\
	  <option value=\"3\">Rata costante</option>\
	  <option value=\"4\">Misto</option>\
	</select>\
	<select name=\"MTF_indice\" id=\"MTF_indice\" class=\"MT_half\" style=\"display:none\">\
	  <optgroup label=\"Indice\">\
          <option value=\"1\">BCE</option>\
	  <option value=\"2\">Euribor</option>\
	  </optgroup>\
	</select>\
      </div>\
      <div class=\"MT_form_field\">\
	<label for=\"MTF_durata\">Durata (anni)</label>\
	<select name=\"MTF_durata\" id=\"MTF_durata\">\
	  <option value=\"\">Seleziona la durata</option>\
	  <option value=\"5\">5</option>\
	  <option value=\"7\">7</option>\
	  <option value=\"10\">10</option>\
	  <option value=\"12\">12</option>\
	  <option value=\"15\">15</option>\
	  <option value=\"20\">20</option>\
	  <option value=\"25\">25</option>\
	  <option value=\"30\">30</option>\
	  <option value=\"35\">35</option>\
	  <option value=\"40\">40</option>\
	</select>\
      </div>\
      <div class=\"MT_form_field\">\
	<label for=\"MTF_valore\">Valore immobile (&euro;)</label><a href=\"#\" onfocus=\"document.getElementById('MTF_valore').focus();\" title=\"Valore immobile . Inserire un valore intero.\" class=\"MT_info_tooltip\"></a>\
	<input type=\"text\" name=\"MTF_valore\" id=\"MTF_valore\" />\
      </div>\
      <div class=\"MT_form_field\">\
	<label for=\"MTF_importo\">Importo richiesto (&euro;)</label><a href=\"#\" onfocus=\"document.getElementById('MTF_importo').focus();\" title=\"Importo richiesto . Inserire un valore intero\" class=\"MT_info_tooltip\"></a>\
	<input type=\"text\" name=\"MTF_importo\" id=\"MTF_importo\" />\
      </div>\
        <input class=\"MT_button_form MT_dettaglio\" type=\"submit\" value=\"\"/>\
      <div class=\"clear\"></div>\
    </form>\
  </div><div class=\"clear\"></div>";


/**
 * Metodo che gestisce l'apertura del popup dei mutui nel dettaglio annuncio
 */
mostraBoxMutuo=function(){
	if( typeof callFunctionPopopMutui == 'undefined' )
		return false;
		
	if( callFunctionPopopMutui['nomePopup'] == 'MutuiOnLine.it' )
		mostraBoxLeadMutuoOnline();
	else
		mostraBoxPopupMutui( callFunctionPopopMutui, 'Calcola il mutuo' );        
	trackGAClickEvent( 'dettaglioAnnuncioEvents', 'gestoreAperturePopup', callFunctionPopopMutui['nomePopup'] );
}

mostraBoxLeadMutuo=function(){   
	boxOver=new boxOverlay("lead_mutui_box");
	boxOver.setTitle("<span id=\"lm_titolo_box\" class=\"titolo_annuncio\" style=\"margin-top:3px;margin-bottom:3px\">Calcola il mutuo</span>");
	boxOver.setContent(formMutui);
    boxOver.show();	
    return InviaRichiesta('CALCOLA_MUTUO','');
}

/**
 * Metodo che gestisce l'apertura del popup dei prestiti nel dettaglio annuncio
 */
mostraBoxPrestito = function() {
	if( typeof callFunctionPopopPrestiti == 'undefined' )
		return false;
    mostraBoxPopupMutui( callFunctionPopopPrestiti, 'Calcola il tuo prestito' );
	trackGAClickEvent( 'dettaglioAnnuncioEvents', 'gestoreAperturePopup', callFunctionPopopPrestiti['nomePopup'] );
}

mostraBoxConsulenzaMutuo = function() {

    boxOver=new boxOverlay("consulenzaUnicredit",'grey');
    boxOver.setTitle("<span id=\"lm_titolo_box\" class=\"titolo_annuncio\" style=\"margin-top:3px;margin-bottom:3px\">Consulenza Mutuo</span>");
    boxOver.setContent('<iframe src="/mutui/iFrameMutuiUnicredit.html" width="765px" height="370px" scrolling="no" frameborder="0"></iframe>');
    boxOver.show();

    trackGAClickEvent( 'dettaglioAnnuncioEvents', 'gestoreAperturePopup', 'consulenzaMutuoUnicrdit' );
}

mostraBoxPopupMutui = function( popup, title ) {
	boxOver=new boxOverlay("prestiti_facile_box",'grey');
	boxOver.setTitle("<span id=\"lm_titolo_box\" class=\"titolo_annuncio\" style=\"margin-top:3px;margin-bottom:3px\">"+title+"</span>");
	boxOver.setContent('<iframe src="'+popup['link']+'" width="'+popup['width']+'px" height="'+popup['height']+'px" scrolling="no" frameborder="0"></iframe>');
    boxOver.show();
	
	if ( popup['nomePopup'] == 'Mutui.it' )
		InviaRichiesta('MOSTRAMI_MUTUI_IT','');
}