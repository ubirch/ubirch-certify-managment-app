import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, finalize, Observable, of } from 'rxjs';
import { Filters } from '../../models/filters';
import { AllRevocations } from '../../models/interfaces/all-revocations.interface';
import { IListResult } from '../../models/interfaces/list-result.interface';
import { ErrorHandlerService } from '../error-handler.service';

import { RevocationService } from '../revocation.service';

export class AllRevocationsDatasource implements DataSource<AllRevocations> {
    private allRevocationsSubject = new BehaviorSubject<AllRevocations[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private totalItemsSubject = new BehaviorSubject<number>(0);

    public loading$ = this.loadingSubject.asObservable();
    public totalItems$ = this.totalItemsSubject.asObservable();
    allRevocationsArray = false;

    get data() {
        return this.allRevocationsSubject.value;
    }

    constructor(
        private service: RevocationService,
        private error: ErrorHandlerService
    ) {}

    connect(
        collectionViewer: CollectionViewer
    ): Observable<AllRevocations[] | readonly AllRevocations[]> {
        return this.allRevocationsSubject.asObservable();
    }
    disconnect(collectionViewer: CollectionViewer): void {
        this.allRevocationsSubject.complete();
        this.loadingSubject.complete();
    }

    loadAllRevocations(filters: Filters) {
        this.loadingSubject.next(true);

        this.service
            .getAllRevocations(filters)
            .pipe(finalize(() => this.loadingSubject.next(false)))
            .subscribe({
                next: (revocationResult) => {
                    revocationResult ? this.allRevocationsArray = true : this.allRevocationsArray = false
                    this.allRevocationsSubject.next(
                        revocationResult ? revocationResult.records : []
                    );
                    this.totalItemsSubject.next(
                        revocationResult ? revocationResult.total : 0
                    );
                },
                error: (err: HttpErrorResponse) => {
                    this.error.handlerResponseError(err);
                    return of({} as IListResult<AllRevocations>);
                },
            });
    }
}
