import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { NotificationService } from 'src/app/core/services/notification.service';
import { TenantTokenService } from 'src/app/core/services/tenant-token.service';

@Component({
  selector: 'app-token-update',
  templateUrl: './token-update.component.html',
  styleUrls: ['./token-update.component.scss'],
})
export class TokenUpdateComponent implements OnInit, OnDestroy {

  loading = false;

  token: FormControl;
  unsubscribe$: Subject<any>;

  constructor(
    private dialogRef: MatDialogRef<TokenUpdateComponent>,
    private tokenService: TenantTokenService,
    private notification: NotificationService,
  ) { }

  ngOnInit() {
    this.token = new FormControl('', [Validators.required]);
    this.unsubscribe$ = new Subject();
  }

  onUpdate() {
    if (this.token.valid) {
      this.loading = true;
      this.tokenService.updateToken(this.token.value)
        .pipe(
          finalize(() => { this.loading = false; }),
          takeUntil(this.unsubscribe$),
        )
        .subscribe(_ => {
          this.dialogRef.close();
          this.notification.success({
            message: 'tokenUpdate.success',
            title: 'tokenUpdate.successTitle'
          });
        });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }
}
