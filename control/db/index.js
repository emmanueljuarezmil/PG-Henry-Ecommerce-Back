const { DataTypes } = require('sequelize');


// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.

//HACER LAS VALIDACIONES

module.exports = (sequelize) => {
  sequelize.define('Usuario', {
    id:{
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    nombre:{
      type: DataTypes.STRING
    },
    nombre_usuario:{
        type: DataTypes.STRING,
        unique: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    }
  })
  sequelize.define('Producto', {    
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock:{
      type: DataTypes.INTEGER,
      allowNull: false
    },

  });
  sequelize.define('Vendedor', {
      id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
      },
      name: {
          type: DataTypes.STRING
      }
  })
  
};