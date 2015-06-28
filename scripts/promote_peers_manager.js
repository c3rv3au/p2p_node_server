// Should be executed only one time by us. Do not call this script If you don't know what you are doing.
// It could break your entire server farm

var Service_manager = require("../classes/services_manager.js");
var sm = new Service_manager();

var PeerManage_manager = require("../services/peers_manager.js");
var pm = new PeerManage_manager();

var fs = require('fs');

sm.start();
setTimeout(
	function() {
		var conf = { peer_id: 1 }
		var line = JSON.stringify(conf);
		
		fs.writeFile("./conf/peer.json", line, function(err) {
		    if(err) {
		        return console.log(err);
		    }

		    console.log("The first config file was saved!");

		    var the_peer = pm.Peer.build({remote_ip: '127.0.0.1'});
			console.log(the_peer);
			the_peer.save().then(function() {
				console.log("Peer id is: " + the_peer.id);
			}).catch(function() {
			});
		});

		var doc = { service_name: 'peers_manager' };
		sm.service_manager_db.insert(doc, function (err, newDoc) {   // Callback is optional
			console.log("Service " + newDoc._id + " added");
		});
	}
,3000);