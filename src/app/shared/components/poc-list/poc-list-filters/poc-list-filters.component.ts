import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PocStatus, PocStatusTranslation } from 'src/app/core/models/enums/poc-status.enum';

@Component({
  selector: 'app-poc-list-filters',
  templateUrl: './poc-list-filters.component.html',
  styleUrls: ['./poc-list-filters.component.scss'],
})
export class PocListFiltersComponent {

  @Input() filters: FormGroup;
  @Input() exportDisabled = false;
  @Output() exportClicked = new EventEmitter();


  statuses: string[] = [PocStatus.completed, PocStatus.pending, PocStatus.processing];
  PocStatusTranslation = PocStatusTranslation;

  downloadCSV() {
    this.exportClicked.next(true);
  }

}
