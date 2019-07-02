import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangeUserPasswordComponent } from './change-user-password.component';

const routes: Routes = [
    {
        path: '', component: ChangeUserPasswordComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChangeUserPasswordRoutingModule {
}
