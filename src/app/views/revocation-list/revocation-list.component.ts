import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { map, merge, takeUntil, tap } from 'rxjs';
import { Filters } from 'src/app/core/models/filters';
import { Revocation } from 'src/app/core/models/interfaces/revocation.interface';
import { RevocationDataSource } from 'src/app/core/services/data-sources/revocation-data-source';
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

@Component({
    selector: 'app-revocation-list',
    templateUrl: './revocation-list.component.html',
    styleUrls: ['./revocation-list.component.scss'],
    animations: [detailExpand, fadeDownIn, fadeUpOut],
})
export class RevocationListComponent
    extends ListComponent<Revocation>
    implements OnInit, AfterViewInit
{
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    dataSource: RevocationDataSource;

    displayColumns: string[] = [
        'dsc_kid',
        'r_value_signature',
        'country',
        'date_of_issue',
        'expiration',
        'transaction_id',
    ];
    defaultSortColumn = 'dateOfIssue';
    defaultPageSize = DEFAULT_PAGE_SIZE;
    pageSizes = PAGE_SIZES;
    expandedElement: Revocation | null;
    filters: FormGroup;
    actionLoading = false;
    showActions: boolean;

    protected loadItemsPage() {
        this.dataSource.loadRevocations(this.filters.value);
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

    ngOnInit() {
        this.dataSource = new RevocationDataSource(
            this.revocationService,
            this.errorService,
        );
        this.generateFilters();
        this.loadItemsPage();
    }

    public getRowClass(revocation: Revocation): string {
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
