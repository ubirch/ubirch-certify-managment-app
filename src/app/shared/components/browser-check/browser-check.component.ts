import { Component, Inject, OnInit } from '@angular/core';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { detect } from 'detect-browser';
import * as supportedBrowsers from 'src/supportedBrowsers';

export interface DialogData {
    browserName: string;
    version: string;
}

@Component({
    selector: 'ubirch-browser-check',
    templateUrl: './browser-check.component.html',
    styleUrls: ['./browser-check.component.scss'],
})
export class BrowserCheckComponent implements OnInit {
    browserSupported = '';
    browserName: string | null | undefined;
    version: string | null | undefined;
    displayBasic = false;

    constructor(public dialog: MatDialog) {}

    ngOnInit(): void {
        this.browserSupported = supportedBrowsers.test(navigator.userAgent)
            ? ''
            : 'not';
        if (this.browserSupported === 'not') {
            this.browserName = detect()?.name;
            this.version = detect()?.version;
            const dialogRef = this.dialog.open(BrowserCheckDialog, {
                width: '35%',
                data: { browserName: this.browserName, version: this.version },
            });

            dialogRef.afterClosed().subscribe((result) => {
                console.log('The dialog was closed');
            });
        }
    }
}

@Component({
    selector: 'browser-check-dialog',
    templateUrl: './browser-check-dialog.html',
})
export class BrowserCheckDialog {
    constructor(
        public dialogRef: MatDialogRef<BrowserCheckDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

    onOkClick(): void {
        this.dialogRef.close();
    }
}
