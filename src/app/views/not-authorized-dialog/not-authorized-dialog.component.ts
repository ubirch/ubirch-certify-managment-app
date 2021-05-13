import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-not-authorized-dialog',
  templateUrl: './not-authorized-dialog.component.html',
  styleUrls: ['./not-authorized-dialog.component.scss'],
})
export class NotAuthorizedDialogComponent {
  constructor(private keycloak: KeycloakService) { }

  logout() {
    this.keycloak.logout();
  }
}
