FROM node:18.12.0-buster-slim

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN  apt-get update \
    && apt-get install -y chromium git

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD node .

