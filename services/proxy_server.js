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
	this.http_server = null;
	this.one_per_peer = true;
	this.proxy = httpProxy.createProxyServer({});
	
	http.createServer(function (req, res) {
		  res.writeHead(200, { 'Content-Type': 'text/plain' });
		  res.write('request successfully proxied to: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
		  res.end();
	}).listen(9008);
}

Proxy_server.prototype.api_set = function(webrequest) {
	if (typeof webrequest.query.port !== 'undefined') {
		this.config.port = parseInt(webrequest.query.port);
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

Proxy_server.prototype.proxy_request = function(req,res,callback) {
	// TODO : Verify if we have access to this proxy
	var target = req.url;
	console.log("Target: " + target);
	this.proxy.web(req, res, {target: target}, function (e) {
	       return callback();
	});
}

Proxy_server.prototype.start = function(callback) {
	var self = this;
	
	var route1 = new Route("*","GET","/api/proxy/" + self.service_id + "/set", function (webrequest) { self.api_set(webrequest); });
	console.log(route1);

	
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