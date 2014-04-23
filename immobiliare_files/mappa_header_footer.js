function langMenuCtrl(action){
        
        var iF = document.getElementById("lanIframe");
        var menu = document.getElementById("langMenu");
        var banner_top = document.getElementById("banner_top");
        if (action == 'show'){
            if (menu)
                menu.style.display = "";
        }else{
            if (menu)
                menu.style.display = "none";
        }
        
    }
// 
// ----------------------------------------------------------------------
f_lingua=function(lang){
    switch (lang){
    case "it":
       lang_domain = "";
       break;
    case "es":
       lang_domain=lang_domain_es+'.';
	break;
    case "fr":
       lang_domain=lang_domain_fr+'.';
       break;
    case "en":
	lang_domain=lang_domain_en+'.';
	break;
    case "de":
	lang_domain=lang_domain_de+'.';
	break;
    case "pt":
	lang_domain=lang_domain_pt+'.';
	break;
    case "gr":
	lang_domain=lang_domain_gr+'.';
	break;
    case "ru":
	lang_domain=lang_domain_ru+'.';
	break;
    default:
	lang_domain = "";
       }
    location.href='http://'+lang_domain+url_sitemap_host;
} 

// 
// ------------------------------------------------------------------------------------------------------------------------------------

var cond_gen=null;
f_cond_gen=function(nome_file){

    cond_gen=new boxOverlay("id_cond_gen_"+lang,"grey");
    cond_gen.setTitle(""); //<span class=\"titolo_annuncio\" style=\"margin-top:3px;margin-bottom:3px\">"+Condizioni_generali+"</span>");
    
    var oAjax = new getMEAjaxObj();
    var url = "/"+nome_file;
    oAjax.Request('POST',url, f_cond_gen_h);
}

f_cond_gen_h=function(data){

   if (data.responseText!=null && data.responseText!=""){
    cond_gen.setContent(data.responseText);
   }else{
       cond_gen.setContent("Errore");
   }
   cond_gen.show();

   
   if(document.getElementById("close_id_cond_gen_"+lang)){
       document.getElementById("close_id_cond_gen_"+lang).innerHTML=Chiudi
   }

   if(document.getElementById("close_id_cond_gen_"+lang+"content")){
       document.getElementById("close_id_cond_gen_"+lang+"content").style.padding="0px";
   }
  
}

function slideDownLang(){
        lang_menu_timer = setTimeout("_slideDownLang(10)",500);
}
function resetMenu(){
		document.getElementById("menuCont").className = "";
}
function _slideDownLang(){
        //document.getElementById("langMenu").style.display="none";
		MEslideDown('langMenu',30);
		setTimeout("resetMenu()",500);
        if (document.getElementById('ordinamento_annunci'))
                document.getElementById('ordinamento_annunci').style.display = "";
}

function slideUpLang(){
        clear_lang_menu_timer();
        if (typeof lang_menu_timer == "undefined"){
            //è la prima volta che aprol il menu
                lang_menu_timer = null;
                addEvent(document.getElementById('apri_menu_lingue'),"mouseover",function(){slideUpLang()});
                addEvent(document.getElementById('apri_menu_lingue'),"mouseout",function(){slideDownLang();});
                addEvent(document.getElementById('langMenu'),"mouseover",function(){slideUpLang();});	
                addEvent(document.getElementById('langMenu'),"mouseout",function(){slideDownLang();});
                
        }
		document.getElementById("menuCont").className = "open";
		MEslideUp('langMenu',30);
        if (document.getElementById('ordinamento_annunci'))
                document.getElementById('ordinamento_annunci').style.display = "none";
        //document.getElementById("langMenu").style.display="block";
        
	
}

function clear_lang_menu_timer(){
        if (typeof lang_menu_timer!="undefined")
                clearTimeout(lang_menu_timer);
}

