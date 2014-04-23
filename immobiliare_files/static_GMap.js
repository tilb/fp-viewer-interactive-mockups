
/********************************************/
/*				 STATIC MAP 				*/
/********************************************/

var static_GMap = function(id_cont, lat, lng, zoom, google_key, options)
{
	
	if (typeof id_cont == "undefined" || typeof lat == "undefined" || typeof lng == "undefined" || typeof zoom == "undefined")
		throw("static_GMaps: per utilizzare la libreria è necessario impostare il centro e lo zoom");
	
	this.basePath = "http://maps.google.com/maps/api/staticmap";
	//this.basePath = "http://ext.ekbl.net/map.php"; // PER EMERGENZA: se bloccano le mappe statiche usare questa url 
	this.google_key = google_key;
	
	this.id_container = id_cont;
	this.id_img = 'img_google_map_statics';
	this.lat = parseFloat(lat);
	this.lng = parseFloat(lng);
	
	zoom = parseInt(zoom);
	this.zoom = (zoom > 0) ? zoom : null;
	this.options = options;
	
	this.width = (typeof this.options.width != "undefined") ? parseInt(this.options.width) : 628;
	this.height = (typeof this.options.height != "undefined") ? parseInt(this.options.height) : 245;
	this.language = (typeof this.options.language != "undefined") ? this.options.language : 'it';
	this.style = (typeof this.options.style != "undefined") ? this.options.style : null;
	
	// Valori markerType: 1 -> marker classico, 2 -> cerchio, 3 -> poligono
	this.markerType = (typeof this.options.markerType != "undefined") ? parseInt(this.options.markerType) : null;
	
	this.radius = (typeof this.options.radius != "undefined") ? parseInt(this.options.radius) : 250; // raggio in metri!
	this.radius = this.radius/1000; // Lo trasformo in km!
	this.center = null;
	// path per disegnare un poligono
	this.path = (typeof this.options.path != "undefined") ? this.options.path : null;
	
	this.numPoints = (typeof this.options.numPoints != "undefined") && parseInt(this.options.numPoints) > 0 ? parseInt(this.options.numPoints) : 40;
	
	this.fillColor = (typeof this.options.fillColor != "undefined") ? this.options.fillColor : "0x319ACF";
	this.fillOpacity = (typeof this.options.fillOpacity != "undefined") ? this.options.fillOpacity : 0.2;
	this.strokeColor = (typeof this.options.strokeColor != "undefined") ? this.options.strokeColor : "0x319ACF";
	this.strokeOpacity = (typeof this.options.strokeOpacity != "undefined") ? parseInt(this.options.strokeOpacity) : 1;
	this.strokeWeight = (typeof this.options.strokeWeight != "undefined") ? parseInt(this.options.strokeWeight) : 2;
	
	this.enableControl = (typeof this.options.enableControl != "undefined") ? parseInt(this.options.enableControl) : 1;
	this.enableFunction = (typeof this.options.enableFunction != "undefined") ? parseInt(this.options.enableFunction) : 1;
	
	this.imgMarker = "http://www.immobiliare.it/img2/casa.png";
	this.markerShadow = true;
}

static_GMap.prototype.circlePath = function(randomCenter) {
	var d2r = Math.PI / 180;
	var circlePath = '';
	
	this.center = new Coordinate(this.lat, this.lng);
	if (randomCenter)
		this.center = this.center.generateRandomCoord(this.radius);
	
	// Convert statute Km into degrees latitude
	var circleLat = this.radius/111;
	var circleLng = circleLat / Math.cos(this.center.lat() * d2r);
	
	// Create polygon points (extra point to close polygon)
	for (var i = 0; i < this.numPoints + 1; i++) { 
		// Convert degrees to radians
		var theta = Math.PI * (i / (this.numPoints / 2)); 
		var vertexLat = this.center.lat() + (circleLat * Math.sin(theta)); 
		var vertexLng = this.center.lng() + (circleLng * Math.cos(theta));
		circlePath += "|"+vertexLat+","+vertexLng; 
	}
	
	return circlePath;
}

static_GMap.prototype.polygonPath = function() {
	var path = "";
	var step = 1;
	if ( this.path.length > this.numPoints ) {
		step =  this.path.length / this.numPoints ;
	}
	for (var i = 0; i < this.path.length; i = i + step) {
		// Convert degrees to radians
		var vertexLat = this.path[parseInt(i)][0];
		var vertexLng = this.path[parseInt(i)][1];
		path += "|"+vertexLat+","+vertexLng;		
		if ( i > (this.path.length) - (step * 2)) {
			vertexLat = this.path[0][0];
			vertexLng = this.path[0][1];
			path += "|"+vertexLat+","+vertexLng;
			break;
		}
	}

	return path;
}

