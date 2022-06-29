import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, finalize, Observable, of } from 'rxjs';
import { Filters } from '../../models/filters';
import { IListResult } from '../../models/interfaces/list-result.interface';
import { Revocation } from '../../models/interfaces/revocation.interface';
import { ErrorHandlerService } from '../error-handler.service';

import { RevocationService } from '../revocation.service';

export class RevocationDataSource implements DataSource<Revocation> {
    private revocationSubject = new BehaviorSubject<Revocation[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private totalItemsSubject = new BehaviorSubject<number>(0);

    public loading$ = this.loadingSubject.asObservable();
    public totalItems$ = this.totalItemsSubject.asObservable();
    revocationsArray = false;

    get data() {
        return this.revocationSubject.value;
    }

    constructor(
        private service: RevocationService,
        private error: ErrorHandlerService
    ) {}

    connect(
        collectionViewer: CollectionViewer
    ): Observable<Revocation[] | readonly Revocation[]> {
        return this.revocationSubject.asObservable();
    }
    disconnect(collectionViewer: CollectionViewer): void {
        this.revocationSubject.complete();
        this.loadingSubject.complete();
    }

    loadRevocations(filters: Filters) {
        this.loadingSubject.next(true);

        this.service
            .getRevocations(filters)
            .pipe(finalize(() => this.loadingSubject.next(false)))
            .subscribe({
                next: (revocationResult) => {
                    if (revocationResult) {
                        this.revocationsArray = true;
                        this.revocationSubject.next(
                            revocationResult.records ?? []
                        );
                        this.totalItemsSubject.next(
                            revocationResult.total ?? 0
                        );
                    }
                },
                error: (err: HttpErrorResponse) => {
                    this.error.handlerResponseError(err);
                    return of({} as IListResult<Revocation>);
                },
            });
    }
}
