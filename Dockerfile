FROM node:12 AS builder

WORKDIR /app
ADD ./package*.json .
RUN npm install
RUN npm install -g @angular/cli

ADD . .
RUN ng build


FROM nginx:latest
COPY --from=builder /app/www/ /usr/share/nginx/html/
