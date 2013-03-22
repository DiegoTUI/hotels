/**
 * @author dlafuente
 */

var network = new function(){
	//self reference
	var self = this;
	//Config options
	var config = require('util/config');
	var util = require('util/util');
	//Busy
	var isBusy = false;
	
	//get hotels
	self.getHotels = function(region, callback){
		isBusy = true;
		var xhr = Titanium.Network.createHTTPClient();
		xhr.onload = function() {
			Ti.API.info("Connection loaded. Callback.");
			var responseJSON = util.isolateJSON(xhr.responseText);
			callback(JSON.parse(responseJSON));
			isBusy = false;
			count++;
		};
		Ti.API.info("Opening connection: " + config.BASE_URL + 'get_hotels.php?params=' + JSON.stringify(region));
		xhr.open("GET", config.BASE_URL + 'get_hotels.php?params=' + JSON.stringify(region));
		xhr.send();
	}
	
	//Returns if if has finised the query
	self.finished = function(){
		return !(isBusy);
	}
	
	return self;
};

module.exports = network;
