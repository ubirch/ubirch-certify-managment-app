import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.scss'],
})
export class ViewsComponent implements OnInit {

  showNav = true;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    if (this.authService.isPocAdmin()) { this.showNav = false; }
  }

}
