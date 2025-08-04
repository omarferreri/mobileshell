var ieVersion = (function () {
    //Set defaults
    var value = {
        isIE: false,
        trueVersion: 0,
        actingVersion: 0,
        compatibilityMode: false
    };

    //Try to find the Trident version number
    var trident = navigator.userAgent.match(/Trident\/(\d+)/);
    if (trident) {
        value.isIE = true;
        //Convert from the Trident version number to the IE version number
        value.trueVersion = parseInt(trident[1], 10) + 4;
    }

    //Try to find the MSIE number
    var msie = navigator.userAgent.match(/MSIE (\d+)/);
    if (msie) {
        value.isIE = true;
        //Find the IE version number from the user agent string
        value.actingVersion = parseInt(msie[1]);
    } else {
        //Must be IE 11 in "edge" mode
        value.actingVersion = value.trueVersion;
    }

    //If we have both a Trident and MSIE version number, see if they're different
    if (value.isIE && value.trueVersion > 0 && value.actingVersion > 0) {
        //In compatibility mode if the trident number doesn't match up with the MSIE number
        value.compatibilityMode = value.trueVersion != value.actingVersion;
    }

    return value;
})();