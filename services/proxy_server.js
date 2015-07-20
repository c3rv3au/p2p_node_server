var Service = require('../classes/service.js');
var Webrequest = require('../classes/webrequest.js');
var fs = require("fs");
var http = require('http');
var Route = require('../classes/route.js');
var httpProxy = require('http-proxy');

Proxy_server.prototype = new Service();

// Constructor
function Proxy_server() {
	Service.apply(this);
	this.config.port = 8080;
	this.config.authorized_ip = [];
	this.http_server = null;
	this.one_per_peer = true;
	this.proxy = httpProxy.createProxyServer({});
	
	http.createServer(function (req, res) {
		  res.writeHead(200, { 'Content-Type': 'text/plain' });
		  res.write('request successfully proxied to: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
		  res.end();
	}).listen(9008);
}

Proxy_server.prototype.api_add_ip = function(webrequest) {
	// TODO - All workers should reload with the new IP
	
	if (typeof webrequest.query.ip !== 'undefined') {
		this.config.authorized_ip.push(webrequest.query.ip);
	} else {
		webrequest.res.write(JSON.stringify({ success: false }));
		webrequest.res.end();
		return;
	}

	var self = this;
	this.save(function () {
		webrequest.res.write(JSON.stringify({ success: true }));
		webrequest.res.end();
	});
}

Proxy_server.prototype.verify_firewall = function(client_ip, callback) {
	if (this.config.authorized_ip.length == 0) {
		console.log("No authorized IP, we allow everything for the moment");
		return callback(true);
	}
	
	for (var i = 0, len = this.config.authorized_ip.length; i < len; i++) {
		  if (this.config.authorized_ip[i] === client_ip)
				return callback(true);
	}
	/*
	this.config.authorized_ip.forEach(function(entry) {
		console.log("compare " + entry  + " and " + client_ip);
		if (entry === client_ip)
			return callback(true);
	});
	*/
	return callback(false);
}

Proxy_server.prototype.api_set = function(webrequest) {
	if (typeof webrequest.query.port !== 'undefined')
		this.config.port = parseInt(webrequest.query.port);

	var self = this;
	this.save(function () {
		self.resstart(function () {
			// TODO - Routes could be added twice. We should remove old one from the webserver
			webrequest.res.write(JSON.stringify({ success: true }));
			webrequest.res.end();
		});
	});
}

Proxy_server.prototype.proxy_request = function(req,res,callback) {
	// TODO : Add HTTPS
	var client_ip = '';
	if (typeof req.headers['x-forwarded-for'] !== 'undefined') {
	    var pieces = req.headers['x-forwarded-for'].split(/[\s,]+/);
	    ip = pieces[0];
	    client_ip = ip;
	  } else if (typeof req.headers['x-forwarded-For'] !== 'undefined') {
	    var pieces = req.headers['x-forwarded-For'].split(/[\s,]+/);
	    ip = pieces[0];
	    client_ip = ip;
	  } else {
		client_ip = req.connection.remoteAddress;
	}
	
	var self = this;
	
	this.verify_firewall(client_ip, function (pass){
		if (pass) {
			var target = req.url;
			console.log("Target: " + target);
			self.proxy.web(req, res, {target: target}, function (e) {
			       return callback();
			});
		} else {
			console.log("Proxy unauthorized");
			res.writeHead(401);
			res.end();
			return callback();
		}
	});
}

Proxy_server.prototype.start = function(callback) {
	var self = this;
	
	var route1 = new Route("*","GET","/api/proxy/" + self.service_id + "/set", function (webrequest) { self.api_set(webrequest); });	
	var route2 = new Route("*","GET","/api/proxy/" + self.service_id + "/add_ip", function (webrequest) { self.api_add_ip(webrequest); });
	this.routes = [route1,route2];

	this.http_server = http.createServer(function(req, res) {		
		self.proxy_request(req, res, function () {
		});
	}).listen(this.config.port);
	console.log("Proxy listen on " + this.config.port);

	this.running = true;
	return callback();
}

Proxy_server.prototype.stop = function(callback) {
	this.http_server.stop(function() {
		this.running = false;
		return callback();
	});	
}

// export the class
module.exports = Proxy_server;

//exports.done = true;
console.log("proxy_server started");