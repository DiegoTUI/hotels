(function(){
	var Config = require('util/Config');
	if (Config.TEST_MODE) {
		Ti.API.info("entered the tests");
		Ti.include(Titanium.Filesystem.resourcesDirectory + 'test/lib/jasmine-1.0.2.js');
		Ti.include(Titanium.Filesystem.resourcesDirectory + 'test/lib/jasmine-titanium.js');
		
		// Include all the test files
		Ti.include(Titanium.Filesystem.resourcesDirectory + 'test/test_main.js');
		Ti.include(Titanium.Filesystem.resourcesDirectory + 'test/testUtil.js');
		Ti.include(Titanium.Filesystem.resourcesDirectory + 'test/testDatabase.js');
		
		jasmine.getEnv().addReporter(new jasmine.TitaniumReporter());
		jasmine.getEnv().execute();
	}
})();