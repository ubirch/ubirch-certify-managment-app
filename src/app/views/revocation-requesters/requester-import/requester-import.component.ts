import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UploadState } from 'src/app/core/models/enums/upload-state.enum';
import { INotification } from 'src/app/core/models/interfaces/notification.interface';
import { IUploadStatus } from 'src/app/core/models/interfaces/upload-status.interface';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { RevocationService } from 'src/app/core/services/revocation.service';

@Component({
    selector: 'app-requester-import',
    templateUrl: './requester-import.component.html',
    styleUrls: ['./requester-import.component.scss'],
})
export class RequesterImportComponent implements OnInit {
    errorFile: Blob;
    progress: IUploadStatus;
    notification: INotification;
    base64Revocation = '';

    constructor(
        private router: Router,
        private revocationService: RevocationService,
        private error: ErrorHandlerService,
        private notificationService: NotificationService
    ) {}

    ngOnInit() {}

    uploadFile() {
        this.revocationService.importFile(this.base64Revocation).subscribe({
            next: (event) => {
                this.progress = event;
                if (event.state === UploadState.done) {
                    if (
                        event.result &&
                        event.result instanceof Blob &&
                        event.result.size > 0
                    ) {
                        this.errorFile = event.result;
                        this.notification = this.notificationService.warning({
                            title: 'revocationImport.notifications.partialTitle',
                            message: 'revocationImport.notifications.partial',
                        });
                    } else {
                        this.notification = this.notificationService.success({
                            message: 'revocationImport.notifications.success',
                        });
                        this.router.navigate(['views/', 'revocation-requester']);
                    }
                }
            },
            error: (err) => {
                this.progress = null;
                this.notification = this.error.handlerResponseError(err);
            },
        });
    }
}
