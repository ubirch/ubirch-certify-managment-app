const keycloakConfig: any = {
    url: 'https://id.certify.dev.ubirch.com/auth/',
    realm: 'ubirch-certificator',
    clientId: 'poc-manager-user-access-local'
};

export const environment = {
    production: true,
    keycloak: keycloakConfig,
    pocManagerApi: 'https://api.poc.dev.ubirch.com/',
};
