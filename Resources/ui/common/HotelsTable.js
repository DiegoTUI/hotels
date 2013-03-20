/**
 * @author dlafuente
 */

function HotelsTable(){
	//self reference
	var self =  Ti.UI.createTableView({
		title: L('hotelRows'),
		backgroundColor: 'transparent'
	});
	
	return self;
}

module.exports = HotelsTable;
