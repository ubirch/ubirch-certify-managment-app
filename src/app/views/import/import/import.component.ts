import { Component, OnInit } from '@angular/core';
import { UploadState } from 'src/app/core/models/enums/upload-state.enum';
import { INotification } from 'src/app/core/models/interfaces/notification.interface';
import { IUploadStatus } from 'src/app/core/models/interfaces/upload-status';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { NotificationService } from 'src/app/core/services/notification.service';

const INITIALSTATE: IUploadStatus = { state: UploadState.pending, progress: 0, result: null };

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
})
export class ImportComponent implements OnInit {

  file: File;
  errorFile: Blob;
  progress: IUploadStatus;
  notification: INotification;

  constructor(
    private fileService: FileUploadService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() { }

  fileSelected(file: File) {
    this.file = file;
    this.progress = null;
    if (this.file) {
      this.notification = null;
      this.errorFile = null;
    }
  }

  uploadFile() {
    this.fileService.uploadFile(this.file)
      .subscribe(
        event => {
          this.progress = event;
          if (event.state === UploadState.done) {
            if (event.result && event.result instanceof Blob) {
              this.errorFile = event.result;
              this.notification = this.notificationService.warning({
                title: 'import.notifications.partialTitle',
                message: 'import.notifications.partial'
              });
            } else {
              this.notificationService.success({ message: 'import.notifications.success' });
            }
          }
        },
        err => {
          this.progress = null;
          this.notification = this.notificationService.error({
            title: 'import.notifications.errorTitle',
            message: 'import.notifications.error'
          });
        }
      );
  }

  downloadResult() {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(this.errorFile);
    a.download = 'processing_errors.csv';
    a.click();
  }

}
