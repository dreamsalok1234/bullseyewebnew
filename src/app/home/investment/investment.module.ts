import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvestmentRoutingModule } from './investment-routing.module';
import { InvestmentComponent } from './investment.component';
import { MatAutocompleteModule, MatInputModule,MatFormFieldModule } from '@angular/material';
@NgModule({
    imports: [
		FormsModule,
		ReactiveFormsModule ,
		CommonModule,
		TranslateModule, 
		InvestmentRoutingModule,
		MatAutocompleteModule,
		MatInputModule,
		MatFormFieldModule
	],
    declarations: [InvestmentComponent]
})
export class InvestmentModule {}
