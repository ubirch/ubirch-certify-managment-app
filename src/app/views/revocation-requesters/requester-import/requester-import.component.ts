import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UploadState } from 'src/app/core/models/enums/upload-state.enum';
import { INotification } from 'src/app/core/models/interfaces/notification.interface';
import { IUploadStatus } from 'src/app/core/models/interfaces/upload-status.interface';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { RevocationService } from 'src/app/core/services/revocation.service';
import { PDF_QR_JS } from 'pdf-qr';
import { RevocationImport } from 'src/app/core/models/interfaces/revocation-import.interface';
import {
    catchError,
    finalize,
    forkJoin,
    map,
    Observable,
    of,
    Subject,
} from 'rxjs';
@Component({
    selector: 'app-requester-import',
    templateUrl: './requester-import.component.html',
    styleUrls: ['./requester-import.component.scss'],
})
export class RequesterImportComponent implements OnInit, OnDestroy {
    file: File[] = [];
    qrCodes: string[] = [];
    errorFile: Blob;
    progress: IUploadStatus;
    notification: INotification;
    base64Revocation: RevocationImport[] = [];
    obj: RevocationImport = {
        filename: '',
        qrCodeExtract: '',
    };
    private endSubs$ = new Subject();
    invalidFile = true;
    

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

    extractQRCode(file: any): Observable<any> {
        return PDF_QR_JS.decodeDocument(
            file,
            this.configs,
            (result: { success: any; codes: string[]; message: any }) => {
                if (result.success) {
                    this.qrCodes.push(
                        result.codes[0].trim().replace(/(\r\n|\n|\r)/gm, '')
                    );
                    this.invalidFile = false;
                } else {
                    this.file.splice(this.qrCodes.length, 1);
                    alert(result.message);
                    this.invalidFile = true;
                }
            }
        );
    }

    fileSelected(file: File) {
        this.file.push(file);
        const qrString = window.URL.createObjectURL(file);
        this.extractQRCode(qrString);
        this.progress = null;
        if (this.file) {
            this.notification = null;
            this.errorFile = null;
        }
    }

    uploadFile() {
        this.file.forEach((i, v) => { 
            this.obj.filename = i.name;
            this.obj.qrCodeExtract = this.qrCodes[v];
            this.base64Revocation.push(this.obj);
            this.obj = {
                qrCodeExtract: '',
                filename: '',
            };
        });
        // console.log(this.base64Revocation);

        if (this.base64Revocation.length > 0) {
            const obj$ = this.base64Revocation.map((item) => {
                return this.revocationService
                    .importFile(item.qrCodeExtract)
                    .pipe(
                        catchError((err) => {
                            if (err.status !== 409) {
                                this.notification =
                                    this.error.handlerResponseError(err);
                            }
                            return of(err);
                        })
                    );
            });
            return forkJoin(obj$)
                .pipe(
                    map((joined) => {
                        return this.base64Revocation.filter(
                            (i, v) => joined[v].status === 409
                        );
                        // return of([this.base64Revocation, joined]);
                    }),
                    finalize(() => {
                        this.router.navigate([
                            'views/',
                            'revocation-requester',
                        ]);
                    })
                )
                .subscribe((finalArray) => {
                    // console.log(finalArray);
                    const finale = finalArray.map((i) => i.filename);
                    // console.log(finale);
                    if (finale.length > 0) {
                        this.notification = this.notificationService.warning({
                            message: 'revocationImport.notifications.complete',
                            revocationMessage: finale,
                        });
                    } else {
                        this.notification = this.notificationService.success({
                            message: 'revocationImport.notifications.success',
                        });
                    }
                });
        } else {
            this.notification = this.notificationService.error({
                title: 'global.errors.requestDefaultTitle',
                message: 'global.errors.requestDefault',
            });
        }
    }
    ngOnDestroy() {
        this.endSubs$.next(void 0);
        this.endSubs$.complete();
    }
}
function callback(result: any) {
    throw new Error('Function not implemented.');
}

function result(result: any) {
    throw new Error('Function not implemented.');
}
