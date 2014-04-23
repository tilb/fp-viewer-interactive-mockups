
var webStorage = function( type ) {
	this.supported = ( typeof Storage != "undefined" && checkCookiesEnabled() ) ? true : false;
	if ( this.supported ) {
		if ( typeof type == "undefined" || type == "local")
			this.storage = localStorage;
		else if ( type == "sessione" )
			this.storage = sessionStorage;
	}
}

webStorage.prototype.get = function( name ) {
	if ( this.supported )
		return this.storage.getItem(name);
	else
		return null;
}

webStorage.prototype.set = function( name, value ) {
	if ( this.supported )
		this.storage.setItem(name, value);
}

webStorage.prototype.remove = function( name ) {
	if ( this.supported )
		this.storage.removeItem(name); 
}

webStorage.prototype.clear = function() {
	if ( this.supported )
		this.storage.clear();
}

webStorage.prototype.setJSON = function( name, value ) {
	this.set(name, stringify(value));
}

webStorage.prototype.getJSON = function( name ) {
	var value = this.get(name);
	if ( value && jQuery )
		value = jQuery.parseJSON(value);
	return value;
}