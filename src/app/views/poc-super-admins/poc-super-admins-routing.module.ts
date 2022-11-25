import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperAdminDetailsComponent } from './super-admin-details/super-admin-details.component';
import { SuperAdminListComponent } from './super-admin-list/super-admin-list.component';
import {TenantsListComponent} from "./tenants-list/tenants-list.component";

const routes: Routes = [
    {
        path: '',
        redirectTo: 'pocs',
        pathMatch: 'full',
    },
    {
        path: 'pocs',
        pathMatch: 'full',
        component: SuperAdminListComponent,
    },
    {
        path: 'poc-details/:id',
        pathMatch: 'full',
        component: SuperAdminDetailsComponent,
    },
    {
        path: 'tenants',
        pathMatch: 'full',
        component: TenantsListComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PocSuperAdminsRoutingModule {}
