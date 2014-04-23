

 function fnOpenConsMutui(){
    oConsulenzaMutuiBox = new boxOverlay('consulenza_mutui','grey');
    oConsulenzaMutuiBox.setTitle("<strong>Consulenza mutui</strong>");
    var oAjax = new getMEAjaxObj();
    var sPars = "a=get";
    var sUrl = "/consulenzaMutui.php?"+sPars;
    oAjax.Request('POST',sUrl,function(response){fnOpenConsMutuiH(response,oConsulenzaMutuiBox);}); 
} 

function fnOpenConsMutuiH(data,oConsulenzaMutuiBox){
    if(data.responseText == "-1"){
        return;    
    }
    oConsulenzaMutuiBox.setContent(data.responseText);
    createAnimatedButton("bottoneInvia","bottoneInvia_consulenza",fnSendConsMutui);
    oConsulenzaMutuiBox.show();
}

function fnSetHiddenInput(){
    document.inviaConsulenza.fkComune.value = fkComune;
    document.inviaConsulenza.valoreImmobile.value = sValoreImmobile;
    document.inviaConsulenza.fasciaValoreImmobile.value = sFasciaValoreImmobile;
    document.inviaConsulenza.a.value = "send";
}


function fnSendConsMutui(){
    fnSetHiddenInput();
    submitAjaxForm(document.inviaConsulenza,fnSendConsMutuiH);    
    oConsulenzaMutuiBox.setContent("<div id=\"loading\" style=\"padding:40px;\">Salvataggio dati in corso...&nbsp;&nbsp;<img src=\"/img2/LoadingSmall.gif\" /></div>");
    oConsulenzaMutuiBox.show();
}

function fnSendConsMutuiH(data){
    if(data.responseText == "-1"){
        return;    
    }
    oConsulenzaMutuiBox.setContent(data.responseText);
    oConsulenzaMutuiBox.show();
    if(document.getElementById("bottoneInvia_consulenza"))
        createAnimatedButton("bottoneInvia","bottoneInvia_consulenza",fnSendConsMutui);
    if(document.getElementById("bottoneChiudi_consulenza"))
        createAnimatedButton("bottoneChiudi","bottoneChiudi_consulenza",fnCloseConsMutui);
}

function fnCloseConsMutui(){
    oConsulenzaMutuiBox.hide();
}
