const { Sequelize } = require("sequelize");
require("dotenv").config();

const dbProvider = (process.env.DB_PROVIDER || "mysql").toLowerCase();

function createSequelizeInstance() {
  if (process.env.MYSQL_URL) {
    return new Sequelize(process.env.MYSQL_URL, {
      dialect: "mysql",
      logging: false,
    });
  }

  if (dbProvider !== "mysql") {
    console.warn(`DB_PROVIDER=${dbProvider} is deprecated for this backend. Falling back to MySQL.`);
  }

  return new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
      host: process.env.MYSQL_HOST || "localhost",
      port: parseInt(process.env.MYSQL_PORT || "3306", 10),
      dialect: "mysql",
      logging: false,
    }
  );
}

const sequelize = createSequelizeInstance();

module.exports = sequelize;
