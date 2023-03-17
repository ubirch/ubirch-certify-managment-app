import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
    UntypedFormBuilder,
    FormControl,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
    debounceTime,
    finalize,
    map,
    merge,
    of,
    takeUntil,
    tap,
    zip,
} from 'rxjs';
import { Filters } from 'src/app/core/models/filters';
import { AllRevocations } from 'src/app/core/models/interfaces/all-revocations.interface';
import { INotification } from 'src/app/core/models/interfaces/notification.interface';
import { AllRevocationsDatasource } from 'src/app/core/services/data-sources/all-revocations-data-source';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { ExportImportService } from 'src/app/core/services/export-import.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { RevocationService } from 'src/app/core/services/revocation.service';
import { DEFAULT_PAGE_SIZE, PAGE_SIZES } from 'src/app/core/utils/constants';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/confirm-dialog.service';
import { ListComponent } from 'src/app/shared/components/list/list.component';

@Component({
    selector: 'app-all-revocations-list',
    templateUrl: './all-revocations-list.component.html',
    styleUrls: ['./all-revocations-list.component.scss'],
})
export class AllRevocationsListComponent
    extends ListComponent<AllRevocations>
    implements OnInit, AfterViewInit
{
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    dataSource: AllRevocationsDatasource;

    displayColumns: string[] = ['transactionNumber', 'updatedAt'];
    defaultSortColumn = 'updatedAt';
    defaultPageSize = DEFAULT_PAGE_SIZE;
    pageSizes = PAGE_SIZES;
    expandedElement: AllRevocations | null;
    filters: UntypedFormGroup;
    notification: INotification;
    actionLoading = false;
    showActions: boolean;
    exportLoading = false;

    protected loadItemsPage() {
        this.dataSource.loadAllRevocations(this.filters.value);
    }

    get search() {
        return this.filters.get('search');
    }

    get columnFilters() {
        return this.filters?.get('filterColumns') as UntypedFormGroup;
    }

    constructor(
        protected exportService: ExportImportService,
        protected revocationService: RevocationService,
        protected fb: UntypedFormBuilder,
        protected translateService: TranslateService,
        protected confirmService: ConfirmDialogService,
        protected errorService: ErrorHandlerService,
        protected notificationService: NotificationService,
        protected router: Router,
        public dialog: MatDialog
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
        this.dataSource = new AllRevocationsDatasource(
            this.revocationService,
            this.errorService
        );
        this.generateFilters();
        this.loadItemsPage();
    }

    public getRowClass(revocation: AllRevocations): string {
        let rowClass = '';
        return rowClass;
    }
    ngAfterViewInit(): void {
        if (this.sort && this.paginator) {
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
            merge(sort$, paginate$)
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
                    tap((v) => (this.showActions = true)),
                    takeUntil(this.unsubscribe$)
                )
                .subscribe();
        }
    }

    dateRangeChange(date: { start: { value: any }; end: { value: any } }) {
        zip(
            of([date.start, date.end]).pipe(
                map(() => ({
                    from: date.start.value,
                    to: date.end.value,
                }))
            )
        )
            .pipe(
                tap((filters) => {
                    this.filters.patchValue(...filters);
                    this.selection.clear();
                    this.loadItemsPage();
                }),
                takeUntil(this.unsubscribe$)
            )
            .subscribe();
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
    export() {
        this.exportLoading = true;
        delete this.filters.value.pageIndex;
        delete this.filters.value.pageSize;
        delete this.filters.value.filterColumns;
        this.revocationService
            .exportRevocations(this.filters.value)
            .pipe(
                takeUntil(this.unsubscribe$),
                finalize(() => (this.exportLoading = false))
            )
            .subscribe({
                next: (blob) => {
                    if (blob) {
                        const timezone = new Intl.DateTimeFormat(
                            'en-US'
                        ).resolvedOptions().timeZone;
                        this.exportService.triggerDownload(
                            blob,
                            'Revocations_' +
                                new Date().toLocaleString('en-DE', {
                                    timeZone: timezone,
                                }) +
                                '.csv'
                        );
                    } else {
                        this.notification = this.notificationService.warning({
                            title: 'revocationRequester.exportWarningTitle',
                            message: 'revocationRequester.exportWarning',
                        });
                    }
                },

                error: (err) => this.errorService.handlerResponseError(err),
            });
    }
}
