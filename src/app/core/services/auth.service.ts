import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import {
    POC_ADMIN_ROLE,
    REVOCATION_AUTHORIZER_ROLE,
    REVOCATION_REQUESTER_ROLE,
    ROLE,
    TENANT_ADMIN_ROLE,
} from '../models/roles';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private keycloak: KeycloakService) {}

    hasAnyRole(userRoles: ROLE | ROLE[]) {
        const roles = this.keycloak.getUserRoles();
        return Array.isArray(userRoles)
            ? userRoles.some((r) => roles.includes(r))
            : roles.includes(userRoles);
    }

    isTenantAdmin() {
        const roles = this.keycloak.getUserRoles();
        return roles?.includes(TENANT_ADMIN_ROLE);
    }

    isPocAdmin() {
        const roles = this.keycloak.getUserRoles();
        return roles?.includes(POC_ADMIN_ROLE);
    }

    isRevocationRequester() {
        const roles = this.keycloak.getUserRoles();
        return (
            roles?.includes(REVOCATION_REQUESTER_ROLE) &&
            !roles?.includes(REVOCATION_AUTHORIZER_ROLE)
        );
    }

    isRevocationAuthorizer() {
        const roles = this.keycloak.getUserRoles();
        return (
            roles?.includes(REVOCATION_AUTHORIZER_ROLE) &&
            !roles?.includes(REVOCATION_REQUESTER_ROLE)
        );
    }

    hasBothRoles() {
        const roles = this.keycloak.getUserRoles();
        return (
            roles?.includes(REVOCATION_AUTHORIZER_ROLE) &&
            roles?.includes(REVOCATION_REQUESTER_ROLE)
        );
    }

    isRevocationApp() {
      const roles = this.keycloak.getUserRoles();
        return (
            roles?.includes(REVOCATION_AUTHORIZER_ROLE) ||
            roles?.includes(REVOCATION_REQUESTER_ROLE)
        );
    }
}
