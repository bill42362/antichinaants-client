'use strict'
const MersenneTwister = require('mersenne-twister');

if(undefined === window.Core) { window.Core = function() {}; };
Core.object = function() {
	return this;
}; Core.object.prototype = Core.prototype;

Core.random = Math.random;
if(window.MersenneTwister) {
    Core.mersenneTwister = new MersenneTwister();
    Core.random = function() { return Core.mersenneTwister.random_long(); }
}

Core.getCookieByName = function(name) {
	var cookieValue = null;
	if (document.cookie && document.cookie != '') {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = jQuery.trim(cookies[i]);
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) == (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}

Core.parseDate = function(date) {
    var result;
    if(isNaN(date)) { result = new Date(date); }
    else { result = new Date(date * 1000); }
    return result != 'Invalid Date' ? result : undefined;
}

Core.iterateObject = function(object, func) {
    for(var property in object) {
        if(object.hasOwnProperty(property)) {
            if(object[property] instanceof Array) {
                object[property] = object[property].map(function(item) {
                    return Core.iterateObject(item, func);
                });
            } else if(object[property] instanceof Object) {
                object[property] = Core.iterateObject(object[property], func);
            } else {
                object[property] = func(object[property]);
            }
        }
    }
    return object;
}

Core.getDateStringWithFormat = function(timestamp, format) {
    function pad(num, size) {
        var s = num + "";
        s = s.slice(-size);
        while(s.length < size) { s = "0" + s; }
        return s;
    }
    var dayStringList = ['日', '一', '二', '三', '四', '五', '六'];
    var dateObject = undefined;
    if(1000000000000 > timestamp) { dateObject = new Date(timestamp*1000); }
    else { dateObject = new Date(timestamp); }
    var matchYear = format.match(/Y/g);
    if(matchYear) { format = format.replace(/[Y]+/, pad(dateObject.getFullYear(), matchYear.length)); }
    var matchMonth = format.match(/M/g);
    if(matchMonth) { format = format.replace(/[M]+/, pad(dateObject.getMonth() + 1, matchMonth.length)); }
    var matchDate = format.match(/D/g);
    if(matchDate) { format = format.replace(/[D]+/, pad(dateObject.getDate(), matchDate.length)); }
    if(!!format.match(/d/g)) { format = format.replace(/[d]+/, dayStringList[dateObject.getDay()]); }
    var matchHours = format.match(/h/g);
    if(matchHours) { format = format.replace(/[h]+/, pad(dateObject.getHours(), matchHours.length)); }
    var matchMinutes = format.match(/m/g);
    if(matchMinutes) { format = format.replace(/[m]+/, pad(dateObject.getMinutes(), matchMinutes.length)); }
    var matchSeconds = format.match(/s/g);
    if(matchSeconds) { format = format.replace(/[s]+/, pad(dateObject.getSeconds(), matchSeconds.length)); }
    return format;
}

Core.newUuid = function() {
    var regexp = new RegExp('[xy]', 'g');
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(regexp, function(c) {
        var r = Core.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

Core.getUrlSearches = function() {
    var result = {};
    var searches = window.location.search;
    searches = searches.slice(1).split('&');
    searches.map(function(search) {
        var pair = search.split('=');
        result[pair[0]] = pair[1];
    }, this);
    return result;
}

module.exports = Core;
window.Core = Core;
