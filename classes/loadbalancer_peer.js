/*
var new_peer = new Loadbalancer_peer();
new_peer.config.ip = "54.210.98.203";
new_peer.config.port = 80;
new_peer.peer_id = 2;
new_peer.save(function() {
});

var new_peer = new Loadbalancer_peer();
new_peer.load(2, function() {
});
*/

var Peer = require('../classes/peer.js');
var http = require('http');
var httpProxy = require('http-proxy');

Loadbalancer_peer.prototype = new Peer();

function Loadbalancer_peer() {
	Peer.apply(this);
	this.timeout = false;
	this.not_timeout = 0;
	this.latency = 10000;
	this.is_backup = false;
	this.cur_connection = 0;
	this.tot_connection = 0;
	this.score = 10000;
	this.proxy = httpProxy.createProxyServer({});
}

Loadbalancer_peer.prototype.proxy_request = function (webrequest, callback) {
	this.proxy.web(webrequest.req, webrequest.res, { target: 'http:/' + this.config.ip + ':' + this.config.port }, function (e) {
       return callback();		
	});
}

Loadbalancer_peer.prototype.check_if_available = function (callback) {
	var self = this;
	var start_at = new Date().getTime();
	//console.log("loadbalancer_peer.check_if_available ip : " + this.peer_id + " IP: " + this.config.ip);
	
	this.not_timeout++;
	
	if (this.not_timeout > 5) {
		this.available = true;
	} else {
		this.available = false;
	}
	
	var options = {
			    host: this.config.ip,
			    port: 80,
			    path: "/haproxy_health_check"
	}

	var request = http.request(options, function (res) {
		//console.log('STATUS: ' + res.statusCode + " on " + self.config.ip);
		//console.log('HEADERS: ' + JSON.stringify(res.headers));

		if (res.statusCode != 200)
			self.not_timeout = 0;
		
		var data = '';
		res.on('data', function (chunk) {
          data += chunk;
          console.log("Receiving : " + chunk);
        });
		res.on('end', function () {
			var end_at = new Date().getTime();
			self.latency = end_at - start_at;
		});	
	});

    request.on('socket', function (socket) {
      socket.setTimeout(500);
	  socket.on('timeout', function() {
		  self.timeout = true;
		  self.not_timeout = 0;
		  request.abort();
		  console.log("loadbalancer_peer timeout on " + self.config.ip);
          self.available = false;
      });
	});

	request.on('error', function (e) {
		console.log("Loadbalancer_peer.prototype.check_if_available : " + e.message + " on " + self.config.ip);
		self.not_timeout++;      
	});

	request.end();
	return callback();
}

// export the class
module.exports = Loadbalancer_peer;