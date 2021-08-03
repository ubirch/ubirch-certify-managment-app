import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class TenantTokenService {

  private urlBase = `${environment.pocManagerApi}tenant-admin/`;
  private tokenUpdateUrl = `${this.urlBase}deviceToken`;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
  ) { }

  updateToken(token: string) {
    return this.http.post(this.tokenUpdateUrl, { token }).pipe(
      catchError((err) => {
        this.errorHandler.handlerResponseError(err);
        return throwError(err);
      })
    );
  }
}
