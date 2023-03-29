import {
    AfterViewInit,
    Component,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { map, merge, takeUntil, tap } from 'rxjs';
import { Filters } from 'src/app/core/models/filters';

import { RevocationEntry } from 'src/app/core/models/interfaces/revocation-entry.interface';
import { Revocation } from 'src/app/core/models/interfaces/revocation.interface';
import { RevocationBatchEntryDataSource } from 'src/app/core/services/data-sources/revocation-batch-entry-data-source';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { RevocationService } from 'src/app/core/services/revocation.service';
import { DEFAULT_PAGE_SIZE, PAGE_SIZES } from 'src/app/core/utils/constants';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/confirm-dialog.service';
import { ListComponent } from 'src/app/shared/components/list/list.component';

@Component({
    selector: 'app-revocation-entries-list',
    templateUrl: './revocation-entries-list.component.html',
    styleUrls: ['./revocation-entries-list.component.scss'],
})
export class RevocationEntriesListComponent
    extends ListComponent<RevocationEntry>
    implements OnInit, AfterViewInit
{
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    dataSource: RevocationBatchEntryDataSource;
    @Input() batchId: string;

    displayColumns: string[] = [
        'kid',
        'rValueSignature',
        'issuingCountry',
        'dateOfIssue',
        'technicalExpiryDate',
        'transactionNumber',
    ];
    defaultSortColumn = 'rValueSignature';
    defaultPageSize = DEFAULT_PAGE_SIZE;
    pageSizes = PAGE_SIZES;

    filters: UntypedFormGroup;
    actionLoading = false;
    showActions: boolean;

    protected loadItemsPage() {
        this.dataSource.loadBatchEntries(this.batchId, this.filters.value);
    }

    constructor(
        protected revocationService: RevocationService,
        protected fb: UntypedFormBuilder,
        protected translateService: TranslateService,
        protected confirmService: ConfirmDialogService,
        protected errorService: ErrorHandlerService,
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
        this.dataSource = new RevocationBatchEntryDataSource(
            this.revocationService,
            this.errorService
        );
        this.generateFilters();
        this.loadItemsPage();
    }

    public getRowClass(revocation: Revocation): string {
        let rowClass = '';
        // if (revocation.errorMessage) {
        //     rowClass = 'with-error';
        // }
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
