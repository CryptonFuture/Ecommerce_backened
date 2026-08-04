FROM node:22-alpine

WORKDIR /usr/src/app

COPY ./package.json ./

COPY ./package-lock.json ./

RUN npm install

COPY ./src ./src

COPY ./.env ./

COPY ./index.js ./

EXPOSE 8000

CMD ["npm", "start"]
