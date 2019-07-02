import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { AuthService } from '../_services/auth.service';
import { GlobalService } from '../_services/global.service';

@NgModule({
    imports: [
        FormsModule,
    	ReactiveFormsModule ,
        CommonModule,
        TranslateModule,
        LoginRoutingModule],
    declarations: [LoginComponent],
    providers: [AuthService, GlobalService]
})
export class LoginModule {}
