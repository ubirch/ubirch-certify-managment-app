const keycloakConfig: any = {
    url: 'https://id.dev.ubirch.com/auth',
    realm: 'ubirch-default-realm',
    clientId: 'poc-manager-user-access-local'
};

export const environment = {
    production: true,
    keycloak: keycloakConfig,
    pocManagerApi: 'https://api.poc.dev.ubirch.com/tenant-admin/',
    pocUpload: 'pocs/create',
    pocList: 'pocs',
};
