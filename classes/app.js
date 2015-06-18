var Datastore = require('nedb')
  , db = new Datastore({ filename: 'datas/account.dat', autoload: true });
db.loadDatabase(function (err) {    // Callback is optional
	console.log("database loaded");
  // Now commands will be executed
});