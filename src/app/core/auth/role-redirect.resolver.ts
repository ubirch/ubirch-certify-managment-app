import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';
import { POC_ADMIN, TENANT_ADMIN } from '../models/roles';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleRedirectResolver implements Resolve<void> {
    constructor(
        private authService: AuthService,
        private router: Router,
    ) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        let redirect = 'not-authorized';
        if (this.authService.isPocAdmin()) { redirect = 'poc-employees'; }
        if (this.authService.isTenantAdmin()) { redirect = 'pocs'; }

        this.router.navigate(['/views', redirect]);
    }


}
