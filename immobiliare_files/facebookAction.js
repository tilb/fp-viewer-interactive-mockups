/**
 * Facebook Like Action
 */

var facebookAction = function(oOptions)
{
	if (typeof oOptions == 'undefined')
		this.options = new Object();
	else
		this.options = oOptions;
	
	this.prefix = '';
	if ( typeof oOptions != 'undefined' && typeof oOptions.prefix != 'undefined' )
		this.prefix = oOptions.prefix;
	
	this.ajaxBaseUrl 	= '/FBOpenGraph_SendAction.php';
	this.cookie_action 	= 'actionAD';
	this.cookie_sync 	= 'syncUSER';
	
	this.errorMsg = (typeof this.options.errorMsg != 'undefined') ? this.options.errorMsg : false;
	
	this.fbImagesLove = null;
	
	this.boxLogin = this.createOverlayBox();
}

facebookAction.prototype.createOverlayBox = function(){

	//if (typeof this.boxLogin == "undefined"){
		this.boxLogin = new boxOverlay('login_facebook', 'grey');
	//}

	this.boxLogin.destroyOnClose = false;
	this.SSOLoginOpened = false;
	return this.boxLogin;
}

facebookAction.prototype.doAction = function(action, idAnnuncio, idImg)
{
	switch(action)
	{
		case 'love':
		case 'unlove':
			this.fnActionImagesAds( action, idAnnuncio, idImg );	
		break;
		case 'like':
		case 'unlike':
		case 'publish':
		case 'unpublish':
		case 'save':
		case 'unsave':
			this.fnActionAnnuncio(action, idAnnuncio);
			break;
		case 'sync':
			this.SSOLoginOpened = false;
			this.fnSyncUser('sync_failed_actions');			
			this.fnSyncUser('sync_save');
			this.fnSyncUser('sync_like');
			this.fnSyncUser('sync_love');
			this.fnSyncUser('sync_publish');
			break;
		case 'sync_publish':
		case 'sync_save':
		case 'sync_like':
		case 'sync_love':
			this.fnSyncUser(action);
			break;
	}
}

facebookAction.prototype.fnSyncUser = function(action)
{
	if ( document.getElementById( this.prefix+'count_'+action) )
		document.getElementById( this.prefix+'count_'+action).innerHTML = '<img class="ico_fb_loader" src="/img2/loader7.gif" />';
	var requestUrl = this.ajaxBaseUrl+"?action="+action;
	
	var oAjax = new getMEAjaxObj();
	oAjax.Request('GET', requestUrl, function(data){ this.fnResultSyncRequest(data); }.bind(this));
	return;
}

facebookAction.prototype.fnActionAnnuncio = function(action, idAnnuncio)
{
	this.switchIcon(action, idAnnuncio);
	var requestUrl = this.ajaxBaseUrl+"?action="+action+"&idAnnuncio="+idAnnuncio;
	
	var oAjax = new getMEAjaxObj();
	oAjax.Request('GET', requestUrl, function(data){ this.fnResultActionRequest(data); }.bind(this));
	return;
}

facebookAction.prototype.fnActionImagesAds = function( action, idAd, imgid ) {
	this.switchIcon( action, imgid );
	var requestUrl = this.ajaxBaseUrl+"?action="+action+"&imgid="+imgid+"&idAnnuncio="+idAd;
	
	var oAjax = new getMEAjaxObj();
	oAjax.Request('GET', requestUrl, function( data ){ this.fnResultActionRequest(data); }.bind (this ) );
	return;
}

