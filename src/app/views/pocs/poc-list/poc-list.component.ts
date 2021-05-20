import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { merge, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, map, takeUntil, tap } from 'rxjs/operators';
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
import { ConfirmDialogComponent, ConfirmDialogModel } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-poc-list',
  templateUrl: './poc-list.component.html',
  styleUrls: ['./poc-list.component.scss'],
  animations: [detailExpand, fadeDownIn, fadeUpOut],
})
export class PocListComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: PocDataSource;
  displayColumns: string[] = [
    'select',
    'externalId',
    'pocName',
    'dataSchemaId',
    'created',
    'lastUpdated',
    'status',
    'actions',
  ];
  selection = new SelectionModel<IPoc>(true, []);
  defaultSortColumn = 'externalId';
  defaultPageSize = DEFAULT_PAGE_SIZE;
  pageSizes = PAGE_SIZES;
  expandedElement: IPoc | null;

  filters: FormGroup;
  action: FormControl = new FormControl(ListAction.delete);
  actions = [
    { value: ListAction.delete, label: `listActions.delete` }
  ];
  PocStatusTranslation = PocStatusTranslation;
  showActions = false;
  exportLoading = false;

  get search() { return this.filters.get('search'); }
  get columnFilters() { return this.filters?.get('filterColumns') as FormGroup; }
  get statusFilter() { return this.columnFilters?.controls?.status; }

  private unsubscribe$ = new Subject();

  constructor(
    private pocService: PocsService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    public dialog: MatDialog,
    private errorService: ErrorHandlerService,
    private exportService: ExportImportService,
    private notificationService: NotificationService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.dataSource = new PocDataSource(this.pocService, this.errorService);
    this.generateFilters();
    this.loadPocPage();
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
        this.loadPocPage();
      }),
      takeUntil(this.unsubscribe$),
    ).subscribe();

    this.selection.changed
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        v => this.showActions = this.selection.selected?.length > 0
      );
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource?.data?.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: IPoc): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.externalId}`;
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
    this.exportService.exportPocs().pipe(
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

  ngOnDestroy(): void {
    if (this.unsubscribe$) {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }
  }

  private deleteItems(pocs: IPoc[]) {
    const message = this.translateService.instant('pocList.actions.deleteConfirmMessage', { count: this.selection.selected.length });
    const title = this.translateService.instant('pocList.actions.deleteConfirmTitle');
    const dialogData = new ConfirmDialogModel(title, message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '800px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.dataSource.deletePocs(pocs, this.filters.value);
        this.selection.clear();
      }
    });
  }

  private loadPocPage() {
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