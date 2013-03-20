/**
 * @author dlafuente
 */

var Database = new function(){
	var Config = require('util/Config');
	var testing = Config.TEST_MODE;
	//self reference
	var self = this;
	//Open database
	var db = null;
	//open database
	function openDB(){
		db = Titanium.Database.open('Hotels')
	};
	//Create the database if it hasnt been done yet
	(function create(){
		Ti.API.info("Creating database");
		openDB();
		try{
			db.execute('CREATE TABLE IF NOT EXISTS hotels (code TEXT PRIMARY KEY, name TEXT, category TEXT, longitude FLOAT, latitude FLOAT, selected INTEGER)');
		}
		catch (e){
			Ti.API.info("Table not created properly: " + e);
		}
	})();
	
	//count the elements of the DB
	self.count = function(selected){
		Ti.API.info("Counting...");
		openDB();
		var query = testing ? 'SELECT COUNT(*) FROM hotels WHERE selected = ? AND code LIKE "TEST%"' : 'SELECT COUNT(*) FROM hotels WHERE selected = ?';
		var row = db.execute(query, Number(selected));
		db.close();
		return row.field(0);
	}
	
	//list elements of the DB
	self.list = function(){
		Ti.API.info("Listing...");
		openDB();
		var data = [];
		var query = testing ? 'SELECT * FROM hotels WHERE code LIKE "TEST%"' : 'SELECT * FROM hotels';
		var rows = db.execute(query);
		while (rows.isValidRow()) {
			data.push({
				title: rows.fieldByName('name'),
				code: rows.fieldByName('code'),
				hasChild:false,
				color: '#fff',
				animate: true,
				height : '50dp',
				layout:"horizontal",
				pincolor: rows.fieldByName('selected') ? Titanium.Map.ANNOTATION_PURPLE : Titanium.Map.ANNOTATION_PURPLE,
				touchEnabled: true,
				hasCheck: Boolean(rows.fieldByName('selected')),
				category: rows.fieldByName('category'),
				latitude: rows.fieldByName('latitude'),
				longitude: rows.fieldByName('longitude') 
			});
			rows.next();
		}
		rows.close();
		db.close();
		
		return data;
	}
	
	//add a new hotel
	self.add = function(hotel){
		Ti.API.info("Adding...");
		openDB();
		try {
			db.execute('INSERT INTO hotels (code, name, category, latitude, longitude, selected) VALUES(?,?,?,?,?,?)', hotel.code, hotel.name, hotel.category, hotel.latitude, hotel.longitude, hotel.selected);
		}
		catch(e){
			Ti.API.info("element not added properly: " + e);
		}
		db.close();
		Ti.API.info("Count after adding. Selected: " + self.count(true) + " - Non-selected: " + self.count(false));
	}
	
	//delete a hotel by code
	self.del = function (code){
		Ti.API.info("Deleting...");
		openDB();
		db.execute("DELETE FROM hotels WHERE code = ?", code);
		db.close();
	}
	
	//delete test hotels
	self.deltest = function (){
		Ti.API.info("Deleting test hotels...");
		openDB();
		db.execute('DELETE FROM hotels WHERE code LIKE "TEST%"');
		db.close();
	}
	
	//change the selection of a hotel
	self.select = function (code, select){
		Ti.API.info("Selecting...");
		openDB();
		db.execute("UPDATE hotels SET selected = ? WHERE code = ?", Number(select), code);
		db.close();
	}
	
	return self;
}

module.exports = Database;
