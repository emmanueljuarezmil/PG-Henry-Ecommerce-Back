const { sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('User', {
    id:{
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    name:{
      type: DataTypes.STRING(64),
      is: /^[a-zA-Z]+(([ ][a-zA-Z ])?[a-zA-Z]*)*$/
    },
    userName:{
        type: DataTypes.STRING(64),
        unique: true,
        allowNull: false,
        is: /^[a-zA-Z]+(([ ,.-][a-zA-Z ])?[a-zA-Z]*)*$/
    },
    email: {
      type: DataTypes.STRING(64),
      unique: true,
      allowNull: false,
      is: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    hashedPassword: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    shippingAddress: {
      type: DataTypes.ARRAY(DataTypes.TEXT)
    },
    authenticationCode: {
      type: DataTypes.INTEGER
    },
    authenticatedByCode: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
};