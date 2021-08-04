import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class RolesComponent implements OnInit {

  constructor(
    public keycloakService: KeycloakService
  ) { }

  ngOnInit() {
    this.keycloakService.getUserRoles();
  }

}
