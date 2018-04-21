FROM node:alpine

WORKDIR /app

COPY . ./

RUN npm i --production

EXPOSE 7001

ENV EGG_SERVER_ENV prod

CMD npm run docker-start
