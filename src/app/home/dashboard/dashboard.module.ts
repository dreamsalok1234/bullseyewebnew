import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
	    FormsModule,
		ReactiveFormsModule ,
        CommonModule,
		TranslateModule,
        NgbModule,
        NgbCarouselModule,
        NgbAlertModule,
        DashboardRoutingModule
    ],
    declarations: [
        DashboardComponent
    ],
	providers: []
})
export class DashboardModule {}
