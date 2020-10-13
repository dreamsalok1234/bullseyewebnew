import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BullseyeProRoutingModule } from './bullseye-pro-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BullseyeProComponent } from './bullseye-pro.component';

@NgModule({
    imports: [
		FormsModule,
		ReactiveFormsModule ,
		CommonModule,
		TranslateModule,
		BullseyeProRoutingModule,
		NgbModule
	],
	declarations: [BullseyeProComponent]
})
export class BullseyeProModule {}
