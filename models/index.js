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
      type: DataTypes.STRING(32),
      is: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/
    },
    nombre_usuario:{
        type: DataTypes.STRING(32),
        unique: true,
        allowNull: false,
        is: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/
    },
    email: {
      type: DataTypes.STRING(32),
      unique: true,
      allowNull: false,
      is: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/
    },
    hashedPassword: {
      type: DataTypes.STRING(64),
      allowNull: false,
      is: /^[0-9a-f]{64}$/i
    },
  })
  sequelize.define('Producto', {    
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(32),
      allowNull: false,
      is: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/
    },
    descripcion: {
      type: DataTypes.TEXT,
      is: /[CDATA[^[a-zA-Z0-9 .-]+$]]/
    },
    precio: {
      type: DataTypes.INTEGER,
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
      nombre: {
          type: DataTypes.STRING(32),
          allowNull: false,
          is: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/
      },
      nombre_usuario:{
          type: DataTypes.STRING(32),
          unique: true,
          allowNull: false,
          is: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/
      },
      email: {
        type: DataTypes.STRING(32),
        unique: true,
        allowNull: false,
        is: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/
      },
      hashedPassword: {
          type: DataTypes.STRING(64),
          allowNull: false,
          is: /^[0-9a-f]{64}$/i
      },
      validate :{
          type: DataTypes.BOOLEAN,
    
      }
  })
  
};