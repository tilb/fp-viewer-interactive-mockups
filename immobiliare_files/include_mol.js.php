validazioniRicercaMOLCaricato = 1; //questa variabile serve per capire se questo file .js è stato caricato dal form.
numeroBanche = 40; //viene stampato dai formini
numeroMutui=400; //viene stampato dai formini
taegDa = "2,97%"; //viene stampato dai formini

function CheckCampiRicercaMOL(theForm) {
//se esistono i campi, li valida, eventualmente settando il focus sul campo se non passa la validazione.
//l'unica unità di misura utilizzata è l'euro, in cui le virgole non sono ammesse, e il punto è solo separatore delle migliaia.

	if(theForm.CodiceFinalita) {
		if(theForm.CodiceFinalita.options[theForm.CodiceFinalita.selectedIndex].value=='') {
			alert("Il campo \"Finalità del mutuo\" è obbligatorio ");
			theForm.CodiceFinalita.focus();
			return (false);
		}
	}

	if (theForm.CodiceTipoTasso) {
		if (theForm.CodiceTipoTasso.selectedIndex == 0) {
			alert("Il campo \"Tipo di tasso/prodotto\" è obbligatorio ");
			theForm.CodiceTipoTasso.focus();
			return (false);
		}
	}

	//validazione Valore Immobile
	if (theForm.Valore) {
		//verifico che non sia campo vuoto
		if (theForm.Valore.value=="")  {
			alert("Inserire il valore dell'immobile");
			theForm.Valore.focus();
			return (false);
		}
		//verifico che siano solo numeri o punti
		for (i = 0;  i < theForm.Valore.value.length;  i++) {
			if (!((theForm.Valore.value.charAt(i) >= '0' && theForm.Valore.value.charAt(i) <= '9') || theForm.Valore.value.charAt(i)=='.')) {
				alert('Attenzione! Inserire solo numeri interi, non usare caratteri nel campo "Valore Immobile"');
				theForm.Valore.focus();
				return (false);
			}
		}
		//verifico che non ci siano punti nei posti sbagliati (possono essere solo per separare le migliaia)
		j=1;
		lung = theForm.Valore.value.length;
		strTemp = "";
		for(i=lung-1;i>=0;i--) {
			if(theForm.Valore.value.charAt(i)=='.' && j%4!=0) {
				alert('Attenzione! Usare il punto solo per separare le migliaia, nel campo "Valore Immobile"');
				theForm.Valore.focus();
				return (false);
			}
			if(theForm.Valore.value.charAt(i)!='.') {
				strTemp = theForm.Valore.value.charAt(i) + strTemp;
			}
			j++;
		}
		//testo che il valore dell'immobile non sia inferiore a 3000 di euro.
		if (parseFloat(strTemp)<3000)  {
			alert("Attenzione! Il valore dell'immobile deve essere superiore a 3000 Euro.")
			theForm.Valore.focus();
			return (false);
		}
		//testo che il valore dell'immobile non sia superiore a 5 milioni di euro.
		if (parseFloat(strTemp)>5000000)  {
			alert("Attenzione! Il valore dell'immobile non può essere superiore a 5.000.000 di Euro.")
			theForm.Valore.focus();
			return (false);
		}
		//se ha passato tutte le validazioni, tolgo i punti perchè non servono.
		theForm.Valore.value = strTemp;		
	}

	//validazione Importo Mutuo
	if (theForm.ImportoMutuo) {
		//verifico che non sia campo vuoto
		if (theForm.ImportoMutuo.value=="")  {
			alert("Inserire l'importo del mutuo");
			theForm.ImportoMutuo.focus();
			return (false);
		}
		//verifico che siano solo numeri o punti
		for (i = 0;  i < theForm.ImportoMutuo.value.length;  i++) {
			if (!((theForm.ImportoMutuo.value.charAt(i) >= '0' && theForm.ImportoMutuo.value.charAt(i) <= '9') || theForm.ImportoMutuo.value.charAt(i)=='.')) {
				alert('Attenzione! Inserire solo numeri interi, non usare caratteri nel campo "Importo Mutuo"');
				theForm.ImportoMutuo.focus();
				return (false);
			}
		}
		//verifico che non ci siano punti nei posti sbagliati (possono essere solo per separare le migliaia)
		j=1;
		lung = theForm.ImportoMutuo.value.length;
		strTemp = "";
		for(i=lung-1;i>=0;i--) {
			if(theForm.ImportoMutuo.value.charAt(i)=='.' && j%4!=0) {
				alert('Attenzione! Usare il punto solo per separare le migliaia, nel campo "Importo Mutuo"');
				theForm.ImportoMutuo.focus();
				return (false);
			}
			if(theForm.ImportoMutuo.value.charAt(i)!='.') {
				strTemp = theForm.ImportoMutuo.value.charAt(i) + strTemp;
			}
			j++;
		}
		//testo che il ImportoMutuo dell'immobile non sia inferiore a 1000 euro.
		if (parseFloat(strTemp) < 1000)  {
			alert("Attenzione! Il valore l'importo del mutuo non può essere inferiore a 1.000 Euro.")
			theForm.ImportoMutuo.focus();
			return (false);
		}
		//testo che il ImportoMutuo dell'immobile non sia superiore a 3 milioni di euro.
		if (parseFloat(strTemp)>3000000)  {
			alert("Attenzione! Il valore l'importo del mutuo non può essere superiore a 3.000.000 di Euro.")
			theForm.ImportoMutuo.focus();
			return (false);
		}
		//se ha passato tutte le validazioni, tolgo i punti perchè non servono.
		theForm.ImportoMutuo.value = strTemp;		
	}

	if (theForm.ImportoMutuo && theForm.Valore) {
		if (parseFloat(theForm.Valore.value)<parseFloat(theForm.ImportoMutuo.value))  {
			alert("Attenzione! L'importo del mutuo non può essere superiore al valore dell'immobile");
			theForm.ImportoMutuo.focus();
			return (false);
		}
	}

	if (theForm.CodiceDurata) {
		if (theForm.CodiceDurata.selectedIndex == 0) {
			alert("Il campo \"Durata\" è obbligatorio ");
			theForm.CodiceDurata.focus();
			return (false);
		}
	}

	if (theForm.CodiceFrequenza) {
		if (theForm.CodiceFrequenza.selectedIndex == 0) {
			alert("Il campo \"Frequenza rate\" è obbligatorio ");
			theForm.CodiceFrequenza.focus();
			return (false);
		}
	}

	if (theForm.Eta) {
		//età composta solo da cifre
		for (i = 0;  i < theForm.Eta.value.length;  i++) {
			if (theForm.Eta.value.charAt(i) < '0' || theForm.Eta.value.charAt(i) > '9') {
				alert("Attenzione! L'età del richiedente non è stata inserita correttamente");
				theForm.Eta.focus();
				return (false);
			}
		}
		//da 18 a 75 anni ammessi.
		if ((theForm.Eta.value<18)||(theForm.Eta.value>75)) {
			alert("L'età del richiedente deve essere compresa tra 18 e 75 anni");
			theForm.Eta.focus();
			return (false);
		}
	}

	if (theForm.CodCategoriaReddituale) {
		if (theForm.CodCategoriaReddituale.selectedIndex == 0) {
			alert("Il campo \"Posizione lavorativa\" è obbligatorio ");
			theForm.CodCategoriaReddituale.focus();
			return (false);
		}
	}

	//validazione Reddito
	if (theForm.Reddito) {
		//verifico che non sia campo vuoto
		if (theForm.Reddito.value=="")  {
			alert("Inserire il reddito mensile netto totale dei richiedenti");
			theForm.Reddito.focus();
			return (false);
		}
		//verifico che siano solo numeri o punti
		for (i = 0;  i < theForm.Reddito.value.length;  i++) {
			if (!((theForm.Reddito.value.charAt(i) >= '0' && theForm.Reddito.value.charAt(i) <= '9') || theForm.Reddito.value.charAt(i)=='.')) {
				alert('Attenzione! Inserire solo numeri interi, non usare caratteri nel campo "Reddito"');
				theForm.Reddito.focus();
				return (false);
			}
		}
		//verifico che non ci siano punti nei posti sbagliati (possono essere solo per separare le migliaia)
		j=1;
		lung = theForm.Reddito.value.length;
		strTemp = "";
		for(i=lung-1;i>=0;i--) {
			if(theForm.Reddito.value.charAt(i)=='.' && j%4!=0) {
				alert('Attenzione! Usare il punto solo per separare le migliaia, nel campo "Reddito"');
				theForm.Reddito.focus();
				return (false);
			}
			if(theForm.Reddito.value.charAt(i)!='.') {
				strTemp = theForm.Reddito.value.charAt(i) + strTemp;
			}
			j++;
		}
		//se ha passato tutte le validazioni, tolgo i punti perchè non servono.
		theForm.Reddito.value = strTemp;		
	}

	if (theForm.CodiceResidenza) {
		if (theForm.CodiceResidenza.selectedIndex == 0) {
			alert("Il campo \"Domicilio richiedente\" è obbligatorio ");
			theForm.CodiceResidenza.focus();
			return (false);
		}
	}

  	if (theForm.CodiceLocalita) {
		if (theForm.CodiceLocalita.selectedIndex == 0) {
			alert("Il campo \"Provincia dell'immobile\" è obbligatorio ");
			theForm.CodiceLocalita.focus();
			return (false);
		}
	}

	return (true);
}


