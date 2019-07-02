import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TermsRoutingModule } from './terms-routing.module';
import { TermsComponent } from './terms.component';


@NgModule({
    imports: [
        FormsModule,
    	ReactiveFormsModule ,
        CommonModule,
        TranslateModule,
        TermsRoutingModule],
    declarations: [TermsComponent]
})
export class TermsModule {}
