const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const CartItem = sequelize.define(
  "CartItem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cartSessionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "cart_session_id",
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "product_id",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "cart_items",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["cart_session_id", "product_id"],
      },
    ],
  }
);

module.exports = CartItem;
