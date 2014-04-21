/**
 * Floorplanner.js
 * Scripts for easily embedding floorplanner projects in webpages and communicating with the
 * different Flash applications.
 *
 * Requires swfobject.js version 2.1 - see http://code.google.com/p/swfobject/
 * Include http://ajax.googleapis.com/ajax/libs/swfobject/2.1/swfobject.js
 *
 * Minimal example:
 * 
 *  var fp = new Floorplanner({ project_id: 12345 });
 *  fp.embed('name_of_div');
 *
 * Copyright 2008 - Floorplanner.com
 */

Floorplanner.VERSION = 4.0;

// Communicating with the backend
Floorplanner.DEFAULT_AMFPHP_ROOT     = "http://backend.floorplanner.com/2d/v4/amfphp_services_2/";
Floorplanner.DEFAULT_WEBSERVICE_ROOT = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'www.floorplanner.com/';

// Content server (Flash applications and assets)
Floorplanner.DEFAULT_CONTENT_SERVER  = ('https:' == document.location.protocol ? 'https://d273csydae9vpp.cloudfront.net' : 'http://cdn.floorplanner.com');
Floorplanner.DEFAULT_SERVICE = 'object_remoting'; // 'xml_http'; // 'xml_file';

// Location of the applications
Floorplanner.APP_2D_ROOT = "/apps/2d/";
Floorplanner.APP_3D_ROOT = "/apps/3d/";
Floorplanner.PREVIEW_APP_SUFFIX = "/apps/preview/preview.swf";
Floorplanner.EXPRESS_FLASH_INSTALL = "/flash/expressInstall.swf";

// Location of the assets
Floorplanner.ASSET_ROOT_SUFFIX = "/assets/";

// Version requirements of applications
Floorplanner.APP_2D_FLASH_VERSION = "8";
Floorplanner.APP_3D_FLASH_VERSION = "9.0.0";


Floorplanner.APP_2D_VERSION = 359;
Floorplanner.APP_3D_VERSION = 153;

// Contains a hash with all the loaded Floorplanner-instances, index by project hash
Floorplanner.loadedInstances = {};

/**
 * Contstruct a new floorplanner object.
 * @param pOptions		 An optional hash with options that should be passed to the application.
 */
function Floorplanner(pOptions) {
  this.fOptions = (pOptions == null) ? {} : pOptions;
  this.f2dVersion = (pOptions['fp2d_version'] == null) ? Floorplanner.APP_2D_VERSION : pOptions['fp2d_version'];
  this.f3dVersion = (pOptions['fp3d_version'] == null) ? Floorplanner.APP_3D_VERSION : pOptions['fp3d_version'];
  
  // The loadedcInstances-Hash is used by Flash to find the correct Floorplanner instance for communicating events.  
  // Make sure to register this instance using a unique instance identifier
  var lInstanceIdentifier = null;
  do { lInstanceIdentifier = "instance_" + Math.round(Math.random() * 10000000).toString(); }
  while (Floorplanner.loadedInstances[lInstanceIdentifier] != null);

  // Set wmode
  this.fOptions["wmode"] = (this.fOptions["wmode"] == null) ? "direct" : this.fOptions["wmode"];
  
  // Register the instance and send the identifier to the flash app as Flash option
  this.fOptions["instance"] = lInstanceIdentifier;
  Floorplanner.loadedInstances[lInstanceIdentifier] = this;  

  this.fOptions["language"]      = (this.fOptions["language"] == null) ? "en" : this.fOptions["language"];

  this.fOptions["state"]         = (this.fOptions["state"] == null)   ? 'show' : this.fOptions["state"];  
  
  // Set the locatin of the external resources
	if (this.fOptions["service"]         == null) this.fOptions["service"]         = Floorplanner.DEFAULT_SERVICE;
  if (this.fOptions["amfphp_root"]     == null) this.fOptions["amfphp_root"]     = Floorplanner.DEFAULT_AMFPHP_ROOT;
  if (this.fOptions["webservice_root"] == null) this.fOptions["webservice_root"] = Floorplanner.DEFAULT_WEBSERVICE_ROOT;
  if (this.fOptions["content_server"]  == null) this.fOptions["content_server"]  = Floorplanner.DEFAULT_CONTENT_SERVER;
  if (this.fOptions["assets_root"]     == null) this.fOptions["assets_root"]     = this.fOptions["content_server"] + Floorplanner.ASSET_ROOT_SUFFIX;
  
  this.f2dLoaded = false;
  this.f3dLoaded = false;  
  
  this.fHolderDiv = ""; 
  this.f2dDiv     = "";
  this.f3dDiv     = "";
    
  this.fCurrentView   = null;
  this.fCurrentUserId = null;
	this.fFeedbackOn    = false;
  
  // events  
  this.fEventHandlers = {};
  this.observe('LOADED', function() { this.f2dLoaded = true; })  
}

