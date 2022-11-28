import {Component, OnInit} from '@angular/core';
import {detailExpand, fadeDownIn, fadeUpOut} from "../../../core/utils/animations";

@Component({
    selector: 'app-tenants-list',
    templateUrl: './tenants-list.component.html',
    styleUrls: ['./tenants-list.component.scss'],
    animations: [detailExpand, fadeDownIn, fadeUpOut],
})
export class TenantsListComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

}
