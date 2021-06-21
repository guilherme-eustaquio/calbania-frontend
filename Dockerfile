FROM nginx:1.20.1-alpine
COPY /dist/calbania-frontend /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
