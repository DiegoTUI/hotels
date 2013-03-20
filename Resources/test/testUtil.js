/**
 * @author dlafuente
 */

(function(){
	
	Ti.API.info("entered testUtil");
	
	var Util = require('util/Util');
	
	describe('RandomId', function() {
		Ti.API.info("entered randomId");
		
		beforeEach(function(){
			this.addMatchers({
				toHaveLength: function(len){
					return this.actual.length == len;
				}
			});
		});

		it('should return different 8 chars strings', function() {
			var lastId = Util.randomId();
			expect(lastId).toHaveLength(8);
			for (var i=0; i<10000; i++){
				var newId = Util.randomId();
				expect(lastId).toHaveLength(8);
				expect(newId).toNotEqual(lastId);
				lastId = newId;
			}
		});	
	});
	
	describe('isolateJSON', function() {
		Ti.API.info("entered isolateJSON");

		it('should isolate json correctly', function() {
			var prev = generateRandomString(4);
			var json = generateRandomString(10);
			var last = generateRandomString(3);
			
			var isolatedJSON = Util.isolateJSON(prev + "{" + json + "}" + last);
			
			expect(isolatedJSON).toEqual("{" + json + "}");
		});	
	});
	
	function generateRandomString(timeseight){
		var result = "";
		for (var i=0; i<timeseight; i++){
			result += Util.randomId();
		}
		return result;
	};
	
})();
