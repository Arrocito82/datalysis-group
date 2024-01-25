FROM mcr.microsoft.com/devcontainers/javascript-node:1-20-bullseye

WORKDIR /api
COPY package.json .
RUN npm install --silent
RUN npx prisma generate 
COPY . .
RUN npx prisma migrate reset --force
EXPOSE $API_DOCKER_PORT
CMD npm start