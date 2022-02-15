FROM node:12.18.1
WORKDIR /app
COPY package*.json /app/
COPY . /app/

RUN npm install

ARG IS_DOCKER=true
ENV IS_DOCKER $IS_DOCKER

ENTRYPOINT ["node", "./bin/index.js"]