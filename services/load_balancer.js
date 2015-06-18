// Load_balancer 
exports.done = false;

var Service = require('../classes/service.js');
var Webrequest = require('../classes/webrequest.js');
var Route = require('../classes/route.js');
var Loadbalancer_peer = require("../classes/loadbalancer_peer.js");
var fs = require("fs");
var http = require('http');

Load_balancer.prototype = new Service();

// Constructor
function Load_balancer() {
	Service.apply(this);
	//this.config.port = 80;
	//this.config.peers = new Array();
	this.http_server = null;
	this.peers = [];
	this.peers_available = [];
	this.timer = null;
}

Load_balancer.prototype.api_add_peer = function (webrequest, callback) {
	console.log("Inside Load_balancer.add_node of balancer id " + this.service_id);
	
	if (webrequest.query.peer_id.length > 0) {
		console.log("Peer to add : " + webrequest.query.peer_id);
	    webrequest.res.write(JSON.stringify({ success: true }));
	}
	
	if (typeof callback !== 'undefined')
	  return callback();
}

Load_balancer.prototype.get_an_available_peer = function () {
	return this.peers_available.shift();
}

Load_balancer.prototype.order_peers = function (callback) {
	var peers_available = [];

	this.peers.forEach(function(entry) {
		// We do only available node
		if (entry.available) {
			score = entry.latency;			
			peers_available.push(entry);
			// If we already sending request, we reduce score to give other peers some traffic
			if (entry.cur_connection > 0) {
				score = score + (entry.cur_connection*5);
			}
			entry.score = score;
		}
	});
	peers_available.sort(
	        function(a, b){
	          if (a.score < b.score)
	            return -1;
	          if (a.score > b.score)
	            return 1;
	           return 0;
	        }
	);
	//console.log("Available peers for this load balancer:")
	//console.log(peers_available);
	this.peers_available = peers_available;	
	return callback();
}

// This function verify all peers if they are available
Load_balancer.prototype.check_if_available = function (callback) {
	//console.log("load_balancer.check_if_available : " + this.service_id);
	this.peers.forEach(function(entry) {
		//console.log(entry.config.ip + " is " + entry.available + " not timeout: " + entry.not_timeout + " Latency: " + entry.latency);
		entry.check_if_available(function() {					
		});
	});
}

Load_balancer.prototype.proxy_request = function(req,res,callback) {
	// TODO : Il faut vérifier le pays d'origine, carrier ou autre donnée et l'envoyer au serveur web 
	
	proxy_server = this.get_an_available_peer();
	//console.log("Server choosed : ");
	//console.log(proxy_server);
	if (typeof proxy_server !== 'undefined') {
		webrequest = new Webrequest(req,res);
		proxy_server.cur_connection++;
		this.order_peers(function() {}); // On remet tout de suite l'ordre à jour
		proxy_server.proxy_request(webrequest, function () {
			proxy_server.cur_connection--;
			return callback();
		});
	} else {		
		this.send_not_available(req,res);
		return callback();
	}	
}

Load_balancer.prototype.start = function(callback) {
	var self = this;
	
	// Les routes sont copiées à partir du WebServer
	route1 = new Route("*","GET","/api/load_balancer/add_peer", function (datas) { self.api_add_peer(datas); });	
	route1.require_auth = true;
	this.routes = [route1];
	
	this.peers = [];
	// We load all peers
	this.config.peers.forEach(function(entry){
		console.log("Load balancer peer : " + entry);
		var new_peer = new Loadbalancer_peer();		
		new_peer.load(entry, function() {
			self.peers.push(new_peer);
		});
	});
	
	// forEach is async because there is a async function inside. So the load balancer is started even if no peers is actually really added
	//console.log("Really starting load_balancer id : " + this.service_id + " on port : " + this.config.port);
	var self = this;
	this.http_server = http.createServer(function(req, res) {		
		self.proxy_request(req, res, function () {
		});
	}).listen(this.config.port);
	
	setInterval(function(){
		  self.check_if_available(function(){ });
		  self.order_peers(function(){ });
	}, 2000);
	
	this.running = true;

	return callback();
}

Load_balancer.prototype.add_peer = function (peer) {
	this.config.peers.push(peer.peer_id);
	this.peers.push(peer);
	this.save(function(){
		console.log("Node added and saved");
	});
}

Load_balancer.prototype.send_not_available = function (req,res) {
	res.write("No node available to take your request");
	res.end();
}

/*
Load_balancer.prototype.save = function(callback) {
	var datas_to_save = {};
	datas_to_save.port = 80;
	datas_to_save.peers_list = this.peers;
    json_str = JSON.stringify(datas_to_save);
    console.log("Saving this data: " + json_str);
    this.save_service_config(json_str,function() {
    	return callback();
    });
}
*/

// export the class
module.exports = Load_balancer;

//exports.done = true;
console.log("load_balancer started");