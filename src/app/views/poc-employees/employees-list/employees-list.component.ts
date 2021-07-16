import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { merge, NEVER } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { AcitvateAction } from 'src/app/core/models/enums/acitvate-action.enum';
import { EmployeeStatus, EmployeeStatusTranslation } from 'src/app/core/models/enums/employee-status.eunm';
import { ListAction } from 'src/app/core/models/enums/list-actions.enum';
import { Filters } from 'src/app/core/models/filters';
import { IPocEmployee } from 'src/app/core/models/interfaces/poc-employee.interface';
import { PocEmployeeDataSource } from 'src/app/core/services/data-sources/poc-employee-data-source';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PocEmployeeService } from 'src/app/core/services/poc-employee.service';
import { detailExpand, fadeDownIn, fadeUpOut } from 'src/app/core/utils/animations';
import { DEFAULT_PAGE_SIZE, PAGE_SIZES } from 'src/app/core/utils/constants';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/confirm-dialog.service';
import { ListComponent } from 'src/app/shared/components/list/list.component';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss'],
  animations: [detailExpand, fadeDownIn, fadeUpOut],
})
export class EmployeesListComponent extends ListComponent<IPocEmployee> implements OnInit, AfterViewInit {
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
    'createdAt',
    'actions',
  ];
  defaultSortColumn = 'email';
  defaultPageSize = DEFAULT_PAGE_SIZE;
  pageSizes = PAGE_SIZES;
  expandedElement: IPocEmployee | null;

  filters: FormGroup;
  employeeStatusTranslation = EmployeeStatusTranslation;
  showActions = false;
  actionLoding = false;
  exportLoading = false;

  get search() { return this.filters.get('search'); }
  get columnFilters() { return this.filters?.get('filterColumns') as FormGroup; }
  get statusFilter() { return this.columnFilters?.controls?.status; }

  constructor(
    protected employeeService: PocEmployeeService,
    protected fb: FormBuilder,
    protected errorService: ErrorHandlerService,
    protected notificationService: NotificationService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected translate: TranslateService,
    protected confirmService: ConfirmDialogService,
    protected translateService: TranslateService,
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
      { value: ListAction.activate, label: `listActions.activate`, predicate: (employee: IPocEmployee) => !employee.active },
      { value: ListAction.deactivate, label: `listActions.deactivate`, predicate: (employee: IPocEmployee) => employee.active },
      { value: ListAction.revoke2FA, label: `listActions.revoke2FA`, predicate: (employee: IPocEmployee) => true },
      {
        value: ListAction.retry,
        label: `listActions.retry`,
        predicate: (employee: IPocEmployee) => employee.status === EmployeeStatus.aborted
      },
    ];
    this.action = new FormControl();
  }

  ngOnInit() {
    this.dataSource = new PocEmployeeDataSource(this.employeeService, this.errorService);
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

      case ListAction.activate:
        this.actionLoding = true;
        this.employeeService.changeActiveStateForEmployees(selected, AcitvateAction.activate)
          .pipe(finalize(() => this.actionLoding = false))
          .subscribe(resp => this.handleActionResponse(resp, this.action.value, 'pocEmployee'));
        break;

      case ListAction.deactivate:
        this.actionLoding = true;
        this.employeeService.changeActiveStateForEmployees(selected, AcitvateAction.deactivate)
          .pipe(finalize(() => this.actionLoding = false))
          .subscribe(resp => this.handleActionResponse(resp, this.action.value, 'pocEmployee'));
        break;

      case ListAction.retry:
        this.actionLoding = true;
        this.employeeService.retryEmployees(selected)
          .pipe(finalize(() => this.actionLoding = false))
          .subscribe(resp => this.handleActionResponse(resp, this.action.value, 'pocEmployee'));
        break;

      case ListAction.revoke2FA:
        this.confirmService.open({
          message: this.translateService.instant('employeeList.actions.revoke2FA', { count: this.selection.selected.length }),
          title: 'employeeList.actions.revoke2FATitle',
        }).pipe(
          take(1),
          switchMap(dialogResult => {
            if (dialogResult) {
              this.actionLoding = true;
              return this.employeeService.revoke2FAForEmployees(selected)
                .pipe(
                  tap(resp => this.handleActionResponse(resp, this.action.value, 'pocEmployee')),
                  finalize(() => this.actionLoding = false)
                );
            }
            return NEVER;
          })
        ).subscribe();
        break;
      default:
        break;
    }
  }

  editEmployee(event: MouseEvent, employee: IPocEmployee) {
    this.router.navigate(['edit', employee.id], { relativeTo: this.route });
    event.stopPropagation();
  }

  protected loadItemsPage() {
    this.dataSource.loadEmpoloyees(this.filters.value);
  }

  private generateFilters() {
    this.filters = this.fb.group({ ...new Filters(), sortColumn: this.defaultSortColumn });
    this.filters.get('search').setValidators([Validators.minLength(3)]);

    this.filters.addControl('filterColumns', this.fb.group({
      status: ['']
    }));
  }

}
