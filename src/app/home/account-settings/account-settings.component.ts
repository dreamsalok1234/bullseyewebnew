import { Component, OnInit, ElementRef, ViewContainerRef } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer} from '@angular/platform-browser';
import { ToastrManager } from 'ng6-toastr-notifications';
import { TranslateService } from '@ngx-translate/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { AuthService } from '../../_services/auth.service';
import { CommonService } from '../../_services/common.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Title, Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit {
  fileUrl: any;
  closeResult: string;
  countryCode = '+1';
  phoneNumber = '';
  activeTab1 = 'active';
  activeTab2 = 'active';
  activePro = 'active';
  fileData = null;
  lang_array = [
    { name: 'English', shortname: 'en' },
    { name: 'Korean', shortname: 'ko' },
    { name: 'Hindi', shortname: 'hi' },
    { name: 'Chinese', shortname: 'zh' },
    { name: 'Spanish', shortname: 'es' },
    { name: 'Japanese', shortname: 'ja' }
  ];
  curr_array = [];
  selectLang = '';
  selectCurr = '';
  phoneIcon = 'assets/images/Change-Phone-Number.png';
  passIcon = 'assets/images/Change-Password.png';
  langIcon = 'assets/images/Language.png';
  currIcon = 'assets/images/Currency.png';
  bproIcon = 'assets/images/BullsEye-Pro.png';
  enqIcon = 'assets/images/Enquiry.png';
  appDemoIcon = 'assets/images/AppDemo.png';
  recFrnd = 'assets/images/recommend-friend.png';
  termsIcon = 'assets/images/Terms-of-Service.png';
  privIcon = 'assets/images/Privacy-Policy.png';
  logoutIcon = 'assets/images/Logout.png';
  profileChange = 'assets/images/profile_img.png';
  DelAccount = 'assets/images/delete_icon.png';
  showBtnText = 'Submit';
  changePhoneForm: FormGroup;
  inviteEmailForm: FormGroup;
  submitted = false;
  loading = false;
  profileInfo: any;
  apiName = '';
  baseCurrency = 'USD';
  phoneNumberOtp = true;
  phoneverifiedNumber = false;
  misMatch = false;
  verificationToken = '';
  disabledCurrency = true;
  inviteBtnText = 'Share';
  inviteBtnTextTrans = 'Share';
  defaulterrSomethingMsg = 'Something went wrong';
  submitBtnText = 'Submit';
  verifyText = 'Verify';
  processingTxt = 'Processing...';
  phoneNumberChangeText = 'Please change phone number';
  langInd = 0;
  intNewLangCnt = 0;
  subscriptionUrl: SafeResourceUrl;
  accessToken = '';
  totalRemainingDays = 0;
  totalSubsPlanDays = 0;
  totalDisplayPer=0;
  isAddPro = false;
  isProRemainDays = false;
  AccountbasecurrencysuccessfullyupdatedText = 'Account base currency successfully updated';
  areYouSureWantToRenewOn="Are you sure you want to turn auto-renewal on?";
  areYouSureWantToRenewOff="Are you sure you want to turn auto-renewal off?";
  areYouSureWantToCancel="Are you sure you want to cancel subscription?";
  DAYSLEFT="DAYS LEFT";
  DAYLEFT="DAY LEFT";
  isSubsChecked=false;
  modelText = '';
  btnText='Yes';
  autoRenewalBtn='Yes';
  autRenewalInd=0;
  title='BullsEye Investors | Account Setting';
  autorenewalstatuschanged="Auto-renewal status changed.";
  subscriptionplansuccessfullycancelled="Subscription plan successfully cancelled.";
  uploadBtnText = 'Update';
  uploadSubmitBtnText = '';
  fileUploadProcessing = false;
  subCancelBtn=true;
  dectLanguage='en';
  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    private _fb: FormBuilder,
    vcr: ViewContainerRef,
    private translate: TranslateService,
    public router: Router,
    private modalService: NgbModal,
    public toastr: ToastrManager,
    private loadingBar: LoadingBarService,
    private sanitizer: DomSanitizer,
	private titleService: Title,
	private meta: Meta
  ) {}

  ngOnInit() {
	this.meta.removeTag('name=title');
	this.meta.removeTag('name=description');
	this.titleService.setTitle(this.title);
    /* Get All Static Currency*/
    try {
      this.curr_array = this.commonService.getCurrency();
    } catch (error) {}
    /* Check Token */
    if (
      (localStorage.getItem('userProfileInfo') === '' ||
        localStorage.getItem('userProfileInfo') === undefined ||
        localStorage.getItem('userProfileInfo') === null) &&
      (localStorage.getItem('userAccessToken') === '' ||
        localStorage.getItem('userAccessToken') === undefined ||
        localStorage.getItem('userAccessToken') === null)
    ) {
      this.router.navigate(['/login']);
    }

    this.profileInfo = JSON.parse(localStorage.getItem('userProfileInfo'));
	
	this.translate.addLangs(['en', 'ko', 'hi', 'zh', 'es', 'ja']);
    this.translate.setDefaultLang('en');
    const browserLang =
      this.profileInfo.defaultLanguage !== undefined && this.profileInfo.defaultLanguage !== '' && this.profileInfo.defaultLanguage != null
        ? this.profileInfo.defaultLanguage
        : 'en';
	this.dectLanguage =browserLang;
    this.accessToken = localStorage.getItem('userAccessToken');
    this.subscriptionUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://bullseyeinvestors.live/subscription?accessToken=' + this.accessToken+'&language='+this.dectLanguage
    );
	if(this.profileInfo.img != '' && this.profileInfo.img != undefined) {
    this.fileUrl = this.profileInfo.img;
	}
	if(localStorage.getItem("proActive") !=undefined && localStorage.getItem("proActive")!="" && localStorage.getItem("proActive") !=null) {
		if(localStorage.getItem("proActive")==="false") {
			this.bullseyePro();
		}
	}
    /* if (this.profileInfo.isProAccount) {
      this.isAddPro = false;
      this.isProRemainDays = true;
      this.totalRemainingDays =
      this.profileInfo.remainingDays !== undefined && this.profileInfo.remainingDays != null ? this.profileInfo.remainingDays : 0;
    } else {
      this.isProRemainDays = false;
      this.isAddPro = true;
    } */
    /*  Set Language Translator */


    this.translate.use(browserLang.match(/en|ko|hi|zh|es|ja/) ? browserLang : 'en');
    this.translate.get('Somethingwentwrong').subscribe(value => {
      this.defaulterrSomethingMsg = value;
    });
    this.translate.get('Share').subscribe(value => {
      this.inviteBtnTextTrans = value;
    });
    this.translate.get('Submit').subscribe(value => {
      this.submitBtnText = value;
    });
    this.translate.get('Verify').subscribe(value => {
      this.verifyText = value;
    });
    this.translate.get('Processing...').subscribe(value => {
      this.processingTxt = value;
    });
    this.translate.get('UploadImage').subscribe(value => {
      this.uploadBtnText = value;
    });

    this.translate.get('Pleasechangephonenumber').subscribe(value => {
      this.phoneNumberChangeText = value;
    });
	this.translate.get('Accountbasecurrencysuccessfullyupdated').subscribe(value => {
      this.AccountbasecurrencysuccessfullyupdatedText = value;
    });
	this.translate.get('areYouSureWantToRenewOn').subscribe(value => {
      this.areYouSureWantToRenewOn = value;
    });
	this.translate.get('areYouSureWantToRenewOff').subscribe(value => {
      this.areYouSureWantToRenewOff = value;
    });
	this.translate.get('areYouSureWantToCancel').subscribe(value => {
      this.areYouSureWantToCancel = value;
    });
	this.translate.get('Yes').subscribe(value => {
      this.btnText = value;
    });
	this.translate.get('Autorenewalstatuschanged').subscribe(value => {
      this.autorenewalstatuschanged = value;
    });
	this.translate.get('Subscriptionplansuccessfullycancelled').subscribe(value => {
      this.subscriptionplansuccessfullycancelled = value;
    });
	this.translate.get('DAYS LEFT').subscribe(value => {
      this.DAYSLEFT = value;
    });
	this.translate.get('DAY LEFT').subscribe(value => {
      this.DAYLEFT = value;
    });
    this.uploadSubmitBtnText = this.uploadBtnText;
    if (this.profileInfo.baseCurrency !== undefined && this.profileInfo.baseCurrency !== '') {
      this.baseCurrency = this.profileInfo.baseCurrency;
    }

    if (this.profileInfo.isProAccount) {
      this.disabledCurrency = false;
    } else {
      const newKeys = [];
      const objectType = this;
      this.curr_array.map(function(item) {
        if (item.name === objectType.baseCurrency) {
          return newKeys.push({ name: item.name, symbol: item.symbol });
        }
      });
      this.curr_array = newKeys;
    }
    this.countryCode = this.profileInfo.countryCode.indexOf('+') > -1 ? this.profileInfo.countryCode : '+' + this.profileInfo.countryCode;
    this.phoneNumber = this.countryCode + this.profileInfo.mobile;
    this._initForm();

    const objectTypeNew = this;
    this.lang_array.map(function(v) {
      if (v.shortname === browserLang) {
        objectTypeNew.langInd = objectTypeNew.intNewLangCnt;
      }

      objectTypeNew.intNewLangCnt++;
    });
    this.selectLang = this.lang_array[this.langInd].name;
    this.selectCurr = this.baseCurrency;
  }

  private _initForm(): void {
    this.changePhoneForm = this._fb.group({
      phone: [this.phoneNumber, Validators.required],
      otp1: [''],
      otp2: [''],
      otp3: [''],
      otp4: ['']
    });
    this.inviteEmailForm = this._fb.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])]
    });
  }
  get p() {
    return this.changePhoneForm.controls;
  }
  get i() {
    return this.inviteEmailForm.controls;
  }
  languageToggle() {
    //  this.activeTab2 = '';
    if (this.activeTab2 === '') {
      this.activeTab2 = 'active';
    }
    this.activeTab1 = this.activeTab1 ? '' : 'active';
  }
  languageMethod(itemText, languageName) {
    this.selectLang = languageName;
    const objectType = this;
    if (itemText !== '' && itemText !== undefined) {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.loadingBar.start();
      const formData = { language: itemText };
      this.authService.changeLanguage(formData, function(err, response) {
        objectType.loading = false;
        objectType.loadingBar.stop();
        if (err) {
          objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {
            autoDismiss: true,
            maxOpened: 1,
            preventDuplicates: true
          });
        }
        if (response.statusCode === 200) {
          objectType.toastr.successToastr(response.data.message, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
          objectType.profileInfo.defaultLanguage =objectType.dectLanguage= itemText;
          localStorage.setItem('userProfileInfo', JSON.stringify(objectType.profileInfo));
          objectType.selectLang = languageName;
          objectType.translate.use(itemText.match(/en|ko|hi|zh|es|ja/) ? itemText : 'en');
        } else {
          objectType.toastr.errorToastr(response.data.message, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
        }
      });
    }
  }
  currencyToggle() {
    // this.activeTab1 = '';
    if (this.activeTab1 === '') {
      this.activeTab1 = 'active';
    }
    this.activeTab2 = this.activeTab2 ? '' : 'active';
  }
  currencyMethod(itemText) {
    const objectType = this;
    if (itemText !== '' && itemText !== undefined) {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.loadingBar.start();
      const formData = { baseCurrency: itemText };
      this.authService.changeBaseCurrency(formData, function(err, response) {
        objectType.loading = false;
        objectType.loadingBar.stop();
        if (err) {
          objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {
            autoDismiss: true,
            maxOpened: 1,
            preventDuplicates: true
          });
        }
        if (response.statusCode === 200) {
          objectType.toastr.successToastr(objectType.AccountbasecurrencysuccessfullyupdatedText, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
          objectType.profileInfo.baseCurrency = response.data.data.baseCurrency;
          objectType.profileInfo.watchListCurrency = response.data.data.watchListCurrency;
          localStorage.setItem('userProfileInfo', JSON.stringify(objectType.profileInfo));
          objectType.selectCurr = itemText;
        } else {
          objectType.toastr.errorToastr(response.data.message, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
        }
      });
    }
  }
  logout() {
    this.loadingBar.start();
    setTimeout(() => {
      localStorage.clear();
      this.loadingBar.stop();
      this.router.navigateByUrl('login');
    }, 1000);
  }

  open(content) {
    this.phoneverifiedNumber = this.misMatch = false;
    this.phoneNumberOtp = true;
    this.countryCode = this.countryCode.indexOf('+') > -1 ? this.countryCode : '+' + this.countryCode;
    this.changePhoneForm.controls.phone.setValue(this.countryCode + this.profileInfo.mobile);
    this.showBtnText = this.submitBtnText;
    this.modalService.open(content,{ windowClass: 'add_chat_modal', size: 'lg' }).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  openUploadImg(content) {
    this.modalService.open(content, { windowClass: 'open_upload_img', size: 'sm' }).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  deltAccount(content) {
    this.modalService.open(content, { windowClass: 'delt_account', size: 'sm' }).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  changePhone(content) {
    this.modalService.open(content, { windowClass: 'change_phone', size: 'sm' }).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  openShare(content) {
    this.phoneverifiedNumber = this.misMatch = false;
    this.phoneNumberOtp = true;
    this.countryCode = this.countryCode.indexOf('+') > -1 ? this.countryCode : '+' + this.countryCode;
    this.changePhoneForm.controls.phone.setValue(this.countryCode + this.profileInfo.mobile);
    this.showBtnText = this.submitBtnText;
    this.modalService.open(content,{ windowClass: 'sharemodal', size: 'lg' }).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  telInputObject(obj) {
    /*console.log(obj);
    obj.intlTelInput('setCountry', 'us');*/
  }
  getNumber(obj) {}
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    return charCode > 31 && (charCode < 48 || charCode > 57) ? false : true;
  }
  onCountryChange(obj) {
    this.countryCode = '+' + obj.dialCode;
  }
  changePhoneNumber(t) {
    let formData = {};
    const objectType = this;
    this.submitted = true;
    objectType.misMatch = false;
    if (this.changePhoneForm.controls.phone.value === '' && this.changePhoneForm.controls.phone.value.length < 10) {
      this.showBtnText = t === 1 ? this.submitBtnText : this.verifyText;
      return;
    }
    if (t === '' || t === undefined) {
      this.showBtnText = t === 1 ? this.submitBtnText : this.verifyText;
      return;
    }
    if (t === 1) {
      if (this.phoneNumber === this.changePhoneForm.controls.phone.value) {
        objectType.toastr.errorToastr(objectType.phoneNumberChangeText, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
        objectType.showBtnText = this.submitBtnText;
        return;
      }
      objectType.apiName = 'phonechange';
      formData = { country_code: this.countryCode, phoneNumber: this.changePhoneForm.controls.phone.value };
    } else if (t === 2) {
      if (
        this.changePhoneForm.controls.otp1.value === '' ||
        this.changePhoneForm.controls.otp2.value === '' ||
        this.changePhoneForm.controls.otp3.value === '' ||
        this.changePhoneForm.controls.otp4.value === ''
      ) {
        objectType.misMatch = true;
        objectType.showBtnText = this.verifyText;
        return;
      }
      objectType.apiName = 'verifychangenumber';
      const verificationCodeText =
        this.changePhoneForm.controls.otp1.value +
        this.changePhoneForm.controls.otp2.value +
        this.changePhoneForm.controls.otp3.value +
        this.changePhoneForm.controls.otp4.value;
      formData = {
        country_code: this.countryCode,
        phoneNumber: this.changePhoneForm.controls.phone.value,
        verificationCode: verificationCodeText
      };
    } else {
      objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
      this.showBtnText = t === 1 ? this.submitBtnText : this.verifyText;
      return;
    }
    if (this.showBtnText === this.processingTxt) {
      return;
    }

    this.showBtnText = this.processingTxt;

    this.loading = true;
    this.loadingBar.start();
    this.authService.changePhoneNumberAndVerify(this.apiName, formData, function(err, response) {
      objectType.loading = false;
      objectType.showBtnText = t === 1 ? objectType.submitBtnText : objectType.verifyText;
      objectType.loadingBar.stop();
      if (err) {
        objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {
          autoDismiss: true,
          maxOpened: 1,
          preventDuplicates: true
        });
      }
      if (response.statusCode === 200) {
        objectType.toastr.successToastr(response.data.message, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
        if (t === 1) {
          objectType.phoneNumberOtp = false;
          objectType.phoneverifiedNumber = true;
        } else {
          objectType.countryCode = objectType.countryCode.indexOf('+') > -1 ? objectType.countryCode : '+' + objectType.countryCode;
          objectType.profileInfo.mobile = objectType.changePhoneForm.controls.phone.value;
          objectType.profileInfo.countryCode = objectType.countryCode;
          objectType.changePhoneForm.controls.phone.setValue(objectType.countryCode + objectType.profileInfo.mobile);
          localStorage.setItem('userProfileInfo', JSON.stringify(objectType.profileInfo));
          objectType.changePhoneForm.reset();
          objectType.modalService.dismissAll();
        }
        objectType.showBtnText = this.verifyText;
      } else {
        objectType.toastr.errorToastr(response.data.message, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
      }
    });
  }
  ResendOTP() {
    const objectType = this;
    objectType.phoneverifiedNumber = false;
    objectType.phoneNumberOtp = true;
    objectType.changePhoneForm.reset();
    this.changePhoneForm.controls.phone.setValue(this.countryCode + this.profileInfo.mobile);
    objectType.showBtnText = objectType.submitBtnText;
  }
  /* Move to next text box*/
  next(event) {
    const key = event.keyCode || event.charCode;
    if (key === 8 || key === 46 || key === 37) {
      if (event.srcElement.id !== 'start') {
        const element = event.srcElement.parentElement.previousElementSibling.firstChild; // get the sibling element
        if (element == null) {
          // check if its null
          return;
        } else {
          element.focus();
        }
      }
      return;
    } else if (event.srcElement.id !== 'end') {
      const element = event.srcElement.parentElement.nextElementSibling.firstChild; // get the sibling element
      if (element == null) {
        return;
      } else {
        element.focus();
      }
    }
  }

  /*  Invite Friend */
  invitteFriend() {

    if (this.inviteBtnText === this.processingTxt) {
      return;
    }
    this.submitted = true;
    if (this.inviteEmailForm.invalid) {
		this.inviteBtnText = this.inviteBtnTextTrans;
		return;
    }
    this.inviteBtnText = this.processingTxt;
    this.loading = true;
    this.loadingBar.start();
    const objectType = this;
    const formData = { email: this.inviteEmailForm.controls.email.value };
    this.authService.inviteFriend(formData, function(err, response) {
      objectType.loading = false;
      objectType.inviteBtnText = objectType.inviteBtnTextTrans;
      objectType.loadingBar.stop();
      if (err) {
        objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {
          autoDismiss: true,
          maxOpened: 1,
          preventDuplicates: true
        });
      }
      if (response.statusCode === 200) {
        objectType.toastr.successToastr(response.data.message, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });

        objectType.inviteBtnText = objectType.inviteBtnTextTrans;
        objectType.submitted = false;
		objectType.inviteEmailForm.reset();
        objectType.modalService.dismissAll();
      } else {
        objectType.toastr.errorToastr(response.data.message, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
      }
    });
  }

  bullseyePro() {
	const objectType = this;
	this.loading = true;
	objectType.subCancelBtn = true;
	objectType.totalRemainingDays = objectType.totalDisplayPer = objectType.totalSubsPlanDays = 0;
	objectType.isAddPro =  objectType.isProRemainDays = false;
    this.loadingBar.start();
	this.authService.getMySubscription(function(err, response) {

        objectType.loading = false;
        objectType.loadingBar.stop();
        if (err) {
          objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {
            autoDismiss: true,
            maxOpened: 1,
            preventDuplicates: true
          });
        }
        if (response.statusCode === 200) {
		  if(Object.keys(response.data.data).length > 0) {
			 if (response.data.data.isProAccount === response.data.data.isTrailVersion) {
				  objectType.subscriptionUrl = objectType.sanitizer.bypassSecurityTrustResourceUrl(
					  'https://bullseyeinvestors.live/subscription?accessToken=' + objectType.accessToken + '&language=' + objectType.dectLanguage
					);
					objectType.isProRemainDays = false;
					objectType.isAddPro = true;
				} else {
					objectType.subCancelBtn = (response.data.data.paymentMethod !== undefined && response.data.data.paymentMethod.toLowerCase() === 'ios') ? false : true;
				  objectType.isSubsChecked = (response.data.data.autoRenew !== undefined && response.data.data.autoRenew != null) ? ((response.data.data.autoRenew === 'on') ? true : false) : false;
				  objectType.isAddPro = false;
				  objectType.isProRemainDays = true;
				  objectType.btnText = objectType.autoRenewalBtn;

				//  setTimeout(() => {

					 objectType.totalSubsPlanDays =
				  (response.data.data.totalDays !== undefined && response.data.data.totalDays != null) ? response.data.data.totalDays : 0;
					 objectType.totalRemainingDays =
				  (response.data.data.remainingDays !== undefined && response.data.data.remainingDays != null) ? response.data.data.remainingDays : 0;
				  objectType.totalDisplayPer = Math.round((objectType.totalRemainingDays / objectType.totalSubsPlanDays) * 100);
				// }, 200);
			   }

		  } else {
				objectType.subscriptionUrl = objectType.sanitizer.bypassSecurityTrustResourceUrl(
				  'https://bullseyeinvestors.live/subscription?accessToken=' + objectType.accessToken + '&language=' + objectType.dectLanguage
				);
				objectType.isProRemainDays = false;
				objectType.isAddPro = true;
		   }
		   objectType.activePro = objectType.activePro ? '' : 'activePro';
        } else {
          objectType.toastr.errorToastr(response.data.message, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
        }
    });

  }
  proClose() {
    this.activePro = this.activePro ? '' : 'closed';
  }
  openWindowCustomClass(content) {
    this.modalService.open(content, { windowClass: 'full_width_modal', size: 'lg' });
  }
  checkAutoRenewal(content, i) {
	this.autRenewalInd = i;
	this.modelText = (this.autRenewalInd === 0) ? this.areYouSureWantToRenewOn : this.areYouSureWantToRenewOff;
	this.isSubsChecked = (this.autRenewalInd === 0) ? true : false;
	this.modalService.open(content).result.then((result) => {
		this.closeResult = `Closed with: ${result}`;
	}, (reason) => {
		this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
	});
  }
  resetAutoRenewal() {
	  this.isSubsChecked = (!this.isSubsChecked) ? true : false;
	  this.modalService.dismissAll();
  }
  changeAutoRenewal() {
	const objectType = this;
	if (this.btnText === this.processingTxt) {
      return;
	}
    this.btnText = this.processingTxt;
    this.loading = true;
    this.loadingBar.start();
    const formData = { renew: ((this.isSubsChecked) ? 'on' : 'off')};
    this.authService.changeAutoRenewal(formData, function(err, response) {
      objectType.loading = false;
      objectType.btnText = objectType.autoRenewalBtn;
      objectType.loadingBar.stop();
      if (err) {
        objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {
          autoDismiss: true,
          maxOpened: 1,
          preventDuplicates: true
        });
      }
      if (response.statusCode === 200) {
		  objectType.toastr.successToastr(objectType.autorenewalstatuschanged, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
		  // objectType.activePro='closed';
          objectType.modalService.dismissAll();
	  } else {
        objectType.toastr.errorToastr(response.data.message, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
      }
    });

  }
  showPopupForCancel(content) {
	this.autRenewalInd = 2;
	this.modelText = this.areYouSureWantToCancel;
	this.modalService.open(content).result.then((result) => {
		this.closeResult = `Closed with: ${result}`;
	}, (reason) => {
		this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
	});
  }
  cancelSubscription() {
	const objectType = this;
	if (this.btnText === this.processingTxt) {
      return;
	}
    this.btnText = this.processingTxt;
    this.loading = true;
    this.loadingBar.start();
    this.authService.cancelSubscription(function(err, response) {

      objectType.loading = false;
      objectType.btnText = objectType.autoRenewalBtn;
      objectType.loadingBar.stop();
      if (err) {
        objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {
          autoDismiss: true,
          maxOpened: 1,
          preventDuplicates: true
        });
      }
      if (response.statusCode === 200) {
		  objectType.toastr.successToastr(objectType.subscriptionplansuccessfullycancelled, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
		  objectType.profileInfo.isProAccount = false;
		  objectType.profileInfo.isTrailVersion = '0';
          localStorage.setItem('userProfileInfo', JSON.stringify(objectType.profileInfo));
		  objectType.activePro = 'closed';
          objectType.modalService.dismissAll();
		  window.location.reload();
	  } else {
        objectType.toastr.errorToastr(response.data.message, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
      }
    });

  }
  openSubUpgrade(content) {
	this.modalService.open(content).result.then((result) => {
		this.closeResult = `Closed with: ${result}`;
	}, (reason) => {
		this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
	});
  }
  gotoUpgradeUrl() {
	  const objectType = this;
	  if (!this.subCancelBtn) {
		  this.modalService.dismissAll();
		 window.open('https://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/manageSubscriptions', '_blank'); } else {
		  this.subscriptionUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
			  'https://bullseyeinvestors.live/subscription/upgrade?accessToken=' + objectType.accessToken + '&language=' + objectType.dectLanguage
		  );
		  this.isProRemainDays = false;
		  this.isAddPro = true;
		  this.modalService.dismissAll();
	  }
  }

  fileEvent(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL((<HTMLInputElement>fileInput.target).files[0]); // read file as data url
    reader.onload = (event) => { // called once readAsDataURL is completed
      this.fileUrl = (<FileReader>event.target).result;
    };
  }

  uploadImg() {
      const objectType = this;
      if (this.fileData.name === '' || this.fileData.name === undefined || this.fileData.name == null) {
        objectType.toastr.errorToastr('Choose file', null, {
            autoDismiss: true,
            maxOpened: 1,
            preventDuplicates: true
          });
        return false;
      }
      if (this.fileUploadProcessing === true ) {
        return false;
      }
      this.fileUploadProcessing = true;
      this.uploadSubmitBtnText = this.processingTxt;
      this.authService.uploadProfileImage(this.fileData, function(err, response) {
        objectType.fileUploadProcessing = false;
        objectType.uploadSubmitBtnText = objectType.uploadBtnText;
        objectType.loading = false;
        objectType.loadingBar.stop();
        if (err) {
          objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {
            autoDismiss: true,
            maxOpened: 1,
            preventDuplicates: true
          });
        }
        if (response.statusCode === 200) {
          objectType.toastr.successToastr(response.data.message, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
          objectType.profileInfo.img = response.data.profile.img;
          localStorage.setItem('userProfileInfo', JSON.stringify(objectType.profileInfo));
          objectType.fileUrl = objectType.profileInfo.img;
        } else {
          objectType.toastr.errorToastr(response.data.message, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
        }
      });
  }
}
