import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/shared/components/notification/notification.component';
import { NotificationType } from '../models/enums/notification-type.enum';
import { INotification } from '../models/interfaces/notification.interface';
import { DEFAULT_NOTIFICATION_DURATION } from '../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private notifications: MatSnackBar,
  ) { }

  success(notificationConfig: INotification) {
    return this.openSnackBar({ ...notificationConfig, type: NotificationType.success });
  }

  error(notificationConfig: INotification) {
    return this.openSnackBar({ ...notificationConfig, type: NotificationType.errorr });
  }

  warning(notificationConfig: INotification) {
    return this.openSnackBar({ ...notificationConfig, type: NotificationType.warning });
  }

  private openSnackBar(config: INotification) {
    this.notifications.openFromComponent(NotificationComponent, {
      duration: config.duration || DEFAULT_NOTIFICATION_DURATION,
      data: config
    });
    return config;
  }
}
