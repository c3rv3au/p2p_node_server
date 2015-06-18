//Constructor
function Route(domain, methode, path, the_function) {
	this.domain = domain;
	this.methode = methode;
	this.path = path;
	this.the_function = the_function;
	this.service = null;
	this.require_auth = false;
}

Route.prototype.run_function = function (webrequest,callback) {
	this.the_function(webrequest, function() {
		return callback();
	});
}

// export the class
module.exports = Route;