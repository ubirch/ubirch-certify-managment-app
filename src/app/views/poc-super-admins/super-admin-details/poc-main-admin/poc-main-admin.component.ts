import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { pocMainAdmin } from 'src/app/core/models/interfaces/poc-super-admin.interface';
import { ConfirmDialogService } from '../../../../shared/components/confirm-dialog/confirm-dialog.service';

@Component({
    selector: 'app-poc-main-admin',
    templateUrl: './poc-main-admin.component.html',
    styleUrls: ['./poc-main-admin.component.scss'],
})
export class PocMainAdminComponent implements OnInit {
    dataSource: pocMainAdmin;
    displayColumns: string[] = [
        'firstName',
        'lastName',
        'email',
        'active',
        'createdAt',
    ];

    @Input() poc: any;
    @Input() pocType: string;

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected confirmService: ConfirmDialogService,
        protected translateService: TranslateService
    ) {}

    ngOnInit() {}
}