/////////////////////////////////////////////////////
// FLASH EVENT HANDLING
/////////////////////////////////////////////////////

/** 
 * Call this function to observer events in the Floorplanner Flash application by providing
 * the event name an a handler that will be called if the event is fired.
 * @param string pEventName The event to observe in the Flash application
 * @param callable pHandler The callback function. This can be an anonymous function or
 *          a reference to a named function object. The function should have an parameter
 *          to which the event parameters can be posted.
 */
Floorplanner.prototype.observe = function( pEventName, pHandler ) {
  if (this.fEventHandlers[pEventName] == null) this.fEventHandlers[pEventName] = new Array();
  this.fEventHandlers[pEventName][this.fEventHandlers[pEventName].length] = pHandler;
}

/** 
 * This function is called from the Floorplanner Flash application if an event is fired.
 * This function will call all relevant event handlers with the provided event parameter.
 * @param string pEventName The event being fired.
 * @param object pParams The event-parameters provided by Flash.
 */
Floorplanner.prototype.handleFlashEvent = function( pEventName, pParams ) {
	
  if (this.fEventHandlers[pEventName] != null) {
    for (var i = 0; i < this.fEventHandlers[pEventName].length; i++) {
      try {
				this.fEventHandlers[pEventName][i].call(this, pParams);
			} catch(e) {
				if(console) console.info(e);
			}
    }
  }
}

/////////////////////////////////////////////////////
// EMBEDDING FLOORPLANNER
/////////////////////////////////////////////////////

/**
 * Embeds a Floorplanner in an HTML element, usually an empty div.
 *
 * This script will create some additional DIVs inside the provided HTML element (the "holder 
 * DIV"). Every application (2D, 3D) gets a separate child DIV. These DIVs are
 * then replaces by Flash applications.
 *
 * @param string pDivName The ID of the HTML element in which the Floorplanner application 
 *      should be displayed. By default, the size of this element is used for the application
 * @param hash pOptions An optional hash op options. Valid options include:
 *      - width The width of the Flash element. Defaults to "100%" (of container).
 *      - height The height of the Flash element. Defaults to "100%" (of container).
 *      - floor_id The ID of the floor to display initially.
 *      - design_id The ID fo the design to display initially.
 */
Floorplanner.prototype.embed = function( pDivName, pOptions ) {
	
  this.fHolderDiv = pDivName;
  
  this.f2dDiv = this.fHolderDiv + '_2d';
  this.f3dDiv = this.fHolderDiv + '_3d';
  
  // Get the holder element
  var lHolder = document.getElementById(this.fHolderDiv);

  // create div for 2d
  var l2dDiv = document.createElement('div');
  l2dDiv.id = this.f2dDiv;
	l2dDiv.innerHTML = '<div id="flash-warning"><p>Floorplanner requires Adobe Flash version 9 or higher.<br /> Please visit <a href="http://get.adobe.com/flashplayer/">the Adobe Flash website</a> to install it.</p></div>';
  lHolder.appendChild(l2dDiv);
	
  this.observe('SHOW3D', function (pParams) { this.toggleView(pParams); });
  this.observe('SHOW2D', function (pParams) { this.toggleView(pParams); });
  this.observe('READY_FOR_JSON', function (pParams) { this.loadSavedJSONExport(); } );
	
	if(this.fOptions["standalone_3d"] == true) {
			this.runStandalone3d(this.f3dDiv, pOptions); 
	 		this.fCurrentView = "3d";	
	} else {
		this.run2d(l2dDiv.id, pOptions); 
 		this.fCurrentView = "2d";
	}
}

/**
 * Runs the 2D application. This function is used internally: use Floorplanner.embed instead.
 * This function uses SWFobject 2.0 to replace a DIV with the 2D flash application.
 * @param string pDivName The ID of the DIV to replace. This DIV is created automatically by 
 *        the Floorplanner.embed-function.
 * @param hash pOptions An optional hash op options. This hash is passed as is by the embed-
 *        function.
 */
