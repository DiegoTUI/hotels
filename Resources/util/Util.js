/**
 * @author dlafuente
 */

/**
 * Util toolbox
 */
var Util = function (){
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
	
	/**
	 * Covert XML to JSON. Receives an XML document, returns a JSON string
	 * Attributes are preceded by the "@" character
	 * Values are signaled by the "#text" key ONLY when there are attributes
	 * tab or indent string for pretty output formatting. Omit or use empty string to supress
	 * returns JSON string
	 */
	self.xmlToJson = function (xml, tab){
		var ELEMENT_NODE = 1;
		var ATTRIBUTE_NODE = 2;
		var TEXT_NODE = 3;
		var CDATA_SECTION_NODE = 4;
		var DOCUMENT_NODE = 9;
		var X = {
			toObj: function(xml) {
				var o = {};
				if (xml.nodeType==ELEMENT_NODE){//Ti.XML.Node.ELEMENT_NODE) {   // element node ..
					if (xml.attributes.length)   // element with attributes  ..
						for (var i=0; i<xml.attributes.length; i++)
							o["@"+xml.attributes.item(i).nodeName] = (xml.attributes.item(i).nodeValue||"").toString();
					if (xml.firstChild) { // element has child nodes ..
						var textChild=0, cdataChild=0, hasElementChild=false;
						for (var n=xml.firstChild; n; n=n.nextSibling) {
							if (n.nodeType==ELEMENT_NODE) hasElementChild = true;
							else if (n.nodeType==TEXT_NODE && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
							else if (n.nodeType==CDATA_SECTION_NODE) cdataChild++; // cdata section node
						}
						if (hasElementChild) {
							if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
								X.removeWhite(xml);
								for (var n=xml.firstChild; n; n=n.nextSibling) {
									if (n.nodeType == TEXT_NODE)  // text node
										o["#text"] = X.escape(n.nodeValue);
									else if (n.nodeType == CDATA_SECTION_NODE)  // cdata node
										o["#cdata"] = X.escape(n.nodeValue);
									else if (o[n.nodeName]) {  // multiple occurence of element ..
										if (o[n.nodeName] instanceof Array)
											o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
										else
											o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
									}
									else  // first occurence of element..
										o[n.nodeName] = X.toObj(n);
								}
							}
							else { // mixed content
								if (!xml.attributes.length)
									o = X.escape(X.innerXml(xml));
								else
									o["#text"] = X.escape(X.innerXml(xml));
							}
						}
						else if (textChild) { // pure text
							if (!xml.attributes.length)
								o = X.escape(X.innerXml(xml));
							else
								o["#text"] = X.escape(X.innerXml(xml));
						}
						else if (cdataChild) { // cdata
							if (cdataChild > 1)
								o = X.escape(X.innerXml(xml));
							else
								for (var n=xml.firstChild; n; n=n.nextSibling)
									o["#cdata"] = X.escape(n.nodeValue);
						}
					}
					if (!xml.attributes.length && !xml.firstChild) o = null;
				}
				else if (xml.nodeType==9){//Ti.XML.Node.DOCUMENT_NODE) { // document.node
					o = X.toObj(xml.documentElement);
				}
				else
					Ti.API.error("unhandled node type: " + xml.nodeType);
				return o;
			},
			toJson: function(o, name, ind) {
				var json = name ? ("\""+name+"\"") : "";
				if (o instanceof Array) {
					for (var i=0,n=o.length; i<n; i++)
						o[i] = X.toJson(o[i], "", ind+"\t");
					json += (name?":[":"[") + (o.length > 1 ? ("\n"+ind+"\t"+o.join(",\n"+ind+"\t")+"\n"+ind) : o.join("")) + "]";
				}
				else if (o == null)
					json += (name&&":") + "null";
				else if (typeof(o) == "object") {
					var arr = [];
					for (var m in o)
						arr[arr.length] = X.toJson(o[m], m, ind+"\t");
					json += (name?":{":"{") + (arr.length > 1 ? ("\n"+ind+"\t"+arr.join(",\n"+ind+"\t")+"\n"+ind) : arr.join("")) + "}";
				}
				else if (typeof(o) == "string")
					json += (name&&":") + "\"" + o.toString() + "\"";
				else
					json += (name&&":") + o.toString();
				return json;
			},
			innerXml: function(node) {
				var s = "";
				if ("innerHTML" in node)
					s = node.innerHTML;
				else {
					var asXml = function(n) {
						var s = "";
						if (n.nodeType == ELEMENT_NODE) {
							s += "<" + n.nodeName;
							for (var i=0; i<n.attributes.length;i++)
								s += " " + n.attributes.item(i).nodeName + "=\"" + (n.attributes.item(i).nodeValue||"").toString() + "\"";
							if (n.firstChild) {
								s += ">";
								for (var c=n.firstChild; c; c=c.nextSibling)
									s += asXml(c);
								s += "</"+n.nodeName+">";
							}
							else
								s += "/>";
						}
						else if (n.nodeType == 3)
							s += n.nodeValue;
						else if (n.nodeType == 4)
							s += "<![CDATA[" + n.nodeValue + "]]>";
						return s;
					};
					for (var c=node.firstChild; c; c=c.nextSibling)
						s += asXml(c);
				}
				return s;
			},
			escape: function(txt) {
				return txt.replace(/[\\]/g, "\\\\")
							.replace(/[\"]/g, '\\"')
							.replace(/[\n]/g, '\\n')
							.replace(/[\r]/g, '\\r');
			},
			removeWhite: function(e) {
				e.normalize();
				for (var n = e.firstChild; n; ) {
					if (n.nodeType == TEXT_NODE) {  // text node
						if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
							var nxt = n.nextSibling;
							e.removeChild(n);
							n = nxt;
						}
						else
							n = n.nextSibling;
					}
					else if (n.nodeType == ELEMENT_NODE) {  // element node
						X.removeWhite(n);
						n = n.nextSibling;
					}
					else                      // any other node
					n = n.nextSibling;
				}
				return e;
			}
		};
		if (xml.nodeType == 9) //Ti.XML.Node.DOCUMENT_NODE) // document node
			xml = xml.documentElement;
		var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
		return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
	}
	
	/**
	 * Covert JSON to XML. Receives a JSON object, returns an XML string
	 * Attributes are preceded by the "@" character
	 * Values are signaled by the "#text" key ONLY when there are attributes
	 * tab or indent string for pretty output formatting. Omit or use empty string to supress
	 * returns JSON string
	 */
	self.jsonToXml = function (jsonobject, tab){
		var toXml = function(v, name, ind) {
			var xml = "";
			if (v instanceof Array) {
				for (var i=0, n=v.length; i<n; i++)
					xml += ind + toXml(v[i], name, ind+"\t") + "\n";
			}
			else if (typeof(v) == "object") {
				var hasChild = false;
				xml += ind + "<" + name;
				for (var m in v) {
					if (m.charAt(0) == "@")
						xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
					else
						hasChild = true;
				}
				xml += hasChild ? ">" : "/>";
				if (hasChild) {
					for (var m in v) {
						if (m == "#text")
							xml += v[m];
						else if (m == "#cdata")
							xml += "<![CDATA[" + v[m] + "]]>";
						else if (m.charAt(0) != "@")
							xml += toXml(v[m], m, ind+"\t");
					}
				xml += (xml.charAt(xml.length-1)=="\n"?ind:"") + "</" + name + ">";
				}
			}
			else {
				xml += ind + "<" + name + ">" + v.toString() +  "</" + name + ">";
			}
			return xml;
		}; 
		var xml="";
		for (var m in jsonobject)
			xml += toXml(jsonobject[m], m, "");
		return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
	}
	
	return self;
}

var util = new Util();

module.exports = util;