import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { PortfolioHistoryRoutingModule } from './portfolio-history-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PortfolioHistoryComponent } from './portfolio-history.component';

@NgModule({
    imports: [
	    FormsModule,
		ReactiveFormsModule ,
        CommonModule,
		TranslateModule,
        NgbCarouselModule,
        NgbAlertModule,
		NgbModule,
        PortfolioHistoryRoutingModule
    ],
    declarations: [
        PortfolioHistoryComponent
    ],
	providers: []
})
export class PortfolioHistoryModule {}
