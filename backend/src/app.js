const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/database');
const initMQTT = require('./services/mqttService');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

global.sensorData = {
    soil: 0,
    rain: 0,
    humid: 0,
    lastUpdate: new Date()
};

app.get('/api/sensors', (req, res) => {
    res.json(global.sensorData);
});

app.post('/api/pump', (req, res) => {
    const { status } = req.body; 
    
    console.log(`[Control] Pump command: ${status ? 'TURN ON' : 'TURN OFF'}`);
    res.json({ success: true, message: `Pump is now ${status ? 'ON' : 'OFF'}` });
});

app.get('/status', (req, res) => {
    res.json({ 
        status: 'Online', 
        database: 'Connected', 
        mqtt: 'Running',
        time: new Date()
    });
});

async function startServer() {
try {
        console.log('--- System Starting ---');
        console.log('1. Checking DB connection...');
        
        await sequelize.authenticate(); // Kiểm tra kết nối trước
        await sequelize.sync({ alter: true });
        console.log('2. MYSQL is available & Synced!');

        console.log('3. Initializing MQTT Service...');
        initMQTT();

        app.listen(PORT, () => {
            console.log(`4. Backend server is running on port ${PORT}`);
            console.log(`-----------------------------------------`);
        });
    } catch (error) {
        console.error('CRITICAL ERROR: Can not start the system');
        console.error('Details:', error.message);
        process.exit(1);
    }
}

startServer();