import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { POC_ADMIN_ROLE, ROLE, TENANT_ADMIN_ROLE } from '../models/roles';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private keycloak: KeycloakService
  ) { }

  hasAnyRole(userRoles: ROLE | ROLE[]) {
    const roles = this.keycloak.getUserRoles();
    return Array.isArray(userRoles) ? userRoles.some(r => roles.includes(r)) : roles.includes(userRoles);
  }

  isTenantAdmin() {
    const roles = this.keycloak.getUserRoles();
    return roles?.includes(TENANT_ADMIN_ROLE);
  }

  isPocAdmin() {
    const roles = this.keycloak.getUserRoles();
    return roles?.includes(POC_ADMIN_ROLE);
  }
}
