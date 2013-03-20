/**
 * @author dlafuente
 */

function BaseWindow(title) {
	
	var self = Ti.UI.createWindow({
		title:L(title),
		backgroundColor:'black',
	});
	
	/*//create menus for android
	if (Ti.Platform.osname === 'android') {
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
					//Ti.App.fireEvent('app:updateLocation');
				});
				//Menu for list tab
				var m2 = menu.add({ title : L('refresh'),
									itemId: 2 });
				m2.addEventListener('click', function(e) {
				});
			}
		});
	}*/
	
	return self;
}

module.exports = BaseWindow;