function create_menu_lingue(zone,lang){
	/*
		zone = menu_index (menu in alto) o menu_interno(pag ricerca)
	
	*/	
	document.write("\
	  <div id=\"menu_lingue\" class=\""+zone+"\">\
	      <div id=\"menuCont\" class=\"\">\
			<table style=\"width:100%\" cellspacing=\"0\" cellpadding=\"0\">\
			  <tr>\
			  <td class=\"left\">\
			  <\/td>\
			  <td class=\"center\">\
				<span id=\"accesso_utente_interno\" style=\"float:left;margin-left:0px;\">\
				"+content+"\
			    </span>\
				<div id=\"apri_menu_lingue\" onMouseOver=\"slideUpLang();\">\
				<div id=\"presentFlag\" class=\"");
				if(!lang){document.write("\">");}else{document.write(lang+"\">");}					
				document.write("<\/div><div id=\"langCount\" class=\"langCount\">");
			 document.write("</div>\
		    <div class=\"clear\"><\/div>\
			<\/td>\
			<td class=\"right\">\
			</td>\
			</tr>\
			<tr>\
			<td class=\"bottom left\">\
			<\/td>\
			<td class=\"bottom center\">\
			<\/td>\
			<td class=\"bottom right\">\
			<\/td>\
			<\/tr>\
			<\/table>\
			<\/div>\
			<div class=\"clear\"><\/div>\
		<div id=\"langMenu\" class=\"langMenu\" style=\"overflow:hidden;display:none;\">\
		<table style=\"float:right\" cellspacing=\"0\" cellpadding=\"0\">\
			  <tr>\
			  <td class=\"left\">\
			  <\/td>\
			  <td class=\"center\">\
		<div class=\"langCont\" >\
			    <div class=\"lang\" id=\"first_lang\"  onclick=\"f_lingua('it');\">");
			    if (lang=="it" || !lang)
				document.write("<strong>");
			    document.write("<span>&nbsp;Italiano&nbsp;&nbsp;<\/span>");
			    if (lang=="it" || !lang)
				document.write("</strong>");
			     document.write("<br \/>\
			<\/div><\/div>");
									       
			 document.write("<div class=\"langCont\" >\
					<div onclick=\"f_lingua('en');\" class=\"lang en\">");
				       if (lang == "en")
						document.write("<strong>");
					document.write("<span>&nbsp;English&nbsp;&nbsp;<\/span>");
					if (lang == "en")
						document.write("</strong>");
					document.write("<br \/>\
			<\/div><\/div>");              
								    
			 document.write("<div class=\"langCont\" >\
				  <div onclick=\"f_lingua('de');\" class=\"lang de\">");
				  if (lang == "de")
					document.write("<strong>");
				  document.write("<span>&nbsp;Deutsch&nbsp;&nbsp;<\/span>");
				  if (lang == "de")
					document.write("</strong>");
				document.write("<br \/>\
			<\/div><\/div>");              
									      
								 
			 document.write("<div class=\"langCont\" >\
					<div onclick=\"f_lingua('es');\" class=\"lang es\" >");
					if (lang == "es")
						document.write("<strong>");
					document.write("<span>&nbsp;Español&nbsp;&nbsp;<\/span>");
				       if (lang == "es")
						document.write("</strong>");
					document.write("<br \/>\
			</div><\/div>");
		    
			 document.write("<div class=\"langCont\" >\
					<div onclick=\"f_lingua('fr');\" class=\"lang fr\" >");
					if (lang == "fr")
						document.write("<strong>");
					document.write("<span>&nbsp;Français&nbsp;&nbsp;<\/span>");
					if (lang == "fr")
						document.write("</strong>");
					document.write("<br \/>\
			<\/div><\/div>");
		   
			 document.write("<div class=\"langCont\" >\
					<div onclick=\"f_lingua('gr');\" class=\"lang gr\" >");
					if (lang == "gr")
						document.write("<strong>");
					document.write("<span>&nbsp;Ελληνικά&nbsp;&nbsp;<\/span>");
				      if (lang == "gr")
						document.write("</strong>");
					document.write("<br \/>\
			<\/div><\/div>");                            
		  
			 document.write("<div class=\"langCont\" >\
					<div onclick=\"f_lingua('pt');\" class=\"lang pt\" >");
					if (lang == "pt")
						document.write("<strong>");
					document.write("<span>&nbsp;Português&nbsp;&nbsp;<\/span>");
					if (lang == "pt")
					document.write("</strong>");
				document.write("<br \/>\
			<\/div><\/div>");
		  
		   
			 document.write("<div class=\"langCont\" >\
			    <div onclick=\"f_lingua('ru');\" class=\"lang ru\" >");
			    if (lang == "ru")
				document.write("<strong>");
			document.write(" <span>&nbsp;Русский&nbsp&nbsp;&nbsp;<\/span>");
			 if (lang == "ru")
				document.write("</strong>");
			document.write("<br \/>\
			<\/div><\/div>");
		   
		document.write("<\/td>\
			<td class=\"right\">\
			</td>\
			</tr>\
			<tr>\
			<td class=\"bottom left\">\
			<\/td>\
			<td class=\"bottom center\">\
			<\/td>\
			<td class=\"bottom right\">\
			<\/td>\
			<\/tr>\
			<\/table>\
			<\/div>\
		<div class=\"clear\"><\/div>\
	    <div class=\"clear\"><\/div>\
	<\/div>");
}