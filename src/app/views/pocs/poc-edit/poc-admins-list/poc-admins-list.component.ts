import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NEVER } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AdminStatus } from '../../../../core/models/enums/admin-status.enum';
import { Filters } from '../../../../core/models/filters';
import { IPocAdmin } from '../../../../core/models/interfaces/poc-admin.interface';
import { IPocEmployee } from '../../../../core/models/interfaces/poc-employee.interface';
import { PocAdminDataSource } from '../../../../core/services/data-sources/poc-admin-data-source';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';
import { PocAdminService } from '../../../../core/services/poc-admin.service';
import { ConfirmDialogService } from '../../../../shared/components/confirm-dialog/confirm-dialog.service';

@Component({
    selector: 'app-poc-admins-list',
    templateUrl: './poc-admins-list.component.html',
    styleUrls: [ './poc-admins-list.component.scss' ],
})
export class PocAdminsListComponent implements OnInit {

    dataSource: PocAdminDataSource;
    displayColumns: string[] = [
        'firstName',
        'lastName',
        'email',
        'active',
        'isMainPocAdmin',
        'createdAt',
        'actions',
    ];
    defaultSortColumn = 'email';
    adminStatues = AdminStatus;

    selfPocId: string;
    @Input()
    public set pocId(val: string) {
        this.selfPocId = val;
        this.loadAdminsForPoC();
    }

    constructor(
        private errorService: ErrorHandlerService,
        private adminService: PocAdminService,
        protected router: Router,
        protected route: ActivatedRoute,
        protected confirmService: ConfirmDialogService,
        protected translateService: TranslateService,
    ) {
    }

    ngOnInit() {
    }

    editEmployee(event: MouseEvent, employee: IPocEmployee) {
        this.router.navigate([ '/views/poc-admins/edit', employee.id ]);
        event.stopPropagation();
    }

    public getRowClass(admin: IPocAdmin): string {
        let rowClass = '';
        if (admin.isMainAdmin) {
            rowClass = 'is-main-admin';
        }
        return rowClass;
    }

    public changeMainITAdmin(newMainAdmin: IPocAdmin) {
        this.confirmService.open({
            message: this.translateService.instant(`pocAdmin.changeMainPocAdmin.ConfirmMessage`),
            title: this.translateService.instant(`pocAdmin.changeMainPocAdmin.ConfirmTitle`),
        }).pipe(
            take(1),
            switchMap(dialogResult => {
                if (dialogResult) {
                    this.adminService.changeMainPoCAdmin(newMainAdmin.id)
                        .subscribe({
                            next: (_) => this.loadAdminsForPoC(),
                            error: (error) => console.log()
                        });
                } else {
                    // discard confirmation
                    this.loadAdminsForPoC();
                }
                return NEVER;
            }),
        ).subscribe();
    }
    private loadAdminsForPoC() {
        if (this.selfPocId) {
            this.dataSource = new PocAdminDataSource(this.adminService, this.errorService);
            this.dataSource.loadAdmins({ ...new Filters(), search: this.selfPocId, sortColumn: this.defaultSortColumn }, true);
        }
    }
}
