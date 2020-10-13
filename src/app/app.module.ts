import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToastrModule } from 'ng6-toastr-notifications';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import { GlobalService } from './_services/global.service';
import { CommonService } from './_services/common.service';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MatDialogModule } from '@angular/material/dialog';
import { ProdialogComponent } from './home/prodialog/prodialog.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
// AoT requires an exported function for factories
export const createTranslateLoader = (http: HttpClient) => {
    /* for development
    return new TranslateHttpLoader(
        http,
        '/start-angular/SB-Admin-BS4-Angular-6/master/dist/assets/i18n/',
        '.json'
    ); */
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        HttpModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ToastrModule.forRoot(),
		LoadingBarModule,
        LoadingBarRouterModule,
        MatDialogModule,
        NgbModalModule.forRoot(),
        NgCircleProgressModule.forRoot({}),

        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        AppRoutingModule,
    ],
    declarations: [AppComponent, ProdialogComponent],
    providers: [AuthGuard, GlobalService, CommonService],
    bootstrap: [AppComponent],
    entryComponents: [ProdialogComponent]
})
export class AppModule {}
