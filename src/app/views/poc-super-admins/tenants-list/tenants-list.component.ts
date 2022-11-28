import {Component, OnInit} from '@angular/core';
import {detailExpand, fadeDownIn, fadeUpOut} from "../../../core/utils/animations";
import {TenantDataSource} from "../../../core/services/data-sources/tenant-data-source";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LocaleService} from "../../../core/services/locale.service";
import {ILocale} from "../../../core/models/interfaces/locale.interface";
import {PocSuperAdminService} from "../../../core/services/poc-super-admin.service";
import {ErrorHandlerService} from "../../../core/services/error-handler.service";
import {Filters} from "../../../core/models/filters";

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
    ngOnInit() {
        this.localeService.current$.subscribe(locale => this.locale = locale);
        this.dataSource = new TenantDataSource(
            this.pocSuperAdminService,
            this.errorService
        );
        this.generateFilters();
        this.loadItemsPage();
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
