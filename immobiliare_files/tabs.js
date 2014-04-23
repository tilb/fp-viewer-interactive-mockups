function ResetTabBtns(section_id,btn_class) {
  var btns = getElementsByClass(btn_class,document.getElementById(section_id));
  for (var i=0;i<btns.length;i++){
	btns[i].className=btn_class;
	btns[i].selected = false;
  }
}

function ResetTabDivs(section_id,tab_class) {

  var tabs = getElementsByClass(tab_class,document.getElementById(section_id));
  
  for (var i=0;i<tabs.length;i++){
	tabs[i].style.display="none";
  }
}

function ShowTab(section_id,tab_id,btn_id,extraEvent,sContentTabClassName) {
   //eccezione introdotta per dettaglio progetto dove i tabs menu sono due, e quindi mi trovo con i tab container dei due menu che hanno la stessa classe.
    if(typeof sContentTabClassName == 'undefined'){
      var sTabDiv = "tab_div";
      var sTabBtn = "tab_selector";
    }
    else{
      var sTabDiv = sContentTabClassName;
      var sTabBtn = sContentTabClassName+"_tab_selector";
    }
    /*fine eccezione*/
    if (typeof btn_id!="undefined" && btn_id)
      selectTabBtn(section_id,btn_id,sTabBtn);
    if (typeof tab_id!="undefined" && tab_id)
      selectTabDiv(section_id,tab_id,sTabDiv);  
    if (typeof extraEvent!="undefined" && extraEvent)
	extraEvent();
	
}

function selectTabDiv(section_id,tab_id,tab_class){
  ResetTabDivs(section_id,tab_class);
  document.getElementById(tab_id).style.display= "block";
}

function selectTabBtn(section_id,btn_id,btn_class){
  ResetTabBtns(section_id,btn_class);
  document.getElementById(btn_id).className = btn_class+" act";
  document.getElementById(btn_id).selected = true;
}

//cambia i il contenuto dei tabs visualizzati nella lista annunci e setta il relativo cookie
function fnChangeContentTab(sDiv){
	document.getElementById('risultati').style.display = 'none';
	document.getElementById(sDiv).style.display='block';
	sLastTabOpened = sDiv;
	createCookie("OpenTab",sLastTabOpened);
	return true;
}

/*gestione rollover menu*/
function fnRollUpMenu(sTabName,sSectionName,sLordTab,sRordTab){
   //controllo per vedere quale immagine devo usare, distinzione primo tab a sx
	
	try{
	  document.getElementById(sSectionName+"_btn").firstChild.visibility="hidden";
	  document.getElementById(sSectionName+"_btn").firstChild.style.backgroundPosition = "center -35px";
	  document.getElementById(sSectionName+"_btn").firstChild.visibility="visible";
	}catch(e){
	  if(sSectionName != 'pubblica_annuncio' || sSectionName != 'news')
		document.getElementById(sSectionName+"_btn").style.color = "#000";
	}
	
    if(typeof sLordTab != 'undefined' && sLordTab == 'first')
	  document.getElementById("l-"+sSectionName).style.backgroundImage = "url(/img2/header_images/menu/menublu-tondo-selezionato-sx.gif)";
    else
	document.getElementById("l-"+sSectionName).style.backgroundImage = "url(/img2/header_images/menu/menublu-selezionato-sx.gif)";    
    
    //controllo per vedere quale immagine devo usare, distinzione ultimo tab a dx 
    if(typeof sRordTab != 'undefined' && sRordTab == 'last')
      document.getElementById("r-"+sSectionName).style.backgroundImage = "url(/img2/header_images/menu/menublu-tondo-selezionato-dx.gif)";
    else
	document.getElementById("r-"+sSectionName).style.backgroundImage = "url(/img2/header_images/menu/menublu-selezionato-dx.gif)";
    document.getElementById(sSectionName+"_btn").style.backgroundImage = "url(/img2/header_images/menu/menublu-fondo-selezionato.gif)";
	
	idSpanTabName="multi_tab_"+sTabName;
	if (app=document.getElementById(idSpanTabName)){
	    app.style.color="#000";
	}
}

