const { DataTypes } = require("sequelize");

const database = require("../database/connection");

const Sindicalizado = database.define("Sindicalizado", {
  nome: {
    type: DataTypes.STRING,
    require: true,
  },
  cpf: {
    type: DataTypes.STRING,
    require: true,
  },
  email: {
    type: DataTypes.STRING,
    require: true,
  },
  matricula: {
    type: DataTypes.STRING,
    require: true,
  },
  nascimento: {
    type: DataTypes.DATEONLY,
    require: true,
  },
  banco: {
    type: DataTypes.STRING,
    require: true,
  },
  agencia: {
    type: DataTypes.STRING,
    require: true,
  },
  presenca: {
    type: DataTypes.BOOLEAN,
  },
});

module.exports = Sindicalizado;
