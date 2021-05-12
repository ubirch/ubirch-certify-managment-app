FROM node:12 AS builder

WORKDIR /app
ADD ./package*.json ./
RUN npm install
RUN npm install -g @angular/cli

ADD . ./
RUN ng build


FROM nginx:latest
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/www/ /usr/share/nginx/html/
