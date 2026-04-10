const mqtt = require('mqtt');
const SensorData = require('../models/sensorModel');
require('dotenv').config();

const initMQTT = () => {
    const options = {
        username: 'auto_watering_system',
        password: '123',
        clean: true
    }
    const client = mqtt.connect('mqtt://mqtt-broker:1883', options);

    const TOPIC_RAIN = "yolo_uno/sensors/rain-sensor"
    const TOPIC_SOIL = "yolo_uno/sensors/soil-sensor"
    const TOPIC_HUMID = "yolo_uno/sensors/humid-sensor"

    client.on('connect', () => {
        console.log('Backend is connecting to Broker (PORT 1883)');

        client.subscribe([TOPIC_RAIN, TOPIC_SOIL, TOPIC_HUMID], (err) => {
            if (!err) {
                console.log('Listening data from MCU');
            }
        });
    });

    client.on('message', async (topic, message) => {
        try {
            const payload = JSON.parse(message.toString());
            console.log('Recieved data ${topic}:', payload);
            if (topic === TOPIC_RAIN) {
                global.sensorData.rain = payload.RAIN || 0;
            } else if (topic === TOPIC_SOIL) {
                global.sensorData.soil = payload.SOIL || 0;
            } else if (topic === TOPIC_HUMID) {
                global.sensorData.humid = payload.HUMID || 0;
            } 
            global.SensorData.lastUpdate = new Date();

            let sensorName = "";
            let val = 0;

            if (topic === TOPIC_RAIN) {
                sensorName = "Rain-Sensor";
                val = payload.RAIN;
            } else if (topic === TOPIC_SOIL) {
                sensorName = "Soil-Sensor";
                val = payload.SOIL;
            } else if (topic === TOPIC_HUMID) {
                sensorName = "Humid_Sensor";
                val = payload.HUMID;
            }

            if (sensorName) {
                await SensorData.create({
                    topic: topic,
                    sensor_name: sensorName,
                    main_value: val,
                    details: payload
                })
            }
        } catch (error) {
            console.error('Error format of JSON or DB:', error.message);
        }
    });
};

module.exports = initMQTT;