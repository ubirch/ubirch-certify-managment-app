import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NEVER, Observable, Subject } from 'rxjs';
import { catchError, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { AdminStatus } from 'src/app/core/models/enums/admin-status.enum';
import { ErrorBase } from 'src/app/core/models/interfaces/error.interface';
import { IPocAdmin } from 'src/app/core/models/interfaces/poc-admin.interface';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { LocaleService } from 'src/app/core/services/locale.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PocAdminService } from 'src/app/core/services/poc-admin.service';

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.scss'],
})
export class AdminEditComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();
  public admin$: Observable<IPocAdmin>;

  constructor(
    private pocAdminService: PocAdminService,
    private errorService: ErrorHandlerService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private router: Router,
    private translateService: TranslateService,
    public localeService: LocaleService,
  ) { }

  ngOnInit() {
    this.admin$ = this.route.paramMap.pipe(
      map((params: ParamMap) => params.get('id')),
      filter(adminId => !!adminId),
      switchMap(adminId => this.pocAdminService.getAdmin(adminId)),
      tap(
        (admin: IPocAdmin) => {
          if (!admin.webIdentRequired || admin.webIdentInitiateId) {
            //  throw new ErrorBase('adminEdit.notifications.editNotAllowed', 'adminEdit.notifications.editNotAllowedTitle');
          }
        }
      ),
      takeUntil(this.unsubscribe$),
      catchError((err) => {
        if (err instanceof ErrorBase) {
          console.log(err);
          this.notificationService.error({ message: err.message, title: err.title });
        } else {
          this.errorService.handlerResponseError(err);
        }
        this.router.navigate(['../../'], { relativeTo: this.route });
        return NEVER;
      })
    );
  }

  updateAdmin(admin: IPocAdmin) {
    const successMsg = 'adminEdit.notifications.success';
    const successTitleMsg = 'adminEdit.notifications.successTitle';

    this.pocAdminService.putPocAdmin(admin).subscribe(
      _ => {
        this.notificationService.success({
          message: this.translateService.instant(successMsg),
          title: this.translateService.instant(successTitleMsg),
        });
        this.router.navigate(['views/', 'poc-admins']);
      },
      err => this.errorService.handlerResponseError(err)
    );
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
