const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Order', {    
      status: {
        type: DataTypes.ENUM('approved', 'cancelled','pending', 'cart'),
        defaultValue: 'cart',
        allowNull: false,
      },
      shippingStatus: {
        type: DataTypes.ENUM('uninitiated', 'processing','approved', 'cancelled'),
        defaultValue: 'uninitiated',
        allowNull: false,
      },
    });
  };