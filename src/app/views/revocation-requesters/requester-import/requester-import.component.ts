import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UploadState } from 'src/app/core/models/enums/upload-state.enum';
import { INotification } from 'src/app/core/models/interfaces/notification.interface';
import { IUploadStatus } from 'src/app/core/models/interfaces/upload-status.interface';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { RevocationService } from 'src/app/core/services/revocation.service';
import { PDF_QR_JS } from 'pdf-qr';

@Component({
    selector: 'app-requester-import',
    templateUrl: './requester-import.component.html',
    styleUrls: ['./requester-import.component.scss'],
})
export class RequesterImportComponent implements OnInit {
    file: File;
    errorFile: Blob;
    progress: IUploadStatus;
    notification: INotification;
    base64Revocation: string;
    invalidFile = false;

    constructor(
        private router: Router,
        private revocationService: RevocationService,
        private error: ErrorHandlerService,
        private notificationService: NotificationService
    ) {}

    ngOnInit() {}

    configs = {
        scale: {
            once: true,
            value: 2,
            start: 0.2,
            step: 0.2,
            stop: 2,
        },
        resultOpts: {
            singleCodeInPage: true,
            multiCodesInPage: false,
            maxCodesInPage: 1,
        },
        improve: true,
        jsQR: {},
    };

    callback = (result: { success: any; codes: string[]; message: any }) => {
        if (result.success) {
            this.base64Revocation = result.codes[0];
            this.invalidFile = false;
        } else {
            alert(result.message);
            this.invalidFile = true;
        }
    };

    extractQRCode(file: File) {
        PDF_QR_JS.decodeDocument(file, this.configs, this.callback);
    }

    fileSelected(file: File) {
        this.file = file;
        this.extractQRCode(this.file);
        this.progress = null;
        if (this.file) {
            this.notification = null;
            this.errorFile = null;
        }
    }

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
                        this.router.navigate([
                            'views/',
                            'revocation-requester',
                        ]);
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
function callback(result: any) {
    throw new Error('Function not implemented.');
}

function result(result: any) {
    throw new Error('Function not implemented.');
}