function caricaComboMOL_FinalitaMutuo(theCombo){
	theCombo.length=1+7;

		theCombo.options[1].value = '1';
		theCombo.options[1].text =  'Acquisto Prima Casa';

		theCombo.options[2].value = '2';
		theCombo.options[2].text =  'Acquisto Seconda Casa';

		theCombo.options[3].value = '16';
		theCombo.options[3].text =  'Surroga (Cambia mutuo a spese zero)';

		theCombo.options[4].value = '6';
		theCombo.options[4].text =  'Sostituzione + Liquidita\'';

		theCombo.options[5].value = '3';
		theCombo.options[5].text =  'Ristrutturazione';

		theCombo.options[6].value = '4';
		theCombo.options[6].text =  'Completamento Costruzione';

		theCombo.options[7].value = '15';
		theCombo.options[7].text =  'Liquidita\'';

}function caricaComboMOL_TipiTasso(theCombo) {
    theCombo.length = 1 + 6;
    theCombo.options[1].value = '1';
    theCombo.options[1].text = 'Fisso';
    theCombo.options[2].value = '2';
    theCombo.options[2].text = 'Variabile';
    theCombo.options[3].value = '7';
    theCombo.options[3].text = 'Variabile con cap';
    theCombo.options[4].value = '6';
    theCombo.options[4].text = 'Variabile a rata costante';
    theCombo.options[5].value = '12';
    theCombo.options[5].text = 'Variabile offset';
    theCombo.options[6].value = '3';
    theCombo.options[6].text = 'Misto';
} 
 
