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
	this.other_routes = [];
	
	var self = this;
	
	var route1 = new Route("*","GET","/api/webserver/list", function (webrequest) { self.api_list(webrequest); });	
	//route1.require_auth = true;
	
	this.addroute(route1);
}

Webserver.prototype.api_list = function (webrequest) {
	var retour = new Array();
	this.routes.forEach(function (entry) {
		var the_new = {domain: entry.domain, methode: entry.methode, path: entry.path};
		retour.push(the_new);
	});
	
	webrequest.res.write(JSON.stringify(retour));
	webrequest.res.end();
}

Webserver.prototype.addroute = function (route) {
	if (route.domain == "*" && route.methode == "*" && route.path == "*") {
		this.other_routes.push(route);
	} else {
		this.routes.push(route);
	}
}

function get_server_hostname(req) {
	  hostname = req.headers['host'];
	  if (hostname.substring(0, 3)=='js.')
	    hostname = hostname.substring(3);
	  if (hostname.substring(0, 2)=='m.')
	    hostname = hostname.substring(2);
	  if (hostname.substring(0, 5)=='serv.')
	    hostname = hostname.substring(5);
	  return hostname;
	}


Webserver.prototype.webrequest = function(req,res, callback) {
	the_webrequest = new Webrequest(req,res);
	console.log("webrequest received");
	// We have to find the good route
	var self = this;

	var route_found = false;
	var url_parts = url.parse(req.url);
	
	var hostname =get_server_hostname(req);

	this.routes.forEach(function (route) {
		if (!route_found) {
			//console.log("Hostname: " + req.headers['host']);
			var pls_continue = false;
			if (route.domain == '*')
				pls_continue = true;
			if (route.domain == hostname) 
				pls_continue = true;
			if (pls_continue) {
				if (url_parts.pathname == route.path || route.path == '*') {
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
		this.other_routes.forEach(function (route) {
			route_found = true;
			route.run_function(the_webrequest, function() {
				return callback();
			});
		});
		if (!route_found) {
			this.send_404_not_found(req,res);
		}
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