facebookAction.prototype.fnResultActionRequest = function(response)
{
	var xmlDoc = response.responseXML;
	if (xmlDoc){
		var oStatus 	= xmlDoc.getElementsByTagName("status");
		var oAction 	= xmlDoc.getElementsByTagName("action");
		var oAnnuncio 	= xmlDoc.getElementsByTagName("idAnnuncio");
		var oImmagine	= typeof xmlDoc.getElementsByTagName("idImmagine") != 'undefined' ? xmlDoc.getElementsByTagName("idImmagine") : '';
		var oMessage 	= xmlDoc.getElementsByTagName("message");
		var oErrCode 	= xmlDoc.getElementsByTagName("errorCode");
		
		var status 		= oStatus[0].childNodes[0].nodeValue;
		var action 		= oAction[0].childNodes[0].nodeValue;
		var idAnnuncio 	= oAnnuncio[0].childNodes[0].nodeValue;
		var idImmagine 	= (typeof oImmagine[0].childNodes[0] != 'undefined' && oImmagine[0].childNodes[0]) ? oImmagine[0].childNodes[0].nodeValue : '';
		var message 	= (typeof oMessage[0].childNodes[0] != 'undefined' && oMessage[0].childNodes[0]) ? oMessage[0].childNodes[0].nodeValue : '';
		var errorCode 	= (typeof oErrCode[0].childNodes[0] != 'undefined' && oErrCode[0].childNodes[0]) ? oErrCode[0].childNodes[0].nodeValue : '';
		
		switch(status)
		{
			case 'ok':
				this.onSuccessAction(action, idAnnuncio);
				break;
			case 'wait_publish':
				var oEl = document.getElementById( this.prefix+'facebookAction_'+idAnnuncio);
				if (typeof oEl != "undefined" && oEl) {
					MEshow(oEl);
					oEl.onclick = function() { };
					oEl.className = 'btn_fb_attesa';
					var oElStatus = document.getElementById( this.prefix+'facebookStatus_'+idAnnuncio);
					if (oElStatus) {
						oElStatus.innerHTML = message;
					}
				}
				break;
			case 'need_login':
			case 'need_connectAccount':
			case 'need_newtoken':
					var options = {'status':status};
					var id = typeof idImmagine != 'undefined' ? {'idImmagine' : idImmagine, 'idAnnuncio' : idAnnuncio} : idAnnuncio;
					this.onLogin( action, id, options );
					if ( action == 'love' || action == 'unlove' ) {
						this.fbImagesLove = new FbImagesLove( 'dettaglio' );

						if (typeof idImmagine != "undefined")
							this.fbImagesLove.errorAction( action, idImmagine );
					}
				break;
			case 'error':
				this.onErrorAction(action, idImmagine, errorCode, message);
				break;	
			default:
				break;
		}
	}
}

facebookAction.prototype.fnResultSyncRequest = function(response)
{
	var xmlDoc = response.responseXML;
	if (xmlDoc){
		var oStatus 	= xmlDoc.getElementsByTagName("status");
		var oAction 	= xmlDoc.getElementsByTagName("action");
		var oCount 		= xmlDoc.getElementsByTagName("count");
		var oMessage 	= xmlDoc.getElementsByTagName("message");
		
		var status 		= oStatus[0].childNodes[0].nodeValue;
		var action 		= oAction[0].childNodes[0].nodeValue;
		var count 		= (typeof oCount[0] != 'undefined' && typeof oCount[0].childNodes[0] != 'undefined' && oCount[0].childNodes[0]) ? oCount[0].childNodes[0].nodeValue : '';
		var message		= (typeof oMessage[0] != 'undefined' && typeof oMessage[0].childNodes[0] != 'undefined' && oMessage[0].childNodes[0]) ? oMessage[0].childNodes[0].nodeValue : '';
		
		MEhide('FBloader_'+action);
		
		switch(status)
		{
			case 'ok':
				this.onSuccessSync(action, count);
				break;
			case 'need_newtoken':
			case 'need_login':
			case 'need_connectAccount':
				var options = {extraUrlPars:'context=openGraph','status':status};
				this.onLogin(action,'', options);
				break;
			case 'error':
				this.onErrorSync(action);
				break;
			default:
				break;
		}
	}
}

