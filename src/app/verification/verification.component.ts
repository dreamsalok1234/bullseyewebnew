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
    selector: 'app-verification',
    templateUrl: './verification.component.html',
    styleUrls: ['./verification.component.scss'],
    animations: [routerTransition()]
})
export class VerificationComponent implements OnInit {
    otpVerificationKey = '';
    loading = true;
    countryCode = '';
    phoneNumber = '';
    otpForm: FormGroup;
	title='BullsEye Investors | Verification';
    constructor(private translate: TranslateService, private authService: AuthService, private _fb: FormBuilder, vcr: ViewContainerRef, private router: Router, public toastr: ToastrManager,private titleService: Title,private meta: Meta) {
        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
        this.translate.setDefaultLang('en');
        const browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');
    }

    ngOnInit() {
		this.titleService.setTitle(this.title);
        if(localStorage.getItem('otpVerificationKey') != undefined &&  localStorage.getItem('otpVerificationKey') != '') {
            let userInfoData = JSON.parse(localStorage.getItem('userInfo'));
            this.countryCode = userInfoData.country_code;
            this.phoneNumber = userInfoData.phoneNumber;
            this.otpVerificationKey = localStorage.getItem('otpVerificationKey');        
        }
        else
            this.router.navigate(['/login']);
        this.otpForm = this._fb.group({
            'otp1': ['', Validators.required],
            'otp2': ['', Validators.required],
            'otp3': ['', Validators.required],
            'otp4': ['', Validators.required]
        });
    }
    get f() { return this.otpForm.controls; }
    verifyOtp() {
        
        if (this.otpForm.invalid) 
            return;
        let userInfo = JSON.parse(localStorage.getItem('userInfo'));
        this.otpVerificationKey = localStorage.getItem('otpVerificationKey');
        let otpVal = this.otpForm.controls.otp1.value+this.otpForm.controls.otp2.value+this.otpForm.controls.otp3.value+this.otpForm.controls.otp4.value;
        const formData = {"phoneNumber" : this.phoneNumber, "country_code":this.countryCode, "verificationCode": otpVal, "verificationToken" : this.otpVerificationKey, "verify_type" : userInfo.verify_type};
        var objectType = this;
        
        this.authService.verifyOtp(formData, function(err, response){ 
            
            objectType.loading = false;
            if( err )
              objectType.toastr.errorToastr("Something Going Wrong",null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
            if( response.statusCode == 200 ) {
                localStorage.setItem("accessToken", response.data.token);
                objectType.toastr.successToastr(response.data.message,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
                localStorage.removeItem('userInfo');
                localStorage.removeItem('otpVerificationKey');
                objectType.router.navigate(['/login']);
            }
            else 
              objectType.toastr.errorToastr(response.data.message,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true}); 
        });
    }
    next(event) {
            let key = event.keyCode || event.charCode;
            
            if( key == 8 || key == 46 || key == 37 ){
                if(event.srcElement.id !='start') {
                    let element = event.srcElement.parentElement.previousElementSibling.firstChild; // get the sibling element
                    
                    if(element == null)  // check if its null
                        return;
                    else
                        element.focus();
                }
                return;
            }
            else if(event.srcElement.id !='end'){

                let element = event.srcElement.parentElement.nextElementSibling.firstChild; // get the sibling element
               
                if(element == null)  // check if its null
                    return;
                else
                    element.focus();   // focus if not null
            }
    }

    ResendVerification(){
        let userInfo = JSON.parse(localStorage.getItem('userInfo'));
        let formData = {"phoneNumber": userInfo.phoneNumber, "country_code":userInfo.country_code};
        var objectType = this;
        this.authService.resendOtp(formData, function(err, response){ 
            
            objectType.loading = false;
            if( err )
              objectType.toastr.errorToastr("Something Going Wrong",null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
            if( response.statusCode == 200 ) {
                localStorage.setItem("otpVerificationKey", response.data.verificationToken);
                objectType.toastr.successToastr(response.data.message,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
                objectType.router.navigate(['/verification']);
            }
            else 
              objectType.toastr.errorToastr(response.data.message,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true}); 
        });
    }
    
}
