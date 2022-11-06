FROM node:16-slim

WORKDIR /src

COPY package.json package-lock.json /src/

RUN npm ci --silent
RUN chown -R 1000:1000 "/root"

COPY . .

CMD npm start