facebookAction.prototype.onSuccessAction = function (action, idAnnuncio)
{
	switch(action)
	{
		case 'like':
			var oEl = document.getElementById( this.prefix+'fbActionLike_'+idAnnuncio);
			if (typeof oEl != "undefined" && oEl) {
				oEl.className = 'ico_fb_liked';
				oEl.onclick = function() { this.doAction('unlike', idAnnuncio) }.bind(this);
			}
			break;
		case 'unlike':
			if ( document.getElementById( this.prefix+'fbActionLike_'+idAnnuncio) )
				document.getElementById( this.prefix+'fbActionLike_'+idAnnuncio).onclick = function() { this.doAction('like', idAnnuncio) }.bind(this);
			break;
		case 'publish':
			var plsAction = jq('#'+this.prefix+'facebookAction_'+idAnnuncio);
			if (document.getElementById( this.prefix+'facebookStatus_'+idAnnuncio))
				document.getElementById( this.prefix+'facebookStatus_'+idAnnuncio).innerHTML = 'Complimenti! Il tuo annuncio &egrave; stato pubblicato sulla tua bacheca.';
			if( !jq.isEmpty( plsAction ) && jq( plsAction ).hasClass('loaderFb'))
				jq( plsAction ).fadeOut(200);
			break;
		case 'save':
			if ( document.getElementById( this.prefix+'fbActionSave_'+idAnnuncio) ) {
				document.getElementById( this.prefix+'fbActionSave_'+idAnnuncio).onclick = function() { };
				this.doAction('sync_save');
			}
			break;
		default:
			break;
	}
}

facebookAction.prototype.onSuccessSync = function (action, count)
{
	switch(action)
	{
		case 'sync_like':
		case 'sync_publish':
		case 'sync_save':
		case 'sync_love':
			if (document.getElementById( this.prefix+'count_'+action)) {
				document.getElementById( this.prefix+'count_'+action).innerHTML = count;
			}
			MEshow('status_'+action);
			MEhide('status_sync');
			break;
		default:
			break;
	}
}

facebookAction.prototype.onLogin = function(action, id, options)
{  
	switch(action)
	{
		case 'love':
		case 'unlove':
			var nameCookie = this.cookie_action;
			var valueCookie = '{"action":"'+action+'", "idAnnuncio":"'+id['idAnnuncio']+'", "idImmagine":"'+id['idImmagine']+'"}';	
			//var options = { 'singleSignOn': true };
			this.createBoxLogin(nameCookie, valueCookie, options);
			this.boxLogin.addEventOnClose( function(){ deleteCookie(nameCookie); this.onErrorAction(action, id['idImmagine']) }.bind(this) );
		break;		
		case 'like':
		case 'unlike':
		case 'publish':
		case 'unpublish':
		case 'save':
		case 'unsave':
			var nameCookie = this.cookie_action;
			var valueCookie = '{"action":"'+action+'", "idAnnuncio":"'+id['idAnnuncio']+'"}';			
			this.createBoxLogin(nameCookie, valueCookie, options);
			this.boxLogin.addEventOnClose( function(){ deleteCookie(nameCookie); this.onErrorAction(action, id) }.bind(this) );
			break;
		case 'sync_like':
		case 'sync_publish':
		case 'sync_save':
		case 'sync_love':
			MEshow('status_sync');
			this.onErrorSync(action);
			break;
	}
}

facebookAction.prototype.onErrorSync = function(action)
{
	if ( document.getElementById( this.prefix+'count_'+action) )
		document.getElementById( this.prefix+'count_'+action).innerHTML = '0';
}

