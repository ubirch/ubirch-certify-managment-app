#!/bin/bash

set -euo pipefail

cp -a /template_app/* /www

# replace the markers in any javascript file.
find /www -type f -name '*.js' -exec \
    sed -i \
        -e "s%@@KEYCLOAK_REALM@@%${KEYCLOAK_REALM}%" \
        -e "s%@@KEYCLOAK_URL@@%${KEYCLOAK_URL}%" \
        -e "s%@@KEYCLOAK_CLIENT_ID@@%${KEYCLOAK_CLIENT_ID}%" \
        -e "s%@@POC_MANAGER_API@@%${POC_MANAGER_API}%" \
        -e "s%@@REVOCATION_API@@%${REVOCATION_API}%" \
        {} \;
