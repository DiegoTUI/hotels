/**
 * @author dlafuente
 */

var MapWindow = function (region) {
	//base window
	var BaseWindow = require('ui/handheld/BaseWindow');
	//self-reference
	var self = new BaseWindow("map");
	//menu and/or backbutton
	if (Ti.Platform.osname === 'iphone') {
		var button = Titanium.UI.createButton({
			title:L('currentLocation'),
			style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
		});
		self.setRightNavButton(button);
	}
	else if (Ti.Platform.osname === 'android'){
		self.addEventListener('open', function() {
			Ti.API.info("Entered the open event: " + self.getTitle());
			var activity = self.activity;
			activity.onCreateOptionsMenu = function(e) {
				Ti.API.info("Entered onCreateOptionsMenu");
				var menu = e.menu;
				//Menu for map tab
				var m1 = menu.add({ title : L('currentLocation'),
									itemId: 1 });
			}
		});
	}
	else if ((Ti.Platform.osname === 'mobileweb')) {
		Ti.API.info("Entered the focus event: " + self.getTitle());
		var button = Titanium.UI.createButton({
			title:L('currentLocation')
		});
		self.setRightNavButton(button);
	}
	//mapView
	var MapView = require('ui/handheld/MapView');
	self.mapView = new MapView(region);
	Ti.API.info("About to add mapView to Map Window");
	self.add(self.mapView);
	
	return self;
};

module.exports = MapWindow;