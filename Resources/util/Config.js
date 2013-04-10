/**
 * @author dlafuente
 */

var config = new function(){
	//self reference
	var self = this;
	//Set geolocation purpose
	Ti.Geolocation.purpose = "To show nearby hotels";
	//System info
	var osname = Ti.Platform.osname,
		version = Ti.Platform.version,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;
	Ti.API.info("Platform name: " + Ti.Platform.name + " - width: " + width + " - height: " + height + " - version: " + version);
	//Is tablet?
	self.isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));
	//Base URL
	self.BASE_URL = "http://54.246.80.107/api/";
	//default location
	self.LATITUDE_BASE = 39.475337;
	self.LONGITUDE_BASE = 3.150673;
	//load this default location into local properties
	Ti.App.Properties.setObject('location', {latitude: self.LATITUDE_BASE, longitude: self.LONGITUDE_BASE});
	//test mode
	self.TEST_MODE = true;
	
	return self;
};

module.exports = config;
