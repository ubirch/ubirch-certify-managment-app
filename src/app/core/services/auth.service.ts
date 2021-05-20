import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { POC_ADMIN, TENANT_ADMIN } from '../models/roles';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private keycloak: KeycloakService
  ) { }

  isTenantAdmin() {
    const roles = this.keycloak.getUserRoles();
    return roles?.includes(TENANT_ADMIN);
  }
  isPocAdmin() {
    const roles = this.keycloak.getUserRoles();
    return roles?.includes(POC_ADMIN);
  }
}
