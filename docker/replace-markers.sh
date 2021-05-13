#!/bin/bash

# replace the markers in any javascript file.
find /usr/share/nginx/html -type f -name '*.js' -exec \
    sed -i \
        -e "s%@@KEYCLOAK_REALM@@%${KEYCLOAK_REALM}%" \
        -e "s%@@KEYCLOAK_URL@@%${KEYCLOAK_URL}%" \
        -e "s%@@KEYCLOAK_CLIENT_ID@@%${KEYCLOAK_CLIENT_ID}%" \
        -e "s%@@POC_MANAGER_API@@%${POC_MANAGER_API}%" \
        {} \;
