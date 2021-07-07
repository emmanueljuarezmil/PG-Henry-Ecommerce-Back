const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Categorias', {    
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
/*       type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true, */
      unique: true,
    },
    name: {
      type: DataTypes.STRING(32),
      allowNull: false,
      is: /^[a-zA-Z]+(([ ,.-][a-zA-Z ])?[a-zA-Z]*)*$/
    },
  });
};