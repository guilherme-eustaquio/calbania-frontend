FROM node:16-alpine3.11 as build

WORKDIR /usr/local/app

COPY ./ /usr/local/app/

RUN npm install

RUN npm run build

FROM nginx:latest
COPY --from=build /usr/local/app/dist/calbania-frontend /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
