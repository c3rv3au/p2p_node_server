// Webservice to redirect the visitor to another URL

// TODO : We should use a direct widget for this so we don't repeat code

// Need a domain. All URL on the domain will be redirected

var Service = require('../classes/service.js');
var Webrequest = require('../classes/webrequest.js');
var Route = require('../classes/route.js');
var fs = require("fs");
var url = require("url");
var http = require('http');
var Api_request = require('../classes/api_request.js');

Web_redirect.prototype = new Service();

// Constructor
function Web_redirect() {
	Service.apply(this);
}

Web_redirect.prototype.api_set = function(webrequest) {
	if (typeof webrequest.query.domain_name === 'undefined') {
		// TODO - We should use an helper for this so we don't repeat code.
		webrequest.res.write(JSON.stringify({ success: false }));
		webrequest.res.end();
		return;
	}
	this.config.domain_name = webrequest.query.domain_name;
	if (typeof webrequest.query.url === 'undefined') {
		webrequest.res.write(JSON.stringify({ success: false }));
		webrequest.res.end();
		return;
	}
	this.config.url = webrequest.query.url;
	
	if (typeof webrequest.query.set_cookie !== 'undefined') {
		this.config.set_cookie = parseInt(webrequest.query.set_cookie);
	}
	
	if (typeof webrequest.query.alt_url !== 'undefined') {
		this.config.alt_url = webrequest.query.alt_url;
	}
	
	var self = this;
	this.save(function () {
		self.resstart(function () {
			// TODO - Routes could be added twice. We should remove old one from the webserver
			webrequest.res.write(JSON.stringify({ success: true }));
			webrequest.res.end();
		});
	});
}

Web_redirect.prototype.show_html = function (webrequest, callback) {
	var temp_sec = parseInt(Date.now()/1000);
	var res = webrequest.res;
	
	if (typeof this.config.alt_url !== 'undefined' && this.config.set_cookie == 1)
	  if (typeof webrequest.cookies.last_visit_at !== 'undefined')
        if (webrequest.cookies.last_visit_at > temp_sec - 120) {
        	res.writeHead(302, [
        	           	     ['Location', this.config.alt_url]
        	]);
        	res.end();
        	return callback();
        }

	res.writeHead(200, [
	     ['Set-Cookie', 'last_visit_at=' + temp_sec],
	  ]);	  
	
	  res.write("<html><head><title>TouTrix redirect</title>");
	  res.write("<meta http-equiv=\"refresh\" content=\"1; URL=" + this.config.url + "\">");

	  parsed = url.parse(this.config.url,true);
	  url2 = "http://" + parsed.hostname + parsed.pathname;

	  res.write("</head><body><form id='fori' name='fori' method=\"get\" action='" + url2 + "'>");

	  for (var p in parsed.query) {
	    if( parsed.query.hasOwnProperty(p) ) {
	      res.write("<input type='hidden' name='" + p + "' value='" + parsed.query[p] + "'>");
	    } 
	  }  
	  //res.write(the_url);
	  res.write("</form><script type=\"text/javascript\">function go() { document.fori.submit(); } go();</script>");
	  res.write("</body></html>");
	  res.end();
	  
	  return callback();
}

Web_redirect.prototype.start = function(callback) {
	console.log("Web_redirect start");
	var self = this;

	// Routes are copied to the webserver
	var route1 = new Route("*","GET","/api/web/" + self.service_id + "/set", function (webrequest) { self.api_set(webrequest); });

	if (typeof this.config.domain_name !== 'undefined') {
		console.log("Domain_name is defined")
		// We listen on all other routes to redirect everything
		var route2 = new Route(this.config.domain_name,"*","*", function (webrequest) {
			console.log("In webredirect. We should redirect now.");
			self.show_html(webrequest, function () {
			});
		});
		this.routes = [route1, route2];
	} else {
		this.routes = [route1];
	}
	
	this.running = true;
	return callback();
}

module.exports = Web_redirect;