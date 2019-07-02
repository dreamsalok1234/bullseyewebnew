import { Component, OnInit, ElementRef,  ViewContainerRef } from '@angular/core';
import { routerTransition } from '../router.animations';
import { TranslateService } from '@ngx-translate/core';
import { state, style, transition, animate, trigger, AUTO_STYLE } from '@angular/animations';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { Title, Meta } from '@angular/platform-browser';

declare var jQuery: any, intlTelInput: any, intlTelInputUtils: any;
@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    animations: [routerTransition()]
})
export class SignupComponent implements OnInit {
	model : any = {};
	show: boolean;
	showBtnText:string;
	btnText:string;
	registerForm: FormGroup;
	submitted = false;
	countryCode = '+1';
	loading = false;
	title = 'BullsEye Investors | Account Registration';
	termsconditionCheck:boolean=false;
    constructor(private translate: TranslateService, private authService: AuthService, private _fb: FormBuilder,  vcr: ViewContainerRef, private router: Router, public toastr: ToastrManager,private titleService: Title,private meta: Meta) {
        //this.toastr.setRootViewContainerRef(vcr);
        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
        this.translate.setDefaultLang('en');
        const browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');
		this.show = false;
		this.btnText='Register';
		this.showBtnText="Show";
		
    }
    ngOnInit() { 
	    this.meta.removeTag('name=title');
		this.meta.removeTag('name=description');
		this.titleService.setTitle(this.title);
		this.meta.addTag({name: 'description', content: 'Register your Bullseye Investors account. BullsEye is the global stocks and cryptocurrency portfolio tracker. Build, track and analyse your portfolio on one platform across your desktop, iOS and Android devices.'});
		this._initForm(); localStorage.removeItem('userInfo'); 
	}

    private _initForm(): void {
        this.registerForm = this._fb.group({
            'phone': ['', [Validators.minLength(8),Validators.pattern("^[0-9]*$"),Validators.required]],
            'firstName': ['', Validators.required],
            'lastName': ['', Validators.required],
            'userName': ['', [Validators.required, Validators.pattern("^[A-Za-z0-9]+$")]],
            'password': ['', Validators.required],
            'email' : [''],
            'cpassword': [''],
            'termscondition': ['',Validators.required],

        });
    }
    get f() { return this.registerForm.controls; }
	/* Show & Hide Password */
	onShowHidePassword(){
		if(this.registerForm.controls.password.value!=undefined && this.registerForm.controls.password.value!=''){
			this.show = !this.show;
			this.showBtnText=(!this.show)?"Show":"Hide";
		}
	}
	/*  Checkbox*/
	toggleVisibility(e){
		this.termsconditionCheck=(this.registerForm.controls.termscondition.value)?false:true;
	}
	/* Register User */
	RegisteredUs() {
		this.termsconditionCheck=false;
		this.submitted = true;
		if(this.registerForm.controls.termscondition.value==""){
			this.termsconditionCheck=true;
			this.btnText='Register';
			return;
		}
		if (this.registerForm.invalid) {
			this.btnText='Register';
            return;
        }
        const formData = {"firstname" : this.registerForm.controls.firstName.value, "lastname": this.registerForm.controls.lastName.value, "username" : this.registerForm.controls.userName.value, "phoneNumber": this.registerForm.controls.phone.value, "country_code":this.countryCode, "password": this.registerForm.controls.password.value,"verify_type" : ""};
		if(this.btnText =="Processing...")
			return ;
        this.btnText="Processing...";
		var objectType = this;
		this.loading =true;
		this.authService.signup(formData, function(err, response){ 
		 	objectType.btnText='Register';
			objectType.loading = false;
			if( err )
			  objectType.toastr.errorToastr("Something Going Wrong",null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
			if( response.statusCode == 200 ) {
				localStorage.setItem("otpVerificationKey", response.data.verificationToken);
				localStorage.setItem("userInfo", JSON.stringify(formData));
				objectType.toastr.successToastr(response.data.message,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
				objectType.router.navigate(['/verification']);
			}
			else 
			  objectType.toastr.errorToastr(response.data.message,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true}); 
		});
		
	}
	telInputObject(obj) {
	    /*console.log(obj);
	    obj.intlTelInput('setCountry', 'us');*/
	  }
	getNumber(obj){

	}
	hasError(event: any): void {
        /*if (!event && this.registerForm.value.phone !== '') {
            this.registerForm.get('phone').setErrors(['invalid_cell_phone', true]);
        }*/
    }

    hasOutPut(event: any): void {
        this.registerForm.patchValue({phone: event});
    }
    numberOnly(event): boolean {
	    const charCode = (event.which) ? event.which : event.keyCode;
	    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
	      return false;
	    }
	    return true;
	}
	onCountryChange(obj) {
		this.countryCode = '+'+obj.dialCode;
	}

}
