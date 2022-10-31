import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { merge, NEVER } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    filter,
    finalize,
    map,
    switchMap,
    take,
    takeUntil,
    tap,
} from 'rxjs/operators';
import { AcitvateAction } from 'src/app/core/models/enums/acitvate-action.enum';
import { ListAction } from 'src/app/core/models/enums/list-actions.enum';
import {
    PocActivationState,
    PocActivationStateTranslation,
} from 'src/app/core/models/enums/poc-activation-state.enum';
import {
    PocStatus,
    PocStatusTranslation,
} from 'src/app/core/models/enums/poc-status.enum';
import { Filters } from 'src/app/core/models/filters';
import { IPocSuperAdmin } from 'src/app/core/models/interfaces/poc-super-admin.interface';
import { PocDataSource } from 'src/app/core/services/data-sources/poc-data-source';
import { PocSuperAdminDataSource } from 'src/app/core/services/data-sources/poc-super-admin-data-source';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { ExportImportService } from 'src/app/core/services/export-import.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PocSuperAdminService } from 'src/app/core/services/poc-super-admin.service';
import { PocsService } from 'src/app/core/services/pocs.service';
import {
    detailExpand,
    fadeDownIn,
    fadeUpOut,
} from 'src/app/core/utils/animations';
import { DEFAULT_PAGE_SIZE, PAGE_SIZES } from 'src/app/core/utils/constants';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/confirm-dialog.service';
import { ListComponent } from 'src/app/shared/components/list/list.component';

@Component({
    selector: 'app-super-admin-list',
    templateUrl: './super-admin-list.component.html',
    styleUrls: ['./super-admin-list.component.scss'],
    animations: [detailExpand, fadeDownIn, fadeUpOut],
})
export class SuperAdminListComponent
    extends ListComponent<IPocSuperAdmin>
    implements OnInit, AfterViewInit
{
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    dataSource: PocSuperAdminDataSource;

    displayColumns: string[] = [
        'externalId',
        'pocName',
        'created',
        'lastUpdated',
        'status',
        'with-error',
        'actions'
    ];
    defaultSortColumn = 'externalId';
    defaultPageSize = DEFAULT_PAGE_SIZE;
    pageSizes = PAGE_SIZES;
    expandedElement: IPocSuperAdmin | null;
    filters: FormGroup;
    PocStatusTranslation = PocStatusTranslation;
    PocActivationStateTranslation = PocActivationStateTranslation;

    protected loadItemsPage() {
        delete this.filters.value.from;
        delete this.filters.value.to;
        this.dataSource.loadPocs(this.filters.value);
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

    constructor(
        protected pocSuperAdminService: PocSuperAdminService,
        protected fb: FormBuilder,
        protected translateService: TranslateService,
        protected confirmService: ConfirmDialogService,
        protected errorService: ErrorHandlerService,
        protected exportService: ExportImportService,
        protected notificationService: NotificationService,
        protected router: Router
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

    ngOnInit() {
        this.dataSource = new PocSuperAdminDataSource(
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

    ngAfterViewInit(): void {
        const search$ = this.search.valueChanges.pipe(
            filter(() => this.search.valid),
            distinctUntilChanged(),
            debounceTime(1000),
            map((search) => ({ search }))
        );

        const status$ = this.statusFilter.valueChanges.pipe(debounceTime(1000));

        const sort$ = this.sort.sortChange.pipe(
            map((sort) => ({
                pageIndex: 0,
                sortColumn: sort.active,
                sortOrder: sort.direction,
            }))
        );

        const paginate$ = this.paginator.page.pipe(
            map((page) => ({
                pageIndex: page.pageIndex,
                pageSize: page.pageSize,
            }))
        );

        merge(search$, sort$, paginate$, status$)
            .pipe(
                tap((filters) => {
                    this.filters.patchValue(filters);
                    this.selection.clear();
                    this.loadItemsPage();
                }),
                takeUntil(this.unsubscribe$)
            )
            .subscribe();

        this.selection.changed
            .pipe(
                tap(
                    (v) =>
                        (this.showActions = this.selection.selected?.length > 0)
                ),
                takeUntil(this.unsubscribe$)
            )
            .subscribe();
    }

    goToPocDetails(event: MouseEvent, poc: IPocSuperAdmin) {
        this.router.navigate(['/views', 'super-admin', 'poc-details', poc.id]);
        event.stopPropagation();
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
