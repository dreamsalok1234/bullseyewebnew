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
	selector: 'app-change-user-password',
	templateUrl: './change-user-password.component.html',
	styleUrls: ['./change-user-password.component.scss'],
	animations: [routerTransition()]
})
export class ChangeUserPasswordComponent implements OnInit {
	showBtnText="Save Changes";
	showNBtnText="Save Changes";
	changePasswordForm: FormGroup;
	submitted = false;
	loading = false;
	mismatch=false;
	title='BullsEye Investors | Change Password';
	profileInfo : any;
	processingTxt ='Processing...';
	defaulterrSomethingMsg = 'Something went wrong';
	constructor(private translate: TranslateService, private authService: AuthService,private _fb: FormBuilder,vcr: ViewContainerRef, private router: Router, public toastr: ToastrManager,private loadingBar: LoadingBarService,private titleService: Title,
	private meta: Meta) { }
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
		const browserLang = (this.profileInfo.defaultLanguage !== undefined && this.profileInfo.defaultLanguage !== '') ? this.profileInfo.defaultLanguage : 'en';
		this.translate.use(browserLang.match(/en|ko|hi|zh|es|ja/) ? browserLang : 'en');
		this.translate.get('Save Changes').subscribe(value => {
			this.showBtnText=this.showNBtnText = value;
			this._initForm();
		});
		this.translate.get('Somethingwentwrong').subscribe(value => {
			this.defaulterrSomethingMsg = value;
		});
		this.translate.get('Processing...').subscribe(value => {
			this.processingTxt = value;
		});
		
		
		var objectType = this;
		this.changePasswordForm.valueChanges.subscribe(field => {
			objectType.mismatch=(field.newPassword !== field.confirmPassword)?true:false;
		});
	}
	private _initForm(): void {
        this.changePasswordForm = this._fb.group({
            'oldPassword': ['', Validators.required],
            'newPassword': ['',[Validators.required,Validators.minLength(6)]],
			'confirmPassword':['',[Validators.required,Validators.minLength(6)]],
        });
    }
	
	get c() { return this.changePasswordForm.controls; }
	
	/* changePassword*/
	changePassword() {
		this.submitted = true;
		if (this.changePasswordForm.invalid) {
			this.showBtnText =this.showNBtnText;
            return;
		}
		if(this.showBtnText ==this.processingTxt) {
			return ;
		}
        this.showBtnText=this.processingTxt;
        const formData = {"password" : this.changePasswordForm.controls.oldPassword.value, "newpassword": this.changePasswordForm.controls.confirmPassword.value};
		var objectType = this;
		this.loading =true;
		this.loadingBar.start();
		this.authService.changePassword(formData, function(err, response){ 
			objectType.loading = false;
			objectType.showBtnText=objectType.showNBtnText;
			objectType.loadingBar.stop();
			if( err ) {
			  objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
			}
			if( response.statusCode == 200 ) {
				objectType.toastr.successToastr(response.data.message,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
				objectType.changePasswordForm.reset();
			}
			else {
			  objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
			}
		});

	}
}
