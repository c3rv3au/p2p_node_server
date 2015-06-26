// Setup the peer for the first time

function Setup(db_manager) {		
	this.db_manager = db_manager;	
}

Setup.prototype.run = function() {
	var self = this;
	auth_db = this.db_manager.get_database("auth_db");
	auth_db.sync().then(function() {
		console.log('Succesfully synced users DB!');
		self.create_peer_conf();
	}, self.syncError);	
}

Setup.prototype.create_peer_conf = function () {
	// Make an API call to receive a peer_id..
	var peer_id = 7;

	var conf = { peer_id: peer_id }
	var line = JSON.stringify(conf);
	
	var fs = require('fs');
	fs.writeFile("./conf/peer.json", line, function(err) {
	    if(err) {
	        return console.log(err);
	    }

	    console.log("The first config file was saved!");
	}); 
}

Setup.prototype.syncError = function(ex) {
    console.log('Error while executing users DB sync: '+ ex.message, 'error');
}

module.exports = Setup;