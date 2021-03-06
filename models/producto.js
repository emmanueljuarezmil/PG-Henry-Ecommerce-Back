const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Product', {    
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
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
    photo: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    stock:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    selled:{
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    perc_desc: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  });
};
