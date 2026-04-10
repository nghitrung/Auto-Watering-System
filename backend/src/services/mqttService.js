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
                console.log('Listening data from smoke and flame sensors');
            }
        });
    });

    client.on('message', async (topic, message) => {
        try {
            const payload = JSON.parse(message.toString());
            console.log('Recieved data');
            if (topic === TOPIC_RAIN) {
                if (payload) {
                    await SensorData.create({
                        topic: topic,
                        sensor_name: rain-sensor,
                        main_value: payload.RAIN,
                        details: payload
                    });
                }
            } else if (topic === TOPIC_FLAME) {
                if (payload.flame_data) {
                    const f = payload.flame_data;
                    await SensorData.create({
                        topic: topic,
                        sensor_name: 'Flame_sensor',
                        main_value: Math.min(f.FLAME1, f.FLAME2),
                        details: f,
                    });
                }
            } 
        } catch (error) {
            console.error('Error format of JSON or DB:', error.message);
        }
    });
};

module.exports = initMQTT;