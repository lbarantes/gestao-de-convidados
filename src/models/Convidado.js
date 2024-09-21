const { Sequelize, DataTypes } = require("sequelize");

const database = require("../database/connection");
const Sindicalizado = require("./Sindicalizado");

const Convidado = database.define("Convidado", {
  nome: {
    type: DataTypes.STRING,
    require: true,
  },
  cpf: {
    type: DataTypes.STRING,
    require: true,
  },
  sexo: {
    type: DataTypes.STRING,
  },
  nascimento: {
    type: DataTypes.DATEONLY,
  },
});

Sindicalizado.hasOne(Convidado, { foreignKey: "responsavel" });
Convidado.belongsTo(Sindicalizado, { foreignKey: "responsavel" });

module.exports = Convidado;
