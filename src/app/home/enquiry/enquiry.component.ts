import { Component, OnInit, ElementRef, ViewContainerRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../_services/auth.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Title, Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.scss'],
  animations: [routerTransition()]
})
export class EnquiryComponent implements OnInit {
	showBtnText="Submit";
	enquiryForm: FormGroup;
	submitted = false;
	loading = false;
	profileInfo: any;
	defaulterrSomethingMsg='Something went wrong';
	submitBtnText="Submit";
	processingTxt='Processing...';
	title='BullsEye Investors | Enquiry';
	constructor(private translate: TranslateService,private authService: AuthService,private _fb: FormBuilder,vcr: ViewContainerRef, private router: Router, public toastr: ToastrManager,private loadingBar: LoadingBarService,private titleService: Title,
	private meta: Meta) {}
	ngOnInit() {
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
		this.translate.get('Submit').subscribe(value => { 
			this.submitBtnText=value;
		});
		this.translate.get('Processing...').subscribe(value => { 
			this.processingTxt=value;
		});
		
		this._initForm();
	}
	private _initForm(): void {
        this.enquiryForm = this._fb.group({
            'subject': ['', Validators.required],
            'message': ['', Validators.required]
        });
    }
    get e() { return this.enquiryForm.controls; }
	/* Add Enquiry*/
	AddEnquiry() {
		
		this.submitted = true;
		if (this.enquiryForm.invalid){
			this.showBtnText =this.submitBtnText;
            return;
		}
		if(this.showBtnText ==this.processingTxt)
			return ;
		this.showBtnText=this.processingTxt;
        const formData = {"subject" : this.enquiryForm.controls.subject.value, "message": this.enquiryForm.controls.message.value};
		var objectType = this;
		this.loading =true;
		this.loadingBar.start();
		this.authService.userQuery(formData, function(err, response){ 
			objectType.loading = false;
			objectType.showBtnText=objectType.submitBtnText;
			objectType.loadingBar.stop();
			if( err )
			  objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
			if( response.statusCode == 200 ) {
				objectType.toastr.successToastr(response.data.message,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
				objectType.enquiryForm.reset();
			}
			else 
			  objectType.toastr.errorToastr(response.data.message,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true}); 
		});
		
	} 
}
