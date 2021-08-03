import { NgIf } from '@angular/common';
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { ROLE } from 'src/app/core/models/roles';
import { AuthService } from 'src/app/core/services/auth.service';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[userInRole]'
})
export class UserInRoleDirective extends NgIf {

  @Input() set userInRole(roles: ROLE | ROLE[]) {
    this.ngIf = this.authService.hasAnyRole(roles);
  }

  @Input() set userInRoleElse(templateElse: TemplateRef<any>) {
    this.ngIfElse = templateElse;
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private authService: AuthService,
  ) {
    super(viewContainerRef, templateRef);
  }

}
