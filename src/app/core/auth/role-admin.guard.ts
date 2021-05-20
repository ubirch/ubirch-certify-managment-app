import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
} from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { AuthGuard } from './auth.guard';


export const NOT_AUTHORIZED_URL = ['views', 'not-authorized'];

@Injectable({
    providedIn: 'root',
})
export class RoleGuard extends AuthGuard {
    constructor(
        protected readonly router: Router,
        protected readonly keycloak: KeycloakService
    ) {
        super(router, keycloak);
    }

    public async isAccessAllowed(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        const authenticated = await super.isAccessAllowed(route, state);

        if (!this.roles.includes(route.data.role)) {
            this.router.navigate(['/']);
            return false;
        }

        return authenticated;
    }
}
