import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerificationRoutingModule } from './verification-routing.module';
import { VerificationComponent } from './verification.component';
import { AuthService } from '../_services/auth.service';
import { GlobalService } from '../_services/global.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    VerificationRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [VerificationComponent],
  providers: [AuthService]
})
export class VerificationModule { }
