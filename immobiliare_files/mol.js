//<!-- INIZIO Sezione 6: aggiornamento campi hidden -->
//aggiorno campi hidden prima di fare il submit
function InviaMOL(theForm) {
	if (validazioniRicercaMOLCaricato == 1) { //è stato caricato il sorgente per la validazione
		return CheckCampiRicercaMOL(theForm);
	} else { //non è stato possibile caricare le validazioni.
		theForm.action="http://www.mutuionline.it/richiedi/ricerca/formcompleto.asp";
		theForm.submit();
	}
}

function mostraBoxLeadMutuoOnline(){

    if (typeof(boxOverOnline) =='undefined'){
	boxOverOnline=new boxOverlay("lead_mutui_box","grey");
	boxOverOnline.fixedPosition = false;
	boxOverOnline.destroyOnClose=false;
	boxOverOnline.setTitle("<span id=\"lm_titolo_box\" class=\"titolo_annuncio\" style=\"margin-top:3px;margin-bottom:3px\">Calcola il mutuo</span>");
	boxOverOnline.setContent(formMutuiOnLine);
	if (document.modulo){
	    try{
		caricaComboMOL_FinalitaMutuo(document.modulo.CodiceFinalita);
		caricaComboMOL_TipiTasso(document.modulo.CodiceTipoTasso);
		caricaComboMOL_Provincie(document.modulo.CodiceLocalita,document.modulo.CodiceResidenza);
	    }
	catch(e){
	    //alert((e.number & 0xFFFF) +" "+e.description);  
	    try{
		caricaComboMOL_TipiTasso(document.modulo.CodiceTipoTasso);
		caricaComboMOL_Provincie(document.modulo.CodiceLocalita,document.modulo.CodiceResidenza);
	    }catch(e){
		//alert((e.number & 0xFFFF) +" "+e.description);
		caricaComboMOL_Provincie(document.modulo.CodiceLocalita,document.modulo.CodiceResidenza);
	    }
	}
	    if (document.getElementById("lead_mutui_box_content")){
		document.getElementById("lead_mutui_box_content").style.paddingTop="0px";
		document.getElementById("lead_mutui_box_content").style.paddingRight="7px";
	    }
	}
    }

    boxOverOnline.show();
    if (document.getElementById("lead_mutui_box")) document.getElementById("lead_mutui_box").style.top ="103px";
    if(document.getElementById("boxOverlayIFrame")) document.getElementById("boxOverlayIFrame").style.top ="103px";
    InviaRichiesta2(this,"CALCOLA_MUTUO_ONLINE",1);
}

function InviaRichiesta2(theForm,fonte,flag){

  if (!flag){
    var r=InviaMOL(theForm);
    if (!r){
      return r;
    }
    
  }
   
  var oAjax = new getMEAjaxObj();
  var url = "/statisticaLeadMutuo.php?fonte="+fonte;

  if (flag==1){  // Dal calcola nuovo
      oAjax.Request('POST',url, function InviaRichiestaH2vuoto(){});
      return null;
  }
  if (flag==2){  // Calcola vecchio
    oAjax.Request('POST',url, InviaRichiestaH2);
  }
  if (flag==0){  // Dalla form in overlay
    oAjax.Request('POST',url, function InviaRichiestaH3vuoto(){});
  }
  return null;

}

function InviaRichiestaH2(){
     location.href="/casa/informazioni/cerchi_mutuo.php"
}

//<!-- FINE Sezione 6: aggiornamento campi hidden -->		


