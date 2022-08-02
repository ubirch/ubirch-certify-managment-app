import { Component, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormGroup,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UploadState } from 'src/app/core/models/enums/upload-state.enum';
import { INotification } from 'src/app/core/models/interfaces/notification.interface';
import { IPocEmployee } from 'src/app/core/models/interfaces/poc-employee.interface';
import { IUploadStatus } from 'src/app/core/models/interfaces/upload-status.interface';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { ExportImportService } from 'src/app/core/services/export-import.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PocEmployeeService } from 'src/app/core/services/poc-employee.service';

@Component({
    selector: 'app-employees-import',
    templateUrl: './employees-import.component.html',
    styleUrls: ['./employees-import.component.scss'],
})
export class EmployeesImportComponent implements OnInit {
    file: File;
    errorFile: Blob;
    progress: IUploadStatus;
    notification: INotification;
    form: FormGroup;

    constructor(
        private fileService: ExportImportService,
        private employeeService: PocEmployeeService,
        private error: ErrorHandlerService,
        private notificationService: NotificationService,
        private formBuilder: FormBuilder,
        private translateService: TranslateService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.generateEmployeeForm();
    }

    generateEmployeeForm() {
        this.form = this.formBuilder.group({
            employees: this.formBuilder.array([this.createEmployee()]),
        });
    }

    get employees() {
        return this.form.controls['employees'] as FormArray;
    }

    createEmployee() {
        return this.formBuilder.group({
            firstName: [null, [Validators.required, Validators.minLength(2)]],
            lastName: [null, [Validators.required], Validators.minLength(2)],
            email: [
                null,
                [
                    Validators.required,
                    Validators.email,
                    Validators.pattern(
                        '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
                    ),
                ],
            ],
        });
    }

    addEmployee() {
        this.employees.push(this.createEmployee());
    }

    removeEmployee(empIndex: number) {
        if (this.employees.length > 1) this.employees.removeAt(empIndex);
    }

    fileSelected(file: File) {
        this.file = file;
        this.progress = null;
        if (this.file) {
            this.notification = null;
            this.errorFile = null;
        }
    }

    uploadForm() {
        console.log(this.employees.value);
        const employee: IPocEmployee[] = this.employees.value;
        this.employeeService.importForm(employee).subscribe({
            next: (_) => {
                this.notificationService.success({
                    message: this.translateService.instant(
                        'employeeEdit.notifications.success'
                    ),
                    title: this.translateService.instant(
                        'employeeEdit.notifications.successTitle'
                    ),
                });
                this.router.navigate(['views/', 'poc-employees']);
            },
            error: (err) => this.error.handlerResponseError(err),
        });
    }

    uploadFile() {
        this.employeeService.importFile(this.file).subscribe({
            next: (event) => {
                this.progress = event;
                if (event.state === UploadState.done) {
                    if (
                        event.result &&
                        event.result instanceof Blob &&
                        event.result.size > 0
                    ) {
                        this.errorFile = event.result;
                        this.notification = this.notificationService.warning({
                            title: 'employeesImport.notifications.partialTitle',
                            message: 'employeesImport.notifications.partial',
                        });
                    } else {
                        this.notification = this.notificationService.success({
                            message: 'employeesImport.notifications.success',
                        });
                    }
                }
            },
            error: (err) => {
                this.progress = null;
                this.notification = this.error.handlerResponseError(err);
            },
        });
    }

    downloadResult() {
        this.fileService.triggerDownload(
            this.errorFile,
            'processing_errors.csv'
        );
    }
}
