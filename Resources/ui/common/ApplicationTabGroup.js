/**
 * @author dlafuente
 */

var ApplicationTabGroup = function (windows) {
	Ti.API.info("ApplicationTabGroup - entered constructor");
	//self reference
	var self = Ti.UI.createTabGroup();
	
	//Creates the tabs based on titlesArray
	(function createTabs()
	{
		windows.forEach(function(theWindow){
			Ti.API.info("processing window with title: " + theWindow.getTitle());
			var tab = Ti.UI.createTab({
						title: L(theWindow.name),
						icon: '/images/' + theWindow.name + '_icon.png',
						window: theWindow
						});
			theWindow.containingTab = tab;
			self.addTab(tab);
		});
	})();
	
	return self;
};

module.exports = ApplicationTabGroup;
