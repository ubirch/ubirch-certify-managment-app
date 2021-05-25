import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { IPocState } from 'src/app/core/models/interfaces/poc-state.interface';
import { IPoc } from 'src/app/core/models/interfaces/poc.interface';
import { PocsService } from 'src/app/core/services/pocs.service';
import { fadeDownIn } from 'src/app/core/utils/animations';

@Component({
  selector: 'app-poc-details',
  templateUrl: './poc-details.component.html',
  styleUrls: ['./poc-details.component.scss'],
  animations: [fadeDownIn],
})
export class PocDetailsComponent {

  pocState: Observable<IPocState>;

  @Input() poc: IPoc;
  @Input() set current(value: boolean) {
    if (value) { this.pocState = this.pocsService.getPocStatus(this.poc.id); }
    else { this.pocState = null; }
  }

  constructor(private pocsService: PocsService) { }

  icon(value: boolean) {
    if (value === true) { return 'check_circle'; }
    if (value === false) { return 'cancel'; }
    return '';
  }


}
