import { HttpClient, HttpEvent, HttpEventType, HttpProgressEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';
import { UploadState } from '../models/enums/upload-state.enum';
import { IUploadStatus } from '../models/interfaces/upload-status';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExportImportService {

  baseUrl = environment.pocManagerApi;
  uploadUrl = `${this.baseUrl}pocs/create`;
  downloadUrl = `${this.baseUrl}devices`;

  constructor(private http: HttpClient) { }

  uploadFile(file: File): Observable<IUploadStatus> {
    const config = new HttpRequest('POST', this.uploadUrl, file, {
      reportProgress: true,
      responseType: 'blob'
    });

    return this.http.request(config).pipe(
      scan((acc, resp) => {
        if (isHttpProgressEvent(resp)) {
          return {
            progress: resp.total ? Math.round((100 * resp.loaded) / resp.total) : acc.progress,
            state: UploadState.inPorgress,
          } as IUploadStatus;
        } else if (isHttpResponse(resp)) {
          return {
            progress: 100,
            state: UploadState.done,
            result: resp.body
          } as IUploadStatus;
        }
        return acc;
      },
        { state: UploadState.pending, progress: 0, result: null })
    );
  }

  exportPocs() {
    return this.http.get(this.downloadUrl, { responseType: 'blob' });
  }

  triggerDownload(blob) {
    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = 'POCS_' + (new Date()).toISOString() + '.csv';
    a.click();
    URL.revokeObjectURL(objectUrl);
  }
}

export function isHttpResponse<T>(event: HttpEvent<T>): event is HttpResponse<T> {
  return event.type === HttpEventType.Response;
}

export function isHttpProgressEvent(
  event: HttpEvent<unknown>
): event is HttpProgressEvent {
  return (
    event.type === HttpEventType.DownloadProgress ||
    event.type === HttpEventType.UploadProgress
  );
}
