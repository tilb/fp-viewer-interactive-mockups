/*
 * Galleria Overlay Immagini ver.1
 * Alessandro Pacifici
 * 16/12/2011
 **/

var Im_gallery = function( type, typeimg, options ) {
  this.pref = 'oGi_';
  this.immagini;
  this.imgidx;
  this.cont_Thumb;
  this.onObserve = true;
  this.img;
  this.maskGallery;
  this.box = null;
  this.destroyOnCloseGallery = true;  
  this.isFacebookUser = typeof options != 'undefined' && typeof options.isFacebookUser != 'undefined' ? options.isFacebookUser : 0;
  this.isEnabledLove = typeof options != 'undefined' && typeof options.enabledLove != 'undefined' ? options.enabledLove : 0;
  this.fbImagesLove = null;
  
  /* tipo immagini (image = immagini, plan = planimetrie) */
  this.typeImg = (typeof typeimg == 'undefined') ? 'image' : typeimg;
  
  if ( typeof type == 'undefined' )
      this.type = '';
  else
    this.type = type;
}

/**
 *  Funzione costruttore della classe, fa la richiesta ajax apre il box overlay con i risultati se è la prima apertura, altrimenti visualizza
 *  nuovamente il box overlay con i contenuti
 *  @params  int idAnnuncio ( ID dell'annuncio delle foto che si vogliono visualizzare )
 *  @params  int currentImg ( ID dell'immagine corrente da aprire )
 *  @params  string title( Titolo dell'annuncio delle immagini )
 */
Im_gallery.prototype.overlayFoto = function( idAnnuncio, currentImg, title, urlThumb, urlphp ) {
  //setto il tipo di cursore del mouse
  document.body.style.cursor = "wait";
  this.imgidx = parseInt( currentImg );
  this.titleImg = title;
  
  var phpFile = typeof urlphp == 'undefined' ? '/photoGallery.php' : urlphp;
  
  this.isFacebookUser = typeof __userLogged__ != 'undefined' ? __userLogged__ : this.isFacebookUser;
  if( this.isEnabledLove ) {
	var options = { 'syncPopup' : true };
	this.fbImagesLove = new FbImagesLove( 'oGi_contGallery', this.isFacebookUser, options );				
  }
  if ( null == this.box || this.destroyOnCloseGallery ) {
      //Prima apertura del box
      var oAjax = new getMEAjaxObj();
      
      var url = phpFile+'?pref='+this.pref+'&id='+idAnnuncio+'&imgidx='+currentImg+'&type='+this.type+'&urlThumb='+urlThumb+'&typeImg='+this.typeImg+'&isEnabledLove='+this.isEnabledLove;
      oAjax.Request( 'GET' , url , function(response){this.setOverlayFoto( response,title );}.bind(this) );
  }  else {
      //Se il box è gia stato aperto una volta
      this.setPreload( 'block' );
      document.body.style.cursor = "default";
      this.loadImage( this.immagini[this.imgidx], false );
      //Apro il box overlay
      this.box.show();	  
	  this.fbImagesLove.synchronize();
  }  
}

/**
 *  Funzione che stampa i risultati della richiesta ajax nel box overlay ed avvia tutti gli ascoltatori esteri per il funzionamento 
 *  della navigazione delle immagini della galleria
 *  @params obj data ( oggetto di risposta della chiamata ajax ) 
 *  @params string title( Titolo dell'annuncio delle immagini )
 */
