import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Ng2TelInputModule} from 'ng2-tel-input';
import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';
import { AuthService } from '../_services/auth.service';
import { GlobalService } from '../_services/global.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule ,
    CommonModule,
    TranslateModule,
    SignupRoutingModule,
  Ng2TelInputModule,
    NgbModule
  ],
  declarations: [SignupComponent],
  providers: [AuthService, GlobalService]
})
export class SignupModule { }
