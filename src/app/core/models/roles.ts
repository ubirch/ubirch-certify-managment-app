export const TENANT_ADMIN_ROLE = 'tenant-admin';
export const POC_ADMIN_ROLE = 'poc-admin';
export const SUPER_ADMIN_ROLE = 'super-admin';
export const REVOCATION_REQUESTER_ROLE = 'revocation-requester';
export const REVOCATION_AUTHORIZER_ROLE = 'revocation-authorizer';

export type ROLE = typeof TENANT_ADMIN_ROLE | typeof POC_ADMIN_ROLE | typeof REVOCATION_REQUESTER_ROLE | typeof REVOCATION_AUTHORIZER_ROLE;

