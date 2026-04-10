# Backend of Auto-Watering-System

## 🏗️Backend structure
backend/
├── src/
│   ├── config/
│   │   └── database.js    
│   ├── models/
│   │   └── sensorModel.js  
│   ├── services/
│   │   └── mqttService.js  
│   └── app.js             
├── .env                   
├── Dockerfile             
├── package.json           
└── README.md

## 🚀Getting started
1. Prerequisites
  * Docker and Docker Compose installed.
  * Node.js installed if you are the host machine for dependency management.
2. Initial setup
```
cd backend
npm install express dotenv sequelize mysql2 mqtt
```

3. Environment configuration 
* Create a `.env` file inside `backend` directory
```
PORT=5000
DB_HOST=mysql-db
DB_USER=admin
DB_PASS=123456
DB_NAME=watering_db
MQTT_BROKER=mqtt://mqtt-broker:1883
```

4. Running with docker
Return to the project root directory and run the following command to build and start all services (Backend, Database, MQTT):
```
docker compose up -d
```

## 🛠️ Service Ports
* **Backend API:** http://localhost:500
* **MQTT Broker:** mqtt://localhost:1883
* **MQTT WebSockets:** ws://localhost:9001
