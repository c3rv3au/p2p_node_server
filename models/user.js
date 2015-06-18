module.exports = function(sequelize, DataTypes) {
	return sequelize.define('user', {
	    id: {
	      type: DataTypes.INTEGER,
	      primaryKey: true,
	      autoIncrement: true
	    },
	    username: { type: DataTypes.STRING, unique: true },
	    //username: DataTypes.STRING,
	    password: DataTypes.STRING,
	    is_admin: DataTypes.BOOLEAN
	});
};