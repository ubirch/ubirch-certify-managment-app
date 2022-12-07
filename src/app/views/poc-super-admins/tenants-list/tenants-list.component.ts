import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {detailExpand, fadeDownIn, fadeUpOut} from "../../../core/utils/animations";
import {TenantDataSource} from "../../../core/services/data-sources/tenant-data-source";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LocaleService} from "../../../core/services/locale.service";
import {ILocale} from "../../../core/models/interfaces/locale.interface";
import {PocSuperAdminService} from "../../../core/services/poc-super-admin.service";
import {ErrorHandlerService} from "../../../core/services/error-handler.service";
import {Filters} from "../../../core/models/filters";
import {TenantTypeTranslation} from "../../../core/models/enums/tenant-type.enum";
import {TenantPoCUsageTypeTranslation} from "../../../core/models/enums/tenant-poc-usage-type.enum";
import {ListComponent} from "../../../shared/components/list/list.component";
import {ITenant} from "../../../core/models/interfaces/tenant.interface";
import {NotificationService} from "../../../core/services/notification.service";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {ConfirmDialogService} from "../../../shared/components/confirm-dialog/confirm-dialog.service";
import {DEFAULT_PAGE_SIZE, PAGE_SIZES} from "../../../core/utils/constants";
import {MatPaginator} from "@angular/material/paginator";
import {debounceTime, distinctUntilChanged, filter, map, takeUntil, tap} from "rxjs/operators";
import {merge} from "rxjs";
import {MatSort} from "@angular/material/sort";
import {getCertUrgency} from "../../../core/utils/date";
import {CERTURGENCY} from "../../../core/models/enums/certUrgency.enum";

@Component({
    selector: 'app-tenants-list',
    templateUrl: './tenants-list.component.html',
    styleUrls: ['./tenants-list.component.scss'],
    animations: [detailExpand, fadeDownIn, fadeUpOut],
})
export class TenantsListComponent
    extends ListComponent<ITenant>
    implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

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
        'actions',
    ];
    TenantTypeTranslation = TenantTypeTranslation;
    TenantPoCUsageTypeTranslation = TenantPoCUsageTypeTranslation;
    defaultPageSize = DEFAULT_PAGE_SIZE;
    pageSizes = PAGE_SIZES;

    defaultSortColumn = 'name';

    constructor(
        protected pocSuperAdminService: PocSuperAdminService,
        protected errorService: ErrorHandlerService,
        private localeService: LocaleService,
        protected fb: FormBuilder,
        protected notificationService: NotificationService,
        protected router: Router,
        protected translateService: TranslateService,
        protected confirmService: ConfirmDialogService,
    ) {
        super(
            fb,
            errorService,
            notificationService,
            router,
            confirmService,
            translateService
        );
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

    get tenantTypeFilter() {
        return this.columnFilters?.controls?.tenantType;
    }

    get tenantPoCUsageTypeFilter() {
        return this.columnFilters?.controls?.usageType;
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

    public getRowClass(tenant: ITenant): string {
        let rowClass = '';
        if (tenant.certExpirationDate) {
            let expirationState = getCertUrgency(new Date(tenant.certExpirationDate));
            switch (expirationState) {
                case CERTURGENCY.EXPIRED:
                    rowClass = "expired";
                    break;
                case CERTURGENCY.VERYURGENT:
                    rowClass = "veryUrgent";
                    break;
                case CERTURGENCY.URGENT:
                    rowClass = "urgent"
            }
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
                tenantType: [''],
                usageType: ['']
            })
        );
    }

    ngAfterViewInit(): void {
        const search$ = this.search.valueChanges.pipe(
            filter(() => this.search.valid),
            distinctUntilChanged(),
            debounceTime(1000),
            map((search) => ({ search }))
        );

        const paginate$ = this.paginator.page.pipe(
            map((page) => ({
                pageIndex: page.pageIndex,
                pageSize: page.pageSize,
            }))
        );

        const sort$ = this.sort.sortChange.pipe(
            map((sort) => ({
                pageIndex: 0,
                sortColumn: sort.active,
                sortOrder: sort.direction,
            }))
        );

        const tenantType$ = this.tenantTypeFilter.valueChanges.pipe(debounceTime(1000));
        const tenantPoCUsageType$ = this.tenantPoCUsageTypeFilter.valueChanges.pipe(debounceTime(1000));

        merge(paginate$, sort$, search$, tenantType$, tenantPoCUsageType$)
            .pipe(
                tap((filters) => {
                    this.filters.patchValue(filters);
                    this.selection.clear();
                    this.loadItemsPage();
                }),
                takeUntil(this.unsubscribe$)
            )
            .subscribe();
    }

    goToTenantDetails($event: MouseEvent, tenant: ITenant) {
        this.router.navigate(['/views', 'super-admin', 'tenant-details', tenant.id]);
        $event.stopPropagation();
    }
}