facebookAction.prototype.onErrorAction = function(action, id, errorCode, message)
{
	switch(action)
	{
		case 'love':
		case 'unlove':
			this.fbImagesLove = new FbImagesLove( 'dettaglio' );
			this.fbImagesLove.errorAction( action, id );
			break
		case 'like':
			var oEl = document.getElementById( this.prefix+'fbActionLike_'+id);
			if (typeof oEl != "undefined" && oEl) {
				oEl.className = 'ico_fb_like';
				oEl.onclick = function() { this.doAction('like', id) }.bind(this);
			}
			break;
		case 'unlike':
			var oEl = document.getElementById( this.prefix+'fbActionLike_'+id);
			if (typeof oEl != "undefined" && oEl) {
				oEl.className = 'ico_fb_liked';
				oEl.onclick = function() { this.doAction('unlike', id) }.bind(this);
			}
			break;
		case 'save':
			var oEl = document.getElementById( this.prefix+'fbActionSave_'+id);
			if (typeof oEl != "undefined" && oEl) {
				oEl.onclick = function() { this.doAction('save', id) }.bind(this);
				if (document.getElementById( this.prefix+'facebookStatus_'+id)) {
					document.getElementById( this.prefix+'facebookStatus_'+id).innerHTML = 'Salva';
					document.getElementById( this.prefix+'facebookStatus_'+id).className = 'ico_fb_save';
				}
			}
			break;
		case 'publish':
			var oEl = document.getElementById( this.prefix+'facebookAction_'+id);
			if (typeof oEl != "undefined" && oEl) {
				oEl.onclick = function() { this.doAction('publish', id); }.bind(this);
				MEshow(oEl);
			}
			break;
		default:
			break;
	}
	if (typeof errorCode != 'undefined' && typeof message != 'undefined')
		this.showInfoBox(errorCode, message);
}

facebookAction.prototype.checkIfFacebookActionAd = function()
{
	try{		
		var actionAnnuncio = readCookie(this.cookie_action);
		obj = jQuery.parseJSON( actionAnnuncio );
		
		var syncUser = readCookie(this.cookie_sync);
		deleteCookie(this.cookie_action);
		deleteCookie(this.cookie_sync);
		if ( obj ) {
			switch( obj['action'] ) {
				case 'love' :
				case 'unlove' :
					this.doAction( obj['action'], obj['idAnnuncio'], obj['idImmagine'] );
					this.fbImagesLove = new FbImagesLove( 'dettaglio' );
					this.fbImagesLove.changeStatusImage( ( obj['action'] == 'love' ? 1 : 0 ) );
				break;
				default: 
					this.doAction( obj['action'], obj['idAnnuncio'] );
				break;
			}			
		} else if ( syncUser ) {
			this.fnSyncUser(syncUser);
		}
	}catch(e){
		deleteCookie(this.cookie_action);
		deleteCookie(this.cookie_sync);
	}
}

facebookAction.prototype.switchIcon = function(action, idAnnuncio)
{
	switch(action)
	{
		case 'like':
			var oEl = document.getElementById( this.prefix+'fbActionLike_'+idAnnuncio);
			if (typeof oEl != "undefined" && oEl) {
				oEl.className = 'ico_fb_liking';
				oEl.onclick = function() { };
			}
			break;
		case 'unlike':
			var oEl = document.getElementById( this.prefix+'fbActionLike_'+idAnnuncio);
			if (typeof oEl != "undefined" && oEl) {
				oEl.className = 'ico_fb_like';
				oEl.onclick = function() { };
			}
			break;
		case 'publish':
			var oEl = document.getElementById( this.prefix+'facebookAction_'+idAnnuncio);
			if (typeof oEl != "undefined" && oEl) {
				oEl.onclick = function() { };
				jq(oEl).removeClass('btn_fb_pubblica').addClass('loaderFb');
			}
			break;
		case 'save':
			var oEl = document.getElementById( this.prefix+'fbActionSave_'+idAnnuncio);
			if (typeof oEl != "undefined" && oEl) {
				oEl.onclick = function() { };
				if (document.getElementById( this.prefix+'facebookStatus_'+idAnnuncio)) {
					document.getElementById( this.prefix+'facebookStatus_'+idAnnuncio).innerHTML = 'Salvato';
					document.getElementById( this.prefix+'facebookStatus_'+idAnnuncio).className = 'ico_fb_saved';
				}
			}
			break;
		default:
			break;
	}
}