Floorplanner.prototype.run2d = function( pDivName, pOptions, pAttributes) {
	if (pOptions == null) pOptions = {};
  
	if (pOptions['width'] == null)  pOptions['width']  = '100%';
	if (pOptions['height'] == null) pOptions['height'] = '100%';
      
	this.f2dDiv       = pDivName;  

	var lParams     = {allowscriptaccess: "always", bgcolor: "#FFFFFF", wmode: this.fOptions['wmode']}; // TODO: custom bg color?
	var lAttributes = (pAttributes == null) ? {} : pAttributes;
	var lFlashVars  = { app_root: this.fOptions["content_server"] + Floorplanner.APP_2D_ROOT + this.f2dVersion + "/" };	
	var lAppUrl     = lFlashVars["app_root"] + "loader.swf?movie=" + lFlashVars["app_root"] + "application.swf";
		
	for (var o in this.fOptions) { if (typeof this.fOptions[o] != 'function') lFlashVars[o] = this.fOptions[o]; }	
 
	swfobject.embedSWF(lAppUrl, this.f2dDiv, pOptions['width'], pOptions['height'],
			Floorplanner.APP_2D_FLASH_VERSION, Floorplanner.EXPRESS_FLASH_INSTALL, lFlashVars, lParams, lAttributes);
	
	var isMac = navigator.appVersion.toLowerCase().indexOf("mac") != -1;
  if (isMac) this.initMouseWheel();
}



Floorplanner.prototype.runStandalone3d = function(pDivName, pOptions) {
	// create div for 3d
  var lHolder = document.getElementById(this.fHolderDiv);
  var l3dDiv = document.createElement('div');
  l3dDiv.id = this.f3dDiv;
  lHolder.appendChild(l3dDiv);
	//lHolder.removeChild(document.getElementById(this.f2dDiv))
	var l2dDiv = document.getElementById(this.f2dDiv);
	l2dDiv.innerHTML = "";
	l2dDiv.style.height = "0px";
	l2dDiv.style.width = "0px";
	
	this.run3d(this.f3dDiv);
}

/**
 * Runs the 3D application. This function is used internally: use Floorplanner.embed and 
 * Floorplanner.toggleView instead. Currently, the 2D application has to be running when
 * the 3D application runs. This function uses SWFobject 2.0 to replace a DIV with the 
 * 3D flash application.
 * @param string pDivName The ID of the DIV to replace. This DIV is created automatically by 
 *        the Floorplanner.embed-function.
 * @param hash pOptions An optional hash op options. This hash is passed as is by the embed-
 *        function.
 */
Floorplanner.prototype.run3d = function( pDivName, pOptions ) {
  
  this.f3dDiv       = pDivName; 
  
  if (pOptions == null) pOptions = {};
  if (pOptions['width']  == null) { pOptions['width']  = '100%'; }
  if (pOptions['height'] == null) { pOptions['height'] = '100%'; }
	
  var lApp3dRoot  = this.fOptions["content_server"] + Floorplanner.APP_3D_ROOT  + this.f3dVersion + "/";
	
	var lParams     = { allowscriptaccess: "always", bgcolor: "#FFFFFF", allowFullScreen: "true", wmode: this.fOptions['wmode']};
	
	var lAttributes = {  };
	
	if(this.fOptions['standalone_3d'] != true) {
		var lFlashVars  = { app_root: lApp3dRoot, designXml:this.fXML };
	} else {
		var lFlashVars  = { app_root: lApp3dRoot};
	}
	
	// Send all options to 3D apps by setting the flashvars Hash.
	for (var o in this.fOptions) { 
		if (typeof this.fOptions[o] != 'function') lFlashVars[o] = this.fOptions[o]; 
	}
	
	swfobject.embedSWF(lApp3dRoot + "floorplanner.swf", this.f3dDiv, pOptions['width'], pOptions['height'],
	      Floorplanner.APP_3D_FLASH_VERSION, Floorplanner.EXPRESS_FLASH_INSTALL, lFlashVars, lParams, lAttributes);
  	      
	this.f3dLoaded = true; // TODO: use event
}

/**
 * Switch from 2D view to 3D view and vice versa.
 */
