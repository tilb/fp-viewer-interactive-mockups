var SearchForm = function(form, sfOptions) {
	this.form = form;
	this.options = jq.extend({
		container: null,
		loader: null,
		section: null,
		sub_section: null,
		nazione: null,
		ricercaHome: false,
		agOptions: {}
	}, sfOptions);
	this.agComuneField = null;
	this.speedSlide = 'fast';
};

SearchForm.prototype = {
	init: function() {
		var self = this;

		if (self.isVacanze()) {
			var agOptions = jq.extend({
				areaHiddenInput: self.form.idAreaGeografica,
				comuneHiddenInput: self.form.idComune,
				provinciaHiddenInput: self.form.idProvincia,
				regioneHiddenInput: self.form.idRegione
			}, self.options.agOptions);

			self.agComuneField = new AGComuneField ('agComuneField', agOptions);
			self.agComuneField.init(self.initSelectZone.bind(self));
			jq(self.agComuneField).on("change", self.onAgComuneChange.bind(self));

			if (self.form.idContratto) {
				jq(self.form.idContratto).on('change', self.onContrattoChange.bind(self));
			}
		} else {
			self.initSelectZone();
		}

		if (self.form.idComune) {
			jq(self.form.idComune).on('change', self.onComuneChange.bind(self));
		}
		
		this.categoria = jq('#selectCategoria');
	
		if (this.categoria.val() == 4){
			this.categoriaStanza = jq('#selCategoriaStanza');
			this.tipologiaStanza = jq('#divTipologiaStanza');
			this.categoriaStanza.change(function(){
				self.onCategoriaStanzaChange();
			});
			self.onCategoriaStanzaChange();
		} else {
			this.tipologia = jq('#selectTipologia');
			this.tipologia.change(function(){
				self.onTipologiaChange();
			});
			self.onTipologiaChange();
		}
	},

	initSelectZone: function() {
		if (!this.options.ricercaHome && this.options.sub_section != "annunci_estero") {
			createZoneSelectWithMap();
		}
	},

	isVacanze: function() {
		return this.options.section == "annunci_turistici";
	},

	show: function() {
		if (this.options.container) {
			jq(this.options.container).show();
		}
		if (this.options.loader) {
			jq(this.options.loader).hide();
		}
		if (this.options.ricercaHome) {
			enableBack();
		}
	},

	setFromCookieData: function(oCookie, callback) {
		var self = this;
		if (self.isVacanze()) {
			self.agComuneField.setFromCookieData(oCookie["annunci_turistici"], function() {
				self.show();
				if (jq.isFunction(callback)) {
					callback();
				}
			});
		}
	},

    emptyHiddenFields: function(){
        jq(document.dati.idAreaGeografica).val("");
        jq(document.dati.idRegione).val("");
        jq(document.dati.idProvincia).val("");
        jq(document.dati.idComune).val("");
    },

	reset: function() {
		if (this.isVacanze()) {
            this.emptyHiddenFields();
			this.agComuneField.reset();
		}
	},

	getIdContratto: function() {
		return jq(this.form).find("input[name=idContratto]:checked").val();
	},

	getNomeComune: function() {
		if (this.form.idComune.options) {
			return this.form.idComune.options[this.form.idComune.selectedIndex].innerHTML;
		} else if (this.agComuneField) {
			return this.agComuneField.getNome();
		}
	},

	onSubmit: function(event) {
		if (event && event.preventDefault) {
			event.preventDefault();
		}

		var form_nazione = this.options.nazione;
		var isValidForm;
		if (this.isVacanze()) {
			isValidForm = this.validateRicercaTuristica();
			pushSelectedZonesOnMapInForm.bind(this.form)();
		} else if (this.options.ricercaHome) {
			isValidForm = this.validateFormHomeRes();
		} else if (form_nazione == '' || form_nazione == 'IT') {
			isValidForm = validateForm();
			pushSelectedZonesOnMapInForm.bind(this.form)();
		} else {
			isValidForm = validateFormEstero();
			pushSelectedZonesOnMapInForm.bind(this.form)();
		}

		if (isValidForm) {
			if (this.isVacanze() && this.getIdContratto() == 2) {
				jq(this.form).attr("target", "_blank");
			} else {
				jq(this.form).attr("target", null);
			}
			if (this.options.ricercaHome) {
				this.form.azione.value = 'avviaricerca';
			}
			this.form.submit();
		}
	},

	validateFormHomeRes: function() {
		var ret_value = false;
	
		if (document.dati.idProvincia && document.dati.idProvincia.value!=''){
			ret_value = true;
		}
	
		if (!ret_value)
			alert("I campi regione e provincia sono obbligatori");
	
		if (ret_value) {
			if (jq("#tipoRicerca").val() == 'mappa') {
				uncheckZone(document.dati.idProvincia.value);
			} else {
				jq("#gm_area").val('');
				jq("#gm_area").attr("disabled", true);
			}
		}
		return ret_value;
	},

	validateRicercaTuristica: function() {
		if (!this.form.idAreaGeografica.value && !this.form.idComune.value) {
			alert("Specificare una località turistica o un comune");
			return false;
		}
		return true;
	},

	onContrattoChange: function() {
		var checked = jq(document.dati.idContratto).parent().find(':checked');
        this.emptyHiddenFields();
        this.agComuneField.setContratto(checked.val());
		if (checked.val() == 1) {
			jq("#linkcitta").fadeIn('fast');
		} else {
			jq("#linkcitta").fadeOut('fast');
		}
	},

	onAgComuneChange: function() {
		if (this.options.ricercaHome) {
			enableBack();
		}
		hideBoxZone();
		var comune = this.agComuneField.getComune();
		if (comune) {
			if (typeof xajax_getAjaxZonePagRicerca == 'function') {
				if (this.isVacanze()) {
					xajax_getAjaxZonePagRicerca(comune.idObject, comune.provincia.idObject, true, true);
				} else {
					xajax_getAjaxZonePagRicerca(comune.idObject, comune.provincia.idObject);
				}
			}
		} else {
			destroy_div('divLocalita');
			destroy_div('div_zone');
			destroy_div('divZ');
		}
		deselectAllText();
	},

	onComuneChange: function(evt) {
		hideBoxZone();
		if (typeof xajax_getAjaxZonePagRicerca == 'function') {
			xajax_getAjaxZonePagRicerca(this.form.idComune.value, this.form.idProvincia.value);
		}
	},
	
	getBackPath: function() {
		var path = [];
		var self = this;
		if (self.isVacanze()) {
			path.push(createPathLink("Case Vacanza",
									 function() { self.agComuneField.setObject(null); },
									 {id:"path_caseVacanza"}));
            if (typeof this.agComuneField != "undefined" && this.agComuneField){
                var area = this.agComuneField.getAreaGeografica();
                if (area) {
                    path.push(createPathLink(area.nome,
                                             function() { self.agComuneField.setObject(area); },
                                             {id: "path_areaGeografica"}));
                }

                var comune = this.agComuneField.getComune();
                if (comune) {
                    path.push(createPathLink(comune.nome,
                                             function() { return false; },
                                             {id: "path_comune"}));
                }
            }
		}
		return path;
	}
};

