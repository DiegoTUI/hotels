/**
 * @author dlafuente
 */

function DummyWindow(title) {
	
	var self = Ti.UI.createWindow({
		title:L(title),
		backgroundColor:'white',
	});
	
	return self;
};

module.exports = DummyWindow;