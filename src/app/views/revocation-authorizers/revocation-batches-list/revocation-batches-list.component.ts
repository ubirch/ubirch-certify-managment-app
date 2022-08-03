import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { map, merge, take, takeUntil, tap } from 'rxjs';

import { Filters } from 'src/app/core/models/filters';
import { RevocationBatch } from 'src/app/core/models/interfaces/revocation-batch.interface';
import { RevocationEntry } from 'src/app/core/models/interfaces/revocation-entry.interface';
import { RevocationBatchDataSource } from 'src/app/core/services/data-sources/revocation-batch-data-source';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { RevocationService } from 'src/app/core/services/revocation.service';
import {
    detailExpand,
    fadeDownIn,
    fadeUpOut,
} from 'src/app/core/utils/animations';
import { DEFAULT_PAGE_SIZE, PAGE_SIZES } from 'src/app/core/utils/constants';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/confirm-dialog.service';
import { ListComponent } from 'src/app/shared/components/list/list.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-revocation-batches-list',
    templateUrl: './revocation-batches-list.component.html',
    styleUrls: ['./revocation-batches-list.component.scss'],
    animations: [detailExpand, fadeDownIn, fadeUpOut],
})
export class RevocationBatchesListComponent
    extends ListComponent<RevocationBatch>
    implements OnInit, AfterViewInit
{
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    dataSource: RevocationBatchDataSource;

    displayColumns: string[] = [
        'batchId',
        'kid',
        'technicalExpiryDate',
        'uploadedAt',
        'deleted',
        'deletedAt',
        'num_of_entries',
        'actions',
    ];

    defaultSortColumn = 'uploadedAt';
    defaultPageSize = DEFAULT_PAGE_SIZE;
    pageSizes = PAGE_SIZES;
    expandedElement: RevocationEntry | null;
    filters: FormGroup;
    actionLoading = false;
    showActions: boolean;

    protected loadItemsPage() {
        this.dataSource.loadBatches(this.filters.value);
    }

    get search() {
        return this.filters.get('search');
    }

    get columnFilters() {
        return this.filters?.get('filterColumns') as FormGroup;
    }

    constructor(
        protected revocationService: RevocationService,
        protected fb: FormBuilder,
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

    icon(value: boolean) {
        if (value === true) {
            return 'cancel';
        }
        if (value === false) {
            return 'check_circle';
        }
        return '';
    }

    ngOnInit() {
        this.dataSource = new RevocationBatchDataSource(
            this.revocationService,
            this.errorService,
            this.translateService,
            this.notificationService
        );
        this.generateFilters();
        this.loadItemsPage();
    }

    public getRowClass(revocation: RevocationBatch): string {
        let rowClass = '';
        return rowClass;
    }
    ngAfterViewInit(): void {
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
                tap(
                    (v) =>
                        (this.showActions = this.selection.selected?.length > 0)
                ),
                takeUntil(this.unsubscribe$)
            )
            .subscribe();
    }

    deleteBatch(revocationBatch: RevocationBatch) {
        this.confirmService
            .open({
                message: this.translateService.instant(
                    'revocationBatchList.delete.deleteConfirmMessage'
                ),
                title: 'revocationBatchList.delete.deleteConfirmTitle',
            })
            .pipe(
                take(1),
                tap((dialogResult) => {
                    if (dialogResult) {
                        return this.dataSource.deleteBatch(
                            revocationBatch,
                            this.filters.value
                        );
                    }
                })
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
}
