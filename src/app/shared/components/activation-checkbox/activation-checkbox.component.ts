import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatLegacyCheckboxChange as MatCheckboxChange } from '@angular/material/legacy-checkbox';
import { PocActivationState } from '../../../core/models/enums/poc-activation-state.enum';

@Component({
  selector: 'app-activation-checkbox',
  templateUrl: './activation-checkbox.component.html',
  styleUrls: ['./activation-checkbox.component.scss'],
})
export class ActivationCheckboxComponent implements OnInit {
    public disabled = true;
    public checked = true;

    @Input() set activeState(activeState: PocActivationState) {
        this.disabled = this.getPocActivationChangeDisabled(activeState);
        this.checked = this.getPocIsActive(activeState);
    }
    @Input() label: string;

    @Output() activeChanged = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {}

    public changeState($event: MatCheckboxChange) {
        this.activeChanged.emit($event.checked);
    }

    private getPocIsActive(activeState: PocActivationState) {
        return !!activeState && activeState === PocActivationState.activated;
    }

    private getPocActivationChangeDisabled(activeState: PocActivationState) {
        return !activeState || (activeState !== PocActivationState.activated && activeState !== PocActivationState.deactivated);
    }
}