Im_gallery.prototype.setOverlayFoto =  function( data,title ) {
    if ( this.onObserve )
        addEvent(document,"keyup", function(e) {this.keyPrs(e)}.bind(this));
    
    this.onObserve = false;  
    this.writeOverlayFoto( data ,title );
    //Recupera tutte le thumb
    this.immagini = getElementsByClass('miniImgGallery');
    
    var right_button = document.getElementById(this.pref+'right_button');
    var left_button = document.getElementById(this.pref+'left_button');
    this.maskGallery = document.getElementById("maskGallery");
    //Div che visualizza l'immagine grande'
    img = document.getElementById(this.pref+"mainImage");
    this.img = img;
    
    if ( this.immagini.length > 0 ) {
        for( var x=0; x < this.immagini.length ; x++ ) {
            //Creo oggetto per da passare al bind affinche le fariabili siano visibili dentro addEvent
            var that = new Object();
            that.obj = this;
            that.x = x;
            var imgThumb = this.immagini[x];
            //Ascoltatori delle thumb
            addEvent( imgThumb , "click" , function(e) {this.obj.loadImage( this.obj.immagini[this.x] );}.bind(that) );
            this.setClassThumb( this.immagini[x], this.imgidx );
        }
        //Ascoltatore sulla preccia di sx
        addEvent( left_button , "click" , function(e) { this.loadPrevious();}.bind(this) );
        //Ascoltatore sulla preccia di dx
        addEvent( right_button , "click" , function(e) { this.loadNext();}.bind(this) );
        //Ascoltatore per determinare il totale caricamento dell'immagine grande'
        addEvent( img , "load" , function(e) { this.setPreload( 'none' );clearTimeout(this.displayTimer)}.bind(this) );
    }
	var didascalia = (( typeof(this.immagini[this.imgidx]) != 'undefined' ) && ( typeof(this.immagini[this.imgidx].title) != 'undefined' ) && ( this.immagini[this.imgidx].title != '' )) ? this.immagini[this.imgidx].title : this.titleImg;
	document.getElementById( 'titolo_box_overlay' ).innerHTML = didascalia;
	
	if( this.isEnabledLove ) {
		var options = { 'syncPopup' : true };
		this.fbImagesLove = new FbImagesLove( 'oGi_contGallery', this.isFacebookUser, options );	
		this.fbImagesLove.synchronize();
		this.fbImagesLove.initListeners();
	}
}

/**
 * Funzione che setta tutti i paramentri del box overlay
 * @params obj data ( oggetto di risposta della chiamata ajax ) 
 * @params string title( Titolo dell'annuncio delle immagini )
 */
Im_gallery.prototype.writeOverlayFoto =  function( data ,title) {
    var imgPath = '/img2';
    var heightIFrame = '525px';
    this.box = new boxOverlay("idBox","grey");
	
	__hardBlockEvent = function(e){stop_event_bubbling(e,true)};
	  
    this.box.addEventOnShow( function(){ addEvent( document, "keydown", __hardBlockEvent ) } );
    this.box.addEventOnClose( function(){ removeEvent( document, "keydown", __hardBlockEvent ) } );
    
    if ( title.length > 80  ) {
        var posT = title.search(/\|/);
        title = title.substr(0,posT).trim();
        if ( title.length > 80  ) {
            title = title.substr(0,80).trim();
            title = title+'...';
        }
    }
	this.titleImg = title;
    this.box.setTitle("<span class=\"titolo_annuncio\" id=\"titolo_box_overlay\" style=\"margin-top:3px;margin-bottom:3px;margin-right:35px;color:#000000;font-size: 15px;\">"+title+"</span>");
    this.box.setContent(data.responseText);
    this.box.show();
    this.box.destroyOnClose = this.destroyOnCloseGallery;
    this.box.hideOnlyBox;
    //this.box.blockScroll = true;
    document.body.style.cursor = "default";
}

/**
 * Funzione che carica nel div di visulizzazione dell'immagine grande la foto corrente selezionata
 * @params obj sender ( oggetto immagine selezionata )
 * @params boolean opacityMask ( variabile per la gestione dell'opacita del box di preload false -> no opacità, true -> opacità )
 */
