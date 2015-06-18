var Database_manager = require("./classes/databases_manager.js");
//console.log(Database_manager);
var dbs = new Database_manager();
//console.log(dbs);

var Service_manager = require("./classes/services_manager.js");
var sm = new Service_manager();
sm.set_db_manager(dbs);
console.log(sm);
sm.start();

/*
setTimeout(function () {
	le_load_balancer = Service_manager.get_service("oSAZSrGD4hKG2Rxo");
	console.log("setTimeout got balancer");
	//console.log(le_load_balancer);
	
	var Loadbalancer_peer = require("./classes/loadbalancer_peer.js");
	var new_peer = new Loadbalancer_peer();
	new_peer.peer_id = 3;
	new_peer.config.ip = "54.85.30.14";
	new_peer.config.port = 80;
	new_peer.save(function () {
		le_load_balancer.add_peer(new_peer);
	});
	
	
	//new_peer.load(3, function() {
		//le_load_balancer.add_peer(new_peer);
	//});
},2000);
*/



/*
    require('fs').readdirSync(__dirname + '/classes/').forEach(function(file) {
	  if (file.match(/\.js$/) !== null && file !== 'index.js') {
	    var name = file.replace('.js', '');
	    exports[name] = require('./classes/' + file);
	  }
	});

*/