AGComuneField = function(fieldId, agOptions) {
	this.fieldId = fieldId;
	this._comuniRequest = null;
	this._object = null;
	this._lastValue = '';
	this._imSuggestion = null;
	this._inhibitChange = false;
	this.options = jq.extend({
		agHiddenInput: null,
		comuneHiddenInput: null,
		provinciaHiddenInput: null,
		regioneHiddenInput: null,
		onSelected: function() { },
		suggestionOptions: {}
	}, agOptions);
};

AGComuneField.prototype = {
	init: function(initCallback) {
		var self = this;
		var jInput = jq("#"+self.fieldId);
		jInput.attr('title', 'Inserisci il nome di una località turistica o di un comune');
		self._lastValue = jInput.val();

		jInput.blur(function() {
			jq(this).val(self._lastValue);
		});
		jInput.focus(function() {
			jq(this).val('');
		});

		var sOptions = jq.extend({
			selectRowOnOver: false,
			hideOnMouseOut: false,
			minChars: 2,
			url: "/area_geografica_suggestion.php?maxRows=15&contratto=1",
			onselect: self._onSelectItem.bind(self),
			autoselectFirstItem: true,
			getResultOnFocus: true,
			resetQsFieldOnNotSel: false,
			placeholderText: "Digita la località"
		}, self.options.suggestionOptions);

		self._imSuggestion = new Im_Suggestion(self.fieldId, sOptions);

		// Ottengo l'oggetto iniziale
		if (this.options.comuneHiddenInput && this.options.comuneHiddenInput.value) {
			this._inhibitChange = true;
			this.setFromTypeId("comune", this.options.comuneHiddenInput.value, initCallback);
		} else if (this.options.areaHiddenInput && this.options.areaHiddenInput.value) {
			this._inhibitChange = true;
			this.setFromTypeId("areaGeografica", this.options.areaHiddenInput.value, initCallback);
		} else if (jq.isFunction(initCallback)) {
			initCallback();
		}
	},

	getUrlCartina: function() {
		var imageUrl = '';
		if (this._object) {
			var id = this._object.idObject;
			if (this._object.type == 'comune') {
				return __gvs_MEDIA_SERVER_IMAGE+"static/cartine/medie/"+id[id.length-1]+"/"+id+".png";
			} else {
				return __gvs_MEDIA_SERVER_IMAGE+"static/cartine/aree_geografiche/150x150/"+id+".gif";
			}
		} else {
			return null;
		}
	},

	getObject: function() {
		return this._object;
	},

	getComune: function() {
		return this._object && this._object.type == "comune" ? this._object : null;
	},

	getProvincia: function() {
		var comune = this.getComune();
		if (comune && comune.provincia) {
			return comune.provincia;
		}
	},

	getRegione: function() {
		var provincia = this.getProvincia();
		if (provincia && provincia.regione) {
			return provincia.regione;
		}
	},

	getAreaGeografica: function() {
		if (!this._object) {
			return null;
		}
		if (this._object.type == "areaGeografica") {
			return this._object;
		} else {
			return this._object.areaGeografica;
		}
	},

	getNome: function() {
		var jInput = jq("#"+this.fieldId);
		return jInput.val();
	},

	setFromTypeId: function (type, idObject, callback) {
		var self = this;
		if (!type || !idObject) {
			self.reset();
			if (jq.isFunction(callback)) {
				callback();
			}
			return;
		}
		self._fetchData(type, idObject,
						function (data) {
							if (typeof data.result != 'undefined') {
								self.setObject(data.result);
							}
							if (jq.isFunction(callback)) {
								callback();
							}
						});
	},

	reset: function() {
		this.setObject(null);
	},

	setContratto: function (idContratto) {
		this._imSuggestion.options.url = "/area_geografica_suggestion.php?maxRows=15&contratto="+idContratto;
		this.setObject(null);
	},			

	setFromCookieData: function (data, callback) {
		if (data && data.comune) {
			this.setFromTypeId ("comune", data.comune, callback);
		} else if (data && data.areaGeografica) {
			this.setFromTypeId ("areaGeografica", data.areaGeografica, callback);
		} else if (jq.isFunction(callback)) {
			callback();
		}
	},

	setObject: function (object) {
		var jInput = jq("#"+this.fieldId);
		if (!object) {
			object = {idObject: null, nome: ''};
			this._object = null;
		} else {
			this._object = object;
		}

		var hiddenInputOld;
		var hiddenInputNew;

		if (object.type == "areaGeografica") {
			jq(this.options.comuneHiddenInput).val("");
			jq(this.options.provinciaHiddenInput).val("");
			jq(this.options.regioneHiddenInput).val("");
			jq(this.options.areaHiddenInput).val(object.idObject);
		} else if (object.type == "comune") {
			jq(this.options.comuneHiddenInput).val(object.idObject);
            if (typeof object.provincia != "undefined"){
			    jq(this.options.provinciaHiddenInput).val(object.provincia.idObject);
			    jq(this.options.regioneHiddenInput).val(object.provincia.regione.idObject);
            }
			jq(this.options.areaHiddenInput).val("");
		}

		this._imSuggestion.default_value = '';
		if (!object.nome || object.nome == this._imSuggestion.options.placeholderText) {
			this._lastValue = '';
			this._imSuggestion.resetField();
		} else {
			jInput.css('color', 'black');
			jInput.val(object.nome);
			this._lastValue = object.nome;
		}

		if (!this._inhibitChange) {
			jq(this).trigger('change');
		} else {
			this._inhibitChange = false;
		}
	},

	_onSelectItem: function (selectedItem) {
		this.setObject (selectedItem.object);
	},

	_fetchData: function (type, idObject, callback) {
		var self = this;
		if (self._dataRequest) {
			self._dataRequest.abort();
		}
		self._dataRequest = jq.getJSON("/getInfoVacanze.php",
									   {type: type,
										idObject: idObject},
									   function(data) {
										   self._dataRequest = null;
										   callback(data);
									   });
	}
};

