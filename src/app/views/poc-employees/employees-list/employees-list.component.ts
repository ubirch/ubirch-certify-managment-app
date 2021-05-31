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
import { AcitvateAction } from 'src/app/core/models/enums/acitvate-action.enum';
import { EmployeeStatusTranslation } from 'src/app/core/models/enums/employee-status.eunm';
import { ListAction } from 'src/app/core/models/enums/list-actions.enum';
import { Filters } from 'src/app/core/models/filters';
import { IPocEmployee } from 'src/app/core/models/interfaces/poc-employee.interface';
import { PocEmployeeDataSource } from 'src/app/core/services/data-sources/poc-employee-data-source';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PocEmployeeService } from 'src/app/core/services/poc-employee.service';
import { detailExpand, fadeDownIn, fadeUpOut } from 'src/app/core/utils/animations';
import { DEFAULT_PAGE_SIZE, PAGE_SIZES } from 'src/app/core/utils/constants';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss'],
  animations: [detailExpand, fadeDownIn, fadeUpOut],
})
export class EmployeesListComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: PocEmployeeDataSource;
  displayColumns: string[] = [
    'select',
    'firstName',
    'lastName',
    'email',
    'active',
    'status',
  ];
  selection = new SelectionModel<IPocEmployee>(true, []);
  defaultSortColumn = 'email';
  defaultPageSize = DEFAULT_PAGE_SIZE;
  pageSizes = PAGE_SIZES;
  expandedElement: IPocEmployee | null;

  filters: FormGroup;
  action: FormControl = new FormControl(ListAction.activate);
  actions = [
    { value: ListAction.activate, label: `listActions.activate` },
    { value: ListAction.deactivate, label: `listActions.deactivate` }
  ];
  employeeStatusTranslation = EmployeeStatusTranslation;
  showActions = false;
  actionLoding = false;
  exportLoading = false;

  get search() { return this.filters.get('search'); }
  get columnFilters() { return this.filters?.get('filterColumns') as FormGroup; }
  get statusFilter() { return this.columnFilters?.controls?.status; }

  private unsubscribe$ = new Subject();

  constructor(
    private employeeService: PocEmployeeService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private errorService: ErrorHandlerService,
    private notificationService: NotificationService,
    private router: Router,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.dataSource = new PocEmployeeDataSource(this.employeeService, this.errorService);
    this.generateFilters();
    this.loadEmployeesPage();
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
        this.loadEmployeesPage();
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
  checkboxLabel(row?: IPocEmployee): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.email}`;
  }

  applyAction() {
    const selected = this.selection.selected;
    switch (this.action.value) {
      case ListAction.activate:
        this.actionLoding = true;
        this.employeeService.changeActiveStateForAdmins(selected, AcitvateAction.activate)
          .pipe(finalize(() => this.actionLoding = false))
          .subscribe(resp => this.handleActivationResponse(resp, this.action.value));
        break;
      case ListAction.deactivate:
        this.actionLoding = true;
        this.employeeService.changeActiveStateForAdmins(selected, AcitvateAction.deactivate)
          .pipe(finalize(() => this.actionLoding = false))
          .subscribe(resp => this.handleActivationResponse(resp, this.action.value));
        break;
      default:
        break;
    }
  }

  ngOnDestroy(): void {
    if (this.unsubscribe$) {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }
  }

  private loadEmployeesPage() {
    this.dataSource.loadEmpoloyees(this.filters.value);
  }

  private generateFilters() {
    this.filters = this.fb.group({ ...new Filters(), sortColumn: this.defaultSortColumn });
    this.filters.get('search').setValidators([Validators.minLength(3)]);

    this.filters.addControl('filterColumns', this.fb.group({
      status: ['']
    }));
  }

  private handleActivationResponse({ ok, nok }, action: ListAction) {
    if (nok?.length > 0) {
      if (ok?.length === 0) {
        this.notificationService.error({
          message: `pocEmployee.actionMessages.${action}Error`,
          title: `pocEmployee.actionMessages.${action}ErrorTitle`,
          duration: 7000
        });
      } else {
        this.notificationService.warning({
          message: this.translate.instant(`pocEmployee.actionMessages.${action}Warning`, { count: nok.length }),
          title: `pocEmployee.actionMessages.${action}WarningTitle`,
          duration: 7000
        });
        this.selection.clear();
        this.loadEmployeesPage();
      }
    } else {
      this.notificationService.success({
        message: this.translate.instant(`pocEmployee.actionMessages.${action}Success`, { count: nok.length }),
        title: `pocEmployee.actionMessages.${action}SuccessTitle`,
        duration: 7000
      });
      this.loadEmployeesPage();
      this.selection.clear();
    }
  }

}
