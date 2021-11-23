FROM node:16.13

RUN mkdir /api
WORKDIR /api

COPY package.json /api
COPY yarn.lock /api

RUN yarn install
