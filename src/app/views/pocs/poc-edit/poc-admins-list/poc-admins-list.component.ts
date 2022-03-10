import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Filters } from '../../../../core/models/filters';
import { IPocAdmin } from '../../../../core/models/interfaces/poc-admin.interface';
import { IPocEmployee } from '../../../../core/models/interfaces/poc-employee.interface';
import { IPoc } from '../../../../core/models/interfaces/poc.interface';
import { PocAdminDataSource } from '../../../../core/services/data-sources/poc-admin-data-source';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';
import { PocAdminService } from '../../../../core/services/poc-admin.service';

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
        'createdAt',
        'actions',
    ];
    defaultSortColumn = 'email';

    @Input()
    public set pocId(val: string) {
        this.dataSource = new PocAdminDataSource(this.adminService, this.errorService);
        this.dataSource.loadAdmins({ ...new Filters(), search: val, sortColumn: this.defaultSortColumn });
    }

    constructor(
        private errorService: ErrorHandlerService,
        private adminService: PocAdminService,
        protected router: Router,
        protected route: ActivatedRoute,
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

}
