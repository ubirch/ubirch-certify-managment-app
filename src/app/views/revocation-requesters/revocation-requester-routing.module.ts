import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequesterImportComponent } from './requester-import/requester-import.component';
import { RevocationRequestersComponent } from './revocation-requesters.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: RevocationRequestersComponent
  },
  {
    path: 'import',
    component: RequesterImportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RevocationRequesterRoutingModule { }
