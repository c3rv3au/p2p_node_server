// Service parent class. Should never be used directly. It do nothing.

var fs = require("fs");

// Constructor
function Service() {
    // always initialize all instance properties
	this.config = {};
	this.running = false;
	this.service_id = null;
	this.uniqueness = false;
	this.auto_start = true;
	this.routes = {}; // Webserver routes
}

// class methods
Service.prototype.start = function(callback) {
	this.running = true;
	console.log("Started service: " + this.service_id);
	return callback(0);
};

Service.prototype.stop = function(callback) {
	this.running = false;
	return callback(0);
};

Service.prototype.load = function(_id, callback) {
	var self = this;
	
	console.log("In service class and load id: " + _id);
	this.service_id = _id;
	
	var filename = "./conf/" + this.service_id + ".json";
	fs.exists(filename, function (exists) {
		  if (exists) {
			  fs.readFile(filename, function(err,datas) {
				 console.log(datas + " found in conf file");
				 self.config = JSON.parse(datas);
				 console.log(self.config);				 
				 console.log("Is auto start: " + self.auto_start);
				 if (self.auto_start) {
	 			    console.log("Auto Start");
				    self.start(function () {		
					});
				 }

					
				 return callback();
			  });
		  } else {
			  if (self.auto_start) {
	 			console.log("No config file. Auto Starting..");
				self.start(function () {
					return callback();
				});
			  } else {
				  return callback();
			  }
		  }
    });
}

Service.prototype.save = function(callback) {	
    json_str = JSON.stringify(this.config);
    console.log("Saving this data: " + json_str);
    this.save_service_config(json_str,function() {
    	return callback();
    });
}

Service.prototype.save_service_config = function(json_str, callback) {	
	console.log("Saving id: " + this.service_id);		
	var filename = "conf/" + this.service_id + ".json";
	console.log("Writing to : " + filename);
	fs.writeFile(filename, json_str, function(err) {
	    if(err) {
	    	console.log(err);
	        return callback(err);
	    }

	    console.log("The configuration file was saved!");
	    return callback(null);
	}); 
}

// export the class
module.exports = Service;
