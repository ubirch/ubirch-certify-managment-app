import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private notification: NotificationService) { }

  handlerResponseError(error: HttpErrorResponse) {
    let notification;
    switch (error.status) {
      case 400:
        notification = this.notification.error({
          message: 'global.errors.400',
          title: 'global.errors.400Title',
        });
        break;
      case 403:
        notification = this.notification.error({
          message: 'global.errors.403',
          title: 'global.errors.403Title',
        });
        break;
      case 409:
        if(error.error.data.detail.length > 0) {
          notification = this.notification.error({
            message: 'global.errors.409',
            title: 'global.errors.409Title',
          });
        }
        break;
      default:
        notification = this.notification.error({
          message: 'global.errors.requestDefault',
          title: 'global.errors.requestDefaultTitle',
        });
        break;
    }

    return notification;
  }
}
