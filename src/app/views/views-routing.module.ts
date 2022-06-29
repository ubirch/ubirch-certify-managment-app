import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleRedirectResolver } from '../core/auth/role-redirect.resolver';
import { RoleGuard } from '../core/auth/role-admin.guard';
import {
    POC_ADMIN_ROLE,
    TENANT_ADMIN_ROLE,
    REVOCATION_REQUESTER_ROLE,
    REVOCATION_AUTHORIZER_ROLE,
} from '../core/models/roles';
import { LandingComponent } from './landing/landing.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { ViewsComponent } from './views.component';

const routes: Routes = [
    {
        path: '',
        component: ViewsComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: LandingComponent,
                resolve: [RoleRedirectResolver],
            },
            {
                path: 'not-authorized',
                component: NotAuthorizedComponent,
            },
            {
                path: 'pocs',
                loadChildren: () =>
                    import('./pocs/pocs.module').then((m) => m.PocsModule),
                canActivate: [RoleGuard],
                data: {
                    role: TENANT_ADMIN_ROLE,
                },
            },
            {
                path: 'poc-admins',
                loadChildren: () =>
                    import('./poc-admins/poc-admins.module').then(
                        (m) => m.PocAdminsModule
                    ),
                canActivate: [RoleGuard],
                data: {
                    role: TENANT_ADMIN_ROLE,
                },
            },
            {
                path: 'poc-employees',
                loadChildren: () =>
                    import('./poc-employees/poc-employees.module').then(
                        (m) => m.PocEmployeesModule
                    ),
                canActivate: [RoleGuard],
                data: {
                    role: POC_ADMIN_ROLE,
                },
            },
            {
                path: 'revocation-requester',
                loadChildren: () =>
                    import(
                        './revocation-requesters/revocation-requesters.module'
                    ).then((m) => m.RevocationRequestersModule),
                canActivate: [RoleGuard],
                data: {
                    role: REVOCATION_REQUESTER_ROLE,
                },
            },
            {
                path: 'revocation-authorizer',
                loadChildren: () =>
                    import(
                        './revocation-authorizers/revocation-authorizers.module'
                    ).then((m) => m.RevocationAuthorizersModule),
                canActivate: [RoleGuard],
                data: {
                    role: REVOCATION_AUTHORIZER_ROLE,
                },
            },
            {
                path: 'profile',
                loadChildren: () =>
                    import('./user-profile/user-profile.module').then(
                        (m) => m.UserProfileModule
                    ),
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ViewsRoutingModule {}
