import {Component, OnInit} from '@angular/core';
import {detailExpand, fadeDownIn, fadeUpOut} from "../../../core/utils/animations";
import {TenantDataSource} from "../../../core/services/data-sources/tenant-data-source";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LocaleService} from "../../../core/services/locale.service";
import {ILocale} from "../../../core/models/interfaces/locale.interface";
import {PocSuperAdminService} from "../../../core/services/poc-super-admin.service";
import {ErrorHandlerService} from "../../../core/services/error-handler.service";
import {Filters} from "../../../core/models/filters";
import {IPocSuperAdmin} from "../../../core/models/interfaces/poc-super-admin.interface";
import {TenantTypeTranslation} from "../../../core/models/enums/tenant-type.enum";
import {TenantPoCUsageTypeTranslation} from "../../../core/models/enums/tenant-poc-usage-type.enum";

@Component({
    selector: 'app-tenants-list',
    templateUrl: './tenants-list.component.html',
    styleUrls: ['./tenants-list.component.scss'],
    animations: [detailExpand, fadeDownIn, fadeUpOut],
})
export class TenantsListComponent implements OnInit {

    locale: ILocale;
    dataSource: TenantDataSource;
    filters: FormGroup;
    displayColumns: string[] = [
        'name',
        'tenantType',
        'usageType',
        'email',
        'phone',
        'certExpirationDate',
        'created',
        'id',
    ];
    TenantTypeTranslation = TenantTypeTranslation;
    TenantPoCUsageTypeTranslation = TenantPoCUsageTypeTranslation;

    // email?: string;
    // phone?: string;

    defaultSortColumn = 'name';

    constructor(
        protected pocSuperAdminService: PocSuperAdminService,
        protected errorService: ErrorHandlerService,
        private localeService: LocaleService,
        protected fb: FormBuilder,
    ) {
    }

    protected loadItemsPage() {
        delete this.filters.value.from;
        delete this.filters.value.to;
        this.dataSource.loadTenants(this.filters.value);
    }

    get search() {
        return this.filters.get('search');
    }

    get columnFilters() {
        return this.filters?.get('filterColumns') as FormGroup;
    }

    get statusFilter() {
        return this.columnFilters?.controls?.status;
    }

    ngOnInit() {
        this.localeService.current$.subscribe(locale => this.locale = locale);
        this.dataSource = new TenantDataSource(
            this.pocSuperAdminService,
            this.errorService
        );
        this.generateFilters();
        this.loadItemsPage();
    }

    public getRowClass(poc: IPocSuperAdmin): string {
        let rowClass = '';
        if (poc.errorMessage) {
            rowClass = 'with-error';
        }
        return rowClass;
    }

    private generateFilters() {
        this.filters = this.fb.group({
            ...new Filters(),
            sortColumn: this.defaultSortColumn,
        });
        this.filters.get('search').setValidators([Validators.minLength(3)]);

        this.filters.addControl(
            'filterColumns',
            this.fb.group({
                status: [''],
            })
        );
    }
}
