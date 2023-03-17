import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HeaderComponent} from '../views/layout/header/header.component';
import {FooterComponent} from '../views/layout/footer/footer.component';

// MATERIAL
import {ClipboardModule} from '@angular/cdk/clipboard';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import {MatLegacyChipsModule as MatChipsModule} from '@angular/material/legacy-chips';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacyListModule as MatListModule} from '@angular/material/legacy-list';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {MatNativeDateModule} from '@angular/material/core';
import {MatLegacyPaginatorModule as MatPaginatorModule} from '@angular/material/legacy-paginator';
import {MatLegacyProgressBarModule as MatProgressBarModule} from '@angular/material/legacy-progress-bar';
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from '@angular/material/legacy-progress-spinner';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatLegacySnackBarModule as MatSnackBarModule} from '@angular/material/legacy-snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table';
import {MatLegacyTabsModule as MatTabsModule} from '@angular/material/legacy-tabs';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';

import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {HttpClientModule} from '@angular/common/http';
import {ActivationCheckboxComponent} from './components/activation-checkbox/activation-checkbox.component';
import {LanguageSelectComponent} from './components/language-select/language-select.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ConfirmDialogComponent} from './components/confirm-dialog/confirm-dialog.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FileUploadComponent} from './components/file-upload/file-upload.component';
import {FileSizePipe} from './pipes/file-size.pipe';
import {NotificationComponent} from './components/notification/notification.component';
import {NotificationInlineComponent} from './components/notification-inline/notification-inline.component';
import {MatDatepickerComponent} from './components/mat-datepicker/mat-datepicker.component';
import {NgxMaskModule} from 'ngx-mask';
import {UserInRoleDirective} from './directives/user-in-role.directive';
import {BrowserCheckComponent, BrowserCheckDialog} from './components/browser-check/browser-check.component';


const COMPONENTS = [
  HeaderComponent,
  FooterComponent,
  LanguageSelectComponent,
  ConfirmDialogComponent,
  FileUploadComponent,
  NotificationComponent,
  NotificationInlineComponent,
  FileSizePipe,
  MatDatepickerComponent,
  BrowserCheckComponent,
  BrowserCheckDialog
];

const ANGULAR_EXPORT_MODULES = [
  CommonModule,
  HttpClientModule,
  ReactiveFormsModule,
  FormsModule,
];

const LIB_EXPORT_MODULES = [
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatCheckboxModule,
  MatSelectModule,
  MatButtonModule,
  MatDialogModule,
  MatCardModule,
  MatSnackBarModule,
  MatDividerModule,
  MatSidenavModule,
  ClipboardModule,
  MatChipsModule,
  MatTabsModule,
  FlexLayoutModule,
  TranslateModule,
  MatDatepickerModule,
  MatTooltipModule
];

@NgModule({
    declarations: [
        COMPONENTS,
        UserInRoleDirective,
        ActivationCheckboxComponent,
    ],
  imports: [
    ANGULAR_EXPORT_MODULES,
    LIB_EXPORT_MODULES,
    RouterModule,
    TranslateModule,


    // A11yModule,
    // CdkStepperModule,
    // CdkTableModule,
    // CdkTreeModule,
    // DragDropModule,
    // MatAutocompleteModule,
    // MatBadgeModule,
    // MatBottomSheetModule,
    // MatButtonToggleModule,
    // MatStepperModule,
    // MatExpansionModule,
    // MatGridListModule,
    // MatRadioModule,
    // MatRippleModule,
    // MatSliderModule,
    // MatSlideToggleModule,
    // MatTabsModule,
    // MatToolbarModule,
    // MatTooltipModule,
    // MatTreeModule,
    // OverlayModule,
    // PortalModule,
    // ScrollingModule,

    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaskModule,
  ],
    exports: [
        ANGULAR_EXPORT_MODULES,
        LIB_EXPORT_MODULES,
        COMPONENTS,
        ActivationCheckboxComponent,
    ],
})
export class SharedModule { }
