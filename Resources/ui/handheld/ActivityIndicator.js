/**
 * @author dlafuente
 */

function ActivityIndicator(){
	
	var style;
	if (Ti.Platform.name === 'iPhone OS'){
	  style = Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN;
	}
	else {
	  style = Ti.UI.ActivityIndicatorStyle.PLAIN;
	}
	
	var self = Ti.UI.createActivityIndicator({
	  color: 'green',
	  font: {fontFamily:'Helvetica Neue', fontSize:26, fontWeight:'bold'},
	  message: L('loading'),
	  style:style,
	  height:Ti.UI.SIZE,
	  width:Ti.UI.SIZE
	});
	
	return self;
}

module.exports = ActivityIndicator;