function fnRollOutMenu(sTabName,sSectionName,sLordTab,sRordTab){
    //controllo per vedere quale immagine devo usare, distinzione primo tab a sx 
    if(typeof sLordTab != 'undefined' && sLordTab == 'first'){
	if(sTabName == 'pubblica_annunci' || sTabName == 'news' || sTabName == 'answers')
	 document.getElementById("l-"+sSectionName).style.backgroundImage = "url(/img2/header_images/menu/pulsanteazzurro-tondo-sx.gif)";
	else
	  document.getElementById("l-"+sSectionName).style.backgroundImage = "url(/img2/header_images/menu/menublu-tondo-deselezionato-sx.gif)";
    }
    else
	document.getElementById("l-"+sSectionName).style.backgroundImage = "url(/img2/header_images/menu/menublu-fondo-deselezionato.gif)";
    
    //controllo per vedere quale immagine devo usare, distinzione ultimo tab a dx 
    if(typeof sRordTab != 'undefined' && sRordTab == 'last'){
       if(sTabName == 'pubblica_annunci'|| sTabName == 'news' || sTabName == 'answers')
	  document.getElementById("r-"+sSectionName).style.backgroundImage = "url(/img2/header_images/menu/pulsanteazzurro-tondo-dx.gif)";
      else
	document.getElementById("r-"+sSectionName).style.backgroundImage = "url(/img2/header_images/menu/menublu-tondo-deselezionato-dx.gif)";
    }
    else
	document.getElementById("r-"+sSectionName).style.backgroundImage = "url(/img2/header_images/menu/menublu-fondo-deselezionato.gif)";
	
       if(sTabName == 'pubblica_annunci' || sTabName == 'news' || sTabName == 'answers')
	  document.getElementById(sSectionName+"_btn").style.backgroundImage = "url(/img2/header_images/menu/pulsanteazzurro-fondo.gif)";
      else
	 document.getElementById(sSectionName+"_btn").style.backgroundImage = "url(/img2/header_images/menu/menublu-fondo-deselezionato.gif)";
	try{
	  document.getElementById(sSectionName+"_btn").firstChild.style.backgroundPosition = "center bottom";
	  
	}catch(e){
	   if(sSectionName == 'pubblica_annuncio' || sSectionName == 'news' || sTabName == 'answers') 
           document.getElementById(sSectionName+"_btn").style.color="#000"; 	 	 
         else 	 	 
           document.getElementById(sSectionName+"_btn").style.color="#FFF"; 
	}

	idSpanTabName="multi_tab_"+sTabName;
	if (app=document.getElementById(idSpanTabName)){
	    app.style.color="#fff";
	}
	  
}

function chooseView(view, action){
  if (typeof deselectClickedAd != "undefined")
	deselectClickedAd();
  //cambio campo hidden del form di raffina ricerca	
  if (document.getElementById("typeView"))
		document.getElementById("typeView").value = view;
  if (view == "mapContainer"){
	if (action == 'reload') {
	  createCookie("OpenTab",view);
	  var url = document.location.href;
	  url = url.replace('.html', '.mappa.html');
	  ShowTab('risultati_ricerca',null,"tab_btn_"+view,function(){  window.location.href = url;});
	  return true;
	} else {	  
	  document.getElementById("risultati").style.display = 'none';
	  if (document.getElementById("mapLegend"))
		document.getElementById("mapLegend").style.display = 'block';
	  ShowTab('risultati_ricerca',null,"tab_btn_"+view,function(){  apriMappa();});  
	  return fnChangeContentTab(view);
	}
  }
 
  return true;
  
}

