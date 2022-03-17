import { Component, OnInit } from '@angular/core';
import { UploadState } from 'src/app/core/models/enums/upload-state.enum';
import { INotification } from 'src/app/core/models/interfaces/notification.interface';
import { IUploadStatus } from 'src/app/core/models/interfaces/upload-status.interface';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { ExportImportService } from 'src/app/core/services/export-import.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PocsService } from 'src/app/core/services/pocs.service';

@Component({
    selector: 'app-import',
    templateUrl: './poc-import.component.html',
    styleUrls: [ './poc-import.component.scss' ],
})
export class PocImportComponent implements OnInit {
    file: File;
    errorFile: Blob;
    progress: IUploadStatus;
    notification: INotification;

    constructor(
        private fileService: ExportImportService,
        private pocService: PocsService,
        private error: ErrorHandlerService,
        private notificationService: NotificationService,
    ) {
    }

    ngOnInit() {
    }

    fileSelected(file: File) {
        this.file = file;
        this.progress = null;
        if (this.file) {
            this.notification = null;
            this.errorFile = null;
        }
    }

    uploadFile() {
        this.pocService.importFile(this.file)
            .subscribe({
                next: (event) => {
                    this.progress = event;
                    if (event.state === UploadState.done) {
                        if (event.result && event.result instanceof Blob && event.result.size > 0) {
                            this.errorFile = event.result;
                            this.notification = this.notificationService.warning({
                                title: 'import.notifications.partialTitle',
                                message: 'import.notifications.partial',
                            });
                        } else {
                            this.notification = this.notificationService.success({ message: 'import.notifications.success' });
                        }
                    }
                },
                error: (err) => {
                    this.progress = null;
                    this.notification = this.error.handlerResponseError(err);
                },
            });
    }

    downloadResult() {
        this.fileService.triggerDownload(this.errorFile, 'processing_errors.csv');
    }

}
