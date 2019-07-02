import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EnquiryRoutingModule } from './enquiry-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EnquiryComponent } from './enquiry.component';

@NgModule({
    imports: [
		FormsModule,
		ReactiveFormsModule ,
		CommonModule,
		TranslateModule,
		EnquiryRoutingModule,
		NgbModule
	],
	declarations: [EnquiryComponent]
})
export class EnquiryModule {}
