const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Order_Line', {    
    quantity: {        
      type: DataTypes.INTEGER,
      allowNull: false      
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false      
    },
  });
};