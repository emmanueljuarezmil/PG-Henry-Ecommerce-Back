const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Product', {    
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true,
      is: /^[a-zA-Z]+(([ ,.-][a-zA-Z ])?[a-zA-Z]*)*$/
    },
    description: {
      type: DataTypes.TEXT,
      is: /[CDATA[^[a-zA-Z0-9 .-]+$]]/
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    image: {
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