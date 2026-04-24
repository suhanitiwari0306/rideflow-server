const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ride = sequelize.define('Ride', {
  ride_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  rider_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  driver_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pickup_location: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
  dropoff_location: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'requested',
    validate: {
      isIn: [['requested', 'accepted', 'en_route', 'in_progress', 'completed', 'cancelled']],
    },
  },
  fare: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
  },
}, {
  tableName: 'rides',
  underscored: true,
});

module.exports = Ride;
