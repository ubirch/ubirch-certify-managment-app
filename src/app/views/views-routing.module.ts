import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleRedirectResolver } from '../core/auth/role-redirect.resolver';
import { RoleGuard } from '../core/auth/role-admin.guard';
import { POC_ADMIN, TENANT_ADMIN } from '../core/models/roles';
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
        resolve: [RoleRedirectResolver]
      },
      {
        path: 'not-authorized',
        component: NotAuthorizedComponent
      },
      {
        path: 'pocs',
        loadChildren: () =>
          import('./pocs/pocs.module').then((m) => m.PocsModule),
        canActivate: [RoleGuard],
        data: {
          role: TENANT_ADMIN
        }
      },
      {
        path: 'poc-admins',
        loadChildren: () =>
          import('./poc-admins/poc-admins.module').then((m) => m.PocAdminsModule),
        canActivate: [RoleGuard],
        data: {
          role: TENANT_ADMIN
        }
      },
      {
        path: 'poc-employees',
        loadChildren: () =>
          import('./poc-employees/poc-employees.module').then((m) => m.PocEmployeesModule),
        canActivate: [RoleGuard],
        data: {
          role: POC_ADMIN
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewsRoutingModule { }
