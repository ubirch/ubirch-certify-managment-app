import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { NEVER, throwError } from 'rxjs';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { NotAuthorizedDialogComponent } from 'src/app/views/not-authorized-dialog/not-authorized-dialog.component';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SessionEndedInterceptor implements HttpInterceptor {

    constructor(
        private dialog: MatDialog,
    ) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler,
    ) {
        return next.handle(req).pipe(
            catchError((err: any) => {
                if (req.url.includes(environment.pocManagerApi) && err instanceof HttpErrorResponse && err.status === 401) {
                    this.dialog.open(NotAuthorizedDialogComponent, { maxWidth: '800px', disableClose: true, closeOnNavigation: false });
                    return NEVER;
                }
                else { return throwError(err); }
            })
        );
    }
}

export const sessionEndedInterceptorProvider = { provide: HTTP_INTERCEPTORS, useClass: SessionEndedInterceptor, multi: true };
