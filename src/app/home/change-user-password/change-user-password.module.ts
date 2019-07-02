import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangeUserPasswordRoutingModule } from './change-user-password-routing.module';
import { ChangeUserPasswordComponent } from './change-user-password.component';

@NgModule({
	imports: [
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		TranslateModule,
		ChangeUserPasswordRoutingModule
	],
	declarations: [ChangeUserPasswordComponent]
})
export class ChangeUserPasswordModule { }
