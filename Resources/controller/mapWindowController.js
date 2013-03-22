/**
 * @author dlafuente
 */

var mapWindowController = new function(){
	//self reference
	var self = this;
	//config
	var config = require('util/config');
	//path to the right window
	var middledir = config.isTablet ? "handheld" : "handheld";
	//force reload hotels
	var forceReload = true;
	//Current mapframe
	var currentRegion = {
		latitude: Ti.App.Properties.getObject('location').latitude,
		longitude: Ti.App.Properties.getObject('location').longitude,
		animate:true,
		latitudeDelta:0.01,
		longitudeDelta:0.01
	};
	//the window
	var MapWindow = require('ui/' + middledir + '/MapWindow')
	self.theWindow = new MapWindow(currentRegion);
	/*
	 * Actions, listeners and events
	 */
	//menus and/or rightNavButton
	if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'mobileweb'){
		var navRightButton = theWindow.getRightNavButton;
		navRightButton.addEventListener('click',function() {
			updateUserLocation();
		});
	}
	else if (Ti.Platform.osname === 'android'){
		self.theWindow.addEventListener('focus', function() {
			Ti.API.info("Entered the focus event: " + self.theWindow.getTitle());
			var activity = self.theWindow.activity;
			activity.onPrepareOptionsMenu = function(e) {
				var menu = e.menu;
				menu.findItem(1).setVisible(true);
				menu.findItem(1).addEventListener('click', function(e) {
					updateUserLocation();
				});
			}
		});
	}
	//listener for region changed
	if (parseInt(Ti.Platform.version.charAt(0)) < 3)
		self.theWindow.mapView.addEventListener('regionChanged', regionChanged);
	else
		self.theWindow.mapView.addEventListener('regionchanged', regionChanged);
	//listener for hotels loaded
	Ti.App.addEventListener("app:hotelsLoaded", function(e){
		Ti.API.info("Capturing app:hotelsLoaded event: " + e.hotelRows.length);
		self.theWindow.mapView.updateHotelAnnotations(e.hotelRows, true);
	});
	//listener to rows toggling 
	Ti.App.addEventListener("app:rowToggled", function(e){
		Ti.API.info("Capturing app:rowToggled event");
		var rows = new Array(e.row);
		self.theWindow.mapView.updateHotelAnnotations(rows, false);
	});
	//update location with the shake event
	Ti.Gesture.addEventListener('shake',function(e){
		updateUserLocation();
	});
	/*
	 * Private methods
	 */
	//Update user location
	function updateUserLocation(){
		Ti.API.info("Updating user location");
		Titanium.Geolocation.getCurrentPosition(function(e){
		    if (e.error)
		    {
		    	Ti.API.info("Error getting location: " + e.error);
		        alert('Cannot get your current location');
		        return;
		    }
		    var longitude = e.coords.longitude;
		    var latitude = e.coords.latitude;
		    Ti.API.info("Got user location - lat: " + latitude + " - long: " + longitude);
		    Ti.App.Properties.setObject('location', {latitude: latitude, longitude: longitude});
		    self.theWindow.mapView.updateUserPosition({latitude: latitude, 
		    										longitude: longitude, 
		    										latitudeDelta: currentRegion.latitudeDelta, 
		    										longitudeDelta: currentRegion.longitudeDelta, 
		    										animate: true});
		});
	}
	
	function regionChanged(e){
		Ti.API.info("Regionchanged: lat: " + e.latitude + " - lon: " + e.longitude + " - latdelta: " + e.latitudeDelta + " - londelta: " + e.longitudeDelta);
		Ti.API.info("CurrentRegion: lat: " + currentRegion.latitude + " - lon: " + currentRegion.longitude + " - latdelta: " + currentRegion.latitudeDelta + " - londelta: " + currentRegion.longitudeDelta);
		var threshold = 0.01;
		var shouldloaddata = forceReload || (Math.abs(e.latitude - currentRegion.latitude) > threshold)
											|| (Math.abs(e.longitude - currentRegion.longitude) > threshold)
											|| (Math.abs(e.latitudeDelta - currentRegion.latitudeDelta) > threshold)
											|| (Math.abs(e.longitudeDelta - currentRegion.longitudeDelta) > threshold);
		//load data??
		if (shouldloaddata){
			//update currentRegion
			currentRegion.latitude = e.latitude;
			currentRegion.longitude = e.longitude;
			currentRegion.latitudeDelta = e.latitudeDelta;
			currentRegion.longitudeDelta = e.longitudeDelta;
			//fire event
			Ti.App.fireEvent('app:updateTable',{region: currentRegion});
		}
		
		forceReload = false;
	}
	/*
	 * Initial actions
	 */
	//update user location
	setTimeout(updateUserLocation,1000);
	
	return self;
}

module.exports = mapWindowController;
