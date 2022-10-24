import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperAdminListComponent } from './super-admin-list/super-admin-list.component';

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
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PocSuperAdminsRoutingModule {}
