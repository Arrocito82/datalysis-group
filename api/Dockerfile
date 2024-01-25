FROM node:14

WORKDIR /api
COPY package.json .
RUN npm install
COPY . .
RUN npx primas migrate reset --force
CMD npm start