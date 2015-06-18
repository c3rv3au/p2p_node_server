// Il faut que tout puisse être local et aussi à distance. Donc quand c'est à distance, l'API appel
// l'autre serveur pour recevoir les données. Et quand c'est local, tout est executer en local

function Database_manager() {
	this.databases = [];
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
