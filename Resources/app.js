//bootstrap and check dependencies
if (Ti.version < 1.8 ) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
}

// This is a single context application with mutliple windows in a stack
(function() {
	Ti.API.info("Starting app...");
	//Check if TEST_MODE is on.
	var config = require('util/config');
	if (config.TEST_MODE === false){
		Ti.API.info("Opening Application Tab Group Controller");
		var applicationTabGroupController = require('controller/applicationTabGroupController');
	}
})();
//Launch tests if necessary
Ti.include(Titanium.Filesystem.resourcesDirectory + 'test/tests.js');