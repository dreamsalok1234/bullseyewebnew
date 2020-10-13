import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PortfolioDetailsRoutingModule } from './portfolio-details-routing.module';
// import { PortfolioDetailsComponent } from './portfolio-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
    imports: [
		FormsModule,
		ReactiveFormsModule ,
		CommonModule,
		TranslateModule,
		PortfolioDetailsRoutingModule,
		NgbModule
	],
    declarations: []
})
export class PortfolioDetailsModule {}
