// Peers manager is activated on only one machine at a time
// uniqueness = true

var Service = require('../classes/service.js');
var Route = require('../classes/route.js');

Peers_Manager.prototype = new Service();

// Constructor
function Peers_Manager() {
	Service.apply(this);

	function get_peers_db() {
		return {
		    storage: './datas/peers.sqlite',
		    dialect: 'sqlite'  
		};
	}

	var Sequelize = require('sequelize');
	this.peer_db = new Sequelize(null,null,null,get_peers_db());
	//console.log(this.peer_db);

	this.Peer = this.peer_db.import('../models/peer.js');	

	this.peer_db.sync().then(function() {
		console.log('Succesfully synced peers DB!');		
	}, function(err) {
		console.log('Oops! Problem with peers DB');
		console.log(err);
	});	

	// TODO - It should be done
	//dbs.models.Peer = Peer;
	//dbs.add_database("peer_db",peer_db);
}

Peers_Manager.prototype.api_show_peers = function (webrequest, callback) {	
	this.Peer.findAll({}).then(function(results) {
		console.log(results);
		webrequest.res.write(JSON.stringify({ success: true, datas: results }));
		webrequest.res.end();
	});
}

Peers_Manager.prototype.api_create_peer = function (webrequest, callback) {
	//console.log(this);
	console.log("Inside Peers_Manager.create_peer " + this.service_id);

	// TODO - Add a limit of 1 per IP per minute.
	if (typeof webrequest.req.headers['x-forwarded-for'] !== 'undefined') {
	    var pieces = webrequest.req.headers['x-forwarded-for'].split(/[\s,]+/);
	    ip = pieces[0];
	    the_ip = ip;
	  } else if (typeof webrequest.req.headers['x-forwarded-For'] !== 'undefined') {
	    var pieces = webrequest.req.headers['x-forwarded-For'].split(/[\s,]+/);
	    ip = pieces[0];
	    the_ip = ip;
	  } else {
		the_ip = webrequest.req.connection.remoteAddress;
	  }
	console.log("The IP : " + the_ip);
	
	// We create a new peer
	var the_peer = this.Peer.build({remote_ip: the_ip});
	console.log(the_peer);
	the_peer.save().then(function() {
		console.log("Peer id is: " + the_peer.id);
		
		webrequest.res.write(JSON.stringify({ success: true, id: the_peer.id }));
		webrequest.res.end();
		
		if (typeof callback !== 'undefined')
			return callback();
	}).catch(function() {
		webrequest.res.write(JSON.stringify({ success: false }));
		
		if (typeof callback !== 'undefined')
			return callback();
	});
}

Peers_Manager.prototype.start = function(callback) {
	console.log("peers_manager is starting");
	var self = this;
	
	// Les routes sont copiées à partir du WebServer
	route1 = new Route("*","GET","/api/peer/create_peer", function (webrequest) { self.api_create_peer(webrequest); });			
	route2 = new Route("*","GET","/api/peer/list", function (webrequest) { self.api_show_peers(webrequest); });		

	this.routes = [route1, route2];

	self.running = true;

	console.log("peers_manager is started");
	return callback();
}

// export the class
module.exports = Peers_Manager;

//exports.done = true;
//console.log("peers_manager started");