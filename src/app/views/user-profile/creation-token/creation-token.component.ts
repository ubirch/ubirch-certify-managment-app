import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { NotificationService } from 'src/app/core/services/notification.service';
import { TenantTokenService } from 'src/app/core/services/tenant-token.service';

@Component({
  selector: 'app-token-update',
  templateUrl: './creation-token.component.html',
  styleUrls: ['./creation-token.component.scss'],
})
export class CreationTokenComponent implements OnInit, OnDestroy {

  loading = false;

  token: FormControl;
  unsubscribe$: Subject<void>;

  constructor(
    private tokenService: TenantTokenService,
    private notification: NotificationService,
  ) { }

  ngOnInit() {
    this.token = new FormControl('', [Validators.required]);
    this.unsubscribe$ = new Subject<void>();
  }

  onUpdate() {
    if (this.token.valid) {
      this.loading = true;
      this.tokenService.updateToken(this.token.value)
        .pipe(
          takeUntil(this.unsubscribe$),
          finalize(() => {
            this.loading = false;
            console.log(this.loading);
          }),
        )
        .subscribe(_ => {
          this.notification.success({
            message: 'userProfile.tokenUpdate.success',
            title: 'userProfile.tokenUpdate.successTitle'
          });
        });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }
}
