import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/auth/auth.guard';
import { TenantAdminGuard } from '../core/auth/tenant-admin.guard';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { ViewsComponent } from './views.component';

const routes: Routes = [
  {
    path: '',
    component: ViewsComponent,
    children: [
      {
        path: '',
        redirectTo: 'pocs',
        pathMatch: 'full'
      },
      {
        path: 'not-authorized',
        component: NotAuthorizedComponent
      },
      {
        path: 'pocs',
        loadChildren: () =>
          import('./pocs/pocs.module').then((m) => m.PocsModule),
        canActivate: [TenantAdminGuard],
      },
      {
        path: 'poc-admins',
        loadChildren: () =>
          import('./poc-admins/poc-admins.module').then((m) => m.PocAdminsModule),
        canActivate: [TenantAdminGuard],
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewsRoutingModule { }
