// NOT USED

// Dans le modele, il faut prendre en consideration si la base de donnée est local ou à distance
// afin de simplifier la programmation, nous ne devons pas s'occuper à savoir si la BD est
// local ou distante.

//Constructor
function Model() {
    // always initialize all instance properties
}

Model.prototype.save = function (callback) {
	return callback(null);
}

Model.prototype.select = function(_id,callback) {
	return callback(null);
}

Model.prototype.remove = function(_id,callback) {
	return callback(null);
}

// export the class
module.exports = Model;
