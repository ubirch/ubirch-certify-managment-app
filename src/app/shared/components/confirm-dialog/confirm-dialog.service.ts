import { Injectable } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { ConfirmDialogModel } from './confirm-dialog.model';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(
    private dialog: MatDialog,
  ) { }

  open(dialogData: Partial<ConfirmDialogModel>, okOnly = false): Observable<boolean> {
    const data = ConfirmDialogModel.create(dialogData);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '800px',
      data
    });

    return dialogRef.afterClosed();
  }
}
