import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminIdentifyComponent } from './admin-identify/admin-identify.component';
import { AdminListComponent } from './admin-list/admin-list.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: AdminListComponent
  },
  {
    path: 'identify',
    component: AdminIdentifyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocAdminsRoutingModule { }
