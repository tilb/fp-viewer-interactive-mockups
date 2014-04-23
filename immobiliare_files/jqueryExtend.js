jQuery.fn.extend({
	/**
	 * Controlla l'esistenza di un elemento jq tramite la sua lunghezza
	 * @syntax jq( element ).exist();
	 */
	exist: function( ) {
		 return this.length > 0 ? true : false;
	},
	/**
	 * Estensione per controllare se un elemento del DOM ha un determinato attributo dichiarato, non vuoto, non nullo
	 * @param Selector
	 * @syntax jq('#idElement').hasAttr('data-text'), jq('.className #idElement').hasAttr('title')
	 */
	hasAttr: function( name ) {
		return this.attr(name) !== undefined && this.attr(name) !== false && this.attr(name) !== 'undefined' && this.attr(name) !== null;
	}
});

jQuery.extend( {
	/**
	 * Metodo che setta un numero in formato decimale
	 * @param string initString
	 */
	setDecimalFormat: function( initString ) {
		s = String( initString );
		s = s.split( "," );
		var sInt = s[0];
		var sDec = ( typeof s[1] != 'undefined' ? s[1] : '' );
		var tStr = '';
		var i = 0;
		for( var x = sInt.length; x >= 0 ; x-- ) {
			if ( typeof sInt[x] != 'undefined' )
				tStr += sInt[x];
			
			if ( i > 0 && i % 3 == 0 && i < sInt.length )
				tStr += '.' ;
			i++;
		}
		var str = '';
		for( var x = tStr.length; x >= 0 ; x-- )
			if ( typeof tStr[x] != 'undefined' )
				str += tStr[x];
		
		if ( sDec != '' )
			sDec = ','+sDec;
		return str + sDec;
	},
	/**
	 * Estensione per controllare il valore empty di un determinato selettore.
	 * @param Selector
	 * @syntax jq.isEmpty(jq('#idElement')), jq.isEmpty(jq('.className')), jq.isEmpty(jq("p").siblings(".selected")), jq.isEmpty("testo"), jq.isEmpty(1232323)
	 */
	isEmpty: function( mixed ) {
		if((typeof(mixed) == 'object')){
			var control = isJquery(mixed) ? ((mixed.length > 0) ? false : true) : jq.isEmptyObject(mixed);
			return (mixed == null) ? true : control;
		} else {
			return ((typeof(mixed) != 'undefined') && (mixed != '') && (mixed != 0) && (mixed != null) && (mixed != 'null')) ? false : true;
		}
	},
	/**
	 * Estensione per verificare la non indeterminatezza di un parametro(GENERICO). Ex: array, int, object...
	 * @param Selector
	 * @syntax jq.isNotUndefined("pippo"), jq.isNotUndefined(null), jq.isNotUndefined(jq("p").siblings(".selected")), jq.isNotUndefined(0), jq.isNotUndefined(undefined)
	 *         result: [T,T,T,T,F]
	 */
	isNotUndefined: function( par ) {
			return (typeof(par) != 'undefined') ? true : false;
	},
	/**
	 * Metodo per aggiungere/togliere una classe ricorsivamente a elementi di un array
	 * @param Array aItem [ Array di elementi su cui performare l'azione ]
	 * @param string nameClass [ Specifica il nome della classe dalla quale performare l'azione ES: 'pointer', 'wait', 'default' ]
	 * @param string type Specifica l'azione da eseguire ex: add, remove. Supportate ad ora addClass, removeClass
	 * @sintax jq.setClass( new Array( .... ), 'nomeClasse' ) ;
	 */
	setClass: function( aItem, nameClass, type ) {
		if ( jQuery.isEmpty( type ) )
			type = 'add';
		for( var x = 0; x < aItem.length; x++ ) {
			var item = aItem[x];
			if ( type == 'add' )
				jQuery( item ).addClass( nameClass );
			if ( type == 'remove' )
				jQuery( item ).removeClass( nameClass );
		}
	},
	/**
	 * Metodo che verifica se il numero e' un intero
	 * @param string number verifica che l'argomento passato sia un numero intero
	 * @syntax [jq.isInt('abc'), jq.isInt(200), jq.isInt(10.2), jq.isInt('200')] result:[F,T,F,F]
	 */
	isInt: function( number ) {
		if( typeof number === 'number' && !isNaN( parseInt( number ) ) && (parseInt( number ) == parseFloat( number )) )
			return true;
		return false;
	},
	/**
	 * Metodo che data una url genera un oggetto
	 * @param url
	 * @returns {Object}
	 */
	deparam: function( url ) {
		var aParams = new Object();
		if (url == '')
			return aParams;
		var pos = url.search(/\?/);
		if ( pos == 0 ) {
			url = url.slice(1);
		}
		var _params = url.split('&');
		for ( var i in _params ) {
			var _param = _params[i].split('=');
			aParams[_param[0]] = _param[1];
		}
		return aParams;
	}
});

/**
 * Metodo che verifica se l'elemento è di jQuery
 * @params object sender
 */
function isJquery( sender ) {
	return sender instanceof jQuery;
}