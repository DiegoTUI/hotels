/**
 * @author dlafuente
 */

function MapWindow(title) {
	var Config = require('util/Config');
	//base window
	var BaseWindow = require('ui/handheld/BaseWindow');
	//self-reference
	var self = new BaseWindow(title);
	//force reload hotels
	var forceReload = true;
	//Region changing
	//Current mapframe
	var currentRegion = {
		latitude: Ti.App.Properties.getObject('location').latitude,
       	longitude: Ti.App.Properties.getObject('location').longitude,
        animate:true,
        latitudeDelta:0.01,
        longitudeDelta:0.01
   }
	//menu and/or backbutton
	if ((Ti.Platform.osname === 'iphone')) {
		var button = Titanium.UI.createButton({
			title:L('currentLocation'),
			style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
		});
		button.addEventListener('click',function() {
			updateUserLocation();
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
				m1.addEventListener('click', function(e) {
					updateUserLocation();
				});
			}
		});
		self.addEventListener('focus', function() {
			Ti.API.info("Entered the focus event: " + self.getTitle());
			var activity = self.activity;
			activity.onPrepareOptionsMenu = function(e) {
				var menu = e.menu;
				menu.findItem(1).setVisible(true);
			}
		});
		
	}
	else if ((Ti.Platform.osname === 'mobileweb')) {
		Ti.API.info("Entered the focus event: " + self.getTitle());
		var button = Titanium.UI.createButton({
			title:L('currentLocation')
		});
		button.addEventListener('click',function() {
			updateUserLocation();
		});
		self.setRightNavButton(button);
	}
	//mapview
	var MapView = require('ui/handheld/MapView');
	var mapview = new MapView(currentRegion);
	Ti.API.info("About to add mapview to Map Window");
	self.add(mapview);
	setTimeout(updateUserLocation,1000);
	Ti.Gesture.addEventListener('shake',function(e){
		updateUserLocation();
	});
	
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
		    mapview.updateUserPosition({latitude: latitude, longitude: longitude, latitudeDelta: currentRegion.latitudeDelta, longitudeDelta: currentRegion.longitudeDelta, animate: true});
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
	
	//listener for region changed
	if (parseInt(Ti.Platform.version.charAt(0)) < 3)
		mapview.addEventListener('regionChanged', regionChanged);
	else
		mapview.addEventListener('regionchanged', regionChanged);
	//listener for hotels loaded
	Ti.App.addEventListener("app:hotelsLoaded", function(e){
		Ti.API.info("Capturing app:hotelsLoaded event: " + e.hotelRows.length);
		mapview.updateHotelAnnotations(e.hotelRows, true);
	});
	//listener for update location
	Ti.App.addEventListener("app:updateLocation", function(e){
		Ti.API.info("Capturing app:updateLocation event");
		mapview.refreshCurrentLocation();
	});
	
	Ti.App.addEventListener("app:rowToggled", function(e){
		Ti.API.info("Capturing app:rowToggled event");
		var rows = new Array(e.row);
		mapview.updateHotelAnnotations(rows, false);
	});
	
	return self;
};

module.exports = MapWindow;