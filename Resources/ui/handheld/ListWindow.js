/**
 * @author dlafuente
 */

function ListWindow(title) {
	var BaseWindow = require('ui/handheld/BaseWindow');
	var Network = require('util/Network');
	//self-reference
	var self = new BaseWindow(title);
	//indicator
	var ActivityIndicator = require('ui/handheld/ActivityIndicator');
	var activityIndicator = new ActivityIndicator();
	self.add(activityIndicator);
	activityIndicator.hide();
	//table
	var HotelsTable = require('ui/common/HotelsTable');
	var table = new HotelsTable();
	//click listener
	table.addEventListener('click', function(e){
		//toggle check
		e.row.hasCheck = !e.row.hasCheck; 
		e.rowData.pincolor = e.row.hasCheck ? Titanium.Map.ANNOTATION_GREEN : Titanium.Map.ANNOTATION_PURPLE;
		Ti.API.info("Toggled: " + e.rowData.title + "changed to: " + e.row.hasCheck);
		//notify
		Ti.App.fireEvent("app:rowToggled", {row: e.rowData});
	});
	self.add(table);
	//update table listener
	Ti.App.addEventListener('app:updateTable', function(e){
		Ti.API.info("Captured app:updateTable");
		activityIndicator.show();
		Network.getHotels(e.region,function (result){
			Ti.API.info("processing callback. Message returned: " + result.message);
			if (result.message !== "OK"){
				alert('Server error: ' + result.message);
				return;
			}
			var hotels = result.response;
			Ti.API.info("Hotels returned: " + hotels.length);
			//populate the table
			var hotelRows = [];
			for (var i=0; i<hotels.length; i++){
				var hotel = hotels[i];
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
			}
			activityIndicator.hide();
			table.setData(hotelRows);
			Ti.API.info("Firing app:hotelsLoaded event");
			Ti.App.fireEvent("app:hotelsLoaded", {hotelRows: hotelRows});
		});
	});
	
	//menus and/or back button
	if (Ti.Platform.osname === 'android'){
		self.addEventListener('focus', function() {
			Ti.API.info("Entered the focus event: " + self.getTitle());
			var activity = self.activity;
			activity.onPrepareOptionsMenu = function(e) {
				Ti.API.info("Entered onPrepareOptionsMenu");
				var menu = e.menu;
				menu.findItem(1).setVisible(false);
			}
		});
	}
	
	return self;
}

module.exports = ListWindow;