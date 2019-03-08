FROM zrpaplicacoes/docker-in-node:8.9.4-alpine

# Maintainer Information
LABEL author="ZRP Aplicações Informáticas LTDA - ME <zrp@zrp.com.br>"
LABEL vendor="ZRP Aplicações Informáticas LTDA - ME"
LABEL license="GPLv3"

# Copy project production folders
COPY ./config ./config
COPY ./src ./src

# Copy config files
COPY ./index.js ./index.js
COPY ./package.json ./package.json

# install dependencies
RUN npm install --production

# Configure container network
EXPOSE 3000
