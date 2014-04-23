var siteForm = 'immobiliare.it'

closeBoxRichieste = function() {
    //Close popup
    var box = new boxOverlay("idBox","grey");
    box.close;
    document.getElementById('divBoxOverlay_Grey').style.display = 'none';     
}

getById = function( e ) {
    return document.getElementById(e); 
}

function popupRichiesteTrasloco( myParams, tipoPopup, section ) {
    var IE6 = (navigator.appVersion.indexOf('MSIE 6.')==-1) ? false : true;
    var IE7 = (navigator.appVersion.indexOf('MSIE 7.')==-1) ? false : true;
    var IE8 = (navigator.appVersion.indexOf('MSIE 8.')==-1) ? false : true;
    if ( IE6 || IE7 || IE8 ) {
      var heightIFrame = section == 'annunci_commerciali' ? '636px' : '513px';
    } else {
      var heightIFrame = section == 'annunci_commerciali' ? '684px' : '559px';
    }

    var urlIframe = section == 'annunci_commerciali' ? 'http://www.traslochi-online.it/iframe/7' : 'http://www.traslochi-online.it/iframe/6';
    
    var params = myParams != 'undefined' ? myParams : '';
    var imgPath = '/img2';
    var box = new boxOverlay("idBox","grey");
    var loader = "<div id='divStat' style='width:610px;height:"+heightIFrame+";'><div style='width:30px;margin: 10px auto;'><img src='"+imgPath+"/loader7.gif' /></div></div>";
    box.setTitle("<span class=\"titolo_annuncio\" style=\"margin-top:3px;margin-bottom:3px;margin-right:35px;color:#000000;font-size: 19px;\">Confronta preventivi traslochi. Risparmia fino al 30%!</span>");
    box.setContent(loader);
    box.show();
    document.getElementById('divStat').innerHTML= '<iframe width="612px" scrolling="no" height="'+heightIFrame+'" frameborder="0" style="z-index: 100000" src="'+urlIframe+'"></iframe>';
    box.destroyOnClose;
    box.hideOnlyBox;

    var category = 'ClickFormTrasloco';
    var action = 'FormDettaglioTrasloco';
    var opt_label = tipoPopup == 'linkDettaglio' ? 'Apertura Da Link Dettaglio' : 'Apertura Da Colonna Destra';
    _gaq.push(['_trackEvent', category, action, opt_label]);
    //_doLog("_gaq.push(['_trackEvent','"+category+"','"+ action+ "','"+opt_label+"']);");
    return false;
}

function popupRichiesteArtigiani( myParams, tipoPopup, section ) {

    var heightIFrame = "450px";
    var urlIframe = "http://www.artigiani-online.it/iframe/3-immobiliare-it";

    var params = myParams != 'undefined' ? myParams : '';
    var imgPath = '/img2';
    var box = new boxOverlay("idBox","grey");
    var loader = "<div id='divStat' style='width:615px;height:"+heightIFrame+";'><div style='width:30px;margin: 10px auto;'><img src='"+imgPath+"/loader7.gif' /></div></div>";
    box.setTitle("<span class=\"titolo_annuncio\" style=\"margin-top:3px;margin-bottom:3px;margin-right:35px;color:#000000;font-size: 19px;\">Risparmia fino al 30% sui preventivi degli artigiani!</span>");
    box.setContent(loader);
    box.show();
    document.getElementById('divStat').innerHTML= '<iframe width="612px" scrolling="no" height="'+heightIFrame+'" frameborder="0" style="z-index: 100000" src="'+urlIframe+'"></iframe>';
    box.destroyOnClose;
    box.hideOnlyBox;

    var category = 'ClickFormArtigiani';
    var action = 'FormDettaglioArtigiani';
    var opt_label = tipoPopup == 'linkDettaglio' ? 'Apertura Da Link Dettaglio' : 'Apertura Da Colonna Destra';
    _gaq.push(['_trackEvent', category, action, opt_label]);
    _doLog("_gaq.push(['_trackEvent','"+category+"','"+ action+ "','"+opt_label+"']);");
    return false;
}