var formMutuiOnLine="<div id=\"MutuiOnLine\"  style=\"float:left; overflow:hidden;padding-top: 03px;\">\
  <form method=\"post\" name=\"modulo\" onSubmit=\"return InviaRichiesta2(this,'CALCOLA_MUTUO_MOSTRAMI_MUTUI_ONLINE',0);\"\
	action=\"http://www.mutuionline.it/richiedi/ricerca/core/formcompleto_elab.asp?pop=0&textCodiceReferrer=Eurekasa_form&utm_source=Eurekasa&utm_medium=referral_form&utm_campaign=Eurekasa\"\
	target=\"_blank\">\
    <input type=\"hidden\" name=\"TettoMassimo\" value=\"0\">\
    <input type=\"hidden\" name=\"PianoRimborso\" value=\"1\">\
    <input type=\"hidden\" name=\"CodiceDisponibilita\" value=\"1\">\
    <input type=\"hidden\" name=\"CodiceProbabilita\" value=\"1\">\
    <input type=\"hidden\" name=\"AnniProbabilita\" value=\"0\">\
    <input type=\"hidden\" name=\"ImportoMassimo\" >\
    <input type=\"hidden\" name=\"EuroMilioni1\" value=\"Euro\">\
    <input type=\"hidden\" name=\"EuroMilioni2\" value=\"Euro\">\
    <input type=\"hidden\" name=\"CodiceTipoValore\" value=2>\
    <input type=\"hidden\" name=\"PeriodoMinimo\" value=\"0\">\
    <input type=\"hidden\" name=\"CodiceEffettivaErogazione\" value=\"1\">\
    <input type=\"hidden\" name=\"CodiceBanca\" size=\"1\" value=\"0\">\
    <img src=\"/img2/mutuionline/mol_header.gif\" width=\"500\" height=\"128\" alt=\"\" border=\"0\"><br>\
    <div sstyle=\"width: 504px;  background-color: #d2e8ff;  border-color: #8bb4d7;	 border-width: 0px 1px 0px 1px;border-style: solid;\">\
      <table width=\"500\" height=\"307\" border=\"0\"  cellpadding=\"0\" cellspacing=\"0\" id=\"formmol\" >\
	<tr>\
	  <td class=\"sxmol\">Finalit&agrave; del mutuo</td>\
	  <td width=\"310\" class=\"dxmol\">\
	    <select name=\"CodiceFinalita\" size=\"1\" class=\"campo_smmol\">\
	      <option value=\"\">-------------------</option>\
	    </select>\
	  </td>\
	</tr>\
	<tr>\
	  <td class=\"sxmol\">Tipo di tasso</td>\
	  <td width=\"310\" class=\"dxmol\">\
	    <span class=\"sxmol\">\
	      <select class=\"campo_smmol\" name=\"CodiceTipoTasso\" size=\"1\">\
		<option value=\"0\">---------</option>\
	      </select>\
	    </span>\
	  </td>\
	</tr>\
	<tr>\
	  <td class=\"sxmol\">Valore immobile</td>\
	  <td width=\"310\" class=\"dxmol\">\
	    <input type=\"text\" name=\"Valore\" size=\"6\" value=\"\" maxlength=\"7\" class=\"campo_smmol\"/>&nbsp;Euro\
	  </td>\
	</tr>\
	<tr>\
	  <td class=\"sxmol\">Importo del mutuo</td>\
	  <td width=\"310\" class=\"dxmol\">\
	    <input class=\"campo_smmol\" name=\"ImportoMutuo\" size=\"6\" maxlength=\"7\"/>&nbsp;Euro\
	  </td>\
	</tr>\
	<tr>\
	  <td class=\"sxmol\"> Durata del mutuo</td>\
	  <td width=\"310\" class=\"dxmol\">\
	    <select class=\"campo_smmol\" size=\"1\" name=\"CodiceDurata\">\
	      <option value=\"0\" selected>--</option>\
	      <option value=\"5\" >5</option>\
	      <option value=\"7\" >7</option>\
	      <option value=\"10\" >10</option>\
	      <option value=\"12\" >12</option>\
	      <option value=\"15\" >15</option>\
	      <option value=\"20\" >20</option>\
	      <option value=\"25\" >25</option>\
	      <option value=\"30\" >30</option>\
	      <option value=\"35\" >35</option>\
	      <option value=\"40\" >40</option>\
	    </select>&nbsp;anni\
	  </td>\
	</tr>\
	<tr>\
	  <td class=\"sxmol\">Frequenza rate</td>\
	  <td width=\"310\" class=\"dxmol\">\
	    <select name=\"CodiceFrequenza\" size=\"1\" class=\"campo_smmol\">\
	      <option value=\"0\">--------------</option>\
	      <option  value=\"1\">Mensile</option>\
	      <option  value=\"3\">Trimestrale</option>\
	      <option  value=\"5\">Semestrale</option>\
	    </select>\
	  </td>\
	</tr>\
	<tr>\
	  <td class=\"sxmol\">Et&agrave; del richiedente<br></td>\
	  <td width=\"310\" class=\"dxmol\">\
	    <input type=\"text\" name=\"Eta\" size=\"2\" maxlength=2 value=\"\" class=\"campo_smmol\"/>&nbsp;anni\
	  </td>\
	</tr>\
	<tr>\
	  <td class=\"sxmol\">Impiego richiedente</td>\
	  <td width=\"310\" class=\"dxmol\">\
	    <select name=\"CodCategoriaReddituale\" id=\"CodCategoriaReddituale\" size=\"1\" class=\"campo_smmol\">\
	      <option value=\"0\">-------------------</option>\
	      <option  value=\"1\">Dipendente a tempo indet.</option>\
	      <option  value=\"4\">Autonomo con P.IVA</option>\
	      <option  value=\"5\">Titolare ditta</option>\
	      <option  value=\"6\">Professionista iscritto Albo</option>\
	      <option  value=\"8\">Pensionato</option>\
	      <option  value=\"7\">Rendita da partecipazioni</option>\
	    </select>\
	  </td>\
	</tr>\
	<tr>\
	  <td class=\"sxmol\">Reddito dei richiedenti</td>\
	  <td width=\"310\" class=\"dxmol\">\
	    <input  type=\"text\" name=\"Reddito\" size=\"10\" maxlength=10 value=\"\" class=\"campo_smmol\"/>&nbsp;Euro\
	  </td>\
	</tr>\
	<tr>\
	  <td class=\"sxmol\">Domicilio del richiedente</td>\
	  <td width=\"310\" class=\"dxmol\">\
	    <select name=\"CodiceResidenza\" size=\"1\" class=\"campo_smmol\">\
	      <option value=\"0\">-------------------</option>\
	    </select>\
	  </td>\
	</tr>\
	<tr>\
	  <td class=\"sxmol\">Provincia dell&rsquo;immobile<br></td>\
	  <td width=\"310\" class=\"dxmol\">\
	    <span>\
	      <select name=\"CodiceLocalita\" size=\"1\" class=\"campo_smmol\">\
		<option value=\"0\">-------------------</option>\
	      </select>\
	    </span>\
	  </td>\
	</tr>\
	<tr>\
	  <td colspan=\"2\" align=\"center\" bgcolor=\"#DDDDDD\">\
	    <input type=\"image\" name=\"Submit\" src=\"/img2/mutuionline/but_mostrami_on.gif\" style=\"margin-top: 7px; color:#CCCCCC;border:0px\" />\
	  </td>\
	</tr>\
      </table>\
      <img src=\"/img2/mutuionline/mol_footer.gif\" width=\"500\" border=\"0\" style=\"vertical-align:top\"/>\
    </div>\
    <table  width=\"504\" id=\"footermol\">\
      <tr>\
	<td colspan=\"4\" style=\"background-color: #FFFFFF; border-width: 0px; color: #aaaaaa;\"  align=\"center\" >\
	  <a style=\"text-decoration: none; color: #aaa;cursor:default;\">MutuiOnline S.p.A.</A> - Cap. Soc. 1.000.000 Euro<br>mediatore creditizio iscritto all&rsquo;albo U.I.C. (n°235)\
	</td>\
      </tr>\
    </table>\
  </form>\
  <!-- corpo centrale -->\
  <!-- INIZIO Sezione 9: caricamento combo -->\
</div><div class=\"clear\"></div>";






