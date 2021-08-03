import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth.service';
import { TokenUpdateComponent } from '../../token-update/token-update.component';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit() { }

  showTokenDialog(event: MouseEvent) {
    this.dialog.open(TokenUpdateComponent);
  }

}
