/**
 * @author dlafuente
 */

var listWindowController = new function(){
	//self reference
	var self = this;
	//network
	var network = require('util/network');
	//config
	var config = require('util/config');
	//path to the right window
	var middledir = config.isTablet ? "handheld" : "handheld";
	//the window
	self.theWindow = require('ui/' + middledir + '/listWindow');
	/*
	 * Actions, listeners and events
	 */
	//menus and/or rightNavButton
	if (Ti.Platform.osname === 'android'){
		self.theWindow.addEventListener('focus', function() {
			Ti.API.info("Entered the focus event: " + self.theWindow.getTitle());
			var activity = self.theWindow.activity;
			activity.onPrepareOptionsMenu = function(e) {
				Ti.API.info("Entered onPrepareOptionsMenu");
				var menu = e.menu;
				menu.findItem(1).setVisible(false);
			}
		});
	}
	//update table listener
	Ti.App.addEventListener('app:updateTable', function(e){
		Ti.API.info("Captured app:updateTable");
		updateTable(e.region);
	});
	//click table listener
	self.theWindow.table.addEventListener('click', function(e){
		//toggle check
		e.row.hasCheck = !e.row.hasCheck; 
		e.rowData.pincolor = e.row.hasCheck ? Titanium.Map.ANNOTATION_GREEN : Titanium.Map.ANNOTATION_PURPLE;
		Ti.API.info("Toggled: " + e.rowData.title + "changed to: " + e.row.hasCheck);
		//notify
		Ti.App.fireEvent("app:rowToggled", {row: e.rowData});
	});

	/*
	 * Private methods
	 */
	function updateTable(region) {
		self.theWindow.activityIndicator.show();
		network.getHotels(region, function (result) {
			Ti.API.info("processing callback. Message returned: " + result.message);
			if (result.message !== "OK"){
				alert('Server error: ' + result.message);
				return;
			}
			var hotels = result.response;
			Ti.API.info("Hotels returned: " + hotels.length);
			//populate the table
			var hotelRows = [];
			hotels.forEach(function(hotel){
				var row =Ti.UI.createTableViewRow({
					title: hotel.name,
			        code: hotel.code,
					hasChild:false,
					color: '#fff',
					animate: true,
					height : '50dp',
					layout:"horizontal",
					pincolor: Titanium.Map.ANNOTATION_PURPLE,
					touchEnabled: true,
					hasCheck: false,
					category: hotel.category,
					latitude: hotel.location.latitude,
					longitude: hotel.location.longitude       
			    });
			    var label = Ti.UI.createLabel({
			        text: hotel.name,
			        height : 'auto',
			        width : Ti.Platform.displayCaps.platformWidth - 40,
			        textAlign: 'left',
			        letf: 5,
			        font:{fontWeight:'bold',fontSize:'16sp'}
			    });
			    row.add(label);
				hotelRows.push(row);
			});
			self.theWindow.activityIndicator.hide();
			self.theWindow.table.setData(hotelRows);
			Ti.API.info("Firing app:hotelsLoaded event");
			Ti.App.fireEvent("app:hotelsLoaded", {hotelRows: hotelRows});
		});
	}
	
	return self;
}

module.exports = listWindowController;
