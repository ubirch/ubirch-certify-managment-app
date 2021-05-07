import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { fadeInUp } from 'ngx-animate';
import { NotificationType } from 'src/app/core/models/enums/notification-type.enum';
import { INotification } from 'src/app/core/models/interfaces/notification.interface';

@Component({
  selector: 'app-notification-inline',
  templateUrl: './notification-inline.component.html',
  styleUrls: ['./notification-inline.component.scss'],
  animations: [
    trigger('fadeUpDown', [
      transition('* => *', useAnimation(fadeInUp, { params: { timing: 0.3, a: '-30px', b: '0px' } })),
    ])
  ],
})
export class NotificationInlineComponent implements OnInit {

  @Input() notification: INotification;
  notificationTypes = NotificationType;

  get cssClass() {
    return {
      success: this.notification?.type === NotificationType.success,
      error: this.notification?.type === NotificationType.error,
      warning: !this.notification?.type || this.notification?.type === NotificationType.warning,
      notification: true,
    };
  }

  constructor() { }

  ngOnInit() { }

}
