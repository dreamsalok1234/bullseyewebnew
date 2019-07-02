import { Component, OnInit, ElementRef,  ViewContainerRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Router, ActivatedRoute } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../_services/common.service';
import { PortfolioService } from '../../_services/portfolio.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Title, Meta } from '@angular/platform-browser';
@Component({
    selector: 'app-portfolio',
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.scss'],
    animations: [routerTransition()]
})
export class PortfolioComponent implements OnInit {
	showBtnText:string;
	portfolioForm: FormGroup;
	submitted = false;
	currencyList = [];
	loading = false;
	profileInfo: any;
	defaulterrSomethingMsg='Something went wrong';
	stockText="Stocks";
    cryptoText="Cryptocurrency";
	title='BullsEye Investors | Portfolio';
	disabledCurrency = true;
    constructor(private translate: TranslateService,private commonService: CommonService,private portfolioService:PortfolioService,private _fb: FormBuilder,vcr: ViewContainerRef, private router: Router, public toastr: ToastrManager,private loadingBar: LoadingBarService,private titleService: Title,
	private meta: Meta)
	{}
    ngOnInit() {
		this.meta.removeTag('name=title');
		this.meta.removeTag('name=description');
		this.titleService.setTitle(this.title);
    	 /* Check Token */
		if ((localStorage.getItem('userProfileInfo') === '' || localStorage.getItem('userProfileInfo') === undefined || localStorage.getItem('userProfileInfo') === null) && (localStorage.getItem('userAccessToken') === '' || localStorage.getItem('userAccessToken') === undefined || localStorage.getItem('userAccessToken') === null)) 
			this.router.navigate(['/login']);
		
		this.profileInfo = JSON.parse(localStorage.getItem('userProfileInfo'));
		 /* Set Language Translator */
		this.translate.addLangs(['en', 'ko', 'hi', 'zh', 'es', 'ja']);
		this.translate.setDefaultLang('en');
		const browserLang = (this.profileInfo.defaultLanguage!=undefined && this.profileInfo.defaultLanguage!='')?this.profileInfo.defaultLanguage:'en';
		this.translate.use(browserLang.match(/en|ko|hi|zh|es|ja/) ? browserLang : 'en');
		this.translate.get('Somethingwentwrong').subscribe(value => { 
			this.defaulterrSomethingMsg=value;
		});
		this.translate.get('Stock').subscribe(value => { 
			this.stockText=value;
		});
		this.translate.get('Cryptocurrency').subscribe(value => { 
			this.cryptoText=value;
		});
		/* Get All Static Currency*/
		try{
			this.currencyList=this.commonService.getCurrency();
			if (this.profileInfo.isProAccount)
				this.disabledCurrency = false;
			else{
				let newKeys=[];
				const objectType = this;
				this.currencyList.map(function(item){
					if(item.name==objectType.profileInfo.baseCurrency)
						return newKeys.push({name:item.name,symbol:item.symbol});
				});
				this.currencyList=newKeys;
			}
		}
		catch(error){}
		this._initForm();
		
	}
	private _initForm(): void {
        this.portfolioForm = this._fb.group({
            'portfolioName': ['', Validators.required],
            'portfolioType': ['Stock', Validators.required],
			'portfolioCurrency':[this.profileInfo.baseCurrency,Validators.required],
        });
    }
    get p() { return this.portfolioForm.controls; }
	/* Add Portfolio*/
	AddPortfolio(t) {
		this.submitted = true;
		//this.router.navigate(['investment']);
		if (this.portfolioForm.invalid) {
            return;
        }
        const formData = {"name" : this.portfolioForm.controls.portfolioName.value, "type": this.portfolioForm.controls.portfolioType.value, "currency" : this.portfolioForm.controls.portfolioCurrency.value};
		var objectType = this;
		this.loading =true;
		this.loadingBar.start();
		this.portfolioService.addPortfolio(formData, function(err, response){ 
			objectType.loading = false;
			objectType.loadingBar.stop();
			if( err )
			  objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
			if( response.statusCode == 200 ) {
				objectType.toastr.successToastr(response.data.message,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
				if(t==2){
					localStorage.setItem("portfolioId", response.data.portfolioId);
					localStorage.setItem("portfolioType", objectType.portfolioForm.controls.portfolioType.value);
					localStorage.setItem("portfolioCurrency", objectType.portfolioForm.controls.portfolioCurrency.value);
					objectType.router.navigate(['investment']);
				}
				else
					objectType.router.navigate(['/home/'+localStorage.getItem('loginUserName')]);
			}
			else 
			  objectType.toastr.errorToastr(response.data.message,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true}); 
		});
		
	}
}
