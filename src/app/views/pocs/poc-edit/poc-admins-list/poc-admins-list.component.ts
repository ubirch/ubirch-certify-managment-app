import { Component, Input, OnInit } from '@angular/core';
import { Filters } from '../../../../core/models/filters';
import { PocAdminDataSource } from '../../../../core/services/data-sources/poc-admin-data-source';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';
import { PocAdminService } from '../../../../core/services/poc-admin.service';

@Component({
  selector: 'app-poc-admins-list',
  templateUrl: './poc-admins-list.component.html',
  styleUrls: ['./poc-admins-list.component.scss'],
})
export class PocAdminsListComponent implements OnInit {

    dataSource: PocAdminDataSource;
    displayColumns: string[] = [
        'firstName',
        'lastName',
        'email',
        'active',
    ];
    defaultSortColumn = 'email';
    @Input()
    public set pocId(val: string) {
        this.dataSource = new PocAdminDataSource(this.adminService, this.errorService);
        this.dataSource.loadAdmins({ ...new Filters(), search: val, sortColumn: this.defaultSortColumn });
    }

    constructor(
        private errorService: ErrorHandlerService,
        private adminService: PocAdminService
    ) { }

  ngOnInit() {
  }

}
