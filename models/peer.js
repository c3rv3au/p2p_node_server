module.exports = function(sequelize, DataTypes) {
	return sequelize.define('peer', {
	    id: {
	      type: DataTypes.INTEGER,
	      primaryKey: true,
	      autoIncrement: true
	    },
	    remote_ip: { type: DataTypes.STRING },
	    local_ip: DataTypes.STRING,
	    owner_user_id: DataTypes.INTEGER,
	});
};