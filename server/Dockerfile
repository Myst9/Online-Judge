FROM node:20-alpine

WORKDIR /app

RUN apk update && apk add --no-cache g++

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4000

CMD [ "node", "index.js" ]