Im_gallery.prototype.loadImage =  function( sender, opacityMask ) {
	clearTimeout( this.displayTimer );
	
    if ( this.img.name == sender.name ) {
        this.setPreload( 'none' );
        return false;
    }
        
    if( typeof opacityMask == 'undefined' || opacityMask ) 
        this.maskGallery.className = "maskGalleryOpacity";
    else 
        this.maskGallery.className = "";
    
    this.displayTimer = setTimeout(function (){this.setPreload( 'block' )}.bind(this),750);
    
    for(var x=0; x < this.immagini.length; x++) {
        if ( sender.id != x ) {
            this.immagini[x].className = 'miniImgGallery opacityGallery';
        }
        this.setClassThumb( this.immagini[x], sender.id );
    }
    sender.className = 'miniImgGallery noOpacityGallery';
    
	var didascalia = this.immagini[sender.id].title != '' ? this.immagini[sender.id].title : this.titleImg;
	document.getElementById( 'titolo_box_overlay' ).innerHTML = didascalia;
	if(this.typeImg == 'plan')
		this.img.src = __gvs_MEDIA_SERVER_IMAGE + this.typeImg + "/" + sender.name + "/print.jpg";
	else 
		this.img.src = __gvs_MEDIA_SERVER_IMAGE + "image/" + sender.name + "/print.jpg";
    this.img.name = sender.name;
    this.imgidx = sender.id;
	
	//Setta il valore del love nella thumb
	this.fbImagesLove.setLoveImage( null, sender.name );	
}

/**
 * Funzione che apre e chiude il preload
 * @params string ( Block -> visualizza il preload, none -> rimuove il preload )
 */
Im_gallery.prototype.setPreload =  function( type ){
    this.maskGallery.style.display = type;
}

/**
 * Funzione che gestisce il bordo del contenitore delle thumb setta a grigio chiaro le non selezionate e a nero l'immagine scelta
 * @params obj immagine ( riferimento a figlio del contenutore della thumb a cui cambiare la classe )
 * @params id imgidx( indice dell'immagine selezionata da impostare con bordo nero )
 */
Im_gallery.prototype.setClassThumb =  function( immagine, imgidx ) {
    cont_Thumb = immagine.parentNode;
    
    if ( imgidx == immagine.id )
        cont_Thumb.className = 'box_thumb border_black';
    else
        cont_Thumb.className = 'box_thumb border_grey';
}

/**
 * Funzione che carica l'immagine successiva si basa su imgidx che è l'indice selettore delle immagini
 */
Im_gallery.prototype.loadNext =  function(){
    this.imgidx++;
    if (this.imgidx == this.immagini.length)
        this.imgidx = 0;
    this.loadImage( this.immagini[this.imgidx] );
}

/**
 * Funzione che carica l'immagine precedente si basa su imgidx che è l'indice selettore delle immagini
 */
Im_gallery.prototype.loadPrevious =  function(){
    this.imgidx--;
    if ( this.imgidx < 0 )
        this.imgidx = this.immagini.length - 1;	
    this.loadImage( this.immagini[this.imgidx] );
}

/**
 * Funzione che carica l'immagine superiore
 */
Im_gallery.prototype.loadUp =  function(){
    var newIndice = parseInt(this.imgidx)-7;
    
    if ( typeof this.immagini[newIndice] == 'undefined' )
        return false;
    
    this.imgidx = newIndice;
    this.loadImage( this.immagini[this.imgidx] );
}

/**
 * Funzione che carica l'immagine inferiore
 */
Im_gallery.prototype.loadDown =  function(){
    var newIndice = parseInt(this.imgidx)+7;
    
    if ( typeof this.immagini[newIndice] == 'undefined' )
        return false;
    
    this.imgidx = newIndice;
    this.loadImage( this.immagini[this.imgidx] );
}


/**
 * Funzione che determina il tasto della tastiera premuto ( 39 -> Va a foto precedente, 37 -> va a foto successiva )
 * @params event e
 */
Im_gallery.prototype.keyPrs =  function(e){
    var code;
    if (window.event)
        code = window.event.keyCode;
    else if (e)
        code = e.which;
    else
        return null;
    
         
    if ( code == 37 )
        this.loadPrevious();
    else if ( code == 39 )
        this.loadNext();
    else if ( code == 38 )
        this.loadUp();
    else if ( code == 40 )
        this.loadDown();
}

