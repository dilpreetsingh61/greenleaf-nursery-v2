const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const ServiceBooking = sequelize.define(
  "ServiceBooking",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "customer_name",
    },
    customerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "customer_email",
    },
    customerPhone: {
      type: DataTypes.STRING,
      field: "customer_phone",
    },
    preferredDate: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "preferred_date",
    },
    preferredTime: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "preferred_time",
    },
    serviceType: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "service_type",
    },
    serviceAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "service_address",
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    tableName: "service_bookings",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = ServiceBooking;
