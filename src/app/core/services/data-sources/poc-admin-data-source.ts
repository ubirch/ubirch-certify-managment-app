import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, finalize } from 'rxjs/operators';
import { ADMINS_MOCK } from '../../mocks/admins.mock';
import { Filters } from '../../models/filters';
import { IListResult } from '../../models/interfaces/list-result.interface';
import { IPocAdmin } from '../../models/interfaces/poc-admin.interface';
import { ErrorHandlerService } from '../error-handler.service';
import { PocAdminService } from '../poc-admin.service';

export class PocAdminDataSource implements DataSource<IPocAdmin> {
    private adminSubject = new BehaviorSubject<IPocAdmin[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private totalItemsSubject = new BehaviorSubject<number>(0);

    public loading$ = this.loadingSubject.asObservable();
    public totalItems$ = this.totalItemsSubject.asObservable();

    get data() { return this.adminSubject.value; }

    constructor(
        private service: PocAdminService,
        private error: ErrorHandlerService,
    ) { }

    connect(collectionViewer: CollectionViewer): Observable<IPocAdmin[] | readonly IPocAdmin[]> {
        return this.adminSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.adminSubject.complete();
        this.loadingSubject.complete();
    }

    loadAdmins(filters: Filters) {
        this.loadingSubject.next(true);

        // this.service.getAdmins(filters).pipe(
        of(ADMINS_MOCK).pipe(
            delay(1000),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(
            adminsResult => {
                this.adminSubject.next(adminsResult.records ?? []);
                this.totalItemsSubject.next(adminsResult.total ?? 0);
            },
            (err: HttpErrorResponse) => {
                this.error.handlerResponseError(err);
                return of({} as IListResult<IPocAdmin>);
            }
        );
    }
}
