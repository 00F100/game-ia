# syntax=docker/dockerfile:1
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html
COPY --from=nn src/neural-network.js /usr/share/nginx/html/vendor/neural-network.js
