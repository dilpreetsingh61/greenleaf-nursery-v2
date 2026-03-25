const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const CartSession = sequelize.define(
  "CartSession",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sessionId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      field: "session_id",
    },
  },
  {
    tableName: "cart_sessions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = CartSession;
