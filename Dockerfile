FROM node:14.19.1-buster-slim@sha256:ffc15488e56d99dbc9b90d496aaf47901c6a940c077bc542f675ae351e769a12

RUN  apt-get update \
    && apt-get install -y chromium

# Install Puppeteer under /node_modules so it's available system-wide
WORKDIR /app
COPY . .
RUN npm install
# install nodemon
RUN npm install -g nodemon
# RUN apk add ttf-freefont chromium
CMD node .

