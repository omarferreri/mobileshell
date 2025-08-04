/// <reference path="../_references.js" />

var HShell = window.HShell || {};
var bowser = window.bowser || {};

(function(){
    HShell.core = HShell.core || {};
    HShell.core.runningOn = function () {
        var navApp = String(navigator.appVersion).toLowerCase();

        // Globally assessable
        this.OS = '';					        // the value can be: "android", "iOS", "windows", "windowsPhone', "osX";
        this.deviceType = '';					// the value can be: 'desktop' 	or	'mobile';
        this.formFactor = '';					// the value can be: 'phone', 'tablet', 'desktop';
        this.deviceName = '';					// for now it only shows 'iPad' or 'iPhone';
        this.version = bowser.version || getIeVersion();		    // the version of the browser;
        this.browserName = '';					// the value can be: 'chrome', 'IE', 'firefox', 'safari'

        // the 'OS' variable is lower case and one word

        // Desktop
        if (bowser.msie == true && navApp.indexOf('lumia') == -1 && navApp.indexOf('wpdesktop') == -1) {
            this.OS = 'windows'; this.deviceType = 'desktop'; this.formFactor = 'desktop'; this.browserName = 'IE';
        }
        if (navApp.indexOf('macintosh') != -1) { this.OS = 'osX'; this.deviceType = 'desktop'; this.formFactor = 'desktop'; }
        if (bowser.firefox == true) { this.browserName = 'firefox'; }
        if (bowser.chrome == true) { this.browserName = 'chrome'; }

        if (navApp.indexOf('windows') != -1) { this.OS = 'windows'; this.deviceType = 'desktop'; this.formFactor = 'desktop'; }

        // Mobile
        if (navApp.indexOf('android') != -1 && navApp.indexOf(' trident') == -1) { this.OS = 'android'; this.deviceType = 'mobile'; this.formFactor = 'phone'; }
        if (navApp.indexOf('ipad') != -1) { this.OS = 'iOS'; this.deviceType = 'mobile'; this.formFactor = 'tablet'; this.deviceName = 'ipad'; }
        if (navApp.indexOf('iphone') != -1 && navApp.indexOf('lumia') == -1) { this.OS = 'iOS'; this.deviceType = 'mobile'; this.formFactor = 'phone'; this.deviceName = 'iphone'; }
        if (navApp.indexOf('windows') != -1 && (navApp.indexOf('lumia') != -1 || navApp.indexOf('wpdesktop') != -1 || navApp.indexOf('windows phone') != -1)) {
            this.OS = 'windowsPhone'; this.deviceType = 'mobile'; this.formFactor = 'phone'; this.deviceName = 'lumia'; this.browserName = 'IE';
        }

        if (navApp.indexOf('safari') != -1 && bowser.chrome != true && navApp.indexOf('trident') == -1 && navApp.indexOf('ipad') == -1 && navApp.indexOf('iphone') == -1) {
            this.deviceType = 'desktop'; this.formFactor = 'desktop'; this.browserName = 'safari';
        }
        if (navApp.indexOf('safari') != -1 && bowser.chrome != true && navApp.indexOf('trident') == -1) {
            this.browserName = 'safari';
        }

        if(!this.browserName){
            this.browserName = navigator.userAgent.indexOf('MSIE') !== -1 ? 'IE': undefined;
        }
    };

    function getIeVersion(){
        var userAgent = navigator.userAgent,
            isIe7 = userAgent.indexOf('MSIE 7.0') !== -1,
            isIe8 =  userAgent.indexOf('MSIE 8.0') !== -1,
            version;

        if(isIe7) version = '7.0';
        if(isIe8) version = '8.0';

        return version;
    }

})();