function apriMappa(){
  try{
	showMappa('mapContainer',0);
  }catch(e){
	if (typeof map_timer != "undefined")
	  clearTimeout(map_timer);
    map_timer = setTimeout("apriMappa()",1000);		
  }
}


//replica della fnChangeTabImg di tools_image_lotti.js
//cambia le icone dei tabs della tabella tipologie dettaglio nuove costruzioni
	function fnChangeTabImgUp(sDivTab,iTabOpen){
		//calcolo il nuovo tab da aprire e verifico che non sia già aperto
		oTabOpen = sDivTab;
		sPattern=/(.*)([0-9]$)/;
		array = oTabOpen.match(sPattern);
		var sImgTabName=array[1];
		iNewTabOpenUp = array[2];
		if(iNewTabOpenUp != iLastTabOpenUp){
			//attivo l'immagine del tab selezionato
			var oTabSelected = document.getElementById("img_"+sDivTab);
			var sIconTabSelected = oTabSelected.src;
			var sPattern=/[^-][a-zA-Z]*[.][a-zA-Z]*$/;
			var array = sIconTabSelected.split(sPattern);
			oTabSelected.src = array[0]+"selezionata.png";
			//disattivo l'immagine del tab che verrà chiuso
			oTabClosed = document.getElementById("img_"+sImgTabName+iLastTabOpenUp);
			sIconTabClosed = oTabClosed.src;
			sPattern=/[^-][a-zA-Z]*[.][a-zA-Z]*$/;
			array = sIconTabClosed.split(sPattern);
			oTabClosed.src = array[0]+"deselezionata.png";
			//aggiorno il flag del tab aperto
			iLastTabOpenUp = iNewTabOpenUp;
		}
	}
	
	function activateTab(btn){
		if (btn.className.search(/act/)<0){
				btn.className = btn.className.replace(btn.className,btn.className + " act over")
				btn.onmouseout = deActivateTab;
		}
	}
	function deActivateTab(){
		if (this.selected != true)
		  this.className = this.className.replace(" act over", "");
	}
	
	
  function openListTab(which,category,reloadPage){
	  var tab = document.getElementById('tab_btn_'+which);
	  
	  if (typeof reloadPage == "undefined")
		  reloadPage = false;
		  
	  if (chooseView(which,reloadPage)){
		  if (typeof tab.tracked == "undefined" || !tab.tracked){
			  trackType = null;
			  switch (which){
				  case "Lista": 
					  trackType = "lista";
					  break;
				  case "mapContainer": 
					  trackType = "mappa";
					  break;
			  }
			  //if (trackType)
				  trackClickEvent(trackType,category);tab.tracked=true;return false;
		  }
		  tab.tracked = true;
	  }
  }
//questa funzione è lanciata:
//ogni volta che si carica la pagina di ricerca (@classe è undefined);
//ogni volta che si clicca sui tabs Lista/Fotogallery (@classe == listaAnnunci/fgAnnunci)
__selectedTab='lista';
function annunciContainerChange (classe){

  __selectedTab='lista';
  if(typeof(classe)=='undefined'){
	 _listTypeCookie = readCookie("OpenTab");
	 
	if (!_listTypeCookie || _listTypeCookie=='mapContainer' ){
	  createCookie("OpenTab","listaAnnunci");
	  _listTypeCookie = readCookie("OpenTab");
	}
	
	classe = _listTypeCookie;
  }

  if (classe == "fgAnnunci")
	  __selectedTab='fotogallery';
  else
  if (classe == "listaAnnunci"){
	  __selectedTab='lista';
  }

  ShowTab('risultati_ricerca',null,'tab_btn_'+classe);
  if (document.getElementById("typeView"))
		document.getElementById("typeView").value = classe;
  jq('#mapContainer').css({'display':'none'});
  jq('#risultati, #annunciContainer').css({'display':'block'});
  jq('#annunciContainer').attr('class',classe);
  createCookie("OpenTab",classe);
  return true;
}
