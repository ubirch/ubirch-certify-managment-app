import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements AfterViewInit {
  file: File;
  accept = '.csv';
  draggedOver = false;

  @ViewChild('input') input: ElementRef;
  @ViewChild('drop') drop: ElementRef;

  // tslint:disable-next-line:variable-name
  private _progress = 0;
  get progress() { return this._progress; }
  @Input() set progress(value) {
    this._progress = value;
    if (this._progress >= 100) { this.resetUpload(); }
  }

  @Output() fileSelected = new EventEmitter<File>();

  fileDropped$: Observable<any>;

  get fileSize(): number { return this.file?.size; }
  get fileName(): string { return this.file?.name ?? 'import.filePlaceholder'; }

  constructor() { }

  ngAfterViewInit(): void {
    merge(
      fromEvent(this.drop.nativeElement, 'dragover'),
      fromEvent(this.drop.nativeElement, 'dragenter').pipe(
        tap(() => this.draggedOver = true)
      ),
      fromEvent(this.drop.nativeElement, 'dragleave').pipe(
        tap(() => this.draggedOver = false)
      ),
      fromEvent(this.drop.nativeElement, 'drop').pipe(
        tap((event: DragEvent) => {
          const filesList = event.dataTransfer?.files;
          for (let i = 0; i < filesList?.length ?? 0; i++) {
            const file = filesList.item(i);
            if (file.type === 'text/csv') {
              this.file = file;
              this.fileChnaged();
              this.draggedOver = false;
              return;
            }
          }
        })
      ),
    ).subscribe(
      (event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
      });

  }

  triggerrFileSelect() {
    this.input.nativeElement.click();
  }

  selected(event) {
    this.file = event?.target?.files?.[0];
    this.fileChnaged();
  }

  fileDropped(event) {
    event.preventDefault();
  }

  private fileChnaged() {
    console.log('changed');
    this.fileSelected.emit(this.file);
    this.progress = 0;
  }

  private resetUpload() {
    this.file = undefined;
    this.fileChnaged();
    this.input.nativeElement.value = '';
  }



}
