# Backend of Auto-Watering-System

## Backend structure
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

## Getting started
1. Prerequisites
* Docker and Docker Compose installed.
* Node.js installed if you are the host machine for dependency management.

2. Initial setup
`cd backend
npm install express dotenv sequelize mysql2 mqtt`

3. Environment configuration 
* Create a `.env` file inside `backend` directory 