var Widget = require('../classes/widget.js');
var Reach = require('../classes/advertising/3rd/reachnetwork.js');

Search_page.prototype = new Widget();

//Constructor
function Search_page() {
	Widget.apply(this);
}

Search_page.prototype.show_html = function(webrequest, callback) {
	res = webrequest.res;
	
	res.write("<form action='/search'><input type='text' name='q'><input type='submit' name='b' value='Submit'></form>");
	referer_url = webrequest.req.url;
	
	//webrequest.client_ip = "8.8.4.4";
	
	var r = Reach.reachnetwork (webrequest.client_ip, webrequest.query.q, 1, webrequest.userAgent, referer_url, function (results) {
		//console.log(results);
		res.write("<h1>Results</h1>")
		res.write("<ul>");
		
		if (results != null)
			results.record.forEach(function (entry) {
				//console.log("Entry");
				//console.log(entry);
				res.write("<li><a href='" + entry.click + "'>" + entry.title + "</a><br/><font color='green'>" + entry.url + "</font></li>");
			});
		res.write("</ul>");
		return callback();
	});	
}

module.exports = Search_page;