Floorplanner.prototype.toggleView = function(params) {

  var l2dDiv = document.getElementById(this.f2dDiv);
  
	if (this.fCurrentView == "2d") {
    this.enableResize(false);
    this.saveXMLExport();

    l2dDiv.style.width  = "0px";
    l2dDiv.style.height = "0px";    
    
    // create div for 3d
    var lHolder = document.getElementById(this.fHolderDiv);
    var l3dDiv = document.createElement('div');
    l3dDiv.id = this.f3dDiv;
    lHolder.appendChild(l3dDiv);    
		
    this.run3d(this.f3dDiv);
    this.fCurrentView = "3d";    
	} else {

		//this.get3dMovie().clear();

    var lHolder = document.getElementById(this.fHolderDiv);
    lHolder.removeChild(document.getElementById(this.f3dDiv));
		this.f3dLoaded = false;
    

		if(this.fOptions["standalone_3d"]) {
			this.run2d(l2dDiv.id, this.fOptions); 
	 		this.fOptions["standalone_3d"] = false;
		} else {
			this.enableResize(false);
			l2dDiv.blur();
	    // Restore 2D app
			l2dDiv.style.width   = '100%';
			l2dDiv.style.height  = '100%';

      if(params && params['fml'] != null) {
        this.get2dMovie().importDesign(unescape(params['fml'].toString()));
			}

			this.enableResize(true);
	  
		}
		this.fCurrentView = "2d";
	}
}

/**
 * Switch from 2D view to 3D view and vice versa.
 */
Floorplanner.prototype.toggleFeedback = function() {
	var l2dDiv  = document.getElementById(this.f2dDiv);
	var l3dDiv  = document.getElementById(this.f3dDiv);
	var lHolder = document.getElementById(this.fHolderDiv);
	
	// If the feedback button is clicked, make sure to 
	// hide the 2d or 3d floorplanner
	if (this.fFeedbackOn == false) {
		if (this.fCurrentView == '2d') {
			l2dDiv.style.width  = "0px";
		  l2dDiv.style.height = "0px";		
		}
		else {			
	    lHolder.removeChild(document.getElementById(this.f3dDiv));
			this.f3dLoaded = false;
		}
		this.enableResize(false);
		this.fFeedbackOn = true;
	}
	// Restore the 2d or 3d floorplanner
	else{
		if (this.fCurrentView == '2d'){
			l2dDiv.style.width  = '100%';
			l2dDiv.style.height = '100%';			
		}
		else {
			// create div for 3d
	    var l3dDiv = document.createElement('div');
	    l3dDiv.id = this.f3dDiv;
	    lHolder.appendChild(l3dDiv);

	    this.run3d(this.f3dDiv);
		}
		this.enableResize(true);
		this.fFeedbackOn = false;
	}
}

/**
 * Ensures the 2D application is running in the foreground.
 */
Floorplanner.prototype.ensure2d = function() {
  if (this.fCurrentView == '3d') this.toggleView();
}

/////////////////////////////////////////////////////
// MOUSEWHEEL EMULATION
/////////////////////////////////////////////////////

Floorplanner.prototype.initMouseWheel = function() {
  var lFloorplannerInstance = this;
	    
  var lMovie = document.getElementById(this.f2dDiv);
	if (lMovie.addEventListener) {
    lMovie.addEventListener('DOMMouseScroll', function(event) {
  	  lFloorplannerInstance.handleWheelEvent.apply(lFloorplannerInstance, [event]);
    }, false);
	}
	
	lMovie.onmousewheel = function(event) {
	  lFloorplannerInstance.handleWheelEvent.apply(lFloorplannerInstance, [event]);
  };
  
},

Floorplanner.prototype.handleWheelEvent = function(event) {
  var delta = 0;
  if (event.wheelDelta) { /* IE/Opera. */
		delta = event.wheelDelta/120;
		if (window.opera) delta = -delta;
  } else if (event.detail) { /** Mozilla case. */
    delta = -event.detail/3;
  }
  if (/AppleWebKit/.test(navigator.userAgent)) { delta /= 3; }
  
  if (delta) { 
    var lMovie = this.get2dMovie();
    lMovie.apiExternalMouseWheelEvent(delta); 
  }
  
  // Prevent document scrolling
  if (event.preventDefault) event.preventDefault();
	event.returnValue = false;
}

/////////////////////////////////////////////////////
// JAVASCRIPT API functions
/////////////////////////////////////////////////////

Floorplanner.prototype.instance = function() {
  return this.fOptions['instance'];
}

/**
 * Loads the default design of the floor identified by the provided floor ID.
 * Once the floor and design have been loaded, the LOADED event is called.
 * @param int pFloorId The ID of the floor to load.
 * @return void
 */
Floorplanner.prototype.loadFloor = function( pFloorId ) {
  this.get2dMovie().loadFloor( pFloorId );
}

/**
 * Loads a design identified by the given design ID.
 * Once the design has been loaded, the LOADED event is called. 
 * @param int pDesignId The ID of the design to load. 
 * @return void 
 */
