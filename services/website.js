// Website

var Service = require('../classes/service.js');
var Webrequest = require('../classes/webrequest.js');
var Route = require('../classes/route.js');
var fs = require("fs");
var http = require('http');
var url = require('url');

Website.prototype = new Service();

// Constructor
function Website() {
	Service.apply(this);
	this.config.domain_name = '';
	this.config.first_page = '';
	this.routes = [];
	this.other_routes = [];
	
	var self = this;
}

Website.prototype.start = function(callback) {	
	var self = this;
	this.running = true;
	
	// Routes are copied to the webserver
	var route1 = new Route("*","GET","/api/web/" + self.service_id + "/set", function (webrequest) { self.api_set(webrequest); });
	this.routes = [route1];
	if (this.config.domain_name.length > 0) {
		var route2 = new Route(this.config.domain_name,"GET","/", function (webrequest) { self.main_page(webrequest); });
		this.routes.push(route2);
		
		var route3 = new Route(this.config.domain_name,"GET","/search", function (webrequest) { self.search(webrequest); });
		this.routes.push(route3);
	}	

	return callback();
}

Website.prototype.render_page = function (webrequest, widget) {
	webrequest.res.write("<html><body>");
	widget.show_html(webrequest, function () {
		webrequest.res.write("</body></html>");
		webrequest.res.end();
	});
}

Website.prototype.main_page = function(webrequest) {
	var s_box = require('../widgets/search_box.js');
	var sbox = new s_box();
	this.render_page(webrequest,sbox);	
}

Website.prototype.search = function(webrequest) {
	var search_page = require('../widgets/search_page.js');
	var search = new search_page();
	this.render_page(webrequest,search);
}

Website.prototype.api_set = function(webrequest) {
	console.log(webrequest.query);
	if (typeof webrequest.query.domain_name !== 'undefined') {
		this.config.domain_name = webrequest.query.domain_name;
	}
	
	if (typeof webrequest.query.first_page === 'undefined') {
		this.config.first_page = webrequest.query.first_page;
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

module.exports = Website;
