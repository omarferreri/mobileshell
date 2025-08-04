var HShell = window.HShell || {};

/**
 * Many of the features of the core are loaded from the other JavaScript files that are inside the core folder
 * @category HShell.Core
 * @module Core
 */
(function () {
    var GARBAGE_COLLECTION_INTERVAL = 400,
        allActiveComponents = {},
        _component;

    HShell.core = HShell.core || {};
    HShell.core._component = HShell.core._component || function(){};
    _component = HShell.core._component;

    HShell.core._COMPONENT_CLASS_NAME = 'HShellComponent';

    /**
     * Register component so that it can be used later
     * @method
     * @category HShell.Core
     * @namespace HShell.core
     * @param {function} component - The constructor function for the component
     * @param {string} name - The tame of the component. This will be used in order to generate new component of this type
     * */
    function registerComponent(component, name){
        HShell._components = HShell._components || {};

        if(HShell._components[name]){
            throw 'Component with the name "' + name + '" is already registered.';
        } else {
            HShell._components[name] = component;
            addComponentPrototypeToComponent(component);
        }
    }
    HShell.core.registerComponent = registerComponent;

    HShell.core.getComponent = function (componentName, params) {
        var component;
        var componentId = getRandomId();

        if(typeof componentName === 'string'){
            if(HShell._components[componentName]) {
                component = new HShell._components[componentName]({ HShell: HShell, params: params });
                component._name = componentName;
                allActiveComponents[componentId] = component;
                component._id = componentId;
            } else {
                throw 'There is no component registered with the name: ' + componentName + ' !';
            }
        } else {
            throw 'HShell.addComponent expects the name of the component to be string!';
        }

        return component;
    };

    HShell.core.renderComponents = function (wrapper, parent) {
        $(wrapper).find('.' + HShell.core._COMPONENT_CLASS_NAME).each(function(index, item){
            var id = item.id;
            var component = allActiveComponents[id];

            if(!item.dataset.componentrendered) {
                addParentChildrenRelationship(component, parent);

                item.setAttribute('data-componentrendered', true);
                component._wrapper = item;
                item.innerHTML = component.render.apply(component, component._initParams);
                HShell.core.renderComponents(component._wrapper, component);
                $(component._wrapper).find('[data-onload]').each(function (i, item) {
                    var onloadFunction = component[item.dataset.onload];

                    if(onloadFunction){
                        item.onload = component[item.dataset.onload].bind(component);
                    }else{
                        console.error('There is no function with the name: ' + item.dataset.onload);
                    }
                });
                component.onComponentRender && component.onComponentRender();
            }
        });
    };

    HShell.core.getAllActiveComponents = function(){
        return allActiveComponents;
    };

    HShell.core.getAllActiveComponentsTree = function(){
        var tree = [];

        for(var i in allActiveComponents){
            if(allActiveComponents[i]._parent === undefined){
                tree.push(allActiveComponents[i]);
            }
        }

        return tree;
    };

    function addComponentPrototypeToComponent(component){
        var oldPrototype = component.prototype;

        component.prototype = Object.create(HShell.core._component.prototype);

        for(var key in oldPrototype){
            component.prototype[key] = oldPrototype[key];
        }
        component.constructor = component;
    }

    function addParentChildrenRelationship(component, parent){
        if(parent){
            component._parent = parent;
        }else{
            if(component !== HShell.core._rootComponent){
                component._parent = HShell.core._rootComponent;
            }else{
                // --- Root component
                component._parent = undefined;
            }
        }

        if(component._parent){
            component._parent._children = component._parent._children ? component._parent._children : [];
            component._parent._children.push(component);
        }
    }

    _component.prototype.init = function() {
        this._initParams = arguments;
        return '<div id="' + this._id + '" class="' + HShell.core._COMPONENT_CLASS_NAME + ' ' + ('Component_' + this._name) + '" data-id="' + this._id + '"></div>';
    };

    _component.prototype.destroy = function() {
        var id = this._id;
        var component = allActiveComponents[id];

        // --- Remove the reference inside parent element
        if(component && component._parent){
            var idInParent,
                parentsChildern = component._parent._children;

            parentsChildern.forEach(
                function(item, id){
                    if(item._id === component._id){
                        idInParent = id;
                    }
                }
            );

            parentsChildern.splice(idInParent, 1);
        }

        this.onDestroy && this.onDestroy();
        delete allActiveComponents[id];
        this._wrapper.remove();
    };

    _component.prototype.getParent = function(){
        return HShell.core._getWrappingComponent(this._wrapper);
    };

    function garbageCollectComponents() {
        setInterval(function(){
            for(var id in allActiveComponents) {
                if(!document.getElementById(id)){
                    allActiveComponents[id].destroy();
                }
            }
        }, GARBAGE_COLLECTION_INTERVAL);
    }

    garbageCollectComponents();

    // --- Utils ---

    function getRandomId() {
        var id = '';

        do{
            id = HShell.core._COMPONENT_CLASS_NAME + '_' + Math.round(Math.random() * 5000000);
        }while(allActiveComponents[id]);

        return id;
    }
})();

var HShell = window.HShell || {};
HShell.core = HShell.core || {};

(function () {
    var ignoreEvnets = false,
        EVENT_DELAY_TIME = 150;

    document.addEventListener('click', sendClickEventToComponent);
    document.addEventListener('keypress', disableSpaceBar);
    document.addEventListener('keyup', function(e){
        if(e.keyCode === 13 || e.keyCode === 32){   // Enter || Space
            sendClickEventToComponent(e);
        }

        sendKeyupEventToComponent(e);
    });

    HShell.core.ignoreNextEvent = function(){
        ignoreEvnets = true;

        setTimeout(function(){
            ignoreEvnets = false;
        },EVENT_DELAY_TIME);
    };

    function sendClickEventToComponent(e){
        var eventBoundTo = getClickEventBoundTo(e.target),
            parentComponent = eventBoundTo ? HShell.core._getWrappingComponent(eventBoundTo) : null,
            allActiveComponents = HShell.core.getAllActiveComponents();

        if(eventBoundTo && parentComponent && !ignoreEvnets){
            var id = parentComponent.dataset.id,
                onClick = eventBoundTo.dataset.click || eventBoundTo.dataset.uniclick,
                component = allActiveComponents[id],
                functionToCall = component[onClick];

            // --- Needed, since jQuery messess the keyboard events, and they fire twice instead of once
            HShell.core.ignoreNextEvent();

            e.stopPropagation();
            if(functionToCall){
                functionToCall.call(component, e, eventBoundTo);
            } else {
                // --- If you want to do something custom with the event
                component.onUniclick && component.onUniclick.call(component, e, eventBoundTo, onClick);
            }
        }
    }

    function sendKeyupEventToComponent(e){
        var eventBoundTo = getKeyEventBoundTo(e.target),
            parentComponent = eventBoundTo ? HShell.core._getWrappingComponent(eventBoundTo) : null,
            allActiveComponents = HShell.core.getAllActiveComponents();

        if(eventBoundTo && parentComponent){
            var id = parentComponent.dataset.id,
                onKeyup = eventBoundTo.dataset.keyup,
                component = allActiveComponents[id],
                functionToCall = component[onKeyup];

            e.stopPropagation();
            e.preventDefault();
            if(functionToCall){
                functionToCall.call(component, e, eventBoundTo);
            } else {
                // --- If you want to do something custom with the event
                component.onKeyup && component.onKeyup.call(component, e, eventBoundTo, onKeyup);
            }
        }
    }

    /**
     * @param {domNode} target - The starting point for the search
     * @param {function} comparator - Function that gets the current target and returns true or false
     * @returns {domNode} - The element that the event was originally bound
    */
    function getEventBoundTo(target, comparator){
        var eventBoundTo;

        if(comparator){
            do{
                if( comparator(target) ){
                    eventBoundTo = target;
                } else {
                    target = target.parentNode;
                }

                if(!target || target === document.body) {
                    break;
                }
            } while(!eventBoundTo);
        }

        return eventBoundTo;
    }

    function getClickEventBoundTo(target){
        return getEventBoundTo(target, clickComparator);
    }

    function getKeyEventBoundTo(target){
        return getEventBoundTo(target, function(target){
            return target.dataset && target.dataset.keyup;
        });
    }

    function clickComparator(target){
        return target.dataset && (target.dataset.click || target.dataset.uniclick);
    }

    function disableSpaceBar(e){
        var eventBoundTo = getEventBoundTo(e.target, clickComparator),
            spaceKeyCode = HShell.consts.keyCodes.space;

        if(eventBoundTo && (e.keyCode === spaceKeyCode || e.which === spaceKeyCode)){
            e.preventDefault();
        }
    }
})();

var HShell = window.HShell || {};
HShell.core = HShell.core || {};

(function () {
    var eventsArr = [],
        _event,
        _component;

    HShell.core._component = HShell.core._component || function(){};
    _component = HShell.core._component;

    HShell.core.addEventListener = function(eventName, callBack){
        var eventObj = new _event({
            eventName:eventName,
            callBack: callBack,
            id:eventsArr.length,
            _caller: HShell.core.addEventListener.caller
        });

        eventsArr.push(eventObj);

        return eventObj;
    };

    HShell.core.dispatchEvent = function(eventName, payload){
        payload = payload !== undefined ? payload : {};

        for(var i in eventsArr){
            if(eventsArr[i].eventName === eventName){
                eventsArr[i].callBack(payload);
            }
        }
    };
    // For backwards compatability with some of the content
    HShell.dispatchEvent = function(eventName, payload){
        HShell.core.$emit(eventName, payload);
    };

    _event = function(options){
        this.eventName = options.eventName;
        this.callBack = options.callBack;
        this.id = options.id;
        this.caller = options._caller;
    };

    _event.prototype.removeEventListener = function(){
        for(var i = this.id + 1; i < eventsArr.length; i++){
            eventsArr[i].id--;
        }

        eventsArr.splice(this.id, 1);
    };

    HShell.core.getAllEventListeners = function(){
        return Object.assign(eventsArr, {});
    };

    HShell.core.$emit = function(eventName, payload){
        HShell.core.getAllActiveComponentsTree().forEach(function(rootElement){
            rootElement.$emit(eventName, payload, true);

            if(rootElement._listneners){
                rootElement._listneners.forEach(function(listener){
                    if(listener.eventName === eventName){
                        listener.callBack(payload);
                    }
                });
            }
        });
    };

    HShell.core.$on = function(eventName, callBack){
        var listenerId = getNewEventId();

        HShell.core.getAllActiveComponentsTree().forEach(function(rootElement){
            rootElement._listneners = rootElement._listneners || [];

            rootElement._listneners.push({
                eventName: eventName,
                callBack: callBack,
                id: listenerId,
                _caller: HShell.core.$on.caller
            });
        });

        return listenerId;
    };

    HShell.core.$off = function(eventId){
        HShell.core.getAllActiveComponentsTree().forEach(function(rootElement){
            if(rootElement && rootElement._listneners) {
                rootElement._listneners.forEach(function(listener, id){
                    if(listener.id === eventId){
                        rootElement._listneners.splice(id, 1);
                    }
                });
            }
        });

    };

    _component.prototype.$emit = function(eventName, payload, fourceToAllDescendants){
        if(this._parent){
            emitToListeners(this._parent, eventName, payload);
        }

        emitToChildren(this, eventName, payload, fourceToAllDescendants);
    };

    function emitToListeners(component, eventName, payload){
        if(component._listneners){
            component._listneners.forEach(function(listener){
                if(listener.eventName === eventName){
                    listener.callBack(payload);
                }
            });
        }
    }

    function emitToChildren(component, eventName, payload, isRecursive){
        emitToListeners(component, eventName, payload);

        if(component._children){
            component._children.forEach(function(child){
                emitToListeners(child, eventName, payload);

                if(isRecursive){
                    emitToChildren(child, eventName, payload, true);
                }
            });
        }
    }

    _component.prototype.$on = function(eventName, callBack){
        var listenerId = getNewEventId();
        this._listneners = this._listneners || [];

        this._listneners.push({
            eventName: eventName,
            callBack: callBack.bind(this),
            id: listenerId,
            _caller: _component.prototype.$on.caller
        });

        return listenerId;
    };

    _component.prototype.$off = function(eventId){
        this._listneners.forEach(function(listener, id){
            if(listener.id === eventId){
                this._listneners.splice(id, 1);
            }
        });
    };

    function getNewEventId(){
        return 'customEvent_' + Math.round(Math.random() * 5000000);
    }
})();

var HShell = window.HShell || {};
HShell.core = HShell.core || {};

(function () {
    HShell.core._getWrappingComponent = function(eventBoundTo){
        var currentParent = eventBoundTo.parentNode,
            parentComponent;

        do{
            if( currentParent.className.indexOf(HShell.core._COMPONENT_CLASS_NAME) !== -1){
                parentComponent = currentParent;
            } else {
                currentParent = currentParent.parentNode;
            }

            if(!currentParent || currentParent === document.body){
                break;
            }
        } while(!parentComponent);

        return parentComponent;
    };
})();

/// <reference path="_references.js" />

var HShell = window.HShell || {};

(function () {
    // var buildGenericContainer = window.buildGenericContainer || function(){};
    // var buildPreloader = window.buildPreloader || function(){};
    // var continueAfterDataColection = window.continueAfterDataColection || function(){};
    // var brandName = window.brandName || {};

    HShell.preload = function (list, callback, imageCallback) {
        var at = list.length;
        var len = list.length;
        return list = jQuery.map(list, function (item) {
            var pItem = new Image();
            pItem.onload = function () {
                imageCallback && imageCallback.call(this, this, len - at, len);
                if (!--at) {
                    callback && callback(list);
                }
            };
            pItem.src = item;
            return pItem;
        });
    };

    HShell.preload.init = function () {
        preloadFonts();
        var loadedImgNum = 0;
        var generalUi = getAllImagesPath();

        // --- Preloader
        buildGenericContainer('', '');		// --- Builds the preloader wrapper

        var preLoader = buildPreloader(500);
        $('#eLearningGenericContainer').addClass('preloadingScreen');
        $('#eLContentContainer').append(preLoader.html);
        HShell.autoSetup.activeWindow = $('#' + preLoader.id).addClass('customWindowContent');

        $('#SCORM_Container').fadeIn(function () { $(this).scrollTop(0); });

        // --- Preloads all the images that are referred in the generalUi Array from '0.imagePreload.js'.
        HShell.preload(generalUi, function compleated() {
            HShell.autoSetup.imgLoaded = true;
            continueAfterDataColection();
        }, function loadOneImage() {
            loadedImgNum++;
            $('#preloaderBarInner').finish().animate({ width: ((loadedImgNum / generalUi.length) * 100) + '%' });		// --- Animates the preloader bar.
        });
    };

    function getAllImagesPath() {
        var coreUi = 'css/images_coreUI',
            brandingURL = 'css/branding',
            brandName = HShell.config.brandName,
            generalUi = [],
            imagesToPreload = HShell.courseSpecific.imagesToPreload || function(){};

        generalUi.push(coreUi + '/preloader_Left.png');
        generalUi.push(coreUi + '/preloader_Mid.png');
        generalUi.push(coreUi + '/preloader_Right.png');

        generalUi.push(coreUi + '/menuSelectedArrow.png');
        generalUi.push(coreUi + '/mobi_menuSelectedArrow.png');
        generalUi.push(coreUi + '/preloade_bg_pattern.png');
        generalUi.push(coreUi + '/pre_infoPopUpArrow.png');
        generalUi.push(coreUi + '/toolTipArrowDownB.png');
        generalUi.push(coreUi + '/toolTipArrowUp.png');
        generalUi.push(coreUi + '/radioBtn_inactive.png');
        generalUi.push(coreUi + '/modulesProgressSeparator.png');
        generalUi.push(coreUi + '/modileTimeSeparator.png');
        generalUi.push(coreUi + '/mobi_radioBtn_inactive.png');
        generalUi.push(coreUi + '/mobi_pre_infoPopUpArrow_white.png');
        generalUi.push(coreUi + '/mobi_pre_infoPopUpArrow.png');
        generalUi.push(coreUi + '/mobi_modulesProgressSeparator.png');
        generalUi.push(coreUi + '/mobi_modileTimeSeparator.png');
        generalUi.push(coreUi + '/mobi_chBox_inactive.png');
        generalUi.push(coreUi + '/mobi_arrow_up.png');
        generalUi.push(coreUi + '/header_progressTitleSeparator.png');
        generalUi.push(coreUi + '/chBox_inactive.png');
        generalUi.push(coreUi + '/arrow_up.png');
        generalUi.push(coreUi + '/videoPlayerButtonsSeparator.png');
        generalUi.push(coreUi + '/savingScreenBG.png');
        generalUi.push(coreUi + '/ie7ColorOverlay.png');

        generalUi.push(brandingURL + '/brand_' + brandName + '/images/radioBtn_active.png');
        generalUi.push(brandingURL + '/brand_' + brandName + '/images/mobi_radioBtn_active.png');
        generalUi.push(brandingURL + '/brand_' + brandName + '/images/mobi_chBox_active.png');
        generalUi.push(brandingURL + '/brand_' + brandName + '/images/chBox_active.png');

        generalUi.push(brandingURL + '/brand_' + brandName + '/images/client_logo_M.png');
        generalUi.push(brandingURL + '/brand_' + brandName + '/images/client_logo_S.png');
        generalUi.push(brandingURL + '/brand_' + brandName + '/images/client_logoL.png');

        generalUi.concat(imagesToPreload()); // pushes the whole array returned from imagesToPreload() to generalUi

        return generalUi;
    }

    // ---- Font Icons ----

    // --- Used only in developlent in order to find all icons that are used


    // --- Preload
    function preloadFonts() {
        $('body').append('<div id="fontsCheck" style="font-family: \'Impact\'">' + HShell.consts.iconsObj.icon_ring_role + HShell.consts.iconsObj.icon_ring_role + '</div>');
        var fontsW = $('#fontsCheck').height();
        $('#fontsCheck').attr('style', 'font-family: brandIconSet');

        var timeout = 5000;									// --- This determines the time that the script will wait for the fonts to load before continuing to the next step regardless of the fonts load status
        var passedTime = 0;								// --- The current time passed from the start of fonts load
        var checkFreq = 100;								// --- The iterval of wich check is made in order to determine if the font is loaded

        var fontCheck = setInterval(function () {
            var tempFontW = $('#fontsCheck').height();

            if (tempFontW != fontsW) {
                continueAfterFontLoad();
            } else {
                if (passedTime > timeout) {
                    continueAfterFontLoad();
                }
                passedTime += checkFreq;
            }
        },
        checkFreq);

        function continueAfterFontLoad() {
            HShell.autoSetup.fontsLoaded = true;
            continueAfterDataColection();
            clearInterval(fontCheck);
            $('#fontsCheck').remove();
        }
    }
})();

//contentSpecificImagePreload(); // No ide why it is commented out, most likely it must be enabled at some point

/// <reference path="_references.js" />

/* --- the comment: |notImplemented| will be added at all points where a specific feature must be added in future time --- */
/* --- the comment: |rework| will be added at all points where a section needs to be reworked, because it is not done in 100% correct way, or is not future proof --- */
/* --- the comment: |IE7| indicates that something is changed so we can support IE7, if we drop the IE7 support we can bring back the specific  --- */
/* --- the comment: |backwards| used to indicate that some part is left so that older content will still work with the SHell (mainly used for demos or old versions of the Authoring tool) --- */
/* --- the comment: |{name}| indicates who wrote the comment, it can be used for searching and questions to {name} ---*/
/* --- the comment: |documentation| indicates that this part of the code/feature is not explained in the documentation, and have to be added  ----- */
/* --- the comment: |unused| not needed but there somehow. If no problems, remove it --- */

/**
 *@global
 *@type {Object}
 *@namespace HShell
 *@description Root object for the application. Most fo the functionality of the application is stored here
*/
var HShell = window.HShell || {};

(function () {
    // --- GlobalSetup ---
    HShell.globalSetup = {
        HShellVersion: configJson.coreVersion,
        brandName: HShell.config.brandName,
        courseName: configJson.courseName,
        devMode: configJson.devMode,				// Putting it to true will:
        //					- Changes the title of the page to be the version of the Shell
        //					- Enable all of the console logs and trace functions.
        //					- Disables server Error message (used mainly if you run the content locally)
        //                  - Puts the controllers to the videos, so you can fast skip them (Only for the HTML video player, for the Flash player is not yet implemented)
        //					- Prevents the automatically scroll to top after the module completion
        //					- Enables keyboard combination for finishing all modules (ctrl + alt + f)
        //					- Enables keyboard combination for going to the end of a module (ctrl + alt + z)
        consoleEnable: 2,								// Use: '0' to completely disable the log | Use '1' to add the log to external window | Use '2' for normal "console.log"
        consoleExternalWindow: null,							// This is automatically set to "window object" if "consoleEnable" = 1
        ignoreConsoleArray: ['SCORM.commit: '],		        // add the 'source' name of the items that you want to be skipped in the logging. (we are talking for the "trace()" function)
        XMLcashing: configJson.XMLcashing,			// enable/disable the XML Cashing
        /**
       * @todo   for some reason this makes problems on SABA under firefox and chrome, because it dose not recognize the '?4234' as just a parameter.
       *          Therefor when you restart the course and it tries to reload the same XML with different parameter, it trows an error
       */

        demoMode: configJson.demoMode,            // Controls if we are going to show static data and some other functions:
        //					- Puts the name of the Learner to "John Smith"
        //					- Disables server Error message (used mainly if you run the content locally)
        qaMode: configJson.qaMode,              // Putting it to true will:
        //					- Changes the title of the page to be the version of the Shell
        //					- Enables keyboard combination for finishing all modules (ctrl + alt + f)
        //					- Enables keyboard combination for going to the end of a module (ctrl + alt + z)
        tutorialVideoUrl: {},
        tutorialVideosubtitlesURL: {},
        enableSuspendDataCopression: true,							// For now, this feature dose not work, |notImplemented|

        // first level of the Array is what 'course_template' is selected, the second are the modules that need to be used (the order of loading depends of the order of the array)
        segmentsOrder: [
            [],	 // Just fills the 0th item on the Array, since we do not need 0 based order
            ['startingCover', 'audioAvailable', 'tutorial', 'mod_select'], // For 'course_template' as: 'Bronze Shell'
            ['startingCover', 'langSelect', 'newToCompany', 'brandSelect', 'roleSelect', 'warningScreen', 'newsScreen', 'audioAvailable', 'intro', 'tutorial', 'pre_a', 'mod_select', 'final_survey'],	// For 'course_template' as: 'Mandatory training' located in config.xml
            ['startingCover', 'newToCompany', 'brandSelect', 'roleSelect', 'warningScreen', 'newsScreen', /*'audioAvailable',*/ 'tutorial', 'pre_a', 'mod_select', 'final_survey'], // Course specific ITMatters Existing Emp
            ['startingCover', 'brandSelect', 'roleSelect', 'warningScreen', 'newsScreen', /*'audioAvailable',*/ 'tutorial', 'courseInformation', 'mod_select', 'final_survey'], // Course specific ITMatters New Employee
            //Course specific Data Protection Existing Emp, BasicCompliance and Competition Law is the same but without language controlled from the xml
            ['startingCover', 'langSelect', 'newToCompany', 'brandSelect', 'roleSelect', 'warningScreen', 'newsScreen', /*'audioAvailable',*/ 'intro', 'tutorial', 'peopleManager', 'pre_a', 'mod_select', 'final_survey'],
            //Course specific Data Protection New Employee, BasicCompliance and Competition Law is the same but without language controlled from the xml
            ['startingCover', 'langSelect', 'brandSelect', 'roleSelect', 'warningScreen', 'newsScreen', /*'audioAvailable',*/ 'intro', 'tutorial', 'courseInformation', 'mod_select', 'final_survey'],
            //new templates with news screen after language selection screen
            ['startingCover', 'langSelect', 'newsScreen', 'newToCompany', 'brandSelect', 'roleSelect', 'warningScreen', 'intro', 'tutorial', 'peopleManager', 'pre_a', 'mod_select', 'final_survey'],
            ['startingCover', 'langSelect', 'newsScreen', 'brandSelect', 'roleSelect', 'warningScreen', 'intro', 'tutorial', 'courseInformation', 'mod_select', 'final_survey']
        ],
        videoPlayerDevices: { // This is more for the developer to understand what is going on, (the object is not used in the code)
            flashPlayerDevicesArray: [
                { browser: 'IE', version: '7', deviceType: 'desktop', formFactor: 'desktop' },
                { browser: 'IE', version: '8', deviceType: 'desktop', formFactor: 'desktop' },
                { browser: 'IE', version: '9', deviceType: 'desktop', formFactor: 'desktop' },
                { browser: 'IE', version: '10', deviceType: 'desktop', formFactor: 'desktop' },
                { browser: 'IE', version: '11', deviceType: 'desktop', formFactor: 'desktop' }
            ],
            blobVideoTagDevicesArray: [
                { browser: 'safari ', version: 'all', deviceType: 'mobile', formFactor: 'phone' },
                { browser: 'safari ', version: 'all', deviceType: 'mobile', formFactor: 'tablet' },
                { browser: 'chrome', version: 'all', deviceType: 'desktop', formFactor: 'desktop' }
            ],
            videoTagDevicesArray: [
                { browser: 'firefox', version: 'all', deviceType: 'desktop', formFactor: 'desktop' },
                { browser: 'IE', version: 'all', deviceType: 'mobile', formFactor: 'phone' }
            ]
        }
    };

    // --- AutoSetup ---
    HShell.autoSetup = HShell.autoSetup || {};
    HShell.newObjects = HShell.newObjects || {};
    var autoSetup = {
        oldIE: false,								// True if the browser is < IE9
        runOn: new HShell.core.runningOn(),					    // Detects all the specifics of the browser	(10.detectBrowser.js)
        mainYScrollPossition: 0,					// Used for temporary storing while the mainContainer is hidden
        focusableArr: [],					    	// Used for locking the focus inside the modal screens/pop-ups
        isFirstScreenLoader: true,					// Indicates whether this screen is the first screen the user is seeing. //not in use
        activeVideoArray: [],
        activeVideo: {},
        shellModuleStep: -1,						// This indicates what is the current position on the 'segmentsOrder' array => the position on modules shown.
        // - Example: if(shellModuleStep == 3) for 'Mandatory training' template, this means that we are currently on 'roleSelect'

        imgLoaded: false,							// Indicates if all of the UI images are preloaded (dose not care for the content images)
        xmlLoaded: false,							// Indicates if all content.xml files, and the config.xml are loaded
        savedDataLoaded: false,						// Indicates if the data is restored after course re-lunch
        clientSpecificXMLsLoaded: false,			// If they are client specific XMLs to be loaded, this indicates that. used inside 11.clientSpecific
        fontsLoaded: false,							// Uses webfontloader.js lib to determine if the font is loaded
        preloadedAllData: false,					// This indicates that in the initial loading screen all required data is loaded

        activeWindow: null,
        activePopUp: null,
        activeVideoState: 'notStarted',
        modulesFirstLoad: true,
        postAssessFinishedModules: [],		// |rework| We have to move this into the post-assessment object, since there is the same var for the pre-assessment
        postAssessWrongModules: [],
        postAssessEnabled: false,
        commitDelay: 0,								// In 'ms'. This value is dynamically calculated from "commitData". 0 is uninitialized
        commitStackNum: 0,							// The number of item that are waiting to be committed to the LMS
        commitDataServerErrorCount: 0,
        commitCount: 0,
        serverError: false,
        ignoreServerErrorPopup: false,
        brandingFolder: '',							// Gets the data from index.HTML
        accessibilityTitleRead: false,              // Reading title on landing page and then set to true, used in goToCommon()
        bodyZoomRatio: 1,							// Used for zooming the body, and recalculating the 100vh after that
        fullFrameHeight: 100,						// The calculated height of 100vh elements based on the bodyZoomRatio. Default as 100 in order to work in desktops as well
        lastUserInteraction: '',					// A string that indicates the last user interaction 'mouse' or 'keyboard'

        timeSpendInsideCoures: 0,
        sessionTime: 0,
    };

    // --- Copy all propertyes
    for (var attr in autoSetup) { HShell.autoSetup[attr] = autoSetup[attr]; }

    // --- Branding vars
    HShell.branding = {
        height: 576,
        width: 1024
    };

    // --- Content Setup ---
    HShell.contentSetup = {
        enableDataSavings: true,
        dataSavingsMethod: 0,						// The value of '0' is just for initial value, it dose not have any meaning. The var have to be an none 0 integer.
        course_template: 1,
        role_select: false,
        have_newToCompanyScreen: false,
        have_startingCover: false,
        startingCoverBgImgUrl: false,
        startingCoverBrandLogoUrl: false,
        skip_roleSelect: false,
        language_select: false,
        have_pre_a: false,
        have_post_a: false,
        post_type: 0,								// 0 is threshold based	|	1 is completion based
        have_survey: false,
        have_final_survey: false,
        have_tutorial: false,
        brand_select: false,
        postAssessmentMode: 'paralel',				// Use 'paralel' if the post-assessment is available at the same time as the modules    |  Use 'serial' if the post-assessment can be reached only after all mandatory modules are passed
        skip_pre_a: false,
        enableSCORM: false							// ONLY FOR BACKWARDS COMPATIBILITY For the Atool.	|backwards|
    };

    // --- Content ---
    HShell.content = HShell.content || {};
    var content = HShell.content;

    content.settingsXML = 'null';
    content.selected_languageObj = 'null';				// The langObj with all the language elements
    content.selected_roleObj = 'null';
    content.role_newToCompanyObj = 'null';
    content.brandsArray = [];
    content.roleArray = [];						// Array contains objects  'roleObject' generated by the Function 'newRoleObject'
    content.languageArray = [];					// Array contains objects 'langObj' generated by the Function 'newLanguageObjects'
    content.allModulesNum = 0;
    content.preAssessObj = {								// This values will be overwritten later, they just indicate the type of the vars inside for faster understanding the code.
        XMLInit: 'undefined',
        activeQuestion: 'undefined',
        activeQuestionData: 'undefined',
        activeQuestionNum: 0,
        answersArray: [],
        correctAnswers: 0,
        finishedModules: [],
        maxQuestions: 0,
        questionsNum: 0,
        quizArray: [],
        type: 'pre_assessment',
        timeSpend: 0,							// The time in seconds that the user spend on the pre-assessment. This is only used for the reporting in the LMS |documentation|
        timeSpendInterval: 'null',				// For the same reason we need the top one. This contains the setInterval so that it can be cleared whenever the assessment is done.
        completion_status: 'not attempted'                 // Completion status (stored on LMS). Possible values: "passed", "completed", "failed", "incomplete", "browsed", "not attempted"
    };
    content.roleNoPreAssessment = false;
    content.postAssessObj = {};
    content.surveyObj = {};
    finalSurveyObj = {};
    content.obejectivesCount = 0;
    content.interactionsCount = 0;						// The total count of all interactions (pre, post assessment as well as the modules (the modules are still |notImplemented| ))

    window.SL = HShell.content.selected_languageObj;	// Just a shortcut for "HShell.content.selected_languageObj"

    // --- User Data ---
    HShell.userData = {
        selected_language: 'null',					// The code of the language ('en', 'bg', 'it' ...)
        selected_role: 'null',
        selected_roleCode: 'null',
        prefer_subtitles: false,
        // Determines if there will be subtitles on the videos (you will aways have the button to show or hide them )
        Mod1_3: false,
        Mod4_3: false,
        Mod11_3: false,
        Mod11_4: false,
        Mod10_2: false,
        Mod10_3: false,
        Mod10_4: false,
        volume_level: 10 							// 10 is max, 0 is mute
    };

    // --- Saved Data ---
    HShell.savedData = {
        user_name: '',
        user_id: 0,
        completion_status: 'incomplete',			// The idea is the same as for SCORM 2004 but we are applying it to all types of saving
        success_status: 'unknown',					// For now it makes sence only for SCORM 2004, but we can use it in future for other saving mechanisms
        last_location: 'start'						// Indicates the last position in the course. Possible options 'lang' , 'role', 'pre_a', 'audioAvailable' , 'mod', 'post_a'
    };

    // --- Setup Demo mode
    if (HShell.globalSetup.demoMode) { HShell.savedData.user_name = 'John Smith'; }

    HShell.newObjects.newBrandObject = function(xml) {
        var brandObject = {};
        brandObject.code = xml.attr('code');
        // if (String(brandObject.code) == 'undefined') roleObject.code = ''; // Unknown reason for existence of this line

        brandObject.label_text = {};
        brandObject.langagesCode = [];
        xml.find('label_text').each(function () {
            var languageCode = $(this).attr('language');
            brandObject.label_text[languageCode] = $(this).text() || '';
            brandObject.langagesCode.push(languageCode);
        });

        brandObject.imgUrlIcon = xml.find('imgUrlIcon').text();
        brandObject.imgActiveUrlIcon = xml.find('imgActiveUrlIcon').text();
        brandObject.imgUrlIconBig = xml.find('imgUrlIconBig').text();
        brandObject.imgActiveUrlIconBig = xml.find('imgActiveUrlIconBig').text();
        // brandObject.roles_list = xml.find('roles_list').text();
        return brandObject;
    }

    //	--- Role Array
    HShell.newObjects.newRoleObject = function (xml) {
        var roleObject = {};
        roleObject.code = xml.attr('code');
        roleObject.roleCode = xml.attr('roleCode');
        if (String(roleObject.roleCode) == 'undefined') roleObject.roleCode = '';           // --- In the case we do not have the roleCode in the course

        roleObject.brand = $(xml).attr('brand');
        roleObject.label_text = {};
        roleObject.langagesCode = [];
        xml.find('label_text').each(function () {
            var languageCode = $(this).attr('language');
            roleObject.label_text[languageCode] = $(this).text();
            roleObject.langagesCode.push($(this).attr('language'));
        });
        roleObject.imgUrl = xml.find('imgUrl').text();
        roleObject.imgUrlActive = xml.find('imgUrlActive').text();
        roleObject.imgUrlMassive = xml.find('imgUrlMassive').text();
        roleObject.imgUrlMassiveActive = xml.find('imgUrlMassiveActive').text();

        roleObject.isSecondary = xml.attr('isSecondary');

        if (String(xml.find('brandingThemeFolder')) != 'undefined') {
            roleObject.brandingThemeFolder = xml.find('brandingThemeFolder').text();
        } else { roleObject.brandingThemeFolder = HShell.autoSetup.brandingFolder; }

        if (String(xml.find('uiOverride')) != 'undefined') {
            roleObject.uiOverride = Boolean(Number(xml.find('uiOverride').text()));
        } else { roleObject.uiOverride = false; }

        //if (String(xml.find('surveyOverride')) != 'undefined') {
        //    roleObject.surveyOverride = Boolean(Number(xml.find('surveyOverride').text()));
        //} else { roleObject.surveyOverride = false; }

        roleObject.introVideoURL = xml.find('introductinVideoURL').text();
        roleObject.introSubtitlesURL = xml.find('introductinVideoSubtitles').text();

        roleObject.skip_pre_a = Boolean(Number(xml.find('skip_pre_a').text()));
        roleObject.modules_list = xml.find('modules_list').text();
        roleObject.modules_listArray = [];

        return roleObject;
    };

    //	--- Modules
    HShell.newObjects.newModuleObject = function (xml, moduleGroupId, moduleInGroupId) {
        var module = HShell.utils.xml2json(xml),
            $xml = $(xml),
            $info = $xml.find('info'),
            $contentUrl = $xml.find('contentURL'),
            isMandatory = $xml.find('mandatory').length != 1,
            transcriptURL = $xml.find('contentSubURL').text(),
            target = $xml.find('target').text(),
            statuses = HShell.consts.completionStatus,
            modObj;

        modObj = {
            xmlObj: module,
            mod_id: module._id,
            mod_roles: $xml.attr('roles'),
            title: $xml.find('title').text(),
            type: $xml.find('type').first().text(),
            extention: HShell.utils.getFileExtention($xml.find('contentURL').text()),
            thumbnailURL: $xml.find('thumbnailURL').text(),
            thumbnailAlt: $xml.find('thumbnailURL').attr('alt'),

            contentURL: unescape($contentUrl.text()),
            contentURLSource: $contentUrl.attr('source'),
            contentURLPageTitle: $contentUrl.attr('pageTitle'),
            contentURLAlt: $xml.find('contentURLAlternative').text(),

            mandatory: isMandatory ? true : !!+$xml.find('mandatory').text(),
            interactionPoints: $xml.find('interactionPoints').children(),
            contentSubURL: transcriptURL ? transcriptURL : '',
            contentTranscriptURL: $xml.find('contentTranscriptURL').text(),

            info: $info.find('text').text(),
            infoImgUrl: $info.find('img').text(),
            infoText: HShell.utils.decodeHtml($info.find('text').text()),

            duration: Number($xml.find('duration').text()),

            // --- This refers to the in module quiz (a.k.a. reflection point )
            quiz: $xml.find('quiz'),
            quizObj: {},
            quizMand: $xml.find('quiz').attr('mandatory'),

            prePassed: false,
            postPassed: false,

            // --- Dose not have anything to do with SCORM standard, it just followed the logic of it.
            // --- Possible options: 'completed', 'incomplete', 'not attempted'
            completion_status : statuses.notStarted,
            // --- this is connected to the 'modObj.quiz'
            quiz_completion_status : statuses.unknown,
            content_completion_status : statuses.notStarted,
            objective_dataObject : new HShell.oneObjective(),

            moduleGroupId : moduleGroupId,
            moduleInGroupId : moduleInGroupId,
            // --- used in the SCORM to keep the connection between the moldule and the objective
            objectiveId : 0,
            moduleTarget : target ? target : 'external',
            theme: $xml.find('theme').text()
        };

        if (modObj.mandatory) HShell.contentSetup.postAssessmentMode = 'serial';

        return modObj;
    };

    HShell.oneObjective = function () {
        this.id = '';
        this.contentCompletion = 'unknown';
        this.quizCompletion = 'unknown';
        this.success_status = 'unknown';
        this.score = 0;						// A number between 0 and 100 representing the current score for the objective
        this.description = {};			// An object that describes the module
        this.completion_status = 'not attempted';
        this.objectiveNumber = 0;
    };

    //	----------------- Pre/Post Assessment/ In module Quiz
    function newAssessmentAnswerData() {
        this.id = '';
        this.type = '';						// Multiple choice or single choice
        this.result = '';						// Indicates if the learner have answered correctly
        this.description = '';						// The description of the answer
        this.learner_response = '';						// Learner answer (in the order of showing them) (applicable only for single and multiple choice questions)
        this.objectives = {
            _0: {
                id: ''						// Indicates a link to a module
            },
            _1: {
                id: ''						// Indicates what kind of assessment quiz this answer is part of
            }
        };
        this.latency = '';						// |notImplemented|Stores the time spend on the specific question
        this.timestamp = '';						// Shows the time at which the question was shown to the learner
    }

    HShell.fillAssessmentAnswerStartData = function (assessmentObj) {
        var obj = new newAssessmentAnswerData();
        obj.id = assessmentObj.type + '_Question_' + assessmentObj.activeQuestionNum;             // --- assessmentObj.type means 'pre_assessment', 'post_assessment', 'module_quiz'
        obj.type = assessmentObj.activeQuestion.attr('type');
        obj.subType = assessmentObj.activeQuestion.attr('subType');
        obj.description = assessmentObj.activeQuestion.find('.questionTitle').text();
        obj.objectives._0.id = assessmentObj.type;
        obj.objectives._1.id = 'Module_' + assessmentObj.activeQuestion.attr('formodule');
        obj.timestamp = new Date();
        try {        // --- Since this is only for the post assessment for now, on the pre assessment it trows an error
            obj.interactionsPosition = parsePostAssessScormInteractionsPositionsArray(assessmentObj.activeQuestionNum);
        } catch (e) {
            HShell.utils.trace(e);
        }

        return obj;
    };

    HShell.fillAssessmentAnswerEndData = function (assessmentObj) {
        try {
            var result = '';
            if (assessmentObj.activeQuestion.attr('correctstate') == 'true') { result = 'correct'; }		// |rework| It is not correct to put this status on the element in the DOM, since it is too easy to cheat
            else { result = 'incorrect'; }

            var response = '';
            assessmentObj.activeQuestion.find('input:checked')
                .each(function () {
                    // |rework| It is very wrong to relay on the fact that there is an input element there (not future proof)
                    response += Number(Number($(this).attr('answerNumber')) + 1) + '[,]';
                });
            response = response.slice(response, response.lastIndexOf('[,]'));

            if (assessmentObj.activeQuestionData == null) {
                assessmentObj.activeQuestionData = new Object();
            }
            assessmentObj.activeQuestionData.result = result;
            assessmentObj.activeQuestionData.learner_response = response;
            assessmentObj.activeQuestionData.latency = Math.floor(new Date().getTime() / 1000) - Math.floor(assessmentObj.activeQuestionData.timestamp / 1000);

            return assessmentObj.activeQuestionData;
        } catch (e) {
            HShell.utils.trace(e.message, '1.globalVars -> fillAssessmentAnswerEndData(assessmentObj)');
            return false;
        }
    };

    HShell.newObjects.newAssessmentObj = function (type, xml) {
        return {
            type: type,                 // String showing the type of the assessment. Possible strings: 'pre_assessment', 'post_assessment', 'module_quiz'
            questionsNum: 0,            // Total number of questions
            answeredQuestionsNum: 0,    // The number of answered questions
            activeQuestion: null,       // jQuery object of the active question
            activeQuestionNum: 0,       // The number of the active question
            activeQuestionData: null,   // This contains an object of type 'newAssessmentAnswerData' (defined in '8.SCORM') with all the data for the active question to be stored in the LMS
            answersArray: new Array(),  // Item [0]: correctState, item[1]: qGroupId, item[2]: qI, item[3]: text version of the answer, item[4]: number of the answer (in the order of showing), item[5]: saved to LMS status (true/false)
            correctAnswers: 0,
            toLocaleString: -1,         // This is used for SCORM tracking
            finishedModules: new Array(),
            attempts: 0,
            completion_status: 'not attempted',    // Completion status (stored on LMS). Possible values: "passed", "completed", "failed", "incomplete", "browsed", "not attempted"
            XML: xml,
            XMLInit: false,
            quizArray: new Array(),
            maxQuestions: 0,
            timeSpend: 0,
            timeSpendInterval: 0
        };
    };

    // If the selected role is the same as the questions role and if the question is not set to be skipped (attr skip set to 1) returns Obj with the question | if no, returns String('null');
    HShell.newObjects.newGroupObj = function (xml, excludeList, includeList) {
        var groupObj = {};
        groupObj.id = xml.attr('id');
        groupObj.module = xml.attr('module');

        var excluded = false;
        var included = false;

        try {
            if (HShell.contentSetup.post_type === 1) {
                if (String(excludeList) != 'null') {
                    for (var i = 0; i < excludeList.length; i++) {
                        if (String(excludeList[i]) == String(groupObj.module)) excluded = true;
                    }
                }

                if (String(includeList) != 'null' && String(includeList) != 'undefined') {
                    for (var j = 0; j < includeList.length; j++) {
                        if (String(includeList[j]) == String(groupObj.module)) included = true;
                    }
                }

                if (String(includeList) == '0') included = true;
                if (excludeList == 'null' && includeList == 'null') included = true;
            } else {
                included = true;
            }
        } catch (e) {
            // --- Must make better Error handler ...  or any at all
        }

        if (excluded || !included) {
            HShell.utils.trace('Not this one', 'newGroupObj_1.globalVars');
            return 'null';
        }

        groupObj.questionsNumbers = Number(xml.attr('questionsNumbers'));
        if (!groupObj.questionsNumbers) {
            groupObj.questionsNumbers = 1;
        }

        groupObj.questionArr = [];
        $(xml).find('question').each(function () {
            var listOfRoles = String($(this).attr('roles')).toLowerCase();
            var selectedRole = String(HShell.content.selected_roleObj.code).toLowerCase();

            if (((listOfRoles.indexOf(selectedRole) != -1 || listOfRoles == 'undefined') &&
                (String($(this).attr('skip')) != 'true')) || listOfRoles == 'all') {
                groupObj.questionArr.push({});
                var gObjIndex = groupObj.questionArr.length - 1;

                groupObj.questionArr[gObjIndex].id = $(this).attr('id');
                groupObj.questionArr[gObjIndex].roles = $(this).attr('roles');

                groupObj.questionArr[gObjIndex].type = $(this).attr('type');
                // ---------- For the "Video questions"
                if (String($(this).attr('subType')) != 'undefined') {
                    groupObj.questionArr[gObjIndex].subType = $(this).attr('subType');
                }
                if ($(this).find('videoURL').length > 0) {
                    groupObj.questionArr[gObjIndex].videoURL = $(this).find('videoURL').text();
                }
                if ($(this).find('subtitlesURL').length > 0) {
                    groupObj.questionArr[gObjIndex].subtitlesURL = $(this).find('subtitlesURL').text();
                }

                // ---------- For Multiple/Single Choice
                groupObj.questionArr[gObjIndex].qTxt = $(this).find('questionText').text();
                groupObj.questionArr[gObjIndex].backgroundImage = $(this).attr('backgroundImage');

                if ($(this).find('correct_fb').length > 1) {
                    groupObj.questionArr[gObjIndex].correctFBByAnswerId = {};
                    $(this).find('correct_fb').each(function () {
                        var forAnswerId = $(this).attr('for');
                        if (forAnswerId) {
                            groupObj.questionArr[gObjIndex].correctFBByAnswerId[forAnswerId] = $(this).text();
                        } else {
                            groupObj.questionArr[gObjIndex].correctFB = $(this).text();
                        }
                    });
                    if (!groupObj.questionArr[gObjIndex].correctFB) {
                        groupObj.questionArr[gObjIndex].correctFB = $(this).find('correct_fb').first().text();
                    }
                } else {
                    groupObj.questionArr[gObjIndex].correctFB = $(this).find('correct_fb').text();
                }

                
                if ($(this).find('wrong_fb').length > 1) {
                    groupObj.questionArr[gObjIndex].wrongFBByAnswerId = {};
                    $(this).find('wrong_fb').each(function () {
                        var forAnswerId = $(this).attr('for');
                        if (forAnswerId) {
                            groupObj.questionArr[gObjIndex].wrongFBByAnswerId[forAnswerId] = $(this).text();
                        } else {
                            groupObj.questionArr[gObjIndex].wrongFB = $(this).text();
                        }
                    });
                    if (!groupObj.questionArr[gObjIndex].wrongFB) {
                        groupObj.questionArr[gObjIndex].wrongFB = $(this).find('wrong_fb').first().text();
                    }
                } else {
                    groupObj.questionArr[gObjIndex].wrongFB = $(this).find('wrong_fb').text();
                }
                groupObj.questionArr[gObjIndex].answerArr = [];
                $(this).find('answer').each(function () {
                    var newAObj = {};
                    newAObj.aText = HShell.utils.encodeHtml($(this).text());
                    newAObj.correct = $(this).attr('correct');
                    newAObj.id = $(this).attr('id');
                    newAObj.aImg = $(this).attr('imgUrl');

                    newAObj.image = $(this).attr('image');
                    newAObj.imageSelected = $(this).attr('imageSelected');

                    groupObj.questionArr[gObjIndex].answerArr.push(newAObj);
                });

                groupObj.questionArr[gObjIndex].verticalAnswers = $(this).attr('verticalAnswers');

                if ($(this).find('image').length > 0) {
                    groupObj.questionArr[gObjIndex].image = {};
                    groupObj.questionArr[gObjIndex].image.imageUrl = $(this).find('image > imageUrl').text();
                    groupObj.questionArr[gObjIndex].image.imageAlt = $(this).find('image > imageUrl').attr('alt');
                    groupObj.questionArr[gObjIndex].image.imageMobileOverride = $(this).find('image > imageUrl').attr('mobileOverride');
                    groupObj.questionArr[gObjIndex].image.itemColor = $(this).find('image > items > itemColor').text();
                    groupObj.questionArr[gObjIndex].image.textColor = $(this).find('image > items > textColor').text();
                    groupObj.questionArr[gObjIndex].image.bgColor = $(this).find('image > items > bgColor').text();
                    groupObj.questionArr[gObjIndex].image.borderColor = $(this).find('image > items > borderColor').text();
                    groupObj.questionArr[gObjIndex].image.items = [];
                    $(this).find('image > items > item').each(function () {
                        var newItem = {};
                        newItem.position = $(this).find('itemPosition').text();
                        newItem.positionMobileOverride = $(this).find('itemPosition').attr('mobileOverride');
                        newItem.itemTitle = $(this).find('itemTitle').text();
                        newItem.itemText = $(this).find('itemText').text();
                        groupObj.questionArr[gObjIndex].image.items.push(newItem);
                    });
                }
                if ($(this).find('video').length > 0) {
                    groupObj.questionArr[gObjIndex].video = {};
                    groupObj.questionArr[gObjIndex].video.videoUrl = $(this).find('video > videoUrl').text();
                    groupObj.questionArr[gObjIndex].video.videoThumbUrl = $(this).find('video > videoThumbUrl').text();
                    groupObj.questionArr[gObjIndex].video.subtitlesUrl = $(this).find('video > subtitlesUrl').text();
                }
            }

        });

        if (groupObj.questionsNumbers > groupObj.questionArr.length) {
            groupObj.questionsNumbers = groupObj.questionArr.length;
        }

        return groupObj;
    };

    /* -------------------------------------------- */
    /* --- Language Array  ---- */
    /* -------------------------------------------- */

    HShell.newObjects.newLanguageObject = function (xml, idInLanguageArray) {

        var langObj = {};
        langObj.UI = {};
        langObj.idInLanguageArray = idInLanguageArray;
        langObj.UI.course_title = xml.find('label_course_title').text();
        langObj.UI.course_subTitle = xml.find('subtitle_of_course').text(); if (langObj.UI.course_subTitle.length > 500) langObj.UI.course_subTitle = langObj.UI.course_subTitle.slice(0, 499);
        langObj.UI.course_description = xml.find('description').text();

        langObj.UI.label_text = xml.find('label_text').text();			// |rework| This must be called something more like "label_Language"
        langObj.UI.label_language_select = xml.find('label_language_select').text();
        langObj.UI.label_role_select = xml.find('label_role_select').text();
        langObj.UI.label_role_explanation = xml.find('label_role_explanation').text();
        langObj.UI.label_brand_select = xml.find('label_brand_select').text();
        langObj.UI.label_brand_select_sub = xml.find('label_brand_select_sub').text();
        langObj.UI.label_course_title = xml.find('label_course_title').text();
        langObj.UI.label_continue = xml.find('label_continue').text();
        langObj.UI.label_selected = xml.find('label_selected').text();
        langObj.UI.label_Yes = xml.find('label_Yes').text();
        langObj.UI.label_No = xml.find('label_No').text();
        langObj.UI.label_OK = xml.find('label_OK').text();
        langObj.UI.label_Submit = xml.find('label_Submit').text();
        langObj.UI.quiz = xml.find('label_quiz').text();
        langObj.UI.reflect = xml.find('label_reflect').text();
        langObj.UI.quizThYouP1 = xml.find('label_quizThYouP1').text();
        langObj.UI.quizThYouP2 = xml.find('label_quizThYouP2').text();
        langObj.UI.quizThYouP3 = xml.find('label_quizThYouP3').text();
        langObj.UI.completeBeforeContinue = xml.find('label_completeBeforeContinue').text();
        langObj.UI.completedContinue = xml.find('label_completedContinue').text();

        langObj.UI.startingCoverAdditionalText = xml.find('startingCover_additionalText').text();

        langObj.UI.imgUrl = xml.find('imgUrl').text();
        langObj.UI.imgUrlBig = xml.find('imgUrlBig').text();
        langObj.UI.imgUrlMassive = xml.find('imgUrlMassive').text();
        langObj.UI.contentXMLURL = xml.find('contentXML').text();
        langObj.UI.pre_a = xml.find('pre_a_URL').text();
        langObj.UI.post_a = xml.find('post_a_URL').text();

        langObj.UI.roleNewToCompanyTitle = xml.find('label_role_newToCompany_title').text();
        langObj.UI.roleNewToCompanyContent = xml.find('label_role_newToCompany_content').text();

        langObj.UI.roleNewToCompanyTitleIT = xml.find('label_role_newToCompanyIT_title').text();
        langObj.UI.roleNewToCompanyContentITPurple = xml.find('label_role_newToCompanyIT_purple_content').text();
        langObj.UI.roleNewToCompanyContentIT = xml.find('label_role_newToCompanyIT_content').text();
        langObj.UI.roleNewToCompanyContentITMore = xml.find('label_role_newToCompanyIT_more_content').text();
        langObj.UI.label_organisation_select = xml.find('label_organisation_select').text();
        langObj.UI.label_more_info = xml.find('label_more_info').text();
		langObj.UI.label_permission_text = xml.find('label_permissions_text').text();
        langObj.UI.label_training_version_select = xml.find('label_training_version_select').text();
        langObj.UI.roleHelpMeChooseInfo = xml.find('role_help_me_choose_info').text();
        langObj.UI.roleHelpMeChooseText = xml.find('role_help_me_choose_text').text();
        langObj.UI.roleHelpMeChoosePopupText = xml.find('role_help_me_choose_popup_text').text();
        langObj.UI.label_helpMeChooseButton = xml.find('label_help_me_choose_button').text();
        langObj.UI.label_fullCourse = xml.find('label_full_course').text();
        langObj.UI.label_helpMeChoose = xml.find('label_helpMeChoose').text();
        langObj.UI.label_importantInformation = xml.find('label_important_information').text();
        langObj.UI.pre_assessment_additional_text = xml.find('pre_assessment_additional_text').text();

        langObj.UI.folder = xml.find('folder').text();
        langObj.UI.code = xml.find('code').text(); // --- |rework| it will be a lot better, if you rename this to 'language_code' since now is confusing

        // Server Error
        langObj.UI.serverError_title = xml.find('lable_serverErrorTitle').text();
        langObj.UI.serverError_body = xml.find('lable_serverErrorBody').text();

        // Accessibility words
        langObj.UI.access_show = xml.find('access_show').text();
        langObj.UI.access_hide = xml.find('access_hide').text();
        langObj.UI.access_menu = xml.find('access_menu').text();
        langObj.UI.access_languageSelect = xml.find('access_languageSelection').text();
        langObj.UI.access_replay = xml.find('access_replay').text();
        langObj.UI.access_accessibility = xml.find('access_accessibility').text();
        langObj.UI.access_backHome = xml.find('access_backHome').text();

        // Audio Available
        langObj.UI.aATitle = xml.find('label_audioAvailableTitle').text();
        langObj.UI.label_audioOn = xml.find('label_audio_on').text();
        langObj.UI.label_audioOff = xml.find('label_audio_off').text();

        //--- |rework|	this thing is currently used in only one course : BT, Data protection EE version. This
        //              thing must be changed to be more flexible, since in other courses it can be used in a different way.
        langObj.UI.aAAtentionMessage = xml.find('lable_audioAvaliableAtentionMessage');
        if (langObj.UI.aAAtentionMessage) langObj.UI.aAAtentionMessage = langObj.UI.aAAtentionMessage.text();

        langObj.UI.aADescription = xml.find('label_audioAvailableDescription').text();
        langObj.UI.aAMobiSkipTutorialTitle = xml.find('label_audioAvaliableMobileSkipTutorialTitle').text();
        langObj.UI.aAMobiSkipTutorialContent = xml.find('label_audioAvaliableMobileSkipTutorialContent').text();
        langObj.UI.lable_watchVideo = xml.find('lable_watchVideo').text();
        langObj.UI.lable_skipVideo = xml.find('lable_SkipVideo').text();
        langObj.UI.lable_loading = xml.find('lable_loading').text();
        langObj.UI.lable_introduction = xml.find('lable_introduction').text();

        // Pre-assessment
        langObj.UI.preTitle = xml.find('label_preAssessTitle').text();
        langObj.UI.question = xml.find('label_question').text();
        langObj.UI.of = xml.find('label_of').text();
        langObj.UI.correct = xml.find('label_correct').text();
        langObj.UI.incorrect = xml.find('label_incorrect').text();
        langObj.UI.trueText = xml.find('label_true').text();
        langObj.UI.falseText = xml.find('label_false').text();
        langObj.UI.next = xml.find('label_next').text();
        langObj.UI.previous = xml.find('label_previous').text();
        langObj.UI.redyToStart = xml.find('redyToStart').text();
        langObj.UI.startPre = xml.find('label_startPre').text();
        langObj.UI.pre_aMessage = xml.find('pre_assessmentMessage').text();
        langObj.UI.label_readFeedbackAgain = xml.find('label_readFeedbackAgain').text();

        langObj.UI.preAThankYou = xml.find('label_thankYou').text();
        langObj.UI.preAThankYouDescription = xml.find('thankYouDescription').text();
        langObj.UI.preAThankYouDescriptionBottom = xml.find('thankYouDescriptionBottom').text();
        
        langObj.UI.thankYouDescriptionNoPostAssessment = xml.find('thankYouDescriptionNoPostAssessment').text();
        langObj.UI.preAStartLearning = xml.find('label_startLearning').text();

        langObj.UI.replayVideo = xml.find('lable_replayVideo').text();

        // Main Header
        langObj.UI.experts = xml.find('experts').text();
        langObj.UI.progres = xml.find('progres').text();
        langObj.UI.elapsedTime = xml.find('elapsedTime').text();
        langObj.UI.seconds = xml.find('seconds').text();
        langObj.UI.minutes = xml.find('minutes').text();
        langObj.UI.hours = xml.find('hours').text();
        langObj.UI.welcome = xml.find('welcome').text();
        langObj.UI.tutorial = xml.find('tutorial').text();
        langObj.UI.skipVideo = xml.find('skipVideo').text();
        langObj.UI.myProgres = xml.find('myProgres').text();
        langObj.UI.rePlayTutorial = xml.find('label_rePlayTutorial').text();
        langObj.UI.lable_module = xml.find('lable_module').text();
        langObj.UI.accessibilityControls = xml.find('label_accessibilityControls').text();

        // Accessibility menu
        langObj.UI.accessibilityTitle = xml.find('label_accessibilityTitle').text();
        langObj.UI.accessibilityGeneralNavigation = xml.find('lable_accessibilityGeneralNavigation').text();
        langObj.UI.accessibilityGNExtraText = xml.find('lable_accessibilityGNExtraText').text();
        langObj.UI.accessibilityMainMenu = xml.find('lable_accessibilityMainMenu').text();
        langObj.UI.accessibilityPlayerControles = xml.find('lable_accessibilityPlayerControles').text();

        langObj.UI.alt_tab = xml.find('alt_tab').text();
        langObj.UI.alt_leftArrow = xml.find('alt_leftArrow').text();
        langObj.UI.alt_upArrow = xml.find('alt_upArrow').text();
        langObj.UI.alt_rightArrow = xml.find('alt_rightArrow').text();
        langObj.UI.alt_downArrow = xml.find('alt_downArrow').text();
        langObj.UI.alt_pressCombination_p1 = xml.find('alt_pressCombination_p1').text();
        langObj.UI.alt_pressCombination_p2 = xml.find('alt_pressCombination_p2').text();
        langObj.UI.alt_press = xml.find('alt_press').text();

        langObj.UI.alt_myProgressAccessibilityButton = xml.find('alt_myProgressAccessibilityButton').text();
        langObj.UI.alt_tutorialAccessibilityButton = xml.find('alt_tutorialAccessibilityButton').text();
        langObj.UI.alt_accessibilityButton = xml.find('alt_accessibilityButton').text();
        langObj.UI.alt_nextButton = xml.find('alt_nextButton').text();
		langObj.UI.alt_backButton = xml.find('alt_backButton').text();
        langObj.UI.alt_homeAccessibilityButton = xml.find('alt_homeAccessibilityButton').text();
        langObj.UI.alt_languageAccessibilityButton = xml.find('alt_langAccessibilityButton').text();
        langObj.UI.alt_menuAccessibilityButton = xml.find('alt_menuAccessibilityButton').text();

        langObj.UI.alt_videoRewind = xml.find('alt_videoRewind').text();
        langObj.UI.alt_videPlayPause = xml.find('alt_videPlayPause').text();
        langObj.UI.alt_videoStop = xml.find('alt_videoStop').text();
        langObj.UI.alt_VideoMute = xml.find('alt_VideoMute').text();
        langObj.UI.alt_moduleClose = xml.find('alt_moduleClose').text();

        langObj.UI.p = 'P ';
        langObj.UI.t = 'T ';
        langObj.UI.a = 'A ';
        langObj.UI.h = 'H ';
        langObj.UI.r = 'R ';
        langObj.UI.y = 'Y ';
        langObj.UI.u = 'U ';
        langObj.UI.s = 'S ';
        langObj.UI.x = 'X ';

        // Accessibility Specific
        langObj.UI.info_filters = xml.find('info_Filters').text();


        // Social Sp things
        langObj.UI.subjectSpecialists = xml.find('subject_specialists').text();
        langObj.UI.events = xml.find('events').text();
        langObj.UI.discussions = xml.find('discussions').text();
        langObj.UI.viewAll = xml.find('view_all').text();

        // Modules
        langObj.UI.allModules = xml.find('label_allModules').text();
        langObj.UI.inProgress = xml.find('label_inProgress').text();
        langObj.UI.toDo = xml.find('label_toDo').text();
        langObj.UI.toDoPlaceholder = xml.find('label_toDo_Placeholder').text();
        langObj.UI.compleated = xml.find('label_completed').text();
        langObj.UI.compleatedPlaceholder = xml.find('label_completed_Placeholder').text();
        langObj.UI.notCompleted = xml.find('label_notCompleted').text();
        langObj.UI.info = xml.find('label_info').text();
        langObj.UI.close = xml.find('label_close').text();
        langObj.UI.reflectPoint = xml.find('label_reflectPoint').text();
        langObj.UI.startFinalQuiz = xml.find('label_startFinalQuiz').text();
        // langObj.UI.image360CoverTitle = xml.find('label_image360CoverTitle').text();
        langObj.UI.image360StartBtn = xml.find('label_image360StartBtn').text();

        // Modules type
        langObj.UI.moduleTypeVideo = xml.find('label_video').text();
        langObj.UI.moduleAnimate = xml.find('label_animate').text();
        langObj.UI.moduleSlides = xml.find('label_slides').text();
        langObj.UI.moduleLayouts = xml.find('label_layouts').text();
        langObj.UI.moduleTypeWebpage = xml.find('label_webpage').text();
        langObj.UI.mandatory = xml.find('label_mandatory').text();
        langObj.UI.extPPT = xml.find('label_powerpoint').text();
        langObj.UI.extDOC = xml.find('label_word').text();
        langObj.UI.extPDF = xml.find('label_pdf').text();
        langObj.UI.extXLS = xml.find('label_excel').text();
        langObj.UI.document = xml.find('lable_document').text();

        // Video PopUp
        langObj.UI.confirmation = xml.find('label_confirmation').text();
        langObj.UI.confirmText = xml.find('confirmText').text();
        langObj.UI.label_rewind = xml.find('label_rewind').text();
        langObj.UI.label_play = xml.find('label_play').text();
        langObj.UI.label_pause = xml.find('label_pause').text();
        langObj.UI.label_mute = xml.find('label_mute').text();
        langObj.UI.label_unMute = xml.find('label_unMute').text();
        langObj.UI.label_stop = xml.find('label_stop').text();
        langObj.UI.lable_subtitles_enable = xml.find('lable_subtitles_enable').text();
        langObj.UI.lable_subtitles_disable = xml.find('lable_subtitles_disable').text();
        langObj.UI.label_downloadTranscript = xml.find('label_downloadTranscript').text();

        langObj.UI.title_endOfMod = xml.find('title_endOfMod').text();
        langObj.UI.text_endOfMod = xml.find('text_endOfMod').text();

        // Post Assessment
        langObj.UI.postTitle = xml.find('label_postAssessTitle').text();
        langObj.UI.lable_courseComplete = xml.find('lable_courseComplete').text();

        langObj.UI.lable_start = xml.find('lable_start').text();
        langObj.UI.lable_startCourse = xml.find('lable_startCourse').text();
        langObj.UI.postExitText = xml.find('label_postExitText').text();
        langObj.UI.review = xml.find('label_review').text();
        langObj.UI.reviewLearning = xml.find('label_reviewLearning').text();
        langObj.UI.retryQuiz = xml.find('label_retryQuiz').text();
        langObj.UI.rewatchModule = xml.find('label_rewatchModule').text();
        langObj.UI.advice = xml.find('label_advice').text();
        langObj.UI.wellDone = xml.find('label_wellDone').text();

        langObj.UI.welDoneText = HShell.utils.decodeHtml(xml.find('welDone_Text[normal="true"]').text());
        langObj.UI.welDoneTextPreAllCorrect = HShell.utils.decodeHtml(xml.find('welDone_Text[allCorrectPre="true"]').text());
        langObj.UI.wellDoneTextNoPostAssess = HShell.utils.decodeHtml(xml.find('welDone_Text[noPostAssessment="true"]').text());

        langObj.UI.postAssessmentWellDone = xml.find('label_postAssessment_wellDone').text();
        langObj.UI.postAssessmentWellDoneText = HShell.utils.decodeHtml(xml.find('postAssessment_welDone_Text[normal="true"]').text());
        langObj.UI.postAssessmentWellDoneTextPreAllCorrect = HShell.utils.decodeHtml(xml.find('postAssessment_welDone_Text[allCorrectPre="true"]').text());
        langObj.UI.postAssessmentWellDoneTextNoPostAssess = HShell.utils.decodeHtml(xml.find('postAssessment_welDone_Text[noPostAssessment="true"]').text());

        langObj.UI.confirm = xml.find('label_confirm').text();
        langObj.UI.home = xml.find('label_home').text();
        langObj.UI.homePage = xml.find('access_homePage').text();
        langObj.UI.exit = xml.find('label_exit').text();
        langObj.UI.quizPassed = xml.find('label_quizPassed').text();
        langObj.UI.quizPassedText = xml.find('quizPassedText').text();
        langObj.UI.quizNotPassed = xml.find('label_quizNotPassed').text();
        langObj.UI.quizNotPassedText = xml.find('quizNotPassedText').text();

        langObj.UI.didNotPass = xml.find('label_didNotPass').text();
        langObj.UI.modules = xml.find('label_module').text();

        langObj.UI.finText = xml.find('finText').text();

        langObj.UI.surveyTitle = xml.find('label_surveyTitle').text();
        langObj.UI.finalSurveyTitle = xml.find('label_finalSurveyTitle').text();

        langObj.UI.goToConfirmation = xml.find('label_goToConfirmation').text();
        langObj.UI.confirmationDescription = xml.find('label_confirmationDescription').text();

        // Modules Content
        langObj.modulesGroupArray = new Array();              /* Array contains 'modulesArray' (that contains) ->  objects 'moduleObj' generated by the function 'newModuleObject'	*/
        langObj.contentXML = new Object();
        langObj.UIXML = xml;

        langObj.UI.savingProgress = xml.find('text_savingProgress').text();

        return langObj;
    };

    HShell.languageObjPostgModeSpesificTexts = function (xml, langObj) {
        if (HShell.contentSetup.postAssessmentMode == 'serial') {
            langObj.UI.courseComplete_Text = xml.find('courseComplete_Text[wrongPreAssessmentItems="true"][mode="' + HShell.contentSetup.postAssessmentMode + '"]').text();
            langObj.UI.courseComplete_TextNew = xml.find('courseComplete_Text[newToCompany="true"][mode="' + HShell.contentSetup.postAssessmentMode + '"]').text();
        } else {
            langObj.UI.courseComplete_Text = xml.find('courseComplete_Text[mode="' + HShell.contentSetup.postAssessmentMode + '"]').text();
        }
        langObj.UI.courseComplete_ButtonPosition = xml.find('courseComplete_ButtonPositionAccess').text();

        langObj.UI.startPostAssessment = xml.find('label_startPostAssessment[mode="' + HShell.contentSetup.postAssessmentMode + '"]').text();
        langObj.UI.postAssessmentDone = xml.find('label_postAssessmentDone[mode="' + HShell.contentSetup.postAssessmentMode + '"]').text();
    };

    HShell.reloadUiXml = function (roleName) {
        var xmlsToLoad = 0;
        var xmlsLoaded = 0;

        $(HShell.content.languageArray).each(function (i, item) {
            // ---- Prevents the loading of UI overrides for languages that are not part of this role
            var langMatch = false;
            $(HShell.content.selected_roleObj.langagesCode).each(function (k, item2) {
                if (item.UI.code == item2) {
                    langMatch = true;
                    return false;
                }
            });

            if (langMatch) {
                var code = item.UI.code;

                xmlsToLoad++;
                HShell.xml.readFromXml('content/0.roles/UI_override/' + code + '/UI_' + roleName + '.xml', function (xml, idInLanguageArray) {
                    xmlsLoaded++;
                    var newLangObj = HShell.newObjects.newLanguageObject($(xml), idInLanguageArray);
                    var original = HShell.content.languageArray[idInLanguageArray];

                    for (var propertyName in newLangObj.UI) {
                        if (newLangObj.UI[propertyName] != '') {
                            original.UI[propertyName] = newLangObj.UI[propertyName];
                        }
                    }

                    // if (xmlsToLoad == xmlsLoaded) {
                    //     changeLanguage();
                    // }
                }, item.idInLanguageArray);
            }
        });
    };

    // --- Misc
    HShell.postAssessScormInteractionsPositionsArray = [];

    // ________________________________________________________
    // ---------------------------------------
    // ________________________________________________________

    /**
     * @todo This section below, must be redone. The place is not correct, nor is the aproach of how this is done.
     */

    /* Checking if user select "Full Course" or "Pre Assessment". */
    HShell.contentSetup.isFullCourse = false;

    /* Checking if current user is a People Manager (default = false). */
    HShell.contentSetup.isPeopleManager = false;

})();

/// <reference path="_references.js" />
// a11y is short hand for accessibility (there are 11 letters between a and y)

var HShell = window.HShell || {};

(function () {
    window.HShell = window.HShell || {};
    HShell.a11y = HShell.a11y || {};

    HShell.a11y.autoSetup = {
        // --- This indicates if the screen reader user have header the message that the start post-assessment button is in the main menu.
        postAssessmentButtonPositionExplained: false
    };

    // ________________________________________________________________________________________________________________________________
    // --- Automatically read the screen title on first load
    //not used
    HShell.a11y.accessCourseTitleRead = function () {
        if (HShell.autoSetup.isFirstScreenLoader) {
            HShell.a11y.speak(HShell.content.selected_languageObj.UI.course_title);
            HShell.autoSetup.isFirstScreenLoader = false;
        }
    };

    // ________________________________________________________________________________________________________________________________
    // --- Force accessibility speech

    HShell.a11y.speak = function (text, isPolite, elementForFocus) {
        var element = $('#forced_speech_container');

        if (isPolite) {
            setTimeout(function () {
                toggleAccessibilitySpeech();
            }, 1);
        } else {
            toggleAccessibilitySpeech();
        }

        function toggleAccessibilitySpeech() {
            if (!elementForFocus) {
                if (element.hasClass('hidden')) {
                    element.removeClass('hidden');
                }

                element.html(text);
            } else {
                elementForFocus.focus();
            }

            setTimeout(function () {
                element.addClass('hidden');
            }, 500);
        }
    };

    // Text that has been force spoken by the screen reader left in this element and can be accessed again unnecessarily.
    // Use this method to manually clear the force speech el content.
    HShell.a11y.clearSpeakEl = function () {
        var element = $('#forced_speech_container');
        setTimeout(function () {
            element.html('');
            element.addClass('hidden');
        }, 1);
    }

    HShell.a11y.focusOn = function (element, containerForFirstFocusableSelector) {
        if (HShell.autoSetup.runOn.OS === 'iOS') {
            HShell.a11y.speak($(element).text());
            if (elementHasNodes(element)) {
                getFirstFocusableElement(containerForFirstFocusableSelector)
                    .focus();
            } else {
                $(element).attr('tabindex', -1).focus();
            }
        } else if (HShell.autoSetup.runOn.OS === 'windowsPhone') {
            HShell.a11y.speak($(element).text());
            $(element).attr('tabindex', -1).focus();
        } else {
            $(element).attr('tabindex', -1).focus();
        }
    };

    function elementHasNodes(element) {
        return $(element).contents().filter(function () { return this.nodeType === 1; }).length > 0;
    }

    function getFirstFocusableElement(container) {
        container = container || 'SCORM_Container';
        return $(container + ' :focusable:first');
    }
})();

/// <reference path="_references.js" />

var HShell = window.HShell || {};
HShell.qaMode = {};

// ------------------------------

(function(){
    var QAMacroTimer = 100,
        qaTStart = false,
        clicksDistance = 0,
        qaCourseOverview = {},
        saveQaMenuStatus = false;

    if (localStorage) {
        if (localStorage.getItem('qaMenuOn') === 'true') {
            saveQaMenuStatus = true;
        }
    }

    if(localStorage.darkMode === 'true'){
        $(document.body).addClass('darkMode');
    }

    HShell.qaMode.init = function(){
        if (HShell.globalSetup.devMode || HShell.globalSetup.qaMode) {
            bindEventListeners();

            if (HShell.content && HShell.content.selected_languageObj && HShell.content.selected_languageObj.UI) {
                document.title = HShell.content.selected_languageObj.UI.course_title;
            }
            if (HShell.globalSetup.qaMode) {
                var html = '<div class="HShellQaModeContaniner" aria-hidden="true"	style="display:none">';
                html += '<div class="HShellQaModeTitle">QA Menu</div>';
                html += '<div class="HShellQAModeMenuContainer">';
                html += '<div class="HShellQAModeMenuTop">QA Tools</div>';
                html += '<div class="HShellQAModeMenuBottom">';
                html += '<div class="QAModeMenuBottOneSection">';
                html += '<div class="QAModeMenuBottOneChbox">';
                html += '<div class="QAMChLable">dev mode</div>';
                html += '<div class="QAMChButton oval active" data-linkedValue="HShell.globalSetup.devMode" data-inactiveValue="off">on</div>';
                html += '</div>';
                html += '<div class="QAModeMenuBottOneChbox">';
                html += '<div class="QAMChLable">demo mode</div>';
                html += '<div class="QAMChButton oval active" data-linkedValue="HShell.globalSetup.demoMode" data-inactiveValue="off">on</div>';
                html += '</div>';
                if (localStorage) {
                    html += '<div class="QAModeMenuBottOneChbox">';
                    html += '<div class="QAMChLable">QA menu on start</div>';
                    html += '<div class="QAMChButton oval active" data-linkedValue="saveQaMenuStatus" data-inactiveValue="off">on</div>';
                    html += '</div>';
                }
                html += '</div>';
                html += '<div class="qaModId modVideo rel"></div>';
                html += '<div class="QAModeMenuBottOneSection modVideo">';
                html += '<div class="QAModeOneButton oval" data-uniclick="finishCurrentVideo">Finish video </div>';
                html += '<div class="QAModeOneButtonHint rel"> you can use also (ctrl + alt + z) </div>';
                html += '</div>';
                if (selectVideoPlayerMethod() == 0) {
                    html += '<div class="QAModeMenuBottOneSection modVideo">';
                    html += '<div class="QAModeOneButton oval" data-uniclick="HShell.autoSetup.activeVideo.flashVideo.vid_forward">Forward video (next key-frame)</div>';
                    html += '</div>';
                } else {
                    html += '<div class="QAModeMenuBottOneSection modVideo">';
                    html += '<div class="QAModeOneButton oval" data-uniclick="forwardHTMlVideo">Forward video (+5s)</div>';
                    html += '<div class="QAModeOneButtonHint rel">"shift for +10s" or "ctrl for +2s" </div>';
                    html += '</div>';
                }
                html += '<div class="QAModeMenuBottOneSection modVideo rel" id="qaModuleInteractionPointsContainer"></div>';

                html += '<div class="QAModeMenuBottOneSection homePassAll">';
                html += '<div class="QAModeOneButton oval" data-uniclick="onFinishAllModulesClicked">Finish all modules</div>';
                html += '</div>';
                html += '<div class="QAModeMenuBottOneSection devOptions">';
                html += '<div class="QAModeOneButton oval" data-uniclick="toggleBrowserversion">Show Browser Version</div>';
                html += '</div>';
                if ((HShell.autoSetup.runOn.OS == 'iOS' && HShell.autoSetup.runOn.deviceName != 'ipad') || HShell.autoSetup.runOn.OS == 'android' || HShell.autoSetup.runOn.OS == 'windowsPhone') {
                    html += '<div class="QAModeMenuBottOneSection ">';
                    html += '<div class="QAModeOneButton oval" data-uniclick="onToggleQaModeClicked">Show/Hide QAmode Label</div>';
                    html += '</div>';
                }
                html += '<div class="QAModeMenuBottOneSection" id="qaOneQuCorrectBTN" >' +
                            '<div class="QAModeOneButton oval correct" data-uniclick="onOneQuestionAnsweredCorrect">One question CORRECT</div>' +
                            '<div class="QAModeOneButton oval wrong" data-uniclick="onOneQuestionAnsweredWrong">One question WRONG</div>' +
                        '</div>' +

                        '<div class="QAModeMenuBottOneSection" id="qaOneQuAllCorrectBTN" >' +
                            '<div class="QAModeOneButton oval correct" data-uniclick="onAnswerAllQuerstionsCorrect">All questions CORRECT</div>' +
                            '<div class="QAModeOneButton oval wrong" data-uniclick="onAnswerAllQuestionsWrong">All questions WRONG</div>' +
                        '</div>' +

                        '<div class="QAModeMenuBottOneSection" id="qaOneQuAllRandomBTN" >' +
                            '<div class="QAModeOneButton oval" data-uniclick="onAnswerAllQuestionsRandom">All questions RANDOM</div>' +
                        '</div>' +

                        '<div class="QAModeMenuBottOneSection" >' +
                            '<div class="QAModeOneButton oval" id="qaDarkMode" data-uniclick="QAToggleDarkMode">' + (localStorage.darkMode ? 'Light mode' : 'Dark mode') + '</div>' +
                        '</div>' +

                        '<div class="QAMChLable rel">' +
                            '<div class="rel">Brand: ' + HShell.config.brandName + '</div>'+
                            '<br>' +
                            '<div class="rel">Course: ' + courseCode + '</div>'+
                            '<br>';

                var videoPlayerMethod = '';
                switch (selectVideoPlayerMethod()) {
                    case 0:
                        videoPlayerMethod = 'Flash Player';
                        break;
                    case 1:
                        videoPlayerMethod = 'Blob + HTML5 Video';
                        break;
                    case 2:
                        videoPlayerMethod = 'HTML5 Video';
                        break;
                }

                html += '<div class="rel">Video Player Method: ' + videoPlayerMethod + '</div>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
                html += '<div class="HShellVersionLog" style="display:none;">';
                html += '<div class="HShellVersionLogTop">v' + HShell.globalSetup.HShellVersion + '</div>';
                html += '<div class="HShellVersionLogBottom"></div>';
                html += '</div>';
                html += '<div class="HShellConsole"  style="display:none;">';
                html += '<div class="HShellConsoleTop">Developers</div>';
                html += '<div class="justWrapper">';
                html += '<div class="QAModeMenuBottOneSection" id="showAllIcons">';
                html += '<div class="QAModeOneButton oval" data-uniclick="onSeeAllIconsClicked">See list of all icons</div>';		// the function itself is inside 0.imagePreload.js
                html += '<div class="QAModeOneButton oval" data-uniclick="refreshAllCSS">Reload all CSS - Ctrl + Alt + 0</div>';					// the function itself is inside 0.imagePreload.js
                html += '</div>';

                html += '<div class="QAModeMenuBottOneSection" id="qaShowCourseOverview">';
                html += '<div class="QAModeOneButton oval" data-uniclick="buildCourseOverview">Course overview (Beta)</div>';
                html += '</div>';

                html += '<div class="QAModeMenuBottOneSection">';
                html += '<div class="QAModeOneButton oval" id="toggleActiveElementButton" data-uniclick="toggleActiveElementInterval">Start Logging Focused Element - Ctrl + Alt + Q</div>';
                html += '</div>';

                html += '<div class="HShellConsoleBottom">';
                html += '<div style="margin-bottom:10px;">Console</div>';
                html += '<textarea id="consoleTextArea"></textarea>';
                html += '<div id="consoleTextDisplay"></div>'
                html += '<div class="QAModeMenuBottOneSection" id="executeConsoleBtn" >';
                html += '<div class="QAModeOneButton oval" data-uniclick="onConsoleSubmit">SUBMIT</div>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
                html += '</div>';

                $('body').append(html);
                $('.HShellQaModeContaniner [data-uniclick]').click(function(e){
                    eval(this.dataset.uniclick).call(this, e);
                });

                $('.QAMChButton').click(function () {
                    $(this).toggleClass('active');
                    var tempParam = $(this).attr('data-linkedValue');
                    var tempBool = $(this).hasClass('active');

                    switch (tempParam) {
                        case 'HShell.globalSetup.devMode': HShell.globalSetup.devMode = tempBool; break;
                        case 'HShell.globalSetup.demoMode': HShell.globalSetup.demoMode = tempBool; break;
                        case 'saveQaMenuStatus':
                            saveQaMenuStatus = tempBool;
                            if (localStorage) {
                                localStorage.setItem('qaMenuOn', tempBool);
                            }
                            break;
                    }

                    var tempLable = $(this).text();
                    $(this).text($(this).attr('data-inactiveValue'));
                    $(this).attr('data-inactiveValue', tempLable);
                });

                if (!HShell.globalSetup.devMode) $('.QAMChButton[data-linkedValue="HShell.globalSetup.devMode"]').click();
                if (!HShell.globalSetup.demoMode) $('.QAMChButton[data-linkedValue="HShell.globalSetup.demoMode"]').click();
                if (!saveQaMenuStatus) $('.QAMChButton[data-linkedValue="saveQaMenuStatus"]').click();


                if (HShell.autoSetup.runOn.deviceType == 'desktop') {
                    $('.HShellQaModeContaniner .HShellQaModeTitle').click(function () {
                        $(this).parent().toggleClass('active');

                    });
                }

                if (saveQaMenuStatus) { $('.HShellQaModeContaniner .HShellQaModeTitle').click(); }		// --- Restores the state of the QA menu

                if (HShell.autoSetup.runOn.deviceType != 'desktop') {
                    window.setInterval(function () {
                        if (qaTStart) {
                            clicksDistance += 100;
                            if (clicksDistance >= 1000) {
                                $('.HShellQaModeContaniner .HShellQaModeTitle').parent().toggleClass('active');
                                clicksDistance = 0;
                                qaTStart = false;
                            }
                        }
                    }, 100);

                    $('body').bind('touchstart', function () { qaTStart = true; clicksDistance = 0; });
                    $('body').bind('mousedown', function () { qaTStart = true; clicksDistance = 0; });
                    $('body').bind('touchend ', function () { qaTStart = false; clicksDistance = 0; });
                    $('body').bind('mouseup ', function () { qaTStart = false; clicksDistance = 0; });
                    $('body').bind('touchmove', function () { qaTStart = false; clicksDistance = 0; });
                }

                $('.HShellVersionLogTop, .HShellQAModeMenuTop, .HShellConsoleTop').click(function () { $(this).toggleClass('active').next().slideToggle(); });


                $('#consoleTextArea').keydown(function (e) {
                    if (e.keyCode == 13 && e.which == 13 && !e.shiftKey) {
                        e.preventDefault();
                        $('#executeConsoleBtn > div').click();
                    }
                });
                HShell.xml.readFromXml('versionLog.XML', addVersionLogDetailes);
            }
        }
    };

    HShell.qaMode.log = function (data, clear){
        if(clear){
            document.getElementById('consoleTextDisplay').innerText = '';
        }

        document.getElementById('consoleTextDisplay').innerText += data;
    };

    function bindEventListeners(){
        HShell.core.$on('VideoModuleOppened', videoModuleOppened);
        HShell.core.$on('VideoModuleClosed', videoModuleClosed);
        HShell.core.$on('VideoIsLoaded', qaVideoAddInteractions);
        HShell.core.$on('locationChange', onLocationChange);
    }

    function onSeeAllIconsClicked(){
        generateAllIcons();
    }

    function onFinishAllModulesClicked(){
        finishAllItems();
        $(this).parent().hide().removeClass('homePassAll');
    }

    function onToggleQaModeClicked(){
        $('.HShellQaModeTitle').toggle();
    }

    function onOneQuestionAnsweredCorrect(){
        QAAnswerOneQuestion('correct');
    }

    function onOneQuestionAnsweredWrong(){
        QAAnswerOneQuestion('wrong');
    }

    function onAnswerAllQuerstionsCorrect(){
        QAAnswerAllQuestion('correct');
    }

    function onAnswerAllQuestionsWrong(){
        QAAnswerAllQuestion('wrong');
    }

    function onAnswerAllQuestionsRandom(){
        QAAnswerAllQuestion('random');
    }

    function onConsoleSubmit(){
        eval( $('#consoleTextArea').val() );
    }

    function addVersionLogDetailes(xml) {
        $(xml).find('oneVersion').each(function () {
            if ($(this).attr('version') == HShell.globalSetup.HShellVersion) {
                $('.HShellVersionLogBottom').html($(this).text());
            }
        });
    }

    function toggleBrowserversion(event) {
        var thisItem = event.target;

        $(thisItem).toggleClass('active');
        if ($(thisItem).hasClass('active')) {
            showBrowserInfo($('.HShellQAModeMenuContainer'));
            $(thisItem).text('Hide Browser Version');
        } else {
            $('#browserInfo').remove();
            $(thisItem).text('Show Browser Version');
        }
    }

    function toggleActiveElementInterval() {
        $(this).toggleClass('active');

        if ($(this).hasClass('active')) {
            $(this).text($(this).text().replace('Start', 'Stop'));
            clearInterval(this.activeElementInterval);
            this.activeElementInterval = setInterval(function () {
                console.log(document.activeElement);
            }, 1000);
        } else {
            $(this).text($(this).text().replace('Stop', 'Start'));
            clearInterval(this.activeElementInterval);
        }
    }

    function videoModuleOppened() {
        $('.HShellQaModeContaniner .modVideo').show();
        $('.qaModId.modVideo').text('Module ID = ' + $('#moduleVideoContainer').attr('data-moduleID'));
    }

    function videoModuleClosed() {
        $('.HShellQaModeContaniner .modVideo').hide();
        $('#qaModuleInteractionPointsContainer').empty().removeClass('visible');
        homeOpened();
    }

    function qaVideoAddInteractions() {
        if (HShell.autoSetup.activeVideo.interactionPoints) {
            if (HShell.autoSetup.activeVideo.interactionPoints.length) {

                var html = '<div id="qaIntPointTitle" class="rel">Interaction points (' + HShell.autoSetup.activeVideo.interactionPoints.length + ')</div>';
                html += '<div id="qaInPointTimeline"></div>';

                $('#qaModuleInteractionPointsContainer').append(html).show().addClass('visible');
                var leftOfsset = HShell.autoSetup.activeVideo.videoLenght;

                $(HShell.autoSetup.activeVideo.interactionPoints).each(function (i, item) {
                    var html = '';
                    html += '<div class="qaIntPointContainer" style="left:' + ((Number($(item).attr('pointStart')) / leftOfsset) * 100) + '%">';
                    html += '<div class="qaIntPointArrow rel"></div>';
                    html += '<div class="qaIntPointNumber rel">' + (i + 1) + '</div>';
                    html += '<div class="qaIntPointTime rel">' + $(item).attr('pointStart') + '</div>';
                    html += '</div>';

                    $('#qaModuleInteractionPointsContainer').append(html);
                });
                $('.qaIntPointContainer').click(function () {
                    if (HShell.autoSetup.activeVideo.htmlVideo) HShell.autoSetup.activeVideo.htmlVideo.currentTime = Number($(this).find('.qaIntPointTime').text()) - 1;

                });
            }
        }
    }

    HShell.qaMode.videoAddSeekPointsToIP = function() {
        $('#qaModuleInteractionPointsContainer').empty().append('<div id="qaIpSeekPoints" class="abs"></div>')
            .append('<div id="qaIpPlayHead"	  class="abs"></div>');
        $(HShell.autoSetup.activeVideo.seekPoints).each(function (i, item) {
            var html = '';
            html += '<div class="qaIpSp abs" style="left:' + ((item.time / HShell.autoSetup.activeVideo.videoLenght) * 100) + '%" data-seekPointNumber="' + i + '">';
            html += '<div class="abs qaIpSpLine"></div>';
            html += '<div class="abs qaIpSpTime">' + item.time + '</div>';
            html += '</div>';

            $('#qaIpSeekPoints').append(html);
        });

        $('.qaIpSp').click(function () {
            var seekPointNum = Number($(this).attr('data-seekPointNumber'));
            HShell.autoSetup.activeVideo.flashVideo.vid_forwardTo(seekPointNum);
            $('.vidPopPlayBtn.paused').first().click();
        });
    };

    HShell.qaMode.playHeadMove = function() {
        $('#qaIpPlayHead').css('left', ((HShell.autoSetup.activeVideo.videoCurrentPosition / HShell.autoSetup.activeVideo.videoLenght) * 100) + '%');
    };

    function onLocationChange(payload){
        if(payload.newLocation === HShell.consts.locations.moduleSelect){
            homeOpened();
        } else{
            switch (payload.newLocation){
                case HShell.consts.locations.intro:
                    introductionStart();
                    break;
            }

            homeHidden();
        }
    }

    function homeOpened() {
        $('.HShellQaModeContaniner .homePassAll').show();
    }

    function homeHidden() {
        $('.HShellQaModeContaniner .homePassAll').hide();
    }

    function introductionStart() {
        var eventListener,
            html = '';

        html =  '<div class="QAModeMenuBottOneSection" id="QAModeMenuSkipIntro" >' +
                    '<div class="QAModeOneButton oval">Skip introduction</div>' +
                '</div>';

        $('.HShellQAModeMenuContainer .HShellQAModeMenuBottom').append(html);

        $('#QAModeMenuSkipIntro').click(function () {
            skipIntroduction();
        });

        eventListener = HShell.core.$on('locationChange', function(){
            introductionClose(eventListener);
        });
    }

    function introductionClose(eventListener) {
        $('#QAModeMenuSkipIntro').remove();
        HShell.core.$off(eventListener);
    }

    HShell.qaMode.assessmentStart = function() {
        $('#qaOneQuCorrectBTN, #qaOneQuAllCorrectBTN, #qaOneQuAllRandomBTN').show();
    };

    HShell.qaMode.assessmentEnd = function () {
        $('#qaOneQuCorrectBTN, #qaOneQuAllCorrectBTN, #qaOneQuAllRandomBTN').hide();
    };

    function QAAnswerOneQuestion(type) {
        if (type == 'correct') type = 'trueText';
        if (type == 'wrong') type = 'falseText';
        if (type == 'random') {
            if (Math.random() > 0.5) {
                type = 'trueText';
            } else {
                type = 'falseText';
            }
        }

        $('.oneAnswer:visible').each(function () {
            if ($(this).find('.preAnswerTrueFalseIndicator > div').attr('data-languageitem') == type) {
                $(this).find('.radioReskin, .checkBoxReskin').click();
            }
        });


        setTimeout(function () {
            $('#submitQuizReskin').click();
            setTimeout(function () {
                $('#submitQuizReskin').click();
                setTimeout(function () {
                    $('#submitQuizReskin').click();
                }, QAMacroTimer);
            }, QAMacroTimer);
        }, QAMacroTimer);
    }

    function QAAnswerAllQuestion(type) {
        var itemsPassed = 0;
        $('.questionContainer').each(function () {
            setTimeout(function () {
                QAAnswerOneQuestion(type);
            }, (itemsPassed * QAMacroTimer * 15) + QAMacroTimer);
            itemsPassed++;
        });
    }

    function QAToggleDarkMode() {
        var hasDarkMode = !$(document.body).hasClass('darkMode');

        $(document.body).toggleClass('darkMode');

        if (hasDarkMode) {
            $('#qaDarkMode').text('Light mode');
        } else {
            $('#qaDarkMode').text('Dark mode');
        }

        localStorage.darkMode = hasDarkMode;
    }

    function finishAllItems() {
        if (HShell.globalSetup.devMode || HShell.globalSetup.qaMode) {
            $('.ModList__Item').each(function () {
                HShell.content.selectModuleAsFinished($(this).attr('moduleid'));
            });
            HShell.checkForPostAssessment();
        }
    }

    function finishCurrentVideo() {
        if (HShell.autoSetup.activeVideo.flashVideo) {
            HShell.autoSetup.activeVideo.flashVideo.vid_finishVideo();
        } else {
            $('.vidPopStopBtn').click();
            var tempVid = document.getElementsByTagName('video')[0];
            tempVid.currentTime = tempVid.duration;

            HShell.autoSetup.activeVideoState = 'finished';
            if ($('body').hasClass('iOS')) { try { $('.uniPlayHtml').get(0).webkitExitFullscreen(); } catch (e) { } }
            $('.vidPopClose').removeClass('inactive');
        }
    }

    function generateAllIcons() {
        var html = '';

        html += '<div id="devShowIconsContainer">';
        html += '<div id="devShowIconsContainerTitle">HShell.consts.iconsObj</div>';
        for (var prop in HShell.consts.iconsObj) {
            if (HShell.consts.iconsObj.hasOwnProperty(prop)) {
                html += '<div class="oneIconItem rel">';
                html += '<div class="oneIcon">' + HShell.consts.iconsObj[prop] + '</div>';
                html += '<div class="oneIconText">' + prop + '</div>';
                html += '</div>';
            }
        }
        html += '<div id="iconsPopUpClose" class="rel">Close</div>';
        html += '</div>';

        $('body').append(html);

        $('#iconsPopUpClose').click(function () { $('#devShowIconsContainer').remove(); });
    }

    function showBrowserInfo (target) {
        if (String(target) == 'undefined') {
            $('body').append('<div id="browserInfo" class="active"></div>');
        } else {
            $('<div id="browserInfo"></div>').insertAfter(target);
        }

        $('#browserInfo').append('<b>OS:</b> ' + HShell.autoSetup.runOn.OS);
        $('#browserInfo').append('<br/><b>Device Type:</b> ' + HShell.autoSetup.runOn.deviceType);
        $('#browserInfo').append('<br/><b>Form Factor:</b> ' + HShell.autoSetup.runOn.formFactor);
        $('#browserInfo').append('<br/><b>Device Name:</b> ' + HShell.autoSetup.runOn.deviceName);
        $('#browserInfo').append('<br/><b>Browser Name:</b> ' + HShell.autoSetup.runOn.browserName);
        $('#browserInfo').append('<br/><b>Browser Version:</b> ' + HShell.autoSetup.runOn.version);
    }

    // ________________________________________________________________________________________________________________________________
    // --- This is inside the video player
    function forwardHTMlVideo(e) {
        var time = 5;		// in seconds
        if (e.shiftKey) time = 10;
        if (e.ctrlKey) time = 2;
        HShell.autoSetup.activeVideo.htmlVideo.currentTime += time;
    }

    // ---------------------------------------------------------------------
    // ---------------		Course overview
    // ---------------------------------------------------------------------

    function buildCourseOverview() {
        var qaIconSettings = '<svg fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>';
        var qaIconLanguages = '<svg fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/></svg>';
        var qaIconRoles = '<svg fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
        var qaIconAssessement = '<svg fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/></svg>';
        var qaIconModules = '<svg fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
        var html = '';
        html += '<div id="qaCourseOverviewContainer">';
        html += buildOneQaCOSection('qaCOgeneralContainer', qaIconSettings, 'General');
        html += buildOneQaCOSection('qaCOLanguageContainer', qaIconLanguages, 'Language');
        html += buildOneQaCOSection('qaCORolesContainer', qaIconRoles, 'Role');
        html += buildOneQaCOSection('qaCOpreContainer', qaIconAssessement, 'Pre-A');
        html += buildOneQaCOSection('qaCOmodulesContainer', qaIconModules, 'Modules');
        html += buildOneQaCOSection('qaCOpostContainer', qaIconAssessement, 'Post-A');
        html += '</div>';

        $('#qaCourseOverviewContainer').remove();
        $('body').append(html);

        $('#qaCOgeneralContainer').addClass('active');
        $('.qaCOClickArea').click(function () { $('.qaCOOneSectionContainer').removeClass('active'); $(this).getParent('.qaCOOneSectionContainer').addClass('active'); });

        function buildOneQaCOSection(id, icon, title) {
            var html = '';
            html += '<div class="qaCOOneSectionContainer rel" id="' + id + '">';
            html += '<div class="qaCOMenuItem rel">';
            html += '<div class="qaCOMenuIcon rel">' + icon + '</div>';
            html += '<div class="qaCOMenuText rel">' + title + '</div>';
            html += '<div class="qaCOClickArea abs"></div>';
            html += '</div>';
            html += '<div class="qaCOOneInnerContainer rel">';
            html += '</div>';
            html += '</div>';

            return html;
        }


        // ---------------		Languages
        $('#qaCOLanguageContainer .qaCOMenuItem').append('<div id="qaCOLanguageIndicator"></div>');
        html = '';
        html += '<div class="qaCOLabel rel" id="qaCOLanguagesLabel"></div>';
        html += '<div class="qaCOContentConainer">';
        html += '<div id="qaCOLanguageContainerInner" class="rel qaCOConentInnerContainer">';

        // --- Content Icons
        var languagesCount = 0;
        $(HShell.content.languageArray).each(function (i, item) {
            languagesCount++;
            html += '<div class="qaCOoneLanguage available rel" data-id="' + i + '">';
            html += '<img src="' + 'content/' + item.UI.folder + '/img/' + item.UI.imgUrlBig + '"/>';
            html += '<div class="qaCOOneLangageText rel">' + item.UI.label_text + '</div>';
            html += '</div>';

            $('#qaCOLanguageIndicator').append('<img data-id="' + i + '" src="' + 'content/' + item.UI.folder + '/img/' + item.UI.imgUrlBig + '"	/>');		// --- Icons in the menu
        });

        html += '</div>';
        html += '</div>';
        $();
        $('#qaCOLanguageContainer .qaCOOneInnerContainer').append(html);
        $('#qaCOLanguagesLabel').text('Languages: (' + languagesCount + ')');


        $('.qaCOoneLanguage, #qaCOLanguageIndicator img').click(function (e) {
            e.stopPropagation();
            var i = Number($(this).attr('data-id'));
            qaCourseOverview.selectedLanguage = HShell.content.languageArray[i];
            $('.qaCOoneLanguage').removeClass('active');
            $('.qaCOoneLanguage[data-id="' + i + '"]').addClass('active');

            $('#qaCOLanguageIndicator img').removeClass('active');
            $('#qaCOLanguageIndicator img[data-id="' + i + '"]').addClass('active');

            // ---- Disable unused roles

            $('.qaCOoneRole').addClass('available').each(function () {
                if ($(this).attr('data-languages').indexOf(qaCourseOverview.selectedLanguage.UI.code) == -1) {
                    $(this).removeClass('available');
                    if ($(this).hasClass('active')) {
                        $('.qaCOoneRole.available').first().click();
                    }
                }
            });

            // ---- Disable unused modules

            filterModules();

        });


        // ---------------		Roles
        $('#qaCORolesContainer .qaCOMenuItem').append('<div id="qaCORolesIndicator"></div>');
        html = '';
        html += '<div class="qaCOLabel rel" id="qaCORolesLabel"></div>';
        html += '<div class="qaCOContentConainer">';
        html += '<div id="qaCORolesContainerInner" class="qaCOConentInnerContainer rel">';

        var rolesCount = 0;
        $(HShell.content.settingsXML).find('role').each(function () {
            if ($(this).attr('justSkipPreAssessment') != 'true') {
                rolesCount++;
                var languages = new Array();
                $(this).find('label_text').each(function () {
                    languages.push($(this).attr('language'));
                });
                var code = $(this).attr('code');
                var attributes = 'class="qaCOoneRole available rel" data-languages="' + String(languages) + '" data-code="' + code + '"';

                html += '<div ' + attributes + '>';
                html += '<img src="content/' + $(this).find('imgUrlMassive').text() + '"	/>';
                html += '<div class="qaCOOneLangageText rel">' + $(this).find('label_text').first().text() + '</div>';
                html += '</div>';

                $('#qaCORolesIndicator').append('<img src="content/' + $(this).find('imgUrlMassive').text() + '" ' + attributes + '/>');
            }
        });

        html += '</div>';
        html += '</div>';

        $('#qaCORolesContainer .qaCOOneInnerContainer').append(html);
        $('#qaCORolesLabel').text('Roles: (' + rolesCount + ')');

        $('.qaCOoneRole').click(function (e) {
            e.stopPropagation();
            var code = $(this).attr('data-code');
            $(HShell.content.roleArray).each(function (i, item) {
                if (item.code === code) {
                    qaCourseOverview.selectedRole = item;
                }
            });

            $('.qaCOoneRole').removeClass('active');
            $('.qaCOoneRole[data-code="' + code + '"]').addClass('active');

            $('#qaCORolesIndicator img').removeClass('active');
            $('#qaCORolesIndicator img[data-code="' + code + '"]').addClass('active');

            filterModules();
        });


        // ---------------		Modules
        $('#qaCOmodulesContainer .qaCOMenuItem').append('<div id="qaCOModulesIndicator"></div>');
        html = '';
        html += '<div class="qaCOLabel rel" id="qaCOModulesLabel"></div>';
        html += '<div class="qaCOContentConainer">';
        html += '<div id="qaCOModulesContainerInner" class="qaCOConentInnerContainer rel">';

        $(HShell.content.languageArray).each(function (i, language) {
            var xml = $(language.contentXML);
            xml.find('oneModule').each(function (k, module) {
                html += '<div class="qaCOOneModule rel" data-language="' + language.UI.code + '" data-moduleId="' + $(module).attr('id') + '">';
                html += '<img class="qaCOModuleImage rel" src="content/' + language.UI.code + '/' + $(module).find('thumbnailURL').text() + '"/>';
                html += '<div class="qaCOOneModuleName	rel" >' + $(module).find('title').text() + '</div>';
                html += '<div class="qaCOOneModuleId	rel" >ID: ' + $(module).attr('id') + '</div>';
                html += '<div class="qaCOOneModuleType	rel" >' + $(module).find('type').text() + '</div>';
                html += '</div>';
            });
        });

        html += '</div>';
        html += '</div>';

        $('#qaCOmodulesContainer .qaCOOneInnerContainer').append(html);
        $('#qaCOModulesLabel').text('Modules: (' + 1 + ')');

        function filterModules() {
            $('.qaCOOneModule').hide().removeClass('available');
            $('.qaCOOneModule[data-language="' + qaCourseOverview.selectedLanguage.UI.code + '"]').addClass('available');

            if (qaCourseOverview.selectedRole) {
                var tempArr = qaCourseOverview.selectedRole.modules_list.split(',');
                $('.qaCOOneModule.available').each(function (i, item) {
                    if (tempArr.indexOf($(item).attr('data-moduleId')) == -1) $(item).removeClass('available');
                });
            }

            $('#qaCOModulesIndicator').empty();
            $('.qaCOOneModule.available').each(function () {
                $(this).show();
                $('#qaCOModulesIndicator').append('<img src="' + $(this).find('img').attr('src') + '" />');
            });
            $('#qaCOModulesLabel').text('Modules: (' + $('.qaCOOneModule.available').length + ')');
        }

        $('.qaCOoneLanguage').first().click();
        $('.qaCOoneRole').first().click();



        // ---------------		Pre-assessment


    }
})();

/// <reference path="_references.js" />

var HShell = window.HShell || {};

// ________________________________________________________________________________________________________________________________
// *********************************
// --- Interaction Points Controller
// *********************************
var InteractionPointsController = function interactionPointsControllerF() {
    var validTypes = ['singleanswer', 'multipleanswer', 'discoveritems', 'spotthebribe', 'informative', 'videofeedback'];

    // stores ipType to the variable type. Returns true if successful, and false otherwise
    function isTypeValid(ipType) {
        ipType = ipType.toLowerCase();
        return validTypes.indexOf(ipType) !== -1;
    }

    // stores ipType to the variable type. Returns true if successful, and false otherwise
    function executeInteractionPoint(interactionPointAttributeType, dataXml) {
        switch (interactionPointAttributeType) {
            case 'singleanswer':
                interactionPoint_singleAnswer(dataXml);
                break;
            case 'multipleanswer':
                interactionPoint_multipleAnswer(dataXml);
                break;
            case 'discoveritems':
                interactionPoint_discoverItems(dataXml);
                break;
            case 'spotthebribe':
                interactionPoint_spotTheBribe(dataXml);
                break;
            case 'informative':
                interactionPoint_informative(dataXml);
                break;
            case 'videofeedback':
                interactionPoint_videoFeedback(dataXml);
                break;
            default:
                HShell.utils.trace('No or invalid interaction point type loaded. Run loadType(ipType) first', '15.interactionPoints -> interactionPointsController');
        }
    }

    return {
        isTypeValid: isTypeValid,
        executeInteractionPoint: executeInteractionPoint
    };
};

// ________________________________________________________________________________________________________________________________
// ****************************
// --- Interaction Points Types
// ****************************

// ------------ Common things between different interaction points types
// ------------ Not all of the functions are used in all of the interaction point types
// ------------ This function is abstract - it standalone does not create IP. Use specific function for the specific type of IP
function InteractionPointsCommon() {
    // --- Build Wrapper
    this.buildWrapper = function (interactionPointAttributeType) {
        // Append div#interactionPointContainer on top of the video area. It's placeholder for the interactionPoint adding "type" and "layout" as classes.
        var html = '<div id="interactionPointContainer" class="type-' + interactionPointAttributeType + '" ></div>';
        $('#moduleVideoContainer .vidPopVideoContainer').append(html);
    };

    // --- Build Question
    this.buildQuestion = function (dataXml, position) {
        position = position || 'rel';
        var html = '';
        html += '<div id="interactionPoint_question_outer" class="hideAfterSubmit ' + position + '">';
        html += '<div class="title">' + $(dataXml).children('question').children('question_title').text() + '</div>';
        html += '<div class="text">' + $(dataXml).children('question').children('text').text() + '</div>';
        html += '</div>';

        return html;
    };

    // --- Build Feedback
    this.buildFeedback = function (dataXml) {
        var html = '';

        // --- Each answer can have its own feedback
        $(dataXml).find('feedback').each(function () {
            var type = $(this).attr('answerType').toLowerCase(),
                bkgImage = '';
            if ($(this).attr('backgroundImage') !== '') {
                bkgImage = 'content/' + HShell.userData.selected_language + '/' + $(this).attr('backgroundImage');
            }

            html += '<div class="feedback abs interactionPoint_feedback_outer ' + type + '" for="' + $(this).attr('for') +
                '" data-backgroundImage="' + bkgImage + '">';
            html += '<div class="feedbackTextContainer" style="min-height:calc(' + HShell.autoSetup.fullFrameHeight + 'vh - 290px)">';
            html += '<div class="title">' + $(this).find('feedback_title').text() + '</div>';
            html += '<p class="text">' + $(this).find('text').text() + '</p>';
            html += '</div>';
            html += '<div role="button" tabindex="0" class="continueButton interactionButton noSelect"><span>' + SL.UI.label_continue + '</span></div>';
            html += '</div>';
        });

        return html;
    };
    this.buildDiscoveryFeedback = function (dataXml) {
        var html = '';

        html += '<div class="discoveryFeedback abs">';
        html += '<div class="feedbackTextContainer" style="min-height:calc(' + HShell.autoSetup.fullFrameHeight + 'vh - 290px)">';
        html += '<div class="title">' + $(dataXml).children('feedbackContainer').children('feedbackContainer_title').text() + '</div>';
        $(dataXml).find('feedback').each(function () {
            html += '<p class="text">' + $(this).find('text').text() + '</p>';
        });
        html += '</div>';
        html += '<a href="javascript://" class="continueButton interactionButton"><span>' + SL.UI.label_continue + '</span></a>';
        html += '</div>';

        return html;
    };

    // --- Build Answers Container
    this.buildAnswersContainer = function (dataXml, buildOneAnswerFunc) {
        var html = '';
        html += '<ul id="interactionPoint_answers_selectors" class="hideAfterSubmit rel">';
        var totalAnswers = $(dataXml).find('answer').length;
        $(dataXml).find('answer').each(function (index) {
            var indicator = $(this).attr('indicator') ? $(this).attr('indicator') : index + 1;
            var image = $(this).attr('image') ? 'url(content/' + HShell.userData.selected_language + '/' + $(this).attr('image') + ')' : 'none';

            html += '<li class="rel" indicator="' + $(this).attr('indicator') + '">';
            html += buildOneAnswerFunc.call(this, indicator, image, index + 1, totalAnswers); // index + 1, totalAnswers are needed for discovery accessibility other does not need this
            html += '</li>';
        });
        html += '</ul>';
        return html;
    };
    // --- Click one Answer
    this.onAnswerClick = function (customFunc) {
        // --- Used for the Desktop version. The point is that we have very different UI for desktop and mobile and thenks to the code below, we do not have to dublicate containers
        $('#interactionPoint_answers_selectors li').uniClick(function () {
            customFunc.call(this);

            $(this).find('.answerText').each(function () {
                var offset = $(this).parent().offset().left - $(this).parent().parent().offset().left;
                $(this).css('left', (-offset + 5) + 'px');
            });
        });

        $('#interactionPoint_answers_selectors li input').focus(function () { $('#interactionPoint_answers_selectors li').removeClass('focused'); $(this).parent().addClass('focused'); });
        $('#interactionPoint_answers_selectors li input').on('blur', function () { $(this).parent().removeClass('focused'); });
    };

    // there will be such function in 11.clientSpecific or 13.courseSpecific when there is smth specific for the client/course
    //
    if (HShell.courseSpecific.loadInteractionPointsCommon) {
        HShell.courseSpecific.loadInteractionPointsCommon.apply(this, arguments);
    }
}

// ________________________________________________________
// ------------ Single Answer Template
// ________________________________________________________
function interactionPoint_singleAnswer(dataXml) {
    var iPCommon = new InteractionPointsCommon();
    iPCommon.buildWrapper.call(this, 'singleanswer');

    var html = '';
    html += '<div id="interactionPoint_question_container" class="rel" style="background-image:url(content/' + HShell.userData.selected_language + '/' + $(dataXml).attr('backgroundImage') + ')">';
    html += iPCommon.buildQuestion(dataXml);
    html += iPCommon.buildAnswersContainer.call(this, dataXml, buildOneAnswer);
    html += '</div>';
    html += '<div role="button" tabindex="0" aria-disabled="true" class="submitButton interactionButton disabled noSelect"><span>' + SL.UI.label_Submit + '</span></div>';
    html += '<div id="interactionPoint_feedbacks_container" class="abs">';
    if (typeof iPCommon.buildFeedbackSingleAnswer == 'function') {  // there can be buildFeedbackSingleAnswer in 13.courseSpecific for example
        html += iPCommon.buildFeedbackSingleAnswer(dataXml);
    } else {
        html += iPCommon.buildFeedback(dataXml);
    }
    html += '</div>';

    $('#interactionPointContainer').append(html);

    HShell.a11y.focusOn('#interactionPoint_question_outer > .text');

    function buildOneAnswer(indicator, image) {
        var html = '';
        html += '<input name="interaction" type="radio" aria-label="' + $(this).children('text').text() + '">';
        html += '<a href="javascript://" tabindex="-1" aria-hidden="true">';
        html += '<div class="indicator abs"><table class="abs"><tr><td><span>' + indicator + '</span></td></tr></table></div>';
        html += '<div class="image abs" style="background-image:' + image + '"></div>';
        html += '</a>';
        html += '<div class="answerText" aria-hidden="true">';
        html += '<div class="title">' + $(this).children('answer_title').text() + '</div>';     //answer_title is tag in xml
        html += '<div class="text">' + $(this).children('text').text() + '</div>';
        html += '</div>';

        return html;
    }

    iPCommon.onAnswerClick(function () {
        $('.interactionButton.submitButton')
            .removeClass('disabled')
            .attr('tabindex', 0)
            .attr('aria-hidden', false)
            .attr('aria-disabled', false);

        $('#interactionPoint_answers_selectors li').removeClass('selected');
        $(this).addClass('selected').find('input')[0].checked = true;
        $(this).find('input').focus();
    });

    // --- Arange all the snqwer items for Desktop in window resize
    $(window).on('resize', function () { $('#interactionPoint_answers_selectors li.selected').click(); });

    $('.interactionButton.submitButton').uniClick(function () {
        if (!$(this).hasClass('disabled')) {
            $('.interactionPoint_feedback_outer').hide();
            var indicator = $('#interactionPoint_answers_selectors li.selected').attr('indicator');
            var currentFeedbackImage = $('.interactionPoint_feedback_outer[for*="' + indicator + '"]').attr('data-backgroundImage');
            if (currentFeedbackImage.indexOf('undefined') === -1 && currentFeedbackImage !== '') {
                $('#interactionPoint_feedbacks_container').css('background-image', 'url(' + currentFeedbackImage + ')');
            } else {
                $('#interactionPoint_feedbacks_container').css('background-image', 'none');
            }

            var feedbackToShow = $('.interactionPoint_feedback_outer[for*="' + indicator + '"]');
            if (feedbackToShow.length == 0) {
                feedbackToShow = $('.interactionPoint_feedback_outer[for="Default"]');
            }

            feedbackToShow.show();

            $('#interactionPoint_feedbacks_container').show();

            $(this).hide();

            $('#interactionPointContainer').scrollTop(0)
                .find('.hideAfterSubmit').hide();

            $('.continueButton').show();

            HShell.a11y.focusOn($(feedbackToShow).find('.feedbackTextContainer .text'));

            //iphone hiding element for VO, because it can be focused
            $(this).attr('aria-hidden', 'true');
        }
    });

    $('.interactionButton.continueButton').uniClick(interactionPointDestroyAndResume);

    if (HShell.courseSpecific.load_interactionPoint_singleAnswer) {
        HShell.courseSpecific.load_interactionPoint_singleAnswer.apply(this, arguments);
    }
}

// ________________________________________________________
// ------------ Discover Items Template
// ________________________________________________________
function interactionPoint_discoverItems(dataXml) {
    var iPCommon = new InteractionPointsCommon();
    iPCommon.buildWrapper.call(this, 'discoveritems');

    var html = '';
    html += '<div id="interactionPoint_question_container" class="rel" style="background-image:url(content/' + HShell.userData.selected_language + '/' + $(dataXml).attr('backgroundImage') + ')">';
    html += iPCommon.buildQuestion(dataXml);
    html += iPCommon.buildAnswersContainer.call(this, dataXml, buildOneAnswer);
    html += '</div>';
    html += '<div role="button" tabindex="0" aria-disabled="true" class="interactionButton continue disabled"><span>' + SL.UI.label_continue + '</span></div>';

    if ($(dataXml).find('feedbackContainer').length === 1) {
        html += iPCommon.buildDiscoveryFeedback(dataXml);
    }

    $('#interactionPointContainer').append(html);

    HShell.a11y.focusOn('#interactionPoint_question_outer > .text');

    $('#interactionPoint_answers_selectors li > .itemWrapper').focus(function () {
        $('#interactionPoint_answers_selectors li').removeClass('focused');
        $(this).parent().addClass('focused');
    });

    $('#interactionPoint_answers_selectors li > .itemWrapper').on('blur', function () {
        $(this).parent().removeClass('focused');
    });

    if ($(dataXml).find('feedbackContainer').length === 1) {
        $('#interactionPointContainer').addClass('withFeedback');
    }

    function buildOneAnswer(indicator, image, index, totalItems) {
        var html = '';

        if (index == 1) {
            html += '<div class="itemWrapper" role="button" tabindex="0" aria-disabled="false" aria-label="Item ' + index + ' out of ' + totalItems + '. ' + $(this).children('answer_title').text() + '. Not completed">';
        } else {
            html += '<div class="itemWrapper" role="button" tabindex="-1" aria-disabled="true" aria-label="Item ' + index + ' out of ' + totalItems + '. ' + $(this).children('answer_title').text() + '. Not completed">';
        }
        html += '<div class="indicator"><table><tr><td><span>' + indicator + '</span></td></tr></table></div>';
        html += '<div class="image abs" style="background-image:' + image + '"></div>';
        html += '<div class="tick"></div>';
        html += '</div>';
        html += '<div class="answerText" aria-hidden="true">';
        html += '<div class="title">' + $(this).children('answer_title').text() + '</div>';
        html += '<div class="text">' + $(this).children('text').text() + '</div>';
        html += '</div>';
        html += '<div class="text onlyForMobile">' + $(this).children('text').text() + '</div>';

        return html;
    }

    iPCommon.onAnswerClick(function () {
        $(this).addClass('completed');

        var currentAriaLabelText = $(this).children('.itemWrapper[role="button"]').attr('aria-label');
        var indexOfNotCompletedText = currentAriaLabelText.lastIndexOf('Not completed');
        if (indexOfNotCompletedText !== -1) {
            var newAriaLabelText = currentAriaLabelText.substr(0, indexOfNotCompletedText) + 'Completed';
            $(this).children('.itemWrapper[role="button"]').attr('aria-label', newAriaLabelText);
        }

        if ($('#interactionPoint_answers_selectors .completed').length === $('#interactionPoint_answers_selectors li').length) {
            $('.interactionButton.continue')
                .removeClass('disabled')
                .attr('tabindex', 0)
                .attr('aria-hidden', false)
                .attr('aria-disabled', false);
        }

        $('#interactionPoint_answers_selectors li').removeClass('selected');
        $(this).addClass('selected');

        $(this).next().children('.itemWrapper[role="button"]')
            .attr('tabindex', 0)
            .attr('aria-disabled', false);

        HShell.a11y.speak($(this).find('.answerText > .text').text() + '. You can proceed to the next item.');
    });

    // --- Arange all the snqwer items for Desktop in window resize
    $(window).on('resize', function () { $('#interactionPoint_answers_selectors li.selected').click(); });

    $('.interactionButton.continue').uniClick(function () {
        if ($(this).hasClass('disabled')) {
            return false;
        }

        if ($(dataXml).find('feedbackContainer').length === 1) {
            $('.discoveryFeedback').show();
            $('.interactionButton.continueButton').uniClick(interactionPointDestroyAndResume);
            $(this).hide();

            $('#interactionPointContainer').scrollTop(0)
                .find('.hideAfterSubmit').hide();
        } else {
            interactionPointDestroyAndResume();
        }
    });

    if (typeof window.loadCourseSpecific_interactionPoint_discoverItems == 'function') {
        window.loadCourseSpecific_interactionPoint_discoverItems.apply(this, arguments);
    }
}

// ________________________________________________________
// ------------ Multiple Answer	Template
// ________________________________________________________
function interactionPoint_multipleAnswer(dataXml) {
    var iPCommon = new InteractionPointsCommon();
    iPCommon.buildWrapper.call(this, 'multipleanswer');

    var html = '';
    html += '<div id="interactionPoint_question_container" class="rel" style="background-image:url(content/' + HShell.userData.selected_language + '/' + $(dataXml).attr('backgroundImage') + ')">';
    html += iPCommon.buildQuestion(dataXml);
    html += iPCommon.buildAnswersContainer.call(this, dataXml, buildOneAnswer);
    html += '</div>';
    html += '<div role="button" tabindex="0" aria-disabled="true" class="submitButton interactionButton disabled"><span>' + SL.UI.label_Submit + '</span></div>';
    if (typeof iPCommon.buildFeedbackMultipleAnswer == 'function') {  // there can be buildFeedbackMultipleAnswer in 13.courseSpecific for example
        html += iPCommon.buildFeedbackMultipleAnswer(dataXml);
    } else {
        html += iPCommon.buildFeedback(dataXml);
    }

    $('#interactionPointContainer').append(html);

    HShell.a11y.focusOn('#interactionPoint_question_outer > .text');

    function buildOneAnswer(indicator, image) {
        var html = '';
        html += '<input name="interaction" type="checkbox" aria-label="' + $(this).children('text').text() + '">';
        html += '<div tabindex="-1" aria-hidden="true" class="itemWrapper">';
        html += '<div class="indicator abs"><table class="abs"><tr><td><span>' + indicator + '</span></td></tr></table></div>';
        html += '<div class="image abs" style="background-image:' + image + '"></div>';
        html += '<div class="tick"></div>';
        html += '</div>';
        html += '<div class="answerText" aria-hidden="true">';
        html += '<div class="title">' + $(this).children('answer_title').text() + '</div>';
        html += '<div class="text">' + $(this).children('text').text() + '</div>';
        html += '</div>';

        return html;
    }

    iPCommon.onAnswerClick(function () {
        $('.interactionButton.submitButton')
            .removeClass('disabled')
            .attr('tabindex', 0)
            .attr('aria-hidden', false)
            .attr('aria-disabled', false);

        $('#interactionPoint_answers_selectors li').removeClass('showText');
        $(this).addClass('showText');

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected')
                .find('input')[0].checked = false;
        } else {
            $(this).addClass('selected')
                .find('input')[0].checked = true;
        }

        if ($('#interactionPoint_answers_selectors .selected').length == 0) {
            $('.interactionButton.submitButton')
                .addClass('disabled')
                .attr('tabindex', -1)
                .attr('aria-hidden', true)
                .attr('aria-disabled', true);
        }
    });

    // --- Arange all the snqwer items for Desktop in window resize
    $(window).on('resize', function () { $('#interactionPoint_answers_selectors li.selected').click(); });

    $('.interactionButton.submitButton').uniClick(function () {
        if (!$(this).hasClass('disabled')) {
            var allIndicators = '';

            $('#interactionPoint_answers_selectors li.selected').each(function (i, item) {      // --- append all indicators in a string and then look for feedback for EXACTLY those indicators
                var indicator = $(item).attr('indicator');
                allIndicators += indicator + ',';
            });
            allIndicators = allIndicators.substring(0, allIndicators.lastIndexOf(','));

            var feedbackWithIndicator = $('.interactionPoint_feedback_outer[for="' + allIndicators + '"]');
            if (feedbackWithIndicator.length > 0) {
                feedbackWithIndicator.show();

                HShell.a11y.focusOn($(feedbackWithIndicator).find('.feedbackTextContainer > .text'));

                if (!feedbackWithIndicator.hasClass('wrong')) {
                    $('#interactionPointContainer').addClass('continueEnabled').scrollTop(0).find('.hideAfterSubmit').hide();
                }
            } else {
                $('.interactionPoint_feedback_outer.wrong[for="Default"]').show();
                HShell.a11y.focusOn($('.interactionPoint_feedback_outer[for="Default"] .feedbackTextContainer > .text'));

                if (!$('.interactionPoint_feedback_outer.wrong[for="Default"]').hasClass('wrong')) {
                    $('#interactionPointContainer').addClass('continueEnabled').scrollTop(0).find('.hideAfterSubmit').hide();
                }
            }

            $(this).attr('aria-hidden', 'true').hide();

            if (!feedbackWithIndicator.hasClass('wrong')) {
                $('#interactionPointContainer').addClass('continueEnabled').scrollTop(0).find('.hideAfterSubmit').hide();
            }
        }
    });

    $('.interactionButton.continueButton').uniClick(interactionPointDestroyAndResume);

    if (HShell.courseSpecific.load_interactionPoint_multipleAnswer) {
       HShell.courseSpecific.load_interactionPoint_multipleAnswer.apply(this, arguments);
    }
}

// ________________________________________________________
// ------------ Spot The Bribe Template
// ________________________________________________________
function interactionPoint_spotTheBribe(dataXml) {
    var iPCommon = new InteractionPointsCommon();
    iPCommon.buildWrapper.call(this, 'spotthebribe');

    var html = '';
    html += '<div id="interactionPoint_question_container" class="rel" style="background-image:url(content/' + HShell.userData.selected_language + '/' + $(dataXml).attr('backgroundImage') + ')">';
    html += iPCommon.buildQuestion(dataXml, 'abs');
    html += buildItems(dataXml);
    html += buildItemsQuestion(dataXml);
    html += '<div role="button" tabindex="0" aria-disabled="true" href="javascript://" class="interactionButton continue disabled noSelect"><span>' +
        SL.UI.label_continue + '</span></div>';
    html += '</div>';

    html += '<div id="interactionPoint_feedbacks_container" class="rel" >';
    html += buildFeedbacks(dataXml);
    html += '</div>';

    $('#interactionPointContainer').append(html);

    //the technic with forced_speech_container is used on iphone
    //the text element should have tabindex -1 in order to be focusable with js, and not focusable with tab
    //we can control the focus, BUT when there is a <br> or any other tag inside, we cannot, because voiceOver treats the tag like separate elements
    if (HShell.autoSetup.runOn.OS === 'iOS') {
        setTimeout(function () {
            HShell.a11y.speak($('#interactionPoint_question_outer > .title').text() + ' ' + $('#interactionPoint_question_outer > .text').text());
        }, 1000);
    } else {
        $('#interactionPoint_question_container .text').focus();
    }

    if (HShell.autoSetup.runOn.formFactor == 'tablet') {
        $('.itemImgTablet').show();
    } else {
        $('.itemImgTablet').hide();
    }

    attachOnFocusOnAllItems();
    attachOnClickOnAllItems();
    attachOnClickOnQuestionAnswers();

    $('.closeIPFeedbackButton').uniClick(feedbackCloseButtonHandler);
    $('.closeIPFeedbackButtonMobile').uniClick(feedbackCloseButtonHandler);

    $('.interactionButton.continue').uniClick(function () {
        if ($('.interactionButton.continue').hasClass('disabled')) {
            return;
        } else {
            interactionPointDestroyAndResume();
        }
    });

    // ---
    function attachOnFocusOnAllItems() {
        $('#interactionPoint_answers_selectors li .itemButton').on('focus mouseenter', function () {
            var randomNumberString = '';
            if (HShell.autoSetup.runOn.browserName == 'safari' && HShell.autoSetup.runOn.formFactor == 'desktop') {
                randomNumberString = '?' + Math.round(Math.random() * Math.pow(10, 4)); // we need this random number because safari is somehow caching the gif and not playing it the second time it's hovered
            }

            if (!$(this).parents('li:first').hasClass('passed')) {
                $(this).find('.itemImg').attr('src', $(this).find('.itemImg').attr('onhoversrc') + randomNumberString);
            }
        });

        $('#interactionPoint_answers_selectors li .itemButton').on('blur mouseleave', function () {
            $(this).find('.itemImg').attr('src', $(this).find('.itemImg').attr('originalsrc'));
        });
    }

    function attachOnClickOnAllItems() {
        $('#interactionPoint_answers_selectors li .itemButton').each(function (index, item) {
            $(item).uniClick(function () {
                var indicator = $(item).parents('li:first').attr('indicator');
                $('#interactionPoint_question_container').scrollTop(0);
                $('.itemQuestionContainer, .itemQuestionContainerBackground').hide();
                $('.itemQuestionContainerBackground, .itemQuestionContainer[indicator=' + indicator + ']')
                    .show()
                    .css('opacity', 0)
                    .animate({ opacity: 1 }, {
                        queue: false,
                        duration: 400 // ms
                    });

                $('.itemQuestionContainer[indicator=' + indicator + ']').parents('#interactionPoint_question_container').addClass('itemQuestionActive');
                $('.interactionPoint_feedback_outer').hide();
                $('.interactionPoint_feedback_outer[for=' + indicator + ']').addClass('active').show();

                $('#interactionPoint_answers_selectors li .itemButton').attr('aria-hidden', 'true').attr('tabindex', '-1');
                $('#interactionPoint_question_outer, .interactionPoint_answers_container, .interactionButton.continue').attr('aria-hidden', 'true');

                if (!$(item).attr('aria-label').endsWith('Completed.')) {
                    $(item).attr('aria-label', $(item).attr('aria-label') + ' Completed.');
                }
                $('.questionButton').attr('tabindex', '0').attr('aria-hidden', 'false');
                $('.yesButton').focus();


                if (HShell.autoSetup.runOn.OS === 'iOS') {
                    setTimeout(function () {
                        HShell.a11y.speak($('.itemQuestionContainer[indicator=' + indicator + ']').find('.itemQuestionText').text());
                    }, 1000);
                } else {
                    $('.itemQuestionContainer[indicator=' + indicator + ']').find('.itemQuestionText').focus();
                }
            });
        });
    }

    function attachOnClickOnQuestionAnswers() {
        $('.questionButton').each(function (index, item) {
            $(item).uniClick(function () {

                if (HShell.autoSetup.runOn.formFactor == 'phone' ||
                    $(window).innerWidth() < (HShell.branding.width - 1)) {  // just for easier testing of mobile version on desktop. If it's more than the DTWidth, it's considered desktop version (known from index media queries)
                    $('#interactionPoint_question_container').hide();
                    $('#interactionPoint_feedbacks_container').show();
                    $('.itemQuestionContainer, .itemQuestionContainerBackground').hide();
                } else {
                    $('#interactionPoint_feedbacks_container').show();//.slideDown();
                    $('.interactionPoint_feedback_outer').css('opacity', 0);
                    $('.feedbackTextContainer').css('opacity', 0).css('top', '60px');
                    $('.closeIPFeedbackButton').css('opacity', 0).css('bottom', '-55px');

                    $('.itemQuestionContainer, .itemQuestionContainerBackground')
                        .css('opacity', 1)
                        .animate({ opacity: 0 }, {
                            queue: false, duration: 400
                        });

                    $('#interactionPoint_question_container')
                        .css('opacity', 1)
                        .slideUp(800, function () {
                            $('.itemQuestionContainer, .itemQuestionContainerBackground').hide();
                        }).animate({ opacity: 0 }, {
                            queue: false, duration: 600
                        });

                    $('.interactionPoint_feedback_outer').animate(
                        { opacity: 1 },
                        {
                            queue: false,
                            duration: 600 // ms
                        }
                    );

                    setTimeout(function () {
                        $('.feedbackTextContainer').animate({ top: '0px', opacity: 1 }, { duration: 600 });

                        $('.closeIPFeedbackButton').animate(
                            { bottom: '-25px', opacity: 1 },
                            {
                                duration: 600, // ms
                                complete: function () {
                                    $('.interactionPoint_feedback_outer.active .closeIPFeedbackButton')
                                        .attr('tabindex', '0')
                                        .attr('aria-disabled', 'false')
                                        .focus();
                                }
                            });
                    }, 600);
                }

                setTimeout(function () {
                    HShell.a11y.speak($('.interactionPoint_feedback_outer.active > .feedbackTextContainer p').text());
                }, 1200);

                $('#interactionPoint_question_container').removeClass('itemQuestionActive');
            });
        });
    }

    function feedbackCloseButtonHandler() {
        var indicator = $(this).parents('div.interactionPoint_feedback_outer').attr('for');
        $('.interactionPoint_feedback_outer.active').removeClass('notPassed').addClass('passed');
        $('#interactionPoint_answers_selectors li[indicator=' + indicator + ']').off('mouseenter mouseleave').addClass('passed');
        if ($('.interactionPoint_feedback_outer.notPassed').length == 0) {
            $('.interactionButton.continue.disabled').removeClass('disabled').attr('aria-disabled', 'false').attr('tabindex', '0');
        }
        if (HShell.autoSetup.runOn.formFactor == 'phone' ||
            $(window).innerWidth() < (HShell.branding.width - 1)) {  // just for easier testing of mobile version on desktop. If it's more than DTWidth, it's considered desktop version(known from index media queries)
            $('#interactionPoint_question_container').show();
            $('#interactionPoint_feedbacks_container').hide();
            $('.interactionPoint_feedback_outer').removeClass('active');
        } else {
            $('.feedbackTextContainer').css('opacity', 1).css('top', 0);
            $('#interactionPoint_question_container').css('opacity', 0);

            $('.feedbackTextContainer').animate(
                { top: '60px', opacity: 0 },
                {
                    duration: 600
                }); //ms

            setTimeout(function () {
                $('#interactionPoint_question_container').css('opacity', 0).slideDown(800).animate(
                    { opacity: 1 },
                    {
                        queue: false,
                        duration: 600, //ms
                        complete: function () {
                            $('#interactionPoint_question_container').animate(
                                { opacity: 1 },
                                {
                                    duration: 600, //ms
                                    complete: function () {
                                        if (!$('.interactionButton.continue').hasClass('disabled')) {
                                            $('.interactionButton.continue').focus();
                                        }
                                    }
                                });
                        }
                    });
                $('#interactionPoint_feedbacks_container').hide();
                $('.interactionPoint_feedback_outer').removeClass('active');
            }, 500);
        }

        $('#interactionPoint_answers_selectors li .itemButton').attr('tabindex', '0').attr('aria-hidden', 'false');
        $('#interactionPoint_question_outer, .interactionPoint_answers_container, .interactionButton.continue').attr('aria-hidden', 'false');
    }

    function buildItems(dataXml) {
        var html = '';
        html += '<div class="interactionPoint_answers_container">';
        html += '<ul id="interactionPoint_answers_selectors" class="hideAfterSubmit rel">';

        $(dataXml).find('item').each(function (index, item) {
            var tabletImageUrl =
                $(item).attr('staticImage').substr(0, $(item).attr('staticImage').lastIndexOf('.png')) + '_outline.png';

            var currentElement = '';
            var currentElementStaticImage = 'content/' + HShell.userData.selected_language + '/' + $(item).attr('staticImage'),
                currentElementAnimation = 'content/' + HShell.userData.selected_language + '/' + $(item).attr('animation'),
                currentElementTabletImage = 'content/' + HShell.userData.selected_language + '/' + $(item).attr('staticOutlinedImage'),
                currentElementTickPositionX = 0,
                currentElementTickPositionY = 0;
            var totalItems = $(dataXml).find('item').length;

            if (typeof $(item).attr('tickPosition') != 'undefined') {
                var currentElementTickPosition = $(item).attr('tickPosition').split(',');
                currentElementTickPositionX = currentElementTickPosition[0] || 0,
                currentElementTickPositionY = currentElementTickPosition[1] || 0;
            }

            currentElement += '<div class="tick"></div>';
            currentElement += '<div role="button" class="itemButton" tabindex="0" aria-label="Item ' + (index + 1) + ' out of ' + totalItems + '.">';
            currentElement += '<div class="image abs">';
            currentElement += '<img class="itemImg" src="' + currentElementStaticImage + '" onhoversrc="' + currentElementAnimation + '" originalsrc="' + currentElementStaticImage + '"/>';
            //currentElement += '<img class="itemImgTablet" src="' + currentElementTabletImage + '" style="position:absolute;" />';
            currentElement += '<img class="itemTick" src="css/images_coreUI/interactionPoints/spotTheBribe-itemTick.png" style="position:absolute;left:' +
                currentElementTickPositionX + 'px;top:' + currentElementTickPositionY + 'px;">';
            currentElement += '</div>';
            currentElement += '</div>';

            var currentElementPosition = $(item).attr('position').split(','),
                currentElementPositionX = currentElementPosition[0],
                currentElementPositionY = currentElementPosition[1];
            html += '<li class="rel" style="position: absolute; left:' + currentElementPositionX +
                'px; top:' + currentElementPositionY + 'px; background-image: url(content/' + HShell.userData.selected_language + '/' + $(this).find('item_question').attr('image') + ')" indicator="' + $(this).attr('indicator') + '">';
            html += currentElement;
            html += '</li>';
        });
        html += '</ul>';
        html += '</div>';
        return html;
    }

    function buildItemsQuestion(dataXml) {
        var html = '';

        // --- Each answer can have its own feedback
        $(dataXml).find('item').each(function (index, item) {
            var currentItemQuestion = $(item).find('item_question');
            var currentQuestionImg = 'content/' + HShell.userData.selected_language + '/' + $(currentItemQuestion).attr('image');

            html += '<div class="itemQuestionContainer rel" indicator="' + $(item).attr('indicator') + '">';
            html += '<img class="itemQuestionImage" aria-hidden="true" src="' + currentQuestionImg + '" />';
            html += '<div class="itemQuestionText"><p>' + $(currentItemQuestion).text() + '</p></div>';
            html += '<div role="button" tabindex="-1" aria-hidden="true" class="questionButton yesButton"><span>' + SL.UI.label_Yes + '</span></div>';
            html += '<div role="button" tabindex="-1" aria-hidden="true" class="questionButton noButton"><span>' + SL.UI.label_No + '</span></div>';
            html += '</div>';
        });

        html += '<div class="itemQuestionContainerBackground"></div>';
        return html;
    }

    function buildFeedbacks(dataXml) {
        var html = '';

        $(dataXml).find('feedback').each(function (index, item) {
            var indicator = $(item).attr('for'),
                currentFeedbackImg = 'content/' + HShell.userData.selected_language + '/' +
                    $(item).parents('point').find('item[indicator=' + indicator + ']').find('item_question').attr('image');

            html += '<div class="feedback abs interactionPoint_feedback_outer notPassed" for="' + indicator +
                '" style="background-image:url(content/' + HShell.userData.selected_language + '/' + $(item).attr('backgroundImage') + ')">';
            html += '<img class="feedbackImage" src="' + currentFeedbackImg + '" aria-hidden="true"/>';
            html += '<div class="feedbackTextContainer">';
            if ($(item).find('feedback_title').text().trim() != '') {
                html += '<div class="title">' + $(item).find('feedback_title').text() + '</div>';
            }
            html += '<p>' + $(item).find('text').text() + '</p>';
            html += '<div role="button" class="closeIPFeedbackButton" tabindex="0" aria-label="' + SL.UI.close + '.">';
            html += '<span class="closeIPFeedbackButtonX">' + HShell.consts.iconsObj.icon_Close + '</span>';
            html += '<div class="closeIPFeedbackButtonCircle">' + HShell.consts.iconsObj.icon_circle + '</div>';
            html += '</div>';
            html += '</div>';
            html += '<span role="button" class="closeIPFeedbackButtonMobile" tabindex="0">' + SL.UI.close + '</span>';
            html += '</div>';
        });

        return html;
    }

    if (typeof window.loadCourseSpecific_interactionPoint_discoverItems == 'function') {
        window.loadCourseSpecific_interactionPoint_discoverItems.apply(this, arguments);
    }
}

// ________________________________________________________
// ------------ Informative Template
// ________________________________________________________
function interactionPoint_informative(dataXml) {
    var iPCommon = new InteractionPointsCommon();
    iPCommon.buildWrapper.call(this, 'informative');

    var html = '';
    html += '<div id="interactionPoint_question_container" class="rel" style="background-image:url(content/' + HShell.userData.selected_language + '/' + $(dataXml).attr('backgroundImage') + ')">';
    html += buildInformationText(dataXml);
    html += '</div>';
    html += '<div role="button" tabindex="0" class="continueButton interactionButton"><span>' + SL.UI.label_continue + '</span></div>';

    if (typeof $(dataXml).attr('audioFile') !== 'undefined' && $(dataXml).attr('audioFile') !== '') {
        var audioUrl = 'content/' + HShell.userData.selected_language + '/' + $(dataXml).attr('audioFile');

        if (selectVideoPlayerMethod() === 0) {
            html +=
                '<object data="js/uniPlayAudio.swf" id="ipAudio" tabindex="-1" width="100" height="100" class="offScreen"' +
                ' classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"  type="application/x-shockwave-flash">';
            html += '<param name="movie" value="js/uniPlayAudio.swf" />';
            html += '<param name="FlashVars" VALUE="audioURL=' + audioUrl + '" />';
            html += '<param name="bgcolor" value="#008800" />';
            html += '</object>';
        } else {
            html += '<audio id="ipAudio" width="100" height="100" class="offScreen" autoplay>';
            html += '<source src="' + audioUrl + '" type="audio/mpeg">';
            html += '</audio>';
        }
    }

    $('#interactionPointContainer').append(html);
    $('.interactionButton.continueButton').focus();

    if (HShell.autoSetup.runOn.OS === 'iOS') {
        setTimeout(function () {
            HShell.a11y.speak($('#interactionPoint_question_outer .text').text());
        }, 1000);

        if ($('#interactionPoint_question_container').height() > $(window).height()) {
            $('#SCORM_Container, #interactionPointContainer').scrollTo(100000);
        }
    }

    var textOnly = $(dataXml).attr('textOnly');
    if (typeof textOnly != 'undefined' && (String(textOnly) == 'true' || Number(textOnly) == '1')) {
        $('#interactionPoint_question_outer, #interactionPointContainer > .interactionButton.continueButton').addClass('textOnly');
    }

    if ($('#ipAudio').length > 0) {
        if (selectVideoPlayerMethod() === 0) {
            setTimeout(function () { // flash audio will not play without timeout (maybe because .swf file is not loaded yet)
                $('#ipAudio')[0].audio_play();

                if (HShell.userData.volume_level === 0) {
                    $('#ipAudio')[0].audio_mute();
                } else {
                    $('#ipAudio')[0].audio_unMute();
                }
            }, 500);
        } else {
            if (HShell.userData.volume_level === 0) {
                $('#ipAudio')[0].muted = true;
            } else {
                $('#ipAudio')[0].muted = false;
            }
        }
    }

    $('.interactionButton.continueButton').uniClick(function () {
        if ($('#ipAudio').length > 0) {
            if (selectVideoPlayerMethod() === 0) {
                $('#ipAudio')[0].audio_stop();
            }
        }

        interactionPointDestroyAndResume();

        if (HShell.autoSetup.runOn.OS === 'iOS') {
            $('#forced_speech_container').attr('aria-hidden', true);
        }
    });

    function buildInformationText(dataXml) {
        var html = '';
        html += '<div id="interactionPoint_question_outer" class="hideAfterSubmit">';
        html += '<div class="title">' + $(dataXml).children('text').children('text_title').text() + '</div>';
        html += '<div class="text">' + $(dataXml).children('text').children('text_content').text().trim() + '</div>';
        html += '</div>';

        return html;
    }
}

// ________________________________________________________
// ------------ Video Feedback Template
// ________________________________________________________
function interactionPoint_videoFeedback(dataXml) {
    var iPCommon = new InteractionPointsCommon();
    iPCommon.buildWrapper.call(this, 'videofeedback');

    var html = '';
    html += '<div id="interactionPoint_question_container" class="rel" style="background-image:url(content/' + HShell.userData.selected_language + '/' + $(dataXml).attr('backgroundImage') + ')">';
    html += iPCommon.buildQuestion(dataXml);
    html += iPCommon.buildAnswersContainer.call(this, dataXml, buildOneAnswer);
    html += '</div>';
    html += '<div class="buttonsContainer">';
    html += '<div class="text">';
    html += '<div>Module Completed.</div>';
    html += '<div>Please click the Home button to continue learning or select a new scenario.</div>';
    html += '</div>';
    html += '<div tabindex="0" role="button" aria-disabled="true" class="interactionButton submit disabled"><span>' + SL.UI.label_Submit + '</span></div>';
    html += '</div>';

    $('#interactionPointContainer').append(html);

    //event-delegation, it wasn't working correctly on IE with direct attaching
    $('#interactionPoint_answers_selectors li').on('focus', 'input', function () {
        $('#interactionPoint_answers_selectors li').removeClass('focused');
        $(this).parent().addClass('focused');
    });

    $('#interactionPoint_answers_selectors li').on('blur', 'input', function () {
        $(this).parent().removeClass('focused');
    });

    //sets an attribute with video url to every answer button
    $(dataXml).find('answer').each(function (index) {
        $('#interactionPoint_answers_selectors li').eq(index).attr('videoUrl', $(this).attr('video'));
    });

    //calculating the height of the buttons container for mobile
    if (HShell.autoSetup.runOn.deviceType == 'mobile' && HShell.autoSetup.runOn.deviceName != 'ipad')
        $('.type-videofeedback .buttonsContainer').css('height', 'calc(100% - ' + $('#interactionPoint_question_container').css('height') + ')');

    function buildOneAnswer(indicator, image, index, totalItems) {
        var html = '';
        html += '<input name="interaction" type="radio" aria-label="Item ' + index +
            ' out of ' + totalItems + '. ' + $(this).children('text').text() + '. Not completed">';
        html += '<a href="javascript://" tabindex="-1" aria-hidden="true">';
        html += '<div class="indicator abs" aria-hidden="true"><table class="abs"><tr><td><span>' + indicator + '</span></td></tr></table></div>';
        html += '<div class="image abs" style="background-image:' + image + '" aria-hidden="true"></div>';
        html += '<div class="tick" aria-hidden="true"></div>';
        html += '</a>';
        html += '<div class="answerText" aria-hidden="true">';
        html += '<div class="title">' + $(this).children('answer_title').text() + '</div>';
        html += '<div class="text">' + $(this).children('text').text() + '</div>';
        html += '<div class="onlyForMobile">' + $(this).children('text').text() + '</div>';
        html += '</div>';

        return html;
    }

    iPCommon.onAnswerClick(function () {
        $('.interactionButton.submit')
            .removeClass('disabled')
            .attr('aria-disabled', false);

        $('#interactionPoint_answers_selectors li').removeClass('selected');
        $(this).addClass('selected');
        $(this).addClass('selected').find('input')[0].checked = true;
        $(this).find('input').focus();
    });

    // --- Arange all the answer items for Desktop in window resize
    $(window).on('resize', function () { $('#interactionPoint_answers_selectors li.selected').click(); });

    HShell.a11y.focusOn('#interactionPoint_question_outer > .text');

    $('.interactionButton.submit').uniClick(function () {
        if ($(this).hasClass('disabled')) {
            return false;
        }

        $('#SCORM_Container, body').scrollTop(0);

        buildVideoFeedback.call(this);
    });

    if (typeof window.loadCourseSpecific_interactionPoint_videoFeedback == 'function') {
        window.loadCourseSpecific_interactionPoint_videoFeedback.apply(this, arguments);
    }

    var buildVideoFeedback = function () {
        var modId = $('#moduleVideoContainer').attr('data-moduleid');

        var videoFeedbackPopUp = new videoPopUp();

        videoFeedbackPopUp.videoURL = 'content/' + HShell.userData.selected_language + '/' + $('li.selected').attr('videourl');
        //subtitle url is the same as the video, but with txt extension
        videoFeedbackPopUp.subtitlesURL = videoFeedbackPopUp.videoURL.replace(/\.[^/.]+$/, '.txt');
        videoFeedbackPopUp.headerTextL = SL.UI.course_title;
        videoFeedbackPopUp.headerTextR = $('.vidPopCourseTutorialLabel').text();
        videoFeedbackPopUp.containerId = 'videoFeedbackContainer';
        videoFeedbackPopUp.isFeedbackVideo = true;
        videoFeedbackPopUp.onReadyState = function () { $('#moduleVideoContainer').hide(); };

        videoFeedbackPopUp.onVideoFinish = function () {
            HShell.autoSetup.activeVideo = HShell.autoSetup.activeVideoArray[0];
            HShell.content.selectModuleAsFinished(modId);
            $('li.selected')
                .addClass('completed');

            $('#moduleVideoContainer').show();

            //resume the main video after the last answer feedback is watched
            if ($('#interactionPoint_answers_selectors .completed').length === $('#interactionPoint_answers_selectors li').length) {
                $('#videoFeedbackContainer').remove();
                $('#moduleVideoContainer .vidPopClose').click();
                return;
            }

            //used for the purple background
            $('.buttonsContainer').addClass('completed');

            var ariaLabelText = $('li.selected input').attr('aria-label');
            var indexOfNotCompletedText = ariaLabelText.lastIndexOf('Not completed');
            if (indexOfNotCompletedText !== -1) {
                var newAriaLabelText = ariaLabelText.substr(0, indexOfNotCompletedText) + 'Completed';
                $('li.selected input').attr('aria-label', newAriaLabelText);
            }

            $('li.selected')
                .removeClass('selected')
                .find('input')[0].checked = false;

            $('.interactionButton.submit').addClass('disabled').attr('aria-disabled', true);

            $('#videoFeedbackContainer').remove();

            //remove the subtitles bar if toggled on while watching the feedback video
            $('.vidPopSubtitlesContainer').addClass('noSubtitles');

            if ($('.oneModuleItemContainer[moduleId="' + modId + '"]').hasClass('contentPassed')) {
                $('#moduleVideoContainer .vidPopClose').removeClass('inactive');
            }

            $('.vidPopClose').focus();
        };

        videoFeedbackPopUp.noExit = false;

        videoFeedbackPopUp.buildPopUp();

        //home button of the video feedback
        $('#videoFeedbackContainer .vidPopClose').uniClick(function () {

            //is main video completed
            if (!$('#moduleVideoContainer .vidPopClose').hasClass('inactive')) {
                HShell.autoSetup.activeVideo = HShell.autoSetup.activeVideoArray[0];
                $('#videoFeedbackContainer').remove();
                $('#moduleVideoContainer .vidPopClose').click();
            } else {
                $('#moduleVideoContainer .vidPopClose').click();

                //this must be executed before the main click event of #videoCloseReskin in 6.modules.js
                setInterval(function () {
                    $('#videoCloseReskin').click(function () {
                        HShell.autoSetup.activeVideo = HShell.autoSetup.activeVideoArray[0];
                        $('#videoFeedbackContainer').remove();
                    });
                }, 300);
            }
        });

        if ($('.oneModuleItemContainer[moduleId="' + modId + '"]').hasClass('contentPassed')) {
            $('#videoFeedbackContainer .vidPopClose').removeClass('inactive');
        }

        if (HShell.autoSetup.runOn.OS === 'iOS') {
            $('.vidPopPlayBtn').focus();
        } 
        // else {
        //     $('.vidPopVideoContainer').focus();
        // }
    };
}

/// <reference path="_references.js" />

var HShell = window.HShell || {};

function initExtranetKeepSessionAlive() {
    var keepSessionAliveCounter = 0;

    setInterval(function () {
        var image = new Image(1, 1).src = '/RefreshSessionState.aspx?Counter=' + ++keepSessionAliveCounter;
    }, 10 * 60000);
}

function extranet_redirectToPage() {
    location.href = '/Certificate.aspx?coursecode=' + HShell.contentSetup.extranetPathTaken;
}

function extranet_reportCompletion() {
    $.ajax({
        type: 'POST',
        url: '/SyncExternalTraining.asmx/UpdateCourseCompletion',
        data: '{ coursecode: "' + HShell.contentSetup.extranetPathTaken + '"}',

        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            console.log(response);
        },
        error: function (error) {
            console.log(error);
        }
    });
}
/// <reference path="_references.js" />
var STAR_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" enable-background="new 0 0 52 52"><path id="Layer" fill-rule="evenodd" class="shp0" d="M35 40C34.8 40 34.7 40 34.5 39.9L26 35.2L17.5 39.9C17.2 40.1 16.7 40.1 16.4 39.8C16.1 39.6 15.9 39.2 16 38.8L17.9 29.3L11.3 22.7C11 22.4 10.9 22 11.1 21.7C11.2 21.3 11.6 21.1 11.9 21L21.3 20.1L25.1 11.6C25.3 11.2 25.6 11 26 11C26.4 11 26.8 11.2 26.9 11.6L30.7 20.1L40.1 21C40.5 21 40.8 21.3 40.9 21.7C41 22.1 40.9 22.5 40.7 22.7L34.1 29.3L36 38.8C36.1 39.2 35.9 39.6 35.6 39.8C35.4 39.9 35.2 40 35 40ZM26 33C26.2 33 26.3 33 26.5 33.1L33.6 37L32 29.2C31.9 28.9 32 28.5 32.3 28.3L37.8 22.8L29.9 22C29.5 22 29.2 21.7 29.1 21.4L26 14.5L22.9 21.4C22.8 21.7 22.4 22 22.1 22L14.2 22.8L19.7 28.3C19.9 28.5 20 28.9 20 29.2L18.4 37.1L25.5 33.2C25.7 33.1 25.8 33 26 33Z" /><path id="Layer" fill-rule="evenodd" class="shp0" d="M26 2C39.3 2 50 12.7 50 26C50 39.3 39.3 50 26 50C12.7 50 2 39.3 2 26C2 12.7 12.7 2 26 2ZM4 26C4 38.1 13.9 48 26 48C38.1 48 48 38.1 48 26C48 13.9 38.1 4 26 4C13.9 4 4 13.9 4 26Z" /></svg>';
var CLOSE_ICON_SVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><path d="M511.728 1023.457c-281.94 0-511.728-229.789-511.728-511.728s229.789-511.728 511.728-511.728 511.728 229.789 511.728 511.728-229.789 511.728-511.728 511.728zM511.728 81.485c-237.394 0-430.243 192.849-430.243 430.243s192.849 430.243 430.243 430.243 430.243-192.849 430.243-430.243-192.849-430.243-430.243-430.243z"></path><path d="M568.205 518.4l181.21-181.21c17.293-17.293 17.293-45.325 0-62.605-17.306-17.293-45.312-17.293-62.605 0l-181.21 181.21-181.21-181.21c-17.293-17.293-45.312-17.293-62.605 0s-17.293 45.325 0 62.605l181.222 181.21-181.222 181.21c-17.293 17.306-17.293 45.325 0 62.605 17.293 17.293 45.325 17.293 62.605 0l181.21-181.21 181.21 181.21c17.293 17.293 45.299 17.293 62.605 0 17.293-17.28 17.293-45.299 0-62.605l-181.21-181.21z"></path></svg>';
var ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

var tick_icon_assessment = '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 490 490" xml:space="preserve"><polygon points="452.253,28.326 197.831,394.674 29.044,256.875 0,292.469 207.253,461.674 490,54.528 "/></svg>';
var plus_icon = '<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" xml:space="preserve"><rect id="svg_3" height="50" width="4" y="0" x="23" stroke-width="0" fill="#000000"></rect><rect id="svg_5" height="4" width="50" y="22.875" x="0" stroke-width="0" fill="#000000"></rect></svg>';
var close_icon = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><path d="M511.728 1023.457c-281.94 0-511.728-229.789-511.728-511.728s229.789-511.728 511.728-511.728 511.728 229.789 511.728 511.728-229.789 511.728-511.728 511.728zM511.728 81.485c-237.394 0-430.243 192.849-430.243 430.243s192.849 430.243 430.243 430.243 430.243-192.849 430.243-430.243-192.849-430.243-430.243-430.243z"></path><path d="M568.205 518.4l181.21-181.21c17.293-17.293 17.293-45.325 0-62.605-17.306-17.293-45.312-17.293-62.605 0l-181.21 181.21-181.21-181.21c-17.293-17.293-45.312-17.293-62.605 0s-17.293 45.325 0 62.605l181.222 181.21-181.222 181.21c-17.293 17.306-17.293 45.325 0 62.605 17.293 17.293 45.325 17.293 62.605 0l181.21-181.21 181.21 181.21c17.293 17.293 45.299 17.293 62.605 0 17.293-17.28 17.293-45.299 0-62.605l-181.21-181.21z"></path></svg>';
var playBtn_with_border = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><path d="M512 42.666c258.134 0 469.334 211.2 469.334 469.334s-211.2 469.334-469.334 469.334-469.334-211.2-469.334-469.334 211.2-469.334 469.334-469.334zM512 0c-283.734 0-512 228.267-512 512s228.267 512 512 512 512-228.267 512-512-228.267-512-512-512v0z"></path><path d="M304 812.444c-12.764 0-23.111-10.347-23.111-23.111v0-554.667c0-0.018 0-0.041 0-0.063 0-12.764 10.347-23.111 23.111-23.111 4.068 0 7.891 1.051 11.211 2.897l-0.118-0.061 508.444 277.334c7.28 3.987 12.134 11.596 12.134 20.337s-4.854 16.351-12.014 20.278l-0.12 0.061-508.444 277.334c-3.174 1.746-6.956 2.773-10.977 2.773-0.041 0-0.081 0-0.122 0h0.007zM327.111 273.493v477.014l437.031-238.507z"></path></svg>';

var HShell = window.HShell || {};

(function () {
    // --- Dynamically change the branding on demand
    HShell.core = HShell.core || {};
    HShell.core.applyBrand = function (brandName) {
        brandName = '_' + brandName;
        HShell.autoSetup.brandingFolder = 'brand' + brandName;

        // Global css, for all form factors all versions of browsers
        addStyle('<link id="commonBrandCss" type="text/css" rel="stylesheet" href="css/core_style.css" />');

        loadCourseSpecificCss(brandName);

        // Loads the appropriate CSS depending of the device used
        if ((HShell.autoSetup.runOn.OS == 'iOS' && HShell.autoSetup.runOn.deviceName != 'ipad') ||
            HShell.autoSetup.runOn.OS == 'android' ||
            HShell.autoSetup.runOn.OS == 'windowsPhone') {
            addStyle('<link id="mobileBrandCssCore"		type="text/css"		rel="stylesheet"  href="css/core_styleM.css" />');
            loadCourseSpecificCssMobile(brandName, '');
        } else {
            if ((HShell.autoSetup.runOn.OS == 'windows' && HShell.autoSetup.runOn.version < 9) ||
                document.documentMode <= 8 ||
                (HShell.autoSetup.runOn.OS == 'iOS' && HShell.autoSetup.runOn.deviceName == 'ipad')) {
                addStyle('<link id="desktopBrandCssCore" type="text/css" rel="stylesheet" href="css/core_styleD.css" />');
                loadCourseSpecificCssDesktop(brandName, '');

                if (HShell.autoSetup.runOn.OS == 'windows' && HShell.autoSetup.runOn.version < 9)
                    HShell.autoSetup.oldIE = true;
            } else {
                var mediaQu1 = 'only screen and (min-width: ' + HShell.branding.width + 'px)';
                addStyle('<link id="desktopBrandCssCore" type="text/css" rel="stylesheet" media="' + mediaQu1 + '" href="css/core_styleD.css" />');
                loadCourseSpecificCssDesktop(brandName, mediaQu1);

                var mediaQu2 = '(max-width: 1px) and (max-height: 1px)';
                /* --- This is because IE9 starts with 0px X 0px so it loads the mobile site*/
                addStyle('<link id="desktopBrandCssIe" type="text/css" rel="stylesheet" media="' + mediaQu2 + '" href="css/core_styleD.css" />');
                loadCourseSpecificCssDesktop(brandName, mediaQu2);

                var mediaQu3 = 'only screen and (max-width:' + HShell.branding.width + 'px) and (min-width:2px)';
                /* --- Min-width is because of the previous line ---*/
                addStyle('<link id="mobileBrandCssW" type="text/css" rel="stylesheet" media="' + mediaQu3 + '" href="css/core_styleM.css" />');
                loadCourseSpecificCssMobile(brandName, mediaQu3);

                // var mediaQu4 = 'only screen and (max-height:599px) and (min-height:2px)';
                // /* --- Min-height is because of two lines above ---*/
                // addStyle('<link id="mobileBrandCssH" type="text/css" rel="stylesheet" media="' + mediaQu4 + '" href="css/core_styleM.css" />');
                // loadCourseSpecificCssMobile(brandName, mediaQu4);

                var mediaQu5 = 'handheld';
                addStyle('<link id="mobileBrandCssCore"	type="text/css"	rel="stylesheet" media="' + mediaQu5 + '" href="css/core_styleM.css" />');
                loadCourseSpecificCssMobile(brandName, mediaQu5);
            }
        }
    };

    function addStyle(html) {
        if (typeof window.leftHead == 'undefined') { window.leftHead = false; }		// |rework| add comments
        if (window.leftHead) {
            $('head').append(html);
        } else {
            document.write(html);
        }
    }

    function loadCourseSpecificCss(brandName) {
        addStyle('<link id="mobileBrandCssCourseSpecific" type="text/css" rel="stylesheet" href="css/branding/brand' + brandName + '/courses/_course_' + window.courseCode + '/courseSpecific.css" />');
    }

    function loadCourseSpecificCssMobile(brandName, mediaQu) {
        addStyle('<link id="mobileBrandCssCourseSpecific" type="text/css" rel="stylesheet" media="' + mediaQu + '"  href="css/branding/brand' + brandName + '/courses/_course_' + window.courseCode + '/courseSpecificM.css" />');
    }

    function loadCourseSpecificCssDesktop(brandName, mediaQu) {
        addStyle('<link id="mobileBrandCssCourseSpecific" type="text/css" rel="stylesheet" media="' + mediaQu + '"  href="css/branding/brand' + brandName + '/courses/_course_' + window.courseCode + '/courseSpecificD.css" />');
    }
})();

// ________________________________________________________

// ****************************
// --- Main containers
// ****************************

function buildGenericContainer(title, content, wrapperClass, description) {
    var html = '';

    wrapperClass = wrapperClass || '';

    html +=
        '<div id="eLearningGenericContainer" class="rel ' + wrapperClass + '">' +
        '<div id="eLHeaderContainer" class="rel">' +
        '<h1 id="eLHeaderTitleContainer" data-languageItem="course_title" class="langItem rel" role="heading" aria-level="1">' + title + '</h1>' +
        '<div id="eLHeaderLogoContainer" aria-label="Company logo image.">' +
        '<div id="eLHeaderLogo" aria-hidden="true"></div>' +
        '</div>' +
        '<div id="eLHeaderDescriptionContainer" data-languageItem="course_description" class="langItem rel">' + (description || '') + '</div>' +
        '</div>' +
        '<div role="main" id="eLContentContainer" class="rel">' +
        content +
        // HShell.core.getComponent('CopyRight').init() +
        '</div>' +
        '</div>';

    $('#eLearningGenericContainer').remove(); // remove leftovers if any
    $('#SCORM_Container').append(html);
    HShell.core.renderComponents($('#SCORM_Container'));

}

// ________________________________________________________________________________________________________________________________

// ****************************
// --- Preloader
// ****************************

function buildPreloader(width) {
    var preloaderId = 'preLoaderContaienr' + Math.round(Math.random() * 1000);
    var loadingText = 'Loading, please wait...';
    if (String(HShell.userData.selected_language) != 'null') loadingText = SL.UI.lable_loading;
    if (String(width) == 'undefined') width = 300;

    var html = '';
    html += '<div class="preloaderContainer" id="' + preloaderId + '">';
    html += '<div id="preloaderContainerInner" style="width: 100%; max-width: ' + width + 'px;">';
    html += '<div class="preloaderBorder">';
    html += '<div class="preloaderLeftBorder"></div>';
    html += '<div class="preloaderMidBorder"></div>';
    html += '<div class="preloaderRightBorder"></div>';
    html += '</div>';
    html += '<div id="preloaderBarContainer" style="width: calc(100% - 10px);">'; // --- The constant 10 compensates the border
    html += '<div id="preloaderBarInner" class="rel"></div>';
    html += '<div id="preloaderBarBG"></div>';
    html += '</div>';
    html += '</div>';
    html += '<div id="preloaderSubTitle" aria-live="assertive">' + loadingText + '</div>';
    html += '</div>';

    return { html: html, id: preloaderId };
}

// ________________________________________________________________________________________________________________________________

// ****************************
// --- Language selection
// ****************************

function buildLanguageSelection() {
    var html = '';
    html += '<div id="languageContainer" class="customWindowContent">' +
        '<h2 id="langTitleContainer" class="elSubTitleContainer langItem" data-languageItem="label_language_select" role="">' + SL.UI.label_language_select + '</h2>' +
        '<ul id="flagsContainer" class="rel" role="radiogroup" aria-labelledby="langTitleContainer"></ul>' +
        '<div id="mainLangContainer"></div>' +
        '</div>' +
        '<div class="buttonsContainer"  aria-live="off">' +
        HShell.core.getComponent('Button').init({ id: 'btn_langContinue', text: 'next' }) +
        '</div>';

    //the footer is located in contentContainer. Prepend is used in order to keep the html structure ordered and the footer to be the last element inside.
    //We need that for right order while using keyboard to nagivate through the page.
    $('#eLContentContainer').html(html);
    HShell.core.renderComponents($('#eLContentContainer'));
    $('#eLearningGenericContainer').attr('data-content', 'languageContainer'); // --- Indicates what is the content that is loaded inside;

    jQuery.each(HShell.content.languageArray, function (i) {
        buildOneFlag($(this), i);
    });

    // $('#flagsContainer > li').first().click();
}

function buildOneFlag(flagObj, positionInArray) {
    var html = '';
    html += '<li aria-checked="false" code="' + flagObj[0].UI.code + '" positionInArray="' + positionInArray + '" class="noSelect"' +
        'lang="' + (flagObj[0].UI.code === 'du' ? 'nl' : flagObj[0].UI.code) + '">';
    html += '<input id="' + flagObj[0].UI.label_text + '" type="radio" name="Select language" class="rel oneFlagContainer" />';
    html += '<label for="' + flagObj[0].UI.label_text + '" class="label rel flagTitle">' + flagObj[0].UI.label_text + '</label>';
    html += '<div aria-hidden="true" class="rel flagImgContaienr2">';
    html += '<img class="flagBigIcon" 	height="54"	width="80"  src="content/' + flagObj[0].UI.folder + '/img/' + flagObj[0].UI.imgUrlBig + '" alt="" />';
    html += '<img class="flagMassiveIcon" 	height="84"	width="125"  src="content/' + flagObj[0].UI.folder + '/img/' + flagObj[0].UI.imgUrlMassive + '" alt="" />';
    html += '</div>';
    html += '</li>';

    $('#flagsContainer').append(html);
}

// ________________________________________________________________________________________________________________________________

// ****************************
// --- Starting Cover Screen
// ****************************

function buildStartingCoverScreen() {
    var html = '';
    var style = HShell.contentSetup.startingCoverBgImgUrl ? 'background-image: url(content/' + HShell.contentSetup.startingCoverBgImgUrl + ')' : '';
    var brandLogoStyle = HShell.contentSetup.startingCoverBrandLogoUrl ? 'background-image: url(content/' + HShell.contentSetup.startingCoverBrandLogoUrl + ')' : '';
    var additionalText = SL.UI.startingCoverAdditionalText || '';
    html += '<div id="startingCoverScreenContainer" style="' + style + '">' +
        '<div id="startingCoverScreenContentContainer">' +
            '<div id="brandLogoContainer" aria-label="Brand logo" role="img" style="' + brandLogoStyle + '"></div>' +
            '<h1 id="courseTitle">' + SL.UI.course_title + '</h1>' +
            '<div class="courseDescription additionalText">' + additionalText + '</div>' +
            '<div class="courseDescription">' + SL.UI.course_description + '</div>' +
            '<div class="buttonsContainer"  aria-live="off">' +
                HShell.core.getComponent('Button').init({ id: 'startBtn', text: 'lable_startCourse' }) +
            '</div>' +
        '</div>' +
        '</div>';

    $('#eLContentContainer').prepend(html);
    HShell.core.renderComponents($('#eLContentContainer'));
    $('#eLearningGenericContainer').attr('data-content', 'startingCoverScreenContainer');
}
// ________________________________________________________________________________________________________________________________

// ****************************
// --- newToCompany Screen
// ****************************

function buildIsNewEmployeeScreen() {
    var component = HShell.core.getComponent('NewToCompany');

    $('#eLContentContainer').html( component.init() );
    HShell.core.renderComponents($('#eLContentContainer'));
    $('#eLearningGenericContainer').attr('data-content', 'newToCompanyContainer');			// --- Indicates what is the content that is loaded inside;

    return component;
}
// ________________________________________________________________________________________________________________________________

// *****************************
// --- courseInformation Screen
// *****************************

function buildCourseInformationScreen() {
    var html = '';

    html += '<div id="importantInformationContainer" class="customWindowContent" style="' + miHCalc('- 252px') + '">' +
        '<h2 id="infoTitle" class="elSubTitleContainer">' + SL.UI.label_importantInformation + '</h2>' +
        '<div id="infoContent" class="rel purple" >' + SL.UI.pre_assessment_additional_text + '</div>' +
        '<div id="infoButtonsContainer" class="buttonsContainer"  aria-live="off">' +
        HShell.core.getComponent('Button').init({ id: 'continueBtn', text: 'label_continue' }) +
        '</div>' +
        '</div>';

    $('#eLContentContainer').prepend(html);
    HShell.core.renderComponents($('#eLContentContainer'));
    $('#eLearningGenericContainer').attr('data-content', 'importantInformationContainer');
}

// ________________________________________________________________________________________________________________________________

// ****************************
// --- Brand selection
// ****************************

function buildBrandSelection() {
    var html = '';
    html += '<div id="brandContainer">';
    html += '<div id="brandSelectContainer" class="rel" role="window">';
    html += '<div id="brand_selectionContainer">';
    html += '<h2 id="brandTitle" class="elSubTitleContainer" aria-live="assertive">' + SL.UI.label_brand_select + '</h2>';
    /* This should be a radio group... the thing with not using radiogroups is that
     * elements have to be browsable with arrow keys... using radiogroup makes VisualAria scream there's a problem with
     */
    html += '<ul id="brandsContainer" role="radiogroup" aria-labelledby="brandTitle"></ul>';
    html += '</div>';
    html += '<div class="buttonsContainer"  aria-live="off">';
    html += HShell.core.getComponent('Button').init({ id: 'btn_previousScreen', text: 'previous' });
    html += HShell.core.getComponent('Button').init({ id: 'btn_brandContinue', text: 'next', classes: 'inactive', attributesString: 'disabled="true" aria-disabled="true"' });

    html += '</div>';
    html += '</div>';
    html += '</div>';

    $('#eLContentContainer').prepend(html);
    $('#eLearningGenericContainer').attr('data-content', 'brandContainer');			// --- Indicates what is the content that is loaded inside;

    // setTimeout(function () { $('#brandTitle').html(SL.UI.label_brand_select); }, 1000);  // --- (Accessibility) We need to reset the text inside the title in order for the screen reader to address the aria-live attribute and pronounce the title

    setTimeout(function () {
        HShell.a11y.speak($('#brandTitle').text());
    }, HShell.consts.pageLoadDelayA11YRead);

    jQuery.each(HShell.content.brandsArray, function (i, currentBrand) {
        buildOneBrandImg($(currentBrand), i);
    });

    /* Update the title described by attribute with the info in the current page...
     * this is kinda messy, but the only way to go about it is to update every
     * single time the label and the description
     */
    $('#eLContentContainer').attr('aria-labelledby', 'brandTitle');
    $('#eLContentContainer').attr('aria-describedby', '');

    HShell.core.renderComponents($('#eLContentContainer'));
}

function buildOneBrandImg(brandObj, positionInArray) {
    if (String(brandObj[0].label_text[HShell.userData.selected_language]) != 'undefined') {
        var html = '';
        //ITMatters specific role selection - classes added - primary or secondary
        html += '<li aria-checked="false" positionInArray="' + positionInArray + '">';
        html += '<input id="' + positionInArray + 'brand" type="radio" name="brandSelect" class="rel oneBrandItem">';
        // html += '<div class="brandImgContainer">';
        html += '<label class="roleLabel" for="' + positionInArray + 'brand">' + brandObj[0].label_text[HShell.userData.selected_language] + '</label>'
        // html += '<img class="brandImg noSelect" src="content/' + brandObj[0].imgUrlIcon + '"/>';
        // html += '<img class="brandImgActive noSelect" src="content/' + brandObj[0].imgActiveUrlIcon + '"/>';
        // html += '<img class="brandImgBig noSelect" src="content/' + brandObj[0].imgUrlIconBig + '"/>';
        // html += '<img class="brandImgActiveBig noSelect" src="content/' + brandObj[0].imgActiveUrlIconBig + '"/>';
        // html += '<div class="iconHolder brandSelectRing noSelect" aria-hidden="true">' + HShell.constant.iconsObj.icon_ring_role + '</div>';
        // html += '</div>';
        html += '</li>';
        $('#brandsContainer').append(html);
    }
}

// ________________________________________________________________________________________________________________________________

// ****************************
// --- Role selection
// ****************************

function buildRoleSelection() {
    var hasPreAssessment = HShell.contentSetup.have_pre_a &&
        !HShell.contentSetup.skip_pre_a &&
        !HShell.content.selected_roleObj.skip_pre_a &&
        !HShell.content.roleNoPreAssessment;
    var html = '';

    html += '<div id="roleContainer">' +
        '<div id="roleSelectContainer" class="rel" role="window">' +
        '<div id="role_selectionContainer">' +
        '<h2 id="roleTitle" class="elSubTitleContainer" aria-live="assertive">' + SL.UI.label_role_select + '</h2>' +
    (HShell.contentSetup.brand_select ?
        '<div id="roleExplanation" class="elSubTitleContainer" aria-live="assertive">' + SL.UI.label_role_explanation + '</div>'
        : '') +

        '<ul id="rolesContainer" role="radiogroup" aria-labelledby="roleTitle"></ul>' +
        '</div>' +
        '<div class="buttonsContainer" aria-live="off">' +
            HShell.core.getComponent('Button').init({ id: 'btn_previousScreen', text: 'previous' }) +
            HShell.core.getComponent('Button').init({ id: 'btn_roleContinue', text: hasPreAssessment ? 'startPre' : 'preAStartLearning' }) +
        '</div>' +
        '</div>' +
        '</div>';

    $('#eLContentContainer').prepend(html);
    HShell.core.renderComponents($('#eLContentContainer'));
    $('#eLearningGenericContainer').attr('data-content', 'roleContainer');			// --- Indicates what is the content that is loaded inside;

    setTimeout(function () { $('#roleTitle').html(SL.UI.label_role_select); }, 1000);  // --- (Accessibility) We need to reset the text inside the title in order for the screen reader to address the aria-live attribute and pronounce the title

    jQuery.each(HShell.content.roleArray, function (i) {
        if ($(HShell.content.roleArray[i]).attr('code') != 'newToCompany') {
            buildOneRoleImg($(this), i);
        }
    });
}
// ________________________________________________________

function buildOneRoleImg(roleObj, positionInArray) {
    if (String(roleObj[0].label_text[HShell.userData.selected_language]) != 'undefined') {
        if (HShell.contentSetup.brand_select && roleObj[0].brand !== HShell.userData.selected_brand) {
            return;
        }

        var html = '';
        //ITMatters specific role selection - classes added - primary or secondary
        html += '<li aria-checked="false" positionInArray="' + positionInArray + '" class="' + (roleObj[0].isSecondary ? ' secondary ' + roleObj[0].code : 'primary') + '">';
        html += '<input id="' + positionInArray + 'role" type="radio" name="roleSelect" class="rel oneRoleItem" href="' + roleObj[0].label_text[HShell.userData.selected_language] + '">';
        
        html += '<label class="roleLabelContainer" for="' + positionInArray + 'role">' + roleObj[0].label_text[HShell.userData.selected_language] + '</label>';
        
        html += '</li>';
        $('#rolesContainer').append(html);
    }
}

// ________________________________________________________________________________________________________________________________

// ****************************
// --- Modules video & Tutorial
// ****************************

// ________________________________________________________

function buildModuleVideo(transcriptUrl, modId) {
    $('#SCORM_Container').append(
        HShell.core.getComponent('Module_Video').init({modId: modId, transcriptUrl: transcriptUrl})
    );

    HShell.core.renderComponents( $('#SCORM_Container') );
}

// ________________________________________________________________________________________________________________________________

// ****************************
// --- Audio available
// ****************************

function buildAudioAvailable() {
    var html = '';

    html += '<div id="audioAvalContainer" class="customWindowContent" style="' + miHCalc('- 252px') + '">' +
        '<h2 id="aATitleContainer" class="elSubTitleContainer">' + SL.UI.aATitle + '</h2>';

    if (SL.UI.aAAtentionMessage) {
        html += '<div id="aATitleAtention" class="rel">' + SL.UI.aAAtentionMessage + '</div>';
    }

    html += '<div id="aAContent" class="rel">' + SL.UI.aADescription + '</div>' +
        '<div id="aAButtonsContainer" class="buttonsContainer"  aria-live="off">' +
        HShell.core.getComponent('Button').init({ id: 'aAAudioOnBtn', text: 'label_audioOn' })  +
        HShell.core.getComponent('Button').init({ id: 'aAAudioOffBtn', text: 'label_audioOff' }) +
        '</div>' +
        // HShell.core.getComponent('CopyRight').init() +
        '</div>';

    $('#eLContentContainer').empty().prepend(html);
    HShell.core.renderComponents($('#eLContentContainer'));
    $('#eLearningGenericContainer').attr('data-content', 'audioAvalContainer');			// --- Indicates what is the content that is loaded inside;
}

// ________________________________________________________________________________________________________________________________

// ****************************
// --- News screen
// ****************************

function buildNewsScreen() {
    var html = '';

    html += '<div id="newsContainer" style="' + miHCalc('- 252px') + '">' +
        '<h2 id="newsTitleContainer" class="elSubTitleContainer">' + HShell.content.newsObj.title + '</h2>' +
        '<div id="newsScreenContent" class="">' + HShell.content.newsObj.message + '</div>' +
        '</div>' +
        '<div id="newsButtonsContainer" class="buttonsContainer"  aria-live="off">' +
            HShell.core.getComponent('Button').init({ id: 'btn_previousScreen', text: 'previous' }) +
            HShell.core.getComponent('Button').init({ id: 'newsContinueBtn', text: 'next' }) +
        '</div>';

    $('#eLContentContainer').empty().prepend(html);
    HShell.core.renderComponents($('#eLContentContainer'));
    $('#eLearningGenericContainer').attr('data-content', 'newsContainer');			// --- Indicates what is the content that is loaded inside;
}

// ________________________________________________________________________________________________________________________________

// ****************************
// --- Warning screen
// ****************************

function buildWarningScreen() {
    var html = '';

    html += '<div id="warningContainer" style="' + miHCalc('- 252px') + '">' +
        '<h2 id="warningTitleContainer" class="elSubTitleContainer">' + HShell.content.warningObj.title + '</h2>' +
        '<div id="warningScreenContent" class="rel">' + HShell.content.warningObj.message + '</div>' +
        '<div id="warningButtonsContainer" class="buttonsContainer"  aria-live="off">' +
        HShell.core.getComponent('Button').init({ id: 'warningContinueBtn', text: 'label_continue' }) +
        '</div>' +
        '</div>';

    $('#eLContentContainer').empty().prepend(html);
    HShell.core.renderComponents($('#eLContentContainer'));
    $('#eLearningGenericContainer').attr('data-content', 'warningContainer');          // --- Indicates what is the content that is loaded inside;
}

// ________________________________________________________________________________________________________________________________

function buildPeopleManager() {
    var html = '';

    html += '<div id="peopleManagerContainer" style="' + miHCalc('- 252px') + '">' +
        '<h2 id="peopleManagerTitleContainer" class="elSubTitleContainer">' + HShell.content.peopleManagerObj.title + '</h2>' +
        '<div id="peopleManagerContent" class="rel">' + HShell.content.peopleManagerObj.message + '</div>' +
        '<div id="peopleManagerButtonsContainer" class="buttonsContainer"  aria-live="off">' +
        HShell.core.getComponent('Button').init({ id: 'btn_peopleManagerYes', text: 'label_Yes' }) +
        HShell.core.getComponent('Button').init({ id: 'btn_peopleManagerNo', text: 'label_No' }) +
        '</div>' +
        '</div>';

    $('#eLContentContainer').empty().prepend(html);
    HShell.core.renderComponents($('#eLContentContainer'));
    $('#eLearningGenericContainer').attr('data-content', 'peopleManagerContainer');          // --- Indicates what is the content that is loaded inside;
}

// ________________________________________________________________________________________________________________________________

function buildIntroduction() {
    var videoUrl = 'content/' + HShell.userData.selected_language + '/' + HShell.content.selected_roleObj.introVideoURL;
    var subUrl = 'content/' + HShell.userData.selected_language + '/' + HShell.content.selected_roleObj.introSubtitlesURL;

    var introPopUp = new videoPopUp();
    introPopUp.videoURL = videoUrl;
    introPopUp.subtitlesURL = subUrl;
    introPopUp.headerTextL = SL.UI.course_title;
    introPopUp.headerTextR = SL.UI.lable_introduction;
    introPopUp.rightButtonLable = '';
    introPopUp.containerId = 'introContaienr';
    introPopUp.onVideoFinish = function () { skipIntroduction(); };
    introPopUp.buildPopUp();
}

// ________________________________________________________________________________________________________________________________

function buildSkipTutprial() {
    var html = '';

    html += '<div id="skipTutorial" class="customWindowContent" style="' + miHCalc('- 252px') + '">' +
        '<div id="skipTutorialTitleContainer" class="elSubTitleContainer">' + SL.UI.aAMobiSkipTutorialTitle + '</div>' +
        '<div id="skipTutorialContent" class="rel">' + SL.UI.aAMobiSkipTutorialContent + '</div>' +
        '<div id="skipTutorialButtonsContainer" class="buttonsContainer"  aria-live="off">' +
        HShell.core.getComponent('Button').init({ id: 'aAWatchVid', text: 'lable_watchVideo' }) +
        HShell.core.getComponent('Button').init({ id: 'aASkipVid', text: 'lable_skipVideo' }) +
        '</div>' +
        '</div>';

    $('#eLContentContainer').prepend(html);
    HShell.core.renderComponents($('#eLContentContainer'));
    $('#SCORM_Container, body').scrollTop(0);
}

function buildTutorial() {
    var videoUrl = HShell.globalSetup.tutorialVideoUrl[SL.UI.code];
    if (String(videoUrl) == 'undefined') {
        videoUrl = HShell.globalSetup.tutorialVideoUrl.all;
    }

    var subUrl = HShell.globalSetup.tutorialVideosubtitlesURL[SL.UI.code];
    if (String(subUrl) == 'undefined') {
        videoUrl = HShell.globalSetup.tutorialVideosubtitlesURL.all;
    }

    var tutorialPopUp = new videoPopUp();
    tutorialPopUp.videoURL = videoUrl;
    tutorialPopUp.subtitlesURL = subUrl;
    tutorialPopUp.headerTextL = SL.UI.course_title;
    tutorialPopUp.headerTextR = SL.UI.tutorial;
    tutorialPopUp.rightButtonLable = 'skipVideo';
    tutorialPopUp.containerId = 'tutorialContaienr';
    tutorialPopUp.onVideoFinish = function () { $('#vidPopSkipBTN').click(); };
    tutorialPopUp.buildPopUp();
}

// ________________________________________________________________________________________________________________________________

function videoPopUp() {
    var thisObj = this;
    this.videoURL = null;
    this.subtitlesURL = null;
    this.transcriptURL = null;
    this.onReadyState = function () { };
    this.onReadyStateParam = '';
    this.headerTextL = '';
    this.headerTextR = '';
    this.rightButtonLable = '';

    this.buildPopUp = function bp() {
        buildPopUpVideo(thisObj);
    };
}

// ________________________________________________________

function buildPopUpVideo(param) {
    var subtitlesClassMod = '',
        footerOptions,
        headerOptions;

    headerOptions = {
        leftText: param.headerTextL,
        rightText: param.headerTextR,
        haveFullScreen: true
    };

    footerOptions = {
        transcriptUrl:'',
        subtitles: true,
        rightButtonLable: param.rightButtonLable,
        noHome: param.noExit === undefined ? true : param.noExit
    };

    if (HShell.userData.prefer_subtitles === false) {
        subtitlesClassMod = 'noSubtitles';
    }

    var html = '';
    html += '<div id="' + param.containerId + '" class="abs videoPopUp" >';
    html +=     HShell.core.getComponent('Module_Header').init(headerOptions);
    html += '<div class="vidPopVideoContainer rel">';
    html += '<div class="vidPopVideoInnerContainer loading rel">';
    html += '<span class="vAlignHelper"></span>';
    html += '</div>';
    html += '<div class="vidPopSubtitlesContainer ' + subtitlesClassMod + ' noSelect"></div>';
    html += '</div>';
    html += HShell.core.getComponent('Video_Footer').init(footerOptions)
    html += '</div>';

    $('#SCORM_Container').append(html);
    HShell.core.renderComponents($('#SCORM_Container'));
    //rework and not required anymore
    //reskinAllContent($('#' + param.containerId));

    setActiveVideo();

    function setActiveVideo(){
        var i = HShell.autoSetup.activeVideoArray.length;
        HShell.autoSetup.activeVideoArray.push(new uniPlay());
        HShell.autoSetup.activeVideoArray[i].videoURL = param.videoURL;
        HShell.autoSetup.activeVideoArray[i].subtitlesURL = param.subtitlesURL;
        HShell.autoSetup.activeVideoArray[i].videoContainer = $('#' + param.containerId + ' .vidPopVideoInnerContainer');
        HShell.autoSetup.activeVideoArray[i].subtitlesContainer = $('#' + param.containerId + ' .vidPopSubtitlesContainer');
        HShell.autoSetup.activeVideoArray[i].controlesContainer = $('#' + param.containerId + ' .vidPopFooterContainer');

        HShell.autoSetup.activeVideoArray[i].videoH = 408;
        HShell.autoSetup.activeVideoArray[i].videoW = 917;
        HShell.autoSetup.activeVideoArray[i].autoPlay = param.autoPlay === undefined ? true : param.autoPlay;
        HShell.autoSetup.activeVideoArray[i].isFeedbackVideo = param.isFeedbackVideo;
        HShell.autoSetup.activeVideoArray[i].onVideoFinish = param.onVideoFinish;
        HShell.autoSetup.activeVideoArray[i].onReadyState = function () {
            $('.vidPopBackBtn, .vidPopPlayBtn, .vidPopStopBtn, .vidPopMuteBtn, .vidPopSubtitles').stop().fadeIn(function () { $(this).css('display', 'inline-block'); });
            HShell.autoSetup.activeVideoState = 'started';

            if (HShell.autoSetup.runOn.OS === 'iOS') {
                $('.vidPopPlayBtn').focus();
            }
            // else {
            //     $('.vidPopVideoContainer').focus();
            // }

            param.onReadyState.call(this);
        };
        HShell.autoSetup.activeVideoArray[i].onReadyStateParam = param.onReadyStateParam;

        HShell.autoSetup.activeVideoArray[i].buildVideoPlayer();
        HShell.autoSetup.activeVideo = HShell.autoSetup.activeVideoArray[i];
    }
}

// ________________________________________________________________________________________________________________________________

// ****************************
// --- Standard Pre/Post		(radio-buttons and check-boxes ... )
// ****************************

function buildPreAssessment() {
    var assessmentTemplate = HShell.contentSetup.fancyAssessment ? 'fancy' : 'standard';  // for now templates can be 'fancy' and standard
    var html = '';

    html += '<div class="rel" id="preAssessementContainer">' +
        getAssessmentTemplate(assessmentTemplate, SL.UI.preTitle) +
        '</div>';

    $('#eLContentContainer').prepend(html);
    HShell.core.renderComponents($('#eLContentContainer'));

    $('#eLearningGenericContainer').attr('data-content', 'preAssessementContainer');			// --- Indicates what is the content that is loaded inside;
    attachPieToProgressBarElements();

    // --- (Accessibility) We need to reset the text inside the title in order for the screen reader to address the aria-live attribute and pronounce the title
    setTimeout(function () {
        $('#preAssessStartScreenTitle').ariaRefresh();
        $('.elSubContentContainer').each(function () { $(this).ariaRefresh(); });
        $('#elSubContentContainer').ariaRefresh();
    }, 1000);

    //reskinAllContent($('#preAssessStartScreenContainer'));

    //courseSpecificPreAssessmentStartScreenAddAditionalText();
    if (typeof window.courseSpecific_addTextToPreAssessmentScreen == 'function') {
        window.courseSpecific_addTextToPreAssessmentScreen();
    } else if (typeof window.clientSpecific_addTextToPreAssessmentScreen == 'function') {
        window.clientSpecific_addTextToPreAssessmentScreen();
    }
}

// ________________________________________________________
var isActive = 'active';
function addOneQuestionFromGroup(quizType, selectedItem, questionGroupId, qNum, qMod, quizObj) {
    try {
        var html = '';
        if (
            (HShell.contentSetup.isPeopleManager == true && qMod != 2 && qMod != 3)
            ||
            (HShell.contentSetup.isPeopleManager == true && quizType == 'postAssessment')
            || (HShell.contentSetup.isPeopleManager == false)
        ) { // If current user is peopleManager the questionGroup having module=2 or 3 and quizType is preAssessment current question will be hide.
            switch (selectedItem.type) {
                case 'radio':
                case 'checkbox':
                case 'trueOrFalse':
                    var backgroundImage = selectedItem.backgroundImage;
                    if (!backgroundImage &&
                        HShell.contentSetup.fancyAssessment &&
                        typeof quizObj.XML !== 'undefined' &&
                        typeof quizObj.XML.attr('backgroundImage') !== 'undefined') { 
                            backgroundImage = quizObj.XML.attr('backgroundImage');
                    }
                    var backgroundImageStyle = backgroundImage ? ' style="background-image: url(content/' + backgroundImage + ')"' : '';
                    var type = selectedItem.type == 'trueOrFalse' ? 'radio' : selectedItem.type;
                    var extraClass = selectedItem.type == 'trueOrFalse' ? 'trueOrFalse' : 'radioChbox';
                    var verticalAnswers = selectedItem.verticalAnswers == 'true' ? 'verticalAnswers' : '';

                    html += '<div class="rel questionContainer ' + quizType + ' ' + isActive + ' ' + verticalAnswers + '" qId="' + selectedItem.id + '" qGroupId="' + questionGroupId + '" forModule="' + qMod + '" type="' +
                        type + '" quizType="' + quizType + '" ' + backgroundImageStyle + '>';
                    html += buildSingleMultipleCh(selectedItem, qNum, type, extraClass);
                    html += '</div>';
                    isActive = ''; // Undo "active" class.
                    break;

                case 'video':
                    var headerOptions = {
                        leftText:$('#assessmentTypeIndicator').text(),
                        rightText:$('#preHProgressContainer, #postHProgressContainer').html(),
                        haveFullScreen:false
                    };

                    html += '<div class="rel questionContainer ' + quizType + '" qId="' + selectedItem.id + '" qGroupId="' + questionGroupId + '" forModule="' + qMod + '" type="' + selectedItem.type + '" quizType="' + quizType + '">';
                    html += '<div class="quContVideoContainer abs" videoURL="' + escape(selectedItem.videoURL) + '" subtitlesURL="' + escape(selectedItem.subtitlesURL) + '">';
                    html +=     HShell.core.getComponent('Module_Header').init(headerOptions);
                    html += '<div class="vidPopVideoContainer rel">';
                    html += '<span class="vAlignHelper"></span>';
                    html += '</div>';
                    html += '<div class="vidPopSubtitlesContainer" aria-hidden="true"></div>';
                    html += HShell.core.getComponent('Video_Footer').init({transcriptUrl:'', subtitles: true, rightButtonLable:SL.UI.question, noHome:true})
                    html += '</div>';
                    html += buildSingleMultipleCh(selectedItem, qNum, selectedItem.subType, 'video');
                    html += '</div>';
                    break;
            }
        }

        return html;
    } catch (e) {
        HShell.utils.trace('The question can not be added, most likely in the pre-assessment XML, the problem is that on the "questionGroup" is selected "questionsNumbers" to be bigger than the questions listed below ', 'addOneQuestionFromGroup');
    }
}

function buildSingleMultipleCh(selItem, qNum, type, extraClass) {
    var html = '';
    html += '<div class="rel questionTitle langItem ' + extraClass + '"  data-itemTask="questionText">' + selItem.qTxt + '</div>';
    if (extraClass == 'video') {
        html += '<div class="replayButton" role="button">' + SL.UI.replayVideo + '</div>';
    }
    html += buildImage(selItem);
    html += buildVideo(selItem);
    html += '<div class="rel preAnswersContainer assessmentAnswersContainer ' + extraClass + '" role="list">';
    for (var i = 0; i < selItem.answerArr.length; i++) {
        var answer = selItem.answerArr[i];
        html += '<span class="rel preAnswersOneItem oneAnswer" role="listitem" aria-label="Not checked. Option ' + ALPHABET.charAt(i).toUpperCase() + '. ' + answer.aText + '">';
        html += '<label for="preQ' + qNum + 'A' + i + '" class="langItem" data-itemTask="answer" data-moduleGroupTaskId="' + answer.id + '">';
        html += '<input type="' + type + '" name="q' + qNum + '" class="rel preAnswerOneITemTitle"  id="preQ' + qNum + 'A' + i + '" answerNumber="' + i + '" aria-hidden="true" tabindex="-1"/>';

        if (extraClass == 'trueOrFalse') {
            if (i === 0) {
                html += '<div class="answerIconContainer noSelect rel correct">' + HShell.consts.iconsObj.icon_circle;
                html += '   <span class="answerIconIndicatorContainer noSelect">';
                html += HShell.consts.iconsObj.icon_true;
                html += '   </span>';
                html += '   <span class="answerIconBorderContainer noSelect">';
                html += HShell.consts.iconsObj.circle_border;
                html += '   </span>';
                html += '</div>';
            } else {
                html += '<div class="answerIconContainer noSelect rel wrong">' + HShell.consts.iconsObj.icon_circle;
                html += '   <span class="answerIconIndicatorContainer noSelect">';
                html += HShell.consts.iconsObj.icon_false;
                html += '   </span>';
                html += '   <span class="answerIconBorderContainer noSelect">';
                html += HShell.consts.iconsObj.circle_border;
                html += '   </span>';
                html += '</div>';
            }

            if (HShell.contentSetup.fancyAssessment) {
                html += buildTrueFalseIndicator(answer.correct, extraClass);
            }
        } else {
            html += '<div class="assessmentAnswerlLableText noSelect rel">';
            // html += '<div class="assessmentAnswerIcon"><img class="image" src="' + 'content/' + answer.image + '" /><img class="imageSelected" src="' + 'content/' + answer.imageSelected + '" /></div>';
            html += '<div class="assessmentAnswerLetter" aria-hidden="true">' + ALPHABET.charAt(i).toUpperCase() + '.</div>';
            html += '<div class="assessmentAnswerText" id="assessmentAnswerText'+qNum+'" tabindex="-1">' + answer.aText + '</div>';
            if (HShell.contentSetup.fancyAssessment) {
                html += buildTrueFalseIndicator(answer.correct, extraClass);
            }
            html += '</div>';
        }

        if (!HShell.contentSetup.fancyAssessment) {
            html += '<span class="vAlignHelper"></span>';
        }

        html += '</label>';

        if (!HShell.contentSetup.fancyAssessment) {
            html += buildTrueFalseIndicator(answer.correct, extraClass);
        }

        html += '</span>';
    }
    html += '</div>';

    return html;
}

function buildVideo(selectedItem) {
    var video = selectedItem.video;
    if(!video) return '';
    var footerOptions = Object.assign({
        subtitles: true,
        rightButtonLable: null,
        noHome: true,
        homeEnabled: false
    });
    var style = video.videoThumbUrl ? 'style="background-image: url('+video.videoThumbUrl+')"' : '';
    return (
    '<div class="videoPopUp" data-videourl="'+video.videoUrl+'" data-subtitlesurl="'+video.subtitlesUrl+'">' +
        '<div class="vidPopVideoContainer">' +
            '<div class="vidPopVideoInnerContainer">' +
                '<div class="playBtnContainer" '+style+' tabindex="0" role="button" aria-label="Play the video.">' +
                    playBtn_with_border +
                '</div>' +
            '</div>' +
            '<div class="videoFooterContainer">' +
                '<div class="vidPopSubtitlesContainer"></div>' +
                HShell.core.getComponent('Video_Footer').init(footerOptions) +
            '</div>' +
        '</div>' +

    '</div>');
}

function buildImage(selectedItem) {
    var image = selectedItem.image;
    if(!image) return '';
    var items = image.items || [];
    var imageUrlOverride = image.imageMobileOverride;

    var pointsOfInterest = items && items.map(function(item, index) {
        var itemPositions = (item.position.toString() || '0,0').split(',');
        var itemPositionsOverride = item.positionMobileOverride;
        itemPositionsOverride = itemPositionsOverride != '' ? itemPositionsOverride.split(',') : '';
        return (
            buildPointOfInterest(index, selectedItem.id, itemPositions, image.itemColor, (itemPositionsOverride && itemPositionsOverride != '') ? 'overridden' : '') +
            (itemPositionsOverride ? buildPointOfInterest(index, selectedItem.id, itemPositionsOverride, image.itemColor, 'mobile') : '')
        );
    }).join('')

    var imgOverride = (imageUrlOverride && imageUrlOverride != '')
        ? '<img class="mobile" src="content/' + HShell.userData.selected_language + '/' + imageUrlOverride + '" alt="' + (image.imageAlt || '') + '"/>'
        : '';

    var descriptions = items.map((item, index) => {
        var style = '';
        style += image.textColor ? ('color:' + image.textColor + '; ') : '';
        style += image.bgColor ? ('background-color:' + image.bgColor + '; ') : '';
        style += image.borderColor ? ('border-color:' + image.borderColor + '; ') : '';

        return (
        '<div class="itemDescription" data-itemid="' + selectedItem.id + '-' + index + '" style="' + style + '">' +
            '<div class="itemDescriptionTitle">' + item.itemTitle +'</div>' +
            '<div class="closeBtn" tabindex="0" role="button" aria-label="Close the description.">' + close_icon + '</div>' +
            '<div class="itemDescriptionText">' + item.itemText + '</div>' +
        '</div>'
        );
    }).join('')

    return (
        '<div class="imageContainer" data-itemcolor="' + ((items && image.itemColor) || '') + '">' +
            '<img class="' + ((imageUrlOverride && imageUrlOverride != '') ? 'overridden' : '') + '" src="content/' + HShell.userData.selected_language + '/' + image.imageUrl + '" alt="' + (image.imageAlt || '') + '"/>' +
            imgOverride +
            pointsOfInterest +
        '</div>' +
        '<div class="descriptionsContainer">' +
            descriptions +
        '</div>'
    );
}

function buildPointOfInterest(itemId, questionIndex, itemPositions, itemColor, additionalClasses) {
    var borderColor =  itemColor ? ('border-color: ' + itemColor) : '';
    return (
        '<span class="item ' + additionalClasses + '" style="top: ' + itemPositions[0] + '%; left: ' + itemPositions[1] + '%;" data-itemid="' + questionIndex + '-' + itemId + '" tabindex="0" role="button" aria-label="Item ' + itemId+1 + '.">' +
            '<span class="icon" aria-hidden="true">'+
                '<span class="tick">' + tick_icon_assessment + '</span>'+
                '<span class="plus">' + plus_icon + '</span>'+
            '</span>'+
            '<span class="border" aria-hidden="true" style="' + borderColor + '"></span>'+
        '</span>'
    );
}

function buildTrueFalseIndicator(trueOrFalse, type) {
    var html = '<div class="preAnswerTrueFalseIndicator AnswerTrueFalseIndicator" aria-hidden="true">';
    if (!HShell.contentSetup.fancyAssessment || type == 'trueOrFalse') {
        if (String(trueOrFalse) == 'true') {
            html += '<div class="preAnswerTrueIndicator AnswerTrueIndicator rel langItem answerTrueFalseText" data-languageItem="trueText">' + SL.UI.trueText + '</div>';
        } else {
            html += '<div class="preAnswerFalseIndicator AnswerFalseIndicator rel langItem answerTrueFalseText" data-languageItem="falseText">' + SL.UI.falseText + '</div>';
        }
    } else {
        if (String(trueOrFalse) == 'true') {
            html += '<div class="preAnswerTrueIndicator AnswerTrueIndicator rel langItem" data-languageItem="trueText">';
            html += '<div class="answerIconIndicatorTrue">';
            html += HShell.consts.iconsObj.circle_border;
            html += '</div>';
            html += '<div class="answerIconIndicatorTrue TrueFalseTick">';
            html += HShell.consts.iconsObj.icon_true;
            html += '</div>';
            html += '</div>';
        } else {
            html += '<div class="preAnswerFalseIndicator AnswerFalseIndicator rel langItem" data-languageItem="falseText">';
            html += '<div class="answerIconIndicatorFalse">';
            html += HShell.consts.iconsObj.circle_border;
            html += '</div>';
            html += '<div class="answerIconIndicatorFalse TrueFalseTick">';
            html += HShell.consts.iconsObj.icon_false;
            html += '</div>';
            html += '</div>';
        }
    }

    html += '</div>';

    return html;
}

// ________________________________________________________

function buildPostAssessment() {
    var assessmentTemplate = HShell.contentSetup.fancyAssessment ? 'fancy' : 'standard'; // for now templates can be 'fancy' and standard
    var html = '';
    html += '<div id="postAssessementContainer" class="rel">';
    html += getAssessmentTemplate(assessmentTemplate, SL.UI.postTitle);
    html += '</div>';

    $('#eLContentContainer').prepend(html);
    HShell.core.renderComponents($('#eLContentContainer'));
    attachPieToProgressBarElements();
}

function buildFinalSurvey() {
    var html = '';
    html += '<div id="postAssessmentContainer" class="rel">';
    html += getFinalSurveyTemplate(SL.UI.finalSurveyTitle);
    html += '</div>';

    $('#eLContentContainer').prepend(html);
    HShell.core.renderComponents($('#eLContentContainer'));
    attachPieToProgressBarElements();
}


function buildSurvey() {
    $('#surveyContainer .infoBtnPopUpTextCorrect.rel.langItem').empty();
    var assessmentTemplate = HShell.contentSetup.fancyAssessment ? 'fancy' : 'standard'; // for now templates can be 'fancy' and standard
    var html = '';
    html += '<div id="surveyContainer" class="rel">';
    html += getAssessmentTemplate(assessmentTemplate, SL.UI.postTitle);
    html += '</div>';

    $('#eLContentContainer').empty().prepend(html);
    HShell.core.renderComponents($('#eLContentContainer'));
    attachPieToProgressBarElements();
}

function getFinalSurveyTemplate(title) {
    var html = '';
    html += '<div class="standardAssessmentTemplateContainer finalSurveyTemplateContainer">';

    html += '<div class="assessmentHeaderContainer rel">';
    html += '<h2 id="assessmentTypeIndicator" class="rel">' + title + '</h2>';

    // html += '<div class="rel assessmentProgressContainer">';
    // html += '1 ' + '/' + HShell.content.preAssessObj.questionsNum;
    // html += '</div>';

    html += '</div>';
    html += '<div id="questionsContainer" class="assessmentQuestionsContainer rel"></div>';
    html += '<div id="buttonsContainer" class="buttonsContainer"  aria-live="off">';
    html += HShell.core.getComponent('Button').init({ id: 'submitQuizReskin', text: SL.UI.label_Submit, classes: 'btnWrapper btnFinalSurvey' });
    html += '</div>';
    html += '</div>';

    return html;
}

function getAssessmentTemplate(template, title) { // template can be 'standard' or 'fancy'
    if (template == 'fancy') {
        return getFancyAssessmentTemplate(title);
    } else if (template == 'standard') {
        return getStandardAssessmentTemplate(title);
    } else {
        return template + ' cannot be found as assessment tempalate';
    }
}

function getStandardAssessmentTemplate(title) {
    var html = '';

    html += '<div class="standardAssessmentTemplateContainer">' +
        '<div class="assessmentHeaderContainer rel">' +
        '<h2 id="assessmentTypeIndicator" class="rel">' + title + '</h2>' +
        '<div class="rel assessmentProgressContainer">' +
        '1 ' + '/' + HShell.content.preAssessObj.questionsNum +
        '</div>' +
        '</div>' +

        '<div id="questionsContainer" class="assessmentQuestionsContainer rel"></div>' +
        '<div id="buttonsContainer" class="buttonsContainer"  aria-live="off">' +
        HShell.core.getComponent('Button').init({ id: 'submitQuizReskin', text: SL.UI.label_Submit, classes: 'btnWrapper' }) +
        '<div class="feedbackIndicatorContainer">' +
        '<div class="correctWrongIndicator rel">' +
        '<div class="infoBtnPopUpTextIconCorrect iconHolder" aria-hidden="true">' + HShell.consts.iconsObj.icon_check + '</div>' +
        '<div class="infoBtnPopUpTextIconWrong iconHolder" aria-hidden="true">' + HShell.consts.iconsObj.icon_exit + '</div>' +
        '<div class="infoBtnPopUpTextCorrect rel langItem"  data-languageItem="correct">' + SL.UI.correct + '</div>' +
        '<div class="infoBtnPopUpTextWrong rel langItem"  data-languageItem="incorrect">' + SL.UI.incorrect + '</div>' +
        '</div>' +
        '<div class="iconHolder infoBtn rel">' +
        '<div class="infoBtnIconHolderContainer noSelect" tabindex="0" role="button" aria-label="' + SL.UI.info + '">' +
        '<span>' + HShell.consts.iconsObj.icon_header_TutorialIcon + '</span>' +
        '</div>' +
        '<div class="infoBtnPopUpContainer abs">' +
        '<div class="infoBtnPopUpTextContainer rel"></div>' +
        '<div class="infoBtnPopUpCloseButton iconHolder">' + HShell.consts.iconsObj.icon_Close + '</div>' +
        '<div class="infoBtnPopUpArrow abs">' +
        '<div class="infoBtnPopUpArrow after"></div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';

    return html;
}

function getFancyAssessmentTemplate(title) {
    var html = '';
    html += '<div class="fancyAssessmentTemplateContainer">';

    html += '<div class="assessmentHeaderContainer rel">';
    html += '<h2 id="assessmentTypeIndicator" class="rel">' + title + '</h2>';

    html += buildProgressBar();

    //for accessibility
    //assessmentProgressContainer should be hidden for the user, but visible for the screen readers, in order to be announced on each question
    html += '<div class="rel assessmentProgressContainer">';
    html += '1 ' + '/' + HShell.content.preAssessObj.questionsNum;
    html += '</div>';

    html += '</div>';
    html += '<div id="questionsContainer" class="assessmentQuestionsContainer rel">';

    html += '<div class="feedbackContainer">'
    html += '   <div class="feedbackIndicatorContainer">';
    html += '       <div class="correctWrongIndicator rel">';
    html += '           <div class="infoBtnPopUpTextCorrect rel langItem"  data-languageItem="correct">' + SL.UI.correct + '</div>';
    html += '           <div class="infoBtnPopUpTextWrong rel langItem"  data-languageItem="incorrect">' + SL.UI.incorrect + '</div>';
    html += '       </div>';
    html += '       <div class="closeBtnContainer rel" tabindex="0" role="button" aria-label="Close the feedback">';
    html += CLOSE_ICON_SVG;
    html += '       </div>';
    html += '       <div class="infoBtnPopUpTextContainer rel"></div>';
    html += '   </div>';
    html += '</div>';

    html += '</div>';
    html += '<div id="buttonsContainer" class="buttonsContainer"  aria-live="off">';

    // remove for the new design
    // html += '   <div class="iconHolder infoBtnMobile rel">';
    // html += '       <div class="infoBtnIconHolderContainer noSelect" tabindex="0" role="button" aria-label="' + SL.UI.info + '">';
    // html += '           <span>' + HShell.consts.iconsObj.icon_header_TutorialIcon + '</span>';
    // html += '       </div>';
    // html += '   </div>';
    html += '   <div class="readFeedbackAgain">' 
    html += '       <div class="answerIndicator" aria-hidden="true">';
    html += '           <div class="answerIconIndicator">';
    html += HShell.consts.iconsObj.circle_border;
    html += '           </div>';
    html += '           <div class="answerIconIndicator trueFalseTick">';
    html += '               <span class="true">' + HShell.consts.iconsObj.icon_true + '</span>';
    html += '               <span class="false">' + HShell.consts.iconsObj.icon_false + '</span>';
    html += '           </div>';
    html += '       </div>';
    html += '       <div class="readFeedbackAgainText" role="button" tabindex="0">';
    html += SL.UI.label_readFeedbackAgain;
    html += '       </div>';
    html += '   </div>';
    // html += '   <div class="correctWrongIndicatorMobile rel">';
    // html += '       <div class="infoBtnPopUpTextIconCorrect iconHolder" aria-hidden="true">' + HShell.consts.iconsObj.icon_check + '</div>';
    // html += '       <div class="infoBtnPopUpTextIconWrong iconHolder" aria-hidden="true">' + HShell.consts.iconsObj.icon_exit + '</div>';
    // html += '       <div class="infoBtnPopUpTextCorrect rel langItem"  data-languageItem="correct"><span>' + SL.UI.correct + '</span></div>';
    // html += '       <div class="infoBtnPopUpTextWrong rel langItem"  data-languageItem="incorrect">' + SL.UI.incorrect + '</div>';
    // html += '   </div>';

    html += HShell.core.getComponent('Button').init({ id: 'submitQuizReskin', text: SL.UI.label_Submit, classes: 'btnWrapper' });

    html += '</div>';

    return html;
}

function buildProgressBar() {
    var html = '';

    var oneSegment = HShell.consts.iconsObj.icon_circle, // 1%
        endBorder = HShell.consts.iconsObj.icon_ring_role,
        endSegment = HShell.consts.iconsObj.icon_circle;

    html += '<div class="assessmentProgressBar rel noSelect">';
    html += '<div class="progressBarWrapper">';
    html += '   <span class="assessmentProgressBarSegments">';
    html += '       <span class="purpleSegments"></span>';
    html += '       <span class="graySegments"></span>';
    html += '   </span>';
    html += '</div></div>';

    return html;
}

function updateProgressBar(currentQuestionIndex, totalQuestions) {
    var purpleSegmentsContainer = $('.purpleSegments'),
        graySegmentsContainer = $('.graySegments'),
        endSegmentContainer = $('.assessmentProgressBarEndSegment');

    var oneQuestionPercentage = (1 / totalQuestions) * 100;

    // if (currentQuestionIndex == totalQuestions) {
    //     endSegmentContainer.addClass('inProgress');
    //     graySegmentsContainer.css('width', '100%').hide();
    //     purpleSegmentsContainer.css('width', '100%');

    // } else {
    purpleSegmentsContainer.css('width', (Math.round((currentQuestionIndex - 1) * oneQuestionPercentage)) + '%');
    graySegmentsContainer.css('width', (Math.round((currentQuestionIndex - 1) * oneQuestionPercentage) + Math.round(oneQuestionPercentage)) + '%');
    // }
}

function makeCurrentQuestionPassedOnProgressBar() {
    var grayElements = $('.graySegments').css('width');
    $('.purpleSegments').css('width', grayElements);

    // $('.assessmentProgressBarEndSegment.inProgress').removeClass('inProgress').addClass('finished');
}

// ________________________________________________________

// function buildOnePostEvalPage() {
//     var html =  '';
//     html += '<div class="pEvalPageCotnainer rel">';
//     html += '<div class="pEvalContentContainer">';
//     html += '<div class="pEvalContLeftContainer">';
//     html += '<div class="pEvalContLNoPassText langItem"  data-languageItem="didNotPass">' + SL.UI.didNotPass + '</div>';
//     html += '<div class="pEvalContLeftNumber">';
//     html += '<div class="pEvalContentLeftNumberInner">' + HShell.autoSetup.postAssessWrongModules.length + '</div>';
//     html += '<div class="pEvalContentLeftBG abs iconHolder" aria-hidden="true">' + HShell.consts.iconsObj.icon_circle + '</div>';
//     html += '</div>';
//     html += '<div class="pEvalContLNoModulesText langItem" data-languageItem="modules">' + SL.UI.modules + '</div>';
//     html += '</div>';
//     html += '<div class="pEvalContRightContainer">';
//     html += '<div class="pEvalContRModlesList" role="list" aria-label="Modules failed">';

//     $(HShell.autoSetup.postAssessWrongModules).each(function (i, item) {
//         var tempMod;

//         $(SL.allModules).each(function (k, item2) {
//             if (item2.mod_id == item) tempMod = item2;
//         });

//         html += '<div class="pEvalOneWrongContainer" role="listitem">';
//         html += '<div class="pEvalOneWrongImage iconHolder" aria-hidden="true">' + HShell.consts.iconsObj.icon_exit + '</div>';
//         html += '<div class="pEvalOneWrongTitle langItem moduleItem" data-moduleingroupid="' + tempMod.moduleInGroupId +
//             '" data-modulegarrayid="' + tempMod.moduleGroupId + '" data-languageitem="title">' + tempMod.title + '</div>';
//         html += '</div>';
//     });

//     html += '</div>';
//     html += '</div>';
//     html += '<div class="pEvalContRAdvice langItem" data-languageItem="advice">' + SL.UI.advice + '</div>';
//     html += '</div>';
//     html += '<div class="pEvalButtonsContainer buttonsContainer"  aria-live="off">';
//     // html += '<button id="pEvalReview" class="langItem" data-languageItem="reviewLearning">' + SL.UI.reviewLearning + '</button>';
//     html += addButton('pEvalReviewReskin', SL.UI.reviewLearning, '', 'btnWrapper');
//     // html += '<button id="pEvalRetry" class="langItem" data-languageItem="retryQuiz">' + SL.UI.retryQuiz + '</button>';
//     html += addButton('pEvalRetryReskin', SL.UI.retryQuiz, '', 'btnWrapper');
//     html += '</div>';
//     html += '</div>';

//     $('#eLContentContainer').prepend(html);
//     reskinAllContent($('#eLContentContainer'));

//     HShell.a11y.speak(SL.UI.didNotPass + ' ' + HShell.autoSetup.postAssessWrongModules.length + ' ' + SL.UI.modules + '. ' + SL.UI.advice);
// }

function buildOnePostEvalPage() {
    var html = '';

    var columnSizePx = 290, columns = [], elementsPerColumn = 6; //vars for fancy assessment only
    var pEvalPageCotnainerClass = '';
    var class_reviewLearningVisible = +HShell.content.configXMLObject.config.mainSettings.postAssessment.reviewLearning ? '' : 'hidden';

    if (HShell.contentSetup.fancyAssessment) {
        pEvalPageCotnainerClass = 'fancyPEvalPageCotnainer';
        var postAssessmentWrongModules = HShell.autoSetup.postAssessWrongModules.slice(0); //clone the array

        while (postAssessmentWrongModules.length > 0) {
            columns.push(postAssessmentWrongModules.splice(0, elementsPerColumn));
        }
    } else {
        pEvalPageCotnainerClass = 'pEvalPageCotnainer';
    }

    html += '<div class="' + pEvalPageCotnainerClass + ' rel">';
    html += '<div class="pEvalContentContainer">';
    html += '<div class="pEvalContLeftContainer">';
    html += '<div class="pEvalContLNoPassText langItem"  data-languageItem="didNotPass">' + SL.UI.didNotPass + '</div>';
    html += '<div class="pEvalContLeftNumber">';

    if (HShell.contentSetup.fancyAssessment) {
        // html += buildProgressChartContainer(HShell.autoSetup.postAssessFinishedModules.length, HShell.autoSetup.postAssessFinishedModules.length + HShell.autoSetup.postAssessWrongModules.length);
        html += buildProgressChartContainer(HShell.content.postAssessObj.correctAnswers, HShell.content.postAssessObj.questionsNum);
    } else {
        html += '<div class="pEvalContentLeftNumberInner">' + HShell.autoSetup.postAssessWrongModules.length + '</div>';
        html += '<div class="pEvalContentLeftBG abs iconHolder" aria-hidden="true">' + HShell.consts.iconsObj.icon_circle + '</div>';
    }

    html += '</div>';
    // html += '<div class="pEvalContLNoModulesText langItem" data-languageItem="modules">' + SL.UI.modules + '</div>'; // disable for the new design
    html += '</div>';
    /*html += '<div class="pEvalContRightContainer">';

    if (HShell.contentSetup.fancyAssessment) {
        if (HShell.autoSetup.postAssessWrongModules.length > 12) {
            html += '<div class="arrowLeft noSelect">' + HShell.consts.iconsObj.icon_arrow_back + '</div>';
            html += '<div class="arrowRight noSelect">' + HShell.consts.iconsObj.icon_arrow_forward + '</div>';
        }
        html += '<div class="pEvalContRModlesList" style="width: ' + (columns.length * (columnSizePx + 10)) + 'px" role="list" aria-label="Modules failed">';

        $(columns).each(function (i, column) {
            html += '<div class="column" style="width: ' + columnSizePx + 'px">';
            $(column).each(function (j, item) {
                var tempMod;

                $(SL.allModules).each(function (k, item2) {
                    if (item2.mod_id == item) tempMod = item2;
                });

                html += '<div class="pEvalOneWrongContainer" role="listitem">';
                html += '<div class="pEvalOneWrongImage iconHolder" aria-hidden="true">' + HShell.consts.iconsObj.icon_exit + '</div>';
                html += '<div class="pEvalOneWrongTitle langItem moduleItem" data-moduleingroupid="' + tempMod.moduleInGroupId +
                    '" data-modulegarrayid="' + tempMod.moduleGroupId + '" data-languageitem="title">' + tempMod.title + '</div>';
                html += '</div>';
            });

            html += '</div>';
        });
    } else {
        html += '<div class="pEvalContRModlesList" role="list" aria-label="Modules failed">';
        $(HShell.autoSetup.postAssessWrongModules).each(function (i, item) {
            var tempMod;

            $(SL.allModules).each(function (k, item2) {
                if (item2.mod_id == item) tempMod = item2;
            });

            html += '<div class="pEvalOneWrongContainer" role="listitem">';
            html += '<div class="pEvalOneWrongImage iconHolder" aria-hidden="true">' + HShell.consts.iconsObj.icon_exit + '</div>';
            html += '<div class="pEvalOneWrongTitle langItem moduleItem" data-moduleingroupid="' + tempMod.moduleInGroupId +
                '" data-modulegarrayid="' + tempMod.moduleGroupId + '" data-languageitem="title">' + tempMod.title + '</div>';
            html += '</div>';
        });
    }

    html += '</div>';*/ // disable for the new design
    
    html += '</div>';
    html += '<div class="pEvalContRAdvice langItem" data-languageItem="advice">' + SL.UI.advice + '</div>';
    html += '</div>';
    html += '<div class="pEvalButtonsContainer buttonsContainer"  aria-live="off">';
    // html += '<button id="pEvalReview" class="langItem" data-languageItem="reviewLearning">' + SL.UI.reviewLearning + '</button>';
    html += HShell.core.getComponent('Button').init({ id: 'pEvalReviewReskin', text: SL.UI.reviewLearning, classes: ('btnWrapper inverted' + class_reviewLearningVisible) });
    // html += '<button id="pEvalRetry" class="langItem" data-languageItem="retryQuiz">' + SL.UI.retryQuiz + '</button>';
    html += HShell.core.getComponent('Button').init({ id: 'pEvalRetryReskin', text: SL.UI.retryQuiz, classes: 'btnWrapper' });
    html += '</div>';
    html += '</div>';

    $('#eLContentContainer #postAssessementContainer').hide();
    $('#eLContentContainer').prepend(html);
    HShell.core.renderComponents($('#eLContentContainer'));
    reskinAllContent($('#eLContentContainer'));

    if (HShell.contentSetup.fancyAssessment) {
        drawProgressChart('.chart');

        var pageCounter = 1;
        var maxPagesNumber = Math.floor(columns.length / 2) + (columns.length % 2);
        $('.pEvalContRightContainer .arrowLeft').on('click', function () {
            if (pageCounter > 1) {
                pageCounter--;

                moveToPage(pageCounter);
            }
        });

        $('.pEvalContRightContainer .arrowRight').on('click', function () {
            if (pageCounter < maxPagesNumber) {
                pageCounter++;

                moveToPage(pageCounter);
            }
        });

        function moveToPage(page) {
            var onePageWidth = columnSizePx * 2;

            $('.pEvalContRModlesList').animate(
                { left: -((page - 1) * onePageWidth) + 'px' },
                {
                    duration: 200
                });
        }
    }

    HShell.a11y.speak(SL.UI.didNotPass + ' ' + HShell.autoSetup.postAssessWrongModules.length + ' ' + SL.UI.modules + '. ' + SL.UI.advice);
}

// ________________________________________________________

function buildOnePostEvalBShellPage(procentage) {
    var title = '',
        text = '',
        classMod = '';

    if (HShell.core.checkThresholdPercentagePassed(procentage)) {
        title = SL.UI.quizPassed;
        text = SL.UI.quizPassedText;
        classMod = 'passed';
    } else {
        title = SL.UI.quizNotPassed;
        text = SL.UI.quizNotPassedText;
        classMod = 'notPassed';
    }
    var html = '';
    html += '<div class="pEvalBshellPageCotnainer ' + classMod + '" >';
    html += '<div class="pEvalBshellTitle elSubTitleContainer">' + title + '</div>';
    // html += '<div class="pEvalBshellContentContainer">';
    html += '<div class="pEvalBshellProgress"><div class="number '+classMod+'">' + procentage + '%</div></div>';
    html += '<div class="pEvalBshellContentContainer">' + text + '</div>';
    // html += '<div class="pEvalBshellLeftContainer">';
    // html += '<div class="pEvalContentLeftBG abs iconHolder">' + HShell.consts.iconsObj.icon_circle + '</div>';
    // html += '</div>';
    // html += '</div>';
    html += '<div class="pEvalBshellButtonsContainer buttonsContainer"  aria-live="off">';
    html += HShell.core.getComponent('Button').init({ id: 'pEvalBshellReview', text: SL.UI.reviewLearning, classes: 'btnWrapper inverted' });
    html += HShell.core.getComponent('Button').init({ id: 'pEvalBshellRetry', text: SL.UI.retryQuiz, classes: 'btnWrapper' });
    html += HShell.core.getComponent('Button').init({ id: 'pEvalBshellConfirm', text: SL.UI.confirm, classes: 'btnWrapper' });
    html += HShell.core.getComponent('Button').init({ id: 'pAllOkFinExitBtnReskin', text: SL.UI.exit, classes: 'btnWrapper' });
    
    // html += '<button id="pEvalBshellReview">' + SL.UI.reviewLearning + '</button>';
    // html += '<button id="pEvalBshellRetry">' + SL.UI.retryQuiz + '</button>';
    // html += '<button id="pEvalBshellConfirm">' + SL.UI.confirm + '</button>';
    html += '</div>';
    html += '</div>';

    $('#eLContentContainer').empty().prepend(html);
    // $('.pEvalBshellRContent').html(text);
    HShell.core.renderComponents($('#eLContentContainer'));
    reskinAllContent($('#eLContentContainer'));
}

// ________________________________________________________

function buildOneBshellConfirmationNoPostAssessment() {
    buildGenericContainer(SL.UI.course_title, '', '', SL.UI.description);

    var html = '';
    html += '<div class="pEvalBshellPageCotnainer passed" >';
    html += '<div class="pEvalBshellTitle elSubTitleContainer">' + SL.UI.wellDone + '</div>';
    // html += '<div class="pEvalBshellContentContainer">';
    html += '<div class="pEvalBshellProgress"><div class="number passed">100%</div></div>';
    html += '<div class="pEvalBshellContentContainer">' + SL.UI.wellDoneTextNoPostAssess + '</div>';
    // html += '<div class="pEvalBshellLeftContainer">';
    // html += '<div class="pEvalContentLeftBG abs iconHolder">' + HShell.consts.iconsObj.icon_circle + '</div>';
    // html += '</div>';
    // html += '</div>';
    html += '<div class="pEvalBshellButtonsContainer buttonsContainer"  aria-live="off">';

    html += HShell.core.getComponent('Button').init({ id: 'pEvalBshellConfirmBtnReskin', text: SL.UI.confirm, classes: 'btnWrapper' });
    html += HShell.core.getComponent('Button').init({ id: 'pAllOkFinHomeBtnReskin', text: SL.UI.home, classes: 'btnWrapper inverted' });
    html += HShell.core.getComponent('Button').init({ id: 'pAllOkFinExitBtnReskin', text: SL.UI.exit, classes: 'btnWrapper' });
    // html += '<button id="pEvalBshellConfirm" class="langItem"    data-languageItem="confirm">' + SL.UI.confirm + '</button>';
    // html += '<button id="pAllOkFinHomeBtn" class="langItem rel"    data-languageItem="home" style="display:none;">' + SL.UI.home + '</button>';
    // html += '<button id="pAllOkFinExitBtn" class="langItem rel"    data-languageItem="exit" style="display:none;">' + SL.UI.exit + '</button>';
    html += '</div>';
    html += '</div>';

    $('#eLContentContainer').empty().prepend(html);
    HShell.core.renderComponents($('#eLContentContainer'));
    reskinAllContent($('#eLContentContainer'));
}


// ________________________________________________________

function buildOnePostAllFinPage() {
    var welDoneText = SL.UI.welDoneText;
    var welDoneTextDataItem = 'welDoneText';
    try {
        // --------- We take distinct values from answersArray and quizArray because there can be more than one question per module
        var unique = {},
            distinctAnswersArray = [],
            distinctQuizArray = [];

        var array = HShell.content.preAssessObj.answersArray;
        for (var i in array) {
            if (array.hasOwnProperty(i)) {
                if (typeof (unique[array[i].assessmentModuleId]) == 'undefined') {
                    distinctAnswersArray.push(array[i].assessmentModuleId);
                }
                unique[array[i].assessmentModuleId] = 0;
            }
        }

        unique = {};
        array = HShell.content.preAssessObj.quizArray;
        for (var j in array) {
            if (array.hasOwnProperty(j)) {
                if (typeof (unique[array[j].module]) == 'undefined') {
                    distinctQuizArray.push(array[j].module);
                }
                unique[array[j].module] = 0;
            }
        }
        // ------------------

        if (!HShell.contentSetup.have_post_a ||
            (HShell.content.preAssessObj.finishedModules.length > 0 &&
                (distinctAnswersArray.length == HShell.content.preAssessObj.finishedModules.length ||
                    distinctQuizArray.length == HShell.content.preAssessObj.finishedModules.length))) {
            welDoneText = SL.UI.welDoneTextPreAllCorrect;
            welDoneTextDataItem = 'welDoneTextPreAllCorrect';
        }
    } catch (e) {
        HShell.utils.trace(e, '2.UI -> buildOnePostAllFinPage()');
    }

    var html = '';

    html += '<div class="pAllOkFinPageContaienr">' +
        '<h2 id="pAllOkFinTitleContainer" class="elSubTitleContainer hulk langItem" data-languageItem="wellDone">' + SL.UI.wellDone + '</h2>' +
        
        buildProgressChartContainer(1, 1, false, true) + // build 100% progress bar

        '<div id="pAllOkFinContent" class="rel langItem" data-languageItem="' + welDoneTextDataItem + '">' + welDoneText + '</div>' +
        '<div id="pAllOkFinButtonsContainer" class="buttonsContainer"  aria-live="off">' +
        HShell.core.getComponent('Button').init({ id: 'pAllOkFinConfirmBtnReskin', text: SL.UI.confirm, classes: 'btnWrapper' }) +
        // HShell.core.getComponent('Button').init({ id: 'pAllOkFinHomeBtnReskin', text: SL.UI.home, classes: 'btnWrapper inverted' }) +
        HShell.core.getComponent('Button').init({ id: 'pAllOkFinExitBtnReskin', text: SL.UI.exit, classes: 'btnWrapper' }) +
        '</div>' +
        '</div>';

    $('#eLContentContainer #postAssessementContainer, #eLContentContainer .pAllOkFinPageContaienr').remove();
    $('#eLContentContainer').empty().prepend(html);
    HShell.core.renderComponents($('#eLContentContainer'));
    $('#SCORM_Container').scrollTop(0);
    reskinAllContent($('#eLContentContainer'));

    var scormVersion = pipwerks && pipwerks.SCORM ? pipwerks.SCORM.version || '2004' : '2004';
    if(scormVersion == '2004') {
        SCORM.SCORMSetOneItem('cmi.success_status', "passed");
    } else {
        SCORM.SCORMSetOneItem('cmi.core.lesson_status', "passed");
    }
    HShell.storage.commitData('immediate'); //new line

    drawProgressChart('.chart');

    $('#pAllOkFinHomeBtnReskin').click(function () {
        removePostAssessmentScreen();
        clearPostAssessObj();
        HShell.storage.setCourseAsCompleated();
        $('#postAssessmentLaunchButton').addClass('finished').unbind('click').removeAttr('tabindex').removeAttr('role');
        $('#postAssessmentLaunchButtonText').text(SL.UI.postAssessmentDone).attr('data-languageitem', 'postAssessmentDone');
        $('#mainContentContainer').show();
    });

    HShell.a11y.speak(SL.UI.wellDone + ' ' + welDoneText);
    // |rework| the timeout is for testing on IE9 and IE10, ieRefresh is taking the focus, so we should focus the button after that.
    //Maybe we can make a function to check if its IE9 or 10 and trigger it with timeout if true. But the best is to get rid of ieContainerRefresh function
    //setTimeout(function () {
    // $('#pAllOkFinConfirmBtnReskin').focus();
    //}, 100);

    var scormVersion = pipwerks && pipwerks.SCORM ? pipwerks.SCORM.version || '2004' : '2004';
    if(scormVersion == '2004') {
        SCORM.SCORMSetOneItem('cmi.success_status', "passed");
    } else {
        SCORM.SCORMSetOneItem('cmi.core.lesson_status', "passed");
    }
    HShell.storage.commitData('immediate');
}

// ________________________________________________________________________________________________________________________________

// *************************************
// --- Pre Assessment "Thank you" screen
// *************************************

// function buildPreAssessmentThankYou() {
//     HShell.content.preAssessObj.completion_status = 'completed';
//     var descriptionText = SL.UI.preAThankYouDescription;

//     descriptionText = descriptionText.replace('{correctQuestions}', HShell.content.preAssessObj.correctAnswers);
//     descriptionText = descriptionText.replace('{allQuestions}', HShell.content.preAssessObj.questionsNum);

//     var html = '';
//     html += '<div id="preAssessThankYouContainer" class="customWindowContent">';
//     html += '<h2 id="pAThankYouTitleContainer" class="elSubTitleContainer hulk">' + SL.UI.preAThankYou + '</h2>';
//     html += '<div id="pAThankYouContent" class="rel">' + descriptionText + '</div>';
//     html += '<div id="pAThankYouButtonsContainer" class="buttonsContainer"  aria-live="off">';
//     //html += '<button id="pAThankYouContinueBtn">' + SL.UI.preAStartLearning + '</button>';
//     html += addButton('pAThankYouContinueBtnReskin', SL.UI.preAStartLearning, '', 'btnWrapper');
//     html += '</div>';
//     html += '</div>';

//     $('#eLContentContainer').prepend(html);
//     //reskinBTNs();

//     HShell.autoSetup.activeWindow = $('#preAssessThankYouContainer').showWindow();
//     setTimeout(function () { // --- Needs a delay, because it is mixed form saving of data on the previous step. (Sorry for the awesome explanation)
//         HShell.a11y.speak(SL.UI.preAThankYou + ' ' + descriptionText);
//     }, 2000);
// }

function buildPreAssessmentThankYou() {
    HShell.content.preAssessObj.completion_status = 'completed';
    var descriptionText = SL.UI.preAThankYouDescription;

    descriptionText = descriptionText.replace('{correctQuestions}', '<b>' + HShell.content.preAssessObj.correctAnswers + '</b>');
    descriptionText = descriptionText.replace('{allQuestions}', '<b>' + HShell.content.preAssessObj.questionsNum + '</b>');

    var html = '';

    var containerClass = '';
    if (HShell.contentSetup.fancyAssessment) {
        containerClass = 'fancyThankYouScreen';
    } else {
        containerClass = 'customWindowContent';
    }

    html += '<div id="preAssessThankYouContainer" class="' + containerClass + '">';
    html += '<h2 id="pAThankYouTitleContainer" class="elSubTitleContainer hulk">' + SL.UI.preAThankYou + '</h2>';
    html += '<div class="pAThankYouContent">' + descriptionText + '</div>';

    if (HShell.contentSetup.fancyAssessment) {
        html += buildProgressChartContainer(HShell.content.preAssessObj.correctAnswers, HShell.content.preAssessObj.questionsNum, true);
    }

    html += '<div class="pAThankYouContent pAThankYouContentBottom">' + SL.UI.preAThankYouDescriptionBottom + '</div>' +
        '<div id="pAThankYouButtonsContainer" class="buttonsContainer"  aria-live="off">' +
        //html += '<button id="pAThankYouContinueBtn">' + SL.UI.preAStartLearning + '</button>';
        HShell.core.getComponent('Button').init({ id: 'pAThankYouContinueBtnReskin', text: SL.UI.preAStartLearning, classes: 'btnWrapper' }) +
        '</div>' +
        '</div>';

    $('#eLContentContainer').prepend(html);
    HShell.core.renderComponents($('#eLContentContainer'));
    //reskinBTNs();

    if (HShell.contentSetup.fancyAssessment) {
        drawProgressChart('.chart');
    }

    HShell.autoSetup.activeWindow = $('#preAssessThankYouContainer').showWindow();
    setTimeout(function () { // --- Needs a delay, because it is mixed form saving of data on the previous step. (Sorry for the awesome explanation)
        HShell.a11y.speak(SL.UI.preAThankYou + '! ' + $('.pAThankYouContent').text());
    }, 2000);
}

function buildProgressChartContainer(answeredQuestions, totalQuestions, showNumberOfCorrectAnswersNotRemaining, isWellDoneScreen) { // showNumberOfCorrectAnswersNotRemaining will put number of correctly answered questions instead of remaining questions
    var html = '';
    var percents = (answeredQuestions / totalQuestions) * 100;
    var questionsNumber = showNumberOfCorrectAnswersNotRemaining ? answeredQuestions : totalQuestions - answeredQuestions;

    html += '<div id="pAThankYouProgress" class="rel" aria-hidden="true">';
    html += '   <div class="chart" data-percent="' + percents + '">';
    // html += '       <div class="chartFlag">' + HShell.consts.iconsObj.flag_assessment + '</div>';
    html += '       <div class="chartNumbersContainer">';
    
    if (!isWellDoneScreen) {
        html += '<div class="chartNumbers">' + questionsNumber + '/' + totalQuestions + '</div>';
    } else {
        html += '<div class="chartIcon">' + STAR_SVG + '</div>'
    }

    html += '       </div>';
    html += '   </div>';
    html += '</div>';

    return html;
}

function drawProgressChart(chartSelector) {
    var canvas = document.createElement('canvas');

    if (typeof FlashCanvas != 'undefined') {
        FlashCanvas.initElement(canvas);
        FlashCanvas.setOptions({
            disableContextMenu: true
        });
    }

    $(function () {
        $(chartSelector).easyPieChart({
            barColor: '#048A17',
            lineWidth: 17,
            animate: false,
            lineCap: 'square',
            trackWidth: 10,
            trackColor: '#e0312b',
            size: 167,
            scaleColor: false,
            scaleLength: 0
        });

        // below is the drawing of the outer/border circle
        var ctx = $(chartSelector + ' canvas')[0].getContext('2d');
        ctx.beginPath();
        ctx.arc(0, 0, 81, 0, Math.PI * 2);
        ctx.strokeStyle = '#c8c6c5';
        ctx.lineWidth = 1;
        ctx.stroke();

    });
}

// ________________________________________________________________________________________________________________________________

// ****************************
// --- Module Selection
// ****************************

/**
 * @todo The hasHeader parameter must compleatly remove the header. For many other components rely on the header to exist, so we can not fully remove it
 */
function buildModuleSelection() {
    var moduleSelectOptions = HShell.content.configXMLObject.config.mainSettings.moduleSelect || {},
        type = moduleSelectOptions.type ? moduleSelectOptions.type.__text : '',
        modSelectOptions = HShell.consts.moduleSelectOptions,
        moduleSelectComponentName = modSelectOptions[type] || modSelectOptions['ModuleSelect_Rows'],
        hasHeader = moduleSelectOptions.header === undefined ? true: !!+moduleSelectOptions.header;

    // --- Used to check if the selected role have more than one language
    var languagesCount = HShell.utils.countProperties(HShell.content.selected_roleObj.label_text);
    if (languagesCount == 1) {
        HShell.contentSetup.language_select = false;
    }

    $('#SCORM_Container').append(
        // HShell.core.getComponent('MainHeader').init({isVisible: hasHeader}) +
        HShell.core.getComponent(moduleSelectComponentName).init({configXmlOptions: moduleSelectOptions})
    );
    HShell.core.renderComponents('#SCORM_Container');
}

// ________________________________________________________________________________________________________________________________

function buildOneLanguageHeaderItem(lang, langId) {
    var html = '';
    html += '<li role="option" class="oneHeaderLanguageContainer noSelect" langId="' + langId + '" langCode="' + lang.code + '">';
    html += '<label for="' + lang.label_text + '" class="oneLanguagetitle rel">' + lang.label_text + '</label>';
    html += '<input id="' + lang.label_text + '" type="radio" class="oneFlagContainer" name="Select Language"></input>';
    html += '<div class="oneLanguageFlagContaienr doNotReskin rel">';
    html += '<img class="oneLanguageSmallIcon"	src="content/' + lang.folder + '/img/' + lang.imgUrl + '">';
    html += '<img class="oneLanguageBigIcon"	src="content/' + lang.folder + '/img/' + lang.imgUrlBig + '">';
    html += '</div>';
    html += '</li>';

    return html;
}

// ________________________________________________________

function buildInModuleQuiz(modObj, modulesGroupArrayId, modulesArrayId) {
    var html = '';

    if (modObj.quiz.length) {

        html += '<div class="oneModuleQuizContainer rel">';
        html += '<div class="oneModQuHeaderContainer rel">';
        html += '<div class="oneModQuTitle rel langItem noSelect" data-languageItem="reflectPoint">' + SL.UI.reflectPoint + '</div>';
        html += '<div class="oneModQuStepsContainer">';
        html += '<div class="oneModQuCurrentQuestion rel">' + 1 + '</div>';
        html += '<div class="oneModQuOf rel langItem" data-languageItem="of">' + SL.UI.of + '</div>';
        html += '<div class="oneModQuAllQuestions rel">' + 0 + '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="oneModQuestionsContainer rel">';

        modObj.quiz.find('question').each(function () {
            var type = $(this).attr('type');
            var questionId = $(this).attr('id');
            var thisAnswer = 0;
            html += '<div class="oneModOneQuestionContainer  rel" qGroupId="' + (Number(modulesGroupArrayId) + 1) + '" modQId="' + modulesArrayId + '" qid="' + Number(questionId) + '">';
            html += '<p class="oneModOneQuQuestionText moduleItem moduleQuizItem langItem" data-modulesGroupId="' + modulesGroupArrayId + '" data-moduleInGroupId="' + modObj.moduleInGroupId + '" data-languageItem="questionText" data-moduleQuizId="' + questionId + '" data-moduleGroupTask="questionText" data-moduleGroupTaskId="0">' + $(this).find('questionText').first().text() + '</p>';
            html += '<ul class="oneModOneQuAnswersContainer rel">';
            $(this).find('answer').each(function () {
                thisAnswer++;
                var inputId = 'mod' + modObj.mod_id + 'QizQu' + questionId + 'Answer' + thisAnswer;
                var inputName = 'mod' + modObj.mod_id + 'QizQu' + questionId;
                var correct = $(this).attr('correct');
                html += '<li class="modAnswerOneItem oneAnswer rel">';
                html += '<input id="' + inputId + '" type="' + type + '" name="' + inputName + '" class="modAnswerOneITemTitle">';
                html += '<label for="' + inputId + '" class="langItem moduleItem moduleQuizItem" data-moduleGroupTask="answer" data-modulequizid="' +
                    questionId + '" data-moduleGroupTaskId="' + $(this).attr('id') + '" data-moduleInGroupId="' + modObj.moduleInGroupId + '">' + $(this).text() + '</label>';
                html += '<div class="modAnswerTrueFalseIndicator AnswerTrueFalseIndicator">';
                if (correct == 'true') {
                    html += '<div class="modAnswerTrueIndicator AnswerTrueIndicator rel langItem" data-languageItem="trueText">' + SL.UI.trueText + '</div>';
                } else {
                    html += '<div class="modAnswerFalseIndicator AnswerFalseIndicator rel langItem" data-languageItem="falseText">' + SL.UI.falseText + '</div>';
                }
                html += '</div>';
                html += '</li>';
            });
            html += '</ul>';
            html += '</div>';
        });

        html += '</div>';
        html += '<div id="Mod' + modObj.mod_id + 'BtnContainer" class="buttonsContainer"  aria-live="off">';
        html += '<div class="infoBtn iconHolder abs" tabindex="0">';	 //tabindex is not removed if screen reader mode is enabled, because it cannot be tested at this point
        //not tested
        html += '<div class="infoBtnIconHolderContainer noSelect" tabindex="0" role="button" aria-label="' + SL.UI.info + '">';
        html += '<span>' + HShell.consts.iconsObj.icon_header_TutorialIcon + '</span>';
        html += HShell.consts.iconsObj.icon_header_TutorialIcon;
        html += '</div>';
        html += '<div class="infoBtnPopUpContainer abs">';
        html += '<div class="infoBtnPopUpTextContainer rel langItem moduleItem moduleQuizItem" data-moduleGroupTask="" data-moduleGroupTaskId="0" data-moduleInGroupId="' + modObj.moduleInGroupId + '" data-modulequizid=""></div>';
        html += '<div class="infoBtnPopUpArrow abs"><div class="infoBtnPopUpArrow after"></div></div>';
        html += '</div>';
        html += '<div class="correctWrongIndicator abs">';
        html += '<div class="infoBtnPopUpTextIconCorrect iconHolder" aria-hidden="true">' + HShell.consts.iconsObj.icon_check + '</div>';
        html += '<div class="infoBtnPopUpTextIconWrong iconHolder" aria-hidden="true">' + HShell.consts.iconsObj.icon_exit + '</div>';
        html += '<div class="infoBtnPopUpTextCorrect rel langItem"  data-languageItem="correct"><span>' + SL.UI.correct + '</span></div>';
        html += '<div class="infoBtnPopUpTextWrong rel langItem"  data-languageItem="incorrect">' + SL.UI.incorrect + '</div>';
        html += '</div>';
        html += '<button class="oneModNextBTN' + modObj.mod_id + ' oneModNextBTN langItem" data-languageItem="label_Submit">' + SL.UI.label_Submit + '</button>';
        html += '</div>';
        html += '<div class="oneModThanksScreen rel">';
        html += '<div class="oneModThankYouTitle rel langItem" data-languageItem="preAThankYou">' + SL.UI.preAThankYou + '</div>';
        html += '<div class="oneModThankYouTexContainer rel">';
        html += '<span class="oneModTYTCp1 langItem" data-languageItem="quizThYouP1">' + SL.UI.quizThYouP1 + '</span>';
        html += '<span class="oneModTYTCp2 ">' + 1 + '</span>';
        html += '<span class="oneModTYTCp3 langItem" data-languageItem="quizThYouP2">' + SL.UI.quizThYouP2 + '</span>';
        html += '<span class="oneModTYTCp4 ">' + 1 + '</span>';
        html += '<span class="oneModTYTCp5 langItem" data-languageItem="quizThYouP3">' + SL.UI.quizThYouP3 + '</span>';
        html += '</div>';
        html += '<div class="buttonsContainer"  aria-live="off">';
        html += '<button class="oneModuleQuizCloseButton langItem" data-languageItem="close">' + SL.UI.close + '</button>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
    }

    return html;
}

// ________________________________________________________________________________________________________________________________
// ---- Highlights the hovered item by reducing the opacity of the rest of the similar objects (used in 'Language selection', 'Role selection' .... );

function hoverFade(elements) {
    var hoverdItem = false;
    elements.mouseover(function () {
        hoverdItem = true;
        elements.stop().fadeTo(150, 0.7);
        $(this).finish().fadeTo(0, 1);
    });
    elements.mouseout(function () {
        hoverdItem = false;
        setTimeout(function () {
            if (!hoverdItem) elements.stop().fadeTo(150, 1);
        }, 200);
    });
}

// ________________________________________________________________________________________________________________________________
// --- PopUp generation (generic popUp)

function buildSavingScreen() {
    var style = '';
    if ('HShell.autoSetup.runOn.OS' === 'wondowsPhone') {
        style = 'style="zoom: ' + HShell.autoSetup.bodyZoomRatio + '; height:' + HShell.autoSetup.fullFrameHeight + '; width:100%;"';
    }
    var html = '';
    html += '<div id="savingInProgress" ' + style + '>';
    html += '<div id="savingIPInnerContainer">';
    html += '<div id="savingIPText">' + SL.UI.savingProgress + '</div>';
    html += '<div id="savingIPIcon" class="iconHolder noSelect">' + HShell.consts.iconsObj.icon_refresh + '</div>';
    html += '</div>';
    html += '<div id="savingIPBG"></div>';
    html += '</div>';

    $('body').append(html);
}

function removeSavingScreen() { $('#savingInProgress').remove(); }

// ________________________________________________________________________________________________________________________________
// --- UI Reskin

function reskinAllContent(scope) {
    reskinBTNs(scope);
    reskinRadioButtons(scope);
    reskinChButtons(scope);
}

// ________________________________________________________

function reskinBTNs(scope) {
    var scopeStart = $('body');
    if (scope) { scopeStart = scope; }

    scopeStart.find('button').each(function () {
        if (!$(this).hasClass('.doNotReskin')) {
            var langFlag = '';
            if ($(this).hasClass('langItem')) langFlag = 'langItem';
            var langTextAttr = '';
            if (String($(this).attr('data-languageItem')) !== 'undefined') langTextAttr = 'data-languageitem="' + String($(this).attr('data-languageItem')) + '"';

            var html = '';
            html += '<div class="btnWrapper" id="' + $(this).attr('Id') + 'Reskin">';
            html += '<div class="btnWrapperText ' + langFlag + ' noSelect" aria-hidden="true" ' + langTextAttr + '>' + $(this).html() + '</div>';
            html += '</div>';

            var radioButton = '';
            radioButton += '<input type="radio" id="' + $(this).attr('Id') + '" filter="' + $(this).attr('filter') + '" name="moduleFilter" value="' + $(this).find('.modulesFiltersLable').html() + '"	class="offScreen doNotReskin"/>';
            radioButton += '<label class="offScreen" for="' + $(this).attr('Id') + '">' + $(this).find('.modulesFiltersLable').parent().text() + '</label>';

            var buttonId = $(this).attr('id') + 'Reskin';

            $(this).before(html);
            $(this).siblings('fieldset').append(radioButton);
            $(this).attr('name', $(this).text());
            $(this).attr('type', 'button');
            $(this).addClass('offScreen');
            $(this).appendTo($(this).prev());
            $(this).parent().click(function () {
                $(this).find('button').uniClick();
            });

            $(this).parent().siblings('fieldset').find('#' + $(this).attr('Id')).change(function () {
                if ($(this).is(':checked')) {
                    $(this).parent().siblings('#' + buttonId).click();
                }
            });
            $(this).parent().siblings('fieldset').find('input[filter=all]').prop('checked', true);

            $(this).focus(function () { $('.btnWrapper').removeClass('focused'); $(this).parent().addClass('focused'); });
            $(this).on('blur', function () { $(this).parent().removeClass('focused'); });
            $(this).parent().mouseover(function () { $('.btnWrapper').removeClass('hover'); $(this).addClass('hover'); });
            $(this).parent().mouseout(function () { $(this).removeClass('hover'); });
            $(this).parent().on('touchend', function () { $(this).removeClass('hover'); });
        }
    });

    scopeStart.find('.accessibilityBtn').each(function () {
        var innerButton = '<button class="offScreen" aria-hidden="true" tabindex="-1">';
        if ($(this).attr('buttonStateToggle') == 'true')
            innerButton += '<span class="showHideIndicator"></span>';
        innerButton += '<span>' + $(this).attr('accessibilityBtnTitle') + '</span>';
        innerButton += '</button>';

        $(this).append(innerButton);
        $(this).find('button').focus(function () { $('.btnWrapper').removeClass('hover'); $(this).parent().addClass('Hover'); });
        $(this).find('button').focusout(function () { $(this).parent().removeClass('Hover'); });
    });
}

// ________________________________________________________

function reskinRadioButtons(scope) {
    var scopeStart = $('body');
    if (scope) { scopeStart = scope; }

    scopeStart.find('input').each(function () {
        if ($(this).attr('type') == 'radio' && !$(this).hasClass('doNotReskin')) {
            var html = '';
            html += '<div class="radioWrapper" id="' + $(this).attr('Id') + 'Reskin">';
            html += '<div class="radioReskin"></div>';
            html += '</div>';

            $(this).before(html);
            $(this).addClass('offScreen');
            $(this).appendTo($(this).prev());
        }
    });
}

// ________________________________________________________

function reskinChButtons(scope) {
    var scopeStart = $('body');
    if (scope) { scopeStart = scope; }

    scopeStart.find('input').each(function () {
        if ($(this).attr('type') == 'checkbox') {
            var html = '';
            html += '<div class="checkBoxWrapper" id="' + $(this).attr('Id') + 'Reskin">';
            html += '<div class="checkBoxReskin"></div>';
            html += '</div>';

            $(this).before(html);
            $(this).addClass('offScreen');
            $(this).appendTo($(this).prev());
        }
    });
}

function updateTabletZoomRatio() {
    calculateZoomFactor();

    $(window).on('orientationchange', function (e) {
        setTimeout(function () {
            calculateZoomFactor();
        }, 700);		// --- Waits for the device to reorient itself
    });

    function calculateZoomFactor() {
        var devH = document.documentElement.clientHeight;
        var devW = document.documentElement.clientWidth;
        var divH = HShell.branding.height;
        var divW = HShell.branding.width;
        var ratioH = 0;
        var ratioW = 0;
        var safeZoneConst = 0.08;		// --- This constant is to make sure that you will have a bit of space around the edges

        ratioH = devH / divH - safeZoneConst;
        ratioW = devW / divW - safeZoneConst;

        if (ratioH > ratioW) {
            $('#SCORM_Container').css('zoom', ratioW);
        } else { $('#SCORM_Container').css('zoom', ratioH); }
    }
}

// ________________________________________________________________________________________________________________________________
// --- Dynamic change of branding

function changeBrandingTo(brandFolder) {
    if (brandFolder !== '') {
        $('link').each(function () {
            var href = $(this).attr('href');
            href = href.replace(HShell.autoSetup.brandingFolder, brandFolder);

            var clone = $(this).clone();
            clone.addClass('lastAdded');
            var thisObj = this;

            $('head').append(clone);
            $('head .lastAdded').attr('href', href).on('load', function () {
                setTimeout(function () {
                    $(thisObj).remove();
                }, 1); // --- Preventing blinking to appear while parsing the css
            }).removeClass('lastAdded');
        });

        HShell.autoSetup.brandingFolder = brandFolder;
    }
}

function miHCalc(extra) {
    return 'min-height:calc(' + HShell.autoSetup.fullFrameHeight + 'vh ' + extra + ')';
}

function attachPieToProgressBarElements() { // PIE.js is library that adds CSS3 functionalities to IE 7 & 8. http://css3pie.com/
    $(function () {
        if (window.PIE) {
            $('.assessmentProgressBarSegments, .assessmentProgressBarSegments .purpleSegments,' +
                ' .assessmentProgressBarSegments .graySegments, .assessmentProgressBarEndSegment').each(function () {
                    PIE.attach(this);
                });
        }
    });
}

/// <reference path="_references.js" />

var HShell = window.HShell || {};
HShell.a11y = HShell.a11y || {};

/* --- Connect to all resources ( images, xmls and SCORM ) --- */

function setCssVars() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px'); // used on ios because the bottom navigation on safari is covering the elements with the original vh
}

window.addEventListener('resize', function(){
    setCssVars();
})

function zoomContent() {
    // --- |rework| This must be moved to the Client specific file at least
    // --- !!!! |rework|  the whole function needs global rework. Now it is with a stupid hardcoded logic for specific devices and LMS's.
    // --- I am completely aware that this is lightly put stupid, but it is also fast. Pleas take this one with Height importantse in the
    //     rework order, since any new LMS will have to be addressed separatly and at some point this function will become unreadable (not that it is readable now)

    // --- IPhone
    var screenW;
    var aspect;
    var devW;
    if (inIframe() && HShell.autoSetup.runOn.deviceName == 'iphone') {
        screenW = screen.width;
        aspect = window.devicePixelRatio;
        devW = $(document).width();
        // if (location.href.indexOf('lms.bt.com') != -1) {								// --- For SABA
        //     HShell.autoSetup.bodyZoomRatio = devW / (screenW * aspect);
        //     $('body').addClass('SABA');
        //     if (devW < (screenW * aspect)) {
        //         HShell.autoSetup.bodyZoomRatio = (screenW * aspect) / devW;
        //     }
        // } else {																		// --- For now the else is ment for jZero
        //     $('body').addClass('jZero');
        //     HShell.autoSetup.bodyZoomRatio = screenW / $('body').width();
        // }

        $('body').css('zoom', HShell.autoSetup.bodyZoomRatio);

        HShell.autoSetup.fullFrameHeight = (100 / (100 * HShell.autoSetup.bodyZoomRatio)) * 100;

        $('.fullFrameHeight').each(function(i, item){
            var tempStyle = $(item).attr('style');
            $(item).attr('style', tempStyle + 'height:' + HShell.autoSetup.fullFrameHeight + 'vh !important;');
        });

        $('.fullFrameMinHeight').css('min-height', HShell.autoSetup.fullFrameHeight + 'vh');
    }

    // --- WindowsPhone
    if (inIframe() && HShell.autoSetup.runOn.OS == 'windowsPhone') {
        screenW = screen.width; // 487
        aspect = window.devicePixelRatio;
        devW = $(document).width(); // 1411

        var styleEl;
        var styleSheet;
        if (location.href.indexOf('lms.bt.com') != -1) {								// --- For SABA
            // HShell.autoSetup.bodyZoomRatio = devW / (screenW * aspect);
            // $('body').addClass('SABA');
            // if (devW < (screenW * aspect)) {
            //     HShell.autoSetup.bodyZoomRatio = (screenW * aspect) / devW;
            // }

            HShell.autoSetup.fullFrameHeight = (100 / (100 * HShell.autoSetup.bodyZoomRatio)) * 100;

            $('body')
                .css('zoom', HShell.autoSetup.bodyZoomRatio)
                .css('width', (100 / HShell.autoSetup.bodyZoomRatio) + 'vw');

            $('.fullFrameHeight').css('height', HShell.autoSetup.fullFrameHeight + 'vh');
            $('.fullFrameMinHeight').css('min-height', HShell.autoSetup.fullFrameHeight + 'vh');

            $('head').append(
                '<style type="text/css">' +
                    '.WPWidthMod {'+
                        'width: ' + HShell.autoSetup.fullFrameHeight + 'vw;' +
                        'min-width: ' + HShell.autoSetup.fullFrameHeight + 'vw;' +
                        'max-width: ' + HShell.autoSetup.fullFrameHeight + 'vw;' +
                    '}' +
                    '.WPHeightMod {' +
                        'height: ' + HShell.autoSetup.fullFrameHeight + 'vh !important;' +
                        'min-height: ' + HShell.autoSetup.fullFrameHeight + 'vh !important;' +
                        'max-height: ' + HShell.autoSetup.fullFrameHeight + 'vh} !important;' +
                    '}' +
                '</style>');

            // --- Because on the IE on WindowsPhone the zoom of the body dose note effect elements that are
            //     possition fixed, we need to manually apply the zoom to some elements
            styleEl = document.createElement('style');
            document.head.appendChild(styleEl);
            styleSheet = styleEl.sheet;
            styleSheet.insertRule('.vidPopFooterContainer{zoom:' + HShell.autoSetup.bodyZoomRatio + '}', 0);
            styleSheet.insertRule('.vidPopFooterContainer{width:' + (screenW * aspect) + 'px}', 1);
            styleSheet.insertRule('.vidPopFooterContainer{height:' + 80 + 'px!important}', 2);
            styleSheet.insertRule('#homePageHeaderContainer{zoom:' + HShell.autoSetup.bodyZoomRatio + ' !important}', 3);
            styleSheet.insertRule('#homePageHeaderContainer{width:' + (screenW * aspect) + 'px}', 4);
            styleSheet.insertRule('#popUpDarkBG{width:' + HShell.autoSetup.fullFrameHeight + 'vw}', 5);
            styleSheet.insertRule('#popUpDarkBG{height:' + HShell.autoSetup.fullFrameHeight + 'vh}', 6);
            styleSheet.insertRule('#popUpDarkBG{zoom:' + HShell.autoSetup.bodyZoomRatio + '}', 7);
        } else { // --- For now the else is ment for jZero
            // HShell.autoSetup.bodyZoomRatio = 0.47;
            //HShell.autoSetup.bodyZoomRatio = $('body').width() / screenW;

            $('body').addClass('jZero');
            $('body').css('overflow-y', 'hidden');

            HShell.autoSetup.fullFrameHeight = (100 / (100 * HShell.autoSetup.bodyZoomRatio)) * 100;

            $('body').css('zoom', HShell.autoSetup.bodyZoomRatio).css('width', HShell.autoSetup.fullFrameHeight + 'vw');
            $('.fullFrameHeight').css('height', HShell.autoSetup.fullFrameHeight + 'vh');
            $('.fullFrameMinHeight').css('min-height', HShell.autoSetup.fullFrameHeight + 'vh');


            // --- Because on the IE on WindowsPhone the zoom of the body dose note effect elements that are possition fixed,
            //     we need to manually apply the zoom to some elements
            styleEl = document.createElement('style');
            document.head.appendChild(styleEl);
            styleSheet = styleEl.sheet;
            styleSheet.insertRule('.vidPopFooterContainer{zoom:' + HShell.autoSetup.bodyZoomRatio + '}', 0);
            styleSheet.insertRule('.vidPopFooterContainer{width:' + HShell.autoSetup.fullFrameHeight + 'vw}', 1);
            styleSheet.insertRule('.vidPopFooterContainer{height:' + 80 + 'px!important}', 2);
            styleSheet.insertRule('.vidPopFooterContainer{bottom:-' + 60 + 'px!important}', 3);
            styleSheet.insertRule('.vidPopFooterContainer.iframePage{bottom:-' + 50 + 'px!important}', 4);

            styleSheet.insertRule('#homePageHeaderContainer{zoom:' + HShell.autoSetup.bodyZoomRatio + ' !important}', 5);
            styleSheet.insertRule('#homePageHeaderContainer{width:' + HShell.autoSetup.fullFrameHeight + 'vw !important}', 6);

            styleSheet.insertRule('#popUpDarkBG{width:' + HShell.autoSetup.fullFrameHeight + 'vw}', 7);
            styleSheet.insertRule('#popUpDarkBG{height:' + HShell.autoSetup.fullFrameHeight + 'vh}', 8);
            styleSheet.insertRule('#popUpDarkBG{zoom:' + HShell.autoSetup.bodyZoomRatio + '}', 9);

            styleSheet.insertRule('iframe{width:' + HShell.autoSetup.fullFrameHeight + 'vw !important}', 10);

            styleSheet.insertRule('#tutorialContaienr{width:' + HShell.autoSetup.fullFrameHeight + 'vw}', 11);
            styleSheet.insertRule('#tutorialContaienr{height:' + HShell.autoSetup.fullFrameHeight + 'vh}', 12);
            styleSheet.insertRule('#tutorialContaienr{zoom:' + HShell.autoSetup.bodyZoomRatio + '}', 13);

            styleSheet.insertRule('#introContaienr{width:' + HShell.autoSetup.fullFrameHeight + 'vw}', 14);
            styleSheet.insertRule('#introContaienr{height:' + HShell.autoSetup.fullFrameHeight + 'vh}', 15);
            styleSheet.insertRule('#introContaienr{zoom:' + HShell.autoSetup.bodyZoomRatio + '}', 16);
            $('.HShellQaModeContaniner').css('zoom', HShell.autoSetup.bodyZoomRatio).css('right', (-HShell.autoSetup.bodyZoomRatio * devW) + 'px');
        }
    }
}
// ________________________________________________________________________________________________________________________________

function continueAfterDataColection() {
    if (HShell.autoSetup.savedDataLoaded
        && HShell.autoSetup.xmlLoaded
        && HShell.autoSetup.imgLoaded
        && HShell.autoSetup.fontsLoaded
        && HShell.autoSetup.clientSpecificXMLsLoaded
    ) {

        var continueAfterDataColectionStepTwo = function() {
            if (HShell.autoSetup.preloadedAllData) {
                //HShell.autoSetup.activeWindow.hideWindow |unused|

                // for setting the logo css(ee or plusnet)
                if (HShell.userData.selected_role) {
                    document.getElementById('SCORM_Container').setAttribute('data-role', HShell.userData.selected_role);
                }
                changeLanguage();

                initTimeSpendInsideCoures();
                switch (HShell.savedData.last_location) { // This is for, loaded from SCORM
                    case 'startingCover': gotoStartingCover(); break;
                    case 'langSelect': gotoLanguageSelect(); break;
                    case 'newToCompany': gotoNewToCompany(); break;
                    case 'roleSelect': gotoRoleSelect(); break;
                    case 'brandSelect': gotoBrandSelect(); break;
                    case 'audioAvailable': gotoAudioAvailable(); break;
                    case 'intro': gotoIntroduction(); break;
                    case 'newsScreen': gotoNewsScreen(); break;
                    case 'warningScreen': gotoWarningScreen(); break;
                    case 'peopleManager': gotoPeopleManager(); break;
                    case 'tutorial': gotoTutorial(); break;
                    case 'pre_a': gotoPreAssessement(); break;

                    case 'preAssessFinScreen':
                    case HShell.consts.locations.moduleSelect:
                    case HShell.consts.locations.moduleVideo:
                    case 'module_iframe':
                    case 'post_a':
                    case 'post_evalPage':
                    case 'survey':
                    case HShell.consts.locations.slides:
                    case HShell.consts.locations.layouts:
                        gotoModuleSelection(true);
                        break;
                    case 'final_survey':
                        if (localStorage.getItem("isFinalSurvey") == "true") {
                            $('#mainContentContainer').hide();
                            goToCommon('post_evalPage', buildOnePostAllFinPage, '#pAllOkFinPageContaienr');
                            $('#pAllOkFinConfirmBtnReskin').uniClick(function () {
                                $('#hPageHHomeButton').addClass('directGoToHome').show();
                                $('#pAllOkFinTitleContainer').text(SL.UI.preAThankYou);
                                $('#pAllOkFinContent').html(SL.UI.finText).attr('data-languageItem', 'finText');
                                $('#SCORM_Container, body').scrollTop(0);
                                $(this).hide();
                                $('#pAllOkFinExitBtnReskin').css('display', 'inline-flex').addClass('visible');
                                HShell.storage.setCourseAsCompleated();
                                HShell.a11y.speak(SL.UI.preAThankYou + ' ' + SL.UI.finText);
                                HShell.storage.commitData('immediate');
                                // $('#pAllOkFinExitBtnReskin').focus();
                            });
                            $('#pAllOkFinExitBtnReskin').uniClick(function () {
                                localStorage.setItem('isFinalSurvey', false);
                                if (HShell.contentSetup.isExtranetCourse) {
                                    if (HShell.contentSetup.extranetRedirectToCertificatePage) {
                                        extranet_redirectToPage();
                                    } else {
                                        $('body').text('You have completed your training. You may close this window to finish this session.');
                                    }
                                } else {
                                    $('body').text('You have completed your training. You may close this window to finish this session.');
                                    var scormVersion = pipwerks && pipwerks.SCORM ? pipwerks.SCORM.version || '2004' : '2004';
                                    if(scormVersion == '2004') {
                                        SCORM.SCORMSetOneItem('cmi.success_status', "passed");
                                    } else {
                                        SCORM.SCORMSetOneItem('cmi.core.lesson_status', "passed");
                                    }
                                    exitCourse();
                                }
                            });
                        }
                        else {
                            gotoModuleSelection();
                        }
                        break;
                    case 'start':
                        $('#eLearningGenericContainer').removeClass('preloadingScreen');
                        gotoController('next');
                        $('#eLHeaderTitleContainer').text(SL.UI.course_title).fadeIn();
                        break;

                    default:
                        if (typeof window.courseSpecific_goToController === 'function') {
                            window.courseSpecific_goToController(HShell.savedData.last_location);
                        } else {
                            console.log(HShell.savedData.last_location + ' does not exist');
                            gotoController('next');
                        }
                }
            }
        };

        if (HShell.autoSetup.preloadedAllData == false) {
            HShell.autoSetup.preloadedAllData = true;

            HShell.xml.readFromXml(String('content/' + SL.UI.code + '/' + SL.UI.post_a), function (xml) {
                HShell.content.postAssessObj.XML = xml;
                continueAfterDataColection();
            });
        } else {
            // --- Prevent blinking, while loading the styles
            setTimeout(function(){
                HShell.core.$emit('appPreloaded');
                continueAfterDataColectionStepTwo();
            }, 200);
        }
    }
}

// --- Tracks the total time that the user spend inside the course. The timer starts after the preloader.
function initTimeSpendInsideCoures() {
    setInterval(function () {
        HShell.autoSetup.timeSpendInsideCoures++;
        HShell.autoSetup.sessionTime++;
    }, 1000);
}

// ________________________________________________________________________________________________________________________________
// --- Role selection

function createModulesObjAfterRoleSelected(languageArrayId) {

    for (var t = 0; t < HShell.content.selected_roleObj.langagesCode.length; t++) {
        for (var k = 0; k < HShell.content.languageArray.length; k++) {
            if (HShell.content.selected_roleObj.langagesCode[t] == HShell.content.languageArray[k].UI.code) {
                createModuleGroupArray(HShell.content.languageArray[k]);    // creates "modulesGroupArray"

                // unused for now. If request for module group quiz comes this might be useful
                // for (var i = 0; i < HShell.content.languageArray[k].modulesGroupArray.length; i++) {
                //     for (var j = 0; j < HShell.content.languageArray[k].modulesGroupArray[i].modulesArray.length; j++) {
                //         buildModQuizArray(HShell.content.languageArray[k].modulesGroupArray[i].modulesArray[j].quiz, k, i, j);
                //     }
                // }
            }
        }
    }
}

// ________________________________________________________

function generateRoleModulesList(list) {
    HShell.content.selected_roleObj.modules_listArray = list.split(',');
}

// ________________________________________________________________________________________________________________________________
// --- Accessibility

HShell.a11y.enableAccessibilityShortcuts = function () {
    $(document).keyup(function (e) {
        HShell.a11y.accessbilityShortcutsEventHandlerFunc(e);
    });
};

HShell.a11y.accessbilityShortcutsEventHandlerFunc = function(e) {
    if (e.ctrlKey && e.altKey) {
        // --- Main menu items
        if (e.key == 'p' || e.key == 'P' || e.keyCode == 80 || e.which == 80) {
            $('#hPageHStatusButton').find('button').focus(); $('#hPageHStatusButton').click();
        }
        //if (e.key == 'l' || e.key == 'L' || e.keyCode == 76 || e.which == 76) {
        //    $('#hPageHLanguageButton').click().find('button').focus();
        //}
        if (e.key == 't' || e.key == 'T' || e.keyCode == 84 || e.which == 84) {
            if (!$('#tutorialContaienr').length) {
                $('#hPageHTutorialButton').click();
            }
        }
        if (e.key == 'a' || e.key == 'A' || e.keyCode == 65 || e.which == 65) {
            $('#hPageHAccessibilityButton').click();
            var tempStr = $('#hPageHAccessibilityContainer .hPageHTitleContainer ').text();
            tempStr += $('.accessSubTitle').first().text();

            //HShell.a11y.speak(	tempStr	);
            $('#hPageHAccessibilityButton').find('button').focus();

        }
        if (e.key == 'h' || e.key == 'H' || e.keyCode == 72 || e.which == 72) {
            var enabledScreens = ['module_video','module_iframe','module_slides','module_layouts'];
            if (enabledScreens.indexOf(HShell.savedData.last_location) > -1) {
                $('#hPageHHomeButton').click();
            }
        }

        // --- Debuging shortcuts
        if (e.key == '9' || e.keyCode == 105 || e.which == 105) { refreshAllCSS(); }

        if (e.key == 'q' || e.key == 'Q' || e.keyCode == 81 || e.which == 81) { $('#toggleActiveElementButton').click(); }

        if (e.key == '0' || e.keyCode == 48 || e.which == 48) { console.log(HShell); }
    }

    if ($('.vidPopVideoContainer, .vidPopModEndText').length > 0 && $('.vidPopVideoContainer:visible, .vidPopModEndText:visible').length == 1) {
        var scope = $('.vidPopVideoContainer:visible, .vidPopModEndText:visible').parent();
        if (e.key == 'i' || e.key == 'I' || e.keyCode == 73 || e.which == 73) { scope.find('.vidPopBackBtn').click(); }
        if (e.key == 'k' || e.key == 'K' || e.keyCode == 75 || e.which == 75) { scope.find('.vidPopPlayBtn').click(); }
        if (e.key == 's' || e.key == 'S' || e.keyCode == 83 || e.which == 83) { scope.find('.vidPopStopBtn').click(); }
        if (e.key == 'm' || e.key == 'M' || e.keyCode == 77 || e.which == 77) { scope.find('.vidPopMuteBtn').click(); }
    }
};

// ________________________________________________________________________________________________________________________________
// --- Post assessment

function clearPostAssessObj(depth) {
    HShell.content.postAssessObj.questionsNum = 0;
    HShell.content.postAssessObj.activeQuestion = null;
    HShell.content.postAssessObj.activeQuestionNum = 0;
    HShell.content.postAssessObj.answersArray = new Array();
    HShell.content.postAssessObj.correctAnswers = 0;
    HShell.content.postAssessObj.quizArray = new Array();
    HShell.content.postAssessObj.answeredQuestionsNum = 0;

    if (depth == 'full') {
        HShell.autoSetup.postAssessFinishedModules = new Array();
        HShell.autoSetup.postAssessWrongModules = new Array();
    }
}

function clearFinalSurveyObj(depth) {
    HShell.content.finalSurveyObj.questionsNum = 0;
    HShell.content.finalSurveyObj.activeQuestion = null;
    HShell.content.finalSurveyObj.activeQuestionNum = 0;
    HShell.content.finalSurveyObj.answersArray = new Array();
    HShell.content.finalSurveyObj.correctAnswers = 0;
    HShell.content.finalSurveyObj.quizArray = new Array();
    HShell.content.finalSurveyObj.answeredQuestionsNum = 0;
}

// ________________________________________________________

function parsePostAssessScormInteractionsPositionsArray(activeQuestionNum) {          // --- This will have problems if we have more than 1 question connected to 1 module. But for now there is no time, sooo...
    var positionArr = HShell.postAssessScormInteractionsPositionsArray;

    for (var k = 0; k < positionArr.length; k++) {
        if (activeQuestionNum == positionArr[k][0]) {
            return positionArr[k][1];
        }
    }
}

// ________________________________________________________
// --- Progress

function populateProgressMenu() {
    var tempModulesNumberCounter = 0;
    $('#hPageHProgContainerInner').empty();

    $('.ModList__Item').each(function () {
        var mod_id = $(this).attr('moduleId');

        tempModulesNumberCounter++;

        $('#hPageHProgContainerInner')
            .append(
                HShell.core.getComponent('ProgressTab__Item').init({
                    mod_id:mod_id,
                    visualizedNumber: tempModulesNumberCounter
                }));

        HShell.core.renderComponents('#hPageHProgContainerInner');
    });
    topLeftSliders();

    //$('.oneProgressItemNumber').uniClick(function () {
    //    var thisItem = $(this);
    //    var target = $(thisItem.parent().attr('data-target'));
    //    $('#filterAllModulesReskin').click();
    //    $('#hPageHStatusButton').click();

    //    setTimeout(function () {
    //        var vPossition = target.offset().top;
    //        vPossition = $('#mainContentContainer').scrollTop() + vPossition - $('#SCORM_Container').offset().top - $('#homePageHeaderButtonsContainer').height() - 25;        // --- The last number is just offset constant
    //        $('#mainContentContainer, body').scrollTo(vPossition, HShell.consts.automaticScrollTime, function () { target.find('.oneModuleDescriptionContainer').focus(); });
    //    }, 350);

    //    setTimeout(function () {
    //        setTimeout(function () {
    //            target.find('.oneModuleInnerContaienr').addClass('focused', 500, function () {
    //                $(this).removeClass('focused', 500);
    //                if (HShell.autoSetup.lastUserInteraction === 'keyboard') {
    //                    $(this).addClass('focused', 500);
    //                }
    //            });
    //        }, 500);
    //    }, 400);
    //});
}

function topLeftSliders() {
    var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
    // check if we are in mobile view
    var iAmRealMobileOrDesktopInMobileWidth = false;
    var $body = $('body');
    if ((HShell.autoSetup.runOn.OS == 'iOS' && HShell.autoSetup.runOn.deviceName != 'ipad') ||
        HShell.autoSetup.runOn.OS == 'android' || HShell.autoSetup.runOn.OS == 'windowsPhone') {
        iAmRealMobileOrDesktopInMobileWidth = true;
    } else {
        try { // --- |rework| this trows erros on iPad, but we do not need it anyway. No time to make it correct
            var mobileBrandCssWMedia = $(document.getElementById('mobileBrandCssW')).attr('media');
            var mobileWidth = parseInt(mobileBrandCssWMedia
                .substring(mobileBrandCssWMedia.indexOf('(max-width:') + 11, mobileBrandCssWMedia.indexOf('px)')));
            if ($body.width() <= mobileWidth) {
                iAmRealMobileOrDesktopInMobileWidth = true;
            }
        } catch (e) {
            HShell.utils.trace(e.message, '3.general - topLeftSliders()');
        }
    }
    if (iAmRealMobileOrDesktopInMobileWidth) {
        // hello mobile!
        var $hPageHProgressContainer = $(document.getElementById('hPageHProgressContainer'));
        var $hPageHProgContainerInner = $(document.getElementById('hPageHProgContainerInner'));
        var oneProgressItemWidth = $hPageHProgContainerInner.children().first().find('div.oneProgressItemNumber').width() + parseInt($hPageHProgContainerInner.children().first().css('padding-right'));
        var oneProgressItemWithoutDotWidth = oneProgressItemWidth - parseInt($hPageHProgContainerInner.children().first().css('padding-right'));
        var hPageHProgContainerInnerWidth = $body.width() - (parseInt($hPageHProgressContainer.css('padding-left')) + parseInt($hPageHProgressContainer.css('padding-right')));
        var itemsPerRow = Math.floor(hPageHProgContainerInnerWidth / oneProgressItemWidth);
        var paddingLeftToCenter = ((hPageHProgContainerInnerWidth - ((itemsPerRow * oneProgressItemWidth) - oneProgressItemWithoutDotWidth)) / 2) - 15;
        $hPageHProgContainerInner
            .children()
            .each(function (index) {
                $(this)
                    .css('background-image', '');
                var x = (index + 1) / itemsPerRow;
                if (x === parseInt(x, 10)) {
                    $(this)
                        .css('background-image', 'none');
                }
            });
        $hPageHProgContainerInner
            .css('padding-left', paddingLeftToCenter + 'px');

        var $hPageHLanguageContaienr = $(document.getElementById('hPageHLanguageContaienr'));
        var $hPageHLanguageInnerContainer = $(document.getElementById('hPageHLanguageInnerContainer'));
        var oneHeaderLanguageContainerWidth = parseInt($hPageHLanguageInnerContainer.children().first().css('width'));
        var hPageHLanguageInnerContainerWidth = $body.width() - (parseInt($hPageHLanguageContaienr.css('padding-left')) + parseInt($hPageHLanguageContaienr.css('padding-right')));
        itemsPerRow = Math.floor(hPageHLanguageInnerContainerWidth / oneHeaderLanguageContainerWidth);
        paddingLeftToCenter = (hPageHLanguageInnerContainerWidth - (itemsPerRow * oneHeaderLanguageContainerWidth)) / 2;
        $hPageHLanguageInnerContainer.css('padding-left', paddingLeftToCenter + 'px');
    }

    $('.oneProgressItemInnner').uniClick(function () {
        if (HShell.savedData.last_location == 'mod_select') {
            var thisItem = $(this).find('.oneProgressItemNumber');
            var target = $(thisItem.parent().attr('data-target'));

            $('#filterAllModulesReskin').click();
            $('#hPageHStatusButton').click();

            setTimeout(function () {
                var vPossition = target.offset().top;
                vPossition = $('#mainContentContainer').scrollTop() + vPossition - $('#SCORM_Container').offset().top - $('#homePageHeaderButtonsContainer').height() - 25;        // --- The last number is just offset constant
                $('#mainContentContainer').scrollTo(vPossition, HShell.consts.automaticScrollTime, function () { target.find('.oneModuleDescriptionContainer').focus(); });
            }, 350);

            disableScroll();
            setTimeout(function () {
                setTimeout(function () {
                    target.find('.oneModuleInnerContaienr').addClass('focused', 500, function () {
                        $(this).removeClass('focused', 500);
                        if (HShell.autoSetup.lastUserInteraction === 'keyboard') {
                            $(this).addClass('focused', 500);
                        }
                    });
                    enableScroll();
                }, 500);
            }, 400);
        }
    });

    function preventDefault(e) {
        e = e || window.event;
        if (e.preventDefault)
            e.preventDefault();
        e.returnValue = false;
    }

    // $(window).on('resize', topLeftSliders);
    function preventDefaultForScrollKeys(e) {
        if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
        }
    }

    function disableScroll() {
        if (window.addEventListener) // older FF
            window.addEventListener('DOMMouseScroll', preventDefault, false);
        window.onwheel = preventDefault; // modern standard
        window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
        window.ontouchmove = preventDefault; // mobile
        document.onkeydown = preventDefaultForScrollKeys;
    }

    function enableScroll() {
        if (window.removeEventListener)
            window.removeEventListener('DOMMouseScroll', preventDefault, false);
        window.onmousewheel = document.onmousewheel = null;
        window.onwheel = null;
        window.ontouchmove = null;
        document.onkeydown = null;
    }
}

// ________________________________________________________________________________________________________________________________
// -- Filters

function enambleModuleSelectionFilters() {
    $('#modulesFiltersContainer button, #modulesFiltersContainer .btnWrapper').uniClick(function (e) { filterItems($(e.currentTarget)); });
    function filterItems(item) {
        var filter = '';
        if (String(item.attr('filter')) != 'undefined') { filter = item.attr('filter'); }
        else { filter = item.find('button').attr('filter'); }


    }

    $('#modulesFiltersContainer .btnWrapper').click(function () {
        $('#modulesFiltersContainer .btnWrapper').removeClass('active');
        $(this).addClass('active');
    });
    $('#modulesFiltersContainer #modulesFiltersFieldset input').focus(function () {
        $('#modulesFiltersContainer .btnWrapper').removeClass('focused');
        $('#' + $(this).attr('id') + 'Reskin').addClass('focused');
        $('#mainContentContainer').scrollTo($(this).offset().top - $('#homePageHeaderContainer').offset().top - $(this).height() - 100);
    });

    $('#modulesFiltersContainer #modulesFiltersFieldset input').blur(function () {
        $('#modulesFiltersContainer .btnWrapper').removeClass('focused');
    });

    $('#modulesFiltersContainer .btnWrapper').first().click();			// Automatically selects the first item

    // |unused|
    //$(window).resize(function () {
    //    var maxH = 0;
    //    $('#modulesFiltersContainer').each(function () {

    //    });
    //});
}

// ________________________________________________________________________________________________________________________________

function changeLanguage() {
    $('.langItem').each(function () {
        var newLable = SL.UI[$(this).attr('data-languageItem')];
        $(this).html(newLable);
    });
}

// !IMPORTANT
// Commented since there is no language change during the course anymore and this function is
// breaking the survey in TWWW. Might break something else


// $('.langItem').not('.langAlt').each(function () {
//     var newLable;

//     newLable = SL.UI[$(this).attr('data-languageItem')];

//     // --- Modules Quiz
//     if ($(this).hasClass('moduleItem')) {
//         try {
//             if ($(this).attr('data-moduleid')) {		// --- This most deffinately must be reworked |rework|
//                 var tempModId = $(this).attr('data-moduleid');
//                 var tempLangItem = $(this).attr('data-languageItem');

//                 $(SL.allModules).each(function (i, item) {
//                     if (item.mod_id == tempModId)
//                         newLable = item[tempLangItem];
//                 });
//             } else {
//                 if ($(this).attr('data-moduleInGroupId')) {
//                     newLable = SL.modulesGroupArray[$(this).attr('data-moduleGArrayId')].modulesArray[Number($(this).attr('data-moduleInGroupId'))][$(this).attr('data-languageItem')];
//                 }

//                 if (!$(this).attr('data-moduleInGroupId') && !$(this).attr('data-postAQuestionGroupID')) {
//                     newLable = SL.modulesGroupArray[$(this).attr('data-moduleGArrayId')][$(this).attr('data-languageItem')];
//                 }
//             }
//         } catch (e) { }

//         try {
//             if ($(this).hasClass('moduleQuizItem')) {
//                 var modulesGroupArrayId = Number($(this).getParent('.modulesGroupContainer').attr('data-moduleGArrayId'));
//                 var modulesInGroupArrayId = Number($(this).attr('data-moduleInGroupId'));
//                 var moduleId = Number($(this).attr('data-modulequizid'));
//                 var moduleGroupTask = $(this).attr('data-moduleGroupTask');
//                 var moduleGroupTaskId = $(this).attr('data-moduleGroupTaskId');
//                 if (moduleGroupTaskId == '0') {
//                     moduleGroupTaskId = '';
//                 } else {
//                     moduleGroupTaskId = '[id="' + moduleGroupTaskId + '"]';
//                 }

//                 newLable = SL.modulesGroupArray[modulesGroupArrayId].modulesArray[modulesInGroupArrayId].quiz.find('question[id="' + moduleId + '"]').find(moduleGroupTask + moduleGroupTaskId).text();
//             }
//         } catch (e) { trace('changeDisplayLanguage: 10') }
//     }

//     // --- Post asessment
//     try {
//         var parentIsPostAssessment = $(this).parentsUntil('#questionsContainer').last().hasClass('postAssessment');
//         var assessmentTrueIndicator = $(this).hasClass('preAnswerTrueIndicator');
//         var assessmentFalseIndicator = $(this).hasClass('preAnswerFalseIndicator');
//         var assessmentFb = Boolean($('#postAssessementContainer').length) &&
//             $(this).hasClass('infoBtnPopUpTextContainer') &&
//             $(this).hasClass('postAssessment');
//         var questionGroupId;
//         var questionId;
//         var itemTask;

//         if (parentIsPostAssessment && !assessmentTrueIndicator && !assessmentFalseIndicator) {
//             questionGroupId = $(this).parentsUntil('#questionsContainer').last().attr('qGroupId');
//             questionId = $(this).parentsUntil('#questionsContainer').last().attr('qId');
//             itemTask = $(this).attr('data-itemTask');
//             var itemTaskId = $(this).attr('data-moduleGroupTaskId');
//             if (itemTaskId == '0' || String(itemTaskId) == 'undefined') {
//                 itemTaskId = '';
//             } else {
//                 itemTaskId = '[id="' + itemTaskId + '"]';
//             }
//             newLable = HShell.content.postAssessObj.XML.find('questionGroup[id="' + questionGroupId + '"]')
//                 .find('question[id="' + questionId + '"]')
//                 .find(itemTask + itemTaskId)
//                 .text();
//         }

//         if (assessmentFb) {
//             questionGroupId = $('.postAssessment.active').attr('qGroupId');
//             questionId = $('.postAssessment.active').attr('qId');
//             itemTask = $(this).attr('data-modulegrouptask');
//             newLable = HShell.content.postAssessObj.XML.find('questionGroup[id="' + questionGroupId + '"]')
//                 .find('question[id="' + questionId + '"]')
//                 .find(itemTask)
//                 .text();
//         }

//     } catch (e) {
//         trace('ChangeDisplayLanguage: 20: ' + e.message);
//     }


//     // --- Survey

//     try {
//         var parentEl = $(this).parentsUntil('#questionsContainer').last();
//         var elementToSearch = $(this).attr('data-itemtask');
//         if ($(this).hasClass('infoBtnPopUpTextContainer')) {
//             parentEl = $('#questionsContainer').find('.questionContainer');
//             elementToSearch = $(this).attr('data-modulegrouptask') +
//                 '[id=' +
//                 $(this).attr('data-modulequizid') +
//                 ']';
//         }

//         var qGroup = parentEl.attr('qgroupid');
//         var qId = parentEl.attr('qid');
//         var typeQuiz = parentEl.attr('quiztype');

//         var findQuery = 'questionGroup[id=' + qGroup + '] question[id=' + qId + '] ' + elementToSearch;
//         if (String($(this).attr('data-modulegrouptaskid')) != 'undefined') {
//             findQuery += '[id=' + $(this).attr('data-modulegrouptaskid') + ']';
//         }

//         if (typeQuiz == 'survey') {
//             newLable = HShell.content.surveyObj.XML.find(findQuery).text();
//         }
//     } catch (e) {
//         trace(e.message, '3.general - changeLanguage() - Survey');
//     }

//     $(this).html(newLable);
// });

// $('.langItem.langAlt').each(function () {
//    var newLable = SL.UI[$(this).attr('data-languageItem')];

//    if ($(this).hasClass('keyCombo')) {
//        var p1 = $(this).attr('data-languageItemp1');
//        var p2 = $(this).attr('data-languageItemp2');
//        var p3 = $(this).attr('data-languageitemp3');
//        $(this).attr('alt', SL.UI[p1] + newLable + SL.UI[p2] + ' ' + SL.UI[p3]);
//    } else {
//        $(this).attr('alt', newLable);
//    }
// });

////Accessibility
////ISO Language code for Dutch is "nl", we are using "du", should be |rework|ed,
//$('html').attr('lang', HShell.userData.selected_language === 'du' ? 'nl' : HShell.userData.selected_language);

////courseSpesificLanguageChange();
//if (typeof window.courseSpesific_changeLanguage == 'function') {
//    window.courseSpesific_changeLanguage();
//} else { // below is the content of courseSpesificLanguageChange(). Only Mercer had this function empty (and so do now)
//    var audioUrl = 'content/' + SL.UI.code + '/modules/moduleEnd.mp3';
//    $('#hiddenAudioElement').remove();

//    if (selectVideoPlayerMethod() == 0) {
//        var preventUrlCash = '';
//        if (HShell.globalSetup.devMode) preventUrlCash = '?' + String(Math.random() * 100000);
//        var html = '';
//        // --- The classId attribute is there for IE 9/8 and 7 support. It dose not work without it
//        html += '<object data="js/uniPlayAudio.swf' + preventUrlCash + '" id="hiddenAudioElement" tabindex="-1"	width="100"	height="100" class="offScreen" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"  type="application/x-shockwave-flash">';
//        html += '<param name="movie"	value="js/uniPlayAudio.swf' + preventUrlCash + '" />';
//        html += '<param name="FlashVars" VALUE="audioURL=' + audioUrl + '" />';
//        html += '<param name="bgcolor"	value="#008800" />';
//        html += '</object>';

//        $('body').append(html);
//    } else {
//        if (String(HShell.courseSpecific.content.moduleEndAudio) != 'undefined') {
//            HShell.courseSpecific.content.moduleEndAudio.pause();
//        }
//        HShell.courseSpecific.content.moduleEndAudio = new Audio(audioUrl);
//    }
//}

//populateProgressMenu();
//restoreProgressFromArray();
//}

//            if (typeQuiz == 'survey') {
//                newLable = HShell.content.surveyObj[SL.UI.code].XML.find(findQuery).text();
//            }
//        } catch (e) {
//            trace(e.message, '3.general - changeLanguage() - Survey');
//        }

function exitCourse() {
    HShell.autoSetup.ignoreServerErrorPopup = true;
    HShell.storage.ignoreUnloadSaving = HShell.contentSetup.bigCourseSap;
    HShell.storage.saveCourseEndData();
    // // TEST - trying to fix error popup in SAP
    if (typeof buildSavingScreen == 'function') {
        buildSavingScreen();
    }
    setTimeout(() => {
        if (typeof removeSavingScreen == 'function') {
            removeSavingScreen();
        }
        var scormVersion = pipwerks && pipwerks.SCORM ? pipwerks.SCORM.version || '2004' : '2004';
        if ((HShell.contentSetup.bigCourseSap && scormVersion !== '2004') || !HShell.contentSetup.bigCourseSap) {
            pipwerks.SCORM.connection.terminate();
        }
    }, 10000);
    window.clientSpecificExitButton();
}

$('body').on('click','#btn_previousScreen',function() {
    $('#SCORM_Container, body').scrollTop(0);
    $('#newsContainer, #newsButtonsContainer').remove();
    window.gotoController('previous');
});

$('body').keypress(function (e) {
    if (e.keyCode == 13 || e.keycode == 0 || e.keycode == 32 || e.which == 32) {
        if ($(e.target).attr('id') == 'btn_previousScreen') {
            $(e.target).click();
        }
        e.stopPropagation();
        e.preventDefault();		// --- Sometimes the spacebar scrolls the page
    }
});

/// <reference path="_references.js" />

var HShell = window.HShell || {};
HShell.xml = {};

(function () {
// --- XML readFromXml
    HShell.xml.readFromXml = function(fileName, afterAsync, paramAfterSync) {
        if (HShell.globalSetup.XMLcashing == false || HShell.globalSetup.devMode == true) {
            fileName += String('?' + Math.random());
        }

        $.ajax({
            type: 'GET',
            url: fileName,
            dataType: 'xml',
            success: function (xml) {
                if (paramAfterSync != 'undefined') {
                    afterAsync(xml, paramAfterSync);
                } else {
                    afterAsync(xml);
                }

            },
            error: function (xhr, ajaxOptions, thrownError) {
                HShell.utils.trace('ErrorLoadingXML (' + fileName + '): ' + thrownError, 'readFromXml');
            },
            async: false        // this need to be sync because we need to fully load 'UI_override' xmls before Audio Available screen shows
        });
    };

    // ________________________________________________________________________________________________________________________________

    // --- Read from all XMLs
    HShell.xml.getDataFromConfigXml = function(xml) {
        var setup = HShell.contentSetup,
            x2js = new window.X2JS();

        HShell.content.settingsXML = xml;
        HShell.content.configXMLObject = x2js.xml2json(xml);

        $(HShell.content.settingsXML).find('mainSettings').each(function () {
            setup.course_template = +$(this).find('course_template').text();
            setup.enableDataSavings = !!+$(this).find('enableSavings').text();
            setup.bigCourseSap = !!+$(this).find('bigCourseSap').text();
            setup.dataSavingsMethod = +$(this).find('dataStorageMethod').text();
            setup.isExtranetCourse = !!+$(this).find('extranetCourse').text();
            setup.extranetRedirectToCertificatePage = !!+$(this).find('extranetRedirectToCertificatePage').text();
            setup.extranetPathTaken = '-1';

            if (setup.isExtranetCourse) {
                setup.extranetPathTaken = $(this).find('extranetCourseCode').text();
            }

            setup.language_select = eval($(HShell.content.settingsXML).find('languages').attr('enabled'));
            setup.have_newToCompanyScreen = !!+$(this).find('have_newToCompany').text();
            setup.have_startingCover = !!+$(this).find('have_startingCover').text();
            setup.startingCoverBgImgUrl = $(this).find('startingCover_backgroundImgUrl').text();
            setup.startingCoverBrandLogoUrl = $(this).find('startingCover_brandLogoUrl').text();
            setup.role_select = !!+$(this).find('selectRole').text();
            setup.brand_select = !!+$(this).find('selectBrand').text();
            setup.dynamic_brand_logo = !!+$(this).find('dynamicBrandLogo').text();
            setup.have_pre_a = !!+$(this).find('have_pre_a').text();
            setup.skip_pre_a = !!+$(this).find('skip_pre_a').text();
            setup.have_tutorial = !!+$(this).find('have_tutorial').text();
            setup.have_post_a = !!+$(this).find('have_post_a').text();
            setup.have_final_survey = Boolean(Number($(this).find('have_final_survey').text()));
            setup.module_layouts_home_button = !!+$(this).find('module_layouts_home_button').text();
        
            setup.post_type = +$(this).find('postAssessmentType').text();
            setup.postAssessmentThersholdPerc = +$(this).find('postAssessmentThresholdPercentage').text();
            setup.postAssessmentRand = !!+$(this).find('postAssessmentRand').text();
            setup.have_survey = !!+$(this).find('have_survey').text();
            setup.have_timeline = !!+$(this).find('have_timeline').text();

            setup.have_warningScreen = !!+$(this).find('have_warningScreen').text();
            setup.have_peopleManager = !!+$(this).find('have_peopleManager').text();
            setup.have_newsScreen = !!+$(this).find('have_newsScreen').text();
            setup.have_notifications = !!+$(this).find('have_notifications').text();
            setup.skipModulesPage = !!+$(this).find('skipModulesPage').text();
            setup.newsScreen_showDescription = !!+$(this).find('newsScreen_showDescription').text();
            setup.langScreen_showDescription = !!+$(this).find('langScreen_showDescription').text();
            setup.newToCompanyScreen_showDescription = !!+$(this).find('newToCompanyScreen_showDescription').text();
            setup.roleSelectScreen_showDescription = !!+$(this).find('roleSelectScreen_showDescription').text();
            setup.brandSelectScreen_showDescription = !!+$(this).find('brandSelectScreen_showDescription').text();
            setup.warningScreen_showDescription = !!+$(this).find('warningScreen_showDescription').text();

            setup.fancyAssessment = !!+$(this).find('fancyAssessment').text();
            setup.SCORM_suspendDataCompression = !!+$(this).find('SCORM_suspendDataCompression').text();

            // --- If an element is not part of the selected template, it is ignored regardless of how the XML set
            var templateArr = HShell.globalSetup.segmentsOrder[setup.course_template];

            if (templateArr.indexOf('langSelect') == -1) setup.language_select = false;
            if (templateArr.indexOf('newToCompany') == -1) setup.have_newToCompanyScreen = false;
            if (templateArr.indexOf('startingCover') == -1) setup.have_startingCover = false;
            if (templateArr.indexOf('roleSelect') == -1) setup.role_select = false;
            if (templateArr.indexOf('pre_a') == -1) setup.have_pre_a = false;


            $(this).find('tutorialVideoUrl').each(function () {
                var langCode = $(this).attr('language');
                if (String(langCode) == 'undefined') langCode = 'all';						// --- Prevents total block if the content is not setup the correct way
                HShell.globalSetup.tutorialVideoUrl[langCode] = 'content/' + $(this).text();
            });

            $(this).find('tutorialVideoSubtitlesURL').each(function () {
                var langCode = $(this).attr('language');

                if (String(langCode) == 'undefined') { langCode = 'en'; }		// --- Prevents total block if the content is not setup the correct way

                if ($(this).text().indexOf(langCode + '/') != -1) {
                    HShell.globalSetup.tutorialVideosubtitlesURL[langCode] = 'content/' + $(this).text();
                } else {
                    HShell.globalSetup.tutorialVideosubtitlesURL[langCode] = 'content/' + langCode + '/' + $(this).text();
                }

            });

            // |unused|
            //haveOnUnloadPopUp = Boolean(Number($(this).find('have_unload_screen').text()));		// |notImplemented|

            $(HShell.content.settingsXML).find('brands brand').each(function () {
                HShell.content.brandsArray.push(HShell.newObjects.newBrandObject($(this)));
            });

            // Gets roles settings
            $(HShell.content.settingsXML).find('roles role').each(function () {
                if ($(this).attr('code') == 'newToCompany') {
                    HShell.content.role_newToCompanyObj = $(this);
                }
                HShell.content.roleArray.push(HShell.newObjects.newRoleObject($(this)));
            });

            if (!setup.role_select) {
                if (HShell.content.roleArray.length == 0) {
                    HShell.content.selected_roleObj = 'null';
                } else {
                    HShell.content.selected_roleObj = HShell.content.roleArray[0];
                }
            }

            getAllUIXMLs();
        });

        if (setup.have_newsScreen) {
            HShell.xml.getNewsXml();
        }

        if (setup.have_warningScreen) {
            HShell.xml.getWarningXml();
        }

        if (setup.have_peopleManager) {
            HShell.xml.getPeopleManagerXml();
        }

        window.clientSpecificReadFromConfigXML(HShell.content.settingsXML);			// --- Reads any none standard tags and attributes from the config XML, if it is required by the client.
        if (HShell.courseSpecific.getDataFromConfigXml) {
            HShell.courseSpecific.getDataFromConfigXml(HShell.content.settingsXML);
        }
        window.getClientSpecificXMLs();												// --- Reads any additional XML files if it is required by the client.
    };

    // ________________________________________________________

    function getAllUIXMLs() {
        var mangItems = $(HShell.content.settingsXML).find('languages lang');
        var languagesToLoad = mangItems.length;
        var languagesLoaded = 0;
        var currentNum = 0;

        mangItems.each(function () {
            HShell.xml.readFromXml('content/' + $(this).attr('uiURL'), newLangObjMaker, currentNum++);
        });

        function newLangObjMaker(xml, idInLanguageArray) {
            languagesLoaded++;
            HShell.content.languageArray[idInLanguageArray] = HShell.newObjects.newLanguageObject($(xml), idInLanguageArray);

            if (languagesLoaded == languagesToLoad) {
                if (!HShell.contentSetup.language_select) {
                    HShell.userData.selected_language = HShell.content.languageArray[0].UI.code;
                }

                getAllContentXMLs(mangItems);
            }
        }
    }

    HShell.xml.getNewsXml = function() {
        HShell.xml.readFromXml(String('content/' + SL.UI.code + '/' + 'news.xml'), newsXmlLoaded); // TODO news.xml

        function newsXmlLoaded(xml) {
            HShell.content.newsObj = {
                enabled: !!+$(xml).find('enabled').text(),
                title: $(xml).find('title').text(),
                message: $(xml).find('message').text()
            };
            HShell.content.newsObj.XML = $(xml);
        }
    };

    HShell.xml.getWarningXml = function() {
        HShell.xml.readFromXml(String('content/' + SL.UI.code + '/' + 'warning.xml'), warningXmlLoaded); // TODO news.xml

        function warningXmlLoaded(xml) {
            HShell.content.warningObj = {
                enabled: !!+$(xml).find('enabled').text(),
                title: $(xml).find('title').text(),
                message: $(xml).find('message').text()
            };
            HShell.content.warningObj.XML = $(xml);
        }
    };

    HShell.xml.getPeopleManagerXml = function() {
        HShell.xml.readFromXml(String('content/' + SL.UI.code + '/' + 'peopleManager.xml'), peopleManagerXmlLoaded); // TODO news.xml

        function peopleManagerXmlLoaded(xml) {
            HShell.content.peopleManagerObj = {
                enabled: !!+$(xml).find('enabled').text(),
                title: $(xml).find('title').text(),
                message: $(xml).find('message').text()
            };
            HShell.content.peopleManagerObj.XML = $(xml);
        }
    };

    // ________________________________________________________

    function getAllContentXMLs(mangItems) {
        var languagesToLoadContent = mangItems.length;
        var languagesLoadedContent = 0;
        var currentNum = 0;

        var contentImagesArr = [];

        mangItems.each(function () {
            var currentLang = $(this).attr('contentURL');
            currentLang = currentLang.substr(0, currentLang.indexOf('/'));

            HShell.xml.readFromXml('content/' + $(this).attr('contentURL'), newLangContent, currentNum++);

            function newLangContent(xml, idInLanguageArray) {
                var xmlString = '';
                if (window.XMLSerializer) {
                    xmlString = new XMLSerializer().serializeToString(xml);
                } else {
                    xmlString = xml.xml;
                }

                var regexPattern = /modules\/Mod_.+?\/.+?.png/gi,
                    match = '';

                do {
                    match = regexPattern.exec(xmlString);
                    if (match) {
                        contentImagesArr.push('content/' + currentLang + '/' + match[0]);
                    }
                } while (match);

                languagesLoadedContent++;
                HShell.content.languageArray[idInLanguageArray].contentXML = xml;

                if (!HShell.contentSetup.role_select) {
                    generateRoleModulesList(HShell.content.selected_roleObj.modules_list);
                    createModulesObjAfterRoleSelected(idInLanguageArray);
                    if (HShell.contentSetup.have_notifications) {
                        HShell.xml.getNotifications(idInLanguageArray);
                    }
                }

                if (languagesToLoadContent == languagesLoadedContent) {
                    HShell.content.selected_languageObj = HShell.content.languageArray[0];
                    SL = HShell.content.selected_languageObj;
                    HShell.autoSetup.xmlLoaded = true;

                    if (HShell.contentSetup.isExtranetCourse) {
                        initExtranetKeepSessionAlive();
                    }

                    if (HShell.content && HShell.content.selected_languageObj && HShell.content.selected_languageObj.UI) {
                        document.title = HShell.content.selected_languageObj.UI.course_title;
                    }

                    HShell.storage.initDataSaving();			// --- In 8.DataStorageController.js
                }
            }
        });

        HShell.preload(contentImagesArr);
    }

    HShell.xml.getNotifications = function(idInLanguageArray) {
        if (typeof HShell.content.languageArray[idInLanguageArray].notificationsXML === 'undefined') {
            var currentLang = HShell.content.languageArray[idInLanguageArray].UI.code;
            HShell.xml.readFromXml('content/' + currentLang + '/' + 'notifications.xml', function (xml) {
                setNotificationsOnModule(idInLanguageArray, xml);
            });
        } else {
            setNotificationsOnModule(idInLanguageArray, HShell.content.languageArray[idInLanguageArray].notificationsXML);
        }
    };

    function setNotificationsOnModule(idInLanguageArray, xml) {
        HShell.content.languageArray[idInLanguageArray].notificationsXML = xml;
        $(xml).find('notification').each(function (index, item) {
            var currentItemModuleId = $(item).attr('module');

            var currentModule = HShell.content.languageArray[idInLanguageArray].allModules.find(function (el) {
                return el.mod_id === currentItemModuleId;
            });
            if (currentModule) {
                currentModule.notification = {
                    title: $(item).find('title').text(),
                    message: $(item).find('message').text()
                };
            }
        });
    }

    // ________________________________________________________________________________________________________________________________
    // --- Pre-assessment XML
    HShell.xml.getPreXml = function(continueFunc) {
        if (typeof HShell.content.preAssessObj.XML == 'undefined' && HShell.contentSetup.have_pre_a) {
            HShell.xml.readFromXml(
                String('content/' + SL.UI.code + '/' + SL.UI.pre_a),
                function preXmlLoaded(xml) {
                    HShell.content.preAssessObj = HShell.newObjects.newAssessmentObj('pre_assessment', $(xml).find('questions'));
                    HShell.content.preAssessObj.XML = $(xml).find('questions');

                    if (typeof continueFunc == 'function') {
                        continueFunc();
                    }
                });
        } else {
            if (typeof (continueFunc) == 'function') {
                continueFunc();
            }
        }
    };

    // --- Post-assessment XML
    HShell.xml.getPostXml = function(continueFunc) {
        HShell.xml.readFromXml(String('content/' + SL.UI.code + '/' + SL.UI.post_a), postXmlLoaded);

        function postXmlLoaded(xml) {
            var oldPostAssessObj = HShell.content.postAssessObj;
            //var oldServeyObj = HShell.content.surveyObj[HShell.content.surveyObj.lastLang];
            var postAssessmentXml = $(xml).find('questions[quizType="postAssessment"]');

            HShell.content.postAssessObj = HShell.newObjects.newAssessmentObj();
            HShell.content.postAssessObj.XML = postAssessmentXml.clone();
            HShell.content.postAssessObj.XML.find('questionGroup[id="0"]').remove(); // questionGroup with id=0 is the survey question
            HShell.content.postAssessObj.XML.find('questionGroup[id="00"]').remove(); // questionGroup with id=0 is the final survey question

            var isSurveyFinished = HShell.content.surveyObj.finished;
            HShell.content.surveyObj = HShell.newObjects.newAssessmentObj('survey');
            HShell.content.surveyObj.XML = postAssessmentXml.clone();
            HShell.content.surveyObj.XML.find('questionGroup[id!="0"]').remove(); // questionGroup with id=0 is the survey question
            HShell.content.surveyObj.finished = isSurveyFinished;

            HShell.content.surveyObj.allCorrect = true;

            /* Final Survey. */
            HShell.content.finalSurveyObj = HShell.newObjects.newAssessmentObj('post_assessment');
            HShell.content.finalSurveyObj.XML = postAssessmentXml.clone();
            HShell.content.finalSurveyObj.XML.find('questionGroup[id!="00"]').remove(); // questionGroup with id=0 is the survey question


            continueLoadingPostXml();

            //// --- We keep the data from the "survey.xml" files that we have read in one Object
            //if (HShell.contentSetup.have_survey && String(HShell.content.surveyObj[SL.UI.code]) == 'undefined') {
            //    var surveyUrl = 'content/' + SL.UI.code + '/survey.xml';
            //    if (HShell.content.selected_roleObj.surveyOverride) {
            //        surveyUrl = 'content/0.roles/UI_override/' + SL.UI.code + '/survey_' + HShell.content.selected_roleObj.code + '.xml';
            //    }
            //    HShell.xml.readFromXml(surveyUrl, surveyLoaded);
            //} else {
            //    continueLoadingPostXml();
            //}

            //function surveyLoaded(xml) {
            //    HShell.content.surveyObj[SL.UI.code] = HShell.newObjects.newAssessmentObj();
            //    HShell.content.surveyObj[SL.UI.code].XML = $(xml).find('mandatory');
            //    HShell.content.surveyObj[SL.UI.code].allCorrect = true;
            //    HShell.content.surveyObj.lastLang = SL.UI.code;

            //    if (String(oldServeyObj) != 'undefined') {
            //        HShell.content.surveyObj[SL.UI.code].activeQuestion = oldServeyObj.activeQuestion;
            //    }

            //    continueLoadingPostXml();
            //}

            function continueLoadingPostXml() {
                //changeLanguage();
                $('html').attr('lang', HShell.userData.selected_language === 'du' ? 'nl' : HShell.userData.selected_language);
                populateProgressMenu();
                restoreProgressFromArray();
                recreatePostAssessmentWithNewLanguage(oldPostAssessObj);
                HShell.xml.getSurveyDataFormXML();
                if (typeof (continueFunc) == 'function') {
                    continueFunc();
                }
            }
        }
    };

    HShell.xml.getSurveyDataFormXML = function() {
        if (typeof HShell.content.surveyObj != 'undefined') {
            if (HShell.content.surveyObj.quizArray.length === 0) {
                // --- needs to be dynamic the 3th parameter |rework|
                HShell.xml.genereteOneAssessmentFromXml('HShell.content.surveyObj', new Array(), new Array('0'), true);
            }
        }
    };

    // --- Final Survey XML
    HShell.xml.getFinalSurveyXml = function(continueFunc) {
        if ((!HShell.content.finalSurveyObj || typeof HShell.content.finalSurveyObj.XML == 'undefined') && HShell.contentSetup.have_final_survey) {
            HShell.xml.readFromXml(String('content/' + SL.UI.code + '/' + SL.UI.post_a), finalSurveyXmlLoaded);


            function finalSurveyXmlLoaded(xml) {
                var postAssessmentXml = $(xml).find('questions[quizType="postAssessment"]');

                HShell.content.finalSurveyObj = HShell.newObjects.newAssessmentObj('post_assessment');
                HShell.content.finalSurveyObj.XML = postAssessmentXml.clone();
                HShell.content.finalSurveyObj.XML.find('questionGroup[id!="00"]').remove(); // questionGroup with id=00 is the final survey question

                /* Generating the assessment. */
                // HShell.content.finalSurveyObj = HShell.xml.genereteOneAssessmentFromXml('HShell.content.finalSurveyObj');

                if (typeof continueFunc == 'function') {
                    continueFunc();
                }
            }
        } else {
            if (typeof (continueFunc) == 'function') {
                continueFunc();
            }
        }
    }

    function recreatePostAssessmentWithNewLanguage(oldPostAssessObj) {
        if (typeof oldPostAssessObj.attempts != 'undefined') {
            HShell.content.postAssessObj.attempts = oldPostAssessObj.attempts;
        }

        if (typeof oldPostAssessObj.quizArray != 'undefined') {
            var tempArr = new Array();
            HShell.content.postAssessObj.questionsNum = oldPostAssessObj.questionsNum;
            HShell.content.postAssessObj.correctAnswers = oldPostAssessObj.correctAnswers;
            HShell.content.postAssessObj.activeQuestionNum = oldPostAssessObj.activeQuestionNum;
            HShell.content.postAssessObj.activeQuestion = oldPostAssessObj.activeQuestion;
            HShell.content.postAssessObj.activeQuestionData = HShell.fillAssessmentAnswerEndData(HShell.content.postAssessObj);
            HShell.content.postAssessObj.answeredQuestionsNum = oldPostAssessObj.answeredQuestionsNum;

            $(oldPostAssessObj.quizArray).each(function (i, item) {
                var tempQuestionArr = new Array();

                $(item.questionArr).each(function (k, item2) {
                    var tempQtext = HShell.content.postAssessObj.XML.find('questionGroup[id=' + item.id + ']').find('question[id=' + item2.id + ']').find('questionText').text();
                    var tempCorrectFb = HShell.content.postAssessObj.XML.find('questionGroup[id=' + item.id + ']').find('question[id=' + item2.id + ']').find('correct_fb').text();
                    var tempWrongFb = HShell.content.postAssessObj.XML.find('questionGroup[id=' + item.id + ']').find('question[id=' + item2.id + ']').find('wrong_fb').text();
                    var tempAnswersArr = new Array();

                    $(item2.answerArr).each(function (j, item3) {
                        var tempInnerAnswersObj = {
                            aImg: item3.aImg,
                            aText: HShell.content.postAssessObj.XML.find('questionGroup[id=' + item.id + ']').find('question[id=' + item2.id + ']').find('answer[id=' + item3.id + ']').text(),
                            correct: item3.correct,
                            id: item3.id
                        };

                        tempAnswersArr.push(tempInnerAnswersObj);
                    });

                    var qArrayTempObj = {
                        id: item2.id,
                        role: item2.role,
                        type: item2.type,
                        wrongFB: tempWrongFb,
                        qTxt: tempQtext,
                        correctFB: tempCorrectFb,
                        answerArr: tempAnswersArr
                    };

                    tempQuestionArr.push(qArrayTempObj);
                });

                tempArr.push({
                    id: item.id,
                    module: item.module,
                    questionsNumbers: item.questionsNumbers,
                    questionArr: tempQuestionArr
                });
            });

            HShell.content.postAssessObj.quizArray = tempArr;
        }
    }

    // ________________________________________________________________________________________________________________________________

    HShell.xml.genereteOneAssessmentFromXml = function(quizObj, excludeArray, includeArray, justGenerateObject, forceRebuildAssessmentObj) {
        if (typeof quizObj == 'string') {
            quizObj = eval(quizObj);
        }

        var shouldExecute = true;
        if (quizObj.type === 'pre_assessment') {
            shouldExecute = false;
            if (typeof quizObj.quizArray == 'undefined' || quizObj.quizArray.length == 0) {
                shouldExecute = true;
            }
        }

        if (shouldExecute || forceRebuildAssessmentObj) {
            if (quizObj.type === 'pre_assessment') {
                quizObj.quizArray = [];
            }
            quizObj.XML.find('questionGroup').each(function () {
                var newQItem = HShell.newObjects.newGroupObj($(this), excludeArray, includeArray);

                if (newQItem != 'null') {
                    quizObj.quizArray.push(newQItem);

                    if (typeof newQItem != 'undefined' && typeof newQItem.questionArr != 'undefined') {
                        $(newQItem.questionArr).each(function (index, item) {
                            if (item == 'undefined') {
                                newQItem.questionArr.pop(item);
                                newQItem.questionsNumbers--;
                            }
                        });
                    }
                }
            });
        }

        if (!justGenerateObject) {
            if (HShell.contentSetup.postAssessmentRand) {
                shuffleArray(quizObj.quizArray);
            }
            $.each(quizObj.quizArray, function (i, val) {
                var randQuHtml = selectQuestionsFromXMLToShow($(this), quizObj);

                if (randQuHtml == 0) {
                    HShell.utils.trace('There is no questions for the selected role, in at least one category!',
                        'genereteOneAssessmentFromXml');
                } else {
                    $('#questionsContainer').append(randQuHtml);
                    HShell.core.renderComponents($('#questionsContainer'));
                }
            });

            enableQuestionsTypeSpesificFunctions(quizObj);

            reskinAllContent($('.assessmentHeaderContainer, .assessmentQuestionsContainer, #buttonsContainer'));

            $('.assessmentProgressContainer').text('1' + '/' + quizObj.questionsNum);
            updateProgressBar(1, quizObj.questionsNum);


            return quizObj;
        }
    };
})();

/// <reference path="_references.js" />

var HShell = window.HShell || {};

// ---- direction: 'next' of 'previous', default is 'next';
function gotoController(direction) {
    switch (direction) {
        case 'next':
            HShell.autoSetup.shellModuleStep++;
            break;
        case 'previous':
            HShell.autoSetup.shellModuleStep--;
            break;
    }
    direction = direction || 'next';

    var location = HShell.globalSetup.segmentsOrder[HShell.contentSetup.course_template][HShell.autoSetup.shellModuleStep];
    switch (location) {
        case 'startingCover':
            if (HShell.contentSetup.have_startingCover) {
                gotoStartingCover();
            } else {
                gotoController(direction);
            }
            break;
        case 'langSelect':
            if (HShell.contentSetup.language_select) {
                gotoLanguageSelect();
            } else {
                changeLanguage();
                HShell.xml.getPreXml();
                gotoController(direction);
            }
            break;
        case 'newToCompany':
            if (HShell.contentSetup.have_newToCompanyScreen) {
                gotoNewToCompany();
            } else {
                gotoController(direction);
            }
            break;
        case 'intro':
            if (HShell.content.selected_roleObj !== 'null') {
                if (HShell.content.selected_roleObj.introVideoURL.length > 1) {
                    gotoIntroduction();
                } else {
                    gotoController(direction);
                }
            } else {
                gotoController(direction);
            }
            break;
        case 'tutorial':
            if (HShell.contentSetup.have_tutorial) {
                gotoTutorial();
            } else {
                gotoController(direction);
            }
            break;
        case 'audioAvailable':
            gotoAudioAvailable();
            break;
        case 'brandSelect':
            if(HShell.contentSetup.brand_select) {
                var brandsNumber = HShell.content.getBrandsCountForSelectedLanguage();

                if (brandsNumber == 1) {
                    HShell.content.selected_brandObj = HShell.content.brandsArray.filter(function (item) {
                        return item.label_text.hasOwnProperty(HShell.userData.selected_language);
                    })[0];
                    HShell.userData.selected_brand = HShell.content.selected_brandObj && HShell.content.selected_brandObj.code;
                    document.getElementById('SCORM_Container').setAttribute('data-brand', HShell.userData.selected_brand);

                    gotoController(direction);
                } else {
                    gotoBrandSelect();
                }
            } else {
                gotoController(direction);
            }
            break;
        case 'roleSelect':
            var rolesNumber = countRolesForSelectedLanguage();
            if (rolesNumber == 1) {
                HShell.contentSetup.role_select = false;
            }

            if (HShell.contentSetup.role_select && !HShell.contentSetup.skip_roleSelect) {
                gotoRoleSelect();
            } else {
                if(HShell.contentSetup.brand_select) {
                    if (HShell.contentSetup.dynamic_brand_logo){
                        $('#eLHeaderLogoContainer').css('display', '');
                        $('#SCORM_Container').addClass('dynamicBrandLogo');
                    }
                    HShell.content.selected_roleObj = HShell.content.roleArray.filter(function (item) {
                        return item.label_text.hasOwnProperty(HShell.userData.selected_language) && item.brand === HShell.userData.selected_brand;
                    })[0];
                } else {
                    HShell.content.selected_roleObj = HShell.content.roleArray[0];
                }
                HShell.userData.selected_role = HShell.content.selected_roleObj.code;
                HShell.userData.selected_roleCode = HShell.content.selected_roleObj.roleCode;

                document.getElementById('SCORM_Container').setAttribute('data-role', HShell.userData.selected_role);

                changeBrandingTo(HShell.content.selected_roleObj.brandingThemeFolder);
                if (HShell.content.selected_roleObj.uiOverride) {
                    HShell.reloadUiXml(HShell.content.selected_roleObj.code);
                }

                var tempLangCount = 0;
                for (var prop in HShell.content.selected_roleObj.label_text) {
                    if (HShell.content.selected_roleObj.label_text.hasOwnProperty(prop)) {
                        tempLangCount++;
                    }
                }
                if (tempLangCount == 1) {
                    HShell.contentSetup.language_select = false;
                }

                generateRoleModulesList(HShell.content.selected_roleObj.modules_list);
                if (HShell.contentSetup.have_pre_a) {
                    HShell.contentSetup.have_pre_a = !HShell.content.selected_roleObj.skip_pre_a;
                }
                createModulesObjAfterRoleSelected(HShell.content.selected_languageObj.idInLanguageArray);
                if (HShell.contentSetup.have_notifications) {
                    HShell.xml.getNotifications(HShell.content.selected_languageObj.idInLanguageArray);
                }

                gotoController(direction);
            }
            break;

        case 'pre_a':
            if (HShell.contentSetup.have_pre_a &&
                !HShell.contentSetup.skip_pre_a &&
                !HShell.content.selected_roleObj.skip_pre_a &&
                !HShell.content.roleNoPreAssessment &&
                !HShell.contentSetup.isFullCourse) {
                gotoPreAssessement();
            } else {
                gotoController(direction);
            }
            break;

        case 'final_survey':
            if (HShell.contentSetup.have_final_survey) {
                // goToFinalSurvey();
                goToPostAssessWellDone();
            } else {
                gotoController(direction);
            }
            break;
        case 'mod_select':
        case 'module_video':
        case 'module_iframe':
        case 'preAssessFinScreen':
        case 'post_evalPage':
        case 'survey':
            gotoModuleSelection();
            break;
        case 'courseInformation':
            if (HShell.userData.selected_role.indexOf('ee') === 0 ||
                HShell.userData.selected_role.indexOf('pl') === 0) {
                gotoCourseInformationScreen();
            } else {
                gotoController(direction);
            }
            break;
        case 'newsScreen':
            if (HShell.contentSetup.have_newsScreen && typeof HShell.content.newsObj !== 'undefined' && HShell.content.newsObj.enabled) {
                gotoNewsScreen();
            } else {
                gotoController(direction);
            }
            break;
        case 'warningScreen':
            if (HShell.contentSetup.have_warningScreen && typeof HShell.content.warningObj !== 'undefined' && HShell.content.warningObj.enabled) {
                gotoWarningScreen();
            } else {
                gotoController(direction);
            }
            break;
        case 'peopleManager':
            if (HShell.contentSetup.have_peopleManager && typeof HShell.content.peopleManagerObj !== 'undefined' && HShell.content.peopleManagerObj.enabled) {
                gotoPeopleManager();
            } else {
                gotoController(direction);
            }
            break;
        default:
            if (typeof window.courseSpecific_goToController == 'function') {
                window.courseSpecific_goToController(location);
            } else {
                console.log(location + ' does not exist');
                gotoController(direction);
            }
            break;
    }
}

// ________________________________________________________________________________________________________________________________

function goToCommon(lastPosition, buildFunc, newWindow) {
    changeLastLocation(lastPosition);

    //build header if there's no yet
    if($('.Component_MainHeader').length === 0) {
        $('#SCORM_Container').prepend(HShell.core.getComponent('MainHeader').init({isVisible: true}));
        HShell.core.renderComponents($('#SCORM_Container'));
    }

    //using the variable accessibilityTitleRead to determinate if the first screen is passed
    if (HShell.autoSetup.accessibilityTitleRead && HShell.autoSetup.runOn.OS === 'iOS') {
        $('#forced_speech_container').attr('aria-hidden', false);
    }

    //The timeout is here because for some unknown reason the screen reader doesn't read the text otherwise.
    if (!HShell.autoSetup.accessibilityTitleRead) {
        setTimeout(function () {
            HShell.a11y.speak(HShell.content.selected_languageObj.UI.course_title);
        }, 100);

        HShell.autoSetup.accessibilityTitleRead = true;

        //iphone accessibility - voiceOver - hide speech container on the first screen, because the focus goes there onload
        if (HShell.autoSetup.runOn.OS === 'iOS') {
            $('#forced_speech_container').attr('aria-hidden', true);
        }
    }

    if (typeof (buildFunc) == 'function') {
        var result = buildFunc();

        if(result && result.render){
            newWindow = '#' + result._id;
        }

    }

    if (String(newWindow) != 'undefined' && newWindow !== false) {
        HShell.autoSetup.activeWindow.hideWindow();
        HShell.autoSetup.activeWindow = $(newWindow).showWindow();
    }
}


function changeLastLocation(lastPosition) {
    HShell.savedData.last_location = lastPosition;
    document.getElementById('SCORM_Container').setAttribute('data-location', lastPosition);
    HShell.core.$emit('locationChange', { newLocation: lastPosition });

    // // VVV Sets the title to the active screen name. Reverted because of accessibility.
    // // Screen readers doesn't register the title change and act confusingly for the user
    // //
    // var lastPositionTitle = '';
    // switch (lastPosition) {
    //     case 'langSelect':
    //         lastPositionTitle = ' - Select Language'
    //         break;
    //     case 'brandSelect':
    //         lastPositionTitle = ' - Select Brand'
    //         break;
    //     case 'roleSelect':
    //         lastPositionTitle = ' - Select Role'
    //         break;
    //     case 'pre_a':
    //         lastPositionTitle = ' - Pre-assessment'
    //         break;
    //     case 'post_a':
    //         lastPositionTitle = ' - Post-assessment'
    //         break;
    //     case 'mod_select':
    //         lastPositionTitle = ' - Home Page' 
    //         break;
    //     case 'module_video':
    //     case 'module_iframe':
    //     case 'module_slides':
    //     case 'module_layouts':
    //         if (HShell.content && HShell.content.activeModule && HShell.content.activeModule.id) {
    //             var module = HShell.content.getModuleById(HShell.content.activeModule.id);
    //             if (module && module.title){
    //                 lastPositionTitle = ' - Module ' + module.title;
    //             } else {
    //                 lastPositionTitle = ' - Module Page';
    //             }
    //         } else {
    //             lastPositionTitle = ' - Module Page';
    //         }
    //         if (HShell.content && HShell.content.selected_languageObj && HShell.content.selected_languageObj.UI) {
    //             document.title = HShell.content.selected_languageObj.UI.course_title + lastPositionTitle;
    //         }
    //         break;
    // }
    // if (HShell.content && HShell.content.selected_languageObj && HShell.content.selected_languageObj.UI) {
    //     document.title = HShell.content.selected_languageObj.UI.course_title + lastPositionTitle;
    // }
}

// ________________________________________________________________________________________________________________________________

function addMobileAttributesForAccessibilityToCustomForm(containerSelector) {
    //iphone voiceOver tabindex added in order to focus and autoscroll to the selected radio button,
    //because it is not selectable otherwise (out of the screen)
    if (HShell.autoSetup.runOn.deviceType === 'mobile') {
        //windowsPhone - role button... tabindex don't have the expected behaviour on windows phone with narrator
        if (HShell.autoSetup.runOn.OS === 'windowsPhone') {
            $(containerSelector + '> li').attr('tabindex', 0).attr('role', 'button');
        }
        //iphone
        else {
            $(containerSelector + '> li').attr('tabindex', 0).attr('role', 'radio');
        }

        $(containerSelector + '> li').uniClick(function () {
            $(containerSelector + '> li').attr('aria-checked', false);
            $(this).attr('aria-checked', true);
        });
    }
}

function gotoLanguageSelect() {
    if (HShell.contentSetup.dynamic_brand_logo){
        $('#eLHeaderLogoContainer').css('display', 'none');
        $('#SCORM_Container').addClass('dynamicBrandLogo')
    }

    goToCommon('langSelect', buildLanguageSelection, '#languageContainer');

    addMobileAttributesForAccessibilityToCustomForm('#flagsContainer');
    $('.oneFlagContainer')
        .each(function () {
            $(this).parent()
                .uniClick(function () {
                    $(this).find('input').prop('checked', true);

                    HShell.userData.selected_language = $(this).attr('code');

                    HShell.content.selected_languageObj = HShell.content.languageArray[$(this).attr('positionInArray')];
                    SL = HShell.content.selected_languageObj;

                    $('.oneFlagContainer').parent().removeClass('active');
                    $(this).addClass('active');

                    changeLanguage();

                    //Accessibility
                    //ISO Language code for Dutch is "nl", we are using "du", should be |rework|ed,
                    $('html').attr('lang', HShell.userData.selected_language === 'du' ? 'nl' : HShell.userData.selected_language);

                    populateProgressMenu();
                    restoreProgressFromArray();

                    $('#eLHeaderTitleContainer').text(HShell.content.selected_languageObj.UI.label_course_title);
                });

            $(this).parent().on('doubletap', function (event) {
                $(this).click();
                $('#btn_langContinue').click();
            }); // Allows double tap on the flags to select the language
            $(this).parent().dblclick(function () {
                $(this).click();
                $('#btn_langContinue').click();
            }); // Allows double click on the flags to select the language
        });

    if(HShell.userData.selected_language && HShell.userData.selected_language !== 'null') {
        $('#flagsContainer > li[code="'+HShell.userData.selected_language+'"]').click();
    } else {
        $('#flagsContainer > li').first().click(); // Auto selects the first item
    }

    if (!HShell.contentSetup.langScreen_showDescription) {
        $('#eLHeaderDescriptionContainer').addClass('hidden');
    } else {
        $('#eLHeaderDescriptionContainer').removeClass('hidden');
    }

    $('#SCORM_Container, body').scrollTop(0);

    $('#btn_langContinue').uniClick(function () {
        // HShell.xml.getPreXml();
        if (HShell.contentSetup.have_newsScreen) {
            HShell.xml.getNewsXml();
        }
        if (HShell.contentSetup.have_warningScreen) {
            HShell.xml.getWarningXml();
        }
        if (HShell.contentSetup.have_peopleManager) {
            HShell.xml.getPeopleManagerXml();
        }

        //remove buttonsContainer
        $(this).closest('.buttonsContainer').remove();

        $('#eLHeaderDescriptionContainer').addClass('mobileHidden');

        // Loads the pre-assessment XML so that it dose not take time when needed, and after the language select we know what file to load
        gotoController('next');
        $('#SCORM_Container, body').scrollTop(0);
    });

    //timeout in order to be read after the title.
    setTimeout(function () {
        HShell.a11y.speak($('#langTitleContainer').text());
    }, 500);
}

// ________________________________________________________________________________________________________________________________

function countRolesForSelectedLanguage() {
    var rolesNumber = 0;
    $(HShell.content.roleArray).each(function (i, item) {
        if (item.label_text.hasOwnProperty(HShell.userData.selected_language)) {
            if (HShell.contentSetup.brand_select) {
                if (item.brand === HShell.userData.selected_brand) {
                    rolesNumber++;
                }
            } else {
                rolesNumber++;
            }
        }
    });

    return rolesNumber;
}

function gotoStartingCover() {
    $('#eLContentContainer').empty();
    goToCommon('startingCover', buildStartingCoverScreen, '#startingCoverContainer');

    $('#startingCoverScreenContainer #startBtn').uniClick(function () {
        gotoController('next');
        $('#startingCoverScreenContainer').remove();
        $('#SCORM_Container, body').scrollTop(0);
    });

    HShell.a11y.speak($('#startingCoverScreenContentContainer #courseTitle').text() + '. ' + $('#startingCoverScreenContentContainer .courseDescription').text());
}

function gotoNewToCompany() {
    if (HShell.contentSetup.dynamic_brand_logo){
        $('#eLHeaderLogoContainer').css('display', 'none');
        $('#SCORM_Container').addClass('dynamicBrandLogo');
    }

    if (typeof window.courseSpecific_gotoNewToCompany == 'function') {
        window.courseSpecific_gotoNewToCompany();
        return;
    }

    goToCommon('newToCompany', buildIsNewEmployeeScreen, '#newToCompanyContainer');
    if (!HShell.contentSetup.newToCompanyScreen_showDescription) {
        $('#eLHeaderDescriptionContainer').addClass('hidden');
    } else {
        $('#eLHeaderDescriptionContainer').removeClass('hidden');
    }
    $('#eLHeaderTitleContainer').text(SL.UI.course_title);
    changeLanguage();
}

function gotoCourseInformationScreen() {
    if (typeof window.courseSpecific_gotoCourseInformationScreen == 'function') {
        window.courseSpecific_gotoCourseInformationScreen();
        return;
    }

    goToCommon('courseInformation', buildCourseInformationScreen, '#importantInformationContainer');

    $('.uiButton').first().focus();
    $('#SCORM_Container, body').scrollTop(0);

    $('#eLHeaderTitleContainer').text(SL.UI.course_title);

    $('#continueBtn').uniClick(function () {
        gotoController('next');
        $('#SCORM_Container, body').scrollTop(0);
    });

    HShell.a11y.speak($('#infoTitle').text() + '. ' + $('#infoContent').text());

    HShell.storage.commitData('low');
}

// ________________________________________________________

function gotoRoleSelect() {
    if (HShell.contentSetup.dynamic_brand_logo){
        $('#eLHeaderLogoContainer').css('display', '');
        $('#SCORM_Container').addClass('dynamicBrandLogo');
    }

    if (HShell.config.courseFullTitle == "Living Up to Our Commitments" || HShell.config.courseFullTitle == undefined) {
        if (typeof HShell.courseSpecific.gotoPermissions == 'function') {
            HShell.courseSpecific.gotoPermissions();
            return;
        }
    } else {
        if (HShell.courseSpecific.gotoRoleSelect) {
            HShell.courseSpecific.gotoRoleSelect();
            return;
        }
    }

    goToCommon('roleSelect', buildRoleSelection, '#roleContainer');

    addMobileAttributesForAccessibilityToCustomForm('#rolesContainer');

    $('#rolesContainer > li > input').first().focus();

    if (!HShell.contentSetup.roleSelectScreen_showDescription) {
        $('#eLHeaderDescriptionContainer').addClass('hidden');
    } else {
        $('#eLHeaderDescriptionContainer').removeClass('hidden');
    }

    $('#eLHeaderTitleContainer').text(SL.UI.course_title);

    $('.oneRoleItem').uniClick(function () { $(this).parent().click(); });

    $('.oneRoleItem').focus(function () {
        $('#rolesContainer li').removeClass('focused');
        $(this).parent().addClass('focused');
    });

    $('#rolesContainer li').uniClick(function () {
        HShell.content.selected_roleObj = HShell.content.roleArray[$(this).attr('positionInArray')];
        $('#rolesContainer li').removeClass('active focused');
        $(this).addClass('active focused');
        $(this).find('input').prop('checked', true);
    });

    $('#rolesContainer li').dblclick(function () {
        $(this).click(); $('#btn_roleContinue').click();
    });

    // Allows doble click on the roleIcon to select the Role
    $('#rolesContainer li').on('doubletap', function () {
        $(this).click(); $('#btn_roleContinue').click();
    });

    $('#rolesContainer li').first().click(); // Auto selects the first item

    $('#btn_roleContinue').uniClick(function () {
        HShell.userData.selected_role = HShell.content.selected_roleObj.code;
        HShell.userData.selected_roleCode = HShell.content.selected_roleObj.roleCode;

        document.getElementById('SCORM_Container').setAttribute('data-role', HShell.userData.selected_role);

        changeBrandingTo(HShell.content.selected_roleObj.brandingThemeFolder);
        if (HShell.content.selected_roleObj.uiOverride) {
            HShell.reloadUiXml(HShell.content.selected_roleObj.code);
        }

        var tempLangCount = 0;
        for (var prop in HShell.content.selected_roleObj.label_text) {
            tempLangCount++;
        }
        if (tempLangCount == 1) {
            HShell.contentSetup.language_select = false;
        }

        generateRoleModulesList(HShell.content.selected_roleObj.modules_list);
        if (HShell.contentSetup.have_pre_a) {
            HShell.contentSetup.have_pre_a = !HShell.content.selected_roleObj.skip_pre_a;
        }
        createModulesObjAfterRoleSelected(HShell.content.selected_languageObj.idInLanguageArray);
        if (HShell.contentSetup.have_notifications) {
            HShell.xml.getNotifications(HShell.content.selected_languageObj.idInLanguageArray);
        }

        gotoController('next');
    });

    setTimeout(function () {
        HShell.a11y.speak($('#role_selectionContainer #roleTitle').text() + '. ' + $('#role_selectionContainer #roleExplanation').text());
    }, 500);

    //HShell.storage.commitData('low');			// --- |rework| If we commit here, we are commiting all the modules as objectives, before we have selected a role. Since this will result in having for exapmle 21 objectives where we need only 18, we are skipping this commit for now
}

// ________________________________________________________________________________________________________________________________

function gotoBrandSelect() {
    goToCommon('brandSelect', buildBrandSelection, true);
    if (HShell.contentSetup.dynamic_brand_logo){
        $('#eLHeaderLogoContainer').css('display', 'none');
        $('#SCORM_Container').addClass('dynamicBrandLogo');
    }
    if (!HShell.contentSetup.brandSelectScreen_showDescription) {
        $('#eLHeaderDescriptionContainer').addClass('hidden');
    } else {
        $('#eLHeaderDescriptionContainer').removeClass('hidden');
    }
    $('#eLHeaderTitleContainer').text(SL.UI.course_title);

    addMobileAttributesForAccessibilityToCustomForm('#brandsContainer');

    $('#brandsContainer li').uniClick(function () {
        $('#btn_brandContinue').removeClass('inactive').attr('disabled', false).attr('aria-disabled', 'false');
        HShell.content.selected_brandObj = HShell.content.brandsArray[$(this).attr('positionInArray')];
        $('#brandsContainer li').removeClass('active');
        $(this).addClass('active');
        $(this).find('input').prop('checked', true);
    });

    $('#brandsContainer li > input').on('focus', function () {
        $(this).closest('li').addClass('focused');
    });

    $('#brandsContainer li > input').on('blur', function () {
        $(this).closest('li').removeClass('focused');
    });

    $('#brandsContainer li').dblclick(function () {
        $(this).click();
        $('#btn_brandContinue').click();
    });

    // Allows double click on the roleIcon to select the Role
    $('#brandsContainer li').on('doubletap', function (event) {
        $(this).click();
        $('#btn_brandContinue').click();

    });

    $('#brandsContainer li').first().click(); // Auto selects the first item

    $('#btn_brandContinue').uniClick(function () {
        if ($(this).hasClass('inactive')) {
            return;
        }
        HShell.userData.selected_brand = HShell.content.selected_brandObj && HShell.content.selected_brandObj.code;

        document.getElementById('SCORM_Container').setAttribute('data-brand', HShell.userData.selected_brand);

        $('#eLContentContainer').empty();

        gotoController('next');
    });

    if (HShell.content.selected_brandObj && HShell.content.selected_brandObj.code) {
        var selectedIndex = 0;
        if(Array.isArray(HShell.content.brandsArray)) {
            HShell.content.brandsArray.forEach(function (brand, brandIndex) {
                if (brand.code == HShell.content.selected_brandObj.code) {
                    selectedIndex = brandIndex;
                }
            });
        }
        $('#brandsContainer > li[positioninarray="' + selectedIndex + '"]').click();
    }
    
    $('#brandsContainer > li > input').first().focus();
}

// ________________________________________________________________________________________________________________________________

function gotoNewsScreen() {
    if (HShell.contentSetup.dynamic_brand_logo && HShell.userData.selected_role == 'null'){
        $('#eLHeaderLogoContainer').css('display', 'none');
        $('#SCORM_Container').addClass('dynamicBrandLogo');
    }

    goToCommon('newsScreen', buildNewsScreen, '#newsScreenContainer');
    if (HShell.autoSetup.runOn.deviceType !== HShell.consts.deviceType.mobile) {
        $('.uiButton').first().focus();
    }
    $('#SCORM_Container, body').scrollTop(0);

    $('html').attr('lang', HShell.userData.selected_language === 'du' ? 'nl' : HShell.userData.selected_language);

    if (!HShell.contentSetup.newsScreen_showDescription) {
        $('#eLHeaderDescriptionContainer').addClass('hidden');
    } else {
        $('#eLHeaderDescriptionContainer').removeClass('hidden');
    }

    $('#eLHeaderTitleContainer').text(SL.UI.course_title);

    $('#newsContinueBtn').uniClick(function () {
        gotoController('next');
        $('#newsContainer, #newsButtonsContainer').remove();
        $('#SCORM_Container, body').scrollTop(0);
    });

    //timeout in order to be read after the title in case this is the first screen
    setTimeout(function () {
        var courseDescription =  HShell.contentSetup.newsScreen_showDescription ? $('#eLHeaderDescriptionContainer').text() || '' : '';
        var newsTitleText =  $('#newsTitleContainer').text();
        newsTitleText = newsTitleText ? newsTitleText + '. ' : '';
        var newsContent = $('#newsScreenContent').text();
        HShell.a11y.speak(courseDescription + ' ' + newsTitleText + ' ' + newsContent);
    }, 500);

    HShell.storage.commitData('low');
}

function gotoWarningScreen() {
    goToCommon('warningScreen', buildWarningScreen, '#warningScreenContainer');
    $('.uiButton').first().focus();
    $('#SCORM_Container, body').scrollTop(0);

    $('html').attr('lang', HShell.userData.selected_language === 'du' ? 'nl' : HShell.userData.selected_language);

    if (!HShell.contentSetup.warningScreen_showDescription) {
        $('#eLHeaderDescriptionContainer').addClass('hidden');
    } else {
        $('#eLHeaderDescriptionContainer').removeClass('hidden');
    }

    $('#eLHeaderTitleContainer').text(SL.UI.course_title);

    $('#warningContinueBtn').uniClick(function () {
        gotoController('next');
        $('#SCORM_Container, body').scrollTop(0);
    });

    HShell.a11y.speak($('#warningScreenContent').text());

    HShell.storage.commitData('low');
}

function gotoPeopleManager() {
    goToCommon('peopleManager', buildPeopleManager, '#peopleManagerContainer');
    $('.uiButton').first().focus();
    $('#SCORM_Container, body').scrollTop(0);

    $('html').attr('lang', HShell.userData.selected_language === 'du' ? 'nl' : HShell.userData.selected_language);

    $('#eLHeaderTitleContainer').text(SL.UI.course_title);

    /*
     *
     *  If users select yes, they will skip the question related to the introductory module,
        that will therefore be mandatory for them.
     *
     **/

    /* YES. */
    $('#btn_peopleManagerYes').uniClick(function () {
        HShell.contentSetup.isPeopleManager = true;
        localStorage.setItem('isPeopleManager', true);
        HShell.content.preAssessObj.XML.find('questionGroup[module="2"]').remove(); // This user is "People Manager" so module=2 will be hidden.
        HShell.content.preAssessObj.XML.find('questionGroup[module="3"]').remove(); // This user is "People Manager" so module=3 will be hidden.
        gotoController('next');
        $('#SCORM_Container, body').scrollTop(0);
    });

    /* NO. */
    $('#btn_peopleManagerNo').uniClick(function () {
        localStorage.setItem('isPeopleManager', false);
        gotoController('next');
        $('#SCORM_Container, body').scrollTop(0);
    });

    HShell.a11y.speak($('#peopleManagerContent').text());

    HShell.storage.commitData('low');
}

// ________________________________________________________________________________________________________________________________

function gotoAudioAvailable() {
    goToCommon('audioAvailable', buildAudioAvailable, '#audioAvalContainer');
    $('.uiButton').first().focus();
    $('#SCORM_Container, body').scrollTop(0);

    $('html').attr('lang', HShell.userData.selected_language === 'du' ? 'nl' : HShell.userData.selected_language);

    $('#eLHeaderTitleContainer').text(SL.UI.course_title);

    $('#aAContinueBtn').uniClick(function () {
        gotoController('next');
        $('#SCORM_Container, body').scrollTop(0);
    });

    /* Audio On. */
    $('#aAAudioOnBtn').uniClick(function () {
        gotoController('next');
        $('#SCORM_Container, body').scrollTop(0);
        localStorage.setItem("audioState", "on");
    });

    /* Audio Off. */
    $('#aAAudioOffBtn').uniClick(function () {
        gotoController('next');
        $('#SCORM_Container, body').scrollTop(0);
        HShell.userData.volume_level = 'mute'; // Set volume level = 0 [Muted].
        HShell.userData.prefer_subtitles = 1; // Enabling subtitles.
        localStorage.setItem("audioState", "off");
        $('.vidPopMuteBtn').addClass('muted');
        $('.vidPopMuteBtn')
            .find('.toolTipInnerContainer')
            .html(SL.UI.label_unMute)
            .parent()
            .parent()
            .attr('name', SL.UI.label_mute + ': control + alt + M');

        $('.vidPopSubtitlesContainer').toggleClass('noSubtitles');
        $('.vidPopSubtitles')
            .find('.toolTipInnerContainer')
            .html(SL.UI.lable_subtitles_disable)
            .parent()
            .parent()
            .attr('name', SL.UI.lable_subtitles_disable)
    });

    HShell.a11y.speak($('#aAContent').text());

    HShell.storage.commitData('low');
}

// ________________________________________________________

function gotoIntroduction() {
    goToCommon(HShell.consts.locations.intro, buildIntroduction, '#introductionContainer');

    $('#forced_speech_container, #eLearningGenericContainer').attr('aria-hidden', true);
}

function skipIntroduction() {
    HShell.autoSetup.activeVideo.stop();
    $('#introContaienr').remove();
    gotoController('next');
}


// ________________________________________________________

function gotoTutorial(firstLoad, originalLocation) {
    // ---  On all Phones, we have the ability to skip the Tutorial before playing it
    if (HShell.autoSetup.runOn.deviceType == 'mobile' && HShell.autoSetup.runOn.deviceName != 'ipad' && firstLoad !== false) {
        goToCommon('skipTutorial', buildSkipTutprial, '#skipTutorial');

        $('#forced_speech_container, #eLearningGenericContainer').attr('aria-hidden', false);

        $('.uiButton').first().focus();

        $('#aAWatchVid').uniClick(function () {
            continueWithTutorial(firstLoad, originalLocation);
            $('#SCORM_Container, body').scrollTop(0);
        });

        $('#aASkipVid').uniClick(function () {
            gotoController('next');
            $('#SCORM_Container, body').scrollTop(0);
        });

        HShell.a11y.speak($('#skipTutorialContent').text());

    } else {
        continueWithTutorial(firstLoad, originalLocation);
    }
}

function continueWithTutorial(firstLoad, originalLocation) {
    buildTutorial();
    $('#eLHeaderTitleContainer').text(SL.UI.course_title);

    $('#mainContentContainer').hide();

    if (firstLoad !== false) {
        goToCommon('tutorial', false, '#tutorialContaienr');
    } else {
        HShell.utils.scrollTopMainContainer();
        $('#homePageHeaderButtonsContainer').hide();
    }

    //hiding the containers behind for screen readers, because iphone voiceOver is reading them
    $('#forced_speech_container, #eLearningGenericContainer').attr('aria-hidden', true);

    //$('.vidPopVideoContainer').focus();

    $('#vidPopSkipBTN').uniClick(function () {

        $('body.iOS div.vidPopPlayBtn')
            .each(function () {
                if (!$(this).hasClass('paused')) {
                    $(this).click();
                }
            });
        if (String(originalLocation) != 'undefined') { // --- Returns the last location to the same state that it was before opening the tutorial
            changeLastLocation(originalLocation);
        }

        if (firstLoad !== false) {
            if (HShell.contentSetup.isFullCourse == true){
                gotoModuleSelection();
            } else {
                gotoController('next');
            }
        } else {
            $('#tutorialContaienr').remove();
            $('#homePageHeaderButtonsContainer').show();

            if (HShell.savedData.last_location === HShell.consts.locations.moduleSelect) {
                HShell.utils.scrollTopMainContainer();
            }

            oneModuleQuizButtonClicker($('.oneModuleQuizButtonContainer.active'), 0);

            if (HShell.savedData.last_location == 'post_a' || HShell.savedData.last_location == 'post_evalPage') {
                $('#SCORM_Container').css({ overflowY: 'scroll' });
            }
        }

        //hiding the containers behind for screen readers, because iphone voiceOver is reading them
        $('#forced_speech_container, #eLearningGenericContainer').attr('aria-hidden', false);

        if (originalLocation == HShell.consts.locations.moduleSelect) {
            $('#mainContentContainer').show();
            //iphone modules hiding speech container at all
            if (HShell.autoSetup.runOn.OS === 'iOS') {
                $('#forced_speech_container').attr('aria-hidden', true);
            }
        }
    });
    HShell.storage.commitData('low');
}

// ________________________________________________________________________________________________________________________________

function gotoPreAssessement() {
    goToCommon('pre_a', buildPreAssessment, '#preAssessementContainer');
    //well.. needs a delay, otherwise the rewind video button is read, but not focus is on pre-assessment button...
    // setTimeout(function () {
    //     $('#startPre').focus();
    // }, 100);

    $('#SCORM_Container, body').scrollTop(0);
    $('#homePageHeaderContainer').css('display', 'none');
    $('#eLHeaderTitleContainer').text(SL.UI.course_title);

    if (HShell.contentSetup.fancyAssessment) {
        $('#eLearningGenericContainer').addClass('fancyPreAssessment');
    }

    // $('#startPre').uniClick(function () {
    setTimeout(function () {
        $('#preAssessStartScreenContainer').remove();
        $('#eLearningGenericContainer').addClass('fancyPreAssessment__started');
        $('#preAssessementContainer').addClass('scrollabel');
        $('.assessmentHeaderContainer, #questionsContainer, #buttonsContainer').show();
        $('#SCORM_Container, body').scrollTop(0);
        if ($('.questionContainer').first().attr('type') == 'video') {
            $('.questionContainer').first().find('.vidPopPlayBtn').click();
        }

        // --- (Accessibility)
        var questionProgressObj = $('.assessmentProgressContainer').text().split('/');
        var tempStr = 'Question ' + questionProgressObj[0] + ' ' + SL.UI.of + ' ' + questionProgressObj[1];
        tempStr += '&nbsp; <br>' + $('.questionContainer').first().find('.questionTitle').first().text();
        HShell.a11y.speak(tempStr, true);

        // --- (Tracking of the time for the assessment)
        HShell.content.preAssessObj.timeSpendInterval = setInterval(function () {
            HShell.content.preAssessObj.timeSpend++;
        }, 1000);

        HShell.a11y.focusOn('#assessmentTypeIndicator');

        HShell.content.preAssessObj.completion_status = 'incomplete';
        HShell.autoSetup.SCORM.SCORMsaveChangedAssessmentObjectives();
        HShell.qaMode.assessmentStart && HShell.qaMode.assessmentStart();
    }, 0);
    // });
    HShell.xml.getPreXml(continueWithPreAssessment);

    function continueWithPreAssessment() {
        HShell.xml.genereteOneAssessmentFromXml('HShell.content.preAssessObj', 'null', HShell.content.selected_roleObj.modules_listArray, false, true);
        enableAssessmentFuncs('HShell.content.preAssessObj');
    }
    HShell.storage.commitData('low');
}

// ________________________________________________________

function goToPreAssessFinScreen() {
    changeLastLocation('preAssessFinScreen');

    HShell.autoSetup.activeWindow.hideWindow();

    buildPreAssessmentThankYou();

    // setTimeout(function () { $('#pAThankYouContinueBtnReskin').focus(); }, 10);
    // --- Screen readers can be a pain in the butt some times. We use the delay so that the screen reader can override whotever it was reading on the previouse screen

    $('#eLearningGenericContainer').removeClass('fancyPreAssessment__started');
    $('#eLearningGenericContainer').scrollTop(0).addClass('finishScreen');
    $('#homePageHeaderContainer').css('display', '');

    $('#pAThankYouContinueBtnReskin').uniClick(function () {

        gotoController('next');
        $('#SCORM_Container, body').scrollTop(0);

        // if (checkIsCourseCompleted()) {
        //     gotoEvalPostPage(true);
        // }
    });

    $('#SCORM_Container, body').scrollTop(0);
    HShell.storage.commitData('immediate');

    clearInterval(HShell.content.preAssessObj.timeSpendInterval);

    HShell.qaMode.assessmentEnd && HShell.qaMode.assessmentEnd();
}

function markCompletedModulesInProgressIfNotification() {
    $(HShell.content.preAssessObj.finishedModules).each(function (index, item) {
        var currentModuleObj = HShell.content.selected_languageObj.allModules.find(function (el) { return item === el.mod_id; });

        if (currentModuleObj && currentModuleObj.notification) {
            for (var k = 0; k < HShell.content.languageArray.length; k++) {
                markModuleAsInProgress(currentModuleObj.mod_id, HShell.content.languageArray[k]);
            }
        }
    });
}

function checkIsCourseCompleted() {
    var finishedMods = 0;
    var allMods = 0;
    $(SL.allModules).each(function (i, item) {
        if (item.mandatory) { allMods++; }
        if (item.content_completion_status == 'completed' && item.mandatory) { // --- For the ATool this must not be "content_completion_status" but 'completion_status'. For some reason this is not working on jZero, so for now it is like this |rework|
            finishedMods++;
        }
    });

    if (finishedMods == allMods) {
        return true;
    }

    return false;
}

// ________________________________________________________________________________________________________________________________

function goToPostAssessment() {
    var hasHeader = !!+HShell.content.configXMLObject.config.mainSettings.postAssessment.header,
        class_header = hasHeader ? 'hasHeader' : '';

    HShell.core.$emit('PostAssessment_Started');
    goToCommon('post_a', false, false);
    //$('#hPageHLanguageButton').hide();

    HShell.content.postAssessObj.completion_status = 'incomplete';
    HShell.autoSetup.SCORM.SCORMsaveChangedAssessmentObjectives();

    $('#homePageHeaderContainer').addClass('postAssessment');
    $('#hPageHHomeButton').show().removeClass('directGoToHome');
    $('#postAssessmentLaunchButtonContainer, #postAssessmentLaunchButton').hide();
    //$('#SCORM_Container').css('overflow-y','scroll')
    buildGenericContainer(SL.UI.course_title, '', class_header, SL.UI.description);
    $('#eLearningGenericContainer').addClass('postAssessment');
    $('#eLearningGenericContainer').addClass('fancyPostAssessment__started');

    if (HShell.contentSetup.fancyAssessment) {
        var class_hasNoHeader = +HShell.content.configXMLObject.config.mainSettings.postAssessment.header ? '' : 'fancyPostAssessment--noHeader';

        $('#eLearningGenericContainer')
            .addClass('fancyPostAssessment')
            .addClass(class_hasNoHeader);
    }

    buildPostAssessment();

    clearPostAssessObj();
    HShell.content.postAssessObj = HShell.xml.genereteOneAssessmentFromXml('HShell.content.postAssessObj',
        HShell.autoSetup.postAssessFinishedModules.concat(HShell.content.preAssessObj.finishedModules),
        HShell.content.selected_roleObj.modules_listArray,
        false);

    if (typeof HShell.content.surveyObj != 'undefined') {
        HShell.xml.getSurveyDataFormXML(); // --- The function is located in "3_5 XMLController.js"
    }

    if (HShell.content.postAssessObj.questionsNum === 0) {
        $('#postAssessementContainer').remove();
        gotoEvalPostPage(false);
        HShell.qaMode.assessmentEnd && HShell.qaMode.assessmentEnd();
    } else {
        HShell.content.postAssessObj.activeQuestion = $('.questionContainer').first().hide().show().addClass('active');
        HShell.content.postAssessObj.type = 'post_assessment';

        $('.postHProgressQuestionsNum').text(HShell.content.postAssessObj.questionsNum);
        enableAssessmentFuncs('HShell.content.postAssessObj');
    }

    $('#mainContentContainer').hide().attr('aria-hidden', true);
    HShell.utils.scrollTopMainContainer();
    HShell.qaMode.assessmentStart && HShell.qaMode.assessmentStart();

    // --- (Accessibility)
    var questionProgressObj = $('.assessmentProgressContainer').text().split('/');
    var tempStr = 'Question ' + questionProgressObj[0] + ' ' + SL.UI.of + ' ' + questionProgressObj[1];
    tempStr += '&nbsp; <br>' + $('.questionContainer').first().find('.questionTitle').first().text();
    HShell.a11y.speak(tempStr, true);

    $('#assessmentTypeIndicator').attr('tabindex', '0').focus().blur(function () {
        $(this).attr('tabindex', '-1');
    });
}

// ________________________________________________________

function goToPostAssessWellDone() {
    goToCommon('final_survey', false, false);
    $("#eLContentContainer").empty();

    if (HShell.content.preAssessObj.completion_status == "completed") {

        var welDoneText = SL.UI.postAssessmentWellDoneTextPreAllCorrect;
        var welDoneTextDataItem = 'welDoneTextPreAllCorrect';
    } else {
        var welDoneText = SL.UI.postAssessmentWellDoneText;
        var welDoneTextDataItem = 'welDoneText';
    }

    var html = '';
    html += '<div class="pAllOkFinPageContaienr" id="postAssessmentWellDoneContainer">';
    html += '<h2 id="pAllOkFinTitleContainer" class="elSubTitleContainer hulk langItem" data-languageItem="wellDone">' + SL.UI.postAssessmentWellDone + '</h2>';
    html += '<div id="pAllOkFinContent" class="rel langItem" data-languageItem="' + welDoneTextDataItem + '">' + welDoneText + '</div>';
    html += '<div id="pAllOkFinButtonsContainer" class="buttonsContainer"  aria-live="off">';
    html += HShell.core.getComponent('Button').init({ id: 'continueToFinalSurveyBtn', text: SL.UI.label_continue, classes: 'btnWrapper' });

    html += '</div>';
    html += '</div>';

    $('#eLContentContainer').prepend(html);
    HShell.core.renderComponents($('#eLContentContainer'));
    $('#SCORM_Container').scrollTop(0);
    reskinAllContent($('#eLContentContainer'));

    HShell.a11y.speak(SL.UI.wellDone + ' ' + welDoneText);
    // |rework| the timeout is for testing on IE9 and IE10, ieRefresh is taking the focus, so we should focus the button after that.
    //Maybe we can make a function to check if its IE9 or 10 and trigger it with timeout if true. But the best is to get rid of ieContainerRefresh function
    //setTimeout(function () {
    // $('#continueToFinalSurveyBtn').focus();

    /* When "Continue" button is clicked. */
    $('#continueToFinalSurveyBtn').uniClick(function () {
        $("#postAssessmentWellDoneContainer").remove();
        goToFinalSurvey();
    });
}

// function goToFinalSurvey() {
//     goToCommon('final_survey', false, false);
//     //$('#hPageHLanguageButton').hide();

//     HShell.content.finalSurveyObj.completion_status = 'incomplete';
//     HShell.autoSetup.SCORM.SCORMsaveChangedAssessmentObjectives();

//     $('#homePageHeaderContainer').addClass('postAssessment');
//     $('#hPageHHomeButton').show().removeClass('directGoToHome');
//     $('#postAssessmentLaunchButtonContainer, #postAssessmentLaunchButton').hide();
//     //$('#SCORM_Container').css('overflow-y','scroll')
//     buildGenericContainer(SL.UI.course_title, '', '', SL.UI.description);
//     $('#eLearningGenericContainer').addClass('postAssessment');

//     if (HShell.contentSetup.fancyAssessment) {
//         var class_hasNoHeader = +HShell.content.configXMLObject.config.mainSettings.postAssessment.header ? '' : 'fancyPostAssessment--noHeader';

//         $('#eLearningGenericContainer')
//             .addClass('fancyPostAssessment')
//             .addClass(class_hasNoHeader);
//     }

//     buildFinalSurvey();

//     clearFinalSurveryObj();
//     HShell.content.finalSurveyObj = HShell.xml.genereteOneAssessmentFromXml('HShell.content.finalSurveyObj',
//         HShell.autoSetup.finalSurveyFinishedModules.concat(HShell.content.finalSurveyObj.finishedModules),
//         HShell.content.selected_roleObj.modules_listArray,
//         false);

//     if (typeof HShell.content.surveyObj != 'undefined') {
//         HShell.xml.getSurveyDataFormXML(); // --- The function is located in "3_5 XMLController.js"
//     }

//     if (HShell.content.finalSurveyObj.questionsNum === 0) {
//         $('#postAssessementContainer').remove();
//         gotoEvalPostPage(false);
//         HShell.qaMode.assessmentEnd && HShell.qaMode.assessmentEnd();
//     } else {
//         HShell.content.finalSurveyObj.activeQuestion = $('.questionContainer').first().hide().show().addClass('active');
//         HShell.content.finalSurveyObj.type = 'post_assessment';

//         $('.postHProgressQuestionsNum').text(HShell.content.finalSurveyObj.questionsNum);
//         enableAssessmentFuncs('HShell.content.finalSurveyObj');
//     }

//     $('#mainContentContainer').hide().attr('aria-hidden', true);
//     HShell.utils.scrollTopMainContainer();
//     HShell.qaMode.assessmentStart && HShell.qaMode.assessmentStart();

//     // --- (Accessibility)
//     var questionProgressObj = $('.assessmentProgressContainer').text().split('/');
//     var tempStr = 'Question ' + questionProgressObj[0] + ' ' + SL.UI.of + ' ' + questionProgressObj[1];
//     tempStr += '&nbsp; <br>' + $('.questionContainer').first().find('.questionTitle').first().text();
//     HShell.a11y.speak(tempStr, true);

//     $('#assessmentTypeIndicator').attr('tabindex', '0').focus().blur(function () {
//         $(this).attr('tabindex', '-1');
//     });
// }

function goToFinalSurvey() {
    goToCommon('final_survey', false, false);
    $('#hPageHHomeButton').hide();
    $('#mainContentContainer').hide();

    if ($('#eLearningGenericContainer').length === 0) {
        buildGenericContainer(SL.UI.course_title, '');
    }
    $('#eLearningGenericContainer').addClass('finalSurvey');
    //HShell.savedData.completion_status = "completed";

    buildFinalSurvey();

    HShell.xml.getFinalSurveyXml(continueWithFinalSurvey);

    $('#assessmentTypeIndicator').text(SL.UI.finalSurveyTitle);

    function continueWithFinalSurvey() {
        HShell.xml.genereteOneAssessmentFromXml('HShell.content.finalSurveyObj', 'null', 'null', false);
        enableAssessmentFuncs('HShell.content.finalSurveyObj');
    }

    $('.questionContainer').first().show();

    HShell.a11y.speak($('.questionContainer').find('.questionTitle').first().text());

    $('#assessmentTypeIndicator').attr('tabindex', '0').focus().blur(function () {
        $(this).attr('tabindex', '-1');
    });

    $('#SCORM_Container, body').scrollTop(0);

    // QAAssessmentEnd();
}

// ________________________________________________________


function gotoSurvey() {
    if (!HShell.content.surveyObj.finished) { // --- Delivery hotFix, no time for better fix |rework|. the goToSurvey must not even be called, but go directly to the last screen. Also the last screen must be split into 3 screens, because now, the postEval page is the same as the 'Thank you' and the last screens.... as always no time for that as well
        $('#hPageHHomeButton').hide();
        $('#mainContentContainer').hide();

        if ($('#eLearningGenericContainer').length === 0) {
            buildGenericContainer(SL.UI.course_title, '', '', SL.UI.description);
        }

        $('#eLearningGenericContainer').removeClass('postAssessment fancyPostAssessment');

        if (HShell.contentSetup.fancyAssessment) {
            var class_hasNoHeader = +HShell.content.configXMLObject.config.mainSettings.postAssessment.header ? '' : 'fancyPostAssessment--noHeader';

            $('#eLearningGenericContainer')
                .addClass('fancySurvey')
                .addClass(class_hasNoHeader);
        } else {
            $('#eLearningGenericContainer').addClass('survey');
        }

        buildSurvey();

        $('#assessmentTypeIndicator').text(SL.UI.surveyTitle);

        $.each(HShell.content.surveyObj.quizArray, function (i, val) {
            var randQuHtml = selectQuestionsFromXMLToShow($(this), HShell.content.surveyObj); // Function is inside "5.assessmentsHandler.js"

            if (randQuHtml === 0) {
                HShell.utils.trace('There is no questions for the selected role, in ate least one category!', 'genereteOneAssessmentFromXml');
            } else {
                $('#questionsContainer').append(randQuHtml);
                HShell.core.renderComponents($('#questionsContainer'));
            }
        });

        enableQuestionsTypeSpesificFunctions('HShell.content.surveyObj');
        reskinAllContent($('.assessmentHeaderContainer, .assessmentQuestionsContainer, #buttonsContainer'));
        $('#submitQuizReskin').addClass('inactive');

        enableAssessmentFuncs('HShell.content.surveyObj');
        $('.questionContainer').first().show();

        setTimeout(function () { // |rework| This is soooo wrong, but i do not have any power to fix it
            changeLastLocation('survey');
        }, 200);

        //setTimeout(function () {
        HShell.a11y.speak($('.questionContainer').find('.questionTitle').first().text(), true);
        //}, 1000); // |rework| not working without timeout, might be related with other timeout.

        $('#assessmentTypeIndicator').attr('tabindex', '0').focus().blur(function () {
            $(this).attr('tabindex', '-1');
        });

        $('#SCORM_Container, body').scrollTop(0);

        HShell.qaMode.assessmentEnd && HShell.qaMode.assessmentEnd();
    } else {
        gotoEvalPostPage(true);
    }
}

// ________________________________________________________

function closePostAssessment() {
    if (HShell.savedData.last_location == 'post_a' || HShell.savedData.last_location == 'post_evalPage') {
        var footerBtns = '<div class="buttonsContainer">' +
            HShell.core.getComponent('Button').init({ id: 'videoContinueReskin', text: SL.UI.label_No }) +
            HShell.core.getComponent('Button').init({ id: 'videoCloseReskin', text: SL.UI.label_Yes }) +
            '</div>';

        var popUpFuncs = function () {
            $('.popBContentContainer').css({
                padding: '30px 0px 30px 0px'
            });
            setTimeout(function () {
                $('#videoCloseReskin').uniClick(function () {
                    removePostAssessmentScreen();
                    clearPostAssessObj();
                    $('.Component_PopUp').remove();
                    $('#mainContentContainer').show();
                    oneModuleQuizButtonClicker($('.oneModuleQuizButtonContainer.active'), 0); // --- Hides all oppened reflections points

                    if (!HShell.a11y.autoSetup.postAssessmentButtonPositionExplained) {
                        HShell.a11y.speak(SL.UI.courseComplete_ButtonPosition);
                        HShell.a11y.autoSetup.postAssessmentButtonPositionExplained = true;
                    }
                    HShell.qaMode.assessmentEnd && HShell.qaMode.assessmentEnd();
                });
                $('#videoContinueReskin').uniClick(function () {
                    $('.Component_PopUp').remove();
                });
            }, 400);
        };
        $('#SCORM_Container').appendPopUp({
            title: SL.UI.confirmation,
            content: SL.UI.postExitText,
            footer: footerBtns,
            func: popUpFuncs
        });
    }

    if (HShell.savedData.last_location == 'post_evalPage') {
        clearPostAssessObj();
    }
}

// ________________________________________________________

function removePostAssessmentScreen() {
    $('#homePageHeaderContainer').removeClass('postAssessment');
    HShell.utils.scrollTopMainContainer();
    $('#eLearningGenericContainer').remove();
    $('#hPageHHomeButton').hide();
    $('#postAssessmentLaunchButtonContainer, #postAssessmentLaunchButton').show();
    changeLastLocation('mod_select');
    HShell.a11y.speak(SL.UI.homePage);
}

// ________________________________________________________________________________________________________________________________

function markModulesForReview() {
    $('.oneModuleItemContainer').find('.reviewText').hide();
    $(HShell.autoSetup.postAssessWrongModules).each(function (i, currentModule) {
        $('.oneModuleItemContainer[moduleid="' + currentModule + '"]').find('.reviewText').show();
    });
}

isFinalSurvey = false;
function gotoEvalPostPage(newScreen) {
    if (newScreen) {
        buildGenericContainer(SL.UI.course_title, '', '', SL.UI.description);
        $('#mainContentContainer').hide();
    }
    if (isFinalSurvey == true) {
        localStorage.setItem('isFinalSurvey', true);
    } else {
        localStorage.setItem('isFinalSurvey', false);
    }

    $('#homePageHeaderContainer').css('display', '');

    goToCommon('post_evalPage', false, false);

    clearInterval(HShell.content.postAssessObj.timeSpendInterval); // --- Stops the tiner that tracks how much time the user spend on the post-assessment

    //Screen readers can be a pain in the butt some times. We use the delay so that the screen reader can override whotever it was reading on the previouse screen
    setTimeout(function () {
        $('.pEvalButtonsContainer #pEvalRetry').focus();
    }, 10);
    $('#eLearningGenericContainer').scrollTop(0).addClass('evalPage');
    $('#eLearningGenericContainer').removeClass('fancyPostAssessment__started');
    HShell.autoSetup.postAssessWrongModules = clearDublicatedItemFromArray(HShell.autoSetup.postAssessWrongModules);
    // --- If all is answerd correctly

    var procentagePassed = Math.round((HShell.autoSetup.postAssessFinishedModules.length / (HShell.autoSetup.postAssessWrongModules.length + HShell.autoSetup.postAssessFinishedModules.length)) * 100);
    var thresholdBasedPassed = HShell.contentSetup.post_type == 0 && HShell.core.checkThresholdPercentagePassed(procentagePassed);
    if (HShell.autoSetup.postAssessWrongModules.length === 0 || thresholdBasedPassed) {
        if (HShell.contentSetup.post_type == 1) { // ---  completion based
            if (HShell.contentSetup.isExtranetCourse) {
                extranet_reportCompletion();
            } else {
                HShell.content.postAssessObj.completion_status = 'completed';
                HShell.autoSetup.SCORM.SCORMsaveChangedAssessmentObjectives();
            }
            // buildOnePostAllFinPage();
            // $('#hPageHHomeButton').hide();
            // $('#postAssessmentLaunchButton').addClass('finished').unbind('click').removeAttr('tabindex').removeAttr('role');
            // $('#postAssessmentLaunchButtonText').text(SL.UI.postAssessmentDone).attr('data-languageItem', 'postAssessmentDone');

            // /* GO TO FINAL SURVEY. */
            // $('#pAllOkFinConfirmBtnReskin').uniClick(function () {
            //     $('#hPageHHomeButton').addClass('directGoToHome').show();
            //     $('#pAllOkFinTitleContainer').text(SL.UI.preAThankYou);
            //     $('#pAllOkFinContent').html(SL.UI.finText).attr('data-languageItem', 'finText').addClass('finText');
            //     $('#pAThankYouProgress').hide();
            //     $('#SCORM_Container, body').scrollTop(0);

            //     $(this).hide();
            //     if (HShell.contentSetup.isExtranetCourse) {
            //         $('#pAllOkFinExitBtnReskin').css('display', 'inline-flex').addClass('visible');
            //         HShell.storage.setCourseAsCompleated();
            //     } else {
            //         $('#pAllOkFinHomeBtnReskin, #pAllOkFinExitBtnReskin').css('display', 'inline-flex').addClass('visible');
            //         HShell.storage.setCourseAsCompleated();
            //     }

            //     HShell.a11y.speak(SL.UI.preAThankYou + ' ' + SL.UI.finText);
            //     $('#pAllOkFinExitBtnReskin').focus();
            // });

            // $('#pAllOkFinHomeBtnReskin').uniClick(function () {
            //     HShell.utils.scrollTopMainContainer();
            //     HShell.a11y.autoSetup.postAssessmentButtonPositionExplained = true;
            //     removePostAssessmentScreen();
            //     $('#mainContentContainer').show().attr('aria-hidden', false);
            // });
            // $('#pAllOkFinExitBtnReskin').uniClick(function () {
            //     if (HShell.contentSetup.isExtranetCourse) {
            //         if (HShell.contentSetup.extranetRedirectToCertificatePage) {
            //             extranet_redirectToPage();
            //         }
            //         else {
            //             if (HShell.autoSetup.runOn.browserName == 'IE') {
            //                 window.close();
            //             } else {
            //                 $('body').text('You have completed your training. Please close your browser tab to finish this session.');
            //             }
            //         }
            //     } else {
            //         exitCourse();
            //     }
            // });

            if (HShell.contentSetup.have_final_survey) {
                goToPostAssessWellDone();

                $('#pAllOkFinHomeBtnReskin').click(function () {
                    localStorage.setItem('isFinalSurvey', false);
                    removePostAssessmentScreen();
                    clearPostAssessObj();
                    HShell.storage.setCourseAsCompleated();
                    $('#postAssessmentLaunchButton').addClass('finished').unbind('click').removeAttr('tabindex').removeAttr('role');
                    $('#postAssessmentLaunchButtonText').text(SL.UI.postAssessmentDone).attr('data-languageitem', 'postAssessmentDone');
                    $('#mainContentContainer').show();
                });
            } else {
                if (isFinalSurvey == false) {
                    buildOnePostAllFinPage();
                }
                $('#hPageHHomeButton').hide();
                $('#postAssessmentLaunchButton').addClass('finished').unbind('click').removeAttr('tabindex').removeAttr('role');
                $('#postAssessmentLaunchButtonText').text(SL.UI.postAssessmentDone).attr('data-languageItem', 'postAssessmentDone');

                $('#pAllOkFinConfirmBtnReskin').uniClick(function () {
                    $('#hPageHHomeButton').addClass('directGoToHome').show();
                    $('#pAllOkFinTitleContainer').text(SL.UI.preAThankYou);
                    $('#pAllOkFinContent').html(SL.UI.finText).attr('data-languageItem', 'finText');
                    $('#SCORM_Container, body').scrollTop(0);

                    $(this).hide();
                    if (HShell.contentSetup.isExtranetCourse) {
                        $('#pAllOkFinExitBtnReskin').css('display', 'inline-flex').addClass('visible');
                        HShell.storage.setCourseAsCompleated();
                    }
                    else {
                        $('#pAllOkFinHomeBtnReskin, #pAllOkFinExitBtnReskin').css('display', 'inline-flex').addClass('visible');
                        HShell.storage.setCourseAsCompleated();
                    }

                    HShell.a11y.speak(SL.UI.preAThankYou + ' ' + SL.UI.finText);

                    HShell.storage.commitData('immediate');
                    // $('#pAllOkFinExitBtnReskin').focus();
                });

                $('#pAllOkFinHomeBtnReskin').click(function () {
                    localStorage.setItem('isFinalSurvey', false);
                    removePostAssessmentScreen();
                    clearPostAssessObj();
                    HShell.storage.setCourseAsCompleated();
                    $('#postAssessmentLaunchButton').addClass('finished').unbind('click').removeAttr('tabindex').removeAttr('role');
                    $('#postAssessmentLaunchButtonText').text(SL.UI.postAssessmentDone).attr('data-languageitem', 'postAssessmentDone');
                    $('#mainContentContainer').show();
                });
                $('#pAllOkFinExitBtnReskin').uniClick(function () {
                    localStorage.setItem('isFinalSurvey', false);
                    if (HShell.contentSetup.isExtranetCourse) {
                        if (HShell.contentSetup.extranetRedirectToCertificatePage) {
                            extranet_redirectToPage();
                        }
                        else {
                            if (HShell.autoSetup.runOn.browserName == 'IE') {
                                window.close();
                            } else {
                                $('body').text('You have completed your training. You may close this window to finish this session.');
                            }
                        }
                    } else {
                        $('body').text('You have completed your training. You may close this window to finish this session.');
                        var scormVersion = pipwerks && pipwerks.SCORM ? pipwerks.SCORM.version || '2004' : '2004';
                        if(scormVersion == '2004') {
                            SCORM.SCORMSetOneItem('cmi.success_status', "passed");
                        } else {
                            SCORM.SCORMSetOneItem('cmi.core.lesson_status', "passed");
                        }
                        exitCourse();
                    }
                });
                // // TEST - trying to fix error popup in SAP
                // buildSavingScreen();
                // HShell.storage.saveCourseEndData();
                // console.log('initiating setTimeout 4');
                // setTimeout(function () {
                //     removeSavingScreen();
                //     console.log('closing setTimeout 4');
                // }, 3000);
            }

            window.clientSpecificExitButton();

        } else if (HShell.contentSetup.post_type === 0) {							// --- threshold based
            buildOnePostEvalBShellPage(procentagePassed);

            // $('#pEvalBshellConfirm').click(function () {
            //     removePostAssessmentScreen();
            //     clearPostAssessObj();
            //     HShell.storage.setCourseAsCompleated();
            //     $('#postAssessmentLaunchButton').addClass('finished').unbind('click').removeAttr('tabindex').removeAttr('role');
            //     $('#postAssessmentLaunchButtonText').text(SL.UI.goToConfirmation).attr('data-languageitem', 'goToConfirmation');
            //     $('#goToConfirmationDescription').addClass('shown');
            //     $('#mainContentContainer').show();
            // });
            $('#pEvalBshellConfirm').uniClick(function () {
                $('#hPageHHomeButton').addClass('directGoToHome').show();
                $('.pEvalBshellTitle').text(SL.UI.preAThankYou);
                $('.pEvalBshellContentContainer').html(SL.UI.finText).attr('data-languageItem', 'finText');
                $('#SCORM_Container, body').scrollTop(0);
    
                $(this).hide();
                $('#pAllOkFinHomeBtnReskin, #pAllOkFinExitBtnReskin').css('display', 'inline-flex').addClass('visible');
                HShell.storage.setCourseAsCompleated();
    
                HShell.a11y.speak(SL.UI.preAThankYou + ' ' + SL.UI.finText);
                HShell.storage.commitData('immediate');
                // $('#pAllOkFinExitBtnReskin').focus();
            });

            $('#pAllOkFinExitBtnReskin').uniClick(function () {
                localStorage.setItem('isFinalSurvey', false);
                if (HShell.contentSetup.isExtranetCourse) {
                    if (HShell.contentSetup.extranetRedirectToCertificatePage) {
                        extranet_redirectToPage();
                    }
                    else {
                        if (HShell.autoSetup.runOn.browserName == 'IE') {
                            window.close();
                        } else {
                            $('body').text('You have completed your training. You may close this window to finish this session.');
                        }
                    }
                } else {
                    $('body').text('You have completed your training. You may close this window to finish this session.');
                    var scormVersion = pipwerks && pipwerks.SCORM ? pipwerks.SCORM.version || '2004' : '2004';
                    if(scormVersion == '2004') {
                        SCORM.SCORMSetOneItem('cmi.success_status', "passed");
                    } else {
                        SCORM.SCORMSetOneItem('cmi.core.lesson_status', "passed");
                    }
                    exitCourse();
                }
            });
        }
    } else {
        HShell.autoSetup.postAssessFinishedModules = clearDublicatedItemFromArray(HShell.autoSetup.postAssessFinishedModules);
        HShell.autoSetup.postAssessWrongModules = clearDublicatedItemFromArray(HShell.autoSetup.postAssessWrongModules);

        if (HShell.contentSetup.post_type == 1) { // ---  completion based
            if (isFinalSurvey == false) {
                buildOnePostEvalPage();
            }

            // $('.uiButton').first().focus();

            $('#pEvalReviewReskin').uniClick(function () {
                removePostAssessmentScreen();
                clearPostAssessObj();
                $('#mainContentContainer').show().attr('aria-hidden', false);
                markModulesForReview(); //
                // --- On SABA with document mode 7, there is some problem with the rendering of the css (the css have atributes selectors in it).
                //     by blinking the element this force to recalculate all css inside. Without this, the language button will not show again
                setTimeout(function () {
                    $('#homePageHeaderButtonsContainer').css('visibility', 'hidden').css('visibility', 'visible');
                    //$('#hPageHLanguageButton').show();
                }, 100);
            });

            $('#pEvalRetryReskin').uniClick(function () {
                removePostAssessmentScreen();
                clearPostAssessObj();
                goToPostAssessment();
                HShell.content.postAssessObj.activeQuestion = $('.questionContainer').first().hide().show();
            });
        }

        $('#pAllOkFinConfirmBtnReskin').uniClick(function () {
            $('#hPageHHomeButton').addClass('directGoToHome').show();
            $('#pAllOkFinTitleContainer').text(SL.UI.preAThankYou);
            $('#pAllOkFinContent').html(SL.UI.finText).attr('data-languageItem', 'finText');
            $('#SCORM_Container, body').scrollTop(0);

            $(this).hide();
            $('#pAllOkFinHomeBtnReskin, #pAllOkFinExitBtnReskin').css('display', 'inline-flex').addClass('visible');
            HShell.storage.setCourseAsCompleated();

            HShell.a11y.speak(SL.UI.preAThankYou + ' ' + SL.UI.finText);
            HShell.storage.commitData('immediate');
            // $('#pAllOkFinExitBtnReskin').focus();
        });

        $('#pAllOkFinHomeBtnReskin').uniClick(function () {
            localStorage.setItem('isFinalSurvey', false);
            HShell.utils.scrollTopMainContainer();
            accessibility.autoSetup.postAssessmentButtonPositionExplained = true;
            removePostAssessmentScreen();
            $('#mainContentContainer').show().attr('aria-hidden', false);
        });
        $('#pAllOkFinExitBtnReskin').uniClick(function () {
            localStorage.setItem('isFinalSurvey', false);
            if (HShell.contentSetup.isExtranetCourse) {
                if (HShell.contentSetup.extranetRedirectToCertificatePage) {
                    extranet_redirectToPage();
                }
                else {
                    if (HShell.autoSetup.runOn.browserName == 'IE') {
                        window.close();
                    } else {
                        $('body').text('You have completed your training. You may close this window to finish this session.');
                    }
                }
            } else {
                $('body').text('You have completed your training. You may close this window to finish this session.');
                var scormVersion = pipwerks && pipwerks.SCORM ? pipwerks.SCORM.version || '2004' : '2004';
                if(scormVersion == '2004') {
                    SCORM.SCORMSetOneItem('cmi.success_status', "passed");
                } else {
                    SCORM.SCORMSetOneItem('cmi.core.lesson_status', "passed");
                }
                exitCourse();
            }
        });

        if (HShell.contentSetup.post_type === 0) { // --- threshold based
            HShell.autoSetup.postAssessWrongModules = []; // --- Since we have to restart the quiz every time, we are restarting the 2 arrays as well
            HShell.autoSetup.postAssessFinishedModules = [];
            buildOnePostEvalBShellPage(procentagePassed);

            $('#pEvalBshellReview').click(function () {
                removePostAssessmentScreen();
                clearPostAssessObj();
                $('#mainContentContainer').show();
            });

            $('#pEvalBshellRetry').click(function () {
                removePostAssessmentScreen();
                clearPostAssessObj();
                goToPostAssessment();
                HShell.content.postAssessObj.activeQuestion = $('.questionContainer').first().hide().show();
            });
        }

        // // TEST - trying to fix error popup in SAP
        // if (HShell.contentSetup.have_final_survey) {
        //     buildSavingScreen();
        //     HShell.storage.saveCourseEndData();
        //     console.log('initiating setTimeout 3');
        //     setTimeout(function () {
        //         removeSavingScreen();
        //         console.log('closing setTimeout 3');
        //     }, 3500);
        // }
    }

    $('#SCORM_Container, body').scrollTop(0);

    HShell.storage.commitData('immediate');

    HShell.qaMode.assessmentEnd && HShell.qaMode.assessmentEnd();
}

// ________________________________________________________________________________________________________________________________

function gotoModuleSelection(isAfterDataRestore) {
    $('#SCORM_Container').empty();
    goToCommon('mod_select', buildModuleSelection, '#homePageContainer');
    if (HShell.contentSetup.skipModulesPage && HShell.savedData.completion_status != 'completed') {
        $('.oneModuleInnerContaienr').first().get(0).click()
    }
    if (HShell.contentSetup.have_post_a && HShell.savedData.completion_status != 'completed') {
        HShell.xml.getPostXml(function () { HShell.checkForPostAssessment(isAfterDataRestore); }); // --- Properes it for the post_assessment
    } else {
        restoreProgressFromArray();
    }

    // The timeout is here because for some unknown reason the screen reader doesn't read the text otherwise.
    // Works with 100 too, but i put 1000 for the reading order.
    setTimeout(function () {
        HShell.a11y.speak(SL.UI.homePage + '. ' + $('#homeInfoDescription').text());
    }, 1000);

    // $('#homePageContainer .oneModuleItemContainer').first().find('.oneModuleInnerContaienr .oneModuleDescriptionContainer').focus();

    if (HShell.autoSetup.runOn.OS === 'iOS') {
        $('#forced_speech_container').attr('aria-hidden', true);
    }

    window.clientSpecificHomePageFunctions();

    HShell.storage.commitData('immediate');
    HShell.core.$emit('onModuleStatusChanged');
    //HShell.checkForPostAssessment(); |unused| had been commented before I added |unused|. Remove if no problems
}

/// <reference path="_references.js" />

var HShell = window.HShell || {};
var finalSurveyCont = 0;
function enableAssessmentFuncs(quizObj) {
    getQuizObj(quizObj).activeQuestionNum = $('#eLContentContainer .questionContainer').first().attr('qGroupId');
    getQuizObj(quizObj).activeQuestion = $('#eLContentContainer .questionContainer').first().hide().show();
    getQuizObj(quizObj).activeQuestionData = HShell.fillAssessmentAnswerStartData(getQuizObj(quizObj));

    enableRadioChBoxQuestions();
    enableVideoQuestions();
    enableInfoPopUpButtons($('#eLearningGenericContainer'));
    enableSubmitButton();
    enableImagePointsOfInterest();
    buildVideos();

    $('.fancyAssessmentTemplateContainer .closeBtnContainer').unbind('click').uniClick(function () {
        questionContainer = getQuizObj(quizObj).activeQuestion;
        hideFancyAssessmentFeedback(questionContainer);
        showReadFeedbackAgainBtn(questionContainer);
    });

    $('.fancyAssessmentTemplateContainer .readFeedbackAgain').unbind('click').uniClick(function () {
        questionContainer = getQuizObj(quizObj).activeQuestion;
        showFancyAssessmentFeedback(questionContainer);
    });

    if (getQuizObj(quizObj).type == 'pre-assessment') {
        enableQuestionTypeSpesificFunctions(getQuizObj(quizObj), 'paused');
    } else {
        enableQuestionTypeSpesificFunctions(getQuizObj(quizObj), 'play');
    }

    // --- Single/Multiple choice questions
    function enableRadioChBoxQuestions() {
        var scope = $('.questionContainer[type="radio"], .questionContainer[type="checkbox"], .questionContainer[type="video"]');
        scope.find('.oneAnswer input').unbind('click').uniClick(function () {
            if ($(this).attr('type') == 'radio') { $('.oneAnswer').removeClass('active'); }
            $(this).getParent('.questionsContainer').find('.oneAnswer').removeClass('focus');
            $(this).getParent('.oneAnswer').toggleClass('active').addClass('focus');
            checkForNextBtn();

            makeCurrentQuestionPassedOnProgressBar();
        });

        scope.find('.radioReskin').uniClick(function () {
            $(this).getParent('label').find('input').click(); checkForNextBtn();
        });
        checkForNextBtn();

        scope.find('.preAnswerOneITemTitle').each(function () {
            $(this).on('focus', function () { $(this).getParent('.oneAnswer').addClass('focus'); });
            $(this).on('blur', function () { $(this).getParent('.oneAnswer').removeClass('focus'); });
        });

        if (HShell.contentSetup.fancyAssessment) {
            scope.find('.oneAnswer').attr('tabindex', 0)
                .on('focus', function () {
                    $(this).addClass('focus');
                })
                .on('blur', function () {
                    $(this).removeClass('focus');
                });

            scope.find('.oneAnswer').unbind('click').uniClick(function () {
                if ($(this).closest('.questionContainer').attr('passed') !== 'true') {
                    if ($(this).find('input').attr('type') == 'radio') {
                        $('.oneAnswer')
                            .removeClass('active')
                            .find('input').prop('checked', false);
                        $('.oneAnswer').each(function(i, currentEl){
                            var currentAriaLabel = $(currentEl).attr('aria-label');
                            $(currentEl).attr('aria-label', currentAriaLabel.replace('Checked', 'Not checked'));
                        });
                    }
                    $('.oneAnswer').removeClass('focus');

                    $(this).toggleClass('active').addClass('focus');
                    if ($(this).hasClass('active')) {
                        $(this).find('input').prop('checked', true);
                        var currentAriaLabel = $(this).attr('aria-label');
                        $(this).attr('aria-label', currentAriaLabel.replace('Not checked', 'Checked'));
                    } else {
                        $(this).find('input').prop('checked', false);
                        var currentAriaLabel = $(this).attr('aria-label');
                        $(this).attr('aria-label', currentAriaLabel.replace('Checked', 'Not checked'));
                    }

                    checkForNextBtn();

                    makeCurrentQuestionPassedOnProgressBar();
                }
            });
        }

        function checkForNextBtn() {
            var passed = false;
            getQuizObj(quizObj).activeQuestion.find('.oneAnswer').each(function () { if ($(this).find('input').is(':checked')) passed = true; });
            assessEnableNextBtn(passed);
        }
    }

    // --- Video questions (includes inside Single/Multiple choice questions)
    function enableVideoQuestions() {
        $('.questionContainer[type="video"]').each(function () {
            //enablePlayControlles($(this).find('.vidPopFooterContainer'), );
        });
    }

    function enableSubmitButton() {
        $('#submitQuizReskin').unbind('click').uniClick(function () {
            $('#questionsContainer .vidPopVideoContainer video').each(function (index, item) {
                if (item && typeof item.pause == 'function') {
                    item.pause();
                }
            });
            evaluateOneQuestion(quizObj);
        });
    }

    function enableImagePointsOfInterest() {
        var $currentTemplate = $('.questionContainer');
        $currentTemplate.find('.imageContainer .item').uniClick((ev) => {
            var itemId = $(ev.currentTarget).data('itemid');
            var $currentTemplate = $(ev.currentTarget).closest('.questionContainer');
            _openDescription($currentTemplate, itemId);
        });

        $currentTemplate.find('.itemDescription .closeBtn').uniClick((ev) => {
            _closeDescriptions($currentTemplate);
        });
    }

    function _openDescription($currentTemplate, itemId) {
        var itemColor = $currentTemplate.find('.imageContainer').data('itemcolor');
        $currentTemplate.find('.imageContainer .item[data-itemid="'+itemId+'"]').addClass('visited').find('.icon').attr('style', 'border-color: '+(itemColor || '')+'; background-color: '+(itemColor || '')+';');
        
        $currentTemplate.find('.descriptionsContainer').show();
        $currentTemplate.find('.descriptionsContainer .itemDescription[data-itemid="'+itemId+'"]').addClass('active');
    
        var $activeDescriptionContainer = $currentTemplate.find('.descriptionsContainer .itemDescription.active');
        HShell.utils.lockFocusToContainer($activeDescriptionContainer, $activeDescriptionContainer.find('.closeBtn'));
    
        var title = $currentTemplate.find('.descriptionsContainer .itemDescription[data-itemid="'+itemId+'"]').find('.itemDescriptionTitle').text();
        title = (title + '. ') || '';
        var text = $currentTemplate.find('.descriptionsContainer .itemDescription[data-itemid="'+itemId+'"]').find('.itemDescriptionText').text();
        text = text || '';
        HShell.a11y.speak(title + text);
    }
    function _closeDescriptions($currentTemplate) {
        var activeItemId = $currentTemplate.find('.descriptionsContainer .itemDescription.active').data('itemid');
        var activeItemBtn = $currentTemplate.find('.imageContainer .item[data-itemid="'+activeItemId+'"]');

        $currentTemplate.find('.descriptionsContainer').hide();
        $currentTemplate.find('.descriptionsContainer .itemDescription').removeClass('active');

        setTimeout(function() {
            HShell.utils.unlockFocusFromContainer(null, activeItemBtn);
        }, 1);
    }

    function buildVideos() {
        $('.questionContainer .videoPopUp').each(function (index, item) {
            var $currentTemplate = $(item);
            var videoContainer = $currentTemplate.find('.vidPopVideoContainer .vidPopVideoInnerContainer');
            var subtitlesContainer = $currentTemplate.find('.vidPopVideoContainer .vidPopSubtitlesContainer');
            var controlsContainer = $currentTemplate.find('.vidPopFooterContainer');

            var videoUrl = $currentTemplate.data('videourl');
            var subtitlesUrl = $currentTemplate.data('subtitlesurl');
            window.buildVideoPlayer(videoUrl, subtitlesUrl, '0', undefined, undefined, videoContainer, subtitlesContainer, controlsContainer, false, true, false, true);
            _attachVideoEvents($currentTemplate);
        });
    }

    function _attachVideoEvents($currentTemplate) {
        var playBtnBgImage = '';

        $currentVideoEl = $currentTemplate.find('video');
        $currentVideoEl.on('pause', (ev) =>{
            $currentTemplate.find('.playBtnContainer').show();
        });
        $currentVideoEl.on('play', (ev) =>{
            $playBtnContainer = $currentTemplate.find('.playBtnContainer');
            if (!playBtnBgImage) {
                playBtnBgImage = $playBtnContainer.css('background-image');
            }
            $playBtnContainer.css('background-image', '').hide();
        });
        $currentVideoEl.on('timeupdate', (ev) => {
            var activeVideo = ev.target,
                currentTime = Math.round(activeVideo.currentTime),
                totalTime = Math.round(activeVideo.duration);
            var currentVideoFooterComponentId = $(activeVideo).closest('.vidPopVideoContainer').find('.Component_Video_Footer').data('id');
            var currentVideoFooterComponent = HShell.core.getAllActiveComponents()[currentVideoFooterComponentId];
            if (currentVideoFooterComponent) {
                currentVideoFooterComponent.$emit('moduleVideoSyncronization', {
                    currentTime,
                    totalTime
                }, true);
            }
        });
        $currentVideoEl.on('ended', (ev) => {
            // reset the play btn screen bg img
            $currentVideoEl.get(0).pause();
            if (playBtnBgImage) {
                $currentTemplate.find('.playBtnContainer').css('background-image', playBtnBgImage);
            }
        });
        $currentTemplate.find('.playBtnContainer').uniClick((ev) => {
            $currentVideoEl.get(0).play();
        });
        $currentVideoEl.uniClick((ev) => {
            $currentVideoEl.get(0).pause();
        });
    }
}

function getQuizObj(quizObj) {
    if (typeof quizObj == 'string') {
        return eval(quizObj);
    }
}

// ________________________________________________________

// Adds functions that are related to the specific type of question
function enableQuestionTypeSpesificFunctions(quizObj, param) {
    switch (quizObj.activeQuestionData.type) {
        case 'video':
            quizObj.activeQuestion.find('.vidPopFooterContainer .btnWrapper').addClass('inactive');
            if (param == 'play') {
                setTimeout(function () {
                    quizObj.activeQuestion.find('.vidPopPlayBtn').click();
                }, 300);
            }
            break;
    }
}


// ________________________________________________________

// check if there is anything selected
function assessEnableNextBtn(state) {
    /* When the answer-type is "Checkbox", the "Next" Button is to be activated if at least two checkboxes are checked. */
    if (state) {
        if ($('.questionContainer.active .preAnswerOneITemTitle').is(':checkbox') == true) {
            if ($('.questionContainer.active input:checkbox:checked').length >= 2) { // At least 2 checkbox (Enabling).
                $('#submitQuizReskin').removeClass('inactive').attr('aria-disabled', false);
            } else { // <= 2 (Disabling).
                $('#submitQuizReskin').addClass('inactive').attr('aria-disabled', true);
            }
        } else {
            $('#submitQuizReskin').removeClass('inactive').attr('aria-disabled', false);
        }
    } else {
        $('#submitQuizReskin').addClass('inactive').attr('aria-disabled', true);
    }
}

// ________________________________________________________________________________________________________________________________
// There are 3 mods of loading the quiz: | 1. One random question from group | 2. N question from a group, N is number put on the attribute 'questionsNumbers' on the '<questionGroup>' | 3. Mixed (curenly not implemented)

function selectQuestionsFromXMLToShow(qGroup, quizObj) {
    qGroup = qGroup[0];
    var tempQHtml = '';
    var thisRoleQuestionsArray = [];
    var resultArray = []; // Used so we return only the questions that are actually used, instead of all the elements

    var quizType = '';
    if (quizObj.type == 'survey') {
        quizType = 'survey';
    } else {
        quizType = quizObj.XML.attr('quizType');
    }

    // If quizObj.questionsTries is undefined init it. In this array we store how many times each question has been answered.This is feature used in post assessment only.
    quizObj.questionsTries = quizObj.questionsTries || [];
    var currentQuestionGroupInQuestionTries = quizObj.questionsTries.find(function (el) { return el.id == qGroup.id && el.module == qGroup.module; });

    // if current question group is not pushed to quizObj.questionsTries - push it
    if (!currentQuestionGroupInQuestionTries) {
        quizObj.questionsTries.push({
            id: qGroup.id,
            module: qGroup.module,
            questionArr: []
        });

        currentQuestionGroupInQuestionTries = quizObj.questionsTries[quizObj.questionsTries.length - 1];
    }

    /****************************************************************
     *                                                              *
     *                     Handling Times Tried                     *
     *                                                              *
     ****************************************************************/

    // Get all questions that are meant for selected role

    /*for (var j = 0; j < qGroup.questionArr.length; j++) {
        var qGroupRoles = qGroup.questionArr[j].roles.toLowerCase();
        if ((qGroupRoles.indexOf(String(HShell.content.selected_roleObj.code).toLowerCase()) !== -1 || (qGroupRoles.indexOf(', all') !== -1)) || qGroupRoles === 'all') {
            thisRoleQuestionsArray.push(qGroup.questionArr[j]);

            // find current question in quizObj.questionsTries
            var currentQuestionInQuestionTries = currentQuestionGroupInQuestionTries.questionArr.find(function (el) {
                return el.id == qGroup.questionArr[j].id;
            });
            // push the current question to quizObj.questionsTries if it's not there yet
            if (!currentQuestionInQuestionTries) {
                currentQuestionGroupInQuestionTries.questionArr.push({ id: qGroup.questionArr[j].id, roles: qGroup.questionArr[j].roles });
                currentQuestionInQuestionTries = currentQuestionGroupInQuestionTries.questionArr[currentQuestionGroupInQuestionTries.questionArr.length - 1];
                currentQuestionInQuestionTries.timesTried = 0;
            }
        }
    }

    if (thisRoleQuestionsArray.length === 0) {
        return 0;
    }

    for (var i = 0; i < qGroup.questionsNumbers; i++) { // If the 'questionsNumbers' attribute doesn't exist in the XML, then qGroup.questionsNumbers = 1;
        quizObj.questionsNum++;

        // Get the least times tried from quizObj.questionsTries
        var minTimesTried = Math.min.apply(Math, currentQuestionGroupInQuestionTries.questionArr.map(function (el) { return el.timesTried; }))
        // Get the elements that have as many times tried as minTimesTried
        var minTriesElements = currentQuestionGroupInQuestionTries.questionArr.filter(function (el) { return el.timesTried === minTimesTried; });
        // Get random id from the array with min times tried items (minTriesElements)
        var randQuestionId = Math.round(getRandRange(0, minTriesElements.length - 1));

        // Get the random element (with random index from above) from all questions for this role
        var selectedItem = thisRoleQuestionsArray.find(function (element) { return element.id === minTriesElements[randQuestionId].id; });

        // find the random element in quizObj.questionsTries and increment its times tried by 1
        var selectedItemIndexInQuestionTries = currentQuestionGroupInQuestionTries.questionArr.indexOf(minTriesElements[randQuestionId]);
        currentQuestionGroupInQuestionTries.questionArr[selectedItemIndexInQuestionTries].timesTried++;

        tempQHtml += addOneQuestionFromGroup(quizType, selectedItem, qGroup.id, quizObj.questionsNum, qGroup.module);

        // get the index of the random element so we can splice and add it to the output array
        var currentSelectedIndex = thisRoleQuestionsArray.indexOf(selectedItem);
        resultArray.push(thisRoleQuestionsArray.splice(currentSelectedIndex, 1)[0]); // Remove the added item, so an item not be repeated twice
    }

    qGroup.questionArr = resultArray;

    return tempQHtml;*/

    /****************************************************************
     *                                                              *
     *                       Basic Handling                         *
     *                                                              *
     ****************************************************************/

    // ---- Checks if the this question is meant for the selected role
    for (var j = 0; j < qGroup.questionArr.length; j++) {
        var qGroupRoles = qGroup.questionArr[j].roles.toLowerCase();
        if ((qGroupRoles.indexOf(String(HShell.content.selected_roleObj.code).toLowerCase()) != -1 || (qGroupRoles.indexOf(', all') != -1)) || qGroupRoles == 'all') {
            thisRoleQuestionsArray.push(qGroup.questionArr[j]);
        }
    }
    if (thisRoleQuestionsArray.length === 0) {
        return 0;
    }

    // ----- If the 'questionsNumbers' attribute is not existing then the  qGroup.questionsNumbers is = 1;
    for (var i = 0; i < qGroup.questionsNumbers; i++) {
        quizObj.questionsNum++;
        var randQuestionId = Math.round(getRandRange(0, thisRoleQuestionsArray.length - 1));
        tempQHtml += addOneQuestionFromGroup(quizType, thisRoleQuestionsArray[randQuestionId], qGroup.id, quizObj.questionsNum, qGroup.module, quizObj);
        resultArray.push(thisRoleQuestionsArray.splice(randQuestionId, 1)[0]);                  // --- Removes the added item, so no items are repeated twice
    }

    qGroup.questionArr = resultArray;

    return tempQHtml;
}

// ________________________________________________________________________________________________________________________________

function showReadFeedbackAgainBtn(questionContainer) {
    answerState = questionContainer.attr('correctstate');
    if (questionContainer.hasClass('survey')) {
        answerState = "true";
    }
    questionContainer.closest('.fancyAssessmentTemplateContainer').find('.buttonsContainer .readFeedbackAgain').removeClass('true false').addClass(answerState).show();
}

function hideReadFeedbackAgainBtn(questionContainer) {
    questionContainer.closest('.fancyAssessmentTemplateContainer').find('.buttonsContainer .readFeedbackAgain').removeClass('true false').hide();
}

function hideFancyAssessmentFeedback(questionContainer) {
    questionContainer.closest('.fancyAssessmentTemplateContainer').find('.feedbackIndicatorContainer, .feedbackContainer').hide();
}

function showFancyAssessmentFeedback(questionContainer) {
    questionContainer.closest('.fancyAssessmentTemplateContainer').find('.feedbackIndicatorContainer, .feedbackContainer').show();
    if($('body.userInteractionKeybard').length > 0) {
        questionContainer.closest('.fancyAssessmentTemplateContainer').find('.feedbackContainer .closeBtnContainer').focus();
    }
    setTimeout(function () {
        var correctIncorrect = $('.correctWrongIndicator .infoBtnPopUpTextCorrect:visible, .correctWrongIndicator .infoBtnPopUpTextWrong:visible').text();
        var body = $('.infoBtnPopUpTextContainer').text();
        HShell.a11y.speak(correctIncorrect + '! ' + body + ' Click Next button to move forward.');
    }, 100)
}

function evaluateOneQuestion(quizObj) {
    var questionContainer = getQuizObj(quizObj).activeQuestion;

    if (questionContainer.attr('passed') == 'true') {			// ---The function is called 2 times for the same question, the first time is to show the feedback, the second is to  close it and show the next one
        if (HShell.savedData.last_location == 'pre_a') { if (!handlePreAssessSpesificEval(getQuizObj(quizObj))) return false; }

        //$('#buttonsContainer .buttonText').first().text(SL.UI.label_Submit).attr('data-languageitem', 'label_Submit');	// --- For pre/post assessment
        //questionContainer.parent().parent().parent().find('#buttonsContainer .oneModNextBTN').first().text(SL.UI.label_Submit).attr('data-languageitem', 'label_Submit');		// --- For reflection points |rework| the selector is very unreadable

        $('#submitQuizReskin .buttonText')
            .attr('data-languageitem', SL.UI.label_Submit)
            .text(SL.UI.label_Submit)
            .addClass('inactive');

        hideFancyAssessmentFeedback(questionContainer);
        hideReadFeedbackAgainBtn(questionContainer);

        if (HShell.savedData.last_location == 'pre_a' || HShell.savedData.last_location == 'post_a') { $('#SCORM_Container').scrollTo(0, HShell.consts.automaticScrollTime); }
        if (HShell.savedData.last_location == 'mod_select') {
            handleModAssessSpesificEval(questionContainer);
            questionContainer.parentsUntil('.oneModuleInnerContaienr').last().find('.btnWrapper').first().removeClass('enabled');
        }
        if (HShell.savedData.last_location == 'post_a') {
            handlePostAssessSpesificEval(getQuizObj(quizObj));
        }
        if (HShell.savedData.last_location == 'survey') {
            HShell.content.surveyObj.finished = true;
            getQuizObj(quizObj).activeQuestionData.latency = Math.floor(new Date().getTime() / 1000) - Math.floor(getQuizObj(quizObj).activeQuestionData.timestamp / 1000);
            getQuizObj(quizObj).answersArray[getQuizObj(quizObj).answersArray.length - 1].latency = getQuizObj(quizObj).activeQuestionData.latency;

            $('#surveyContainer').remove();
            gotoEvalPostPage();
        }// --- |rework| the survery must be able to handle more than 1 question
    } else {
        var correctState = true;
        var itemIsSelected = false;

        questionContainer.find('.oneAnswer').each(function (k, answerContainer) {
            var answerCorrectState = false;
            var questionForModule = questionContainer.attr('formodule');
            var questionGroupId = questionContainer.attr('qgroupid');
            var questionId = questionContainer.attr('qid');


            $(getQuizObj(quizObj).quizArray).each(function (i, qGroup) {
                if (qGroup.id == questionGroupId && qGroup.module == questionForModule) {
                    $(qGroup.questionArr).each(function (j, question) {
                        if (question.id == questionId) {
                            var currentAnswerNumber = $(answerContainer).find('input').attr('answernumber');
                            answerCorrectState = question.answerArr[currentAnswerNumber].correct;
                            return false;
                        }
                    });
                    return false;
                }
            });

            // --- 				If you have selected wrong answer 													If you have skipped one answer
            if ((answerCorrectState != 'true' && $(this).find('input').is(':checked')) || (answerCorrectState == 'true' && !$(this).find('input').is(':checked'))) {
                correctState = false;
            }
            //if ($(this).find('input').is(':checked')) { itemIsSelected = true; }

            if ($('.questionContainer.active .preAnswerOneITemTitle').is(':checkbox') == true) {
                if ($('.questionContainer.active input:checkbox:checked').length >= 2) { // At least 2 checkbox (Enabling).
                    itemIsSelected = true;
                }
            } else {
                if ($(this).find('input').is(':checked')) { itemIsSelected = true; }
            }
        });

        if (itemIsSelected) {
            if (HShell.savedData.last_location == 'final_survey') {
                /* This |rework| is a bugfixing in case survey and finalSurvey are enabled both.
                 * We don't know why, in this case, the finalSurvey shows an extra question that doesn't exists.
                 * This code (from line 340 to 421) check if the current final survey's question is the last.
                 * If it's true, it jumps to "Well done". */
                finalSurveyCont = finalSurveyCont + 1;
                if (finalSurveyCont == HShell.content.finalSurveyObj.questionsNum) {
                    /*$('#submitQuizReskin .buttonText')
                        .attr('data-languageitem', SL.UI.next)
                        .text(SL.UI.next);*/

                    //unfocus and focus in order the screen reader the read the new text
                    $('#submitQuizReskin').blur().focus();

                    questionContainer.find('.oneAnswer').attr('tabindex', -1).attr('aria-disabled', true);

                    correctState = correctState && itemIsSelected;

                    // --- The next several lines, are soooo wrong, but I do not have any time |rework|
                    var selectedItemText = "";
                    var learnerResponse = "";
                    var questionText = questionContainer.find('.questionTitle').text();
                    var questionType = questionContainer.attr('type');
                    var correctAnswer = '';
                    var correctAnswerText = '';

                    var questionForModule = questionContainer.attr('formodule');
                    var questionGroupId = questionContainer.attr('qgroupid');
                    var questionId = questionContainer.attr('qid');

                    // --- find all correct answers for current question and concatenate them in a string
                    $(getQuizObj(quizObj).quizArray).each(function (i, qGroup) {
                        if (qGroup.id == questionGroupId && qGroup.module == questionForModule) {
                            $(qGroup.questionArr).each(function (j, question) {
                                if (question.id == questionId) {
                                    var answerCorrectState;
                                    $(question.answerArr).each(function (l, answer) {
                                        answerCorrectState = answer.correct === 'true'; // string to boolean
                                        if (answerCorrectState) {
                                            correctAnswer += ((l + 1) + '[,]');
                                            correctAnswerText += (answer.aText + '[,]');
                                        }
                                    });

                                    question.correctState = correctState;
                                    return false;
                                }
                            });
                            return false;
                        }
                    });
                    correctAnswer = correctAnswer.slice(0, correctAnswer.lastIndexOf('[,]'));           // --- Removes the last separator 
                    correctAnswerText = correctAnswerText.slice(0, correctAnswerText.lastIndexOf('[,]'));

                    questionContainer.find('input').each(function () {
                        if ($(this).is(':checked')) {
                            selectedItemText += $(this).getParent('.oneAnswer').find('label').text() + " | ";
                            learnerResponse += (Number($(this).getParent('.oneAnswer').index()) + 1) + '[,]';
                        }
                    });

                    learnerResponse = learnerResponse.slice(0, learnerResponse.lastIndexOf('[,]'));     // --- Removes the last separator

                    showInfoPopUp(getQuizObj(quizObj), correctState, selectedItemText, learnerResponse, questionText, questionType, correctAnswer, correctAnswerText);

                    var correctOrWrong = 'correct';

                    getQuizObj(quizObj).answeredQuestionsNum++;

                    handlePostAssessSpesificEval(getQuizObj(quizObj)); // Evaluating the answer at the first click.
                } else {
                    isFinalSurvey == true;
                    localStorage.setItem('isFinalSurvey', true);

                    // Mock saving final quiz
                    saveOneIneraction({
                        attempt: 0,
                        quizArrayId: 0,
                        questionArrId: 0,
                        modGId: 0,
                        result: true,
                        sections: "",
                        questionText: HShell.content.finalSurveyObj.quizArray[0].questionArr[0].qTxt,
                        weighting: 0,
                        latency: 0,
                        correctAnswerText: "",
                        description: $("label[for='" + $(HShell.content.finalSurveyObj.activeQuestion).find(":checked").attr("id") + "']").text(),
                        timeStamp: HShell.utils.convertDateToFullTime(new Date())
                    }, "2004");

                    // // TEST - trying to fix error popup in SAP
                    // buildSavingScreen();
                    // HShell.storage.saveCourseEndData();
                    // console.log('initiating setTimeout 1');
                    // setTimeout(function () {
                    //     removeSavingScreen();
                    //     console.log('closing setTimeout 1');
                    // }, 2000);
                    $('#pAllOkFinConfirmBtnReskin').uniClick(function () {
                        buildOnePostAllFinPage();
                        $('#hPageHHomeButton').addClass('directGoToHome').show();
                        $('#pAllOkFinTitleContainer').text(SL.UI.preAThankYou);
                        $('#pAllOkFinContent').html(SL.UI.finText).attr('data-languageItem', 'finText');
                        $('#SCORM_Container, body').scrollTop(0);

                        $(this).hide();
                        if (HShell.contentSetup.isExtranetCourse) {
                            $('#pAllOkFinExitBtnReskin').css('display', 'inline-flex').addClass('visible');
                            HShell.storage.setCourseAsCompleated();
                        }
                        else {
                            $('#pAllOkFinHomeBtnReskin, #pAllOkFinExitBtnReskin').css('display', 'inline-flex').addClass('visible');
                            HShell.storage.setCourseAsCompleated();
                        }

                        HShell.a11y.speak(SL.UI.preAThankYou + ' ' + SL.UI.finText);
                        HShell.storage.commitData('immediate');
                        // $('#pAllOkFinExitBtnReskin').focus();
                    }); // Copied from goto.js (#1268).

                    $('#pAllOkFinExitBtnReskin').uniClick(function () {
                        localStorage.setItem('isFinalSurvey', false);
                        if (HShell.contentSetup.isExtranetCourse) {
                            if (HShell.contentSetup.extranetRedirectToCertificatePage) {
                                extranet_redirectToPage();
                            } else {
                                $('body').text('You have completed your training. You may close this window to finish this session.');
                            }
                        } else {
                            $('body').text('You have completed your training. You may close this window to finish this session.');
                            var scormVersion = pipwerks && pipwerks.SCORM ? pipwerks.SCORM.version || '2004' : '2004';
                            if(scormVersion == '2004') {
                                SCORM.SCORMSetOneItem('cmi.success_status', "passed");
                            } else {
                                SCORM.SCORMSetOneItem('cmi.core.lesson_status', "passed");
                            }
                            // HShell.storage.commitData('immediate');
                            exitCourse();
                        }
                    });
                }
                // HShell.storage.commitData('high');
            } else {
                //removed reflection points selector, because it cannot be tested (also the html structure might be changed)
                $('#submitQuizReskin .buttonText')
                    .attr('data-languageitem', SL.UI.next)
                    .text(SL.UI.next);

                //unfocus and focus in order the screen reader the read the new text
                $('#submitQuizReskin').blur().focus();

                questionContainer.find('.oneAnswer').attr('tabindex', -1).attr('aria-disabled', true);

                correctState = correctState && itemIsSelected;

                // --- The next several lines, are soooo wrong, but I do not have any time |rework|
                var selectedItemText = '';
                var learnerResponse = '';
                var questionText = questionContainer.find('.questionTitle').text();
                var questionType = questionContainer.attr('type');
                var correctAnswer = '';

                var questionForModule = questionContainer.attr('formodule');
                var questionGroupId = questionContainer.attr('qgroupid');
                var questionId = questionContainer.attr('qid');

                // --- find all correct answers for current question and concatenate them in a string
                $(getQuizObj(quizObj).quizArray).each(function (i, qGroup) {
                    if (qGroup.id == questionGroupId && qGroup.module == questionForModule) {
                        $(qGroup.questionArr).each(function (j, question) {
                            if (question.id == questionId) {
                                var answerCorrectState;
                                $(question.answerArr).each(function (l, answer) {
                                    answerCorrectState = answer.correct === 'true'; // string to boolean
                                    if (answerCorrectState) {
                                        correctAnswer += ((l + 1) + '[,]');
                                    }
                                });

                                question.correctState = correctState;
                                return false;
                            }
                        });
                        return false;
                    }
                });
                correctAnswer = correctAnswer.slice(0, correctAnswer.lastIndexOf('[,]'));			// --- Removes the last separator

                questionContainer.find('input').each(function () {
                    if ($(this).is(':checked')) {
                        selectedItemText += $(this).getParent('.oneAnswer').find('label').text() + ' | ';
                        learnerResponse += (Number($(this).getParent('.oneAnswer').index()) + 1) + '[,]';
                    }
                });

                learnerResponse = learnerResponse.slice(0, learnerResponse.lastIndexOf('[,]'));		// --- Removes the last separator

                showInfoPopUp(getQuizObj(quizObj), correctState, selectedItemText, learnerResponse, questionText, questionType, correctAnswer);
                questionContainer.attr('correctState', correctState).addClass('answered');
                questionContainer.find('.oneAnswer input, .radioReskin, .checkBoxReskin').unbind('click');							// --- Prevents the items to be selected after you have submitted yout answer
                questionContainer.find('input').attr('disabled', 'disabled');
                questionContainer.find('.AnswerTrueFalseIndicator').show().css('opacity', '1').css('visibility', 'visible');

                var correctOrWrong = correctState ? 'correct' : 'wrong';

                if (getQuizObj(quizObj).type == 'survey') {
                    correctOrWrong = 'correct';
                }

                var assessContainer = questionContainer.closest('.fancyAssessmentTemplateContainer');
                assessContainer.find('.feedbackIndicatorContainer').removeClass('wrong correct').addClass(correctOrWrong);
                showFancyAssessmentFeedback(questionContainer);
                if (assessContainer.find('.infoBtnPopUpTextContainer').css('display') == 'none') {
                    assessContainer.find('.infoBtnPopUpTextContainer').css('display', 'block');
                }

                if (HShell.autoSetup.runOn.deviceType == 'mobile' && HShell.autoSetup.runOn.deviceName != 'ipad') {
                    if (HShell.savedData.last_location == 'pre_a' || HShell.savedData.last_location == 'post_a') {
                        scrollPageToBottom();
                    }
                }

                getQuizObj(quizObj).answeredQuestionsNum++;

                // --- Scrolls back to the top, becoming ready for the next question
                if (HShell.savedData.last_location == 'pre_a' || HShell.savedData.last_location == 'post_a') {		// --- We have the check, because we do not have to make the same animation for the reflection points
                    if ($('#SCORM_Container').css('overflow') == 'auto') {
                        $('#SCORM_Container').scrollTo($('#eLContentContainer').height(), HShell.consts.automaticScrollTime);
                    }
                }
            }
        }
    }
}

// ________________________________________________________

function handlePreAssessSpesificEval(quizObj) {
    var questionContainer = quizObj.activeQuestion;

    quizObj.activeQuestionData = HShell.fillAssessmentAnswerEndData(quizObj);
    quizObj.answersArray[quizObj.answersArray.length - 1].latency = quizObj.activeQuestionData.latency;		// --- Adds the latency to the answer object

    if (quizObj.questionsNum == quizObj.answeredQuestionsNum) {
        var modulesAllAnswers = {};             // --- Object with ids of all modules as properties and an array with their answers (true/false) as value

        $('.questionContainer').each(function () {
            if (!modulesAllAnswers[$(this).attr('forModule')]) { modulesAllAnswers[$(this).attr('forModule')] = []; }

            if ($(this).attr('correctstate') == 'true') {
                modulesAllAnswers[$(this).attr('forModule')].push(true);
            } else {
                modulesAllAnswers[$(this).attr('forModule')].push(false);
            }
        });

        for (var module in modulesAllAnswers) {
            var isModuleCompleted = true;

            for (var answer in modulesAllAnswers[module]) {
                if (modulesAllAnswers[module][answer] === false) {
                    isModuleCompleted = false;
                    break;
                }
            }

            if (isModuleCompleted) {
                HShell.content.preAssessObj.finishedModules.push(module);
                HShell.content.selectModuleAsFinished(module, true);
            }
        }

        goToPreAssessFinScreen();
        return false;
    } else {
        prePostCommon(quizObj, questionContainer);
        return true;
    }
}

function handlePostAssessSpesificEval(quizObj) {
    var questionContainer = quizObj.activeQuestion;

    quizObj.activeQuestionData = HShell.fillAssessmentAnswerEndData(quizObj);
    quizObj.answersArray[quizObj.answersArray.length - 1].latency = quizObj.activeQuestionData.latency;		// --- Adds the latency to the answer object

    if (quizObj.questionsNum == quizObj.answeredQuestionsNum) {
        var modulesAllAnswers = {};                                 // --- Object with ids of all modules as properties and an array with their answers (true/false) as value

        $('.questionContainer').each(function () {
            if (!modulesAllAnswers[$(this).attr('forModule')]) { modulesAllAnswers[$(this).attr('forModule')] = []; }

            if ($(this).attr('correctstate') == 'true') {
                modulesAllAnswers[$(this).attr('forModule')].push(true);
            } else {
                modulesAllAnswers[$(this).attr('forModule')].push(false);
            }
        });

        for (var prop in modulesAllAnswers) {
            var isModuleCompleted = true;

            for (var answer in modulesAllAnswers[prop]) {
                if (modulesAllAnswers[prop][answer] === false) {
                    isModuleCompleted = false;
                    break;
                }
            }

            if (isModuleCompleted) {
                HShell.autoSetup.postAssessFinishedModules.push(prop);
                HShell.autoSetup.postAssessWrongModules = HShell.utils.removeItemFromArray(HShell.autoSetup.postAssessWrongModules, prop);
            } else {
                HShell.autoSetup.postAssessWrongModules.push(prop);
            }
        }

        // $('#eLContentContainer').empty().append(
        //     HShell.core.getComponent('CopyRight').init()
        // );
        HShell.core.renderComponents($('#eLContentContainer'));

        if (HShell.contentSetup.have_survey && HShell.content.surveyObj.finished !== true && quizObj.questionsNum == quizObj.correctAnswers) {
            HShell.content.postAssessObj.completion_status = 'completed';
            HShell.storage.commitData('high');
            gotoSurvey();
        } else if (HShell.savedData.last_location == 'final_survey' &&
            HShell.content.finalSurveyObj.answeredQuestionsNum == HShell.content.finalSurveyObj.questionsNum) { // If quizType is finalSurvey and it's finished.
            buildOnePostAllFinPage(); // Go To Final "Well Done".
            isFinalSurvey = true;
            gotoEvalPostPage();
        } else {
            gotoEvalPostPage();
        }

        HShell.content.postAssessObj.attempts++;
    } else {
        prePostCommon(quizObj, questionContainer);
    }
}

// ________________________________________________________

function prePostCommon(quizObj, questionContainer) {
    quizObj.activeQuestionNum++;
    quizObj.activeQuestion = quizObj.activeQuestion.next().hide().show();

    quizObj.activeQuestionData = HShell.fillAssessmentAnswerStartData(quizObj);         // Not realy sure why i have it here and on pre and post, but i do not have time to investigate.

    enableQuestionTypeSpesificFunctions(quizObj, 'play');
    $('.infoBtnPopUpContainer, .infoBtn, .infoBtnMobile, .correctWrongIndicator').hide();
    $('.correctWrongIndicatorMobile > .infoBtnPopUpTextIconCorrect, .correctWrongIndicatorMobile > .infoBtnPopUpTextCorrect, .correctWrongIndicatorMobile > .infoBtnPopUpTextIconWrong, .correctWrongIndicatorMobile > .infoBtnPopUpTextWrong').hide();

    $('.copyRight').css('z-index', 400);

    questionContainer.hide().removeClass('active');
    questionContainer.next().show().addClass('active');

    $('.assessmentProgressContainer').text(quizObj.answeredQuestionsNum + 1 + '/' + quizObj.questionsNum);
    updateProgressBar(quizObj.answeredQuestionsNum + 1, quizObj.questionsNum);

    var tempStr = 'Question ' + (quizObj.answeredQuestionsNum + 1) + ' ' + SL.UI.of + ' ' + quizObj.questionsNum;
    tempStr += '&nbsp; <br>' + questionContainer.next().find('.questionTitle').first().text();

    HShell.a11y.speak(tempStr, true);
    $('#assessmentTypeIndicator').attr('tabindex', '0').focus().blur(function () { $(this).attr('tabindex', '-1'); });

    var passed = false;
    quizObj.activeQuestion.find('.oneAnswer').each(function () { if ($(this).find('input').is(':checked')) passed = true; });
    assessEnableNextBtn(passed);
}

// ________________________________________________________

function handleModAssessSpesificEval(questionContainer) {
    var allQNum = questionContainer.parent().children().length;
    if (allQNum == Number(questionContainer.attr('qid'))) {
        var rootParent = questionContainer.parent().parent().parent();
        var thScreen = rootParent.find('.oneModThanksScreen');
        var correctQNum = Number(rootParent.find('.oneModOneQuestionContainer[correctstate="true"]').length);
        thScreen.find('.oneModTYTCp2').html(correctQNum + '&nbsp;');
        thScreen.find('.oneModTYTCp4').html(allQNum + '&nbsp;');

        var moduleRoot = questionContainer.parentsUntil('.modulesGroupContentContaienr').last();
        moduleRoot.find('.oneModuleQuizButtonContainer').addClass('completed');

        // --- Stores the completion of the quiz in the Modules Array and on the LMS
        var parentItem = questionContainer.getParent('.ModList__Item');
        var moduleArrayObj = SL.modulesGroupArray[parentItem.attr('data-modulesgrouparrayid')].modulesArray[parentItem.attr('data-modulesarrayid')];
        moduleArrayObj.quiz_completion_status = 'completed';

        moduleRoot.removeClass('notStarted').addClass('quizPassed');
        var moduleRootID = Number(moduleRoot.attr('moduleId'));

        if (!moduleRoot.hasClass('contentPassed')) {
            moduleRoot.addClass('started');
            $('.oneProgressItem[modId="' + moduleRootID + '"]').addClass('inProgress');
        } else {
            HShell.content.selectModuleAsFinished(moduleRootID);
        }
        thScreen.show();
        rootParent.find('.oneModuleQuizContainer > .buttonsContainer, .oneModuleQuizContainer .oneModOneQuestionContainer, .oneModuleQuizContainer .oneModQuHeaderContainer ').hide();
    } else {
        questionContainer.hide().removeClass('onScreen').next().show().addClass('onScreen');
        questionContainer.parent().parent().find('.infoBtn, .infoBtnMobile, .infoBtnPopUpContainer, .correctWrongIndicator').hide();
        questionContainer.parent().parent().find('.correctWrongIndicatorMobile > .infoBtnPopUpTextIconCorrect, .correctWrongIndicatorMobile > .infoBtnPopUpTextCorrect, .correctWrongIndicatorMobile > .infoBtnPopUpTextIconWrong, .correctWrongIndicatorMobile > .infoBtnPopUpTextWrong').hide();


        $('.copyRight').css('z-index', 4000);
        var thisQNumberIdentifier = questionContainer.parent().parent().find('.oneModQuCurrentQuestion');
        thisQNumberIdentifier.text(Number(thisQNumberIdentifier.text()) + 1);
    }
}

// ________________________________________________________________________________________________________________________________

function showInfoPopUp(quizObj, correctState, selectedItemText, learnerResponse, questionText, questionType, correctAnswer) {
    var questionContainer = quizObj.activeQuestion;
    var questionsGroupArr = quizObj.quizArray;
    var questionContainerParent = questionContainer.parent().parent();
    questionContainerParent.find('.infoBtn, .infoBtnMobile, .infoBtnPopUpContainer, .correctWrongIndicator').fadeIn();

    if (HShell.contentSetup.fancyAssessment) {
        if (correctState) {
            questionContainerParent.find('.correctWrongIndicatorMobile > .infoBtnPopUpTextIconCorrect,  .correctWrongIndicatorMobile > .infoBtnPopUpTextCorrect').fadeIn();
        } else {
            questionContainerParent.find('.correctWrongIndicatorMobile > .infoBtnPopUpTextIconWrong,  .correctWrongIndicatorMobile > .infoBtnPopUpTextWrong').fadeIn();
        }
    }

    questionContainerParent.find('.infoBtnPopUpContainer').attr('aria-live', 'off');
    $('.copyRight').css('z-index', 0);
    var qGroupId = Number(questionContainer.attr('qGroupId')) - 1;
    var qId = Number(questionContainer.attr('qid'));
    var qModId = Number(questionContainer.attr('modQId'));
    var assessModId = Number(questionContainer.attr('forModule'));
    var questionItem = '';
    var correctFB = '';

    for (var i = 0; i < questionsGroupArr.length; i++) {
        if ((questionsGroupArr[i].module == assessModId && questionsGroupArr[i].id == qGroupId + 1) || quizObj.allCorrect) {
            questionItem = questionsGroupArr[i];
            break;
        }
    }

    if (correctState && !quizObj.allCorrect) {
        if (String(qModId) == 'NaN') {
            for (var t = 0; t < questionItem.questionArr.length; t++) {
                if (questionItem.questionArr[t].id == qId) {
                    var selectedAnswers = learnerResponse.replace(/\[|\]/g, '');
                    var fbByAnswerId = questionItem.questionArr[t].correctFBByAnswerId && questionItem.questionArr[t].correctFBByAnswerId[selectedAnswers];
                    if (fbByAnswerId) {
                        correctFB = fbByAnswerId;
                    } else {
                        correctFB = questionItem.questionArr[t].correctFB;
                    }
                }
            }
        } else {
            correctFB = questionsGroupArr[qGroupId].modulesArray[qModId].quizObj.questionArr[qId - 1].correctFB;
        }

        questionContainerParent.find('.correctWrongIndicator').removeClass('incorrect');
        questionContainerParent.find('.infoBtnPopUpTextContainer').html(correctFB).attr('data-moduleGroupTask', 'correct_fb').attr('data-modulequizid', qId + 1);
        // HShell.a11y.speak('Correct. ' + correctFB + ' Click Next button to move forward.');
        quizObj.correctAnswers++;
    } else {
        var wrongFB = '';
        if (String(qModId) == 'NaN') {
            for (var j = 0; j < questionItem.questionArr.length; j++) {
                if (questionItem.questionArr[j].id == qId) {
                    var selectedAnswers = learnerResponse.replace(/\[|\]/g, '');
                    var fbByAnswerId = questionItem.questionArr[j].wrongFBByAnswerId && questionItem.questionArr[j].wrongFBByAnswerId[selectedAnswers];
                    if (fbByAnswerId) {
                        wrongFB = fbByAnswerId;
                    } else {
                        wrongFB = questionItem.questionArr[j].wrongFB;
                    }
                }
            }
        } else { wrongFB = questionsGroupArr[qGroupId].modulesArray[qModId].quizObj.questionArr[qId - 1].wrongFB; }

        questionContainerParent.find('.correctWrongIndicator').addClass('incorrect');
        questionContainerParent.find('.infoBtnPopUpTextContainer').html(wrongFB).attr('data-moduleGroupTask', 'wrong_fb').attr('data-modulequizid', qId + 1);
        // HShell.a11y.speak('Incorrect. ' + wrongFB + ' Click Next button to move forward.');
    }

    questionContainer.attr('passed', 'true');
    quizObj.answersArray.push({
        correctState: correctState,			// |Nick|
        correctAnswer: correctAnswer,
        questionGroupId: qGroupId,
        questionId: qId,
        selectedItemText: selectedItemText,
        questionText: questionText,
        questionType: questionType,
        learnerResponse: learnerResponse,
        interactionIsSaved: false,
        assessmentModuleId: assessModId,
        timeStamp: quizObj.activeQuestionData.timestamp
    });

    HShell.content.interactionsCount++;

    // This is used for the Survey only (for now)
    if (quizObj.allCorrect) {		// |rework| I made it so it works with only one question and on top of this it is very poorly done. No time to make it propre
        //var correctFB = "";
        correctFB = quizObj.answersArray[quizObj.answersArray.length - 1].learnerResponse;
        correctFB = quizObj.quizArray[0].questionArr[0].correctFB[Number(correctFB) - 1];

        questionContainerParent.find('.correctWrongIndicator').removeClass('incorrect');
        questionContainerParent.find('.infoBtnPopUpTextContainer').html(correctFB).attr('data-moduleGroupTask', 'correct_fb').attr('data-modulequizid', qId + 1);
        HShell.a11y.speak(correctFB);
    }
}
// ________________________________________________________

function enableInfoPopUpButtons(scope) {
    //windowsPhone 8.1 doesn't support aria-pressed and the button isn't working if you have the attribute
    if (HShell.autoSetup.runOn.OS === 'windowsPhone') {
        scope.find('.infoBtnIconHolderContainer').attr('aria-label', 'on ' + SL.UI.info);
    } else {
        scope.find('.infoBtnIconHolderContainer').attr('aria-pressed', true);
    }
    scope.find('.infoBtnIconHolderContainer, .standardAssessmentTemplateContainer .infoBtnPopUpContainer').uniClick(function () {
        var item = scope.find('.infoBtnPopUpContainer');

        if (!item.length) {
            item = scope.find('.feedbackIndicatorContainer > .infoBtnPopUpTextContainer');
        }

        if (HShell.autoSetup.runOn.OS === 'windowsPhone') {
            if (item.css('display') == 'none') {
                item.show().attr('aria-label', 'on ' + SL.UI.info);
                // aria-live isn't working on ie 8.1 with narrator, leaving it for windows 10
                scope.find('.infoBtnIconHolderContainer').attr('aria-live', 'assertive');
                scrollPageToBottom();
            } else {
                item.hide().attr('aria-live', 'off');
                scope.find('.infoBtnIconHolderContainer').attr('aria-label', 'off ' + SL.UI.info);
            }
        } else {
            if (item.css('display') == 'none') {
                item.show().attr('aria-live', 'assertive');
                scope.find('.infoBtnIconHolderContainer').attr('aria-pressed', true);
                if (HShell.autoSetup.runOn.deviceType == 'mobile' && HShell.autoSetup.runOn.deviceName != 'ipad') {
                    if (HShell.savedData.last_location == 'pre_a' || HShell.savedData.last_location == 'post_a') {
                        scrollPageToBottom();
                    }
                }
                $('.copyRight').css('z-index', 0);
            } else {
                item.hide().attr('aria-live', 'off');
                scope.find('.infoBtnIconHolderContainer').attr('aria-pressed', false);
                $('.copyRight').css('z-index', 4000);
            }
        }

        if (HShell.autoSetup.oldIE) {				//--- this is here just to make IE7 rerender the element
            item.parent().parent().hide().show();
            $('.infoBtnIconHolderContainer').focus();
        }
    });
}

// ________________________________________________________________________________________________________________________________

function enableQuestionsTypeSpesificFunctions(quizObj) {
    $('.questionContainer').each(function () {

        var type = $(this).attr('type');

        switch (type) {
            // ------------- Video Question
            case 'video':
                var contentURL = 'content/' + HShell.userData.selected_language + '/';
                var i = HShell.autoSetup.activeVideoArray.length;
                HShell.autoSetup.activeVideoArray.push(new uniPlay());
                HShell.autoSetup.activeVideoArray[i].videoURL = contentURL + $(this).attr('quizType') + '/' + $(this).find('.quContVideoContainer').attr('videoURL');
                HShell.autoSetup.activeVideoArray[i].subtitlesURL = contentURL + $(this).attr('quizType') + '/' + $(this).find('.quContVideoContainer').attr('subtitlesURL');
                HShell.autoSetup.activeVideoArray[i].videoContainer = $(this).find('.vidPopVideoContainer');
                HShell.autoSetup.activeVideoArray[i].subtitlesContainer = $(this).find('.vidPopSubtitlesContainer');
                HShell.autoSetup.activeVideoArray[i].controlesContainer = $(this).find('.vidPopFooterContainer');

                HShell.autoSetup.activeVideoArray[i].videoH = 308;
                HShell.autoSetup.activeVideoArray[i].videoW = 817;
                HShell.autoSetup.activeVideoArray[i].autoPlay = false;
                HShell.autoSetup.activeVideoArray[i].onVideoFinish = function () {
                    var videoObj = this;
                    var questionButton = videoObj.controlesContainer.find('.btnWrapper');
                    questionButton.removeClass('inactive');
                    questionButton.uniClick(function () {
                        videoObj.stop();
                        $('.quContVideoContainer:visible').hide();
                    });
                };
                HShell.autoSetup.activeVideoArray[i].onReadyState = function () { this.controlesContainer.find('.vidPopBackBtn, .vidPopPlayBtn, .vidPopStopBtn, .vidPopMuteBtn').stop().fadeIn(function () { $(this).css('display', 'block'); }); };

                HShell.autoSetup.activeVideoArray[i].buildVideoPlayer();
                $(this).attr('activeVideoArrayId', (getQuizObj(quizObj).i));

                var parent = $(this);
                $(this).find('.replayButton').uniClick(function () {
                    parent.find('.quContVideoContainer').show();
                    parent.find('.vidPopStopBtn').click();
                    parent.find('.vidPopPlayBtn').click();
                });

                break;
        }
    });
}

function scrollPageToBottom() {
    var contOverflowY = $('#SCORM_Container').css('overflow-y');
    if ((contOverflowY == 'auto') || (contOverflowY == 'scroll') || ($('#SCORM_Container').css('overflow') == 'hidden')) {
        $('#SCORM_Container').scrollTo(3000, HShell.consts.automaticScrollTime);
    }
}

HShell.core = HShell.core || {};
HShell.core.checkThresholdPercentagePassed = function (percentage) {
    percentage = Number(percentage) || 0;
    return percentage >= (Number(HShell.contentSetup.postAssessmentThersholdPerc) || 75);
}

/// <reference path="_references.js" />

var tick_icon = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><path d="M781.785 320.985c-7.877-7.877-19.692-7.877-27.569 0l-380.062 380.062-124.062-124.062c-7.877-7.877-19.692-7.877-27.569 0s-7.877 19.692 0 27.569l137.846 137.846c3.938 3.938 9.846 5.908 13.785 5.908s9.846-1.969 13.785-5.908l393.846-393.846c7.877-7.877 7.877-19.692 0-27.569zM512 78.769c238.277 0 433.231 194.954 433.231 433.231s-194.954 433.231-433.231 433.231-433.231-194.954-433.231-433.231 194.954-433.231 433.231-433.231zM512 39.385c-261.908 0-472.615 210.708-472.615 472.615s210.708 472.615 472.615 472.615 472.615-210.708 472.615-472.615-210.708-472.615-472.615-472.615v0z"></path></svg>';
var in_progress_icon = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><path d="M512 78.8c238.3 0 433.2 195 433.2 433.2s-194.9 433.2-433.2 433.2-433.2-194.9-433.2-433.2 194.9-433.2 433.2-433.2v0zM512 39.4c-261.9 0-472.6 210.7-472.6 472.6s210.7 472.6 472.6 472.6 472.6-210.7 472.6-472.6-210.7-472.6-472.6-472.6v0 0zM492.9 236.8v-19.7c0-11.8 7.9-19.7 19.7-19.7s19.7 7.9 19.7 19.7v19.7c0 11.8-7.9 19.7-19.7 19.7s-19.7-7.9-19.7-19.7zM532.3 788.2v19.7c0 11.8-7.9 19.7-19.7 19.7s-19.7-7.9-19.7-19.7v-19.7c0-11.8 7.9-19.7 19.7-19.7s19.7 7.8 19.7 19.7zM827.7 512.5c0 11.8-7.9 19.7-19.7 19.7h-19.7c-11.8 0-19.7-7.9-19.7-19.7s7.9-19.7 19.7-19.7h19.7c11.8 0 19.7 7.8 19.7 19.7zM256.6 512.5c0 11.8-7.9 19.7-19.7 19.7h-19.7c-11.8 0-19.7-7.9-19.7-19.7s7.9-19.7 19.7-19.7h19.7c11.8 0 19.7 7.8 19.7 19.7zM554.2 512.5c0 22.975-18.625 41.6-41.6 41.6s-41.6-18.625-41.6-41.6c0-22.975 18.625-41.6 41.6-41.6s41.6 18.625 41.6 41.6zM504.9 506.4v0c-12.5 5.4-27.1-0.5-32.5-13l-51.6-120.2c-5.4-12.5 0.5-27.1 13-32.5v0c12.5-5.4 27.1 0.5 32.5 13l51.6 120.2c5.4 12.5-0.5 27.1-13 32.5zM728.3 661.2v0c-7.4 11.4-22.8 14.7-34.2 7.3l-178.8-116.1c-11.4-7.4-14.7-22.8-7.3-34.2v0c7.4-11.4 22.8-14.7 34.2-7.3l178.8 116.1c11.4 7.4 14.7 22.8 7.3 34.2z"></path></svg>';

var HShell = window.HShell || {};
HShell.content = HShell.content || {};

function createModuleGroupArray(langObj) {
    langObj.modulesGroupArray = new Array();
    langObj.allModules = new Array();

    var moduelGroupNumber = 0,
        moduleInGroupId = 0;
    $(langObj.contentXML).find('moduelGroup').each(function (moduleGroupIndex) {
        var tempArray = new Array();
        moduelGroupNumber = moduleGroupIndex;
        moduleInGroupId = 0;

        $(this).find('oneModule').each(function (moduleIndex) {
            var module = HShell.utils.xml2json(this),
                modulesList = HShell.content.selected_roleObj.modules_listArray;

            moduleInGroupId = moduleIndex;
            // --- Checks if the specific module is available for the selected role.
            if (modulesList.indexOf(module._id) != -1 || +modulesList[0] === 0) {
                tempArray.push(HShell.newObjects.newModuleObject(this, moduelGroupNumber, moduleInGroupId));
                tempArray[tempArray.length - 1].XmlObject = this;
                langObj.allModules.push(tempArray[tempArray.length - 1]);
            }
        });

        if (tempArray.length != 0) {
            var groupObj = {
                modulesArray: tempArray,
                XmlObject: this,
                groupTitle: $(this).attr('name')
            };
            langObj.modulesGroupArray.push(groupObj);
        }
    });

    $(HShell.content.languageArray).each(function (k, item) {
        HShell.languageObjPostgModeSpesificTexts(item.UIXML, item);
    });

    $(HShell.content.languageArray).each(function (i, item) {
        var objectiveCount = 0;
        $(item.allModules).each(function (j, item2) {
            item2.objectiveId = objectiveCount++;
        });
    });
}

// ________________________________________________________

function createInitialModuleData() {

    $(HShell.content.languageArray).each(function (i, item) {
        $(item.modulesGroupArray).each(function (k, item2) {
            $(item2.modulesArray).each(function (j, item3) {
                var newObjective = new HShell.oneObjective();
                newObjective.id = 'Module_' + item3.mod_id;
                newObjective.completion_status = item3.completion_status;
                if (newObjective.completion_status == 'completed') {
                    newObjective.success_status = 'passed';
                }
                newObjective.description.type = item3.type;
                newObjective.description.title = item3.title;


                newObjective.objectiveNumber = HShell.content.obejectivesCount++;

                try {
                    item3.objective_dataObject = newObjective;
                } catch (e) {
                    HShell.utils.trace('createInitialModuleData: ' + e, '6.modules');
                }
            });
        });
    });

    if (HShell.contentSetup.have_pre_a) {			 //--- Updates the progress for the modules that ware covered from correctly passing the pre-assessment questions
        $(HShell.content.languageArray).each(function (i, item) {
            $(HShell.content.preAssessObj.finishedModules).each(function (k, item2) {
                var j = Number($('.ModList__Item[moduleid=' + item2 + ']').getParent('.modulesGroupContainer').attr('data-modulegarrayid'));

                try {
                    $(item.modulesGroupArray[j].modulesArray).each(function (l, item3) {
                        if (item3.mod_id == HShell.content.preAssessObj.finishedModules[l]) {
                            item3.objective_dataObject.completion_status = 'completed';
                            item3.objective_dataObject.success_status = 'passed';
                            item3.objective_dataObject.score = '100';
                            item3.content_completion_status = 'completed';
                            if (item3.quiz.length >= 1) {
                                item3.quiz_completion_status = 'completed';
                            } else {
                                item3.quiz_completion_status = 'unknown';
                            }
                        }
                    });
                } catch (e) {
                    HShell.utils.trace(e, '6.modules');
                }
            });
        });

        markCompletedModulesInProgressIfNotification();
    }

    HShell.storage.commitData('low');
}

// ________________________________________________________________________________________________________________________________

function buildModQuizArray(quizXml, languageArrayId, modulesGroupArrayId, modulesArrayId) {
    var currentModule = HShell.content.languageArray[languageArrayId].modulesGroupArray[modulesGroupArrayId].modulesArray[modulesArrayId];

    currentModule.quizObj = HShell.newObjects.newGroupObj(quizXml, 'null', 'null');
    if (currentModule.quizObj.id != 'undefined') {
        currentModule.quiz_completion_status = 'not attempted';
    }
}

// ________________________________________________________________________________________________________________________________

function enableModulesQuizFuncs() {
    $('.oneModQuAllQuestions').each(function () {
        var thisParent = $(this).parent().parent().parent();
        $(this).text(thisParent.find('.oneModOneQuestionContainer').length);
    });

    $('.oneModOneQuestionContainer:first-child').show().addClass('onScreen');

    $('.checkBoxWrapper > div, .radioWrapper > div').click(function () {
        $(this).next().click();
    });

    $('.checkBoxWrapper, .radioWrapper').click(function () {
        enableReskinedItems($(this));
    });

    function enableReskinedItems(reskinedItem) {
        var parrentInem = reskinedItem.parent().parent();

        $(parrentInem).find('input').each(function () {
            if ($(this).is(':checked')) {
                $(this).parent().addClass('active');
            } else {
                $(this).parent().removeClass('active');
            }
        });

        var quizObj = reskinedItem.parentsUntil('.oneModuleInnerContaienr').last();
        var nexBtn = quizObj.find('.buttonsContainer .btnWrapper');
        var questionObj = reskinedItem.parentsUntil('.oneModOneQuestionContainer').last();
        if (questionObj.find('input:checked').length > 0) {
            nexBtn.addClass('enabled');
        } else {
            nexBtn.removeClass('enabled');
        }
    }

    $('.oneModuleQuizButtonContainer').uniClick(function (e) {
        oneModuleQuizButtonClicker($(this), e.data.param1);
    }, 400);


    $('.oneModQuestionsContainer').each(function () {
        var questionContainer = $(this);
        questionContainer.parent().find('.buttonsContainer .btnWrapper').click(function () {
            var qObj = HShell.newObjects.newAssessmentObj();
            qObj.activeQuestion = questionContainer.find('.oneModOneQuestionContainer.onScreen').hide().show();
            qObj.quizArray = HShell.content.selected_languageObj.modulesGroupArray;
            evaluateOneQuestion(qObj);
        });
    });

    $('.oneModuleQuizContainer').each(function () {
        enableInfoPopUpButtons($(this));
    });
    $('.oneModuleQuizCloseButton').parent().unbind('click').click(function () {
        $(this).getParent('.oneModuleInnerContaienr').find('.oneModuleQuizButtonContainer').click();
        HShell.core.$emit('onModuleStatusChanged');
    });
    $('.modAnswerOneITemTitle').each(function () {
        $(this).on('focus', function () {
            $(this).getParent('li').addClass('focus');
        });
        $(this).on('blur', function () {
            $(this).getParent('li').removeClass('focus');
        });
    });
}

function oneModuleQuizButtonClicker(thisItem, speed) {
    thisItem.toggleClass('active');
    if (thisItem.hasClass('active')) {
        // --- Hides the Info pannel if it is shown
        $(this).closest('.oneModuleInnerContaienr').find('.oneModuleInfoButtonContainer').click();
        $(this).closest('.oneModuleInnerContaienr').find('.oneModuleNotificationButtonContainer.active').click();

        thisItem.parent().parent().find('.oneModuleQuizContainer').stop().slideDown(speed);
        // --- Accessibility
        var quizContainer = thisItem.parent().parent().find('.oneModuleQuizContainer');
        var reflectionPoints = quizContainer.find('.oneModQuTitle').text();
        var steps = quizContainer.find('.oneModQuStepsContainer').text();
        var question = quizContainer.find('.oneModOneQuestionContainer.onScreen > .oneModOneQuQuestionText').text();

        HShell.a11y.speak(reflectionPoints + ' ' + steps + '. ' + question);

        $('.oneModuleQuizButtonContainer.active').not(thisItem).click(); // --- Closes all other oppend reflecton points
    } else {
        thisItem.parent().parent().find('.oneModuleQuizContainer').stop().slideUp(speed);
    }
}

// ________________________________________________________________________________________________________________________________

function enableModuleNotificationFunc() {
    $('.oneModuleNotificationButtonContainer').click(function () {
        var notificationElement = $(this).closest('.oneModuleInnerContaienr').find('.oneModuleNotificationContainer'),
            infoElements = $(this).closest('.oneModuleInnerContaienr').find('.oneModuleInfoButtonContainer.active'),
            quizElements = $(this).closest('.oneModuleInnerContaienr').find('.oneModuleQuizButtonContainer'),
            currModuleID = $(this).closest('.ModList__Item').attr('moduleid');

        $(this).toggleClass('active');

        if ($(this).hasClass('active')) {
            infoElements.click();
            quizElements.click();
            notificationElement.addClass('active').slideDown();
        } else {
            notificationElement.removeClass('active').slideUp();
            if ($(this).closest('.ModList__Item').hasClass('started') && HShell.content.languageArray[1].allModules[currModuleID].finishedInPreA) {
                HShell.content.selectModuleAsFinished(currModuleID);
            }
            if ($(this).closest('.ModList__Item').hasClass('notStarted')) {
                for (var k = 0; k < HShell.content.languageArray.length; k++) {
                    markModuleAsInProgress(currModuleID, HShell.content.languageArray[k]);
                }
            }
        }
    });
}

// ________________________________________________________________________________________________________________________________

HShell.modules = HShell.modules || {};
HShell.modules.openModule = function (params) {
    var modObj = params.modObj,
        types = HShell.consts.moduleTypes;

    HShell.content.setActiveModule(params.moduleId, params.moduleType);

    switch (params.moduleType) {
        case types.video:
        case 'webcast':
            var tempSubUrl = modObj.contentSubURL;

            if (modObj.contentURL.indexOf('www.youtube.com/watch') != -1) {
                openIframePage(params.moduleId, unescape(modObj.contentURL), modObj.title, 'youtube');
            } else if (modObj.contentURL.indexOf('www.ted.com') != -1) {
                openIframePage(params.moduleId, unescape(modObj.contentURL), modObj.title, 'ted');
            } else {
                playModuleVideo(params.contentUrl + unescape(modObj.contentURL),
                    params.contentUrl + params.contentURLAlt,
                    ('content/' + HShell.userData.selected_language + '/' + unescape(tempSubUrl)),
                    ('content/' + HShell.userData.selected_language + '/' + modObj.contentTranscriptURL),
                    modObj.mod_id,
                    params.xmlDuration,
                    params.interactionPoints);
                //courseSpecificModPlayerStart();
                window.clientSpecific_modPlayerStart();
            }
            break;

        case 'flipbook':
            // --- Currently this is suspended as functionality
            openIframePage(params.parentObj, params.moduleId, unescape(modObj.contentURL), modObj.title);
            break;

        case 'webpage':
        case types.adobeAnimate:
        case 'file':
            var pageURL = unescape(modObj.contentURL),
                regEx_isRelativeUrl = new RegExp('^(?:[a-z]+:)?//', 'i'),			// --- Checks if the URL is relative
                local = !regEx_isRelativeUrl.test(pageURL),
                isReferenceResources = modObj.title == 'Reference resources',
                isTargetSelf = modObj.moduleTarget === 'self';

            if (local && pageURL.indexOf(params.contentUrl) == -1) {                // --- Prevents total block if the content is not setup the correct way
                pageURL = params.contentUrl + pageURL;
            }

            if (isReferenceResources || isTargetSelf) {
                markModuleAsInProgress(params.moduleId, SL);
                openIframePage(params.moduleId, pageURL, modObj.title, 'undefined', params.moduleType);
            } else {
                window.open(pageURL, '_blank');
                HShell.content.selectModuleAsFinished(params.moduleId);
            }
            break;

        case types.slides:
            HShell.modules.type.slides(modObj);
            break;

        case types.layouts:
            HShell.modules.type.layouts(modObj);
            break;
    }
};

// ________________________________________________________________________________________________________________________________

HShell.modules.type = HShell.modules.type || {};
HShell.modules.type.slides = function (module) {
    var location = HShell.consts.locations.slides,
        html;

    changeLastLocation(location);

    html = HShell.core.getComponent('Module_slides').init({ module: module });

    $('#SCORM_Container').append(html);
    HShell.core.renderComponents($('#SCORM_Container'));
};

HShell.modules.type = HShell.modules.type || {};
HShell.modules.type.layouts = function (module) {
    var location = HShell.consts.locations.layouts,
        html;

    changeLastLocation(location);

    html = HShell.core.getComponent('Module_layouts').init({ module: module });

    $('#SCORM_Container').append(html);
    HShell.core.renderComponents($('#SCORM_Container'));
};

// ________________________________________________________________________________________________________________________________

function playModuleVideo(videoUrl, videoUrlAlt, subtitlesUrl, transcriptUrl, modId, xmlDuration, interactionPoints) {
    $('#mainContentContainer, #homePageHeaderContainer').hide().attr('aria-hidden', true);
    changeLastLocation('module_video');

    HShell.content.setModuleContent_AsInProgress(modId);
    buildModuleVideo(transcriptUrl, modId);

    buildVideoPlayer(videoUrl, subtitlesUrl, modId, xmlDuration, interactionPoints);

    $(SL.allModules).each(function (i, item) {			// --- If the modules is passed, then the home buttons is activated
        if (item.mod_id == modId && item.content_completion_status == 'completed') {
            $('.vidPopClose').removeClass('inactive');
        }
    });

    HShell.core.$emit('VideoModuleOppened');
}

function buildVideoPlayer(videoUrl, subtitlesUrl, modId, xmlDuration, interactionPoints, videoContainer, subtitlesContainer, controlesContainer, autoplay, skipModuleCompletionOnVideoFinished, isSlidesVideo, isLayoutsTemplateModule) {
    var videoArr = HShell.autoSetup.activeVideoArray,
        video,
        videoId;

    videoArr.push(new uniPlay(isSlidesVideo, isLayoutsTemplateModule));
    videoId = videoArr.length - 1;
    video = videoArr[videoId];

    video.videoURL = videoUrl;
    video.subtitlesURL = subtitlesUrl;

    video.interactionPoints = interactionPoints;

    video.videoContainer = videoContainer || $('.vidPopVideoContainer .vidPopVideoInnerContainer');
    video.subtitlesContainer = subtitlesContainer || $('.vidPopVideoContainer .vidPopSubtitlesContainer');
    video.controlesContainer = controlesContainer || $('#moduleVideoContainer .vidPopFooterContainer');

    video.xmlDuration = xmlDuration;
    video.videoH = 'auto';
    video.videoW = '100%';
    video.autoPlay = typeof autoplay !== 'undefined' ? autoplay : true;

    video.onVideoFinish = function () {
        if ($('body').hasClass('iOS')) { try { $('.uniPlayHtml').get(0).webkitExitFullscreen(); } catch (e) { } }

        if(!skipModuleCompletionOnVideoFinished) {
            //// ----  find module with same id and mark it as completed
            var currentModule;
            $(SL.allModules).each(function (i, item) {
                if (item.mod_id == modId) {
                    currentModule = item;
                    return false;
                }
            });

            if ((currentModule.quiz.length > 0 && currentModule.quiz_completion_status == 'completed') || currentModule.quiz.length == 0) {
                HShell.content.selectModuleAsFinished(modId);
            } else {
                var allMods = HShell.content.getModuleArrForAllLanguages(modId);

                allMods.forEach(function (item) {
                    item.content_completion_status = 'completed';
                });
            }

            $('.vidPopClose').removeClass('inactive');
        }
    };
    video.onReadyState = function () {
        $('.vidPopBackBtn, .vidPopPlayBtn, .vidPopStopBtn, .vidPopMuteBtn, .vidPopTranscriptBtn, .vidPopSubtitles, .timelineContainer')
            .stop()
            .fadeIn(function () {
                $(this).css('display', 'inline-block');
            });

        if (HShell.autoSetup.runOn.OS === 'iOS') {
            $('.vidPopPlayBtn').focus();
        }

        HShell.autoSetup.activeVideoState = 'started';
    };
    video.onBeforeReadyState = function () {
        HShell.autoSetup.activeVideoState = 'notStarted';
    };
    video.onReadyStateParam = modId;
    video.buildVideoPlayer();
    HShell.autoSetup.activeVideo = video;
}

// ________________________________________________________________________________________________________________________________

function openIframePage(mod_id, fileUrl, pageTitle, embedSource, moduleType) {
    //scrollTopMainContainer();     |backwards| scroll top after module is closed, Roby may argue
    $('#mainFooterContainer, #mainContentContainer, #homePageHeaderButtonsContainer').hide().attr('aria-hidden', true);
    isFinalSurvey = false;

    var originalLocation = HShell.savedData.last_location,
        templateType = 'iframe';

    changeLastLocation('module_iframe');

    if (String(embedSource) != 'undefined') {
        templateType = (embedSource === HShell.consts.iframeTypes.youtube) ? HShell.consts.iframeTypes.youtube : templateType;
        templateType = (embedSource === HShell.consts.iframeTypes.ted) ? HShell.consts.iframeTypes.ted : templateType;
    }

    $('#SCORM_Container').append(
        HShell.core.getComponent('Module_WebPage').init({
            url:fileUrl,
            moduleType:moduleType,
            title: pageTitle,
            template: templateType,
            mod_id: mod_id,
            onClose: onClose
        })
    );

    HShell.core.renderComponents($('#SCORM_Container'));

    function onClose(skipPostAssessmentCheck){
        $('#mainFooterContainer, #mainContentContainer, #homePageHeaderButtonsContainer').show().attr('aria-hidden', 'false');
        changeLastLocation(originalLocation);
        $('#oneModuleItemContainer' + this.mod_id +'.oneModuleDescriptionContainer').focus();
        //scrollTopMainContainer();     |backwards| scroll top after module is closed, Roby may argue
        if (!skipPostAssessmentCheck) {
            HShell.checkForPostAssessment();
        }
    }
}

// ________________________________________________________________________________________________________________________________

HShell.content.selectModuleAsFinished = function (mod_id, preA) {
    var $ModList__Item = $('.ModList__Item[moduleId="' + mod_id + '"]'),
        hasQuiz = false,
        ignoreModuleCompletion = false, // --- If the module is already set to finished
        allMods = HShell.content.getModuleArrForAllLanguages(mod_id);

    allMods.forEach(function (module) {
        module.finishedInPreA = !!preA;

        if (module.completion_status == 'completed') {
            ignoreModuleCompletion = true;
        } else {
            hasQuiz = module.quiz.length > 0;
            module.completion_status = 'completed';
            module.content_completion_status = 'completed';

            module.quiz_completion_status = hasQuiz ? 'completed' : 'unknown';
        }
    });

    if (!ignoreModuleCompletion) {
        // --- Sets the module as finished in the htmlDOM
        $ModList__Item.removeClass('notStarted')
            .addClass('started contentPassed finished')
            .find('.oneModulePassButtonImg.iconHolder').html(tick_icon);

        if (hasQuiz) {
            $ModList__Item.addClass('quizPassed');
        }

        HShell.storage.commitData('immediate');

        restoreProgressFromArray();
        HShell.core.$emit('onModuleStatusChanged');
    }

    $ModList__Item.find('.oneModuleNotificationButtonContainer.active').click();
};

// ________________________________________________________________________________________________________________________________

function restoreProgressFromArray() {
    var label_completed = HShell.content.selected_languageObj.UI.compleated;
    var label_inProgress = HShell.content.selected_languageObj.UI.inProgress;
    var label_notCopleted = HShell.content.selected_languageObj.UI.notCompleted;


    $('.ModList__Item').each(function () {
        var thisItem = $(this),
            mod_id = this.getAttribute('moduleid'),
            moduleObj = HShell.content.getModuleById(mod_id);

        if (moduleObj.quiz_completion_status == 'completed') {
            thisItem.find('.oneModuleQuizButtonContainer').addClass('completed');

            setStatusAriaLabel(thisItem, moduleObj, label_completed);
            addMobileAttributesForAccessibilityToModules(thisItem, moduleObj, label_completed);

            markAsStarted(thisItem);
            thisItem.addClass('quizPassed');
            if (!$('.oneProgressItem[modid=' + thisItem.attr('moduleid') + ']').hasClass('finished')) {
                $('.oneProgressItem[modid=' + thisItem.attr('moduleid') + ']').addClass('inProgress');
                $('.oneProgressItem[modid=' + thisItem.attr('moduleid') + ']').find('.offScreen .myProgStatus').text(label_inProgress);

                setStatusAriaLabel(thisItem, moduleObj, label_inProgress);
                addMobileAttributesForAccessibilityToModules(thisItem, moduleObj, label_inProgress);
            }
        }


        if (moduleObj.content_completion_status == 'completed') {
            if (moduleObj.quiz_completion_status == 'unknown' || moduleObj.quiz_completion_status == 'completed') {
                thisItem.removeClass('started').removeClass('notStarted').addClass('finished').find('.oneModulePassButtonImg.iconHolder').html(tick_icon);

                setStatusAriaLabel(thisItem, moduleObj, label_completed);
                addMobileAttributesForAccessibilityToModules(thisItem, moduleObj, label_completed);

                $('.oneProgressItem[modid=' + thisItem.attr('moduleid') + ']').removeClass('inProgress').addClass('finished');
                $('.oneProgressItem[modid=' + thisItem.attr('moduleid') + ']').find('.offScreen .myProgStatus').text(label_completed);
            } else {
                markAsStarted(thisItem);
                if (!$('.oneProgressItem[modid=' + thisItem.attr('moduleid') + ']').hasClass('finished')) {

                    setStatusAriaLabel(thisItem, moduleObj, label_inProgress);
                    addMobileAttributesForAccessibilityToModules(thisItem, moduleObj, label_inProgress);

                    $('.oneProgressItem[modid=' + thisItem.attr('moduleid') + ']').addClass('inProgress');
                    $('.oneProgressItem[modid=' + thisItem.attr('moduleid') + ']').find('.offScreen .myProgStatus').text(label_inProgress);
                }
            }
            thisItem.addClass('contentPassed');
        }

        if (moduleObj.content_completion_status == 'incomplete') {
            markAsStarted(thisItem);

            thisItem.removeClass('notStarted quizPassed contentPassed finished')
                .addClass('started')
                .find('.oneModulePassButtonImg.iconHolder')
                .html(in_progress_icon);

            // if (!$('.oneProgressItem[modid=' + thisItem.attr('moduleid') + ']').hasClass('finished')) {

            setStatusAriaLabel(thisItem, moduleObj, label_inProgress);
            addMobileAttributesForAccessibilityToModules(thisItem, moduleObj, label_inProgress);

            $('.oneProgressItem[modid=' + thisItem.attr('moduleid') + ']').addClass('inProgress');
            $('.oneProgressItem[modid=' + thisItem.attr('moduleid') + ']').find('.offScreen .myProgStatus').text(label_inProgress);
            // }
        }

        if (moduleObj.content_completion_status == 'not attempted') {
            setStatusAriaLabel(thisItem, moduleObj, label_notCopleted);
            addMobileAttributesForAccessibilityToModules(thisItem, moduleObj, label_notCopleted);

            $('.oneProgressItem[modid=' + thisItem.attr('moduleid') + ']').find('.offScreen .myProgStatus').text(label_notCopleted);
        }
    });

    function markAsStarted(thisItem) {
        // if (!thisItem.hasClass('started') && !thisItem.hasClass('finished')) {
        thisItem.addClass('started').removeClass('notStarted').find('.oneModulePassButtonImg.iconHolder').html(in_progress_icon);//.html(HShell.consts.iconsObj.in_progress);
        // }
    }

    function setStatusAriaLabel(scope, moduleObj, status){
        var SL = HShell.content.selected_languageObj;
        var moduleTypeLanguageItem = window.getFileTypeLanguageItem(moduleObj);
        var userFriendlyModuleType = SL.UI[moduleTypeLanguageItem] !== undefined ? SL.UI[moduleTypeLanguageItem] : SL.UI.document;

        var notification = moduleObj && moduleObj.notification ? 
            ((moduleObj.notification.title || '') + ' ' + (moduleObj.notification.message || '')) : 
            '';

        var moduleTitle = moduleObj.title ? moduleObj.title + '. ' : ' ';
        userFriendlyModuleType = userFriendlyModuleType ? userFriendlyModuleType + '. ' : ' ';
        status = status ? status + '. ' : ' ';
        var moduleInfo = moduleObj.info ? moduleObj.info + '. ' : ' ';
        scope.find('.oneModuleDescriptionContainer').attr('aria-label', moduleTitle + userFriendlyModuleType + status + moduleInfo + notification);
    }

    //mobile accessibility structure/attributes change..
    function addMobileAttributesForAccessibilityToModules(listItem, moduleObj, status) {
        if (HShell.autoSetup.runOn.deviceType === 'mobile') {
            // listItem.find('.oneModuleDescriptionContainer').attr('aria-hidden', true);
            // listItem.find('.oneModuleDescriptionContainerMobile')
            listItem.find('.oneModuleDescriptionContainer')
                .attr('role', 'button')
                .attr('tabindex', 0)
                .attr('aria-label', moduleObj.title + ' ' + moduleObj.type + ' ' + status);
        }
    }
}

// ________________________________________________________________________________________________________________________________

HShell.checkForPostAssessment = function (isAfterDataRestore) {
    var SL = HShell.content.selected_languageObj;

    var assessmentFinModules = 0;
    $(HShell.content.preAssessObj.finishedModules).each(function (i, item) {
        $(SL.allModules).each(function (k, item2) {
            if (Number(item2.mod_id) == Number(item) && item2.mandatory) {
                assessmentFinModules++;
            }
        });
    });
    $(HShell.autoSetup.postAssessFinishedModules).each(function (i, item) {
        $(SL.allModules).each(function (k, item2) {
            if (Number(item2.mod_id) == Number(item) && item2.mandatory) {
                assessmentFinModules++;
            }
        });
    });

    var finishedMods = 0;
    var allMods = 0;
    $(SL.allModules).each(function (i, item) {
        if (item.mandatory) { allMods++; }
        if (item.content_completion_status == 'completed' && item.mandatory) { // --- For the ATool this must not be "content_completion_status" but 'completion_status'. For some reason this is not working on jZero, so for now it is like this |rework|
            finishedMods++;
        }
    });

    if (finishedMods == allMods) {
        var shouldGoToPostAssessment = true;
        if (isAfterDataRestore) {
            if (HShell.savedData.completion_status == 'completed') {
                shouldGoToPostAssessment = false;
            }
        } else {
            if((assessmentFinModules == allMods || HShell.savedData.completion_status == 'completed') && allMods != 0) {
                shouldGoToPostAssessment = false;
            }
        }
        if (!shouldGoToPostAssessment) {
            $('#postAssessmentLaunchButton').addClass('finished').unbind('click').show();
            $('#postAssessmentLaunchButton').addClass('activated').uniClick(function () {
                 if (checkIsCourseCompleted()) {
                    $('#hPageHeaderGrayBG').click();
                    gotoEvalPostPage(true);
                }
            });
            $('#postAssessmentLaunchButtonContainer').show();
            $('#postAssessmentLaunchButtonText').text(SL.UI.goToConfirmation).attr('data-languageitem', 'goToConfirmation');
            $('#goToConfirmationDescription').addClass('shown');
        } else {
            if (HShell.contentSetup.post_type == 1 && allMods != 0) {						// --- Completion based
                if (getPostAssessmentQuizModulesList() == assessmentFinModules && assessmentFinModules != 0) {
                    if (HShell.contentSetup.have_survey && !HShell.content.surveyObj.finished) {
                        gotoSurvey();
                    } else {
                        gotoEvalPostPage(true);
                    }
                } else {
                    if (HShell.contentSetup.have_post_a) {
                        if (!HShell.autoSetup.postAssessEnabled) {
                            $('#postAssessmentLaunchButtonContainer').show();
                            $('#postAssessmentLaunchButton').addClass('activated').uniClick(function () {
                                $('#hPageHeaderGrayBG').click();
                                goToPostAssessment();
                                if (HShell.autoSetup.runOn.OS == 'windowsPhone') {		// --- |rework| An universal solution must be found
                                    $('#SCORM_Container').css({ overflowY: 'scroll' });
                                }
                            });

                            showPostAssessmentQuestionPopUp();
                        }

                        HShell.autoSetup.postAssessEnabled = true;
                    } else {
                        gotoEvalPostPage(true);
                    }
                }
            }

            if (HShell.contentSetup.post_type == 0) {
                if (HShell.contentSetup.have_post_a == true) {
                    if (!HShell.autoSetup.postAssessEnabled) {
                        $('#postAssessmentLaunchButtonContainer').show();
                        $('#postAssessmentLaunchButton').addClass('activated').uniClick(function () {
                            $('#hPageHeaderGrayBG').click();
                            goToPostAssessment();
                        });

                        if (allMods != 0 && allMods == finishedMods) {
                            showPostAssessmentQuestionPopUp();
                        }

                        if (getPostAssessmentQuizModulesList() == assessmentFinModules || HShell.savedData.completion_status == 'completed') {
                            $('#postAssessmentLaunchButton').addClass('finished').unbind('click').show();
                            $('#postAssessmentLaunchButtonContainer').show();
                            $('#postAssessmentLaunchButtonText').text(SL.UI.goToConfirmation).attr('data-languageitem', 'goToConfirmation');
                            $('#goToConfirmationDescription').addClass('shown');
                            gotoEvalPostPage(true);
                        }
                    }

                    HShell.autoSetup.postAssessEnabled = true;
                } else {
                    if (!$('#modulesListContainerOuter').hasClass('finished')) {
                        $('#mainContentContainer').hide();
                        buildOneBshellConfirmationNoPostAssessment();
                        $('#pEvalBshellConfirmReskin, #pEvalBshellConfirm').uniClick(function () {
                            if (HShell.contentSetup.enableDataSavings) SCORM.setCourseAsCompleated();

                            $(this).hide();
                            $('#pAllOkFinHomeBtnReskin, #pAllOkFinExitBtnReskin, #pAllOkFinHomeBtn, #pAllOkFinExitBtn').css('display', 'inline-flex');
                            $('.pEvalBshellContentContainer').addClass('hideProcentages');
                            $('.pEvalBshellRContent').html(SL.UI.thankYouDescriptionNoPostAssessment);

                            $('#hPageHHomeButton').show();
                            $('#pAllOkFinHomeBtnReskin, #pAllOkFinHomeBtnReskin').uniClick(function () {
                                $('#hPageHHomeButton').click();
                            });

                            $('#pAllOkFinExitBtnReskin, pAllOkFinExitBtn').uniClick(function () {
                                SCORM.saveItem('cmi.exit', 'suspend');
                                HShell.storage.commitData('immediate');
                                $('body').text('You have completed your training. You may close this window to finish this session.');
                                var scormVersion = pipwerks && pipwerks.SCORM ? pipwerks.SCORM.version || '2004' : '2004';
                                if(scormVersion == '2004') {
                                    SCORM.SCORMSetOneItem('cmi.success_status', "passed");
                                } else {
                                    SCORM.SCORMSetOneItem('cmi.core.lesson_status', "passed");
                                }
                                exitCourse();
                            });
                        });
                    }
                }
            }
        }

        if (allMods) $('#modulesListContainerOuter').addClass('finished');
    }
};

function showPostAssessmentQuestionPopUp() {
    var hasHeader = +HShell.content.configXMLObject.config.mainSettings.moduleSelect.header,
        html_closeButton,
        footerBtns;

    html_closeButton =  hasHeader?
        HShell.core.getComponent('Button').init({ id: 'popUpCloseReskin', text: SL.UI.close, classes: 'btnWrapper' })
        : '';

    footerBtns = '<div class="buttonsContainer">' +
                    HShell.core.getComponent('Button').init({ id: 'postAssessmentStartReskin', text: SL.UI.lable_start, classes: 'btnWrapper' }) +
                    html_closeButton +
                '</div>';

    var popUpFuncs = function () {
        $('.popBContentContainer').css({ padding: '30px 0px 30px 0px' });

        setTimeout(function () {
            $('#postAssessmentStartReskin').uniClick(function () {
                $('.Component_PopUp').remove();
                $('#postAssessmentLaunchButton').click();
            });

            $('#popUpCloseReskin').uniClick(function () {
                $('.Component_PopUp').remove();
                HShell.a11y.speak(SL.UI.courseComplete_ButtonPosition);
                HShell.a11y.autoSetup.postAssessmentButtonPositionExplained = true;
            });
        }, 400);
    };
    var courseCompleteText = SL.UI.courseComplete_Text;
    if (HShell.content.roleNoPreAssessment == true || HShell.contentSetup.have_pre_a == false) {
        courseCompleteText = SL.UI.courseComplete_TextNew;
    }
    $('#SCORM_Container').appendPopUp({
        title: SL.UI.lable_courseComplete,
        content: courseCompleteText,
        footer: footerBtns,
        func: popUpFuncs
    });
}


function getPostAssessmentQuizModulesList() {
    var role = HShell.userData.selected_role;
    var tempArr = new Array();

    var modulesIdList = new Array();
    $(SL.allModules).each(function (i, item) {
        modulesIdList.push(item.mod_id);
    });

    $(HShell.content.postAssessObj.XML).find('question').each(function () {
        var currentQuestionRolesContainSelectedRole = false;

        if ($(this).attr('roles') != 'all') {
            var currentQuestionRoles = $(this).attr('roles').split(',');
            for (var i in currentQuestionRoles) {
                if (currentQuestionRoles[i] == role) {
                    currentQuestionRolesContainSelectedRole = true;
                    break;
                }
            }
        }

        if (currentQuestionRolesContainSelectedRole || $(this).attr('roles') == 'all') {
            var haveModule = false;
            var thisItem = $(this);
            $(modulesIdList).each(function (i, item) {
                if (item == thisItem.parent().attr('module')) {
                    haveModule = true;
                }
            });

            if (haveModule) {
                if ($.inArray($(this).parent().attr('module'), tempArr) === -1) {
                    tempArr.push($(this).parent().attr('module'));
                }
            }
        }
    });

    return tempArr.length;
}

function expandNotifications() {
    $('.oneModuleItemContainer').not('.contentPassed.finished').find('.oneModuleNotificationButtonContainer').click();
    // $('.oneModuleItemContainer.finishedInPreA').find('.oneModuleNotificationButtonContainer').click();
}

function markModuleAsInProgress(moduleId, currLanguage) {
    var moduleItemContainer = $('.oneModuleItemContainer[moduleId="' + moduleId + '"]');
    var moduleProgressItem = $('.oneProgressItem[modId="' + moduleId + '"]');
    var module = HShell.content.getModuleById(moduleId);

    if(module.content_completion_status !== HShell.consts.completionStatus.completed){
        $(currLanguage.allModules).each(function (index, item) {
            if (item.mod_id == moduleId) {
                item.content_completion_status = 'incomplete';
                item.completion_status = 'incomplete';
                return false;
            }
        });

        moduleItemContainer.removeClass('notStarted quizPassed contentPassed finished')
            .addClass('started')
            .find('.oneModulePassButtonImg.iconHolder')
            // .html(HShell.consts.iconsObj.in_progress);
            .html(in_progress_icon);

        moduleProgressItem.addClass('inProgress');

        HShell.storage.commitData('immediate');

        restoreProgressFromArray();
        HShell.core.$emit('onModuleStatusChanged');
    }
}

// -------------------------------------------

HShell.content.getBrandsCountForSelectedLanguage = function () {
    var brandsNumber = 0;

    $(HShell.content.brandsArray).each(function (i, item) {
        if (item.label_text.hasOwnProperty(HShell.userData.selected_language)) {
            brandsNumber++;
        }
    });

    return brandsNumber;
};

// -------------------------------------------

HShell.content.setModuleContent_AsInProgress = function (mod_id) {
    var modules = HShell.content.getModuleArrForAllLanguages(mod_id),
        statuses = HShell.consts.completionStatus;

    modules.forEach(function (module) {
        if (module.content_completion_status !== statuses.completed) {
            module.content_completion_status = statuses.inProgress;
        }

        if (module.completion_status !== statuses.completed) {
            module.completion_status = statuses.inProgress;
        }
    });

    HShell.storage.commitData('immediate');
    HShell.core.$emit('Module__CompleationStatus--change', { mod_id: mod_id });
};

HShell.content.setModuleContent_AsCompleted = function(mod_id){
    var modules = HShell.content.getModuleArrForAllLanguages(mod_id),
        statuses = HShell.consts.completionStatus,
        hasQuiz = !!HShell.content.getModuleById(mod_id).quiz.length;

    modules.forEach(function (module) {
        module.content_completion_status = statuses.completed;

        if (!hasQuiz || module.quiz_completion_status === statuses.completed) {
            module.completion_status = statuses.completed;
        } else {
            module.completion_status = statuses.inProgress;
        }
    });

    HShell.storage.commitData('immediate');
    HShell.core.$emit('Module__CompleationStatus--change', { mod_id: mod_id });
};

HShell.content.setActiveModuleAsFinished = function () {
    HShell.content.selectModuleAsFinished(HShell.content.activeModule.id);
    HShell.core.$emit('activeModuleHasFinished');
};

HShell.content.setActiveModule = function (id, type) {
    HShell.content.activeModule = {
        id: id,
        type: type,
        isSelfCompleating: !!HShell.consts.selfCompleatingModulesTypes[type]
    };
};

// --- For the selected language only
HShell.content.getModuleById = function (mod_id) {
    var module,
        allMods = HShell.content.selected_languageObj.allModules;

    for (var i = 0; i < allMods.length; i++) {
        if (+allMods[i].mod_id === +mod_id) {
            module = allMods[i];
            break;
        }
    }

    return module;
};

HShell.content.getModuleFromLanguageById = function (lang, mod_id) {
    var module,
        allMods = lang.allModules;

    for (var i = 0; i < allMods.length; i++) {
        if (+allMods[i].mod_id === +mod_id) {
            module = allMods[i];
        }
    }

    return module;
};

HShell.content.getModuleArrForAllLanguages = function (mod_id) {
    var moduleArr = [],
        langArr = HShell.content.languageArray;

    for (var i = 0; i < langArr.length; i++) {
        var allMods = langArr[i].allModules;

        if(allMods){ // Some languages do not have any modules for specific roles
            for (var k = 0; k < allMods.length; k++) {
                if (+allMods[k].mod_id === +mod_id) {
                    moduleArr.push(allMods[k]);
                    break;
                }
            }
        }
    }

    return moduleArr;
};

HShell.content.getLanguageById = function(language_id){
    var language;

    HShell.content.languageArray.forEach(function(lang){
        if(lang.UI.code === language_id){
            language = lang;
        }
    });

    return language;
};

HShell.content.getAllModulesByType = function(type){
    var SL = HShell.content.selected_languageObj,
        allModules = SL.allModules,
        allModuleByType = [];

    type = type.toLowerCase();

    for(var i = 0; i < allModules.length; i++ ){
        if(allModules[i].type.toLowerCase() === type){
            allModuleByType.push(allModules[i]);
        }
    }

    return allModuleByType;
};
/**
 * @param {string} [languageCode] - the code for the language that you will want to get the modules. By default it will be set to the active language
*/
HShell.content.getAllModules = function(languageCode){
    var SL;

    if(languageCode){
        HShell.content.languageArray.forEach(function(language){
            if(language.UI.code === languageCode){
                SL = language;
            }
        });
    } else {
        SL = HShell.content.selected_languageObj;
    }

    return SL ? SL.allModules : undefined;
};

/**
 * @todo All groups must have ID, and that is what must be used to identify them, not the number in the array
 */
// --- For the selected language only
HShell.content.getModuleGroupById = function (group_id) {
    return HShell.content.selected_languageObj.modulesGroupArray[group_id];
};

/// <reference path="_references.js" />

var uniPlayObjectList = [];

function uniPlayFlashComunication(playerId, eventString, param) {
    for (var i = 0; i < uniPlayObjectList.length; i++) {
        if (uniPlayObjectList[i].playerId == playerId) {
            switch (eventString) {
                case 'syncTime':
                    if (uniPlayObjectList[i].subtitles) {
                        uniPlayObjectList[i].subtitlesObj.checkSubtitlesTime(param);			// --- Invoke the subtitles sync.
                        uniPlayObjectList[i].videoCurrentPosition = param;

                        if (Math.round(uniPlayObjectList[i].videoCurrentPosition) >= Math.round(uniPlayObjectList[i].videoLenght) &&
                            uniPlayObjectList[i].videoCurrentPosition != 0) {
                            uniPlayObjectList[i].onVideoFinish();
                        }
                        HShell.qaMode.playHeadMove();
                    }
                    if (uniPlayObjectList[i].hasInteractionPoints) {
                        if (!uniPlayObjectList[i].isIpActive) {
                            //trace('check for IP triggered');
                            var currentTime = HShell.autoSetup.activeVideo.videoCurrentPosition;
                            var interactionPoints = uniPlayObjectList[i].interactionPoints;
                            $(interactionPoints).each(function (index, ipObj) {
                                var activePointStart = Number($(ipObj).attr('pointStart')),
                                    activePointEnd = activePointStart + 1;

                                if (!HShell.autoSetup.activeVideo.paused &&
                                    (currentTime > activePointStart && currentTime < activePointEnd)) {

                                    buildAndShowIpContainer(index, HShell.autoSetup.activeVideo);
                                }
                            });
                        }
                    }

                    break;

                case 'totalLength':
                    uniPlayObjectList[i].videoLenght = param;
                    break;

                case 'init':
                    uniPlayObjectList[i].onReadyState();
                    if (HShell.userData.volume_level == 0) uniPlayObjectList[i].controlesContainer.find('.vidPopMuteBtn').click();
                    break;

                case 'seekPoints':
                    uniPlayObjectList[i].seekPoints = param;
                    HShell.qaMode.videoAddSeekPointsToIP();
                    break;
            }
        }
    }
}

function isIE() {
    var ua = window.navigator.userAgent; //Check the userAgent property of the window.navigator object
    var msie = ua.indexOf('MSIE '); // IE 10 or older
    var trident = ua.indexOf('Trident/'); //IE 11

    return (msie > 0 || trident > 0);
}

function uniPlay(isSlidesVideo, isLayoutsTemplateModule) {
    // ---  Vars
    var thisObj = this;
    this.videoURL = null;
    this.subtitlesURL = null;
    this.xmlDuration = null;
    this.videoContainer = null;
    this.onBeforeReadyState = function () { };
    this.onReadyState = function () { };
    this.onReadyStateParam = '';
    this.videoLoaded = false;
    this.forRemoval = false;

    this.subtitles = false;
    this.subtitlesContainer = null;

    this.hasInteractionPoints = false;

    this.controlesContainer = null;

    this.subtitlesArray = [];				// --- 2 dimensional Array, Second dimension is [0]: start time | [1]: end time | [2]: Subtitle content
    this.subtitlesObj = {};					// --- The object that creates the subtitles
    this.autoPlay = true;
    this.paused = false;
    this.muteOn = HShell.userData.volume_level == 0 ? true : false;
    this.onVideoFinish = function () { };
    this.playerId = Math.round(Math.random() * 100000);
    this.videoLenght = 0;
    this.videoCurrentPosition = 0;
    this.idInActiveVideoArray = HShell.autoSetup.activeVideoArray.length;
    this.isSlidesVideo = isSlidesVideo;
    this.isLayoutsTemplateModule = isLayoutsTemplateModule;

    // UI
    this.progressBar = null;

    this.videoH = 180;
    this.videoW = 320;

    this.subtitlesRefreshRate = 300;				// In milliseconds

    this.ipRefreshRateNormal = 1000;
    this.ipRefreshRateFast = 30;
    this.ipIntervalNormal = null;
    this.ipIntervalFast = null;
    this.isIpActive = false; // used only in flash player

    this.currentSubId = 0;

    this.isFeedbackVideo = false;
    
    /* Handling the old state of video speed to maintain it also on the next video. */
    // setTimeout(function () {
    //     if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Windows Phone|iemobile|Opera Mini/i.test(navigator.userAgent) == false && isIE() == false)
    //     {
            // var speed = 1;
            // if (localStorage.getItem("videoSpeed") != null && $("#SCORM_Container").attr("data-location") != "tutorial") {
            //     speed = localStorage.getItem("videoSpeed"); // Getting the value from localStorage.
            // }
            
            // document.querySelector('video').playbackRate = speed; // Setting the value to video element.
            
                
            /*** Desktop. ***/
            // $("#vidSpeedControlContainer a").removeClass("active"); // Remove all active items.
            
            /* Handling the control bar. */
            // if (speed == 1)
            //     $(".vidSpeedControl:contains('Normal')").addClass("active");
            // else if (speed == 1.7)
            //     $(".vidSpeedControl:contains('2.0')").addClass("active");
            // else
            //     $( ".vidSpeedControl:contains('" +  speed + "')").addClass("active");
        // }
        

        // MOBILE
        // Setting the label to assign to the HTML elements.
        /*var labelSpeed = speed;
        if (speed == "1") // Normal
            labelSpeed = "Normal";
        else if (speed == "1.25") // 1.25
            labelSpeed = "1.25";
        else if (speed == "1.5") // 1.5
            labelSpeed = "1.5";
        else if (speed == "1.7") // 2.0
            labelSpeed = "2.0";
        
        // Update speed.
        var newNextSpeed;
        if (speed == "1")
            newNextSpeed = "1.25";
        else if (speed == "1.25")
            newNextSpeed = "1.5";
        else if (speed == "1.5")
            newNextSpeed = "1.7";
        else if (speed == "1.7")
            newNextSpeed = "1";

        $(".vidSpeedControlMobile").html(labelSpeed);
        $(".vidSpeedControlMobile").data('nextspeed', newNextSpeed);*/
    // }, 3000);
   


    // ________________________________________________________________________________________________________________________________
    // --- Functions
    var _idInActiveVideoArray = this.idInActiveVideoArray;
    this.initVideoPlayer = function () {
        if (this.subtitlesURL != null) {
            this.subtitles = true;
        }

        if (typeof thisObj.interactionPoints != 'undefined' && thisObj.interactionPoints.length > 0) {
            this.hasInteractionPoints = true;
        }

        if ($('body').hasClass('iOS')) {
            window.subtitlesContainer = null;
        }
        this.videoContainer.on('remove', function () { // --- Removes tfhe item form 'activeVideoArray' on remove of the element;
            HShell.autoSetup.activeVideoArray.splice(_idInActiveVideoArray, 1);
            if (thisObj.flashVideo) {
                thisObj.flashVideo.vid_stop();
                thisObj.flashVideo.vid_remove();
            }
        });
    };

    // ________________________________________________________

    this.buildVideoPlayer = function () {
        this.initVideoPlayer();

        thisObj.videoContainer.append('<div class="uniPlayContaienr uniPlayerContainer' + thisObj.playerId + '"></div>');
        var styleVid = 'height:' + thisObj.videoH + '; width:100%;';
        //; margin-top:' + (550 - thisObj.videoH) / 2.5 + 'px';       // --- 550 is the height of the container
        var controles = ""; if (HShell.globalSetup.devMode) controles = ' controls="controls"';

        var html = "";
        if(thisObj.isLayoutsTemplateModule) {
            window.activeVideoPlayerMethod = HShell.consts.videoPlayerMethod.html5Video;
        } else {
            window.activeVideoPlayerMethod = selectVideoPlayerMethod();
        }
        switch (window.activeVideoPlayerMethod) {
            case HShell.consts.videoPlayerMethod.flash:
                // --- Flash Player
                thisObj.videoContainer.addClass('videoFlash');

                html += '<div class="flashCover"></div>';	// --- This div is here just to prevent the focus of the browser to go to the flash when the user clicks on the video
                // --- The classId attribute (below) is there for IE 9/8 and 7 support. It dose not work without it
                html += '<object tabindex="-1" width="' + thisObj.videoW + '" height="' + thisObj.videoH + '" style="' + styleVid + '" type="application/x-shockwave-flash"  id="uniPlayFlash' + thisObj.playerId + '" data="js/uniPlay.swf" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" class="uniPlayFlash">';
                html += '<param name="allowFullScreen" value="true" />';
                html += '<param name="FlashVars" VALUE="videoURL=' + thisObj.videoURL + '&autoPlay=' + thisObj.autoPlay + '&playerId=' + thisObj.playerId + '&loadingText=' + SL.UI.lable_loading + '&mutedParam=' + HShell.userData.volume_level + '"/>';
                html += '<param name="movie"	value="js/uniPlay.swf" />';
                html += '<param name="menu"		value="false" />';
                html += '<param name="scale"	value="default"/>';
                html += '<param name="wmode"	value="transparent"/>';
                html += '<param name="bgcolor"	value="#000000" />';
                html += '</object>';

                $('.uniPlayerContainer' + thisObj.playerId).append(html);

                // thisObj.videoContainer.find('.uniPlayContaienr').append(this.subtitlesContainer);
                thisObj.flashVideo = document.getElementById('uniPlayFlash' + thisObj.playerId);
                if (thisObj.subtitles) { thisObj.subtitlesObj.buildSubtitles(); }

                thisObj.onBeforeReadyState();

                thisObj.videoContainer.removeClass('loading');
                var activeVideo = thisObj.isSlidesVideo ? 
                    HShell.autoSetup.activeVideo :
                    HShell.autoSetup.activeVideoArray[thisObj.idInActiveVideoArray];
                enablePlayControlles(thisObj.controlesContainer, activeVideo);

                thisObj.videoLoaded = true;
                thisObj.videoContainer.on('remove', function () { thisObj.removePlayer(); });
                break;

            case HShell.consts.videoPlayerMethod.blob:			// --- Blob Video Tag
                var autoplayAttr = ''; if (thisObj.autoPlay) autoplayAttr = "autoplay";

                $('.uniPlayerContainer' + thisObj.playerId).append(buildPreloader(500).html);
                thisObj.onBeforeReadyState();

                var oReq = new XMLHttpRequest();
                oReq.open("GET", thisObj.videoURL, true);
                oReq.onloadstart = function () {
                    $('.vidPopClose').on('click', function () {
                        oReq.abort();
                    });
                };
                oReq.responseType = "blob";

                oReq.onprogress = function (e) {
                    var procentage = (e.loaded / e.total) * 100;
                    $(".uniPlayerContainer" + thisObj.playerId + ' #preloaderBarInner').css('width', procentage + "%");

                    if ($('#preloaderBarInner').length == 0) oReq.abort();
                };
                oReq.onload = function (oEvent) {
                    if (oReq.response) {
                        var htm = "";
                        if (HShell.autoSetup.runOn.deviceName == "ipad") {
                            htm += '<div class="videoOverlayButtonContainer abs videoOverlayPlayButtonContainer"> ';
                            htm +=  '<span class="vAlignHelper"></span>';
                            htm +=      '<div class="videoOverlayButtonBgContainer">';
                            htm +=          '<div class="videoOverlayButtonBG iconHolder playIcon">' + HShell.consts.iconsObj.icon_Play + '</div>';
                            htm +=      '</div>';
                            htm += '</div>';
                        }

                        htm += '<video class="uniPlayHtml" src="' + window.URL.createObjectURL(oReq.response) + '" width="' + thisObj.videoW + '" height="' + thisObj.videoH + '" id="uniPlayHtml' + thisObj.playerId + '" ' + autoplayAttr + ' ' + controles + ' playsinline="true" tabindex="-1">';
                        thisObj.autoPlay = false;

                        htm += '</video>';

                        $('.uniPlayerContainer' + thisObj.playerId).append(htm);
                        thisObj.htmlVideo = document.getElementById('uniPlayHtml' + thisObj.playerId);
                        if (HShell.autoSetup.runOn.deviceName == "iphone") {
                            window.makeVideoPlayableInline(thisObj.htmlVideo);
                            thisObj.htmlVideo.play();
                        }

                        // --- In case that the server is streaming the video, and we do not have the duration from the meta-data, we are taking it from the "content.XML"

                        /**
                         * @todo Must be cleared at some point else it will stay till forever
                         */
                        var tempInt = setInterval(function () {
                            try {
                                thisObj.videoCurrentPosition = thisObj.htmlVideo.currentTime;
                                if (String(HShell.autoSetup.activeVideo.videoContainer) == 'undefined') clearInterval(tempInt);
                            } catch (e) {
                                clearInterval(tempInt);
                            }
                        }, HShell.consts.videoCheckFreq);

                        var durationTest = setInterval(function () {
                            if ($(thisObj.videoContainer).length) {
                                thisObj.videoLenght = thisObj.htmlVideo.duration;

                                if (!isNaN(thisObj.videoLenght)) {
                                    thisObj.videoContainer.removeClass('loading');
                                    thisObj.onReadyState();
                                    //try {				// |rework| if this thing did not blow up, pleas remove it (changed 13.09.2016) if more than 3 months are passed since, remove this "try catch"
                                    if (HShell.userData.volume_level != 10) {
                                        HShell.autoSetup.activeVideo.mute();
                                    }
                                    //} catch (e) {	console.log(e) }

                                    thisObj.videoLoaded = true;
                                    videoIsLoaded();

                                    if (thisObj.subtitles) { thisObj.subtitlesObj.buildSubtitles(); }
                                    if (thisObj.hasInteractionPoints) { thisObj.buildInteractionPoints(); }

                                    // thisObj.videoContainer.find('.uniPlayContaienr').append(thisObj.subtitlesContainer);
                                    $('.videoOverlayButtonContainer').show();
                                    $('.videoOverlayButtonContainer').uniClick(function () { $('.vidPopPlayBtn').click(); });
                                    $('.vidPopPlayBtn').click(function () { $('.videoOverlayButtonContainer').remove(); });			// --- Sort of a stupid way of doing it, but i have no time for better
                                    $('.preloaderContainer').remove();
                                    var activeVideo = thisObj.isSlidesVideo ? 
                                        HShell.autoSetup.activeVideo :
                                        HShell.autoSetup.activeVideoArray[thisObj.idInActiveVideoArray];
                                    enablePlayControlles(thisObj.controlesContainer, activeVideo);
                                    clearInterval(durationTest);
                                    if (String(HShell.autoSetup.activeVideo.videoContainer) != 'undefined') clearInterval(durationTest);
                                    thisObj.videoContainer.on('remove', function () { thisObj.removePlayer(); });
                                }
                            } else {
                                clearInterval(durationTest);
                            }
                        }, 100);
                    }
                };
                oReq.send(null);

                break;

            case HShell.consts.videoPlayerMethod.html5Video:
                // --- Standard HTML5 video tag
                html += '<div class="videoLoading" aria-live="polite">';
                html += '<div aria-live="polite" class="videoLoadingText">' + SL.UI.lable_loading + '&nbsp;</div>';
                html += '<b id="videoLoadingDots" aria-hidden="true">&nbsp;&nbsp;&nbsp;</b>';
                html += '</div>';
                html += '<video class="uniPlayHtml" playsinline="true" width="' + thisObj.videoW + '" height="' + thisObj.videoH + '" id="uniPlayHtml' + thisObj.playerId + '" auto ' + autoplayAttr + ' preload="auto" ' + controles + ' tabindex="-1">';
                html += '<source src="' + thisObj.videoURL + '" type="video/mp4"/>';
                html += 'Your browser does not support the video tag.';				// Must be improved
                html += '</video>';
                $('.uniPlayerContainer' + thisObj.playerId).append(html);

                animateLoadingText();
                // thisObj.videoContainer.find('.uniPlayContaienr').append(this.subtitlesContainer);
                thisObj.htmlVideo = document.getElementById('uniPlayHtml' + thisObj.playerId);
                thisObj.videoContainer.on('remove', function () { thisObj.removePlayer(); });
                if (thisObj.autoPlay) thisObj.htmlVideo.play();
                if (thisObj.subtitles) { thisObj.subtitlesObj.buildSubtitles(); }
                if (thisObj.hasInteractionPoints) {
                    thisObj.buildInteractionPoints();
                }

                thisObj.onBeforeReadyState();

                try {
                    (function checkLoad() {
                        if (!thisObj.forRemoval) {
                            if (thisObj.htmlVideo.readyState === 4) {
                                thisObj.videoContainer.removeClass('loading');
                                thisObj.videoContainer.removeClass('loading').find('.videoLoading').hide();

                                thisObj.videoLenght = thisObj.htmlVideo.duration;
                                // --- In case that the server is streaming the video, and we do not have the duration from the meta-data, we are taking it from the "content.XML"
                                if (thisObj.videoLenght == "Infinity" && thisObj.xmlDuration) {
                                    thisObj.videoLenght = HShell.utils.converTimeToSeconds(thisObj.xmlDuration);
                                }
                                /**
                                 * @todo  Must be cleared at some point else it will stay till forever
                                 */
                                setInterval(function () {
                                    thisObj.videoCurrentPosition = thisObj.htmlVideo.currentTime;
                                }, HShell.consts.videoCheckFreq);
                                var activeVideo = thisObj.isSlidesVideo ? 
                                    HShell.autoSetup.activeVideo :
                                    HShell.autoSetup.activeVideoArray[thisObj.idInActiveVideoArray];
                                enablePlayControlles(thisObj.controlesContainer, activeVideo);
                                thisObj.onReadyState();
                                thisObj.videoLoaded = true;
                                videoIsLoaded();
                            } else {
                                setTimeout(checkLoad, 100);
                            }
                        }
                    })();
                } catch (e) {
                    HShell.utils.trace('"videoContainer" most likely is not specified: ' + e, 'uniPlay');
                }
                break;
        }

        if (!thisObj.autoPlay || HShell.autoSetup.runOn.OS == "iOS") {
            thisObj.paused = true; thisObj.controlesContainer.find('.vidPopPlayBtn').addClass('paused');
        }	// --- initiates the player in paused mode

        // --- (Accessibility) This is just so aria live region is triggered
        if (window.activeVideoPlayerMethod != 1) {
            setTimeout(function () { thisObj.videoContainer.find('.videoLoadingText').html(thisObj.videoContainer.find('.videoLoadingText').html()); }, 1000);
        }

        if (thisObj.htmlVideo) {
            $(thisObj.htmlVideo).bind('contextmenu', function (e) {
                e.preventDefault();
            });
        }
    };

    function animateLoadingText() {
        var dotsNumber = 0;
        var tempStr = '', tempStrDots = '';

        var interval = setInterval(function () {
            if (thisObj.videoLoaded) {
                clearInterval(interval);
                thisObj.videoContainer.find('.videoLoading').html('');
            }
            if (dotsNumber != 3) {
                dotsNumber++;
                tempStr = Array(4 - dotsNumber).join("&nbsp;");
                tempStrDots = Array(dotsNumber + 1).join(".");
                thisObj.videoContainer.find('#videoLoadingDots').html(tempStrDots + tempStr);
            } else {
                dotsNumber = 0;
                thisObj.videoContainer.find('#videoLoadingDots').html('&nbsp;&nbsp;&nbsp;');
            }
        }, 400);
    }

    // |unused|
    //function enableAllControlls() { // Removed at some point since some of the designers (do not remember the exact one) decided that it is useless
    //    if (thisObj.progressBar) {
    //        try {
    //            var progressBarSync = setInterval(function () {
    //                var newWidth = 0;
    //                newWidth = thisObj.htmlVideo.currentTime / thisObj.htmlVideo.duration;
    //                thisObj.progressBar.finish().animate({ width: (newWidth * 450) + 'px' });
    //            }, 300);
    //        } catch (e) { }

    //        thisObj.progressBar.on('remove', function () {
    //            clearInterval(progressBarSync);
    //        });
    //    }
    //}

    // -------- Subtitles ----------
    thisObj.subtitlesObj.buildSubtitles = function () {
        if (thisObj.subtitlesURL.length > 15) {          // --- if there is no subtitles, the string will look like something like this: "content/en/"
            try {
                $.ajax({
                    url: thisObj.subtitlesURL + "?" + String(Math.random()),
                    dataType: "text",
                    success: function (data) {
                        makeSubsToArray(data);
                        var subtitlesInterval;
                        if (!HShell.autoSetup.oldIE) {
                            subtitlesInterval = setInterval(function () {
                                try {
                                    thisObj.subtitlesObj.checkSubtitlesTime(thisObj.htmlVideo.currentTime);
                                    if (Math.round(thisObj.htmlVideo.currentTime) >= Math.round(thisObj.htmlVideo.duration)) {
                                        thisObj.onVideoFinish();
                                    }
                                    //interactionPointsCheckAndCreateWhenNeeded(thisObj);
                                } catch (e) {
                                    clearInterval(subtitlesInterval);
                                    HShell.utils.trace('Subtitles loading problem, details: ' + e, 'uniPlay');
                                }
                            }, thisObj.subtitlesRefreshRate);
                        }
                        // --- Prevents the interval to continue after the video player is destroyed ( after the subtitles Container to be exact )
                        thisObj.subtitlesContainer.on('remove', function () {
                            clearInterval(subtitlesInterval);
                        });
                    }
                });
            } catch (e) { console.log('Err: '); console.log(e); }
        }

        function makeSubsToArray(data) {
            var startTime = '',
                endTime = '',
                subText = '';

            var tempData = data,
                currentSubNumber = 1,
                tempText = '';

            while (tempData.length > 10) {
                var tempArr;

                tempText = tempData.slice(tempData.indexOf('\n' + currentSubNumber), tempData.indexOf('\n' + Number(currentSubNumber + 1)));
                tempData = tempData.slice(tempData.indexOf('\n' + Number(currentSubNumber + 1)), tempData.length);
                tempText = tempText.slice(tempText.indexOf('\n', 2), tempText.length);
                subText = tempText.slice(tempText.indexOf('\n', 2), tempText.length);
                tempText = tempText.slice(0, tempText.indexOf('\n', 2));

                startTime = tempText.slice(0, tempText.indexOf(' ')).replace(/(\r\n|\n|\r)/gm, "");
                startTime = startTime.replace(',', '.');
                tempArr = startTime.split(":");
                startTime = 3600 * Number(tempArr[0]) + 60 * Number(tempArr[1]) + Number(tempArr[2]);

                endTime = tempText.slice(tempText.indexOf('> ') + 2, tempText.length).replace(/(\r\n|\n|\r)/gm, "");
                endTime = endTime.replace(',', '.');
                tempArr = endTime.split(":");
                endTime = 3600 * Number(tempArr[0]) + 60 * Number(tempArr[1]) + Number(tempArr[2]);

                thisObj.subtitlesArray.push([startTime, endTime, subText]);
                currentSubNumber++;
            }
        }
    };

    thisObj.buildInteractionPoints = function () {
        var nextIp;
        var isInnerIntervalActive = false;
        thisObj.ipIntervalNormal = setInterval(function () {
            if (!isInnerIntervalActive && !HShell.autoSetup.activeVideo.paused) {
                HShell.utils.trace('IP normal interval (' + thisObj.ipRefreshRateNormal + 'ms)');
                nextIp = getNextIpIndexAndTime(thisObj);
                if (typeof nextIp != 'undefined') {
                    if (nextIp.time >= 0 && nextIp.time <= 150 / 1000) { // if there are 150ms or less until the next ip, show it
                        isInnerIntervalActive = false;
                        buildAndShowIpContainer(nextIp.index, thisObj);
                        clearInterval(thisObj.ipIntervalFast);
                    } else if (nextIp.time <= thisObj.ipRefreshRateNormal / 1000) { // if there are less than thisObj.ipRefreshRateNormal (1000ms for now) activate faster checks (50ms)
                        isInnerIntervalActive = true;
                        thisObj.ipIntervalFast = setInterval(function () {
                            HShell.utils.trace('IP fast interval (' + thisObj.ipRefreshRateFast + 'ms)');
                            nextIp = getNextIpIndexAndTime(thisObj);
                            if (typeof nextIp != 'undefined') {
                                HShell.utils.trace(nextIp.time);
                                if (nextIp.time <= 150 / 1000) { // if there are 150ms or less until the next ip, show it
                                    buildAndShowIpContainer(nextIp.index, thisObj);
                                    isInnerIntervalActive = false;
                                    clearInterval(thisObj.ipIntervalFast);
                                }
                            } else {
                                isInnerIntervalActive = false;
                                clearInterval(thisObj.ipIntervalFast);
                            }
                        }, thisObj.ipRefreshRateFast);
                    }
                }
            }
        }, thisObj.ipRefreshRateNormal);
    };

    // --- Sync the subtitles
    thisObj.subtitlesObj.checkSubtitlesTime = function (time) {
        try {
            if (Number(thisObj.subtitlesArray[thisObj.currentSubId][1]) < time) {
                thisObj.subtitlesContainer.empty();
            }
        } catch (e) {
            HShell.utils.trace(e + ' - 7.videoPlayer');
        }
        for (var i = 0; i < thisObj.subtitlesArray.length; i++) {
            if (Number(thisObj.subtitlesArray[i][0]) <= time && Number(thisObj.subtitlesArray[i][1]) > time && (i != thisObj.currentSubId || i == 0) && time != 0) {
                thisObj.currentSubId = i;
                thisObj.subtitlesContainer.html('<div class="subsText">' + thisObj.subtitlesArray[i][2] + '</div>').show();
                break;
            }
        }
    };

    // ----------- End of 'Subtitles' ---------

    thisObj.removePlayer = function () {
        HShell.utils.trace('player removed');
        if (thisObj.ipIntervalNormal) {
            clearInterval(thisObj.ipIntervalNormal);
        }
        if (thisObj.ipIntervalFast) {
            clearInterval(thisObj.ipIntervalFast);
        }
        if (thisObj.subtitlesContainer) {
            thisObj.subtitlesContainer.remove();
        }
        if (thisObj.progressBar) {
            thisObj.progressBar.remove();
        }

        for (var i = 0; i < uniPlayObjectList.length; i++) {
            if (uniPlayObjectList[i].playerId == thisObj.playerId) {
                if (thisObj.flashVideo) {
                    thisObj.flashVideo.vid_remove();
                }
                delete thisObj;
                uniPlayObjectList.splice(i, 1);
            }
        }
    };

    uniPlayObjectList.push(this);
}


function selectVideoPlayerMethod() {
    return 2;
    var option = 0;		// --- 0: Flash | 1: Blob + HTML5 video tag | 2: Html5 video tag
    var rO = HShell.autoSetup.runOn;

    if (rO.browserName == "IE" && rO.deviceType == "desktop") {
        if (window.ieVersion.actingVersion >= 9) {
            option = 2;
        } else {
            option = 0;
        }
    } else if (rO.browserName == "safari" || rO.browserName == "chrome") {
        option = 1;
    } else if (rO.browserName == "firefox" || (rO.browserName == "IE" && rO.formFactor == "phone")) {
        option = 2;
    }

    return option;
}

// ________________________________________________________

// ---- Adding player controls
uniPlay.prototype.play = function () {
    if (selectVideoPlayerMethod() == HShell.consts.videoPlayerMethod.flash) {
        if ($('#hiddenAudioElement').length > 0 && typeof $('#hiddenAudioElement')[0].audio_stop === 'function') {
            $('#hiddenAudioElement')[0].audio_stop();
        }
        if ($('#ipAudio').length > 0) {
            $('#ipAudio')[0].audio_stop();
        }
    } else {
        if (typeof HShell.courseSpecific.content.moduleEndAudio != 'undefined' &&
            !isNaN(HShell.courseSpecific.content.moduleEndAudio.duration)) {
                HShell.courseSpecific.content.moduleEndAudio.pause();
                HShell.courseSpecific.content.moduleEndAudio.currentTime = 0;
        }
        if ($('#ipAudio').length > 0) {
            $('#ipAudio')[0].pause();
            $('#ipAudio')[0].currentTime = 0;
        }
    }

    if (this.flashVideo) {
        if ((HShell.autoSetup.activeVideo.videoCurrentPosition + 1) >= HShell.autoSetup.activeVideo.videoLenght) { // video is finished
            this.flashVideo.vid_stop();
        }

        this.flashVideo.vid_play();
    }
    if (this.htmlVideo) {
        if ((this.htmlVideo.currentTime + 1) > this.htmlVideo.duration) {			// --- If the video is ended, when pressing the play button it will restart it.
            this.htmlVideo.currentTime = 0;
        }
        this.htmlVideo.play();
    }
    this.paused = false;
    blinkControlls();
};

uniPlay.prototype.pause = function () {
    if (this.flashVideo) {
        this.flashVideo.vid_pause();
    }
    if (this.htmlVideo) {
        this.htmlVideo.pause();
    }
    $('.vidPopPlayBtn').addClass('paused');
    this.paused = true;
};

uniPlay.prototype.stop = function () {
    if (this.flashVideo) {
        this.flashVideo.vid_stop();
    }
    if (this.htmlVideo) {
        this.htmlVideo.pause();
        this.htmlVideo.currentTime = 0.01;
        if (HShell.autoSetup.runOn.OS === 'iOS') {
            this.htmlVideo.newTime = 0.01;
            $(this.htmlVideo).trigger('timeupdate');
        }
    }
    $('.vidPopPlayBtn').addClass('paused');
    this.paused = true;
};

uniPlay.prototype.back = function () {
    if (this.flashVideo) {
        this.flashVideo.vid_back();
    }
    if (this.htmlVideo) {
        this.htmlVideo.pause();
        if (HShell.autoSetup.runOn.OS === 'iOS') {
            this.htmlVideo.newTime = this.htmlVideo.currentTime - 5;
            $(this.htmlVideo).trigger('timeupdate');
        } else {
            this.htmlVideo.currentTime += -5;
        }

        // --- The next awesome piece of code is brought to you by the great CSS parser of IE11 on WP
        if (HShell.autoSetup.runOn.OS === 'windowsPhone') {
            $('.uniPlayContaienr video').css('height', '1px');
            setTimeout(function () {
                $('.uniPlayContaienr video').css('height', '');
            }, 20);
        }
    }

    $('.vidPopPlayBtn').removeClass('paused');

    if (selectVideoPlayerMethod() == HShell.consts.videoPlayerMethod.flash) {
        if ($('#hiddenAudioElement').length > 0 && typeof $('#hiddenAudioElement')[0].audio_stop === 'function') {
            $('#hiddenAudioElement')[0].audio_stop();
        }
    } else {
        if (typeof HShell.courseSpecific.content.moduleEndAudio != 'undefined' &&
            !isNaN(HShell.courseSpecific.content.moduleEndAudio.duration)) {
            HShell.courseSpecific.content.moduleEndAudio.pause();
            HShell.courseSpecific.content.moduleEndAudio.currentTime = 0;
        }
    }
    blinkControlls();
};

// ---- |rework| if i remember this is done because of the way how the WP handles some of the css values, by hiding, waiting for 10ms and showing again, we are forcing the engine to re-render the css with the correct values. If you can not find any descent replacement of the hide/show solution, at least wrap this in a "if", that will cover this only for WP. Please test on other devices as well, since the fact that this is only WP is just something that I remember, and i am not 100%
function blinkControlls() {
    if (HShell.autoSetup.runOn.OS === 'windowsPhone' || HShell.autoSetup.runOn.OS === 'iOS') {
        $('.vidPopPlayBtn').parent().hide();
        setTimeout(function () {
            $('.vidPopPlayBtn').parent().show();
        }, 10);
    }
}

uniPlay.prototype.mute = function (param) {
    switch (param) {
        case 'mute': muteMe(this); break;
        case 'unMute': unMuteMe(this); break;
        default:
            if (!this.muteOn) {
                muteMe(this);
            } else {
                unMuteMe(this);
            }
    }

    function muteMe(This) {
        This.muteOn = true;
        if (This.flashVideo) {
            This.flashVideo.vid_mute('mute');
        }
        if (This.htmlVideo) {
            $(This.htmlVideo).prop('muted', true);
        }
    }

    function unMuteMe(This) {
        This.muteOn = false;
        if (This.flashVideo) {
            This.flashVideo.vid_mute('unMute');
        }
        if (This.htmlVideo) {
            $(This.htmlVideo).prop('muted', false);
        }
    }
};

// ________________________________________________________

function videoIsLoaded() {
    if (HShell.userData.volume_level != 10) {
        if (HShell.autoSetup.activeVideo.htmlVideo) {
            HShell.autoSetup.activeVideo.mute('mute');
        } else {
            setTimeout(function () {				// --- |rework| this timeout is here because we are waiting for the SWF file to load. It is very stupid, because nothing can be sure, but it work. .... for now // old comment: There is some small delay in the flash player video loading, it is around 20-30 ms, but 300 is just on the safe side
                HShell.autoSetup.activeVideo.mute('mute');
            }, 300);
        }
    }
    HShell.core.$emit('VideoIsLoaded');
}

// ________________________________________________________

function enablePlayControlles(controlesContainer, videoPlayer) {
    if (String(controlesContainer) == 'undefined') {
        controlesContainer = $('body');
    }
    HShell.utils.scrollTopMainContainer();

    //buttons not working with aria-label on windows with jaws
    //voice over doesn't read the name atribute
    if (HShell.autoSetup.runOn.OS === 'iOS') {
        $('.vidPopBackBtn').attr('aria-label', SL.UI.label_rewind);
        $('.vidPopPlayBtn').attr('aria-label', SL.UI.label_play);
        $('.vidPopStopBtn').attr('aria-label', SL.UI.label_stop);
        $('.vidPopMuteBtn').attr('aria-label', HShell.userData.volume_level == 10 ? SL.UI.label_mute : SL.UI.label_unMute);
        $('.vidPopSubtitles').attr('aria-label', HShell.userData.prefer_subtitles ? SL.UI.lable_subtitles_disable : SL.UI.lable_subtitles_enable);
    
        setTimeout(function () {
            if (videoPlayer.htmlVideo && !videoPlayer.htmlVideo.paused && !videoPlayer.htmlVideo.ended) {
                $(videoPlayer.htmlVideo).closest('.vidPopVideoContainer').find('.vidPopPlayBtn').removeClass('paused');
            }
        }, 10);
    }

    controlesContainer.find('.vidPopPlayBtn').uniClick(function () {
        // if (/IEMobile|Windows Phone/i.test(navigator.userAgent) == true || isIE() == true)
        // { // On IE11 set speed always on "Normal".
        //     var speed = 1;
        //     document.querySelector('video').playbackRate = speed; // Setting the value to video element.
        //     $("#vidSpeedControlContainer a").removeClass("active"); // Remove all active items.
        //     $(".vidSpeedControl:contains('Normal')").addClass("active");
		// 	newNextSpeed = "1.2";
        //     $(".vidSpeedControlMobile").html("1.0");
        //     $("#vidSpeedControlContainerMobile").data('nextspeed', newNextSpeed);
        // }

        if (!$(this).hasClass('disabled')) {
            if (videoPlayer.paused) {
                videoPlayer.play();
                $(this).removeClass('paused');

                var currentNameAttr = $(this).attr('name');
                var newNameAttr = currentNameAttr.replace(SL.UI['label_play'], SL.UI['label_pause']); 
                $(this).attr('name', newNameAttr);

                $(this).find('.toolTipInnerContainer').html(SL.UI.label_pause).parent().parent()
                    .attr('name', SL.UI.label_pause + ': control + alt + K');

                if (HShell.autoSetup.runOn.OS === 'iOS') {
                    $(this).find('.toolTipInnerContainer').html(SL.UI.label_play).parent().parent()
                        .attr('aria-label', SL.UI.label_pause);
                }

            } else {
                videoPlayer.pause();
                $(this).addClass('paused');

                var currentNameAttr = $(this).attr('name');
                var newNameAttr = currentNameAttr.replace(SL.UI['label_pause'], SL.UI['label_play']); 
                $(this).attr('name', newNameAttr);

                $(this).find('.toolTipInnerContainer').html(SL.UI.label_play).parent().parent()
                    .attr('name', SL.UI.label_play + ': control + alt + K');

                if (HShell.autoSetup.runOn.OS === 'iOS') {
                    $(this).find('.toolTipInnerContainer').html(SL.UI.label_play).parent().parent()
                        .attr('aria-label', SL.UI.label_play);
                }
            }
        }
    });

    if (videoPlayer.htmlVideo) {
        videoPlayer.htmlVideo.onpause = function () {
            videoPlayer.pause();
            var $playPauseBtn = $(videoPlayer.htmlVideo).closest('.vidPopVideoContainer').find('.vidPopPlayBtn');
            if ($playPauseBtn.length == 0) {
                $playPauseBtn = $('.vidPopPlayBtn');
            }
            $playPauseBtn.addClass('paused').find('.toolTipInnerContainer').html(SL.UI.label_play).parent().parent()
                .attr('name', SL.UI.label_play + ': control + alt + K');
            $playPauseBtn.attr('name', SL.UI.label_play + ': control + alt + K');

            if (HShell.autoSetup.runOn.OS === 'iOS') {
                $(this).find('.toolTipInnerContainer').html(SL.UI.label_play).parent().parent()
                    .attr('aria-label', SL.UI.label_play);
            }
        };
        videoPlayer.htmlVideo.onplay = function () {
            videoPlayer.play();
            var $currentVideoContainer = $(videoPlayer.htmlVideo).closest('.vidPopVideoContainer');
            var $playPauseBtn = $currentVideoContainer.find('.vidPopPlayBtn');

            if ($playPauseBtn.length == 0) {
                $playPauseBtn = $('.vidPopPlayBtn');
            }
            $playPauseBtn.removeClass('paused').find('.toolTipInnerContainer').html(SL.UI.label_pause).parent().parent()
                .attr('name', SL.UI.label_pause + ': control + alt + K');
            $playPauseBtn.attr('name', SL.UI.label_pause + ': control + alt + K');

            if (HShell.autoSetup.runOn.browserName == 'IE') {
                var selectedSpeed = $currentVideoContainer.find('.vidSpeedControl.active').data('speed');
                $currentVideoContainer.find('video').get(0).playbackRate = selectedSpeed;
            }

            if (HShell.autoSetup.runOn.OS === 'iOS') {
                $(this).find('.toolTipInnerContainer').html(SL.UI.label_play).parent().parent()
                    .attr('aria-label', SL.UI.label_pause);
            }
        };
    }

    controlesContainer.find('.vidPopStopBtn').uniClick(function () {
        // if (/IEMobile|Windows Phone/i.test(navigator.userAgent) == true || isIE() == true)
        // { // On IE11 set speed always on "Normal".
        //     var speed = 1;
        //     document.querySelector('video').playbackRate = speed; // Setting the value to video element.
        //     $("#vidSpeedControlContainer a").removeClass("active"); // Remove all active items.
        //     $(".vidSpeedControl:contains('Normal')").addClass("active");
		// 	newNextSpeed = "1.2";
        //     $(".vidSpeedControlMobile").html("1.0");
        //     $("#vidSpeedControlContainerMobile").data('nextspeed', newNextSpeed);
        // }

        if (!$(this).hasClass('disabled')) {
            videoPlayer.stop();
            $('.vidPopPlayBtn').addClass('paused').find('.toolTipInnerContainer').html(SL.UI.label_play).parent().parent()
                .attr('name', SL.UI.label_play + ': control + alt + S');

            if (HShell.autoSetup.runOn.OS === 'iOS') {
                $(this).find('.toolTipInnerContainer').html(SL.UI.label_play).parent().parent()
                    .attr('aria-label', SL.UI.label_play);
            }
        }
    });

    controlesContainer.find('.vidPopMuteBtn').uniClick(function () {
        if (!$(this).hasClass('disabled')) {
            if (!videoPlayer.muteOn) {
                $(this).addClass('muted');
                $(this).find('.toolTipInnerContainer').html(SL.UI.label_unMute).parent().parent()
                    .attr('name', SL.UI.label_unMute + ': control + alt + M');

                if (HShell.autoSetup.runOn.OS === 'iOS') {
                    $(this).find('.toolTipInnerContainer').html(SL.UI.label_play).parent().parent()
                        .attr('aria-label', SL.UI.label_unMute);
                }
                HShell.userData.volume_level = 0;
            } else {
                $(this).removeClass('muted');
                $(this).find('.toolTipInnerContainer').html(SL.UI.label_mute).parent().parent()
                    .attr('name', SL.UI.label_mute + ': control + alt + M');

                if (HShell.autoSetup.runOn.OS === 'iOS') {
                    $(this).find('.toolTipInnerContainer').html(SL.UI.label_play).parent().parent()
                        .attr('aria-label', SL.UI.label_mute);
                }
                HShell.userData.volume_level = 10;
            }

            videoPlayer.mute();
        }
    });


    controlesContainer.find('.vidPopBackBtn').uniClick(function () {
        // if (/IEMobile|Windows Phone/i.test(navigator.userAgent) == true || isIE() == true)
        // { // On IE11 set speed always on "Normal".
        //     var speed = 1;
        //     document.querySelector('video').playbackRate = speed; // Setting the value to video element.
        //     $("#vidSpeedControlContainer a").removeClass("active"); // Remove all active items.
        //     $(".vidSpeedControl:contains('Normal')").addClass("active");
		// 	newNextSpeed = "1.2";
        //     $(".vidSpeedControlMobile").html("1.0");
        //     $("#vidSpeedControlContainerMobile").data('nextspeed', newNextSpeed);
        // }

        if (!$(this).hasClass('disabled')) {
            videoPlayer.back();
            var thisItem = this;

            setTimeout(function () {
                if ($(thisItem).find('.vidPopPlayBtn') && $(thisItem).find('.vidPopPlayBtn').hasClass('paused')) {
                    $(thisItem).find('.vidPopPlayBtn').click();
                } else {
                    videoPlayer.play();
                }
            }, 100);	// ---  This timeout is here, because on ipad, sometimes the play is not executed while video is display none (the oddest thing is that it is random)		 |rework|
        }
    });

    controlesContainer.find('.vidPopSubtitles').uniClick(function () {

        //disable subs button (only functionally) on go to next module video screen, after every mercer module
        if (HShell.contentSetup.have_timeline && $('.vidPopModEndText.mercer').css('display') === 'block' || $(this).hasClass('disabled')) {
            return false;
        }

        $(this).toggleClass('active');
        $(this).closest('.videoFooterContainer').find('.vidPopSubtitlesContainer').toggleClass('noSubtitles');
        HShell.userData.prefer_subtitles = !HShell.userData.prefer_subtitles;

        if ($(this).hasClass('active')) {
            $(this).find('.toolTipInnerContainer').html(SL.UI.lable_subtitles_disable).parent().parent()
                .attr('name', SL.UI.lable_subtitles_disable)

            if (HShell.autoSetup.runOn.OS === 'iOS') {
                $(this).find('.toolTipInnerContainer').html(SL.UI.label_play).parent().parent()
                    .attr('aria-label', SL.UI.lable_subtitles_disable);
            }

            //toggles time-line bar position
            if (HShell.contentSetup.have_timeline) {
                $('.timelineContainer').addClass('subs');
            }
        } else {
            $(this).find('.toolTipInnerContainer').html(SL.UI.lable_subtitles_enable).parent().parent()
                .attr('name', SL.UI.lable_subtitles_enable)

            if (HShell.autoSetup.runOn.OS === 'iOS') {
                $(this).find('.toolTipInnerContainer').html(SL.UI.label_play).parent().parent()
                    .attr('aria-label', SL.UI.lable_subtitles_enable);
            }

            if (HShell.contentSetup.have_timeline) {
                $('.timelineContainer').removeClass('subs');
            }
        }
    });

    /* It manages the video speed. */
    controlesContainer.find('.vidSpeedControlContainerMobile').uniClick(function() {
        var nextSpeed = $(this).data('nextspeed'); // Getting the next speed.
        $(this).closest('.vidPopVideoContainer').find('video')[0].playbackRate = nextSpeed;

        /* Set the label to assign to the HTML elements. */
        var labelSpeed = nextSpeed;
        if (labelSpeed == "1.7") // 1.25
            labelSpeed = "2.0";
        
        /* Update speed. */
        var newNextSpeed;
        if (nextSpeed == "1.0") // Normal -> 1.2
            newNextSpeed = "1.2";
        else if (nextSpeed == "1.2") // 1.2 -> 1.5
            newNextSpeed = "1.5";
        else if (nextSpeed == "1.5") // 1.5 -> 2.0
            newNextSpeed = "1.7";
        else if (nextSpeed == "1.7")
            newNextSpeed = "1.0";
 
        $(this).closest('.vidPopVideoContainer').find('.vidSpeedControlMobile').html(labelSpeed);
        $(this).data('nextspeed', newNextSpeed);
     });

     /* It manages the video speed. */
     controlesContainer.find('.vidSpeedControlExpandButton').uniClick(function() {
        $(this).closest('.vidSpeedControlContainer').find('.vidSpeedControlDropdownList').toggleClass('expanded');
        $(this).closest('.vidSpeedControlContainer').find('.vidSpeedControlExpandButton').toggleClass('expanded');
     });
     controlesContainer.find('.vidSpeedControl').uniClick(function() {
        var speed = $(this).data('speed');
        $(this).closest('.vidPopVideoContainer').find('video')[0].playbackRate = speed;
        localStorage.setItem("videoSpeed", speed);
        $(this).closest('.vidPopVideoContainer').find('.vidSpeedControl').removeClass("active"); // Remove all active items.
        $(this).closest('.vidPopVideoContainer').find('.vidSpeedControl[data-speed="' + speed + '"]').addClass("active"); // Add active to current item.
        $(this).closest('.vidSpeedControlContainer').find('.vidSpeedControlDropdownList').removeClass('expanded');
        $(this).closest('.vidSpeedControlContainer').find('.vidSpeedControlExpandButton').removeClass('expanded').text(speed).attr('aria-activedescendant', $(this).attr('id'));
     });

     /* Spacebar management. */
     $(document).on("keyup", ".vidSpeedControl", function (event) {
        if (event.which == 32) {
            var speed = $(this).data('speed');
            $(this).closest('.vidPopVideoContainer').find('video')[0].playbackRate = speed;
            localStorage.setItem("videoSpeed", speed);
            $(this).closest('.vidPopVideoContainer').find('.vidSpeedControlContainer a').removeClass('active'); // Remove all active items.
            $(this).addClass("active"); // Add active to current item.
        }
     });

    controlesContainer.parent().find('.vidPopHeaderContainer > .vidPopCourseFullScreenButton').uniClick(function () {
        controlesContainer.parent().find('.vidPopHeaderContainer, .vidPopFooterContainer, .vidPopVideoContainer').addClass("fullscreen", 500);
    });

    controlesContainer.parent().find('.vidPopVideoContainer').uniClick(function () {
        controlesContainer.parent().find('.vidPopHeaderContainer, .vidPopFooterContainer, .vidPopVideoContainer').removeClass("fullscreen", 500);
    });

    $(videoPlayer.videoContainer).find('video')[0].playbackRate = 1;
    $(videoPlayer.videoContainer).find('.vidSpeedControl').removeClass('active');
    $(videoPlayer.videoContainer).find('.vidSpeedControl[data-speed=1]').addClass('active');
    $(videoPlayer.videoContainer).find('.vidSpeedControlMobile').html('1.0');
    $(videoPlayer.videoContainer).find('.vidSpeedControlContainerMobile').data('nextspeed', '1.2');
}

function showEndOfModuleScreen() {
    if (typeof window.clientSpecific_showEndOfModuleScreen == 'function') {
        window.clientSpecific_showEndOfModuleScreen();
    } else {
        HShell.utils.trace('clientSpecific_showEndOfModuleScreen() function is missing in 11.clientSpecific', '7. -> showEndOfModuleScreen(){}');
    }
}

//function interactionPointsCheckAndCreateWhenNeeded(thisObj) {
//    // Loop interactionPoints
//    $(thisObj.interactionPoints).each(function (index) {
//        // Convert to number and set pointEnd to pointStart + 1
//        var activePointStart = Number($(this).attr('pointStart'));
//        var activePointEnd = activePointStart + 1;

//        var currentTime = 0;
//        if (HShell.autoSetup.activeVideo.flashVideo) {
//            currentTime = HShell.autoSetup.activeVideo.videoCurrentPosition;
//        } else if (HShell.autoSetup.activeVideo.htmlVideo) {
//            currentTime = HShell.autoSetup.activeVideo.htmlVideo.currentTime;
//        }

//        // Check if video playback pointer is between pointStart and pointEnd on this interactionPoint.
//        if (!HShell.autoSetup.activeVideo.paused &&
//                (currentTime > activePointStart && currentTime < activePointEnd)) {
//            trace('pointStart @ ' + activePointStart + ' and end @ ' + activePointEnd);
//            trace('fished by IP @ ' + currentTime + ' (' + (currentTime - activePointStart) + ' seconds after pointStart)');
//            // Let's make safe the XML interactionPoint attribute "type" removing non alphanumeric characters and convert all letters to lowercase.
//            var interactionPointAttributeType = $(this).attr('type').replace(/\W/g, '').toLowerCase();

//            var ipController = new InteractionPointsController();
//            var isTypeValid = ipController.isTypeValid(interactionPointAttributeType);

//            if (isTypeValid) {
//                // Exit fullscreen on mobile devices
//                $('div.vidPopVideoInnerContainer').click();

//                // Pause video playback
//                if (!$('div.vidPopPlayBtn').hasClass('paused')) {
//                    $('div.vidPopPlayBtn').click();
//                }

//                // IMPORTANT: At the end of execution on IP type function make sure you execute interactionPointDestroyAndResume()
//                trace('Executing function ipController.executeInteractionPoint(' + interactionPointAttributeType + ', this);');
//                //window[functionName](interactionPointAttributeType, this);
//                ipController.executeInteractionPoint(interactionPointAttributeType, this);

//                // disable footer controls
//                $('.vidControlsBtn, .vidPopSubtitles').addClass('disabled').attr('tabindex', -1);

//                // resets the position of the time-line if subs are on and time-line enabled
//                if (HShell.contentSetup.have_timeline && HShell.userData.prefer_subtitles) {
//                    $('.timelineContainer.subs').removeClass('subs');
//                }

//                // hide the subs bar
//                if (HShell.userData.prefer_subtitles) {
//                    $('.vidPopSubtitlesContainer').addClass('noSubtitles');
//                }

//                if (HShell.autoSetup.activeVideo.videoCurrentPosition + 3 < HShell.autoSetup.activeVideo.videoLenght) {
//                    // go after activePointEnd for Flash
//                    if (HShell.autoSetup.activeVideo.flashVideo) {
//                        HShell.autoSetup.activeVideo.flashVideo.vid_forward('ip');
//                    }

//                    // go after activePointEnd for HTML
//                    if (HShell.autoSetup.activeVideo.htmlVideo) {
//                        HShell.autoSetup.activeVideo.videoCurrentPosition = activePointEnd + 0.6;
//                        HShell.autoSetup.activeVideo.htmlVideo.currentTime = activePointEnd + 0.6;
//                    }
//                }

//                $('#interactionPoint_question_outer .text').attr('tabindex', '0').focus().blur(function () { $(this).attr('tabindex', '-1'); });
//            } else {
//                trace('Interaction Point type (' + interactionPointAttributeType + ') is invalid. IP with index ' + index + ' between ' + activePointStart + ' and ' + $(this).attr('pointEnd') + ' seconds bypassed.');
//            }
//        }
//    });
//}

function buildAndShowIpContainer(index, thisObj) {
    var currentInteractionPoint = thisObj.interactionPoints[index];
    // Convert to number and set pointEnd to pointStart + 1
    var activePointStart = Number($(currentInteractionPoint).attr('pointStart')),
        activePointEnd = activePointStart + 1,
        currentVideoTime = 0;

    if (HShell.autoSetup.activeVideo.flashVideo) {
        currentVideoTime = HShell.autoSetup.activeVideo.videoCurrentPosition;
    } else if (HShell.autoSetup.activeVideo.htmlVideo) {
        currentVideoTime = HShell.autoSetup.activeVideo.htmlVideo.currentTime;
    }

    HShell.utils.trace('pointStart @ ' + activePointStart + ' and end @ ' + activePointEnd);
    HShell.utils.trace('fished by IP @ ' + currentVideoTime + ' (' + (activePointStart - currentVideoTime) + ' seconds before pointStart)');

    // Let's make safe the XML interactionPoint attribute "type" removing non alphanumeric characters and convert all letters to lowercase.
    var interactionPointAttributeType = $(currentInteractionPoint).attr('type').replace(/\W/g, '').toLowerCase();

    var ipController = new InteractionPointsController();
    var isTypeValid = ipController.isTypeValid(interactionPointAttributeType);

    if (isTypeValid && !thisObj.isIpActive) {
        thisObj.isIpActive = true;
        $('#moduleVideoContainer > .vidPopVideoContainer').addClass('interactionPointActive');
        // Exit fullscreen on mobile devices
        $('div.vidPopVideoInnerContainer').click();

        // Pause video playback
        if (!$('div.vidPopPlayBtn').hasClass('paused')) {
            $('div.vidPopPlayBtn').click();
        }

        // IMPORTANT: At the end of execution on IP type function make sure you execute interactionPointDestroyAndResume()
        HShell.utils.trace('Executing function ipController.executeInteractionPoint(' + interactionPointAttributeType + ', currentInteractionPoint);');
        ipController.executeInteractionPoint(interactionPointAttributeType, currentInteractionPoint);

        // disable footer controls
        $('.vidControlsBtn, .vidPopSubtitles').addClass('disabled').attr('tabindex', -1).attr('aria-disabled', true);

        // resets the position of the time-line if subs are on and time-line enabled
        if (HShell.contentSetup.have_timeline && HShell.userData.prefer_subtitles) {
            $('.timelineContainer.subs').removeClass('subs');
        }

        // hide the subs bar
        if (HShell.userData.prefer_subtitles) {
            HShell.autoSetup.activeVideo.videoContainer.find('.vidPopSubtitlesContainer').addClass('noSubtitles');
        }

        if (HShell.autoSetup.activeVideo.videoCurrentPosition + 3 < HShell.autoSetup.activeVideo.videoLenght) {
            // go after activePointEnd for Flash
            if (HShell.autoSetup.activeVideo.flashVideo) {
                HShell.autoSetup.activeVideo.flashVideo.vid_forward('ip');
            }

            // go after activePointEnd for HTML
            if (HShell.autoSetup.activeVideo.htmlVideo) {
                HShell.autoSetup.activeVideo.videoCurrentPosition = activePointEnd + 0.6;
                HShell.autoSetup.activeVideo.htmlVideo.currentTime = activePointEnd + 0.6;
            }
        }

        // hide flash player on desktop, because jaws puts the flash player in front of everything
        if (HShell.autoSetup.runOn.deviceType === 'desktop' && HShell.autoSetup.activeVideo.flashVideo) {
            $('#moduleVideoContainer > .vidPopVideoContainer > .vidPopVideoInnerContainer').css('left', '-1000px');
        }

        //global setting for enabling forcedSpeech on iphone while interactionPoint is active
        if (HShell.autoSetup.runOn.deviceType === 'mobile') {
            $('#forced_speech_container').attr('aria-hidden', false);
        }

        //windows phone hiding the video for screen reader on interaction
        if (HShell.autoSetup.runOn.OS === 'windowsPhone') {
            $('.vidPopVideoInnerContainer').attr('aria-hidden', true);
        }
    } else {
        HShell.utils.trace('Interaction Point type (' + interactionPointAttributeType + ') is invalid. IP with index ' + index + ' between ' + activePointStart + ' and ' + activePointEnd + ' seconds bypassed.');
    }

}

function interactionPointDestroyAndResume() {
    // enable footer controls
    $('.vidControlsBtn, .vidPopSubtitles').removeClass('disabled').attr('tabindex', 0).attr('aria-disabled', false);

    // show flash player on desktop, because jaws puts the flash player in front of everything
    if (HShell.autoSetup.runOn.deviceType === 'desktop' && HShell.autoSetup.activeVideo.flashVideo) {
        $('#moduleVideoContainer > .vidPopVideoContainer > .vidPopVideoInnerContainer').css('left', '0');
    }

    $('#moduleVideoContainer > .vidPopVideoContainer').removeClass('interactionPointActive');

    // set the position of the time-line if subs are on and time-line enabled
    if (HShell.contentSetup.have_timeline && HShell.userData.prefer_subtitles) {
        $('.timelineContainer').addClass('subs');
    }

    // show the subs bar
    if (HShell.userData.prefer_subtitles) {
        $('.vidPopSubtitlesContainer').removeClass('noSubtitles');
    }

    //global setting for disabling forcedSpeech on mobile when interactionPoint is destroyed
    if (HShell.autoSetup.runOn.deviceType === 'mobile') {
        $('#forced_speech_container').attr('aria-hidden', true);
    }

    //windows phone hiding the video for screen reader on interaction
    if (HShell.autoSetup.runOn.OS === 'windowsPhone') {
        $('.vidPopVideoInnerContainer').attr('aria-hidden', false);
    }

    if (HShell.autoSetup.activeVideo.htmlVideo) {
        //console.log('htmlVideo.currentTime ' + HShell.autoSetup.activeVideo.htmlVideo.currentTime);
        HShell.autoSetup.activeVideo.videoCurrentPosition = HShell.autoSetup.activeVideo.htmlVideo.currentTime;
        //console.log('activeVideo.videoCurrentPosition ' + HShell.autoSetup.activeVideo.videoCurrentPosition);
    }

    // check if we are some seconds (3) before end and end video in that case
    if (HShell.autoSetup.activeVideo.videoCurrentPosition + 3 < HShell.autoSetup.activeVideo.videoLenght) {
        // resume playback
        $('div.vidPopPlayBtn').click();
        setTimeout(function () { // set this to false 2 seconds after resuming video after IP
            HShell.autoSetup.activeVideo.isIpActive = false;
        }, 2000);
    } else {    // make video finish
        HShell.autoSetup.activeVideo.isIpActive = false;

        if (HShell.autoSetup.activeVideo.flashVideo) {
            HShell.autoSetup.activeVideo.videoCurrentPosition = HShell.autoSetup.activeVideo.videoLenght;
        }

        if (HShell.autoSetup.activeVideo.htmlVideo) {
            HShell.autoSetup.activeVideo.videoCurrentPosition = HShell.autoSetup.activeVideo.videoLenght;
            HShell.autoSetup.activeVideo.htmlVideo.currentTime = HShell.autoSetup.activeVideo.htmlVideo.duration;
        }
    }

    HShell.utils.trace('exiting IP @ ' + HShell.autoSetup.activeVideo.videoCurrentPosition);

    // The timeout is needed so that the video dose not blink for a second while the subtitles check is passed.
    setTimeout(function () {
        // destroy interactionPoint
        $(document.getElementById('interactionPointContainer')).remove();
        HShell.autoSetup.activeVideo.isIpActive = false;
    }, HShell.autoSetup.activeVideo.subtitlesRefreshRate * 2);
}

function getNextIpIndexAndTime(thisObj) {
    var len = thisObj.interactionPoints.length,
        index = 0,
        timeUntilIp = [];  // time to each ip ( activePointStart - HShell.autoSetup.activeVideo.videoCurrentPosition)
    for (index = 0; index < len; index++) {
        var activePointStart = Number($(thisObj.interactionPoints[index]).attr('pointStart'));
        var currentTimeUntilIp = activePointStart - HShell.autoSetup.activeVideo.htmlVideo.currentTime;
        if (currentTimeUntilIp > 0) {
            timeUntilIp.push({
                index: index, time: currentTimeUntilIp
            });
        }
    }

    if (timeUntilIp.length <= 0) {
        return undefined;
    }

    var min = timeUntilIp[0];
    for (var i in timeUntilIp) {
        if (timeUntilIp.hasOwnProperty(i)) {
            if (timeUntilIp[i].time < min.time) {
                min = timeUntilIp[i];
            }
        }
    }

    return min;
}

/// <reference path="_references.js" />

var HShell = window.HShell || {};
HShell.storage = {};
HShell.storage.ignoreUnloadSaving = false;

(function () {
    // ________________________________________________________________________________________________________________________________
    // --- loads the proper data saving method

    HShell.storage.initDataSaving = function() {				// |rework| since this is the only place that we use ajax for loading javascripts, it is not needed to be stay like this, instead my suggestion is to add one variable to the config.json file and load the correct JavaScript file in the index.html with the rest of the scripts. After this is done, we can remove the library that we use for ajaxing js files
        if (HShell.contentSetup.enableDataSavings) {
            continueWithInitDataSaving();
        } else {
            HShell.autoSetup.savedDataLoaded = true;
            continueAfterDataColection();
        }
    };

    function continueWithInitDataSaving() {
        var storedData = HShell.autoSetup.SCORM.getAllStoredData();

        getRestoredData(storedData);
        window.onbeforeunload = onBeforeUnloadSaveData;
        if (HShell.autoSetup.runOn.browserName === 'chrome') {
            setInterval(function() {
                console.log('TRACE - calling commitData immediately from setInterval');
                HShell.storage.commitData('high');
            }, 1 * 10 * 1000); // commit data every 10 secs on chromium browsers as they don't support XHR requests on window unload
        }
        HShell.autoSetup.savedDataLoaded = true;
        continueAfterDataColection();
    }

    function onBeforeUnloadSaveData() {
        if (HShell.storage.ignoreUnloadSaving) {
            return;
        }
        console.log('TRACE - unload fired.');
        if (HShell.savedData.last_location !== 'pre_a'/* && HShell.savedData.last_location !== "post_a"*/) {
            var allAnswersCorrectFinalAssessment = HShell.content.postAssessObj.correctAnswers == HShell.content.postAssessObj.questionsNum;
            if (HShell.savedData.last_location === 'post_evalPage' && allAnswersCorrectFinalAssessment) { // workaround for navigating away from the course
                console.log('TRACE - unload fired. Calling continueWithSetCourseAsCompleated.');
                continueWithSetCourseAsCompleated();
                SCORM.courseFinished = false;
            }
            HShell.autoSetup.SCORM.saveDataOnUnload();
        }
    }

    // ________________________________________________________________________________________________________________________________

    function getRestoredData(restoredObj) {
        if (restoredObj != false && !HShell.globalSetup.demoMode) {
            HShell.savedData.user_name = restoredObj.user_name;
            HShell.savedData.user_id = restoredObj.user_id;
            HShell.savedData.completion_status = restoredObj.completion_status;
            HShell.savedData.success_status = restoredObj.success_status;
            HShell.savedData.last_location = restoredObj.last_location;

            HShell.userData.selected_language = restoredObj.selected_language;
            HShell.content.obejectivesCount = restoredObj.obejectivesCount;
            HShell.userData.selected_role = restoredObj.role;
            HShell.userData.selected_roleCode = restoredObj.roleCode;
            HShell.userData.selected_brand = restoredObj.brand;
            HShell.autoSetup.commitCount = restoredObj.commitCount;
            HShell.content.postAssessObj.attempts = restoredObj.posAAttempts;
            HShell.content.roleNoPreAssessment = restoredObj.roleNoPreAssessment;
            HShell.autoSetup.timeSpendInsideCoures = restoredObj.timeSpendInsideCoures;
            HShell.autoSetup.sessionTime = 0;

            HShell.content.surveyObj.finished = restoredObj.surveyPassed;

            document.getElementById('SCORM_Container').setAttribute('data-brand', HShell.userData.selected_brand);

            $(HShell.content.languageArray).each(function (i, item) {
                if (item.UI.code == HShell.userData.selected_language) { HShell.content.selected_languageObj = item; SL = item; }
            });

            if (typeof HShell.content.preAssessObj.XML == 'undefined') {
                HShell.xml.readFromXml(
                    String('content/' + SL.UI.code + '/' + SL.UI.pre_a),
                    function preXmlLoaded(xml) {
                        HShell.content.preAssessObj = HShell.newObjects.newAssessmentObj('pre_assessment', $(xml).find('questions'));
                        HShell.content.preAssessObj.XML = $(xml).find('questions');
                        if (localStorage.getItem('isPeopleManager') == 'true') {
                            HShell.content.preAssessObj.XML.find('questionGroup[module="2"]').remove();
                            HShell.content.preAssessObj.XML.find('questionGroup[module="3"]').remove();
                        }
                    });
            }

            if (String(restoredObj.preAFinishedModules) != 'undefined') {
                HShell.content.preAssessObj.finishedModules = restoredObj.preAFinishedModules;
            }

            if (String(restoredObj.posAFinishedModules) != 'undefined') {
                HShell.autoSetup.postAssessFinishedModules = restoredObj.posAFinishedModules;
            }

            analizeLoadedData();

            if (String(HShell.userData.selected_role) != 'undefined') {
                createModulesObjAfterRoleSelected(HShell.content.selected_languageObj.idInLanguageArray);
                if (HShell.contentSetup.have_notifications) {
                    HShell.xml.getNotifications(HShell.content.selected_languageObj.idInLanguageArray);
                }
            }

            if (String(HShell.userData.selected_brand) != 'undefined') {
                HShell.content.selected_brandObj = HShell.content.brandsArray.filter(function (item) {
                    return item.code === HShell.userData.selected_brand;
                })[0];
            }

            console.log(restoredObj);

            if(restoredObj.modulesCustomData){
                restoredObj.modulesCustomData.forEach(function(record){
                    var id = record.id,
                        data = record.data;

                    HShell.storage.saveModuleCusomData(id, data);
                });
            }

            getRestoredInteractions(restoredObj);
            getRestoredObjectives(restoredObj);

            return true;
        } else {
            return false;
        }
    }

    function getRestoredInteractions(restoredObj) {
        var XmlsToLoad = 0;
        var XmlSLoaded = 0;
        var preAssessmentInit = false;
        var postAssessmentInit = false;

        if (HShell.content.preAssessObj.XML != 'null' && typeof HShell.content.preAssessObj.XML != 'undefined') {
            HShell.xml.genereteOneAssessmentFromXml(HShell.content.preAssessObj, 'null', HShell.content.selected_roleObj.modules_listArray, true);
        }

        if (restoredObj.interactionsArray.length > 0) {
            $(restoredObj.interactionsArray)
                .each(function (i, item) {
                    var tempArray = item.id.split('.');
                    tempArray[3] = Number(tempArray[3]); // Qgroup ID
                    tempArray[4] = Number(tempArray[4]); // Q id

                    switch (tempArray[0]) {
                        case 'pre':
                            if (!preAssessmentInit) { // --- Prevents re-requesting of the same XML file
                                if (HShell.contentSetup
                                    .have_pre_a) {
                                    // --- Sort of useless, since if you have stored the data with pre-assessment interactions, the contentSetup must have pre-assessment
                                    if (HShell.content.preAssessObj.XML == 'null' ||
                                        typeof HShell.content.preAssessObj.XML == 'undefined') {
                                        XmlsToLoad++;
                                        preAssessmentInit = true;
                                        HShell.xml.getPreXml(reParseInteractions);
                                    } else {
                                        HShell.content.preAssessObj.answersArray.push({
                                            correctState: item.result, // |Nick|
                                            questionGroupId: tempArray[3],
                                            questionId: tempArray[4],
                                            selectedItemText: item.description,
                                            learnerResponse: Number(item.response)
                                        });

                                        if (item.result) {
                                            HShell.content.preAssessObj.finishedModules.push(tempArray[2]);
                                        }

                                        $(HShell.content.preAssessObj.quizArray)
                                            .each(function (k, quizArrayItem) {
                                                if (Number(quizArrayItem.id) == tempArray[3]) {
                                                    $(quizArrayItem.questionArr)
                                                        .each(function (j, questionArrItem) {
                                                            if (Number(questionArrItem.id) == tempArray[4]) {
                                                                questionArrItem.used = true;
                                                                questionArrItem.interactionNumber = i;
                                                            }
                                                        });
                                                }
                                            });
                                    }
                                }
                            }
                            break;

                        case 'post':
                            if (!postAssessmentInit || String(HShell.content.postAssessObj.XML) != 'undefined') { // --- Prevents re-requesting of the same XML file
                                if (HShell.contentSetup.have_post_a) { // --- Same like the pre-assessment
                                    if (HShell.content.postAssessObj.XML == 'null') {
                                        XmlsToLoad++;
                                        postAssessmentInit = true;
                                        HShell.xml.getPostXml(reParseInteractions);
                                    } else {
                                        if (item.result) HShell.autoSetup.postAssessFinishedModules.push(tempArray[2]);
                                    }
                                }
                            }
                            break;

                        case 'mod':
                            //	|notImplemented|
                            break;
                    }
                });

            if (HShell.content.preAssessObj.XML != 'null' && typeof HShell.content.preAssessObj.XML != 'undefined') {
                HShell.content.preAssessObj.questionsNum = HShell.content.preAssessObj.answersArray.length;

                $(HShell.content.preAssessObj.quizArray)
                    .each(function (k, quizArrayItem) {
                        var tempQuizArray = new Array();

                        $(quizArrayItem.questionArr)
                            .each(function (j, questionArrItem) {
                                if (questionArrItem.used == true) {
                                    tempQuizArray.push(questionArrItem);
                                }
                            });

                        quizArrayItem.questionArr = tempQuizArray;
                    });
            }
        }

        function reParseInteractions() {
            XmlSLoaded++;
            if (XmlsToLoad == XmlSLoaded) {

                getRestoredInteractions(restoredObj);
            }
        }
    }

    function getRestoredObjectives(restoredObj) {
        try {
            $(HShell.content.languageArray).each(function (k, laItem) {
                $(laItem.allModules).each(function (i, item) {
                    try {
                        var savedItem = restoredObj.objectivesArray[i];
                        if (!savedItem) return true;
                        item.completion_status = savedItem.completion_status;
                        item.content_completion_status = savedItem.progress_measure[0];
                        if (String(savedItem.progress_measure[1]) != 'undefined') {
                            item.quiz_completion_status = savedItem.progress_measure[1];
                        } else {
                            item.quiz_completion_status = 'unknown';
                        }
                    } catch (e) {
                        throw (e);
                    }
                });
            });
        } catch (e) {
            HShell.utils.trace('Error while restoring objectives Data from LMS: ' + e, '8.DataStorageController');
        }
    }
    // ________________________________________________________

    function analizeLoadedData() {
        var segments = HShell.globalSetup.segmentsOrder;
        var template = HShell.contentSetup.course_template;

        // --- Restores the position in the template from the HShell.savedData.last_location
        $(segments[template]).each(function (i, item) {
            if (item == HShell.savedData.last_location) { HShell.autoSetup.shellModuleStep = i; }        // --- This is used in "gotoController" in "4.goTo.js"
        });


        // --- Restores the selected language

        $(HShell.content.languageArray).each(function (i, item) {
            if (item.UI.code == HShell.userData.selected_language) { HShell.content.selected_languageObj = SL = item; }
        });


        // --- Restores the selected role
        try {
            if (String(HShell.autoSetup.commitCount) != 'undefined') {			// --- skips the code below if we start the course without previous data, or if this is the first time starting it (never selected the role)
                $(HShell.content.roleArray).each(function (i, item) {
                    if (item.code == HShell.userData.selected_role) {
                        HShell.content.selected_roleObj = item;
                        HShell.content.selected_roleObj.modules_listArray = HShell.content.selected_roleObj.modules_list.split(',');

                        changeBrandingTo(HShell.content.selected_roleObj.brandingThemeFolder);
                        if (HShell.content.selected_roleObj.uiOverride) {
                            HShell.reloadUiXml(HShell.content.selected_roleObj.code);
                        }
                    }
                });
            }
        } catch (e) {
            HShell.utils.trace('Error while parsing selected selected_roleObj: \t' + e, 'analizeSCORMData');
        }
    }

    // ________________________________________________________

    HShell.storage.commitData = function(priority) {
        if (HShell.contentSetup.enableDataSavings && !HShell.autoSetup.serverError) {
            priority = String(priority).toLowerCase();
            if (priority == 'undefined') priority = 'normal';
            var tempDateOne = new Date();
            var commitStatus = true;

            if (HShell.autoSetup.commitDelay >= 1000 || HShell.savedData.last_location == 'pre_a' || HShell.savedData.last_location == 'post_a') {
                buildSavingScreen();
            }

            // setTimeout(function () {		// --- The setTimeout is here because on ie7 for some reason it takes time to execute buildSavingScreen() and it freezes the UI from the sync request in the commit before showing the saving message
            var data = HShell.storage.getCommitData();

            switch (priority) {
                case 'low': if (HShell.autoSetup.commitDelay <= 300) { commitStatus = HShell.autoSetup.SCORM.continueWithCommit(data); } break;
                case 'normal': if (HShell.autoSetup.commitDelay <= 600) { commitStatus = HShell.autoSetup.SCORM.continueWithCommit(data); } break;
                case 'high':
                    if (HShell.autoSetup.commitDelay <= 1000) {
                        commitStatus = HShell.autoSetup.SCORM.continueWithCommit(data);
                    } else {
                        // commits every second item
                        if (HShell.autoSetup.commitStackNum == 1) { HShell.autoSetup.commitStackNum = 0; commitStatus = HShell.autoSetup.SCORM.continueWithCommit(data); }
                        HShell.autoSetup.commitStackNum++;
                    }
                    break;

                case 'immediate': commitStatus = HShell.autoSetup.SCORM.continueWithCommit(data); break;
            }

            var tempDateTwo = new Date();
            removeSavingScreen();

            HShell.autoSetup.commitDelay = tempDateTwo - tempDateOne;
            HShell.utils.trace(commitStatus + '\t[priority]: ' + priority + '\tCommitDelay: ' + HShell.autoSetup.commitDelay, 'SCORM.commit: ');
            // }, 1);
        }
    };

    HShell.storage.getCommitData = function(){
        return {
            modulesCustomData: getAllModulesCustomData()
        };
    };

    // ________________________________________________________________________________________________________________________________

    function getAllModulesCustomData(){
        var data = [];

        if(HShell.content.selected_languageObj && HShell.content.selected_languageObj.allModules){
            HShell.content.selected_languageObj.allModules.forEach(function(module){
                if(module.customData){
                    data.push( {id: module.mod_id, data: module.customData} );
                }
            });
        }

        return data;
    }

    HShell.storage.saveModuleCusomData = function(mod_id, data){
        HShell.content.getModuleArrForAllLanguages(mod_id).forEach(function(module){
            module.customData = data;
        });
    };

    HShell.storage.loadModuleCustomData = function(mod_id){
        var module = HShell.content.getModuleById(mod_id);

        return module.customData;
    };

    // ________________________________________________________________________________________________________________________________

    HShell.storage.gotoServerErrorMessage = function() {
        if (HShell.autoSetup.commitDataServerErrorCount < 0) {		// --- The number on the if represents the amount of attempts that you will have before showing the "Connection Error screen"
            HShell.autoSetup.commitDataServerErrorCount++;
            HShell.storage.commitData('immediate');
        } else {
            if (!HShell.globalSetup.devMode && !HShell.globalSetup.demoMode && !HShell.autoSetup.ignoreServerErrorPopup) {
                $('body').appendPopUp({
                    title: HShell.content.selected_languageObj.UI.serverError_title,
                    content: SL.UI.serverError_body,
                    iconSymbol: HShell.consts.iconsObj.icon_alert
                });
            }
            HShell.autoSetup.serverError = true;
        }
    };

    HShell.storage.setCourseAsCompleated = function() {
        localStorage.setItem('isFinalSurvey', false);
        if (HShell.contentSetup.enableDataSavings) {
            HShell.autoSetup.SCORM.continueWithSetCourseAsCompleated();
        }
        HShell.savedData.completion_status = 'completed';
    };

    HShell.storage.saveCourseEndData = function() {
        if (HShell.contentSetup.enableDataSavings) {
            console.log('TRACE - saveCourseEndData called');
            HShell.autoSetup.SCORM.continueWithsaveCourseEndData();
            console.log('TRACE - calling commitData immediately from saveCourseEndData');
            HShell.storage.commitData('immediate');

            var result = pipwerks.SCORM.data.save();
            console.log('TRACE - saveCourseEndData pipwerks.SCORM.data.save - result = ' + result);
            return result;
            // 15.12.21
            // console.log('TRACE - calling terminate from saveCourseEndData.');
            // pipwerks.SCORM.connection.terminate();
        }
    };
})();

/// <reference path="_references.js" />

var HShell = window.HShell || {};

// ________________________________________________________

function clearDublicatedItemFromArray(arr) {
    var uniqueVals = new Array();
    $.each(arr, function (i, el) {
        if ($.inArray(el, uniqueVals) === -1) uniqueVals.push(el);
    });

    return uniqueVals;
}

// ________________________________________________________________________________________________________________________________
// --- Enable Custom JQuery Function

(function enableCustomJQFuncs() {
    enablePopUps();
    customWindowsPerset();
    enableAriaRefresh();
    enableXMLfilterNode();			// --- Used to incriese performance in parsing XMLs (rignt now it is used only in 11.clientspesific, because it helps with namespaces)
})();

function enableDocumentInteractionWatch() {
    var interactionWait = 0;

    function interactionTimer() {		// --- In some casess we have keydown and right after we have click (this is form the uniClick()), so we have a small timout to prevent false readings
        interactionWait = 1;
        setTimeout(function () {
            interactionWait = 0;
        }, 600);
    }

    $(document).click(function () {
        if (!interactionWait) {
            HShell.autoSetup.lastUserInteraction = 'mouse';
            $('body').removeClass('userInteractionKeybard').addClass('userInteractionMouse');
            interactionTimer();
        }
    });
    $(document).keydown(function () {
        if (!interactionWait) {
            HShell.autoSetup.lastUserInteraction = 'keyboard';
            $('body').addClass('userInteractionKeybard').removeClass('userInteractionMouse');
            interactionTimer();
        }
    });
}

// ________________________________________________________

// ------- Hide/Show custom windows  ________ (Jquery Extention)
// -------(when I initialy made it it made a lot more sence, but after several changes it realy needs some refoactoring)

function customWindowsPerset() {
    $.fn.hideWindow = function () {
        $(this).remove();

        return this;
    };
    $.fn.showWindow = function () {
        var thisItem = $(this);
        thisItem.css({ left: '0px' });

        return $(this);
    };
}


function enableXMLfilterNode() {
    $.fn.filterNode = function (name) {
        return this.find('*').filter(function () {
            return this.nodeName === name;
        });
    };
}
// ________________________________________________________________________________________________________________________________
// --- getRandRange (self explanatory)

function getRandRange(min, max) {
    return Math.random() * (max - min) + min;
}

// ________________________________________________________________________________________________________________________________
// --- POP Ups ________ (Jquery Extention)

function enablePopUps() {
    $.fn.appendPopUp = function (settings) {
        var html,
            result = null;

        if (!HShell.autoSetup.activePopUp) {
            html = HShell.core.getComponent('PopUp').init({
                title: settings.title,
                content: settings.content,
                footer: settings.footer,
                customFunction: settings.func,
                iconSymbol: settings.iconSymbol,
                initiatorComponent: settings.initiatorComponent
            });

            $(this).append(html);
            HShell.core.renderComponents($(this));

            result = this;
        }

        return result;
    };
}

// ________________________________________________________________________________________________________________________________
// --- Araia Refresh ________ (Jquery Extention)

function enableAriaRefresh() {
    $.fn.ariaRefresh = function () {
        if (String($(this).attr('aria-live')) == 'undefined') {
            $(this).attr('aria-live', 'polite');
        }
        $(this).html($(this).html());
    };
}

// ________________________________________________________________________________________________________________________________

function getFileTypeLanguageItem(obj) {
    var extention = obj.extention.toLowerCase(),
        result = '';

    switch (extention) {
        case 'ppt':
        case 'pptx':
            result = 'extPPT';
            break;

        case 'doc':
        case 'docx':
            result = 'extDOC';
            break;

        case 'xls':
        case 'xlsx':
            result = 'extXLS';
            break;

        case 'pdf':
            result = 'extPDF';
            break;
    }

    if (!result) {
        switch (obj.type.toLowerCase()) {
            case 'webpage':
                result = 'moduleTypeWebpage';
                break;

            case 'video':
                result = 'moduleTypeVideo';
                break;

            case 'adobe animate':
                result = 'moduleAnimate';
                break;

            case 'slides':
                result = 'moduleSlides';
                break;
            
            case 'layouts':
                result = 'moduleLayouts';
                break;
        }
    }

    return result;
}

// ________________________________________________________________________________________________________________________________


function refreshAllCSS() {
    $('head').find('link').each(function () {
        var tempHref = $(this).attr('href');
        tempHref = tempHref.split(0, tempHref.indexOf('?')) + '?' + Math.floor(Math.random() * 100000000);
        $(this).attr('href', tempHref);
    });
}


// --- Temp Solution

function shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


// ________________________________________________________________________________________________________________________________

function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

HShell.userData.setVolumeLevel = function(volumeLevel){
    if(typeof volumeLevel === 'string'){
        volumeLevel = volumeLevel.toLowerCase();

        HShell.userData.volume_level = (volumeLevel === 'mute' || volumeLevel === 'muted') ? 0 : 10;
    }

    if(typeof volumeLevel === 'number'){
        HShell.userData.volume_level = volumeLevel;
    }
};

HShell.userData.getMutedStatus = function(){
    return HShell.userData.volume_level ? 'unmuted' : 'muted';
};

HShell.userData.setSubtitlesStatus = function(hasSubtitles){
    HShell.userData.prefer_subtitles = hasSubtitles;
};

HShell.userData.getSubtitlesStatus = function(){
    return HShell.userData.prefer_subtitles;
};

var HShell = window.HShell || {};
HShell.consts = {};

HShell.consts.videoCheckFreq = 300;         // Used for setInterval function in order to get the current time of the video
HShell.consts.automaticScrollTime = 300;    // The time that takes for the smooth scroll to position to the correct element
HShell.consts.toolTipHoverDelay = 600;      // The time that we wait to show the tooltip. This prevents blinking when the mouse just passed over the element
HShell.consts.pageLoadDelayA11YRead = 1000;  // The time that is needed before reading the content of the page. This time is waiting for some components to finish animations or just to be visualized

// |rework| it must be controlled by the languages, not static
HShell.consts.monthsArray = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

HShell.consts.moduleSelectOptions = {};
(function (Enum) {
    Enum[Enum['rows'] = 'ModuleSelect_Rows'] = 'rows';
    Enum[Enum['grid'] = 'ModuleSelect_Grid'] = 'grid';
})(HShell.consts.moduleSelectOptions);

HShell.consts.completionStatus = {
    notStarted : 'not attempted',
    inProgress: 'incomplete',
    completed: 'completed',
    unknown: 'unknown'
};

HShell.consts.selfCompleatingModulesTypes = {
    'adobe animate': true
};

HShell.consts.moduleTypes = {};
(function (Enum){
    Enum[Enum['slides'] = 'slides'] = 'slides';
    Enum[Enum['layouts'] = 'layouts'] = 'layouts';
    Enum[Enum['video'] = 'video'] = 'video';
    Enum[Enum['adobe animate'] = 'adobeAnimate'] = 'adobe animate';
})(HShell.consts.moduleTypes);

HShell.consts.locations = {
    slides : 'module_slides',
    layouts : 'module_layouts',
    moduleVideo: 'module_video',
    moduleSelect : 'mod_select',
    intro: 'intro',
    pre_assessment: 'pre_a',
    post_assessment: 'post_a',
    post_eval: 'post_evalPage',
    survey: 'survey'
};

HShell.consts.deviceType = {
    desktop: 'desktop',
    mobile: 'mobile'
};

HShell.consts.iframeTypes = {
    iframe: 'iframe',
    youtube: 'youtube',
    ted: 'ted'
};

HShell.consts.iframeTemplates = {
    defaultsTo: '',
    bigHomeButton: 'bigHomeButton'
};

HShell.consts.videoPlayerMethod = {};
(function (Enum){
    Enum[Enum['flash'] = 0] = 'flash';
    Enum[Enum['blob'] = 1] = 'blob';
    Enum[Enum['html5Video'] = 2] = 'html5Video';
})(HShell.consts.videoPlayerMethod);

HShell.consts.keyCodes = {};
(function (Enum) {
    Enum[Enum['rightArrow'] = 39] = 'rightArrow';
    Enum[Enum['leftArrow'] = 37] = 'leftArrow';
    Enum[Enum['upArrow'] = 38] = 'upArrow';
    Enum[Enum['downArrow'] = 40] = 'downArrow';
    Enum[Enum['escape'] = 27] = 'escape';
    Enum[Enum['space'] = 32] = 'space';
})(HShell.consts.keyCodes);

// Contains the list of all the icons that are part of the icon font.
HShell.consts.iconsObj = {};
(function(){
    // --- The Website that we use for converting the icons to fonts is: https://icomoon.io/

    var icon = {
        icon_Close: 'e9',
        icon_true: 'e900',
        icon_false: 'e901',
        icon_ring_language: 'e902',
        icon_ring_role: 'e903',
        icon_circle: 'e904',
        icon_Play: 'e905',
        icon_Pause: 'e906',
        icon_Stop: 'e907',
        icon_Rewind: 'e908',
        icon_Fast_forward: 'e909',
        icon_arrow_up: 'e90a',
        icon_arrow_forward: 'e90b',
        icon_arrow_down: 'e90c',
        icon_arrow_back: 'e90d',
        icon_post_assessment: 'e90e',
        icon_full_screen: 'e90f',
        icon_Sound_volume_2: 'e910',
        icon_Sound_volume_3: 'e911',
        icon_home: 'e912',
        icon_Sound_volume_1: 'e913',
        icon_Sound_mute: 'e914',
        icon_alert: 'e915',
        icon_check: 'e916',
        icon_exit: 'e917',
        icon_header_TutorialIcon: 'e918',
        icon_question: 'e919',
        icon_status: 'e91a',
        icon_transcript: 'e91b',
        icon_accessibility: 'e91c',
        icon_Flag: 'e91d',
        icon_role: 'e91e',
        icon_button_outline: 'e91f',
        icon_button_outline_tab: 'e920',
        icon_subtitles: 'e921',
        flag_assessment: 'e922',
        icon_Plause: 'e923',
        in_progress: 'e924',
        not_started: 'e925',
        icon_tab: 'e926',
        circle_arrow: 'e927',
        icon_refresh: 'e928',
        circle_border: 'e929'
    };

    for (var property in icon) {
        if (icon.hasOwnProperty(property)) {
            HShell.consts.iconsObj[property] = '&#' + parseInt(icon[property], 16);
        }
    }
})();

var HShell = window.HShell || {};

HShell.clientSpecific = HShell.clientSpecific || {};
HShell.courseSpecific = HShell.courseSpecific || {};
HShell.qaMode = HShell.qaMode || {};

(function () {
    $(document).ready(function(){
        document.documentElement.classList.add('hshell_container');

        var topLeftSliders = window.topLeftSliders || function(){};
        var zoomContent = window.zoomContent || function(){};
        var enableDocumentInteractionWatch = window.enableDocumentInteractionWatch || function(){};

        initRootComponent();

        // --- Dev || QA
        HShell.qaMode.init && HShell.qaMode.init();
        addDevClass();

        // --- Setup
        clearDomContainer();
        HShell.clientSpecific.GlobalVarDeclaration && HShell.clientSpecific.GlobalVarDeclaration();
        HShell.clientSpecific.SCORMDeclarations && HShell.clientSpecific.SCORMDeclarations();
        HShell.courseSpecific.GlobalVarDeclaration && HShell.courseSpecific.GlobalVarDeclaration();

        HShell.core.applyBrand(HShell.config.brandName);		// --- Initial load of the branding
        addjQueryExtentions();

        // --- Bind events
        $(window).on('resize', topLeftSliders);
        enableDocumentInteractionWatch();
        oriantationTracking();

        // --- Accessibility
        addTitle();
        HShell.a11y.enableAccessibilityShortcuts();

        // --- Mobile devices
        addClassessForMobile();
        zoomContent();
        addDoubleTap();
        windowsPhoneOriantationFix();
        checkIfLandscapeOrPortrait();

        // --- Init content
        HShell.xml.readFromXml('content/config.xml', HShell.xml.getDataFromConfigXml);		// --- Get the setting for the shell form the 'config.xml'

        // --------------------------------
        // --- App entry point
        // --------------------------------
        HShell.preload.init();

        setCssVars();
    });

    function clearDomContainer(){
        document.getElementById('SCORM_Container').innerHTML = '';
    }

    function addTitle(){
        //setting the document title on online deliveries (noQA, noLMS) for accessibility
        if (!document.title && HShell.content && HShell.content.selected_languageObj && HShell.content.selected_languageObj.UI) {
            document.title = HShell.content.selected_languageObj.UI.course_title;
        }
    }

    function addClassessForMobile(){
        var updateTabletZoomRatio = window.updateTabletZoomRatio || function(){};

        if(HShell.autoSetup.runOn.deviceType === 'mobile'){
            $('body').addClass('mobile');
        }

        if (HShell.autoSetup.runOn.deviceName != 'ipad') {
            $('body').addClass(HShell.autoSetup.runOn.OS);
        } else {
            $('body').addClass('ipad');
            updateTabletZoomRatio();
        }

        $('body').addClass(HShell.autoSetup.runOn.browserName);
    }

    function addDoubleTap(){
        // --- Enable Double Tap (For Android Only)  ________ (Jquery Extention)

        $.event.special.doubletap = {
            bindType: 'touchend',
            delegateType: 'touchend',

            handle: function (event) {
                var handleObj = event.handleObj,
                    targetData = jQuery.data(event.target),
                    now = new Date().getTime(),
                    delta = targetData.lastTouch ? now - targetData.lastTouch : 0,
                    delay = delay == null ? 300 : delay;

                if (delta < delay && delta > 30) {
                    targetData.lastTouch = null;
                    event.type = handleObj.origType;
                    ['clientX', 'clientY', 'pageX', 'pageY'].forEach(function (property) {
                        event[property] = event.originalEvent.changedTouches[0][property];
                    });

                    // let jQuery handle the triggering of "doubletap" event handlers
                    handleObj.handler.apply(this, arguments);
                } else {
                    targetData.lastTouch = now;
                }
            }
        };

    }

    function addDevClass(){
        if (HShell.globalSetup.devMode) {
            $('body').addClass('devmode');
        }
    }

    function addjQueryExtentions(){
        // --- Gets the parent object that fints the selector
        $.fn.getParent = function (selector) {
            return $(this).parentsUntil(selector).last().parent();
        };
    }

    function windowsPhoneOriantationFix(){
        // --- The next stupid piece of code is brought to you thanks to IE and windows phone
        // --- By "blinking" the body this makes sure that Windows Phone will refresh all the css (min-height in particular and all 'calc' values)
        if(HShell.autoSetup.runOn.OS === 'windowsPhone'){
            $(window).on('orientationchange', function () {
                if (HShell.savedData.last_location != 'mod_select') {          // --- It will break the video player if you hide it and show it again
                    blinkBody();
                }
            });
        }
        if(HShell.autoSetup.runOn.OS === 'iOS'){
            $(document).on('orientationchange', function () {
                blinkBody();
            });
        }
    }

    function blinkBody() {
        document.body.style.display = 'none';

        setTimeout(function () {
            document.body.style.display = 'block';
        }, 100);
    }

    function oriantationTracking(){
        // --- Tracks the orientation of the device
        if (HShell.autoSetup.runOn.OS == 'windowsPhone') {
            $(window).on('resize', function () { checkIfLandscapeOrPortrait(); });
        } else {
            $(window).on('orientationchange', function () { checkIfLandscapeOrPortrait(); });
        }
    }

    function checkIfLandscapeOrPortrait() {
        if (HShell.autoSetup.runOn.OS == 'iOS') {
            if (window.orientation != 0) {
                $('body').addClass('landscape').removeClass('portrait');
            } else {
                $('body').addClass('portrait').removeClass('landscape');
            }
        } else {
            if (HShell.autoSetup.runOn.OS == 'windowsPhone') {
                if (window.styleMedia.matchMedium('(orientation: landscape)')) {
                    $('body').addClass('landscape').removeClass('portrait');
                } else {
                    $('body').addClass('portrait').removeClass('landscape');
                }
            }
        }
    }

    function initRootComponent(){
        HShell.core._rootComponent = HShell.core.getComponent('app');
        document.body.innerHTML += HShell.core._rootComponent.init();
        HShell.core.renderComponents(document.body);
    }

})();

var HShell = window.HShell || {};

HShell.utils = {};

// ----------------------------------------------------
// ----- Trace (a function that will use console.log if the (HShell.globalSetup.devMode == true) )
// ----------------------------------------------------
HShell.utils.trace = function (content, source, type) { // type == log, warn, error - default: log
    if (HShell.globalSetup.devMode || HShell.globalSetup.qaMode) {
        var trace = HShell.utils.trace;

        trace.lineNumber++;

        if (!source) source = trace.caller.name;
        if (HShell.globalSetup.ignoreConsoleArray.indexOf(source) == -1 || !source) {
            switch (HShell.globalSetup.consoleEnable) {
                case 0:

                    break;
                case 1:
                    if (HShell.globalSetup.consoleExternalWindow == null || String(HShell.globalSetup.consoleExternalWindow) == 'undefined') {
                        HShell.globalSetup.consoleExternalWindow = window.open(
                            '',
                            'hShellExternalLog',
                            'width=450,height=700, scrollbars=1, resizable=1');
                    }
                    var color = '';
                    if (type == 'warn') {
                        color = '#EC3A43';
                    } else if (type == 'error') {
                        color = '#F3BB00';
                    } else {
                        color = '#FFF';
                    }
                    var html = '';
                    html += '<div class="traceItem rel" style="background-color:' + color + '">' + trace.lineNumber < 10 ? '0' + trace.lineNumber : trace.lineNumber + '.\t\t' + '[' + source + ']: \t' + content + '</div></br>';
                    HShell.globalSetup.consoleExternalWindow.document.write(html);
                    break;

                case 2:
                // console.log('Trace #' + trace.lineNumber + ':');
                // if (typeof type == 'undefined' || (type != 'warn' && type != 'error' && type != 'log')) {
                //     if (console.trace) {
                //         console.trace(content);
                //     } else {
                //         console.log(content);
                //     }
                // } else {
                //     console[type](content);
                // }
                // break;
            }
        }
    }
};

// ----------------------------------------------------
// ----- Adds "replaceAll" to String prototype
// ----------------------------------------------------

String.prototype.replaceAll = function (itemToReolace, replaceWith) {
    var newStr = this.toString();
    do {
        newStr = newStr.replace(itemToReolace, replaceWith);
    } while (newStr.indexOf(itemToReolace) !== -1);
    return newStr;
};

// ----------------------------------------------------
// ----- For module selection we need the container Scroll, but for many other screens no
// ----------------------------------------------------

HShell.utils.scrollTopMainContainer = function () {
    if (!HShell.globalSetup.devMode) {
        $('#mainContentContainer').scrollTop(0);
    }
};

// ----------------------------------------------------
// ----- Combines Click and Enter and Space pressed ________ (Jquery Extention)
// ----------------------------------------------------

$.fn.uniClick = function (func, param1) {
    HShell.utils.tactileFeedback();
    $(this).click({ param1: param1 }, func);
    $(this).keypress(function (e) {
        if (e.keyCode == 13 || e.keycode == 0 || e.keycode == 32 || e.which == 32) {
            HShell.core.ignoreNextEvent();

            e.stopPropagation();
            e.preventDefault();		// --- Sometimes the spacebar scrolls the page
            if (!$(this).is('button') && !$(this).is('input')) {
                $(this).click();
            }
        }
    });
    return this;
};

// ----------------------------------------------------
// ----- Enables the vibator on mobyle device (For Android Only)
// ----------------------------------------------------

HShell.utils.tactileFeedback = function () {
    try {
        window.navigator.vibrate(15);
    } catch (e) {
        HShell.utils.trace('Dose not support tactileFeedback');
    }
};

// ----------------------------------------------------
// ----- Gets the number of properties in a Object
// ----------------------------------------------------

HShell.utils.countProperties = function (obj) {
    var count = 0;

    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            count++;
    }

    return count;
};

// ----------------------------------------------------
// ----- Time manipulation section
// ----------------------------------------------------

HShell.utils.convertSecondsToTime = function (sec, HMS) {
    var returnVal = '';

    var secs = Math.round(sec % 60); if (secs < 10) secs = '0' + secs;

    var mins = Math.floor(sec / 60) % 60; if (mins < 10) mins = '0' + mins;
    var hours = Math.floor(sec / 3600); if (hours < 10) hours = '0' + hours;

    if (HMS) {
        HMS = String(HMS).split('');
        for (var i = 0; i < HMS.length; i++) {
            if (String(HMS[i]).toLowerCase() == 'h') { returnVal += hours; }
            if (String(HMS[i]).toLowerCase() == 'm') { returnVal += mins; }
            if (String(HMS[i]).toLowerCase() == 's') { returnVal += secs; }

            if (i != (HMS.length) - 1) returnVal += ':';
        }
    } else {
        returnVal = hours + ':' + mins + ':' + secs;
    }
    return returnVal;
};

HShell.utils.ConvertMilliSecondsIntoSCORM2004Time = function (intTotalMilliseconds) {
    var ScormTime = "";

    var HundredthsOfASecond;	//decrementing counter - work at the hundreths of a second level because that is all the precision that is required

    var Seconds;	// 100 hundreths of a seconds
    var Minutes;	// 60 seconds
    var Hours;		// 60 minutes
    var Days;		// 24 hours
    var Months;		// assumed to be an "average" month (figures a leap year every 4 years) = ((365*4) + 1) / 48 days - 30.4375 days per month
    var Years;		// assumed to be 12 "average" months

    var HUNDREDTHS_PER_SECOND = 100;
    var HUNDREDTHS_PER_MINUTE = HUNDREDTHS_PER_SECOND * 60;
    var HUNDREDTHS_PER_HOUR = HUNDREDTHS_PER_MINUTE * 60;
    var HUNDREDTHS_PER_DAY = HUNDREDTHS_PER_HOUR * 24;
    var HUNDREDTHS_PER_MONTH = HUNDREDTHS_PER_DAY * (((365 * 4) + 1) / 48);
    var HUNDREDTHS_PER_YEAR = HUNDREDTHS_PER_MONTH * 12;


    HundredthsOfASecond = Math.floor(intTotalMilliseconds / 10);

    Years = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_YEAR);
    HundredthsOfASecond -= (Years * HUNDREDTHS_PER_YEAR);

    Months = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_MONTH);
    HundredthsOfASecond -= (Months * HUNDREDTHS_PER_MONTH);

    Days = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_DAY);
    HundredthsOfASecond -= (Days * HUNDREDTHS_PER_DAY);

    Hours = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_HOUR);
    HundredthsOfASecond -= (Hours * HUNDREDTHS_PER_HOUR);

    Minutes = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_MINUTE);
    HundredthsOfASecond -= (Minutes * HUNDREDTHS_PER_MINUTE);

    Seconds = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_SECOND);
    HundredthsOfASecond -= (Seconds * HUNDREDTHS_PER_SECOND);


    if (Years > 0) {
        ScormTime += Years + "Y";
    }
    if (Months > 0) {
        ScormTime += Months + "M";
    }
    if (Days > 0) {
        ScormTime += Days + "D";
    }

    //check to see if we have any time before adding the "T"
    if ((HundredthsOfASecond + Seconds + Minutes + Hours) > 0) {

        ScormTime += "T";

        if (Hours > 0) {
            if (Hours < 10) {
                Hours = "0" + String(Hours);
            }
            ScormTime += Hours + "H";
        }

        if (Minutes < 10) {
            Minutes = "0" + String(Minutes);
        }
        ScormTime += Minutes + "M";

        if ((HundredthsOfASecond + Seconds) > 0) {
            ScormTime += Seconds;

            if (HundredthsOfASecond > 0) {
                ScormTime += "." + HundredthsOfASecond;
            }

            ScormTime += "S";
        }

    }


    if (ScormTime == "") {
        ScormTime = "0S";
    }

    ScormTime = "P" + ScormTime;

    return ScormTime;
};

HShell.utils.converTimeToSeconds = function (time) {
    var seconds = 0;
    var splitTime = time.split(':');

    switch (true) {
        case splitTime.length === 3:
            seconds += 3600 * Number(splitTime.shift());
            break;

        case splitTime.length >= 2:
            seconds += 60 * Number(splitTime.shift());
            break;

        case splitTime.length === 1:
            seconds += Number(splitTime.shift());
            break;
    }

    return seconds;
};

// ________________________________________________________

HShell.utils.convertDateToTime = function (date) {
    var tempTime = '';
    tempTime = new Date(String(date));
    tempTime = HShell.utils.convertSecondsToTime(3600 * tempTime.getHours() + 60 * tempTime.getMinutes() + tempTime.getSeconds());

    return tempTime;
};

HShell.utils.convertDateToFullTime = function (date) {
    var tempTime = '', month = "", day = "";
    tempTime = new Date(String(date));

    month = (tempTime.getMonth() + 1 < 10 ? ("0" + String(tempTime.getMonth() + 1)) : tempTime.getMonth() + 1);
    day = (tempTime.getDate() < 10 ? ("0" + String(tempTime.getDate())) : tempTime.getDate());

    tempTime = tempTime.getFullYear() + "-" + month + "-" + day + "T" + tempTime.getHours() + ":" + tempTime.getMinutes() + ":" + tempTime.getSeconds() + ".0Z";

    return tempTime;
}

// ----------------------------------------------------
// ----- capitaliseFirstLetter
// ----------------------------------------------------

HShell.utils.capitaliseFirstLetter = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// ----------------------------------------------------
// ----- Converts HTML form CDATA to normal HTML (it is complicated to explain, example: "&lt;" becomes "<")
// ----------------------------------------------------

HShell.utils.decodeHtml = function (html) {
    //if (bowser.msie && bowser.version < 8) return "";		// I bet there was a reason why i put it here, but now i must make it work in prehistoric IE
    return $('<div>' + html + '</div>').html();
};

HShell.utils.encodeHtml = function (html) {
    var el = document.createElement('div');
    el.innerText = el.textContent = html;
    html = el.innerHTML;

    return html;
};

// ----------------------------------------------------
// ----- Locks focus to the DOM Node
// ----------------------------------------------------

HShell.utils.lockFocusToContainer = function (container, button, ariaHiddenElement) {
    var containerChildren = $(container).find('*');
    var allElementsExceptContainer = $(':focusable').not(containerChildren).not(button);

    $.each(allElementsExceptContainer, function () {
        var $this = $(this);
        var tabIndex = $this.attr('tabindex');

        if (!tabIndex)
            tabIndex = 0;
        if (!$this.attr('originalTabIndex')) {
            $this.attr('originalTabIndex', tabIndex);
        }
        $this.attr('tabindex', '-1');
    });

    if (ariaHiddenElement) {
        $(ariaHiddenElement).attr('aria-hidden', true);
    }
};

HShell.utils.unlockFocusFromContainer = function (ariaHiddenElement, lockButton) {
    var allItems = $(':focusable');
    $.each(allItems, function () {
        var $this = $(this);
        var originalTabIndex = $this.attr('originalTabIndex');

        $this.attr('tabindex', originalTabIndex);

        $this.removeAttr('originalTabIndex');
    });

    if (ariaHiddenElement) {
        $(ariaHiddenElement).attr('aria-hidden', false);
    }

    if (lockButton) {
        $(lockButton).focus();
    }
};

// ----------------------------------------------------
// ----- Get browser's scrollbar width
// ----------------------------------------------------

HShell.utils.getScrollbarWidth = function () {
    var outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps

    document.body.appendChild(outer);

    var widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = 'scroll';

    // add innerdiv
    var inner = document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);

    var widthWithScroll = inner.offsetWidth;

    // remove divs
    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;
};

// ----------------------------------------------------
// ----- Convert xml2json
// ----------------------------------------------------

HShell.utils.xml2json = function (object) {
    var lib = new window.X2JS(),
        isString = typeof object === 'string',
        transformFunction = isString ? 'xml_str2json' : 'xml2json';

    return lib[transformFunction](object);
};

// ----------------------------------------------------
// ----- Get file extentions
// ----------------------------------------------------


HShell.utils.getFileExtention = function (str) {
    return str.slice(str.lastIndexOf('.') + 1, str.length);
};

// ----------------------------------------------------
// -----Remove element from array
// ----------------------------------------------------

HShell.utils.removeItemFromArray = function(arr, item){
    var index = arr.indexOf(item),
        newArr = arr.slice();

    if(index !== -1){
        newArr.splice(index, 1);
    }

    return newArr;
};

// ----------------------------------------------------
// -----CSS utils
// ----------------------------------------------------

HShell.utils.miHCalc = function(extra){
    return 'min-height:calc(' + HShell.autoSetup.fullFrameHeight + 'vh ' + extra + ')';
};

/// <reference path="0.imagePreload.js" />
/// <reference path="1.globalVars.js" />
/// <reference path="2.UI.js" />
/// <reference path="3.general.js" />
/// <reference path="3_5.XMLController.js" />
/// <reference path="4.goTo.js" />
/// <reference path="5.assessmentsHandler.js" />
/// <reference path="6.modules.js" />
/// <reference path="7.videoPlayer.js" />
/// <reference path="8.dataStorageController.js" />
/// <reference path="9.system.js" />
/// <reference path="12.accessibility.js" />
/// <reference path="14.qaMode.js" />
/// <reference path="15.interactionPoints.js" />
/// <reference path="16.extranet.js" />
/// <reference path="consts.js"/>

/// <reference path="../_references.js" />

var HShell = window.HShell || {},
    SCORM = window.SCORM || {};

HShell.autoSetup = HShell.autoSetup || {};

SCORM.clientSpecific = {
    suspendData: {
        parseSuspendDataPrefix: function(){}
    }
};

(function () {
    var pipwerks = window.pipwerks || {};

    var scormConnection = pipwerks;
    scormConnection.SCORM.version = '1.2';
    scormConnection.SCORM.handleExitMode = false;				// |rework| Not actually rework, we have to understand what is the connection between this and the green ribbon on jZero

    HShell.autoSetup.SCORM = SCORM;

    // ----------------------------
    // --- SCORM object
    // ----------------------------

    SCORM.user_name = new Array('', 'cmi.core.student_name', 'HShell.savedData.user_name');
    SCORM.user_id = new Array('', 'cmi.core.student_id', 'HShell.savedData.user_id');
    SCORM.selected_language = new Array('', 'cmi.student_preference.language', 'HShell.userData.selected_language');
    SCORM.completion_status = new Array('incomplete', 'cmi.core.lesson_status', 'HShell.savedData.completion_status');
    SCORM.success_status = new Array('unknown', 'cmi.success_status', 'HShell.savedData.success_status');
    SCORM.last_location = new Array('start', 'cmi.core.lesson_location', 'HShell.savedData.last_location');			// --- posible options: 'lang' , 'role', 'pre_a', 'audioAvailable' , 'mod', 'post_a'
    SCORM.suspendData = new Array(new Object(), 'cmi.suspend_data', '');

    SCORM.interactionsSaved = new Array(0, 'cmi.interactions._count');
    SCORM.interactionsArray = new Array();

    SCORM.objectivesSaved = new Array(0, 'cmi.objectives._count');
    SCORM.objectivesArray = new Array();
    SCORM.assessmentObjectivesArray = new Array();
    SCORM.objectivesPreSaved = 0;
    SCORM.score = {
        raw: new Array(0, 'cmi.core.score.raw', ''),
        max: new Array(0, 'cmi.core.score.max'),
        min: new Array(0, 'cmi.core.score.min')
    };
    SCORM.exit = new Array('suspend', 'cmi.core.exit');
    SCORM.courseFinished = false;
    SCORM.progress_measure_pattern = new Array('content_completion_status', 'quiz_completion_status');

    SCORM.getAllStoredData = function () {
        var initStatus = scormConnection.SCORM.init();

        if (initStatus) {
            SCORM.SCORMGetOneItem(SCORM.user_name);
            SCORM.SCORMGetOneItem(SCORM.user_id);
            SCORM.SCORMGetOneItem(SCORM.selected_language);
            SCORM.SCORMGetOneItem(SCORM.completion_status);
            SCORM.SCORMGetOneItem(SCORM.interactionsSaved);
            SCORM.SCORMGetOneItem(SCORM.objectivesSaved);
            SCORM.objectivesSaved[0] = Number(SCORM.objectivesSaved[0]);
            SCORM.SCORMGetOneItem(SCORM.score.raw);
            SCORM.SCORMGetOneItem(SCORM.score.max);
            SCORM.SCORMGetOneItem(SCORM.score.min);
            SCORM.SCORMGetOneItem(SCORM.last_location);
            SCORM.SCORMGetOneItem(SCORM.suspendData);

            SCORM.interactionsArray = [];
            SCORM.objectivesArray = SCORMGetAllObjectives();
            SCORM.assessmentObjectivesArray = SCORMGetAllAssessmentObjectives();
        } else {
            HShell.storage.gotoServerErrorMessage();			// 8.dataStorageController.js
            return false;
        }

        if (String(SCORM.suspendData[0].commitCount) == 'undefined') {
            HShell.savedData.user_name = SCORM.user_name[0];
            return false;
        }
        console.log(SCORM.suspendData);
        return {
            user_name: SCORM.user_name[0],
            user_id: SCORM.user_id[0],
            completion_status: SCORM.completion_status[0],
            last_location: SCORM.last_location[0],
            selected_language: SCORM.selected_language[0] === '' ? 'en' : SCORM.selected_language[0],
            role: SCORM.suspendData[0].role,
            roleCode: SCORM.suspendData[0].roleCode,
            roleNoPreAssessment: SCORM.suspendData[0].roleNoPreAssessment,
            commitCount: SCORM.suspendData[0].commitCount,
            preAFinishedModules: SCORM.suspendData[0].preAFinishedModules,
            posAFinishedModules: SCORM.suspendData[0].posAFinishedModules,
            posAAttempts: SCORM.suspendData[0].posAAttempts,

            interactionsArray: SCORM.interactionsArray,
            interactionsCount: SCORM.interactionsSaved[0],
            objectivesArray: SCORM.objectivesArray,
            assessmentObjectivesArray: SCORM.assessmentObjectivesArray,
            obejectivesCount: SCORM.objectivesSaved[0],
            objectivesPreSaved: SCORM.objectivesPreSaved,
            surveyPassed: SCORM.suspendData[0].surveyPassed,

            timeSpendInsideCoures: SCORM.suspendData[0].timeSpendInCourse,
            modulesCustomData: SCORM.suspendData[0].modulesCustomData
        };
    };

    // ________________________________________________________

    SCORM.SCORMGetOneItem = function(item) {
        var parseSuspendDataPrefix = SCORM.clientSpecific.suspendData.parseSuspendDataPrefix;

        if (typeof (item[0]) == 'object') {
            var tempItem = scormConnection.SCORM.get(item[1]);
            if (tempItem.length > 2) {
                if (tempItem.indexOf('|') != -1) {												// --- Used in the SuspendData field
                    var suspendDataString = tempItem.slice(0, tempItem.indexOf('$'));

                    parseSuspendDataPrefix(suspendDataString);		// --- Parses the String and turns it in to one object with multiple items

                    // console.log('SCORM.selected_language');
                    // console.log(SCORM.selected_language);
                    if (SCORM.selected_language.length < 1 ||
                        SCORM.selected_language[0] == '' ||
                        SCORM.selected_language[0] == 'undefined' ||
                        typeof SCORM.selected_language[0] == 'undefined'
                    ) {
                        var suspendDataStringObj = suspendDataString.split('|');
                        var suspendDataLang = suspendDataStringObj[1];
                        if (suspendDataLang && typeof suspendDataLang == 'string' && suspendDataLang != '') {
                            suspendDataLang = suspendDataLang.replace('LA=', '');
                            console.log('suspendDataLang = ' + suspendDataLang);
                            SCORM.selected_language[0] =
                                suspendDataLang && typeof suspendDataLang == 'string' && suspendDataLang != '' ? suspendDataLang : 'null';
                        } else {
                            SCORM.selected_language[0] = 'null';
                        }
                    }

                    tempItem = tempItem.slice(tempItem.indexOf('$') + 1, tempItem.length);
                }

                if (HShell.contentSetup.SCORM_suspendDataCompression) {
                    item[0] = window.jsonpack.unpack(tempItem);
                } else {
                    item[0] = JSON.parse(tempItem);
                }
            }
        } else {
            item[0] = scormConnection.SCORM.get(item[1]);
        }

    }
    SCORM.SCORMSetOneItem = function(place, value) { return scormConnection.SCORM.set(place, value); }

    // ________________________________________________________
    // --- Get all Objectives

    function SCORMGetAllObjectives() {
        var tempAllObjectives = new Array();

        if (String(SCORM.suspendData[0].objectivesArr) != 'undefined') {
            //if (SCORM.objectivesSaved[0] > SCORM.suspendData[0].objectivesArr.length) {		// --- If the saved objectives are more than the SuspendData objectives, this means that there is pre-assessment item
            //	SCORM.objectivesPreSaved = 1;
            //}

            var increaseBy = 0;
            if (HShell.contentSetup.have_pre_a) {
                increaseBy++;
            }

            if (HShell.contentSetup.have_post_a) {
                increaseBy++;
            }

            for (var i = 0; i < SCORM.suspendData[0].objectivesArr.length; i++) {
                var tempObjective = new Object();
                tempObjective.id = SCORM.suspendData[0].objectivesArr[i].modId;

                tempObjective.scoreRaw = Number(scormConnection.SCORM.get('cmi.objectives.' + (i + increaseBy) + '.score.raw'));
                tempObjective.scoreMax = Number(scormConnection.SCORM.get('cmi.objectives.' + (i + increaseBy) + '.score.max'));
                tempObjective.scoreMin = Number(scormConnection.SCORM.get('cmi.objectives.' + (i + increaseBy) + '.score.min'));
                tempObjective.progress_measure = generateObjectFromProgressMeasure(SCORM.suspendData[0].objectivesArr[i].progMeasure);
                tempObjective.completion_status = scormConnection.SCORM.get('cmi.objectives.' + (i + increaseBy) + '.status'); // completionStatusFromProgressMesure(tempObjective.progress_measure);
                tempObjective.scoreScaled = 0;

                tempAllObjectives.push(tempObjective);
            }

        }
        return tempAllObjectives;
    }

    function SCORMGetAllAssessmentObjectives() {
        var allAssessmentObjectives = new Array();
        var objectivesSaved = parseInt(scormConnection.SCORM.get('cmi.objectives._count'));
        var currentAssessmentObjective = {};
        if (objectivesSaved > 0) {
            if (HShell.contentSetup.have_pre_a) {
                currentAssessmentObjective = {};

                currentAssessmentObjective.id = scormConnection.SCORM.get('cmi.objectives.0.id');
                currentAssessmentObjective.scoreRaw = Number(scormConnection.SCORM.get('cmi.objectives.0.score.raw'));
                currentAssessmentObjective.scoreMax = Number(scormConnection.SCORM.get('cmi.objectives.0.score.max'));
                currentAssessmentObjective.scoreMin = Number(scormConnection.SCORM.get('cmi.objectives.0.score.min'));
                currentAssessmentObjective.completion_status = scormConnection.SCORM.get('cmi.objectives.0.status');

                allAssessmentObjectives.push(currentAssessmentObjective);
            }

            if (HShell.contentSetup.have_post_a) {
                var id = 0;
                if (HShell.contentSetup.have_pre_a) {
                    id = 1;
                }

                currentAssessmentObjective = {};

                currentAssessmentObjective.id = scormConnection.SCORM.get('cmi.objectives.' + id + '.id');
                currentAssessmentObjective.scoreRaw = Number(scormConnection.SCORM.get('cmi.objectives.' + id + '.score.raw'));
                currentAssessmentObjective.scoreMax = Number(scormConnection.SCORM.get('cmi.objectives.' + id + '.score.max'));
                currentAssessmentObjective.scoreMin = Number(scormConnection.SCORM.get('cmi.objectives.' + id + '.score.min'));
                currentAssessmentObjective.completion_status = scormConnection.SCORM.get('cmi.objectives.' + id + '.status');

                allAssessmentObjectives.push(currentAssessmentObjective);
            }
        }

        return allAssessmentObjectives;
    }

    function completionStatusFromProgressMesure(pm) {		// --- 'pm' stands for progress measure
        var notAttCout = 0;
        var completeCount = 0;

        $(pm).each(function (i, item) {
            if (item === 'not attempted') { notAttCout++; }
            if (item === 'completed') { completeCount++; }
        });

        if (completeCount === pm.length) return 'completed';
        if (notAttCout === pm.length) return 'not attempted';
        return 'incomplete';
    }

    // ________________________________________________________
    // --- Commit data

    SCORM.continueWithCommit = function (data) {
        SCORMsaveChangedItem(SCORM.selected_language);
        SCORMsaveChangedItem(SCORM.completion_status);
        SCORMsaveChangedItem(SCORM.last_location);

        getSuspendData(data);
        SCORMsaveSuspendData();

        // var sessionTime = HShell.utils.ConvertMilliSecondsIntoSCORM2004Time(HShell.autoSetup.sessionTime * 1000);
        SCORM.SCORMSetOneItem('cmi.core.session_time', HShell.autoSetup.sessionTime * 1000);

        SCORMsaveChangedInteractions();
        SCORMsaveChangedSurvey();
        SCORMsaveChangedObjectives();
        SCORM.SCORMsaveChangedAssessmentObjectives();

        var result = scormConnection.SCORM.data.save();
        if (SCORM.exit[1] == 'suspend') SCORM.SCORMSetOneItem(SCORM.exit[1], SCORM.exit[0]);

        HShell.utils.trace(result, 'SCORM.commit: ');
        if (String(result) == 'false') {
            HShell.storage.gotoServerErrorMessage();
        }
    };

    function SCORMsaveChangedItem(item) {
        var subItems = item[2].split('.');							// Gets the element form the HShell object  (it dose it via string to remove the possibility for object references)
        var tempHshell = window[subItems[0]];
        for (var i = 1; i < subItems.length; i++) { tempHshell = tempHshell[subItems[i]]; }

        if (item[0] != tempHshell) {
            item[0] = tempHshell;
            SCORM.SCORMSetOneItem(item[1], item[0]);
            HShell.utils.trace(item[1], 'SCORM.saveData: ');
        }
    }

    function SCORMsaveSuspendData() {
        var clientSuspendData,
            prefixData;

        SCORM.clientSpecific.suspendData = SCORM.clientSpecific.suspendData || { getData: function () { } };
        clientSuspendData = SCORM.clientSpecific.suspendData;
        prefixData = clientSuspendData.getPrefixData();																// --- gets all the dynamically collected data just before storing in the to LMS

        var itemString = SCORM.suspendData[0];

        if (clientSuspendData.structure) { itemString = clientSuspendData.structure(itemString); }
        if (typeof SCORM.suspendData[0] === 'object') { itemString = JSON.stringify(itemString); }
        if (HShell.contentSetup.SCORM_suspendDataCompression) {
            itemString = jsonpack.pack(itemString);
        }
        if (prefixData) { itemString = prefixData + itemString; }		// --- Adds CS Prefix if needed
        if (clientSuspendData.sufix) { itemString = itemString + clientSuspendData.sufix; }		// --- Adds CS Suffix if needed

        SCORM.SCORMSetOneItem(SCORM.suspendData[1], itemString);
    }

    function SCORMsaveChangedInteractions() {
        if (HShell.contentSetup.have_pre_a) {
            getOneInteractionType(HShell.content.preAssessObj, 'pre');
        }
        if (HShell.contentSetup.have_post_a) {
            getOneInteractionType(HShell.content.postAssessObj, 'post');
        }
        if (HShell.contentSetup.have_final_survey) {
            getOneInteractionType(HShell.content.finalSurveyObj, 'post');
        }
    }

    function SCORMsaveChangedSurvey() {
        if (HShell.contentSetup.have_survey) {
            getOneInteractionType(HShell.content.surveyObj, 'survey');
        }
    }

    function getOneInteractionType(aObj, sections) {
        if (!aObj || !aObj.answersArray) {
            return;
        }
        $(aObj.answersArray).each(function (i, item) {
            if (item.interactionIsSaved) {
                return true;
            }

            var modId = 0,
                modGId = 0;

            $(SL.allModules).each(function (index, itemX) {
                if (item.assessmentModuleId == itemX.mod_id) {
                    modId = itemX.moduleInGroupId + 1;
                    modGId = itemX.moduleGroupId + 1;
                }
            });

            // --- |rework| Please change the names of the variables to make more sense, so that there is no need for comments

            var tempObj = {
                modId: modId,			// --- The ID of the module inside the module group
                modGId: modGId,			// --- The ID of the module group

                module: (aObj.answersArray[i].assessmentModuleId - 1),			// --- The ID of the module (starting from 1 and incrementing 1 for every new module)
                quizArrayId: item.questionGroupId,									// --- The ID of the group of questions
                questionArrId: item.questionId,										// --- The ID of the specific question inside its group
                type: aObj.answersArray[i].questionType,
                sections: sections,

                questionText: aObj.answersArray[i].questionText,
                description: aObj.answersArray[i].selectedItemText,
                learnerResponse: aObj.answersArray[i].learnerResponse,
                result: aObj.answersArray[i].correctState,
                correctAnswer: aObj.answersArray[i].correctAnswer,
                weighting: Math.round(100 / aObj.answersArray.length),
                timeStamp: HShell.utils.convertDateToTime(aObj.answersArray[i].timeStamp),
                latency: HShell.utils.convertSecondsToTime(aObj.answersArray[i].latency),
                attempt: aObj.attempts
            };

            saveOneIneraction(tempObj);		// Inside client specific
            item.interactionIsSaved = true;
        });
    }

    function SCORMsaveChangedObjectives() {
        var tempOriginal = new Array();
        var indexOffset = SCORM.assessmentObjectivesArray.length;		// --- |rework| this must not exist, the logic is somewhat flawed and it requires flag for the initial save, after you close the course and restore it will not need this
        var tempNumberArr = [];	// --- Used for temporary storing the number of the objective inside the group

        $(SL.allModules).each(function (i, item) {
            var compleation = String(item.completion_status).toLowerCase();
            var progress_measure = generateProgressMesarueFromObject(item);
            var scoreRaw = 0;
            var scoreScaled = 0;
            var tempObjectiveId = item.objectiveId + indexOffset;

            if (compleation == 'completed') {
                scoreRaw = 100;
                scoreScaled = 1;
            }
            if (String(tempNumberArr[Number(item.moduleGroupId)]) == 'undefined') {
                tempNumberArr[Number(item.moduleGroupId)] = 1;
            } else {
                tempNumberArr[Number(item.moduleGroupId)] = Number(tempNumberArr[Number(item.moduleGroupId)]) + 1;
            }
            tempOriginal.push({
                id: 'Mod_' + (item.moduleGroupId + 1) + '_' + tempNumberArr[Number(item.moduleGroupId)],
                objectiveId: Number(tempObjectiveId),
                scoreMax: 100,
                scoreMin: 0,
                scoreRaw: scoreRaw,
                scoreScaled: scoreScaled,
                completion_status: item.completion_status,
                progress_measure: progress_measure
            });
        });


        $(tempOriginal).each(function (i, item) {
            if (String(SCORM.objectivesArray[i + SCORM.objectivesPreSaved]) != 'undefined') {			// --- If there is such objective saved and there is difference form the new one -> update it
                var tempOriginalItem = JSON.stringify(item);
                var tempCopyItem = JSON.stringify(SCORM.objectivesArray[i + SCORM.objectivesPreSaved]);


                if (tempOriginalItem != tempCopyItem) {
                    SCORM.objectivesArray[i + SCORM.objectivesPreSaved] = JSON.parse(tempOriginalItem);
                    saveOneObjective(item);
                }
            } else {																						// --- Else -> create it
                SCORM.objectivesArray[i + SCORM.objectivesPreSaved] = JSON.parse(JSON.stringify(item));
                saveOneObjective(item);
                SCORM.objectivesSaved[0]++;
            }
        });
    }

    SCORM.SCORMsaveChangedAssessmentObjectives = function () {
        if (SCORM.assessmentObjectivesArray.length !== 0) {
            var tempNew = [];
            var tempSaved = [];

            if (HShell.contentSetup.have_pre_a) {
                tempNew.push({
                    scoreRaw: typeof HShell.content.preAssessObj.quizArray !== 'undefined' &&
                        HShell.content.preAssessObj.quizArray.length !== 0 &&
                        HShell.content.preAssessObj.correctAnswers == HShell.content.preAssessObj.quizArray.length
                        ? 100
                        : 0,
                    completion_status: HShell.content.preAssessObj.completion_status || 'not attempted'
                });

                tempSaved.push({
                    scoreRaw: SCORM.assessmentObjectivesArray[0].scoreRaw,
                    completion_status: SCORM.assessmentObjectivesArray[0].completion_status
                });
            }

            if (HShell.contentSetup.have_post_a) {
                tempNew.push({
                    scoreRaw: typeof HShell.content.postAssessObj.quizArray !== 'undefined' &&
                        HShell.content.postAssessObj.quizArray.length !== 0 &&
                        HShell.content.postAssessObj.correctAnswers == HShell.content.postAssessObj.quizArray.length ?
                        100 :
                        0,
                    completion_status: HShell.content.postAssessObj.completion_status || 'not attempted'
                });

                var id = 0;
                if (HShell.contentSetup.have_pre_a) {
                    id = 1;
                }
                tempSaved.push({
                    scoreRaw: SCORM.assessmentObjectivesArray[id].scoreRaw,
                    completion_status: SCORM.assessmentObjectivesArray[id].completion_status
                });
            }

            for (var i = 0; i < SCORM.assessmentObjectivesArray.length; i++) {
                if (tempNew[i].completion_status != '' && tempNew[i].completion_status != 'not attempted') {
                    var tempSavedItem = JSON.stringify(tempSaved[i]);
                    var tempNewItem = JSON.stringify(tempNew[i]);

                    if (tempSavedItem != tempNewItem) {
                        SCORM.assessmentObjectivesArray[i].scoreRaw = tempNew[i].scoreRaw;
                        SCORM.assessmentObjectivesArray[i].completion_status = tempNew[i].completion_status;
                        SCORM.assessmentObjectivesArray[i].objectiveId = i;
                        saveOneObjective(SCORM.assessmentObjectivesArray[i]);
                    }
                }
            }
        } else {
            if (HShell.contentSetup.have_pre_a) {
                SCORM.assessmentObjectivesArray[0] = {
                    id: 'Pre_assessment',
                    objectiveId: 0,
                    scoreMax: 100,
                    scoreMin: 0,
                    scoreRaw: 0,
                    scoreScaled: 0,
                    completion_status: 'not attempted',
                    progress_measure: 1
                };

                saveOneObjective(SCORM.assessmentObjectivesArray[0]);
            }

            if (HShell.contentSetup.have_post_a) {
                var id = 0;
                if (HShell.contentSetup.have_pre_a) {
                    id++;
                }
                SCORM.assessmentObjectivesArray[id] = {
                    id: 'Post_assessment',
                    objectiveId: id,
                    scoreMax: 100,
                    scoreMin: 0,
                    scoreRaw: 0,
                    scoreScaled: 0,
                    completion_status: 'not attempted',
                    progress_measure: 1
                };
                saveOneObjective(SCORM.assessmentObjectivesArray[id]);
            }
        }
    };

    function saveOneObjective(item) {
        var i = item.objectiveId;

        SCORM.SCORMSetOneItem('cmi.objectives.' + i + '.id', item.id);
        logLMSResponse('cmi.objectives.' + i + '.id', item.id);

        SCORM.SCORMSetOneItem('cmi.objectives.' + i + '.score.raw', item.scoreRaw);
        logLMSResponse('cmi.objectives.' + i + '.score.raw', item.scoreRaw);

        SCORM.SCORMSetOneItem('cmi.objectives.' + i + '.score.max', item.scoreMax);
        logLMSResponse('cmi.objectives.' + i + '.score.max', item.scoreMax);

        SCORM.SCORMSetOneItem('cmi.objectives.' + i + '.score.min', item.scoreMin);
        logLMSResponse('cmi.objectives.' + i + '.score.min', item.scoreMin);

        SCORM.SCORMSetOneItem('cmi.objectives.' + i + '.status', item.completion_status);
        logLMSResponse('cmi.objectives.' + i + '.status', item.completion_status);

        //SCORM.SCORMSetOneItem('cmi.objectives.' + i + '.progress_measure', item.progress_measure);
    }

    function logLMSResponse(field, value) {
        if (!HShell.globalSetup.demoMode && !HShell.contentSetup.isExtranetCourse) {
            var responseCode = scormConnection.SCORM.API.handle.LMSGetLastError();
            var responseMsg = scormConnection.SCORM.API.handle.LMSGetErrorString(responseCode);
            HShell.utils.trace(field + ' = ' + value);
            HShell.utils.trace(responseCode + ' ' + responseMsg);
        }
    }

    function generateProgressMesarueFromObject(obj) {
        var progM = 0;
        var precision = 10000;      // --- Used to prevent floating point math error

        for (var i = 0; i < SCORM.progress_measure_pattern.length; i++) {
            var temp = progMCompletionStatusToNumber(obj[SCORM.progress_measure_pattern[i]]);
            temp = temp * Math.pow(10, -(i + 1));
            if (temp != 'Infinity' && temp != 'NaN') progM = Math.round((progM * precision) + (precision * temp)) / precision;
        }

        return progM;
    }
    function progMCompletionStatusToNumber(status) {
        var number = 0;

        switch (status) {
            case 'unknown': number = 0; break;        // --- not existing
            case 'not attempted': number = 1; break;        // --- not started
            case 'incomplete': number = 2; break;        // --- started but not finished
            case 'completed': number = 3; break;
        }

        return number;
    }

    function generateObjectFromProgressMeasure(progress_measure) {
        var progM = Number(progress_measure);
        var precision = 10000;      // --- Used to prevent floating point math error
        var positionInPattern = 0;
        var result = new Array();

        do {
            var tempNum = progM * 10;
            var wholePart = Math.floor(tempNum);
            var progM = Math.floor(tempNum * precision - wholePart * precision) / precision;

            result[positionInPattern] = progMNumberToCompletionStatus(wholePart);

            positionInPattern++;
        } while (progM != 0);

        return result;
    }

    function progMNumberToCompletionStatus(status) {
        switch (status) {
            case 0: status = 'unknown'; break;
            case 1: status = 'not attempted'; break;
            case 2: status = 'incomplete'; break;
            case 3: status = 'completed'; break;
        }
        return status;
    }

    function getSuspendData(data) {
        var surveyPassed = HShell.content.surveyObj.finished || false,
            runOnDesktop = +(HShell.autoSetup.runOn.deviceType === HShell.consts.deviceType.desktop);

        SCORM.suspendData[0].deviceType = {MB: +!runOnDesktop, DT: runOnDesktop};
        SCORM.suspendData[0].role = HShell.content.selected_roleObj.code;
        SCORM.suspendData[0].roleCode = HShell.content.selected_roleObj.roleCode;
        SCORM.suspendData[0].roleNoPreAssessment = HShell.content.roleNoPreAssessment;
        SCORM.suspendData[0].commitCount = HShell.autoSetup.commitCount++;
        SCORM.suspendData[0].preAFinishedModules = HShell.content.preAssessObj.finishedModules;
        SCORM.suspendData[0].posAFinishedModules = HShell.autoSetup.postAssessFinishedModules;
        SCORM.suspendData[0].posAAttempts = HShell.content.postAssessObj.attempts;
        SCORM.suspendData[0].objectivesArr = fillSuspendDataObjectives();
        SCORM.suspendData[0].interactionsArr = fillSuspendDataInteractions();
        SCORM.suspendData[0].timeSpendInCourse = HShell.autoSetup.timeSpendInsideCoures;
        SCORM.suspendData[0].surveyPassed = surveyPassed;
        // disable to reduce suspend data size. The field has limited size (4000 chars) on SAP
        // SCORM.suspendData[0].modulesCustomData = data.modulesCustomData;

        if(HShell.userData.selected_brand){
            SCORM.suspendData[0].brand = HShell.userData.selected_brand;
        }
    }

    function fillSuspendDataObjectives() {
        var objectivesArr = new Array();

        if (String(SL.allModules) !== 'undefined') {
            for (var i = 0; i < SL.allModules.length; i++) {
                var tempObj = {};
                tempObj.modId = 'Mod_' + SL.allModules[i].moduleGroupId + '_' + SL.allModules[i].mod_id;
                tempObj.type = SL.allModules[i].type;
                tempObj.progMeasure = generateProgressMesarueFromObject(SL.allModules[i]);

                objectivesArr.push(tempObj);
            }
        }

        return objectivesArr;
    }

    function fillSuspendDataInteractions() {
        var interactionsArr = new Array();



        return interactionsArr;
    }

    SCORM.saveDataOnUnload = function () {
        if (!SCORM.courseFinished) {
            var data = HShell.storage.getCommitData();

            SCORM.continueWithCommit(data);
            scormConnection.SCORM.set('cmi.core.exit', 'suspend');
            scormConnection.SCORM.quit();
        }
    };

    // ________________________________________________________

    SCORM.continueWithSetCourseAsCompleated = function () {
        SCORM.SCORMSetOneItem('cmi.core.session_time', HShell.autoSetup.sessionTime * 1000);

        SCORM.SCORMSetOneItem(SCORM.completion_status[1], 'completed');
        SCORM.SCORMSetOneItem(SCORM.score.raw[1], 100);
        SCORM.SCORMSetOneItem(SCORM.score.min[1], 0);
        SCORM.SCORMSetOneItem(SCORM.score.max[1], 100);
        SCORM.SCORMSetOneItem('cmi.progress_measure', 1);
        SCORM.SCORMSetOneItem(SCORM.exit[1], '');

        SCORM.courseFinished = true;
    };

    SCORM.continueWithsaveCourseEndData = function () {
        // scormConnection.SCORM.connection.terminate();
        SCORM.continueWithSetCourseAsCompleated();
    };

    //	SCORM.saveSuspendData = function(){        SCORM.saveItem( 'cmi.suspend_data', JSON.stringify( SCORM.suspendData ) );        }
    //
})();
