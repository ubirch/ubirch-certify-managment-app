
const keycloakConfig: any = {
  realm: '@@KEYCLOAK_REALM@@',
  url: '@@KEYCLOAK_URL@@',
  clientId: '@@KEYCLOAK_CLIENT_ID@@'
};

export const environment = {
  production: true,
  keycloak: keycloakConfig,
  pocManagerApi: '@@POC_MANAGER_API@@',
  revocationApi: '@@REVOCATION_API@@'
};
