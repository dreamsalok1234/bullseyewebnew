import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrivacyRoutingModule } from './privacy-routing.module';
import { PrivacyComponent } from './privacy.component';

@NgModule({
    imports: [
        FormsModule,
    	ReactiveFormsModule ,
        CommonModule,
        TranslateModule,
        PrivacyRoutingModule],
    declarations: [PrivacyComponent]
})
export class PrivacyModule {}
