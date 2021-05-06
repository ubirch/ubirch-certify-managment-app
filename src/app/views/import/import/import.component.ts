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
              this.notification = this.notificationService.warning({ message: 'There were some errors while processing csv file' });
            } else {
              this.notificationService.success({ message: 'File upload successfully' });
            }
          }
        },
        err => {
          this.progress = null;
          this.notification = this.notificationService.error({ title: 'Upload Error', message: 'There was an error during file upload' });
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
