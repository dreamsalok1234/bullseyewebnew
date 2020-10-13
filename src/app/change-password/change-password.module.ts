import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from './change-password.component';
import { ChangePasswordRoutingModule } from './change-password-routing.module';
import { AuthService } from '../_services/auth.service';
import { GlobalService } from '../_services/global.service';
const routes: Routes = [
    {
        path: '', component: ChangePasswordComponent
    }
];

@NgModule({
    imports: [
        ChangePasswordRoutingModule,

    ],
    declarations: [ChangePasswordComponent],
    providers: [AuthService, GlobalService]
})
export class ChangePasswordModule {
}
