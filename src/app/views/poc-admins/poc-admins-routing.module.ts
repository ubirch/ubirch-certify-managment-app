import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminCreateComponent } from './admin-create/admin-create.component';
import { AdminEditComponent } from './admin-edit/admin-edit.component';
import { AdminIdentifyComponent } from './admin-identify/admin-identify.component';
import { AdminListComponent } from './admin-list/admin-list.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: AdminListComponent
  },
  {
    path: 'edit/:id',
    component: AdminEditComponent
  },
  {
    path: 'create/:pocId',
    component: AdminCreateComponent
  },
  {
    path: 'identify/:id',
    component: AdminIdentifyComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocAdminsRoutingModule { }
