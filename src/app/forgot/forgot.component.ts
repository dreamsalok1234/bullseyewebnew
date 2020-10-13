import { Component, OnInit, ElementRef,  ViewContainerRef } from '@angular/core';
import { routerTransition } from '../router.animations';
import { TranslateService } from '@ngx-translate/core';
import { state, style, transition, animate, trigger, AUTO_STYLE } from '@angular/animations';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { Title, Meta } from '@angular/platform-browser';
@Component({
    selector: 'app-forgot',
    templateUrl: './forgot.component.html',
    styleUrls: ['./forgot.component.scss'],
    animations: [routerTransition()]
})
export class ForgotComponent implements OnInit {
    model : any = {};
    show: boolean;
    showBtnText:string;
    registerForm: FormGroup;
    submitted = false;
    countryCode = '+1';
    loading = false;
	title='BullsEye Investors | Forgot Password';
    constructor(private translate: TranslateService, private authService: AuthService, private _fb: FormBuilder,  vcr: ViewContainerRef, private router: Router, public toastr: ToastrManager,private titleService: Title,private meta: Meta) {
        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
        this.translate.setDefaultLang('en');
        const browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');
		this.showBtnText='Reset';
    }

    ngOnInit() { 
		this._initForm(); 
		localStorage.removeItem('userProfileInfo');
		localStorage.removeItem('userAccessToken'); 
		localStorage.removeItem('userInfo');
		this.meta.removeTag('name=title');
		this.meta.removeTag('name=description');
		this.titleService.setTitle(this.title);
	}

    private _initForm(): void {
        this.registerForm = this._fb.group({
            'phone': ['', [Validators.minLength(8),Validators.pattern("^[0-9]*$"),Validators.required]]            

        });
    }
    get f() { return this.registerForm.controls; }
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

    ForgotPassword() {
        this.submitted = true;
        if (this.registerForm.invalid) {
			this.showBtnText="Reset";
            return;
        }
        const formData = {"phoneNumber": this.registerForm.controls.phone.value, "country_code":this.countryCode, "forgotType" : "phone", "verify_type" : "change_password"};
		if(this.showBtnText =="Processing...")
			return ;
        this.showBtnText="Processing...";
        var objectType = this;
        this.loading =true;
        this.authService.forgotPassword(formData, function(err, response){ 
            objectType.showBtnText="Reset";
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
}
