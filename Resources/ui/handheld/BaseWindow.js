/**
 * @author dlafuente
 */

 var BaseWindow = function (title) {
	
	var self = Ti.UI.createWindow({
		title:L(title),
		backgroundColor:'black',
	});
	
	//export the name of the window
	self.name = title;
	
	Ti.API.info("Base window created: " + title);
	
	return self;
}

module.exports = BaseWindow;