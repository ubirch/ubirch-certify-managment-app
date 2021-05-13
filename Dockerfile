FROM node:12 AS builder

WORKDIR /app
ADD ./package*.json ./
RUN npm install
RUN npm install -g @angular/cli

ADD . ./
RUN ng build --configuration=production


FROM nginx:latest
ENV \
    KEYCLOAK_REALM=ubirch-certificator \
    KEYCLOAK_URL=https://id.certify.dev.ubirch.com/auth/ \
    KEYCLOAK_CLIENT_ID=poc-manager-user-access-local \
    POC_MANAGER_API=https://api.poc.dev.ubirch.com/tenant-admin/

COPY docker/replace-markers.sh /docker-entrypoint.d/
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/www/ /usr/share/nginx/html/
