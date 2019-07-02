import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountSettingsRoutingModule } from './account-settings-routing.module';
import { AccountSettingsComponent } from './account-settings.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2TelInputModule } from 'ng2-tel-input';
// Import ng-circle-progress
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TranslateModule,
    NgbModule,
    AccountSettingsRoutingModule,
    Ng2TelInputModule,
    // Specify ng-circle-progress as an import
    // Specify ng-circle-progress as an import
	/* NgCircleProgressModule.forRoot({
	  "backgroundColor": "#F1F1F1",
	  "backgroundPadding": -18,
	  "innerStrokeWidth": 1,
	  "startFromZero": false,

	  "maxPercent": 100,
      "backgroundOpacity": 0,
	  "radius": 60,
      "space": -3.5,
	  "outerStrokeGradient": true,
      "outerStrokeWidth": 3.5,
      "outerStrokeColor": '#ff6000',
      "outerStrokeGradientStopColor": '#ff6000',
      "outerStrokeLinecap": 'square',
      "innerStrokeColor": '#ffcaaa',
	  "innerStrokeWidth": 3.5,
      "titleFontSize": '30',
      "titleColor": '#00b050',
      "subtitleFontSize": '18',



	}) */
    NgCircleProgressModule.forRoot({
      // set defaults here
      maxPercent: 100,
      backgroundOpacity: 0,
      radius: 60,
      space: -3.5,
      outerStrokeGradient: false,
      outerStrokeWidth: 3.5,
      outerStrokeColor: '#ff6000',
      outerStrokeGradientStopColor: '#ff6000',
      outerStrokeLinecap: 'square',
      innerStrokeColor: '#ffcaaa',
      innerStrokeWidth: 3.5,
      titleFontSize: '30',
      titleColor: '#00b050',
      subtitleFontSize: '18',
      subtitleColor: '#000',
      animateTitle: true,
      animationDuration: 5000,
      showUnits: false,
      responsive: true,
      clockwise: true,
    })
  ],
  declarations: [AccountSettingsComponent]
})
export class AccountSettingsModule {}
