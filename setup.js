// Setup the peer for the first time
var config = require('./p2p_config.js'); 

function Setup(db_manager) {		
	this.db_manager = db_manager;	
}

Setup.prototype.run = function() {
	var self = this;
	auth_db = this.db_manager.get_database("auth_db");
	auth_db.sync().then(function() {
		console.log('Succesfully synced users DB!');
		self.create_peer_conf( function() {
			
		});
	}, self.syncError);	
}

Setup.prototype.create_peer_conf = function (callback) {
	// Make an API call to receive a peer_id
	var request = require('request');
	request('http://' + config.peer_api_url + '/api/peer/create_peer', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    console.log("RESPONSE " + body);
	    try {
	        var parsed = JSON.parse(body);
	        var peer_id = parsed.id
	    } catch (ex) {
	    	// Create an error here
	    	  return callback(err);
	    }

		var conf = { peer_id: peer_id }
		var line = JSON.stringify(conf);
		
		var fs = require('fs');
		fs.writeFile("./conf/peer.json", line, function(err) {
		    if(err) {
		        return console.log(err);
		    }

		    console.log("The first config file was saved!");
		}); 
	  } else {
		  console.log("Error in getting a peer ID");
	  }
	})
}

Setup.prototype.syncError = function(ex) {
    console.log('Error while executing users DB sync: '+ ex.message, 'error');
}

module.exports = Setup;