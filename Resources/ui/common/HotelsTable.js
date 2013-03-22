/**
 * @author dlafuente
 */

var HotelsTable = function () {
	//self reference
	var self =  Ti.UI.createTableView({
		title: L('hotelRows'),
		backgroundColor: 'transparent'
	});
	
	return self;
}

module.exports = HotelsTable;
