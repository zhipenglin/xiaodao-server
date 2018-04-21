FROM node:alpine

WORKDIR /app

COPY . ./

RUN npm i --production

RUN npm run migrate:down &&\
    npm run migrate:up

EXPOSE 7001

CMD npm run docker-start
