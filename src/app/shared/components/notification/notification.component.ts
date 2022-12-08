import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { NotificationType } from 'src/app/core/models/enums/notification-type.enum';
import { INotification } from 'src/app/core/models/interfaces/notification.interface';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {

  get cssClass() {
    return {
      success: this.data?.type === NotificationType.success,
      error: this.data?.type === NotificationType.error,
      warning: !this.data?.type || this.data?.type === NotificationType.warning,
      notification: true,
    };
  }

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: INotification,
    private snackRef: MatSnackBarRef<NotificationComponent>,
  ) { }

  ngOnInit() { }

    dismiss() {
        this.snackRef.dismiss();
    }
}
