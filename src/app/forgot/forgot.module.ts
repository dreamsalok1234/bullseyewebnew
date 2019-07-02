import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Ng2TelInputModule} from 'ng2-tel-input';
import { ForgotRoutingModule } from './forgot-routing.module';
import { ForgotComponent } from './forgot.component';
import { AuthService } from '../_services/auth.service';
import { GlobalService } from '../_services/global.service';

@NgModule({
  imports: [
  	FormsModule,
    ReactiveFormsModule ,
    CommonModule,
    TranslateModule,
    ForgotRoutingModule,
	Ng2TelInputModule
  ],
  declarations: [ForgotComponent],
  providers: [AuthService, GlobalService]
})
export class ForgotModule {  }
