/**
 * @author dlafuente
 */

function ApplicationTabGroup(windows){
	Ti.API.info("ApplicationTabGroup - entered constructor");
	//self reference
	var self = Ti.UI.createTabGroup();
	
	//Creates the tabs based on titlesArray
	(function createTabs()
	{
		Ti.API.info("ApplicationTabGroup - entered constructor");
		for (var i=0; i<windows.length; i++){
			var name = windows[i].name;
			var iconPath = '/images/' + name + '_icon.png';
			var windowClass = windows[i].windowClass;
			var tab = Ti.UI.createTab({
						title: L(name),
						icon: iconPath,
						window: new windowClass(name)
						});
			tab.window.containingTab = tab;
			self.addTab(tab);
		}
	})();
	
	return self;
};

module.exports = ApplicationTabGroup;
