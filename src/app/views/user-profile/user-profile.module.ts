import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserProfileRoutingModule } from './user-profile-routing.module';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { RolesComponent } from './roles/roles.component';
import { CreationTokenComponent } from './creation-token/creation-token.component';

@NgModule({
  declarations: [
    ProfileComponent,
    PersonalDetailsComponent,
    RolesComponent,
    CreationTokenComponent,
  ],
  imports: [
    SharedModule,
    UserProfileRoutingModule,
  ]
})
export class UserProfileModule { }
