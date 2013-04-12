/**
 * @author Diego Lafuente
 */

var StreetViewWindow = function (longitude, latitude) {
	var config = require("util/config");
	//set latitude and longitude to base if not defined
	latitude = latitude == null ? config.LATITUDE_BASE : latitude;
	longitude = longitude == null ? config.LONGITUDE_BASE : longitude;
	//base window
	var BaseWindow = require('ui/handheld/BaseWindow');
	//self-reference
	var self = new BaseWindow("streetView");
	//add webview
	var web = Ti.UI.createWebView({
		url: "/ui/common/streetview.html"
	});
	web.addEventListener('load', function() {
            web.evalJS("initSV(" + latitude + "," + longitude + ")");
	});
	self.add(web);
	
	return self;
};

module.exports = StreetViewWindow;