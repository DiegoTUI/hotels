/**
 * @author dlafuente
 */

var listWindow = new function () {
	var BaseWindow = require('ui/handheld/BaseWindow');
	//self-reference
	var self = new BaseWindow("list");
	//indicator
	var ActivityIndicator = require('ui/handheld/ActivityIndicator');
	self.activityIndicator = new ActivityIndicator();
	self.add(self.activityIndicator);
	self.activityIndicator.hide();
	//table
	var HotelsTable = require('ui/common/HotelsTable');
	self.table = new HotelsTable();
	
	self.add(self.table);
	
	return self;
}

module.exports = listWindow;