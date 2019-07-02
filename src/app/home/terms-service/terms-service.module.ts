import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TermsServiceRoutingModule } from './terms-service-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TermsServiceComponent } from './terms-service.component';

@NgModule({
    imports: [
		FormsModule,
		ReactiveFormsModule ,
		CommonModule,
		TranslateModule,
		TermsServiceRoutingModule,
		NgbModule
	],
	declarations: [TermsServiceComponent]
})
export class TermsServiceModule {}
