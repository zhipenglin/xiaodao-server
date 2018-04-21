FROM node:alpine

WORKDIR /app

COPY . ./

RUN npm i --production

EXPOSE 7001

CMD npm run migrate:down &&\
    npm run migrate:up &&\
    npm run docker-start
