/**
 * @author dlafuente
 */

(function(){
	Ti.API.info("entered testUtil");
	
	var Database = require('util/Database'); 
	var Network = require('util/Network');
	
	describe('Populate Database', function() {
		Ti.API.info("entered Populate Database");
		it('should populate the database with data from the network', function(){
			Database.deltest();
			expect(Database.count(false)).toBe(0);
			expect(Database.count(true)).toBe(0);
			populateDB();
		
			waitsFor(function(){
				return Network.finished();
			});
			
			runs(function(){
				expect(Database.count(false)).toBe(10);
			});	
		});
		
	});
	
	describe("Test Database", function(){
		Ti.API.info("entered Test Database");
		
		beforeEach(function(){
			this.addMatchers({
				toStartWith: function(str){
					return this.actual.indexOf(str) === 0;
				}
			});
		});
		
		it("should have 10 elements not selected at the begining", function(){
			expect(Database.count(false)).toBe(10);
		});
		
		it("should list, select and delete the elements correctly", function(){
			var hotels = Database.list();
			var hotelsSelected = hotels.filter(function(hotel){
				return hotel.hasCheck == true;
			});
			var hotelsNotSelected = hotels.filter(function(hotel){
				return hotel.hasCheck == false;
			});
			var lastValidCode;
			expect(hotels.length).toBe(10);
			expect(hotelsNotSelected.length).toBe(10);
			expect(hotelsSelected.length).toBe(0);
			hotels.forEach(function(hotel){
				expect(hotel.code).toStartWith("TEST");
				lastValidCode = hotel.code;
			});
			//select the last hotel
			Database.select(lastValidCode, true);
			hotels = Database.list();
			hotelsSelected = hotels.filter(function(hotel){
				return hotel.hasCheck == true;
			});
			hotelsNotSelected = hotels.filter(function(hotel){
				return hotel.hasCheck == false;
			});
			expect(hotels.length).toBe(10);
			expect(hotelsNotSelected.length).toBe(9);
			expect(hotelsSelected.length).toBe(1);
			//delete the last hotel
			Database.del(lastValidCode);
			hotels = Database.list();
			hotelsSelected = hotels.filter(function(hotel){
				return hotel.hasCheck == true;
			});
			hotelsNotSelected = hotels.filter(function(hotel){
				return hotel.hasCheck == false;
			});
			expect(hotels.length).toBe(9);
			expect(hotelsNotSelected.length).toBe(9);
			expect(hotelsSelected.length).toBe(0);
		});
	});
	
	describe("delete database", function(){
		Ti.API.info("entered Delete Database");
		it("should delete all tests elements in database", function(){
			Database.deltest();
			expect(Database.count(false)).toBe(0);
			expect(Database.count(true)).toBe(0);
		});
	});
	
	function populateDB(){
		Ti.API.info("UNITTESTS - entered populateDB");
		//retrieve real hotels from the database (need an internet connection)
		region = {
			longitude: 3.031878,
			latitude: 39.532055,
			longitudeDelta: 1.757812,
			latitudeDelta: 1.550618
		};
		
		Network.getHotels(region, function(result){
			var hotels = result.response;
			//get only the first 10 hotels
			for (var i=0; i<10; i++){
				var hotel = hotels[i];
				Database.add({
					code: "TEST" + hotel.code,
					name: hotel.name,
					category: hotel.category,
					latitude: hotel.location.latitude,
					longitude: hotel.location.longitude,
					selected: 0
				});
			}
		});
		Ti.API.info("UNITTESTS - finished populateDB");
	};
	
})();