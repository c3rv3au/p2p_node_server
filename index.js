var peer_updater = require("./auto_update.js");

var numCPUs = require('os').cpus().length;

var Database_manager = require("./classes/databases_manager.js");
//console.log(Database_manager);
var dbs = new Database_manager();
//console.log(dbs);

var Service_manager = require("./classes/services_manager.js");
var sm = new Service_manager();
sm.set_db_manager(dbs);
console.log(sm);
sm.start();

function get_user_db() {
	return {
	    storage: __dirname + '/datas/users.sqlite',
	    dialect: 'sqlite'  
	};
}

var Sequelize = require('sequelize');
var sqlized = new Sequelize(null,null,null,get_user_db());

var User = sqlized.import(__dirname + '/models/user.js')
dbs.models.User = User;

//sqlized.sync().then(syncSuccess, syncError);

/*
all_users = User.findAll();
console.log("All users:");
console.log(all_users);
*/

sqlized.query("SELECT * FROM `users`", { model: dbs.models.User, type: sqlized.QueryTypes.SELECT})
.then(function(users) {
  // We don't need spread here, since only the results will be returned for select queries
	console.log(users);
})

function syncSuccess() {
	console.log('Succesfully synced users DB!');
}

function syncError(ex) {
    console.log('Error while executing users DB sync: '+ ex.message, 'error');
}

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