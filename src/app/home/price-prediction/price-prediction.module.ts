import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PricePredictionRoutingModule } from './price-prediction-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PricePredictionComponent } from './price-prediction.component';
import { MatAutocompleteModule, MatInputModule, MatFormFieldModule } from '@angular/material';

@NgModule({
  imports: [
  FormsModule,
  ReactiveFormsModule ,
  CommonModule,
  TranslateModule,
  PricePredictionRoutingModule,
  NgbModule,
  MatAutocompleteModule,
  MatInputModule,
  MatFormFieldModule
],
declarations: [PricePredictionComponent]
})
export class PricePredictionModule { }
