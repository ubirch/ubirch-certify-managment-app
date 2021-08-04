import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { from, Observable } from 'rxjs';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss'],
})
export class PersonalDetailsComponent implements OnInit {

  profile: Observable<KeycloakProfile>;

  constructor(
    private keycloakService: KeycloakService
  ) { }

  ngOnInit() {
    this.profile = from(this.keycloakService.loadUserProfile());
  }

}