facebookAction.prototype.createBoxLogin = function(nameCookie, valueCookie,options)
{
	var status = null;
	if (typeof options!="undefined" && typeof options.status != "undefined")
		status = options.status;
	this.createOverlayBox();
	this.boxLogin.setTitle('<div id="icona_login_utente"></div>');

	switch (status){
		case 'need_newtoken':

			if ( typeof options.singleSignOn != 'undefined' ) {
				createCookie( nameCookie, valueCookie); 
				SSOLogin( "facebook","oauth", {extraUrlPars:'context=openGraph', syncOpenGraph:true, forceClose:false, scope:'read_write'} );
				return true;
			}

			this.boxLogin.setContent(
			"<div style='width:390px;padding:10px 0px 20px 5px;color:#666;'>"+
				"<img style='float:left;margin-right:15px;' src='/img2/icona_immobiliare_60X60.gif'/>"+
				"<strong style='font-size:15px;'>Pubblica su Facebook</strong><br />"+
				"Per poter eseguire l'operazione richiesta su Facebook &egrave; necessario autorizzare Immobiliare.it a pubblicare sulla tua timeline.<br />"+
					"<a id='autorizzazioneFb' style='margin-top:10px; float:right;' class='link_blu hoverUnderline'>Clicca per autorizzare!</a>"+
				"<div class='clear'></div>"+
			"</div>");
			jq( '#autorizzazioneFb' ).click( function() {
				createCookie( nameCookie, valueCookie);
				SSOLogin( "facebook","oauth", {extraUrlPars:'context=openGraph', syncOpenGraph:true, forceClose:false, facebook_scope:'read_write'} );
			});

			break;
		default:		
			if ( typeof options.singleSignOn != 'undefined' ) {
				createCookie( nameCookie, valueCookie); 
				SSOLogin( "facebook","oauth", "{extraUrlPars:'context=openGraph', syncOpenGraph:true, forceClose:false}" );
				return true;
			}
			this.boxLogin.setContent(
				"<div style='width:310px;padding:10px 0px 20px 5px;color:#666;'>"+
					"<img style='float:left;margin-right:15px;' src='/img2/icona_immobiliare_60X60.gif'/>"+
					"<strong style='font-size:15px;'>Accesso a Facebook</strong><br />"+
					"Per poter eseguire l'operazione richiesta &egrave; necessario accedere a Facebook.<br />"+
						"<a id='accessoFb' style='margin-top:10px; float:right;' class='link_blu hoverUnderline'>Clicca per eseguire l\'accesso!</a>"+
					"<div class='clear'></div>"+
				"</div>"
		
			);
			jq( '#accessoFb' ).click( function() {
				createCookie( nameCookie, valueCookie); 
				SSOLogin( "facebook","oauth", "{extraUrlPars:'context=openGraph', syncOpenGraph:true, forceClose:false}" );
			});
		break;
	}
	this.boxLogin.show();
}

facebookAction.prototype.showInfoBox = function(errorCode, message)
{
	if (errorCode == 100 && message != '') {
		boxInfo = new boxOverlay('facebook_message', 'grey');
		boxInfo.setTitle("<div id='icona_login_utente'></div>");
		var content =
			"<div style='width:300px;font-size:13px;color:#666;padding:10px 0px 20px 5px;'>"+
			"<img style='float:left;margin-right:15px;' src='/img2/icona_immobiliare_60X60.gif'/>"+
			"<strong style='font-size:15px;'>Attiva la Timeline di Facebook</strong><br />"+message+"</div>";
		boxInfo.setContent(content);
		boxInfo.destroyOnClose = true;
		boxInfo.show();
	}
}
