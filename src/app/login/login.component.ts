import { Component, OnInit, ElementRef,  ViewContainerRef } from '@angular/core';
import { routerTransition } from '../router.animations';
import { TranslateService } from '@ngx-translate/core';
import { state, style, transition, animate, trigger, AUTO_STYLE } from '@angular/animations';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Title, Meta } from '@angular/platform-browser';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    model : any = {};
    show: boolean;
    showBtnText:string;
    loginForm: FormGroup;
    submitted = false;
    loading = false;
    isRemember = false;
    userName = '';
    password = '';
	title = 'BullsEye Investors | Login';
    constructor(
        private translate: TranslateService, private authService: AuthService, private _fb: FormBuilder,  vcr: ViewContainerRef, private router: Router, public toastr: ToastrManager,private loadingBar: LoadingBarService,private titleService: Title,private meta: Meta
        ) {
            /* this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
            this.translate.setDefaultLang('en');
            const browserLang = this.translate.getBrowserLang();
            this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en'); */
    }

    ngOnInit() {
		this.meta.removeTag('name=title');
		this.meta.removeTag('name=description');
		this.titleService.setTitle(this.title);
		this.meta.addTag({name: 'description', content: 'Login to your BullsEye Investors account. BullsEye is the global stocks and cryptocurrency portfolio tracker. Build, track and analyse your portfolio on one platform across your desktop, iOS and Android devices.'});
		this.showBtnText='Login';
        this.userName = (localStorage.getItem('cacheUserName')!='' && localStorage.getItem('cacheUserName') != undefined) ? localStorage.getItem('cacheUserName') : ''; 
        this.password = (localStorage.getItem('cachePassword')!='' && localStorage.getItem('cachePassword') != undefined) ? localStorage.getItem('cachePassword') : '';  
        this.isRemember = (localStorage.getItem('isRemember')!='' && localStorage.getItem('isRemember') != undefined) ? true : false; 
        this._initForm();
    }

    private _initForm(): void {
        this.loginForm = this._fb.group({
            'userName': [this.userName, [Validators.required, Validators.pattern("^[A-Za-z0-9]+$")]],
            'password': [this.password, Validators.required],
            'isRemember': [this.isRemember], 
        });
    }
    get f() { return this.loginForm.controls; }

    onLoggedin() {
        localStorage.setItem('isLoggedin', 'true');
		this.router.navigateByUrl('home');
    }

    CheckLogin(){
        this.submitted = true;
        if (this.loginForm.invalid){ 
			this.showBtnText='Login';
            return;
		}
        if(this.loginForm.controls.isRemember.value == true && this.loginForm.controls.isRemember.value !="") {
            localStorage.setItem("cacheUserName", this.loginForm.controls.userName.value);
            localStorage.setItem("cachePassword", this.loginForm.controls.password.value);
            localStorage.setItem("isRemember", "Yes");
        }
        else {
            localStorage.removeItem("cacheUserName");
            localStorage.removeItem("cachePassword");
            localStorage.removeItem("isRemember");
        }
        const formData = {"username" : this.loginForm.controls.userName.value, "password": this.loginForm.controls.password.value};
		if(this.showBtnText =="Processing...") {
			return ;
		}
        this.showBtnText="Processing...";
        var objectType = this;
        this.loading =true;
		this.loadingBar.start();
		
        this.authService.login(formData, function(err, response){ 
			
            objectType.loading = false;
			objectType.showBtnText='Login';
			objectType.loadingBar.stop();
            if( err ) {
              objectType.toastr.errorToastr("Something went wrong, please try again!",null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
            }
            if( response.statusCode == 200 ) {
                localStorage.setItem("userAccessToken", response.data.token);
                localStorage.setItem("userProfileInfo", JSON.stringify(response.data.userData));
				localStorage.setItem("loginUserName", objectType.loginForm.controls.userName.value);
                objectType.toastr.successToastr(response.data.message,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
                objectType.router.navigate(['/home/'+objectType.loginForm.controls.userName.value.trim()]);
            }
           else {
			  if(response.data!=undefined && response.data.length>0){
				  if(!response.data.isPhoneVerified && response.data.isPhoneVerified!=undefined) {
					  objectType.toastr.errorToastr("Verify Phone",null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true}); 
				  }
				  else {
					objectType.toastr.errorToastr(((response.data.message==undefined || response.data.message=='')?'Something went wrong, please try again!"':response.data.message),null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
						} 
			  }
			  else {
				objectType.toastr.errorToastr(((response.data.message==undefined || response.data.message=='')?'Something went wrong, please try again!"':response.data.message),null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
					}
            }

        });
    }
}