SearchForm.prototype.onTipologiaChange = function() {
		
	var tipologiaVal = this.tipologia.val();
	var tipologiaValCustom = new Array('6', '11', '12', '13');

	var tipologiaFieldsDefault = {
		divAscensore:{actions:['showDiv']},
		divGiardino:{actions:['showDiv']},
		divLocali:{actions:['showDiv']},
		divRiscaldamento:{actions:['showDiv']},
		divBoxAuto:{actions:['showDiv']},
		divArredato:{actions:['showDiv']},
		divTerrazzo:{actions:['showDiv']},
		divBalcone:{actions:['showDiv']}
	}

	var tipologiaFields = {
		'6': jq.extend({}, tipologiaFieldsDefault, {
				ascensore:{actions:['resetCheckbox']},
				divAscensore:{actions:['hideDiv']},
				selectGiardino:{actions:['resetSelect']},
				divGiardino:{actions:['hideDiv']},
				localiMinimo:{actions:['resetField']},
				localiMassimo:{actions:['resetField']},
				divLocali:{actions:['hideDiv']},
				selectRiscaldamenti:{actions:['resetSelect']},
				divRiscaldamento:{actions:['hideDiv']},
				selectBoxAuto:{actions:['resetSelect']},
				divBoxAuto:{actions:['hideDiv']},
				arredato:{actions:['resetCheckbox']},
				divArredato:{actions:['hideDiv']},
				terrazzo:{actions:['resetCheckbox']},
				divTerrazzo:{actions:['hideDiv']},
				balcone:{actions:['resetCheckbox']},
				divBalcone:{actions:['hideDiv']}
			}),
		'11': jq.extend({}, tipologiaFieldsDefault, {
				ascensore:{actions:['resetCheckbox']},
				divAscensore:{actions:['hideDiv']}
			}),
		'12': jq.extend({}, tipologiaFieldsDefault, {
				ascensore:{actions:['resetCheckbox']},
				divAscensore:{actions:['hideDiv']}
			}),
		'13': jq.extend({}, tipologiaFieldsDefault, {
				ascensore:{actions:['resetCheckbox']},
				divAscensore:{actions:['hideDiv']}
			})
	}

	if (tipologiaVal && (jq.inArray(tipologiaVal, tipologiaValCustom) > -1)){
		var fields = tipologiaFields[tipologiaVal];
	} else {
		var fields = tipologiaFieldsDefault;
	}

	for (var field in fields){
		var actions = fields[field]['actions'];
		for (var action in actions){
			this[actions[action]](field);
		}
	}
}

