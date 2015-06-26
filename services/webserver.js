// Webserver

var Service = require('../classes/service.js');
var Webrequest = require('../classes/webrequest.js');
var Route = require('../classes/route.js');
var fs = require("fs");
var http = require('http');
var url = require('url');

Webserver.prototype = new Service();

// Constructor
function Webserver() {
	Service.apply(this);
	this.config.port = 80;
	this.http_server = null;
	this.peers = [];
	this.peers_available = [];
	this.timer = null;
	this.routes = [];
}

Webserver.prototype.addroute = function (route) {
	this.routes.push(route);
}

Webserver.prototype.webrequest = function(req,res, callback) {
	the_webrequest = new Webrequest(req,res);
	console.log("webrequest received");
	// We have to find the good route
	var self = this;

	var route_found = false;
	var url_parts = url.parse(req.url);

	this.routes.forEach(function (route) {
		if (!route_found) {
			var pls_continue = false;
			if (route.domain == '*')
				pls_continue = true;
			//if (route.domain == req.hostname)
			//	pls_continue = true;
			if (pls_continue) {
				if (url_parts.pathname == route.path) {
					route_found = true;
					console.log("We found the good route");
					pls_run = true;
					if (route.require_auth) {
						var token = the_webrequest.query.token || the_webrequest.req.headers['x-access-token'];
						if (token == 'a1b2c3d4e5') {
							route.run_function(the_webrequest, function() {
								return callback();
							});
						} else {
							self.send_403(req,res);
							return callback();
						}
					} else {
						route.run_function(the_webrequest, function() {
							return callback();
						});
					}
				}
			}
		}
	});
	
	if (!route_found) {
		this.send_404_not_found(req,res);		
		return callback();
	}	
}

Webserver.prototype.start = function(callback) {
	var self = this;
	this.http_server = http.createServer(function(req, res) {		
		self.webrequest(req, res, function () {			
		});
	}).listen(this.config.port);
	return callback();
}

Webserver.prototype.send_404_not_found = function (req,res) {
	res.write("404 not found");
	res.end();
}

Webserver.prototype.send_403 = function (req,res) {
	res.write("403 forbidden");
	res.end();
}

Webserver.prototype.send_401 = function (req,res) {
	res.write("401 Unauthorized");
	res.end();
}

// export the class
module.exports = Webserver;
