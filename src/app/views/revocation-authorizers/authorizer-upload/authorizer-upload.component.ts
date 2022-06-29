import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { map, tap } from 'rxjs';
import { Filters } from 'src/app/core/models/filters';

import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { RevocationService } from 'src/app/core/services/revocation.service';

@Component({
    selector: 'app-authorizer-upload',
    templateUrl: './authorizer-upload.component.html',
    styleUrls: ['./authorizer-upload.component.scss'],
})
export class AuthorizerUploadComponent implements OnInit {
    disableBtn: boolean;

    constructor(
        protected revocationService: RevocationService,
        protected translateService: TranslateService,
        protected errorService: ErrorHandlerService,
        protected notificationService: NotificationService,
        protected router: Router
    ) {}

    ngOnInit() {
        this.revocationService.checkPendingRevocations().subscribe({
            next: (response) => {
                if (!response) {
                    this.disableBtn = true;
                } else {
                    this.disableBtn = false;
                }
            },
        });
    }

    uploadRevocations() {
        this.revocationService.uploadRevocations().subscribe({
            next: () => {
                this.notificationService.success({
                    message: this.translateService.instant(
                        'revocationAuthorizer.notifications.upload-success'
                    ),
                    // title: this.translateService.instant(
                    //     'revocationAuthorizer.notifications.upload-successTitle'
                    // ),
                });
                this.router.routeReuseStrategy.shouldReuseRoute = function () {
                    return false;
                };
                this.router.onSameUrlNavigation = 'reload';
                this.router.navigate(['views/', 'revocation-authorizer']);
            },
            error: (err) => {
                this.errorService.handlerResponseError(err);
            },
        });
    }
}