SearchForm.prototype.onCategoriaStanzaChange = function(){
	
	var categoriaStanzaVal = this.categoriaStanza.val();
	var categoriaStanzaValCustom = new Array('1', '2');

	var categoriaStanzaFieldsDefault = {
		idTipologiaStanza:{actions:['resetSelect']},
		divTipologiaStanza:{actions:['hideDiv']}
	}

	var categoriaStanzaFields = {
		'1': jq.extend({}, categoriaStanzaFieldsDefault, {
				divTipologiaStanza:{actions:['showDiv']}
			}),
		'2': jq.extend({}, categoriaStanzaFieldsDefault, {
				divTipologiaStanza:{actions:['showDiv']}
			})
	}

	if (categoriaStanzaVal && (jq.inArray(categoriaStanzaVal, categoriaStanzaValCustom) > -1)){
		var fields = categoriaStanzaFields[categoriaStanzaVal];
	} else {
		var fields = categoriaStanzaFieldsDefault;
	}

	for (var field in fields){
		var actions = fields[field]['actions'];
		for (var action in actions){
			this[actions[action]](field);
		}
	}
}

SearchForm.prototype.showDiv = function(id){
	var div = jq('#'+id);
	if (div.is(':visible') == false){
		div.show();
	}
}
	
SearchForm.prototype.hideDiv = function(id){
	var div = jq('#'+id);
	if (div.is(':visible') == true){
		div.hide();
	}
}
	
SearchForm.prototype.resetField = function(id){
	var field = jq('#'+id);
	field.val('');
}
	
SearchForm.prototype.resetSelect = function(id){
	var select = jq('#'+id);
	select.find('option:first').attr('selected','selected');
}

SearchForm.prototype.resetCheckbox = function(id){
	var checkbox = jq('#'+id);
	checkbox.attr('checked', false);
}
