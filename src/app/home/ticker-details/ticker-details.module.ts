import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TickerDetailsRoutingModule } from './ticker-details-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { TickerDetailsComponent } from './ticker-details.component';

@NgModule({
    imports: [
		FormsModule,
		ReactiveFormsModule ,
		CommonModule,
		TranslateModule,
		TickerDetailsRoutingModule,
		NgbModule
	],
    declarations: []
})
export class TickerDetailsModule {}
