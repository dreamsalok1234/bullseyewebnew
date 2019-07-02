import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    public pushRightClass: string;
    isNavbarCollapsed = true;
	profileInfo : any;
    constructor(private translate: TranslateService, public router: Router, private loadingBar: LoadingBarService) {
         /* Check Token */
		if ((localStorage.getItem('userProfileInfo') === '' || localStorage.getItem('userProfileInfo') === undefined || localStorage.getItem('userProfileInfo') === null) && (localStorage.getItem('userAccessToken') === '' || localStorage.getItem('userAccessToken') === undefined || localStorage.getItem('userAccessToken') === null) && (localStorage.getItem('loginUserName') === '' || localStorage.getItem('loginUserName') === undefined || localStorage.getItem('loginUserName') === null)) 
			this.router.navigate(['/login']);
		
		this.profileInfo = JSON.parse(localStorage.getItem('userProfileInfo'));
		
		 /* Set Language Translator */
		this.translate.addLangs(['en', 'ko', 'hi', 'zh', 'es', 'ja']);
		this.translate.setDefaultLang('en');
		const browserLang = (this.profileInfo.defaultLanguage!=undefined && this.profileInfo.defaultLanguage!='' && this.profileInfo.defaultLanguage!=null)?this.profileInfo.defaultLanguage:'en';
		this.translate.use(browserLang.match(/en|ko|hi|zh|es|ja/) ? browserLang : 'en');

        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() {

    }
    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }
	logout() {
		this.loadingBar.start();
		setTimeout(() => {
			localStorage.clear();
			this.loadingBar.stop();
			this.router.navigateByUrl('login');
		}, 1000);

    }
	gotoHomePage(){
		if((localStorage.getItem('loginUserName') != '' && localStorage.getItem('loginUserName') != undefined && localStorage.getItem('loginUserName') != null))
			this.router.navigate(['/home/'+localStorage.getItem('loginUserName')]);
			
	}
	RedirectToPage(href){
		if(this.profileInfo.isProAccount){
			localStorage.setItem("proActive","");
			this.router.navigate([href]);
		}
		else{
			localStorage.setItem("proActive","false");
			this.router.navigateByUrl('/check-pro', {skipLocationChange: true}).then(()=>
			this.router.navigate(['/account-settings']));
			
		}
	}

}
