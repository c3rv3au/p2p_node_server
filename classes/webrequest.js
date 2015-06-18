var url = require('url');

// Constructor
function Webrequest(req,res) {
    // always initialize all instance properties
	this.req = req;
	this.res = res;
	this.parts = url.parse(this.req.url, true);
	this.query = this.parts.query;
}

// export the class
module.exports = Webrequest;