import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrivacyPolicyRoutingModule } from './privacy-policy-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PrivacyPolicyComponent } from './privacy-policy.component';

@NgModule({
    imports: [
		FormsModule,
		ReactiveFormsModule ,
		CommonModule,
		TranslateModule,
		PrivacyPolicyRoutingModule,
		NgbModule
	],
	declarations: [PrivacyPolicyComponent]
})
export class PrivacyPolicyModule {}
