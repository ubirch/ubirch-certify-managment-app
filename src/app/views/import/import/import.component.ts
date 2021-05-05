import { Component, OnInit } from '@angular/core';
import { UploadState } from 'src/app/core/models/enums/upload-state.enum';
import { IUploadStatus } from 'src/app/core/models/interfaces/upload-status';
import { FileUploadService } from 'src/app/core/services/file-upload.service';

const INITIALSTATE: IUploadStatus = { state: UploadState.pending, progress: 0, result: null };

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
})
export class ImportComponent implements OnInit {

  file: File;
  progress: IUploadStatus;

  constructor(private fileService: FileUploadService) { }

  ngOnInit() { }

  fileSelected(file: File) {
    this.file = file;
  }

  uploadFile() {
    this.fileService.uploadFile(this.file)
      .subscribe(event => {
        this.progress = event;
        if (event.state === UploadState.done) {
          console.log('success', event);
        }
      });
  }

}
