import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, finalize, Observable, of } from 'rxjs';

import { IListResult } from '../../models/interfaces/list-result.interface';
import { RevocationEntry } from '../../models/interfaces/revocation-entry.interface';
import { ErrorHandlerService } from '../error-handler.service';
import { RevocationService } from '../revocation.service';

export class RevocationBatchEntryDataSource
    implements DataSource<RevocationEntry>
{
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private totalItemsSubject = new BehaviorSubject<number>(0);
    private batchEntriesSubject = new BehaviorSubject<RevocationEntry[]>([]);

    public loading$ = this.loadingSubject.asObservable();
    public totalItems$ = this.totalItemsSubject.asObservable();

    get data() {
        return this.batchEntriesSubject.value;
    }

    constructor(
        private service: RevocationService,
        private error: ErrorHandlerService
    ) {}

    connect(
        collectionViewer: CollectionViewer
    ): Observable<readonly RevocationEntry[]> {
        return this.batchEntriesSubject.asObservable();
    }
    disconnect(collectionViewer: CollectionViewer): void {
        this.batchEntriesSubject.complete();
        this.loadingSubject.complete();
    }

    loadBatchEntries(batchId: string) {
        this.loadingSubject.next(true);

        this.service
            .getBatchEntries(batchId)
            .pipe(finalize(() => this.loadingSubject.next(false)))
            .subscribe({
                next: (batchEntriesResult) => {
                    this.batchEntriesSubject.next(
                        batchEntriesResult.records ?? []
                    );
                    this.totalItemsSubject.next(batchEntriesResult.total ?? 0);
                },
                error: (err: HttpErrorResponse) => {
                    this.error.handlerResponseError(err);
                    return of({} as IListResult<RevocationEntry>);
                },
            });
    }
}
