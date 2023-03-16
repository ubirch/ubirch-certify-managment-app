import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HeaderComponent} from '../views/layout/header/header.component';
import {FooterComponent} from '../views/layout/footer/footer.component';

// MATERIAL
import {ClipboardModule} from '@angular/cdk/clipboard';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatNativeDateModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';

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
