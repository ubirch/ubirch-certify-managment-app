import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';
import { POC_ADMIN, TENANT_ADMIN } from '../models/roles';

@Injectable({ providedIn: 'root' })
export class RoleRedirectResolver implements Resolve<void> {
    constructor(
        private keycloak: KeycloakService,
        private router: Router,
    ) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        const roles = this.keycloak.getUserRoles();
        let redirect = 'not-authorized';
        if (roles?.includes(POC_ADMIN)) { redirect = 'poc-employees'; }
        if (roles?.includes(TENANT_ADMIN)) { redirect = 'pocs'; }

        this.router.navigate(['/views', redirect]);
    }


}
