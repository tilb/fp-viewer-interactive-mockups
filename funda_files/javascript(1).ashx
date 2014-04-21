/// <reference path="https://ajax.googleapis.com/ajax/libs/swfobject/2.1/swfobject.js" />
/// <reference path="https://floorplanner.com/javascripts/floorplanner/floorplanner.js" /> 
/// <reference path="global.js" />
/// <reference path="jquery-vsdoc.js"/>

var FloorplannerManager =
{
    fp: Floorplanner.prototype,
    Floors: Array.prototype,
    FirstFloorId: 0,
    modus: "",
    ActiveFloor: 0,
    IsDemo: false,
    TargetProject: 0,
    GlobalId: 0,
    Typ: "",
    HttpHandler: "",
    Project_id: 0,
    LoadDesignAfterLoading: 0,
    LoadFloorAfterLoading: 0,
    IsFrontend: false,
    InternalId: "",
    ObjectType: "",
    AboutToNavigateAway: false,
    MenuOffset: 0,
    MyWmode: "transparent",

    _FpServiceBaseUrl: "http://www.floorplanner.com/",
    _FpContentBaseUrl: function() {
        return document.location.protocol === 'https:' ? '/floorplannercdn' : 'http://cdn.floorplanner.com';
    },

    InitializeXml: function (project_id, floors, modus, httpHandler, isDemo, globalId, typ, webservice_root) {
        if (modus == "view" || modus == "my" || (isDemo)) {
            this.IsFrontend = true;
        }

        if (isDemo) modus = "edit";

        if (!webservice_root) webservice_root = this._FpServiceBaseUrl;

        this.GlobalId = globalId;
        this.Typ = typ;
        this.HttpHandler = httpHandler;

        this.IsDemo = isDemo;

        this.Floors = floors;
        this.modus = modus;

        var state = this.GetState(modus);

        this.DispatchMenuRenderer();

        var hidelogo = 0; if (modus == "embed") hidelogo = 1;

        this.fp = new Floorplanner({
            project_id: project_id,
            first_color: "#666666",
            content_server: this._FpContentBaseUrl(),
            full_project: 1,
            project_url: httpHandler + "?id=" + globalId + "|" + typ,
            form_configuration_url: "/js/floorplanner/" + state.file,
            object_library_url: "/js/floorplanner/objects.xml",
            texture_library_url: "/js/floorplanner/textures.xml",
            line_library_url: "/js/floorplanner/lines.xml",
            disable_new_design: 1,
            print_logo: "/js/floorplanner/print_logo.png",
            state: state.name,
            loader_logo: "/img/floorplanner_loader.png",
            measurement_system: "metric",
            hide_scale_bar_toggle:1,
            "demo_project": isDemo ? 1 : 0,
            act: 5,
            "hide_logo": hidelogo,
            webservice_root: "http://www.floorplanner.com/",
            wmode: this.MyWmode
        });


        this.fp.observe("LOADED", function () {
            FloorplannerManager.FloorChanged();
        });

        this.fp.observe("SHOW_MEDIA", function(p) {
            setTimeout("FloorplannerManager.RedirectTofloorDetail('" + p.id + "');", 0);
            return false;
        });

        $(document).ready(function () {
            FloorplannerManager.fp.embed("floorplanner_object_holder");
        });

    },

    DispatchMenuRenderer: function () {
        $(document).ready(function () {
            for (var id in FloorplannerManager.Floors) {
                if (FloorplannerManager.FirstFloorId == 0) FloorplannerManager.FirstFloorId = id;
                FloorplannerManager.RenderFloorButton(FloorplannerManager.Floors[id]);
            }

            FloorplannerManager.CheckModus();

            FloorplannerManager.ChangeFloor(FloorplannerManager.FirstFloorId, true);
        });
    },

    InitializeApi: function (project_id, floors, modus, token, httpHandler, floor, design, webservice_root) {
        this.Floors = floors;
        this.modus = modus;
        this.HttpHandler = httpHandler;
        this.Project_id = project_id;
        this.LoadDesignAfterLoading = design;
        this.LoadFloorAfterLoading = floor;

        if (!webservice_root) webservice_root = this._FpServiceBaseUrl;

        var state = this.GetState(modus);

        this.DispatchMenuRenderer();
        
        // IE 8 doesn't load the floorplan well over https for some reason. - VAL-9648 
        if (document.all && document.querySelector && !document.addEventListener) {
            webservice_root = webservice_root.replace("https", "http");
        }

        this.fp = new Floorplanner({
            "project_id": project_id,
            content_server: this._FpContentBaseUrl(),
            "state": state.name,
            "token": token,
            "loader_logo": "/img/floorplanner_loader.png",
            "print_logo": "/js/floorplanner/print_logo.png",
            "measurement_system": "metric",
            "object_library_url": "/js/floorplanner/objects.xml",
            "texture_library_url": "/js/floorplanner/textures.xml",
            "line_library_url": "/js/floorplanner/lines.xml",
            "form_configuration_url": "/js/floorplanner/" + state.file,
            "act": 5,
            "demo_project": (modus == "embed") ? 1 : 0,
            "design_id": design,
            "webservice_root": webservice_root,
            "hide_scale_bar_toggle":1,
            wmode: this.MyWmode
        });

        this.fp.observe("LOADED", function () {
            FloorplannerManager.FloorChanged();

            /*if (FloorplannerManager.LoadFloorAfterLoading != 0) {
            FloorplannerManager.ChangeFloor(FloorplannerManager.LoadFloorAfterLoading);
            FloorplannerManager.LoadFloorAfterLoading = 0;
            }
            else {
            if (FloorplannerManager.LoadDesignAfterLoading != 0) {
            FloorplannerManager.fp.loadDesign(FloorplannerManager.LoadDesignAfterLoading);
            FloorplannerManager.LoadDesignAfterLoading = 0;
            }
            }*/
        });

        this.fp.observe("FINISHED", function () {
            //FloorplannerManager.fp.loadDesign(FloorplannerManager.LoadDesignAfterLoading);
        });

        this.fp.observe("CHANGED_PROJECT", function () { FloorplannerManager.ProjectChanged(); });

        $(document).ready(function () {
            FloorplannerManager.fp.embed("floorplanner_object_holder");
            FloorplannerManager.MoveSaveCancelButtons();
        });

        window.onbeforeunload = function (ev) {
            if (FloorplannerManager.fp.isModified()) {
                if (ev) ev.returnValue = FTranslate.Get("fp_unsavedchanges"); // For Firefox & IE
                return FTranslate.Get("fp_unsavedchanges"); // For Safari
            }
        };
    },


    InitializeCameraApi: function (project_id, floors, token, httpHandler, floor, design, webservice_root) {
        this.Floors = floors;
        this.modus = "camera";
        this.HttpHandler = httpHandler;
        this.Project_id = project_id;
        this.LoadDesignAfterLoading = design;
        this.LoadFloorAfterLoading = floor;

        if (!webservice_root) webservice_root = this._FpServiceBaseUrl;

        this.DispatchMenuRenderer();

        this.fp = new Floorplanner({
            "project_id": project_id,
            content_server: this._FpContentBaseUrl(),
            "state": "funda_media",
            "token": token,
            "loader_logo": "/img/floorplanner_loader.png",
            "print_logo": "/js/floorplanner/print_logo.png",
            "measurement_system": "metric",
            "object_library_url": null,
            "texture_library_url": null,
            "line_library_url": null,
            "form_configuration_url": "/js/floorplanner/forms-camera.xml",
            "act": 5,
            "demo_project": 0,
            "design_id": design,
            "webservice_root": webservice_root,
            "hide_info_bar": 1,
            "hide_scale_bar": 1,
            "hide_scale_bar_toggle":1,
            wmode: this.MyWmode
        });

        this.fp.observe("LOADED", function () {
            //FloorplannerManager.FloorChanged();
            FloorplannerManager.fp.get2dMovie().disableViewOption("GRID");
        });

        this.fp.observe("CHANGED_PROJECT", function () { FloorplannerManager.ProjectChanged(); });

        $(document).ready(function () {
            FloorplannerManager.fp.embed("floorplanner_object_holder");

            FloorplannerManager.MoveSaveCancelButtons();
        });

        window.onbeforeunload = function (ev) {
            if (FloorplannerManager.fp.isModified()) {
                if (ev) ev.returnValue = FTranslate.Get("fp_unsavedchanges"); // For Firefox & IE
                return FTranslate.Get("fp_unsavedchanges"); // For Safari
            }
        };
    },

    InitializeApiMy: function (project_id, floors, modus, token, httpHandler, floor, design, internalId, objectType, webservice_root) {
        this.Floors = floors;
        this.modus = modus;
        this.HttpHandler = httpHandler;
        this.Project_id = project_id;
        this.LoadDesignAfterLoading = design;
        this.LoadFloorAfterLoading = floor;
        this.InternalId = internalId;
        this.ObjectType = objectType;
        this.IsFrontend = true;
        this.MenuOffset = 75;

        if (!webservice_root) webservice_root = this._FpServiceBaseUrl;

        var state = this.GetState(modus);

        this.DispatchMenuRenderer();

        this.fp = new Floorplanner({
            "project_id": project_id,
            content_server: this._FpContentBaseUrl(),
            "state": state.name,
            "token": token,
            "loader_logo": "/img/floorplanner_loader.png",
            "print_logo": "/js/floorplanner/print_logo.png",
            "measurement_system": "metric",
            "object_library_url": "/js/floorplanner/objects.xml",
            "texture_library_url": "/js/floorplanner/textures.xml",
            "line_library_url": "/js/floorplanner/lines.xml",
            "form_configuration_url": "/js/floorplanner/" + state.file,
            "act": 5,
            "demo_project": (modus == "embed") ? 1 : 0,
            "design_id": design,
            "webservice_root": webservice_root,
            "hide_scale_bar_toggle":1,
            wmode: this.MyWmode
        });

        this.fp.observe("LOADED", function () {
            FloorplannerManager.FloorChanged();

            /*if (FloorplannerManager.LoadFloorAfterLoading != 0) {
            FloorplannerManager.ChangeFloor(FloorplannerManager.LoadFloorAfterLoading);
            FloorplannerManager.LoadFloorAfterLoading = 0;
            }
            else {
            if (FloorplannerManager.LoadDesignAfterLoading != 0) {
            FloorplannerManager.fp.loadDesign(FloorplannerManager.LoadDesignAfterLoading);
            FloorplannerManager.LoadDesignAfterLoading = 0;
            }
            }*/
        });

        this.fp.observe("FINISHED", function () {
            //FloorplannerManager.fp.loadDesign(FloorplannerManager.LoadDesignAfterLoading);
        });

        this.fp.observe("CHANGED_PROJECT", function () { FloorplannerManager.ProjectChanged(); });

        $(document).ready(function () {
            FloorplannerManager.fp.embed("floorplanner_object_holder");

            FloorplannerManager.MoveSaveCancelButtons();
        });

        this.fp.observe("SAVED", function () {
            DoAjaxRequest(FloorplannerManager.HttpHandler + "?action=save&id=" + FloorplannerManager.Project_id
                            + "&targetproject=" + FloorplannerManager.TargetProject
                            + "&internalid=" + encodeURIComponent(FloorplannerManager.InternalId)
                            + "&objecttype=" + FloorplannerManager.ObjectType,
                            function (responseText) { });
        });

        window.onbeforeunload = function (ev) {
            if (FloorplannerManager.fp.isModified()) {
                if (ev) ev.returnValue = FTranslate.Get("fp_unsavedchanges"); // For Firefox & IE
                return FTranslate.Get("fp_unsavedchanges"); // For Safari
            }
        };

        $(document.getElementById('controlsave')).click(function () { FloorplannerManager.SaveMy(this); });
    },

    IntializeThumbnail: function (imageElement, project_id, design_id, token, webservice_root) {
        var targetElement = getParentElement(imageElement, 'div');
        var targetDiv = document.createElement('div');
        targetDiv.id = "imgElem" + design_id;
        targetDiv.style.width = '200px';
        targetDiv.style.height = '150px';
        targetElement.appendChild(targetDiv);
        var holder = targetDiv.id;

        if (!webservice_root) webservice_root = this._FpServiceBaseUrl;

        imageElement.style.display = "none";

        var thumbFp = new Floorplanner({
            content_server: this._FpContentBaseUrl(),
            "state": "thumb",
            "loader_logo": "/img/floorplanner_loader.png",
            "print_logo": "/js/floorplanner/print_logo.png",
            "measurement_system": "metric",
            "object_library_url": "/js/floorplanner/objects.xml",
            "texture_library_url": "/js/floorplanner/textures.xml",
            "form_configuration_url": "/js/floorplanner/forms-thumb.xml",
            "line_library_url": "/js/floorplanner/lines.xml",
            "token": token,
            "design_id": design_id,
            "project_id": project_id,
            "hide_logo": 1,
            "show_custom_dimensions": false,
            webservice_root: webservice_root,
            "hide_scale_bar_toggle":1,
            wmode: this.MyWmode
        });

        thumbFp.embed(holder);
    },

    GetState: function (modus) {
        var state;
        var stateFile;
        if (modus == "view" || modus == "embed" || modus == "my") { state = "funda_show"; stateFile = "forms-show.xml"; }
        else if (modus == "edit") { state = "funda_edit"; stateFile = "forms-edit.xml"; }
        else if (modus == "embed") { state = "funda_embed"; stateFile = "forms-published.xml"; }

        return { "name": state, "file": stateFile };
    },

    RenderFloorButton: function (floor) {
        var targetUl = document.getElementById('floorplanner_floor_list');
        var li = document.createElement("li");
        li.id = "li" + floor.id;

        var a = document.createElement("a");
        a.href = 'javascript:;';
        a.id = "changefloor_" + floor.id;

        var span = document.createElement('span');
        span.innerHTML = floor.name;

        a.appendChild(span);
        li.appendChild(a);

        targetUl.appendChild(li);

        var li_left = findPositionAsArray(li)[0];
        var ul_left = findPositionAsArray(targetUl)[0];
        var xpos = li_left - ul_left;

        //and add the event
        addEvent(a, 'click', function () { FloorplannerManager.ChangeFloor(floor.id); });
        addEvent(a, 'mousemove', function () { FloorplannerManager.ShowDesign(floor.id, xpos); });
    },

    DrawAddFloorButton: function () {
        var targetUl = document.getElementById('floorplanner_floor_list');
        var li = document.createElement("li");

        var a = document.createElement("a");
        a.href = 'javascript:;';
        a.className = "app-control-add-floor";
        a.id = "addfloor";

        var img = document.createElement("img");
        img.src = "/img/but/but-toevoegen.gif";

        a.appendChild(img);
        li.appendChild(a);

        targetUl.appendChild(li);

        addEvent(a, 'click', function () { FloorplannerManager.AddFloor(); });
    },

    CheckModus: function () {
        var modus = this.modus;
        if (modus == "edit" && !this.IsDemo) {
            this.DrawAddFloorButton();

            var controlUl = document.getElementById('floorplanner_action_list');

            var saveButtonLi = document.createElement('li');
            var saveButtonA = document.createElement('a');
            //saveButtonA.href = '#'; 
            saveButtonA.href = 'javascript:;'; saveButtonA.id = 'controlsave';
            var saveButtonImg = document.createElement('img');
            saveButtonImg.alt = saveButtonA.title = "Opslaan";
            saveButtonImg.src = '/img/icn/icn-floorplanner-save.gif';
            saveButtonA.appendChild(saveButtonImg);
            saveButtonLi.appendChild(saveButtonA);
            controlUl.appendChild(saveButtonLi);

            var settingsButtonLi = document.createElement('li');
            var settingsButtonA = document.createElement('a');
            settingsButtonA.href = 'javascript:;'; settingsButtonA.id = 'controlsettings';
            var settingsButtonImg = document.createElement('img');
            settingsButtonImg.alt = settingsButtonA.title = "Instellingen";
            settingsButtonImg.src = '/img/icn/icn-floorplanner-settings.gif';
            settingsButtonA.appendChild(settingsButtonImg);
            settingsButtonLi.appendChild(settingsButtonA);
            controlUl.appendChild(settingsButtonLi);


            addEvent(settingsButtonA, 'click', function () { FloorplannerManager.fp.showForm('PROJECT_SETTINGS'); return false; });
            addEvent(saveButtonA, 'click', function () {
                $.ajax({
                    url: fundaUtil.Ajax.getVirtualDir() + "/clientactie/IsAnonymous",
                    cache: false,
                    success: function (data) {
                        if (data.toString().toLocaleLowerCase() == "true") {
                            Popup.load.call(document.getElementById('aspnetForm'), function () { FloorplannerManager.Save(this); return false; }, "{'actie-verwijzing-login':''}", 'popup-content-login');
                        } else {
                            FloorplannerManager.Save(this); return false;
                        }
                    }
                });
            });
        }
    },

    ChangeFloor: function (floor_id, justChangeCSS) {
        this.fp.ensure2d();

        if (this.ActiveFloor != 0) {
            //kan verwijderd zijn inmiddels
            if (document.getElementById("changefloor_" + this.ActiveFloor)) {
                document.getElementById("changefloor_" + this.ActiveFloor).className = '';
            }
        }

        document.getElementById("changefloor_" + floor_id).className = 'selected';

        this.ActiveFloor = floor_id;

        if (!justChangeCSS /*&& Floorplanner.f2dLoaded*/) {
            this.fp.loadFloor(floor_id);
        }
    },

    Save: function (sender, navigateUrl) {
        /*if (!Floorplanner.f2dLoaded) return;*/

        var saveDelegate = function () {
            // hiding parent is no longer required
            //var holderDiv = getParentElement(sender, 'div', 'wbb');   // display animated message in dialog
            var holderDiv = document.getElementById('savecancelbuttons');   // display animated message next to 'Opslaan' button
            //sender.style.display = 'none';
            var newObject = document.createElement('span');
            newObject.className = 'loading-indicator-inline';
            newObject.innerHTML = 'Uw plattegrond wordt opgeslagen...';
            holderDiv.appendChild(newObject);

            DoAjaxRequest(FloorplannerManager.HttpHandler + "?action=save&id=" + FloorplannerManager.Project_id + "&targetproject=" + FloorplannerManager.TargetProject,
                function (responseText) {
                    window.location.href = navigateUrl;
                });
        };

        if (this.fp.isModified()) {
            this.fp.showForm("SAVE");

            if (navigateUrl) {
                this.fp.observe('SAVED', saveDelegate);
            }
        }
        else {
            if (navigateUrl) {
                saveDelegate();
            }
        }

    },

    SaveWithPopup: function (sender, navigateUrl) {

        var saveDelegate = function () {
            // no message
            DoAjaxRequest(FloorplannerManager.HttpHandler + "?action=save&id=" + FloorplannerManager.Project_id + "&targetproject=" + FloorplannerManager.TargetProject,
                    function (responseText) {
                        if (navigateUrl != '') {
                            window.location.href = navigateUrl;
                        }
                    });
        };

        var publishCallback = function () {
            if (FloorplannerManager.modus != "camera") {
                if (document.getElementById('automatic').checked) {
                    navigateUrl += '&directPublish=1';
                }
                else {
                    navigateUrl += '&directPublish=0';
                }
            }
            saveDelegate();
        };

        var autoPublish = function () {
            Popup.hookForm(document.getElementById('popupAll'), publishCallback);
            Popup.open(document.getElementById('popupAll'));
        };

        if (this.fp.isModified()) {
            this.fp.showForm("SAVE");

            if (navigateUrl) {
                this.fp.observe('SAVED', autoPublish);
            }
        }
        else {
            if (navigateUrl) {
                autoPublish();
            }
        }
    },

    SaveAndOverwriteWithoutFPPopup: function (sender, navigateUrl) {
        var saveDelegate = function () {
            var postUrl = FloorplannerManager.HttpHandler + "?action=save&id=" + FloorplannerManager.Project_id + "&targetproject=" + FloorplannerManager.TargetProject;
            DoAjaxRequest(postUrl, function (responseText) {
                if (navigateUrl != '') {
                    window.location.href = navigateUrl;
                }
            });
        };
        var publishCallback = function () {
            if (FloorplannerManager.modus != "camera") {
                if (document.getElementById('automatic').checked) {
                    navigateUrl += '&directPublish=1';
                }
                else {
                    navigateUrl += '&directPublish=0';
                }
            }
            saveDelegate();
        };

        var autoPublish = function () {
            Popup.hookForm(document.getElementById('popupAll'), publishCallback);
            Popup.open(document.getElementById('popupAll'));
        };
        // save design when modified
        if (this.fp.isModified()) {
            // get name of current design
            var cdn = this.fp.getProject().active_design_name;
            if (typeof (cdn) === 'undefined') return;
            // save and overwrite this design
            this.fp.updateDesign(cdn);

            if (navigateUrl) {
                this.fp.observe('SAVED', autoPublish);
            }
        }
        else {
            if (navigateUrl) {
                autoPublish();
            }
        }
        return false;

    },

    SaveMy: function (sender, navigateUrl) {
        // function is now called from the SAVED hook
        // ie. floorplan has already been saved

        FloorplannerManager.AboutToNavigateAway = true;

        var saveDelegate = function () {
            DoAjaxRequest(FloorplannerManager.HttpHandler + "?action=save&id=" + FloorplannerManager.Project_id
                            + "&targetproject=" + FloorplannerManager.TargetProject
                            + "&internalid=" + encodeURIComponent(FloorplannerManager.InternalId)
                            + "&objecttype=" + FloorplannerManager.ObjectType,
                            function (responseText) {
                                window.location.href = navigateUrl;
                            });
        };

        if (navigateUrl) {
            saveDelegate();
        }

        return false;
    },

    SaveSelectedMakelaar: function (nummer) {
        $("#hiddenMakelaarNummer").val(nummer);
    },

    SaveWithCallback: function(callbackObjectName) {
        /*if (!Floorplanner.f2dLoaded) return;*/

        var saveDelegate = function () {
            __doPostBack(callbackObjectName, '');
        };

        if (this.fp.isModified()) {
            this.fp.showForm("SAVE");
            this.fp.observe('SAVED', saveDelegate);
        }
        else {
            //ctl00$CPHKop$FloorplannerArea$ctl07$DoorsturenCallbackButton
            saveDelegate();
        }
    },

    ShowDesign: function (floor_id, x_pos) {
        /*if (!Floorplanner.f2dLoaded) return;*/
        if (this.fp.fCurrentView == "3d") {
            return;
        }

        if (!this.IsFrontend)
            x_pos = findPos(document.getElementById("li" + floor_id)).left;

        x_pos += FloorplannerManager.MenuOffset;

        FloorplannerManager.fp.showForm("SELECT_DESIGN", { floorId: floor_id, xPos: x_pos });
    },

    SaveImage: function () {
        /*if (!Floorplanner.f2dLoaded) return;*/

        this.fp.showForm('EXPORT_IMAGE');
    },

    Print: function () {
        /*if (!Floorplanner.f2dLoaded) return;*/
        this.fp.printDesign();
    },

    AddFloor: function () {
        /*if (!Floorplanner.f2dLoaded) return;*/
        this.fp.showForm('ADD_FLOOR');
    },

    ProjectChanged: function () {
        var floors = this.fp.getProject().floors;
        var activeFloor = 0;

        var targetUl = document.getElementById('floorplanner_floor_list');
        for (var i = 0; i < targetUl.childNodes.length; i++) {
            targetUl.removeChild(targetUl.childNodes[i]);
        }
        targetUl.innerHTML = "";

        for (var i = 0; i < floors.length; i++) {
            if (floors[i].active == 1) { activeFloor = floors[i].id; }
            FloorplannerManager.RenderFloorButton(floors[i]);
        }

        this.DrawAddFloorButton();

        if (activeFloor > 0)
            setTimeout(function () { FloorplannerManager.ChangeFloor(activeFloor, false); }, 1);
    },

    MoveSaveCancelButtons: function () {
        //we zoeken de div met daarin de save en cancel buttons
        var saveCancelButtons = document.getElementById('savecancelbuttons');
        if (!saveCancelButtons) return;
        saveCancelButtons.parentNode.removeChild(saveCancelButtons);
        //en voegen hem op zijn goede plaats weer toe
        $(".app-container:first").append(saveCancelButtons);
    },

    RedirectTofloorDetail: function (id) {
        document.location.href = '../360-fotos/#foto-' + id;
        return false;
    },

    FloorChanged: function () {
        var floors = this.fp.getProject().floors
        for (var i = 0; i < floors.length; i++) {
            if (floors[i].active == 1) {
                FloorplannerManager.ChangeFloor(floors[i].id, true);
                break;
            }
        }
    }
}

