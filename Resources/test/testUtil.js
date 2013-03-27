/**
 * @author dlafuente
 */

(function(){
	
	Ti.API.info("entered testUtil");
	
	var util = require('util/util');
	
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
			var lastId = util.randomId();
			expect(lastId).toHaveLength(8);
			for (var i=0; i<10000; i++){
				var newId = util.randomId();
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
			
			var isolatedJSON = util.isolateJSON(prev + "{" + json + "}" + last);
			
			expect(isolatedJSON).toEqual("{" + json + "}");
		});	
	});
	
	function generateRandomString(timeseight){
		var result = "";
		for (var i=0; i<timeseight; i++){
			result += util.randomId();
		}
		return result;
	};
	
	describe('JSON to XML and vice versa', function(){
		Ti.API.info("entered JSON to XML and vice versa");
		var object = {
			HotelListRQ: {
				"@echoToken": "DummyEchoToken",
				"@xmlns": "http://www.hotelbeds.com/schemas/2005/06/messages",
				"@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
				"@xsi:schemaLocation": "http://www.hotelbeds.com/schemas/2005/06/messages HotelListRQ.xsd",
				Language: "ENG",
				Credentials:{
					User: "ISLAS",
					"Password": "ISLAS"
				},
				Destination:{
					"@code": "PMI",
					"@type": "SIMPLE"
				}
			}
		};
		
		it("should transform the JSON in XML and back", function(){
			Ti.API.info("objectString: " + JSON.stringify(object));
			var xmlString = util.jsonToXml(object);
			Ti.API.info("xmlString: " + xmlString);
			var xmlDoc = Titanium.XML.parseString(xmlString);
			expect(xmlDoc.documentElement.attributes.getNamedItem("echoToken").nodeValue).toBe(object.HotelListRQ["@echoToken"]);
			expect(xmlDoc.documentElement.attributes.getNamedItem("xmlns").nodeValue).toBe(object.HotelListRQ["@xmlns"]);
			expect(xmlDoc.documentElement.attributes.getNamedItem("xmlns:xsi").nodeValue).toBe(object.HotelListRQ["@xmlns:xsi"]);
			expect(xmlDoc.documentElement.attributes.getNamedItem("xsi:schemaLocation").nodeValue).toBe(object.HotelListRQ["@xsi:schemaLocation"]);
			expect(xmlDoc.documentElement.getElementsByTagName("Language").item(0).text).toBe(object.HotelListRQ.Language);
			expect(xmlDoc.documentElement.getElementsByTagName("Credentials").item(0).getElementsByTagName("User").item(0).text).toBe(object.HotelListRQ.Credentials.User);
			expect(xmlDoc.documentElement.getElementsByTagName("Credentials").item(0).getElementsByTagName("Password").item(0).text).toBe(object.HotelListRQ.Credentials["Password"]);
			expect(xmlDoc.documentElement.getElementsByTagName("Destination").item(0).attributes.getNamedItem("code").nodeValue).toBe(object.HotelListRQ.Destination["@code"]);
			expect(xmlDoc.documentElement.getElementsByTagName("Destination").item(0).attributes.getNamedItem("type").nodeValue).toBe(object.HotelListRQ.Destination["@type"]);
			//var XMLTools = require('util/XMLTools');
			//var parser = new XMLTools(xmlDoc);
			var jsonString = util.xmlToJson(xmlDoc);
			Ti.API.info("jsonString type: " + typeof jsonString + " - contents: " + jsonString);
			//var jsonObject = JSON.parse(jsonString);
			//expect(object.equals(jsonObject)).toBe(true);
		});
	});
	
})();
