# Stage 1
FROM node:20-bullseye-slim as build-stage

WORKDIR /app
COPY package.json .
RUN npm install --silent
COPY . .

ARG API_BASE_URL
ENV API_BASE_URL=$API_BASE_URL

RUN npm run build

# Stage 2
FROM nginx:1.17.0-alpine
# Copy the ngnix.conf to the container
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/build /usr/share/nginx/html
EXPOSE $REACT_DOCKER_PORT

CMD nginx -g 'daemon off;'