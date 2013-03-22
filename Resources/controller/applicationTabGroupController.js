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
	
	return self;
}

module.exports = applicationTabGroupController;