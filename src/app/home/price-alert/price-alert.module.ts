import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PriceAlertRoutingModule } from './price-alert-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PriceAlertComponent } from './price-alert.component';
import { MatAutocompleteModule, MatInputModule, MatFormFieldModule } from '@angular/material';

@NgModule({
    imports: [
		FormsModule,
		ReactiveFormsModule ,
		CommonModule,
		TranslateModule,
		PriceAlertRoutingModule,
		NgbModule,
		MatAutocompleteModule,
		MatInputModule,
		MatFormFieldModule
	],
	declarations: [PriceAlertComponent]
})
export class PriceAlertModule {}
