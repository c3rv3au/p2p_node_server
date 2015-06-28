var peer_updater = require("./auto_update.js");

var numCPUs = require('os').cpus().length;

// TODO - Check if the first time we run it on this host. If yes, he should get a peer ID from API peer master.

var Database_manager = require("./classes/databases_manager.js");
var dbs = new Database_manager();

var Service_manager = require("./classes/services_manager.js");
var sm = new Service_manager();
sm.set_db_manager(dbs);
console.log(sm);
sm.start();

/*
var Peers_manager = require("./services/peers_manager.js");
var pm = new Peers_manager();
*/

function get_user_db() {
	return {
	    storage: __dirname + '/datas/users.sqlite',
	    dialect: 'sqlite'  
	};
}

var Sequelize = require('sequelize');
var auth_db = new Sequelize(null,null,null,get_user_db());

var User = auth_db.import(__dirname + '/models/user.js')
dbs.models.User = User;

dbs.add_database("auth_db",auth_db);

// Setup the node for the first time?
var fs = require('fs'); 
fs.exists('conf/peer.json', function(exists) { 
  if (!exists) { 
      // It not exist, this is the first run
	  var Setup = require("./setup.js");
	  console.log(Setup);
	  console.log("passe");
	  var setup = new Setup(dbs);
	  setup.run();
  } 
}); 

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