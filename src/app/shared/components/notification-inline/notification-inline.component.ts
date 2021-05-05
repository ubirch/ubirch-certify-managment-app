import { Component, Input, OnInit } from '@angular/core';
import { NotificationType } from 'src/app/core/models/enums/notification-type.enum';
import { INotification } from 'src/app/core/models/interfaces/notification.interface';

@Component({
  selector: 'app-notification-inline',
  templateUrl: './notification-inline.component.html',
  styleUrls: ['./notification-inline.component.scss'],
})
export class NotificationInlineComponent implements OnInit {

  @Input() notification: INotification;

  get cssClass() {
    return {
      success: this.notification?.type === NotificationType.success,
      error: this.notification?.type === NotificationType.errorr,
      warning: !this.notification?.type || this.notification?.type === NotificationType.warning,
      notification: true,
    };
  }

  constructor() { }

  ngOnInit() { }

}
