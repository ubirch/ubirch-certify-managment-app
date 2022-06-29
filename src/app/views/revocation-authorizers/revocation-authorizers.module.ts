import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorizerUploadComponent } from './authorizer-upload/authorizer-upload.component';
import { RevocationAuthorizerRoutingModule } from './revocation-authorizers-routing.module';
import { RevocationAuthorizersComponent } from './revocation-authorizers.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RevocationBatchesListComponent } from './revocation-batches-list/revocation-batches-list.component';
import { RevocationEntriesListComponent } from './revocation-entries-list/revocation-entries-list.component';
import { RevocationListComponent } from '../revocation-list/revocation-list.component';

@NgModule({
    declarations: [
        AuthorizerUploadComponent,
        RevocationAuthorizersComponent,
        RevocationBatchesListComponent,
        RevocationEntriesListComponent,
        RevocationListComponent,
    ],
    imports: [CommonModule, SharedModule, RevocationAuthorizerRoutingModule],
    exports: [RevocationListComponent],
})
export class RevocationAuthorizersModule {}
