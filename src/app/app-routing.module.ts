import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';

const routes: Routes = [
    // { path: '', loadChildren: './layout/layout.module#LayoutModule', canActivate: [AuthGuard] },
	{ path: '', redirectTo: '', pathMatch: 'prefix' },
    { path: 'login', loadChildren: './login/login.module#LoginModule' },
    { path: '', loadChildren: './home/home.module#HomeModule'},
    { path: 'register-account', loadChildren: './signup/signup.module#SignupModule' },
    { path: 'change-password', loadChildren: './change-password/change-password.module#ChangePasswordModule'},
	{ path: 'verification', loadChildren: './verification/verification.module#VerificationModule'},
	{ path: 'forgot-password', loadChildren: './forgot/forgot.module#ForgotModule'},
    { path: 'error', loadChildren: './server-error/server-error.module#ServerErrorModule' },
    { path: 'access-denied', loadChildren: './access-denied/access-denied.module#AccessDeniedModule' },
    { path: 'not-found', loadChildren: './not-found/not-found.module#NotFoundModule' },
	{ path: 'terms', loadChildren: './terms/terms.module#TermsModule'},
	{ path: 'privacy', loadChildren: './privacy/privacy.module#PrivacyModule'},
    { path: '**', redirectTo: 'not-found' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
