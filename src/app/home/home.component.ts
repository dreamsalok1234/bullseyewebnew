import { Component, OnInit, ElementRef,  ViewContainerRef } from '@angular/core';
import { routerTransition } from '../router.animations';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { state, style, transition, animate, trigger, AUTO_STYLE } from '@angular/animations';
import { ToastrManager } from 'ng6-toastr-notifications';
declare var jQuery: any, intlTelInput: any, intlTelInputUtils: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    animations: [routerTransition()]
})
export class HomeComponent implements OnInit {

    constructor(private translate: TranslateService, vcr: ViewContainerRef, private router: Router, public toastr: ToastrManager) {
        // this.toastr.setRootViewContainerRef(vcr);
        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
        this.translate.setDefaultLang('en');
        const browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');
    }
    ngOnInit() {
    	if ((localStorage.getItem('userProfileInfo') === '' || localStorage.getItem('userProfileInfo') === null || localStorage.getItem('userProfileInfo') === undefined) && (        localStorage.getItem('userAccessToken') === '' || localStorage.getItem('userAccessToken') === null || localStorage.getItem('userAccessToken') === undefined)) 
            this.router.navigate(['/login']);
    }



}
