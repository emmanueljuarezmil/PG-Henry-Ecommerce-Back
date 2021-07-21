const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Review', {
	    id:{
	      type: DataTypes.UUID,
        primaryKey: true,
	      allowNull: false
	    },
      comment: {
        type: DataTypes.TEXT
      },
      rating: {
        type: DataTypes.ENUM("0","1","2","3","4","5"),
        allowNull: false
      },
    });
  };                                                                                       
