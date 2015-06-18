var fs = require("fs");

//Constructor
function Peer() {
    // always initialize all instance properties
	this.config = {};
	this.available = false;
	this.peer_id = null;	
}

Peer.prototype.load = function(_id, callback) {
	var self = this;

	console.log("In peer class and load id: " + _id);
	this.peer_id = _id;

	var filename = "./peers/" + this.peer_id + ".json";
	fs.exists(filename, function (exists) {
		  if (exists) {
			  fs.readFile(filename, function(err,datas) {
				 console.log(datas + " peer found in conf file");
				 self.config = JSON.parse(datas);
				 console.log(self.config);
				 return callback();
			  });
		  } else {
			  return callback();
		  }
    });
}

Peer.prototype.save = function(callback) {	
    json_str = JSON.stringify(this.config);
    console.log("Saving peer data: " + json_str);
    
    console.log("Saving peer id: " + this.peer_id);		
	var filename = "peers/" + this.peer_id + ".json";
	console.log("Writing to : " + filename);
	fs.writeFile(filename, json_str, function(err) {
	    if(err) {
	    	console.log(err);
	        return callback(err);
	    }

	    console.log("The peer file was saved!");
	    return callback(null);
	});
}

// export the class
module.exports = Peer;

