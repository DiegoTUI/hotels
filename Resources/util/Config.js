/**
 * @author dlafuente
 */

var Config = new function(){
	//self reference
	var self = this;
	//Base URL
	self.BASE_URL = "http://54.246.80.107/api/";
	//default location
	self.LATITUDE_BASE = 39.475337;
	self.LONGITUDE_BASE = 3.150673;
	//test mode
	self.TEST_MODE = false;
	//load this default location into local properties
	Ti.App.Properties.setObject('location', {latitude: self.LATITUDE_BASE, longitude: self.LONGITUDE_BASE});
	
	return self;
};

module.exports = Config;
