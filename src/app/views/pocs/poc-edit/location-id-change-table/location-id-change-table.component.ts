import {Component, Input, OnInit} from '@angular/core';
import {ILocationIdChange} from "../../../../core/models/interfaces/locationIdChange.interface";
import {LocationIdChangesStates} from "../../../../core/models/enums/location-id-changes-states.enum";
import {LocaleService} from "../../../../core/services/locale.service";
import {ILocale} from "../../../../core/models/interfaces/locale.interface";

@Component({
    selector: 'app-location-id-change-table',
    templateUrl: './location-id-change-table.component.html',
    styleUrls: ['./location-id-change-table.component.scss'],
})
export class LocationIdChangeTableComponent implements OnInit {

    @Input() pocLocationChanges: ILocationIdChange[];
    locale: ILocale;

    displayColumns: string[] = [
        'LocationID',
        'Status',
        'Timestamp',
        'DeleteTimestamp',
    ];

    constructor(
        private localService: LocaleService,
    ) {
    }

    ngOnInit() {
        this.localService.current$.subscribe(locale => this.locale = locale);
    }

    getRowClass(row: ILocationIdChange) {
        switch (row.status) {
            case LocationIdChangesStates.pending:
                return 'pending';
            case LocationIdChangesStates.completed:
                return 'completed';
            case LocationIdChangesStates.aborted:
                return 'aborted';
        }
    }

}
