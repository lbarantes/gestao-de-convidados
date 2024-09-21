const { DataTypes } = require("sequelize");

const database = require("../database/connection");
const Sindicalizado = require("./Sindicalizado");

const Dependente = database.define("Dependente", {
  nome: {
    type: DataTypes.STRING,
    require: true,
  },
  cpf: {
    type: DataTypes.STRING,
    require: true,
  },
  tipo: {
    type: DataTypes.STRING,
    require: true,
  },
  nascimento: {
    type: DataTypes.DATEONLY,
    require: true,
  },
  presenca: {
    type: DataTypes.BOOLEAN,
  },
  sexo: {
    type: DataTypes.STRING,
  },
});

Dependente.belongsTo(Sindicalizado, { foreignKey: "responsavel" });
Sindicalizado.hasMany(Dependente, { foreignKey: "responsavel" });

module.exports = Dependente;
