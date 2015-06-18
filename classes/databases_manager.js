// We need to be able to use a local database or a remote one. It need to be automated, we don't want
// to take care about that in the rest of codes.

function Database_manager() {
	this.databases = [];
	this.models = {};
}

Database_manager.prototype.add_database = function(name,database) {
	database.name = name;
	this.databases.push(database);
}

Database_manager.prototype.get_database = function(name) {
	var found = null;
	this.databases.forEach(function(entry) {
		if (entry.name == name)
			found = entry;
	});
	return found;
}

//exports.add_database = add_database;
//exports.get_database = get_database;

module.exports = Database_manager;