function caricaComboMOL_Provincie(theCombo1,theCombo2){
	
	//popola una o due combo con le provincie. Il 2° parametro può essere null.
	
	theCombo1.length=1+110;
	if (theCombo2 != null) theCombo2.length=1+110;
	
 
		theCombo1.options[1].value = '1';
		theCombo1.options[1].text =  'Agrigento';
		if (theCombo2 != null) {
			theCombo2.options[1].value = '1';
			theCombo2.options[1].text =  'Agrigento';
		}
 
		theCombo1.options[2].value = '2';
		theCombo1.options[2].text =  'Alessandria';
		if (theCombo2 != null) {
			theCombo2.options[2].value = '2';
			theCombo2.options[2].text =  'Alessandria';
		}
 
		theCombo1.options[3].value = '3';
		theCombo1.options[3].text =  'Ancona';
		if (theCombo2 != null) {
			theCombo2.options[3].value = '3';
			theCombo2.options[3].text =  'Ancona';
		}
 
		theCombo1.options[4].value = '4';
		theCombo1.options[4].text =  'Aosta';
		if (theCombo2 != null) {
			theCombo2.options[4].value = '4';
			theCombo2.options[4].text =  'Aosta';
		}
 
		theCombo1.options[5].value = '5';
		theCombo1.options[5].text =  'Arezzo';
		if (theCombo2 != null) {
			theCombo2.options[5].value = '5';
			theCombo2.options[5].text =  'Arezzo';
		}
 
		theCombo1.options[6].value = '6';
		theCombo1.options[6].text =  'Ascoli Piceno';
		if (theCombo2 != null) {
			theCombo2.options[6].value = '6';
			theCombo2.options[6].text =  'Ascoli Piceno';
		}
 
		theCombo1.options[7].value = '7';
		theCombo1.options[7].text =  'Asti';
		if (theCombo2 != null) {
			theCombo2.options[7].value = '7';
			theCombo2.options[7].text =  'Asti';
		}
 
		theCombo1.options[8].value = '8';
		theCombo1.options[8].text =  'Avellino';
		if (theCombo2 != null) {
			theCombo2.options[8].value = '8';
			theCombo2.options[8].text =  'Avellino';
		}
 
		theCombo1.options[9].value = '9';
		theCombo1.options[9].text =  'Bari';
		if (theCombo2 != null) {
			theCombo2.options[9].value = '9';
			theCombo2.options[9].text =  'Bari';
		}
 
		theCombo1.options[10].value = '108';
		theCombo1.options[10].text =  'Barletta Andria Trani';
		if (theCombo2 != null) {
			theCombo2.options[10].value = '108';
			theCombo2.options[10].text =  'Barletta Andria Trani';
		}
 
		theCombo1.options[11].value = '10';
		theCombo1.options[11].text =  'Belluno';
		if (theCombo2 != null) {
			theCombo2.options[11].value = '10';
			theCombo2.options[11].text =  'Belluno';
		}
 
		theCombo1.options[12].value = '11';
		theCombo1.options[12].text =  'Benevento';
		if (theCombo2 != null) {
			theCombo2.options[12].value = '11';
			theCombo2.options[12].text =  'Benevento';
		}
 
		theCombo1.options[13].value = '12';
		theCombo1.options[13].text =  'Bergamo';
		if (theCombo2 != null) {
			theCombo2.options[13].value = '12';
			theCombo2.options[13].text =  'Bergamo';
		}
 
		theCombo1.options[14].value = '13';
		theCombo1.options[14].text =  'Biella';
		if (theCombo2 != null) {
			theCombo2.options[14].value = '13';
			theCombo2.options[14].text =  'Biella';
		}
 
		theCombo1.options[15].value = '14';
		theCombo1.options[15].text =  'Bologna';
		if (theCombo2 != null) {
			theCombo2.options[15].value = '14';
			theCombo2.options[15].text =  'Bologna';
		}
 
		theCombo1.options[16].value = '15';
		theCombo1.options[16].text =  'Bolzano';
		if (theCombo2 != null) {
			theCombo2.options[16].value = '15';
			theCombo2.options[16].text =  'Bolzano';
		}
 
		theCombo1.options[17].value = '16';
		theCombo1.options[17].text =  'Brescia';
		if (theCombo2 != null) {
			theCombo2.options[17].value = '16';
			theCombo2.options[17].text =  'Brescia';
		}
 
		theCombo1.options[18].value = '17';
		theCombo1.options[18].text =  'Brindisi';
		if (theCombo2 != null) {
			theCombo2.options[18].value = '17';
			theCombo2.options[18].text =  'Brindisi';
		}
 
		theCombo1.options[19].value = '18';
		theCombo1.options[19].text =  'Cagliari';
		if (theCombo2 != null) {
			theCombo2.options[19].value = '18';
			theCombo2.options[19].text =  'Cagliari';
		}
 
		theCombo1.options[20].value = '19';
		theCombo1.options[20].text =  'Caltanissetta';
		if (theCombo2 != null) {
			theCombo2.options[20].value = '19';
			theCombo2.options[20].text =  'Caltanissetta';
		}
 
		theCombo1.options[21].value = '20';
		theCombo1.options[21].text =  'Campobasso';
		if (theCombo2 != null) {
			theCombo2.options[21].value = '20';
			theCombo2.options[21].text =  'Campobasso';
		}
 
		theCombo1.options[22].value = '107';
		theCombo1.options[22].text =  'Carbonia Iglesias';
		if (theCombo2 != null) {
			theCombo2.options[22].value = '107';
			theCombo2.options[22].text =  'Carbonia Iglesias';
		}
 
		theCombo1.options[23].value = '21';
		theCombo1.options[23].text =  'Caserta';
		if (theCombo2 != null) {
			theCombo2.options[23].value = '21';
			theCombo2.options[23].text =  'Caserta';
		}
 
		theCombo1.options[24].value = '22';
		theCombo1.options[24].text =  'Catania';
		if (theCombo2 != null) {
			theCombo2.options[24].value = '22';
			theCombo2.options[24].text =  'Catania';
		}
 
		theCombo1.options[25].value = '23';
		theCombo1.options[25].text =  'Catanzaro';
		if (theCombo2 != null) {
			theCombo2.options[25].value = '23';
			theCombo2.options[25].text =  'Catanzaro';
		}
 
		theCombo1.options[26].value = '24';
		theCombo1.options[26].text =  'Chieti';
		if (theCombo2 != null) {
			theCombo2.options[26].value = '24';
			theCombo2.options[26].text =  'Chieti';
		}
 
		theCombo1.options[27].value = '25';
		theCombo1.options[27].text =  'Como';
		if (theCombo2 != null) {
			theCombo2.options[27].value = '25';
			theCombo2.options[27].text =  'Como';
		}
 
		theCombo1.options[28].value = '26';
		theCombo1.options[28].text =  'Cosenza';
		if (theCombo2 != null) {
			theCombo2.options[28].value = '26';
			theCombo2.options[28].text =  'Cosenza';
		}
 
		theCombo1.options[29].value = '27';
		theCombo1.options[29].text =  'Cremona';
		if (theCombo2 != null) {
			theCombo2.options[29].value = '27';
			theCombo2.options[29].text =  'Cremona';
		}
 
		theCombo1.options[30].value = '28';
		theCombo1.options[30].text =  'Crotone';
		if (theCombo2 != null) {
			theCombo2.options[30].value = '28';
			theCombo2.options[30].text =  'Crotone';
		}
 
		theCombo1.options[31].value = '29';
		theCombo1.options[31].text =  'Cuneo';
		if (theCombo2 != null) {
			theCombo2.options[31].value = '29';
			theCombo2.options[31].text =  'Cuneo';
		}
 
		theCombo1.options[32].value = '30';
		theCombo1.options[32].text =  'Enna';
		if (theCombo2 != null) {
			theCombo2.options[32].value = '30';
			theCombo2.options[32].text =  'Enna';
		}
 
		theCombo1.options[33].value = '109';
		theCombo1.options[33].text =  'Fermo';
		if (theCombo2 != null) {
			theCombo2.options[33].value = '109';
			theCombo2.options[33].text =  'Fermo';
		}
 
		theCombo1.options[34].value = '31';
		theCombo1.options[34].text =  'Ferrara';
		if (theCombo2 != null) {
			theCombo2.options[34].value = '31';
			theCombo2.options[34].text =  'Ferrara';
		}
 
		theCombo1.options[35].value = '32';
		theCombo1.options[35].text =  'Firenze';
		if (theCombo2 != null) {
			theCombo2.options[35].value = '32';
			theCombo2.options[35].text =  'Firenze';
		}
 
		theCombo1.options[36].value = '33';
		theCombo1.options[36].text =  'Foggia';
		if (theCombo2 != null) {
			theCombo2.options[36].value = '33';
			theCombo2.options[36].text =  'Foggia';
		}
 
		theCombo1.options[37].value = '34';
		theCombo1.options[37].text =  'Forlì-Cesena';
		if (theCombo2 != null) {
			theCombo2.options[37].value = '34';
			theCombo2.options[37].text =  'Forlì-Cesena';
		}
 
		theCombo1.options[38].value = '35';
		theCombo1.options[38].text =  'Frosinone';
		if (theCombo2 != null) {
			theCombo2.options[38].value = '35';
			theCombo2.options[38].text =  'Frosinone';
		}
 
		theCombo1.options[39].value = '36';
		theCombo1.options[39].text =  'Genova';
		if (theCombo2 != null) {
			theCombo2.options[39].value = '36';
			theCombo2.options[39].text =  'Genova';
		}
 
		theCombo1.options[40].value = '37';
		theCombo1.options[40].text =  'Gorizia';
		if (theCombo2 != null) {
			theCombo2.options[40].value = '37';
			theCombo2.options[40].text =  'Gorizia';
		}
 
		theCombo1.options[41].value = '38';
		theCombo1.options[41].text =  'Grosseto';
		if (theCombo2 != null) {
			theCombo2.options[41].value = '38';
			theCombo2.options[41].text =  'Grosseto';
		}
 
		theCombo1.options[42].value = '39';
		theCombo1.options[42].text =  'Imperia';
		if (theCombo2 != null) {
			theCombo2.options[42].value = '39';
			theCombo2.options[42].text =  'Imperia';
		}
 
		theCombo1.options[43].value = '40';
		theCombo1.options[43].text =  'Isernia';
		if (theCombo2 != null) {
			theCombo2.options[43].value = '40';
			theCombo2.options[43].text =  'Isernia';
		}
 
		theCombo1.options[44].value = '42';
		theCombo1.options[44].text =  'L´Aquila';
		if (theCombo2 != null) {
			theCombo2.options[44].value = '42';
			theCombo2.options[44].text =  'L´Aquila';
		}
 
		theCombo1.options[45].value = '41';
		theCombo1.options[45].text =  'La Spezia';
		if (theCombo2 != null) {
			theCombo2.options[45].value = '41';
			theCombo2.options[45].text =  'La Spezia';
		}
 
		theCombo1.options[46].value = '43';
		theCombo1.options[46].text =  'Latina';
		if (theCombo2 != null) {
			theCombo2.options[46].value = '43';
			theCombo2.options[46].text =  'Latina';
		}
 
		theCombo1.options[47].value = '44';
		theCombo1.options[47].text =  'Lecce';
		if (theCombo2 != null) {
			theCombo2.options[47].value = '44';
			theCombo2.options[47].text =  'Lecce';
		}
 
		theCombo1.options[48].value = '45';
		theCombo1.options[48].text =  'Lecco';
		if (theCombo2 != null) {
			theCombo2.options[48].value = '45';
			theCombo2.options[48].text =  'Lecco';
		}
 
		theCombo1.options[49].value = '46';
		theCombo1.options[49].text =  'Livorno';
		if (theCombo2 != null) {
			theCombo2.options[49].value = '46';
			theCombo2.options[49].text =  'Livorno';
		}
 
		theCombo1.options[50].value = '47';
		theCombo1.options[50].text =  'Lodi';
		if (theCombo2 != null) {
			theCombo2.options[50].value = '47';
			theCombo2.options[50].text =  'Lodi';
		}
 
		theCombo1.options[51].value = '48';
		theCombo1.options[51].text =  'Lucca';
		if (theCombo2 != null) {
			theCombo2.options[51].value = '48';
			theCombo2.options[51].text =  'Lucca';
		}
 
		theCombo1.options[52].value = '49';
		theCombo1.options[52].text =  'Macerata';
		if (theCombo2 != null) {
			theCombo2.options[52].value = '49';
			theCombo2.options[52].text =  'Macerata';
		}
 
		theCombo1.options[53].value = '50';
		theCombo1.options[53].text =  'Mantova';
		if (theCombo2 != null) {
			theCombo2.options[53].value = '50';
			theCombo2.options[53].text =  'Mantova';
		}
 
		theCombo1.options[54].value = '51';
		theCombo1.options[54].text =  'Massa Carrara';
		if (theCombo2 != null) {
			theCombo2.options[54].value = '51';
			theCombo2.options[54].text =  'Massa Carrara';
		}
 
		theCombo1.options[55].value = '52';
		theCombo1.options[55].text =  'Matera';
		if (theCombo2 != null) {
			theCombo2.options[55].value = '52';
			theCombo2.options[55].text =  'Matera';
		}
 
		theCombo1.options[56].value = '106';
		theCombo1.options[56].text =  'Medio Campidano';
		if (theCombo2 != null) {
			theCombo2.options[56].value = '106';
			theCombo2.options[56].text =  'Medio Campidano';
		}
 
		theCombo1.options[57].value = '53';
		theCombo1.options[57].text =  'Messina';
		if (theCombo2 != null) {
			theCombo2.options[57].value = '53';
			theCombo2.options[57].text =  'Messina';
		}
 
		theCombo1.options[58].value = '54';
		theCombo1.options[58].text =  'Milano';
		if (theCombo2 != null) {
			theCombo2.options[58].value = '54';
			theCombo2.options[58].text =  'Milano';
		}
 
		theCombo1.options[59].value = '55';
		theCombo1.options[59].text =  'Modena';
		if (theCombo2 != null) {
			theCombo2.options[59].value = '55';
			theCombo2.options[59].text =  'Modena';
		}
 
		theCombo1.options[60].value = '110';
		theCombo1.options[60].text =  'Monza e Brianza';
		if (theCombo2 != null) {
			theCombo2.options[60].value = '110';
			theCombo2.options[60].text =  'Monza e Brianza';
		}
 
		theCombo1.options[61].value = '56';
		theCombo1.options[61].text =  'Napoli';
		if (theCombo2 != null) {
			theCombo2.options[61].value = '56';
			theCombo2.options[61].text =  'Napoli';
		}
 
		theCombo1.options[62].value = '57';
		theCombo1.options[62].text =  'Novara';
		if (theCombo2 != null) {
			theCombo2.options[62].value = '57';
			theCombo2.options[62].text =  'Novara';
		}
 
		theCombo1.options[63].value = '58';
		theCombo1.options[63].text =  'Nuoro';
		if (theCombo2 != null) {
			theCombo2.options[63].value = '58';
			theCombo2.options[63].text =  'Nuoro';
		}
 
		theCombo1.options[64].value = '105';
		theCombo1.options[64].text =  'Ogliastra';
		if (theCombo2 != null) {
			theCombo2.options[64].value = '105';
			theCombo2.options[64].text =  'Ogliastra';
		}
 
		theCombo1.options[65].value = '104';
		theCombo1.options[65].text =  'Olbia Tempio';
		if (theCombo2 != null) {
			theCombo2.options[65].value = '104';
			theCombo2.options[65].text =  'Olbia Tempio';
		}
 
		theCombo1.options[66].value = '59';
		theCombo1.options[66].text =  'Oristano';
		if (theCombo2 != null) {
			theCombo2.options[66].value = '59';
			theCombo2.options[66].text =  'Oristano';
		}
 
		theCombo1.options[67].value = '60';
		theCombo1.options[67].text =  'Padova';
		if (theCombo2 != null) {
			theCombo2.options[67].value = '60';
			theCombo2.options[67].text =  'Padova';
		}
 
		theCombo1.options[68].value = '61';
		theCombo1.options[68].text =  'Palermo';
		if (theCombo2 != null) {
			theCombo2.options[68].value = '61';
			theCombo2.options[68].text =  'Palermo';
		}
 
		theCombo1.options[69].value = '62';
		theCombo1.options[69].text =  'Parma';
		if (theCombo2 != null) {
			theCombo2.options[69].value = '62';
			theCombo2.options[69].text =  'Parma';
		}
 
		theCombo1.options[70].value = '63';
		theCombo1.options[70].text =  'Pavia';
		if (theCombo2 != null) {
			theCombo2.options[70].value = '63';
			theCombo2.options[70].text =  'Pavia';
		}
 
		theCombo1.options[71].value = '64';
		theCombo1.options[71].text =  'Perugia';
		if (theCombo2 != null) {
			theCombo2.options[71].value = '64';
			theCombo2.options[71].text =  'Perugia';
		}
 
		theCombo1.options[72].value = '65';
		theCombo1.options[72].text =  'Pesaro-Urbino';
		if (theCombo2 != null) {
			theCombo2.options[72].value = '65';
			theCombo2.options[72].text =  'Pesaro-Urbino';
		}
 
		theCombo1.options[73].value = '66';
		theCombo1.options[73].text =  'Pescara';
		if (theCombo2 != null) {
			theCombo2.options[73].value = '66';
			theCombo2.options[73].text =  'Pescara';
		}
 
		theCombo1.options[74].value = '67';
		theCombo1.options[74].text =  'Piacenza';
		if (theCombo2 != null) {
			theCombo2.options[74].value = '67';
			theCombo2.options[74].text =  'Piacenza';
		}
 
		theCombo1.options[75].value = '68';
		theCombo1.options[75].text =  'Pisa';
		if (theCombo2 != null) {
			theCombo2.options[75].value = '68';
			theCombo2.options[75].text =  'Pisa';
		}
 
		theCombo1.options[76].value = '69';
		theCombo1.options[76].text =  'Pistoia';
		if (theCombo2 != null) {
			theCombo2.options[76].value = '69';
			theCombo2.options[76].text =  'Pistoia';
		}
 
		theCombo1.options[77].value = '70';
		theCombo1.options[77].text =  'Pordenone';
		if (theCombo2 != null) {
			theCombo2.options[77].value = '70';
			theCombo2.options[77].text =  'Pordenone';
		}
 
		theCombo1.options[78].value = '71';
		theCombo1.options[78].text =  'Potenza';
		if (theCombo2 != null) {
			theCombo2.options[78].value = '71';
			theCombo2.options[78].text =  'Potenza';
		}
 
		theCombo1.options[79].value = '72';
		theCombo1.options[79].text =  'Prato';
		if (theCombo2 != null) {
			theCombo2.options[79].value = '72';
			theCombo2.options[79].text =  'Prato';
		}
 
		theCombo1.options[80].value = '73';
		theCombo1.options[80].text =  'Ragusa';
		if (theCombo2 != null) {
			theCombo2.options[80].value = '73';
			theCombo2.options[80].text =  'Ragusa';
		}
 
		theCombo1.options[81].value = '74';
		theCombo1.options[81].text =  'Ravenna';
		if (theCombo2 != null) {
			theCombo2.options[81].value = '74';
			theCombo2.options[81].text =  'Ravenna';
		}
 
		theCombo1.options[82].value = '75';
		theCombo1.options[82].text =  'Reggio di Calabria';
		if (theCombo2 != null) {
			theCombo2.options[82].value = '75';
			theCombo2.options[82].text =  'Reggio di Calabria';
		}
 
		theCombo1.options[83].value = '76';
		theCombo1.options[83].text =  'Reggio nell´Emilia';
		if (theCombo2 != null) {
			theCombo2.options[83].value = '76';
			theCombo2.options[83].text =  'Reggio nell´Emilia';
		}
 
		theCombo1.options[84].value = '77';
		theCombo1.options[84].text =  'Rieti';
		if (theCombo2 != null) {
			theCombo2.options[84].value = '77';
			theCombo2.options[84].text =  'Rieti';
		}
 
		theCombo1.options[85].value = '78';
		theCombo1.options[85].text =  'Rimini';
		if (theCombo2 != null) {
			theCombo2.options[85].value = '78';
			theCombo2.options[85].text =  'Rimini';
		}
 
		theCombo1.options[86].value = '79';
		theCombo1.options[86].text =  'Roma';
		if (theCombo2 != null) {
			theCombo2.options[86].value = '79';
			theCombo2.options[86].text =  'Roma';
		}
 
		theCombo1.options[87].value = '80';
		theCombo1.options[87].text =  'Rovigo';
		if (theCombo2 != null) {
			theCombo2.options[87].value = '80';
			theCombo2.options[87].text =  'Rovigo';
		}
 
		theCombo1.options[88].value = '81';
		theCombo1.options[88].text =  'Salerno';
		if (theCombo2 != null) {
			theCombo2.options[88].value = '81';
			theCombo2.options[88].text =  'Salerno';
		}
 
		theCombo1.options[89].value = '82';
		theCombo1.options[89].text =  'Sassari';
		if (theCombo2 != null) {
			theCombo2.options[89].value = '82';
			theCombo2.options[89].text =  'Sassari';
		}
 
		theCombo1.options[90].value = '83';
		theCombo1.options[90].text =  'Savona';
		if (theCombo2 != null) {
			theCombo2.options[90].value = '83';
			theCombo2.options[90].text =  'Savona';
		}
 
		theCombo1.options[91].value = '84';
		theCombo1.options[91].text =  'Siena';
		if (theCombo2 != null) {
			theCombo2.options[91].value = '84';
			theCombo2.options[91].text =  'Siena';
		}
 
		theCombo1.options[92].value = '85';
		theCombo1.options[92].text =  'Siracusa';
		if (theCombo2 != null) {
			theCombo2.options[92].value = '85';
			theCombo2.options[92].text =  'Siracusa';
		}
 
		theCombo1.options[93].value = '86';
		theCombo1.options[93].text =  'Sondrio';
		if (theCombo2 != null) {
			theCombo2.options[93].value = '86';
			theCombo2.options[93].text =  'Sondrio';
		}
 
		theCombo1.options[94].value = '87';
		theCombo1.options[94].text =  'Taranto';
		if (theCombo2 != null) {
			theCombo2.options[94].value = '87';
			theCombo2.options[94].text =  'Taranto';
		}
 
		theCombo1.options[95].value = '88';
		theCombo1.options[95].text =  'Teramo';
		if (theCombo2 != null) {
			theCombo2.options[95].value = '88';
			theCombo2.options[95].text =  'Teramo';
		}
 
		theCombo1.options[96].value = '89';
		theCombo1.options[96].text =  'Terni';
		if (theCombo2 != null) {
			theCombo2.options[96].value = '89';
			theCombo2.options[96].text =  'Terni';
		}
 
		theCombo1.options[97].value = '90';
		theCombo1.options[97].text =  'Torino';
		if (theCombo2 != null) {
			theCombo2.options[97].value = '90';
			theCombo2.options[97].text =  'Torino';
		}
 
		theCombo1.options[98].value = '91';
		theCombo1.options[98].text =  'Trapani';
		if (theCombo2 != null) {
			theCombo2.options[98].value = '91';
			theCombo2.options[98].text =  'Trapani';
		}
 
		theCombo1.options[99].value = '92';
		theCombo1.options[99].text =  'Trento';
		if (theCombo2 != null) {
			theCombo2.options[99].value = '92';
			theCombo2.options[99].text =  'Trento';
		}
 
		theCombo1.options[100].value = '93';
		theCombo1.options[100].text =  'Treviso';
		if (theCombo2 != null) {
			theCombo2.options[100].value = '93';
			theCombo2.options[100].text =  'Treviso';
		}
 
		theCombo1.options[101].value = '94';
		theCombo1.options[101].text =  'Trieste';
		if (theCombo2 != null) {
			theCombo2.options[101].value = '94';
			theCombo2.options[101].text =  'Trieste';
		}
 
		theCombo1.options[102].value = '95';
		theCombo1.options[102].text =  'Udine';
		if (theCombo2 != null) {
			theCombo2.options[102].value = '95';
			theCombo2.options[102].text =  'Udine';
		}
 
		theCombo1.options[103].value = '96';
		theCombo1.options[103].text =  'Varese';
		if (theCombo2 != null) {
			theCombo2.options[103].value = '96';
			theCombo2.options[103].text =  'Varese';
		}
 
		theCombo1.options[104].value = '97';
		theCombo1.options[104].text =  'Venezia';
		if (theCombo2 != null) {
			theCombo2.options[104].value = '97';
			theCombo2.options[104].text =  'Venezia';
		}
 
		theCombo1.options[105].value = '98';
		theCombo1.options[105].text =  'Verbano Cusio Ossola';
		if (theCombo2 != null) {
			theCombo2.options[105].value = '98';
			theCombo2.options[105].text =  'Verbano Cusio Ossola';
		}
 
		theCombo1.options[106].value = '99';
		theCombo1.options[106].text =  'Vercelli';
		if (theCombo2 != null) {
			theCombo2.options[106].value = '99';
			theCombo2.options[106].text =  'Vercelli';
		}
 
		theCombo1.options[107].value = '100';
		theCombo1.options[107].text =  'Verona';
		if (theCombo2 != null) {
			theCombo2.options[107].value = '100';
			theCombo2.options[107].text =  'Verona';
		}
 
		theCombo1.options[108].value = '101';
		theCombo1.options[108].text =  'Vibo Valentia';
		if (theCombo2 != null) {
			theCombo2.options[108].value = '101';
			theCombo2.options[108].text =  'Vibo Valentia';
		}
 
		theCombo1.options[109].value = '102';
		theCombo1.options[109].text =  'Vicenza';
		if (theCombo2 != null) {
			theCombo2.options[109].value = '102';
			theCombo2.options[109].text =  'Vicenza';
		}
 
		theCombo1.options[110].value = '103';
		theCombo1.options[110].text =  'Viterbo';
		if (theCombo2 != null) {
			theCombo2.options[110].value = '103';
			theCombo2.options[110].text =  'Viterbo';
		}
 
}
