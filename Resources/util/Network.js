/**
 * @author dlafuente
 */

var Network = new function(){
	//self reference
	var self = this;
	//Config options
	var Config = require('util/Config');
	var Util = require('util/Util');
	//Busy
	var isBusy = false;
	
	//get hotels
	self.getHotels = function(region, callback){
		isBusy = true;
		var xhr = Titanium.Network.createHTTPClient();
		xhr.onload = function() {
			Ti.API.info("Connection loaded. Callback.");
			var responseJSON = Util.isolateJSON(xhr.responseText);
			callback(JSON.parse(responseJSON));
			isBusy = false;
			count++;
		};
		Ti.API.info("Opening connection: " + Config.BASE_URL + 'get_hotels.php?params=' + JSON.stringify(region));
		xhr.open("GET", Config.BASE_URL + 'get_hotels.php?params=' + JSON.stringify(region));
		xhr.send();
	}
	
	//Returns if if has finised the query
	self.finished = function(){
		return !(isBusy);
	}
	
	return self;
};

module.exports = Network;
