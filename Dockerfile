FROM node:12 AS builder

WORKDIR /app
ADD ./package*.json ./
RUN npm install
RUN npm install -g @angular/cli

ADD . ./
RUN ng build --configuration=production


FROM bitnami/nginx:latest
ENV \
    KEYCLOAK_REALM=ubirch-certificator \
    KEYCLOAK_URL=https://id.certify.dev.ubirch.com/auth/ \
    KEYCLOAK_CLIENT_ID=poc-manager-user-access-local \
    POC_MANAGER_API=https://api.poc.dev.ubirch.com/tenant-admin/

# this is necessary for the startup script
# that creates config from environment vars

USER root
COPY docker/entrypoint.sh /entrypoint.sh
COPY nginx/nginx.conf /opt/bitnami/nginx/conf/server_blocks/nginx.conf
COPY --from=builder /app/www/ /template_app
RUN chown 1001 /template_app
COPY docker/replace-markers.sh /replace-markers.sh
RUN chmod 555 /replace-markers.sh
RUN mkdir /www && chown 1001 /www
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod 555 /entrypoint.sh

USER 1001

EXPOSE 8081

ENTRYPOINT [ "/entrypoint.sh" ]
CMD [ "/opt/bitnami/scripts/nginx/run.sh" ]
