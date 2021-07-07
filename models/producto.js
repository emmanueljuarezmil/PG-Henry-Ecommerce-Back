const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Producto', {    
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true,
      is: /^[a-zA-Z]+(([ ,.-][a-zA-Z ])?[a-zA-Z]*)*$/
    },
    descrip: {
      type: DataTypes.TEXT,
      is: /[CDATA[^[a-zA-Z0-9 .-]+$]]/
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stock_spell:{
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    perc_desc: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
  });
};