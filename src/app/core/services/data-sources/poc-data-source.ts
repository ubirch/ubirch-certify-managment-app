import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { IListResult } from '../../models/interfaces/list-result.interface';
import { IPoc } from '../../models/interfaces/poc.interface';
import { PocFilters } from '../../models/poc-filters';
import { ErrorHandlerService } from '../error-handler.service';
import { PocsService } from '../pocs.service';

export class PocDataSource implements DataSource<IPoc> {

    private pocSubject = new BehaviorSubject<IPoc[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private totalItemsSubject = new BehaviorSubject<number>(0);

    public loading$ = this.loadingSubject.asObservable();
    public totalItems$ = this.totalItemsSubject.asObservable();

    get data() { return this.pocSubject.value; }

    constructor(
        private service: PocsService,
        private error: ErrorHandlerService,
    ) { }

    connect(collectionViewer: CollectionViewer): Observable<IPoc[] | readonly IPoc[]> {
        return this.pocSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.pocSubject.complete();
        this.loadingSubject.complete();
    }

    loadPocs(filters: PocFilters) {
        this.loadingSubject.next(true);

        this.service.loadPocs(filters).pipe(
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(
            pocResult => {
                this.pocSubject.next(pocResult.records ?? []);
                this.totalItemsSubject.next(pocResult.total ?? 0);
            },
            (err: HttpErrorResponse) => {
                this.error.handlerResponseError(err);
                return of({} as IListResult<IPoc>);
            }
        );
    }

    deletePocs(pocs: IPoc[], filters: PocFilters) {
        this.loadingSubject.next(true);
        this.service.deletePocs(pocs).pipe(
            tap(() => this.loadPocs({ ...filters, pageIndex: 0 }))
        ).subscribe();
    }

}