Floorplanner.prototype.loadDesign = function( pDesignId ) {
  this.get2dMovie().loadDesign( pDesignId );
}

/**
 * Loads a design identified by its name and the ID of the floor.
 * Once the design has been loaded, the LOADED event is called. 
 * @param int pFloorId The ID of the floor the design belongs to.
 * @param string pDesignName The name of the design to load 
 * @return void 
 */
Floorplanner.prototype.loadDesignByName = function( pFloorId, pDesignName ) {
  this.get2dMovie().loadDesignByName( pFloorId, pDesignName );
}

/**
 * Saves the current design.
 * @param string pDesignName The name to use for this design
 * @return void
 */
Floorplanner.prototype.saveDesign = function( pDesignName ) {
  this.get2dMovie().saveDesign( pDesignName );
}

/**
 * Creates and mails the current design.
 * @param string pEmailTo The recipient's address
 * @param string pEmailCc The cc address
 * @param string pEmailMessage The message
 * @return void
 */
Floorplanner.prototype.createAndMailDesign = function( pEmailTo, pEmailCc, pEmailMessage ) {
  this.get2dMovie().createAndMailDesign( pEmailTo, pEmailCc, pEmailMessage );
}


/** 
 * Opens the print dialog to print the current design
 * @return void
 */
Floorplanner.prototype.printDesign = function() {
  this.ensure2d();  
  this.get2dMovie().printDesign();
}

/**
 * Resets the current design to its saved state.
 * @return void
 */
Floorplanner.prototype.resetDesign = function() {
  this.ensure2d();  
  this.get2dMovie().resetDesign();
}

Floorplanner.prototype.isModified = function() {
  return this.get2dMovie().isModified();
}

Floorplanner.prototype.showForm = function( pForm, pParams ) {
    // TODO: prettify me
    if (this.fCurrentView == '3d') {
        if (pForm == 'EXPORT_IMAGE' || pForm == 'PRINT') {
            this.get3dMovie().showForm( pForm, pParams );
            return;
        } else {
            this.ensure2d();
        }
    }
    this.get2dMovie().showForm( pForm, pParams );
}

/** 
 * Get the 2D movie object
 */
Floorplanner.prototype.get2dMovie = function() {
  if (!this.f2dLoaded) throw new Error("The Flash application is not yet fully loaded! Wait for the LOADED event before calling functions.");
  return document.getElementById(this.f2dDiv);  
}

/** 
 * Get the 3D movie object
 */
Floorplanner.prototype.get3dMovie = function() {
  if (!this.f3dLoaded) throw new Error("The 3D viewer is not yet fully loaded!");
  return document.getElementById(this.f3dDiv); 
}

/**
 * Enables or disbales resize handling of the 2D Flash application.
 * Resize handling is disbaled when the 2D Flash application is in the
 * background. 
 * @param boolean pEnable Whether to enable or disable resizing.
 * @see Floorplanner.toggleView()
 */
Floorplanner.prototype.enableResize = function( pEnable ) {
  this.get2dMovie().enableResize(pEnable);
}

////////////////////////////////////////////////////
// ELEMENT PREVIEWING
////////////////////////////////////////////////////

/**
 * Includes a preview of an element in the page. The Preview application will be loaded
 * from the correct content server to prevent crossdomain issues.
 * 
 * This function uses SWFobject 2.0 to replace a HTML element with the previewer.
 *
 * @param string pElement The ID of the HTML element to replace with the preview.
 * @param string pUrl The location of the SWF asset file of the element.
 * @param string pWidth The width of the element. Defaults to 100%.
 * @param string pWidth The height of the element. Defaults to 100%.
 * @param hash pAttributes The attributes that should be assigned to the HTML element.
 */
Floorplanner.prototype.previewElement = function(pPreviewDiv, pUrl, pWidth, pHeight, pAttributes) {
  
  var lParams    = { allowscriptaccess: "always", bgcolor: "#FFFFFF" };
  var lFlashVars = { url: pUrl };
  
  if (pAttributes == null) pAttributes = {};
  if (pWidth == null)  pWidth  = '100%';
  if (pHeight == null) pHeight = '100%';

  swfobject.embedSWF(this.getPreviewURL(), pPreviewDiv, pWidth, pHeight, 
      '8', Floorplanner.EXPRESS_FLASH_INSTALL, lFlashVars, lParams, pAttributes);
}

