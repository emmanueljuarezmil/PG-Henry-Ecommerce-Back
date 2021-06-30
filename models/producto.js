const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Producto', {    
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(32),
      allowNull: false,
      is: /^[a-zA-Z]+(([ ,.-][a-zA-Z ])?[a-zA-Z]*)*$/
    },
    descripcion: {
      type: DataTypes.TEXT,
      is: /[CDATA[^[a-zA-Z0-9 .-]+$]]/
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    cant:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cant_vendido:{
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    porc_desc: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
    }
  });
};