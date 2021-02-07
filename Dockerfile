FROM node:14

WORKDIR /usr/src/app

COPY core core

RUN npm --prefix core install

COPY server server

RUN npm --prefix server install


EXPOSE 3000

CMD [ "node", "server/server.js" ]
