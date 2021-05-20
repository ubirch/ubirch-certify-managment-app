import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { merge, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil, tap } from 'rxjs/operators';
import { AdminStatusTranslation } from 'src/app/core/models/enums/admin-status.enum';
import { ListAction } from 'src/app/core/models/enums/list-actions.enum';
import { Filters } from 'src/app/core/models/filters';
import { IPocAdmin } from 'src/app/core/models/interfaces/poc-admin.interface';
import { PocAdminDataSource } from 'src/app/core/services/data-sources/poc-admin-data-source';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PocAdminService } from 'src/app/core/services/poc-admin.service';
import { detailExpand, fadeDownIn, fadeUpOut } from 'src/app/core/utils/animations';
import { DEFAULT_PAGE_SIZE, PAGE_SIZES } from 'src/app/core/utils/constants';


@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.scss'],
  animations: [detailExpand, fadeDownIn, fadeUpOut],
})
export class AdminListComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: PocAdminDataSource;
  displayColumns: string[] = [
    'select',
    'firstName',
    'lastName',
    'dateOfBirth',
    'email',
    'phone',
    'pocName',
    'state',
  ];
  selection = new SelectionModel<IPocAdmin>(true, []);
  defaultSortColumn = 'firstName';
  defaultPageSize = DEFAULT_PAGE_SIZE;
  pageSizes = PAGE_SIZES;
  expandedElement: IPocAdmin | null;

  filters: FormGroup;
  action: FormControl = new FormControl(ListAction.delete);
  actions = [
    { value: ListAction.activate, label: `listActions.activate` },
    { value: ListAction.deactivate, label: `listActions.deactivate` }
  ];
  adminStatusTranslation = AdminStatusTranslation;
  showActions = false;
  exportLoading = false;

  get search() { return this.filters.get('search'); }
  get columnFilters() { return this.filters?.get('filterColumns') as FormGroup; }
  get statusFilter() { return this.columnFilters?.controls?.status; }

  private unsubscribe$ = new Subject();

  constructor(
    private adminService: PocAdminService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    public dialog: MatDialog,
    private errorService: ErrorHandlerService,
    private notificationService: NotificationService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.dataSource = new PocAdminDataSource(this.adminService, this.errorService);
    this.generateFilters();
    this.loadAdminsPage();
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
        this.loadAdminsPage();
      }),
      takeUntil(this.unsubscribe$),
    ).subscribe();

    this.selection.changed
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        v => this.showActions = this.selection.selected?.length > 0
      );
  }

  ngOnDestroy(): void {
    if (this.unsubscribe$) {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }
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
  checkboxLabel(row?: IPocAdmin): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.email}`;
  }

  applyAction() {
    const selected = this.selection.selected;
    switch (this.action.value) {
      case ListAction.activate:
        // TODO: Remove notification when DELETE endpoint is implemented and uncomment deleteItems
        this.notificationService.warning({
          message: 'global.errors.notImplemented',
          title: 'global.errors.requestDefaultTitle',
          duration: 7000
        });
        break;
      case ListAction.deactivate:
        // TODO: Remove notification when DELETE endpoint is implemented and uncomment deleteItems
        this.notificationService.warning({
          message: 'global.errors.notImplemented',
          title: 'global.errors.requestDefaultTitle',
          duration: 7000
        });
        break;
      default:
        break;
    }
  }

  private loadAdminsPage() {
    this.dataSource.loadAdmins(this.filters.value);
  }

  private generateFilters() {
    this.filters = this.fb.group({ ...new Filters(), sortColumn: this.defaultSortColumn });
    this.filters.get('search').setValidators([Validators.minLength(3)]);

    this.filters.addControl('filterColumns', this.fb.group({
      status: ['']
    }));
  }

}
