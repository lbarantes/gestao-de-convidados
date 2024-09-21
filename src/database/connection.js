const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("database", "user", "password", {
  host: "host",
  dialect: "mysql",
  logging: false,
});

try {
  sequelize.authenticate();
  console.log("Conectado ao banco de dados");
} catch (err) {
  console.log(`Não foi possível conectar ${err}`);
}

module.exports = sequelize;