/**
 * Returns the correct URL for the previewing application. 
 * It must be loaded from the correct server because of Flash crossdomain issues.
 *
 * Use the previewElement function to embed a preview of an element in a page.
 *
 * @return string The URL of the preview application.
 * @see Floorplanner.previewElement
 */
Floorplanner.prototype.getPreviewURL = function() {
  return this.fOptions['content_server'] + Floorplanner.PREVIEW_APP_SUFFIX;
}

////////////////////////////////////////////////////
// FLOORPLANNER CURRENT STATE FUNCTIONS
////////////////////////////////////////////////////


Floorplanner.prototype.setCurrentUserId = function(pUserId) {
  this.fCurrentUserId = pUserId;
}

Floorplanner.prototype.getCurrentUserId = function() {
  return this.fCurrentUserId;
}

/**
 * Returns the current active application (2D or 3D)
 * @return "2d" or "3d"
 */
Floorplanner.prototype.getCurrentView = function() {
   return this.fCurrentView;
}

/** 
 * Get the (initial) state of the 2D application. 
 */
Floorplanner.prototype.getState = function() {
    return this.fOptions["state"];  
}

/** 
 * Get the (initial) state of the 2D application. 
 */
Floorplanner.prototype.setState = function( pState ) {
    this.fOptions["state"] = pState;  
}


/**
 * Returns information about the current project in a hash, including its floors and including its design.
 */
Floorplanner.prototype.getProject = function() {
  return this.get2dMovie().getProject();
}

/**
 * Returns true if this is the demo design.
 */
Floorplanner.prototype.isDemoProject = function() {
  return (this.fOptions["demo_project"] && this.fOptions["demo_project"] == 1);
}

/**
 * Returns true if this is an empty project (for new accounts)
 */
Floorplanner.prototype.isEmptyProject = function() {
  return (this.fOptions["empty_project"] && this.fOptions["empty_project"] == 1);
}

/**
 * Returns a list of shapes in the current design.
 */
Floorplanner.prototype.getShapes = function( pIncludeElements ) {
  if (pIncludeElements == null) pIncludeElements = false;
  return this.get2dMovie().getShapes(pIncludeElements);
}

////////////////////////////////////////////////////
// Communication between 2D and 3D
////////////////////////////////////////////////////

/**
 * Exports the current design of the 2D application as XML or JSON
 */
Floorplanner.prototype.getDesignExport = function(pSettings) {
  return this.get2dMovie().getDesignExport(pSettings);
}

/**
 * Loads a design provided in JSON in the 3D application.
 */
Floorplanner.prototype.loadJSON3D = function(pJSON) {
	this.get3dMovie().parseProject( pJSON );
}

/**
 * Stores the JSON export for the 3D application
 */
Floorplanner.prototype.saveXMLExport = function() {
  //this.fJSON = null;
//	this.fJSON = this.getDesignExport("JSON");
	this.fXML = escape(this.getDesignExport("XML"));
	
}


/**
 * Checks whether the model export has been completed, so the 3D application
 * can be loaded
 */ 
Floorplanner.prototype.is3dExportReady = function() {
  if (this.fJSON != null) {
    this.f3dLoaded = true;
    this.loadJSON3D(this.fJSON);
    return true;
  } else {
    return false;
  }
}

/**
 * Zooms the design relative with the given speed.
 * A positive speed will zoom in.
 * A negative speed will zoom out.
 */
Floorplanner.prototype.zoom = function( pSpeed ) {
  this.get2dMovie().zoom( pSpeed );
}

/**
 * Zooms the design to fit the div
 */
Floorplanner.prototype.zoomAll = function( pPercentage ) {
  this.get2dMovie().zoomAll( pPercentage );
}

/**
 * Add the object to the Floorplanner
 */
Floorplanner.prototype.addObject = function( obj ) {
  this.get2dMovie().addObject( obj );
}


/**
 * Remove the object from the Floorplanner
 */
Floorplanner.prototype.removeObject = function( obj ) {
  this.get2dMovie().removeObject( obj );
}

Floorplanner.prototype.connectCamera = function( contentURL, thumbURL ) {
	var obj           = new Object();
	obj.id            = "1427";
	obj.name          = "Camera";
	obj.url2d         = "elements/2d/symbols/CameraIcon.swf";
	obj.layer         = 20;
	obj.type          = "media";
	obj.mediaContentURL   = contentURL;
	obj.mediaThumbnailURL = thumbURL;
	obj["filter-value"] = "null";
	mediaObjectHash     = this.addObject( obj );
}
