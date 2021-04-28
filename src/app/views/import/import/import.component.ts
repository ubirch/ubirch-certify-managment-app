import { HttpEvent, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/core/services/file-upload.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
})
export class ImportComponent implements OnInit {

  file: File;
  progress = 0;

  constructor(private fileService: FileUploadService) { }

  ngOnInit() { }

  fileSelected(file: File) {
    this.file = file;
    setTimeout(() => { this.progress = 100; }, 5000);
  }

  uploadFile() {
    this.fileService.uploadFile(this.file).subscribe(event => {
      if (event instanceof HttpResponse) {
        console.log('success', event);
      } else {
        console.log('not done', event);
      }
    },
      error => {
        console.log('error', error);
      });
  }

}
