FROM node:18-alpine

RUN npm install -g nodemon

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --quiet

COPY . .

RUN chown -R node:node /usr/src/app
USER node

EXPOSE 5000

CMD ["nodemon", "src/app.js"]