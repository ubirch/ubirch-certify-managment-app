import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http: HttpClient) { }

  postUrl = 'http://localhost:4000';

  uploadFile(file: File) {
    const myFormData: FormData = new FormData();
    myFormData.append('file', file, file.name);

    const config = new HttpRequest('POST', this.postUrl, myFormData, {
      reportProgress: true
    });

    return this.http.request(config);
  }
}
