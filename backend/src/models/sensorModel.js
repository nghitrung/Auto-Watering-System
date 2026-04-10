const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SensorData = sequelize.define('SensorData', {
    topic: { type: DataTypes.STRING, allowNull: false },
    sensor_name: { type: DataTypes.STRING, allowNull: false },
    main_value: { type: DataTypes.FLOAT },
    details: { type: DataTypes.JSON },
});

module.exports = SensorData