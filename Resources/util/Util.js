/**
 * @author dlafuente
 */

var util = new function(){
	//self reference
	var self = this;
	
	/**
	 * Generate a random id in base 36 with length 8.
	 */
	self.randomId = function ()
	{
		var random = Math.abs(Math.floor(Math.random() * 0x100000000000));
		var result = random.toString(36).slice(-8);
		while (result.length < 8)
		{
			result = '0' + result;
		}
		return result;
	
	}
	
	/**
	 * Remove headers and footers of a JSON returned via web
	 */
	self.isolateJSON = function (responseText)
	{
		//get all the text from the starting "{"
		var result = "{" + responseText.split(/{(.+)?/)[1];
		return result.substring(0, result.lastIndexOf("}") + 1);
		
	}
	
	return self;
}

module.exports = util;
