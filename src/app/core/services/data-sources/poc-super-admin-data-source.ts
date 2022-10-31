import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Filters } from '../../models/filters';
import { IListResult } from '../../models/interfaces/list-result.interface';
import { IPocSuperAdmin } from '../../models/interfaces/poc-super-admin.interface';
import { ErrorHandlerService } from '../error-handler.service';
import { PocSuperAdminService } from '../poc-super-admin.service';
 
export class PocSuperAdminDataSource implements DataSource<IPocSuperAdmin> {
    private pocSubject = new BehaviorSubject<IPocSuperAdmin[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private totalItemsSubject = new BehaviorSubject<number>(0);

    public loading$ = this.loadingSubject.asObservable();
    public totalItems$ = this.totalItemsSubject.asObservable();

    get data() {
        return this.pocSubject.value;
    }

    constructor(
        private service: PocSuperAdminService,
        private error: ErrorHandlerService
    ) {}

    connect(
        collectionViewer: CollectionViewer
    ): Observable<IPocSuperAdmin[] | readonly IPocSuperAdmin[]> {
        return this.pocSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.pocSubject.complete();
        this.loadingSubject.complete();
    }

    loadPocs(filters: Filters) {
        this.loadingSubject.next(true);

        this.service
            .getAllPocs(filters)
            .pipe(finalize(() => this.loadingSubject.next(false)))
            .subscribe({
                next: (pocsResult) => {
                    this.pocSubject.next(pocsResult.records ?? []);
                    this.totalItemsSubject.next(pocsResult.total ?? 0);
                },
                error: (err: HttpErrorResponse) => {
                    this.error.handlerResponseError(err);
                    return of({} as IListResult<IPocSuperAdmin>);
                },
            });
    }
}
