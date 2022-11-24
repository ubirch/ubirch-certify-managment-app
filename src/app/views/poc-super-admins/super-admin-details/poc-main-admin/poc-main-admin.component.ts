import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { pocMainAdmin } from 'src/app/core/models/interfaces/poc-super-admin.interface';
import { ConfirmDialogService } from '../../../../shared/components/confirm-dialog/confirm-dialog.service';
import {IMainAdmin} from "../../../../core/models/interfaces/mainAdmin.interface";
import {ILocale} from "../../../../core/models/interfaces/locale.interface";
import {LocaleService} from "../../../../core/services/locale.service";

@Component({
    selector: 'app-poc-main-admin',
    templateUrl: './poc-main-admin.component.html',
    styleUrls: ['./poc-main-admin.component.scss'],
})
export class PocMainAdminComponent implements OnInit {
    @Input() mainAdmin: IMainAdmin[];
    locale: ILocale;

    displayColumns: string[] = [
        'firstName',
        'lastName',
        'email',
        'phoneNumber',
        'active',
        'createdAt',
    ];

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected confirmService: ConfirmDialogService,
        protected translateService: TranslateService,
        private localService: LocaleService,
    ) {}

    ngOnInit() {
        this.localService.current$.subscribe(locale => this.locale = locale);
    }
}
