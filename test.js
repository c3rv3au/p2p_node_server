// Pour appeler les APIs

	var md5 = require('MD5')
	var me = User.create({
		username: 'egrenier',
	    password: md5('quebecli'),
	    is_admin: true
	});
	console.log(me);

	sqlized.query("SELECT * FROM `users`", { model: dbs.models.User, type: sqlized.QueryTypes.SELECT})
	.then(function(users) {
	  // We don't need spread here, since only the results will be returned for select queries
		console.log(users);
	})

	
/*
all_users = User.findAll();
console.log("All users:");
console.log(all_users);
*/