;
/// <reference path="jquery-vsdoc.js" />
//fundaUtil.Ajax 2008

fundaUtil = window.fundaUtil || {};

fundaUtil.Ajax = (function () {

    //private vars and functions

    function _updateVerbergKaartLink() {

        var verberg_grotekaartLink = document.getElementById('verberg_grotekaart');
        if (verberg_grotekaartLink)
            verberg_grotekaartLink.href = top.location.href.replace('\/kaart\/#', '');
    }

    return {

        init: function (updatePanelID) {

            var initialHash = fundaUtil.Ajax.getAjaxHash(location.href);

            //check de url op qs parameters (bijv "/koop/kaart/#/amsterdam/?kaart=groot&lat=52.26&lng=6.24&refid=382772")
            var paramIx = initialHash.indexOf('?');
            if (paramIx > 0) {
                var params = initialHash.substr(paramIx + 1).split("&");

                for (var i = 0; i < params.length; i++) {
                    if (params[i].indexOf('lat=') == 0)
                        Map.initLat = params[i].split('=')[1];
                    if (params[i].indexOf('lng=') == 0)
                        Map.initLng = params[i].split('=')[1];
                    if (params[i].indexOf('refid=') == 0) {
                        Map.refid = params[i].split('=')[1];

                        if ($("#GroteKaartGaTerugLink").length == 1) {
                            var clientActieUrl = getVirtualDir() + '/clientactie/GetFriendlyUrl/' + Map.refid;
                            $.ajax({
                                url: clientActieUrl,
                                cache: false,
                                success: function (data) {
                                    if (data.toString() == "#") {
                                        $("#GroteKaartGaTerugLink").hide();
                                    } else {
                                        $("#GroteKaartGaTerugLink").attr('href', getVirtualDir() + data.toString());
                                        $("#GroteKaartGaTerugLink").show();
                                    }
                                }
                            });
                        }
                    }
                    if (params[i].indexOf('clientactie=') == 0)
                        ZOK.clientActie = params[i].split('=')[1];
                    if (params[i].indexOf('id=') == 0)
                        ZOK.clientActieId = params[i].split('=')[1];
                    //hier eventueel nog andere qs parameters afhandelen
                }
            }

            YAHOO.util.History.register(initialHash, fundaUtil.Ajax.pageStateChangeHandler);
            YAHOO.util.History.initialize('yui-history-field', 'yui-history-iframe');

            //geen check of initialHash wel overeenkomt met de getoonde zoekopdracht (te vinden in hidden inputpox initZoekOpdracht), anders als de bewaarde zoekopdracht & hash hetzelfde geen goede iseaq! (bv koop bij fundainbusiness.nl)
            var huidigeZO_hidden = document.getElementById('initZoekOpdracht');
            var initialHashNoQS = initialHash.split('?')[0];
            fundaUtil.Ajax.pageStateChangeHandler(initialHash);
        },

        getAjaxHash: function (href) {

            var i = href.indexOf("#/");
            return i >= 0 ? href.substr(i + 1) : '/';
        },

        onBeginRequest: function (s) {

            //streetview sluiten bij klikken op filter of isqeaq
            if (typeof svp !== 'undefined' && svp && IsStreetViewActive)
                svp.closeStreetView();

            //zet isLoading stylesheet 
            addClass(document.body, 'is-loading');

            var zoekNaarPlaatsKnop = document.getElementById('map_search_submit');
            var zoekNaarPlaatsBox = document.getElementById('TextBoxPlaatsOfPostcode');
            if (zoekNaarPlaatsBox && zoekNaarPlaatsBox.value != 'zoek naar plaats') {
                addClass(zoekNaarPlaatsKnop, 'is-loading');
                zoekNaarPlaatsKnop.src = '/img/misc/loading-ind.gif';
            }
        },

        getVirtualDir: function () {
            var virtualDir = '';
            if (self.location.href.toLowerCase().indexOf('/funda/') > 0) virtualDir = '/funda';
            else if (self.location.href.toLowerCase().indexOf('/fundainbusiness/') > 0) virtualDir = '/fundainbusiness';
            else if (self.location.href.toLowerCase().indexOf('/sozok/') > 0) virtualDir = '/sozok'; //voor next.funda.nl/sozok
            else if (self.location.href.toLowerCase().indexOf('/fundamanager/') > 0) virtualDir = '/fundamanager';
            return virtualDir;
        },

        onEndRequest: function () {

            //zet isLoading weer uit 
            removeClass(document.body, 'is-loading');

            var zoekNaarPlaatsKnop = document.getElementById('map_search_submit');
            removeClass(zoekNaarPlaatsKnop, 'is-loading');
            if (zoekNaarPlaatsKnop != null) {
                zoekNaarPlaatsKnop.src = '/img/but/but-zoeken-icn.gif';
            }

            //kaart eventueel opnieuw positioneren
            ZOK.SetHeightToViewport();
        },

        pageStateChangeHandler: function (state) {
            //strip qs
            var query = "";
            var parts = state.split('?');
            if (parts.length > 1) {
                query = "&" + parts[1];
            }
            state = parts[0];
            //bepaal baseUrl
            var baseUrl = location.href.replace(/http:\/\/[^\/]+(\/fundainbusiness|\/funda|\/sozok)?/i, ''); //stip domain + webapp
            var i = baseUrl.indexOf('/kaart');
            baseUrl = i >= 0 ? baseUrl.substring(0, i) + '/kaart' : baseUrl;
            //json call
            fundaUtil.Ajax.onBeginRequest();
            $.ajax({
                url: fundaUtil.Ajax.getVirtualDir() + "/kaartclientactie/kaartfilterhtml/?friendlyurl=" + baseUrl + state + query,
                dataType: "json",
                complete: function () { fundaUtil.Ajax.onEndRequest(); },
                success: function (data) {
                    if (data.iSEAQHtml) $("#iseaqSelector").html(data.iSEAQHtml);
                    if (data.filterHtml) $("#filter").html(data.filterHtml);
                    if (data.resultButtonUrl) $("li>a.list-icon").attr("href", data.resultButtonUrl);
                    if (data.galleryButtonUrl) $("li>a.grid-icon").attr("href", data.galleryButtonUrl);

                    if (data.resetMapFunction) eval(data.resetMapFunction);
                    if (data.actueelText) {
                        var tabkoop = $('#kaarttabkoop').find('a');
                        if (tabkoop != null) {
                            tabkoop.text(data.actueelText);
                        }
                    }

                    if (data.historieText) {
                        var tabverkocht = $('#kaarttabverkocht').find('a');
                        if (tabverkocht != null) {
                            tabverkocht.text(data.historieText);
                        }
                    }

                    Funda.ResultList.init();
                    Popup.init();
                    
                    Funda.dropDown.init();
                    
                }
            });

            ZOK.RefreshMap(state);
        },

        zoekPlaats: function (plaatsnaam) {

            fundaUtil.Ajax.onBeginRequest();
            $.ajax({
                url: fundaUtil.Ajax.getVirtualDir() + "/kaartclientactie/kaartzoekplaats/?plaats=" + encodeURIComponent(plaatsnaam) + "&friendlyurl=" + encodeURIComponent(self.location.href),
                dataType: "json",
                complete: function () { fundaUtil.Ajax.onEndRequest(); },
                success: function (data) {
                    if (data.iSEAQHtml) $("#iseaqSelector").html(data.iSEAQHtml);
                    if (data.filterHtml) $("#filter").html(data.filterHtml);
                    if (data.resetMapFunction) eval(data.resetMapFunction);
                    if (data.resultButtonUrl) $("li>a.list-icon").attr("href", data.resultButtonUrl);
                    if (data.galleryButtonUrl) $("li>a.grid-icon").attr("href", data.galleryButtonUrl);
                }
            });
        },

        // Deze functie wordt uitgevoerd bij het aanpassen van het prijs-filter
        klikPrijsFilter: function (prijsUrlTemplate) {

            prijsUrlTemplate = fundaUtil.Ajax.getAjaxHash(prijsUrlTemplate);

            var prijsVan = document.getElementById('PrijsVan').value;
            var prijsTot = document.getElementById('PrijsTot').value;

            var checkbox = document.getElementById('ZonderExtraKosten');
            if (checkbox != null) {
                // www.funda.nl/huur/kaart/#

                var urlSegment = 'zonder-extra-kosten';
                var pattern = new RegExp('/' + urlSegment + '/');

                if (checkbox.checked == true && pattern.test(prijsUrlTemplate) == false) {
                    // Add criterium
                    prijsUrlTemplate = prijsUrlTemplate + urlSegment + '/';
                }

                if (checkbox.checked == false && pattern.test(prijsUrlTemplate) == true) {
                    // Remove criterium
                    prijsUrlTemplate = prijsUrlTemplate.replace(pattern, '/');
                }
            }

            if (prijsVan != '0' && (prijsTot == '' || prijsTot == 'NoMax'))
                prijsUrlTemplate = prijsUrlTemplate.replace(/\/prijsrange/, '/' + prijsVan + '+');
            else if (prijsTot != '' && prijsTot != 'NoMax')
                prijsUrlTemplate = prijsUrlTemplate.replace(/\/prijsrange/, '/' + prijsVan + '-' + prijsTot);
            else
                prijsUrlTemplate = prijsUrlTemplate.replace(/\/prijsrange/, '');

            YAHOO.util.History.navigate(prijsUrlTemplate);
        },

        // Deze functie wordt uitgevoerd bij het aanpassen van het FiB oppervlakte-filter
        klikOppervlakteFilter: function (oppUrlTemplate) {

            oppUrlTemplate = fundaUtil.Ajax.getAjaxHash(oppUrlTemplate);

            var oppVan = document.getElementById('FormModel_SurfaceFrom').value;
            var oppTot = document.getElementById('FormModel_SurfaceTo').value;

            if (oppVan != '0' && oppTot == '')
                oppUrlTemplate = oppUrlTemplate.replace(/\/opprange/, '/' + oppVan + '+opp');
            else if (oppTot != '')
                oppUrlTemplate = oppUrlTemplate.replace(/\/opprange/, '/' + oppVan + '-' + oppTot + '-opp');
            else
                oppUrlTemplate = oppUrlTemplate.replace(/\/opprange/, '');

            YAHOO.util.History.navigate(oppUrlTemplate);
        },

        selectHuurConditie: function (huurconditieUrlTemplate) {

            huurconditieUrlTemplate = fundaUtil.Ajax.getAjaxHash(huurconditieUrlTemplate);

            //huurconditieUrlTemplate bevat "prijsperjaar" op de plek van de huurconditie
            var huurConditie = document.getElementById('HuurConditie').value;

            if (huurConditie == '1')
                huurconditieUrlTemplate = huurconditieUrlTemplate.replace(/\/perjaar/, '/permaand');
            else if (huurConditie == '2')
                huurconditieUrlTemplate = huurconditieUrlTemplate.replace(/\/perjaar/, '/perm2perjaar');

            YAHOO.util.History.navigate(huurconditieUrlTemplate);
        }
    };
})();

