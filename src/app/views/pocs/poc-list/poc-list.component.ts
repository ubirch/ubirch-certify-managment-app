import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, map, take, takeUntil, tap } from 'rxjs/operators';
import { ListAction } from 'src/app/core/models/enums/list-actions.enum';
import { PocStatusTranslation } from 'src/app/core/models/enums/poc-status.enum';
import { IPoc } from 'src/app/core/models/interfaces/poc.interface';
import { Filters } from 'src/app/core/models/filters';
import { PocDataSource } from 'src/app/core/services/data-sources/poc-data-source';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { ExportImportService } from 'src/app/core/services/export-import.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PocsService } from 'src/app/core/services/pocs.service';
import { detailExpand, fadeDownIn, fadeUpOut } from 'src/app/core/utils/animations';
import { DEFAULT_PAGE_SIZE, PAGE_SIZES } from 'src/app/core/utils/constants';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/confirm-dialog.service';
import { ListComponent } from 'src/app/shared/components/list/list.component';

@Component({
  selector: 'app-poc-list',
  templateUrl: './poc-list.component.html',
  styleUrls: ['./poc-list.component.scss'],
  animations: [detailExpand, fadeDownIn, fadeUpOut],
})
export class PocListComponent extends ListComponent<IPoc> implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: PocDataSource;
  displayColumns: string[] = [
    'select',
    'externalId',
    'pocName',
    'created',
    'lastUpdated',
    'status',
    'actions',
  ];
  defaultSortColumn = 'externalId';
  defaultPageSize = DEFAULT_PAGE_SIZE;
  pageSizes = PAGE_SIZES;
  expandedElement: IPoc | null;

  filters: FormGroup;
  PocStatusTranslation = PocStatusTranslation;
  exportLoading = false;

  get search() { return this.filters.get('search'); }
  get columnFilters() { return this.filters?.get('filterColumns') as FormGroup; }
  get statusFilter() { return this.columnFilters?.controls?.status; }

  constructor(
    protected pocService: PocsService,
    protected fb: FormBuilder,
    protected translateService: TranslateService,
    protected confirmService: ConfirmDialogService,
    protected errorService: ErrorHandlerService,
    protected exportService: ExportImportService,
    protected notificationService: NotificationService,
    protected router: Router,
  ) {
    super(
      fb,
      errorService,
      notificationService,
      router,
      confirmService,
      translateService
    );

    this.actions = [
      { value: ListAction.delete, label: `listActions.delete` }
    ];
    this.action = new FormControl(ListAction.delete);
  }

  ngOnInit() {
    this.dataSource = new PocDataSource(this.pocService, this.errorService);
    this.generateFilters();
    this.loadItemsPage();
  }

  ngAfterViewInit(): void {
    const search$ = this.search.valueChanges.pipe(
      filter(() => this.search.valid),
      distinctUntilChanged(),
      debounceTime(1000),
      map(search => ({ search })),
    );

    const status$ = this.statusFilter.valueChanges.pipe(
      debounceTime(1000)
    );

    const sort$ = this.sort.sortChange.pipe(
      map(sort => ({
        pageIndex: 0,
        sortColumn: sort.active,
        sortOrder: sort.direction,
      }))
    );

    const paginate$ = this.paginator.page.pipe(
      map(page => ({
        pageIndex: page.pageIndex,
        pageSize: page.pageSize
      }))
    );

    merge(search$, sort$, paginate$, status$).pipe(
      tap(filters => {
        this.filters.patchValue(filters);
        this.selection.clear();
        this.loadItemsPage();
      }),
      takeUntil(this.unsubscribe$),
    ).subscribe();

    this.selection.changed
      .pipe(
        tap(v => this.showActions = this.selection.selected?.length > 0),
        takeUntil(this.unsubscribe$),
      ).subscribe();
  }

  applyAction() {
    const selected = this.selection.selected;
    switch (this.action.value) {
      case ListAction.delete:
        // TODO: Remove notification when DELETE endpoint is implemented and uncomment deleteItems
        this.notificationService.warning({
          message: 'global.errors.notImplemented',
          title: 'global.errors.requestDefaultTitle',
          duration: 7000
        });
        // this.deleteItems(selected);
        break;
      default:
        break;
    }
  }

  export() {
    this.exportLoading = true;
    this.pocService.exportPocs().pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.exportLoading = false)
    ).subscribe(
      blob => this.exportService.triggerDownload(blob, 'POCS_' + (new Date()).toISOString() + '.csv'),
      err => this.errorService.handlerResponseError(err)
    );
  }

  editPoc(event: MouseEvent, poc: IPoc) {
    this.router.navigate(['/views', 'pocs', 'edit', poc.id]);
    event.stopPropagation();
  }

  private deleteItems(pocs: IPoc[]) {
    this.confirmService.open({
      message: this.translateService.instant('pocList.actions.deleteConfirmMessage', { count: this.selection.selected.length }),
      title: 'pocList.actions.deleteConfirmTitle',
    }).pipe(
      take(1),
      tap(dialogResult => {
        if (dialogResult) {
          return this.dataSource.deletePocs(pocs, this.filters.value);
        }
      })
    ).subscribe();
  }

  protected loadItemsPage() {
    this.dataSource.loadPocs(this.filters.value);
  }

  private generateFilters() {
    this.filters = this.fb.group({ ...new Filters(), sortColumn: this.defaultSortColumn });
    this.filters.get('search').setValidators([Validators.minLength(3)]);

    this.filters.addControl('filterColumns', this.fb.group({
      status: ['']
    }));
  }
}
