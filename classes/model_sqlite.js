// NOT USED

var Model = require('model.js');

Model_sqlite.prototype = new Model();

function Model_sqlite() {
	Model.apply(this);
}

Model_sqlite.prototype.save = function (callback) {
	return callback(null);
}

// export the class
module.exports = Model_sqlite;