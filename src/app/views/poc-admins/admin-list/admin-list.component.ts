import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { AcitvateAction } from 'src/app/core/models/enums/acitvate-action.enum';
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
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/confirm-dialog.service';
import { ListComponent } from 'src/app/shared/components/list/list.component';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.scss'],
  animations: [detailExpand, fadeDownIn, fadeUpOut],
})
export class AdminListComponent extends ListComponent<IPocAdmin> implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: PocAdminDataSource;
  displayColumns: string[] = [
    'select',
    'firstName',
    'lastName',
    'email',
    'pocName',
    'active',
    'state',
    'createdAt',
    'actions',
  ];
  defaultSortColumn = 'email';
  defaultPageSize = DEFAULT_PAGE_SIZE;
  pageSizes = PAGE_SIZES;
  expandedElement: IPocAdmin | null;

  filters: FormGroup;
  adminStatusTranslation = AdminStatusTranslation;
  actionLoding = false;

  get search() { return this.filters.get('search'); }
  get columnFilters() { return this.filters?.get('filterColumns') as FormGroup; }
  get statusFilter() { return this.columnFilters?.controls?.status; }

  constructor(
    protected adminService: PocAdminService,
    protected fb: FormBuilder,
    protected errorService: ErrorHandlerService,
    protected notificationService: NotificationService,
    protected router: Router,
    protected route: ActivatedRoute,
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
      { value: ListAction.activate, label: `listActions.activate` },
      { value: ListAction.deactivate, label: `listActions.deactivate` },
      { value: ListAction.revoke2FA, label: `listActions.revoke2FA` },
    ];

    this.action = new FormControl(ListAction.activate);
  }

  ngOnInit() {
    this.dataSource = new PocAdminDataSource(this.adminService, this.errorService);
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
        this.adminService.changeActiveStateForAdmins(selected, AcitvateAction.activate)
          .pipe(finalize(() => this.actionLoding = false))
          .subscribe(resp => this.handleActionResponse(resp, this.action.value));
        break;
      case ListAction.deactivate:
        this.actionLoding = true;
        this.adminService.changeActiveStateForAdmins(selected, AcitvateAction.deactivate)
          .pipe(finalize(() => this.actionLoding = false))
          .subscribe(resp => this.handleActionResponse(resp, this.action.value));
        break;
      case ListAction.revoke2FA:
        this.confirmService.open({
          message: this.translateService.instant('adminList.actions.revoke2FA', { count: this.selection.selected.length }),
          title: 'adminList.actions.revoke2FATitle',
        }).pipe(
          take(1),
          switchMap(dialogResult => {
            if (dialogResult) {
              this.actionLoding = true;
              return this.adminService.revoke2FAForAdmins(selected)
                .pipe(
                  tap(resp => this.handleActionResponse(resp, this.action.value)),
                  finalize(() => this.actionLoding = false)
                );
            }
          })
        ).subscribe();
        break;
      default:
        break;
    }
  }

  editAdmin(event: MouseEvent, poc: IPocAdmin) {
    this.router.navigate(['edit', poc.id], { relativeTo: this.route });
    event.stopPropagation();
  }

  protected loadItemsPage() {
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
