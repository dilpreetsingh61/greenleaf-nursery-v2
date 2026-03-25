const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "user_email",
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "user_name",
    },
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "order_number",
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "transaction_id",
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "total_amount",
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "payment_method",
    },
    paymentStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
      field: "payment_status",
    },
    shippingInfo: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
      field: "shipping_info",
    },
    items: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    tableName: "orders",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Order;
