var url = require('url');

// Constructor
function Webrequest(req,res) {
    // always initialize all instance properties
	this.req = req;
	this.res = res;
	this.parts = url.parse(this.req.url, true);
	this.query = this.parts.query;
	this.cookies = parseCookies(this.req);
}

function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        try {
        	list[parts.shift().trim()] = decodeURI(parts.join('='));
        } catch (e) {
            // ignore parse exceptions
        }
    });

    return list;
}

// export the class
module.exports = Webrequest;