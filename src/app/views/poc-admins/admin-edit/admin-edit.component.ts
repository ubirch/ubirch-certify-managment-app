import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NEVER, Observable, Subject } from 'rxjs';
import { catchError, filter, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { ErrorBase } from 'src/app/core/models/interfaces/error.interface';
import { IPocAdmin } from 'src/app/core/models/interfaces/poc-admin.interface';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { LocaleService } from 'src/app/core/services/locale.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PocAdminService } from 'src/app/core/services/poc-admin.service';
import { ConfirmDialogService } from '../../../shared/components/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.scss'],
})
export class AdminEditComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();
  public admin$: Observable<IPocAdmin>;
  private adminId: string;

  constructor(
    private pocAdminService: PocAdminService,
    private errorService: ErrorHandlerService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private router: Router,
    private translateService: TranslateService,
    public localeService: LocaleService,
    private confirmService: ConfirmDialogService,
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      map((params: ParamMap) => params.get('id')),
      filter(adminId => !!adminId),
      take(1),
      tap(adminId => {
          this.adminId = adminId;
      } ),
      tap(_ => this.loadAdmin()),
      takeUntil(this.unsubscribe$),
      catchError((err) => this.handleErrorOnLoadingAdmin(err))
    ).subscribe();
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

    public change2MainITAdmin() {
        this.confirmService.open({
            message: this.translateService.instant(`pocAdmin.changeMainPocAdmin.ConfirmMessage`),
            title: this.translateService.instant(`pocAdmin.changeMainPocAdmin.ConfirmTitle`),
        }).pipe(
            take(1),
            switchMap(dialogResult => {
                if (dialogResult) {
                    this.pocAdminService.changeMainPoCAdmin(this.adminId)
                        .subscribe(_ => this.loadAdmin());
                } else {
                    // discard confirmation
                    this.loadAdmin();
                }
                return NEVER;
            }),
        ).subscribe();
    }

    private loadAdmin() {
        this.admin$ = this.pocAdminService.getAdmin(this.adminId).pipe(
            tap(
                (admin: IPocAdmin) => admin
            ),
            takeUntil(this.unsubscribe$),
            catchError((err) => this.handleErrorOnLoadingAdmin(err))
        );
    }

    private handleErrorOnLoadingAdmin(err: any) {
        if (err instanceof ErrorBase) {
            console.log(err);
            this.notificationService.error({ message: err.message, title: err.title });
        } else {
            this.errorService.handlerResponseError(err);
        }
        this.router.navigate(['../../'], { relativeTo: this.route });
        return NEVER;
    }

    ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
