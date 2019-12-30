import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
	profileInfo: any;
	getFullYear: number = ''; // new Date().getFullYear();
	constructor(private translate: TranslateService, public router: Router) {
		/* Check Token */
		if ((localStorage.getItem('userProfileInfo') === '' || localStorage.getItem('userProfileInfo') === undefined || localStorage.getItem('userProfileInfo') === null) && (localStorage.getItem('userAccessToken') === '' || localStorage.getItem('userAccessToken') === undefined || localStorage.getItem('userAccessToken') === null)) {
			this.router.navigate(['/login']);
		}

		this.profileInfo = JSON.parse(localStorage.getItem('userProfileInfo'));
		/* Set Language Translator */
		this.translate.addLangs(['en', 'ko', 'hi', 'zh', 'es', 'ja']);
		this.translate.setDefaultLang('en');
		const browserLang = (this.profileInfo.defaultLanguage !== undefined && this.profileInfo.defaultLanguage !== '' && this.profileInfo.defaultLanguage != null) ? this.profileInfo.defaultLanguage : 'en';
		this.translate.use(browserLang.match(/en|ko|hi|zh|es|ja/) ? browserLang : 'en');
	}

	ngOnInit() {

	}
}
