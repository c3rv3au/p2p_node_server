var Service_manager = require("../classes/services_manager.js");
var sm = new Service_manager();

var doc = { service_name: 'peers_manager' };
sm.start();
setTimeout(
	function() { 
		sm.service_manager_db.insert(doc, function (err, newDoc) {   // Callback is optional
			console.log("Service " + newDoc._id + " added");
		});
	}
,3000);