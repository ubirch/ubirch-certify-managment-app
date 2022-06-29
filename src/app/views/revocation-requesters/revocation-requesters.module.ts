import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RequesterImportComponent } from './requester-import/requester-import.component';
import { RevocationRequesterRoutingModule } from './revocation-requester-routing.module';
import { RevocationAuthorizersModule } from '../revocation-authorizers/revocation-authorizers.module';
import { RequesterFiltersComponent } from './requester-filters/requester-filters.component';
import { RevocationRequestersComponent } from './revocation-requesters.component';

@NgModule({
    declarations: [RequesterImportComponent, RequesterFiltersComponent, RevocationRequestersComponent],
    imports: [CommonModule, SharedModule, RevocationRequesterRoutingModule, RevocationAuthorizersModule],
})
export class RevocationRequestersModule {}
