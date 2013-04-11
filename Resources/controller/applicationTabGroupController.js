/**
 * @author dlafuente
 */

var applicationTabGroupController = new function() {
	//self reference
	var self = this;
	//Controllers
	var mapWindowController = require('controller/mapWindowController');
	var listWindowController = require('controller/listWindowController');
	
	var windows = [];
	windows.push(mapWindowController.theWindow);
	windows.push(listWindowController.theWindow);

	var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
	
	Ti.API.info("Opening Application Tab Group");
	new ApplicationTabGroup(windows).open();
	//listener for hotels loaded
	Ti.App.addEventListener("app:hotelsLoaded", function(){
		Ti.API.info("Capturing app:hotelsLoaded event");
		mapWindowController.updateHotelAnnotations (listWindowController.currentRows, true);
	});
	//listener to rows toggling 
	Ti.App.addEventListener("app:rowToggled", function(e){
		Ti.API.info("Capturing app:rowToggled event");
		var rows = new Array(e.row);
		mapWindowController.updateHotelAnnotations(rows, false);
	});
	
	return self;
}

module.exports = applicationTabGroupController;