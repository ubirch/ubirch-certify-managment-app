import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreationTokenComponent } from './creation-token/creation-token.component';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { ProfileComponent } from './profile/profile.component';
import { RolesComponent } from './roles/roles.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'personal-details',
      },
      {
        path: 'personal-details',
        component: PersonalDetailsComponent,
      },
      {
        path: 'roles',
        component: RolesComponent,
      },
      {
        path: 'creation-token',
        component: CreationTokenComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProfileRoutingModule { }
