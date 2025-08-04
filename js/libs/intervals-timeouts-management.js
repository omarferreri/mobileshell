window.timeoutList = new Array();
window.intervalList = new Array();

window.oldSetTimeout = window.setTimeout;
window.oldSetInterval = window.setInterval;
window.oldClearTimeout = window.clearTimeout;
window.oldClearInterval = window.clearInterval;

window.setTimeout = function (code, delay) {
    //console.log(delay + 'ms, setTimeout: ' + arguments.callee.caller.name);
    var retval = window.oldSetTimeout(code, delay);
    window.timeoutList.push(retval);
    return retval;
};
window.clearTimeout = function (id) {
    //console.log('clearTimeout: ' + arguments.callee.caller.name);
    var ind = window.timeoutList.indexOf(id);
    if (ind >= 0) {
        window.timeoutList.splice(ind, 1);
    }
    var retval = window.oldClearTimeout(id);
    return retval;
};
window.setInterval = function (code, delay) {
    var retval = window.oldSetInterval(code, delay);
    //console.log('#' + retval + ' ' + delay + 'ms, setInterval: ' + arguments.callee.caller.name);
    window.intervalList.push(retval);
    return retval;
};
window.clearInterval = function (id) {
    //console.log('#' + id + ' clearInterval: ' + arguments.callee.caller.name);
    var ind = window.intervalList.indexOf(id);
    if (ind >= 0) {
        window.intervalList.splice(ind, 1);
    }
    var retval = window.oldClearInterval(id);
    return retval;
};
window.clearAllTimeouts = function () {
    for (var i in window.timeoutList) {
        window.oldClearTimeout(window.timeoutList[i]);
    }
    window.timeoutList = new Array();
};
window.clearAllIntervals = function () {
    for (var i in window.intervalList) {
        window.oldClearInterval(window.intervalList[i]);
    }
    window.intervalList = new Array();
};