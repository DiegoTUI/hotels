/*
 * A tabbed application, consisting of multiple stacks of windows associated with tabs in a tab group.  
 * A starting point for tab-based application with multiple top-level windows. 
 * Requires Titanium Mobile SDK 1.8.0+.
 * 
 * In app.js, we generally take care of a few things:
 * - Bootstrap the application with any data we need
 * - Check for dependencies like device type, platform version or network connection
 * - Require and open our top-level UI component
 *  
 */

//bootstrap and check dependencies
if (Ti.version < 1.8 ) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
}

// This is a single context application with mutliple windows in a stack
(function() {
	//determine platform and form factor and render approproate components
	var osname = Ti.Platform.osname,
		version = Ti.Platform.version,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;
		
	Ti.API.info("Platform name: " + Ti.Platform.name + " - width: " + width + " - height: " + height + " - version: " + version);
	
	//considering tablet to have one dimension over 900px - this is imperfect, so you should feel free to decide
	//yourself what you consider a tablet form factor for android
	var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));
	
	var windows = [];
	var middledir = "handheld";
	if (isTablet) {
		middledir = "handheld";
	}
	
	var MapWindow = require('ui/' + middledir + '/MapWindow');
	var ListWindow = require('ui/' + middledir + '/ListWindow');
	
	windows[0] = {windowClass: MapWindow, name:"map"};
	windows[1] = {windowClass: ListWindow, name: "list"};

	var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
	//Check if TEST_MODE is on.
	var Config = require('util/Config');
	if (Config.TEST_MODE === false){
		Ti.API.info("Opening Application Tab Group");
		new ApplicationTabGroup(windows).open();
	}
})();
//Launch tests if necessary
Ti.include(Titanium.Filesystem.resourcesDirectory + 'test/tests.js');