static_GMap.prototype.createStaticMap = function()
{
	// genero l'url per la mappa statica
	var imgUrl = this.getUrlStaticMap();
	
	var options = {};
	if (this.markerType == 2) {
		options = {'lat':this.center.lat(), 'lng':this.center.lng()};
	}
	
	if (typeof this.id_container == "string")
		var oDiv = document.getElementById(this.id_container);
	else if (typeof this.id_container == "object")
		var oDiv = this.id_container;
	else
		return;
	
	oDiv.style.display = 'block';
	if (this.enableControl) {
		// creo ZoomIN
		var zoomin = document.createElement('div');
		zoomin.id = "img_zoomin";
		zoomin.className = "gmap_zoomin";
		zoomin.innerHTML = '&nbsp';
		zoomin.onmousedown = function(){createDinamicGoogleMaps('zoomin', options)};
		oDiv.appendChild(zoomin);
		
		// creo ZoomOUT
		var zoomout = document.createElement('div');
		zoomout.id = "img_zoomout";
		zoomout.className = "gmap_zoomout";
		zoomout.innerHTML = '&nbsp';
		zoomout.onmousedown = function(){createDinamicGoogleMaps('zoomout', options)};
		oDiv.appendChild(zoomout);
	}
	// creo Immagine statica
	var img = document.createElement('img');
	img.id = this.id_img;
	img.src = imgUrl;
	
	/*
	// SCOMMENTARE PER EMERGENZA
	iframe.width = "100%";
	iframe.height = "100%";
	iframe.marginHeight="0";
	iframe.marginWidth="0";
	iframe.frameBorder="0";
	iframe.scrolling="no";
	*/
	if (this.enableFunction) {
		img.onmousedown = function(){createDinamicGoogleMaps('', options);};
		img.style.cursor = 'url("img2/icone/openhand_8_8.cur"), default';
	}
	
	oDiv.appendChild(img);
}

static_GMap.prototype.getUrlStaticMap = function(randomCenter) {
	if (typeof randomCenter == "undefined")
		randomCenter = true;
	
	var sUrlMarker = "";
	var urlGoogleStaticMap = "";
	
	if ( this.zoom )
		urlGoogleStaticMap = "?zoom=" + this.zoom;
	
	urlGoogleStaticMap += ( (urlGoogleStaticMap == "") ? '?': '&') + "size="+this.width+"x"+this.height+"&language="+this.language;
	
	if (this.markerType == 3) { // creo un poligono
		sUrlMarker += "&path=color:"+this.strokeColor+"|fillcolor:"+this.fillColor+"|weight:"+this.strokeWeight;
		sUrlMarker += this.polygonPath();
	} else if (this.markerType == 2) { // creo un cerchio
		sUrlMarker += "&path=color:"+this.strokeColor+"|fillcolor:"+this.fillColor+"|weight:"+this.strokeWeight;
		sUrlMarker += this.circlePath(randomCenter);
	} else if (this.markerType == 1) { // metto un marker
		var coordinate = this.lat + "," + this.lng;
		var markers = escape("shadow:"+this.markerShadow+"|icon:"+this.imgMarker+"|"+coordinate);
		sUrlMarker += "&markers="+markers;		
		urlGoogleStaticMap += "&center="+coordinate;
	} else {
		var coordinate = this.lat + "," + this.lng;
		urlGoogleStaticMap += "&center="+coordinate;
	}
	if (this.style) {
		urlGoogleStaticMap += "&style="+this.style;
	}
	urlGoogleStaticMap += sUrlMarker;
	urlGoogleStaticMap += "&key="+this.google_key;
	urlGoogleStaticMap += "&sensor=false";
	
	return this.basePath + urlGoogleStaticMap;
}

/************************************************/
/*				 CLASSE COORDINATE 				*/
/************************************************/

var Coordinate = function(lat, lng)
{
	this.fLat = lat;
	this.fLng = lng;
}

Coordinate.prototype.lat = function()
{
	return this.fLat;
}

Coordinate.prototype.lng = function()
{
	return this.fLng;
}

Coordinate.prototype.generateRandomCoord = function(raggioKm){
	//prendo un deltaRaggioLat e deltaRaggioLng in modo da sommare alle coordinate del punto ed ottenere un nuovo punto
	//(sarà il centro dell' area contente punto)
	//(il procedimento equivale a disegnare una circonferenza di raggio + piccolo e prendere un punto a caso su di essa.
	
	var deltaRaggioLat = Math.random() * raggioKm;
	var deltaRaggioLng = Math.random() * raggioKm;
	var gradoInKm = 111;
	
	//converto latitudine punot in radianti
	var pigreco = 3.141592653589793;
	var latRad = (this.lat() * pigreco )/180;
	
	//converto i delta in gradi
	var deltaLat = Math.abs(deltaRaggioLat/gradoInKm);
	var deltaLng = Math.abs(deltaRaggioLng/gradoInKm) * Math.cos(parseInt(latRad));
	
	//lanci una moneta per sommare a caso i delta alle coordinate del punto in modo da ottenere un punto sempre casuale
	//il punto è il centro dell' area contente il punto
	var moneta = Math.random();
	if (moneta <= 0.25){
		cLat = this.lat() + deltaLat;
		cLng = this.lng() + deltaLng;
	}else
	if (moneta <= 0.50){
		
		cLat = this.lat() - deltaLat;
		cLng = this.lng() + deltaLng;
	
	}else
	if (moneta <= 0.75){
		cLat = this.lat() + deltaLat;
		cLng = this.lng() - deltaLng;
	}else{
		cLat = this.lat() - deltaLat;
		cLng = this.lng() - deltaLng;
	}
	 
	var Coord = new Coordinate(cLat,cLng);
	return Coord;
}