/**
 * @author dlafuente
 */

var MapView = function(region){
	//self reference
	var self = Titanium.Map.createView({
		    mapType: Titanium.Map.STANDARD_TYPE,
		    region: region,
		    animate:true,
		    regionFit:true,
		    userLocation:false
		});
	//indicator
	var ActivityIndicator = require('ui/handheld/ActivityIndicator');
	var activityIndicator = new ActivityIndicator();
	self.add(activityIndicator);
	activityIndicator.hide();
	
	self.updateUserPosition = function (region){
		activityIndicator.show();
        self.setLocation(region);
        updateUserAnnotation(region.latitude, region.longitude);
        activityIndicator.hide();
	}
	
	self.updateHotelAnnotations = function(hotelRows, removeAll){
		Ti.API.info("Entered updateHotelsAnnotations: " + hotelRows.length + " hotels");
		activityIndicator.show();
		if (removeAll){
			self.removeAllAnnotations();
			updateUserAnnotation(Ti.App.Properties.getObject('location').latitude, Ti.App.Properties.getObject('location').longitude);
		}
		
		//refresh annotations
		for (var i=0; i<hotelRows.length; i++){
			var hotelRow = hotelRows[i];
			if (!removeAll)
				self.removeAnnotation(hotelRow.title);
			//Ti.API.info("about to add annotation: " + hotelRow.title + " - color: " + hotelRow.pincolor);
			self.addAnnotation(Ti.Map.createAnnotation({
				animate: true,
				pincolor: hotelRow.pincolor,
				title: hotelRow.title,
				latitude: hotelRow.latitude,
				longitude: hotelRow.longitude
			}));
			//Ti.API.info("annotation added");
			//Ti.API.info("Adding hotel " + hotel.name + " - latitude: " + hotel.location.latitude + " - longitude: " + hotel.location.longitude);
		}
		activityIndicator.hide();
	}
	
	function updateUserAnnotation (latitude, longitude){
		Ti.API.info("Entered updateUserAnnotation: " +latitude + " - " + longitude);
		Ti.API.info("localized youAreHere: " + L('youAreHere'));
		//remove the old annotetion
		try{self.removeAnnotation(L('youAreHere'));}
		catch (error) {Ti.API.info("Catched an error: " + error);};
		//add the current annotation
		// Add initial annotation
		Ti.API.info("About to add user annotation - latitude: " + latitude + " - longitude: " + longitude);
		self.addAnnotation(Ti.Map.createAnnotation({
			animate: true,
			pincolor: Titanium.Map.ANNOTATION_RED,
			title: L('youAreHere'),
			latitude: latitude,
			longitude: longitude
		}));
		
	}
	
	return self;
};

module.exports = MapView;
