import { Component, Inject, ViewContainerRef } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CommonService } from '../../_services/common.service';
import { AuthService } from '../../_services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Title, Meta, SafeResourceUrl, DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'app-prodialog',
  templateUrl: './prodialog.component.html',
  styleUrls: ['./prodialog.component.scss'],
  providers: [AuthService, FormBuilder]
})
export class ProdialogComponent {

  totalSubsPlanDays = 0;
  totalRemainingDays = 0;
  totalDisplayPer = 0;
  activePro = 'active';
  isAddPro = false;
  isProRemainDays = false;
  subCancelBtn = 1;


  // fffffffffffffffffff


  areYouSureWantToRenewOn = 'Are you sure you want to turn auto-renewal on?';
  areYouSureWantToRenewOff = 'Are you sure you want to turn auto-renewal off?';
  areYouSureWantToCancel = 'Are you sure you want to cancel subscription?';
  Areyousureyouwanttodeleteaccount = 'Are you sure you want to delete your account?';
  DAYSLEFT = 'DAYS LEFT';
  DAYLEFT = 'DAY LEFT';
  isSubsChecked = false;
  modelText = '';
  btnText = 'Yes';
  btnYes = 'Yes';
  btnNo = 'No';
  autoRenewalBtn = 'Yes';
  autRenewalInd = 0;
  closeResult: string;
  processingTxt = 'Processing...';
  loading = false;
  defaulterrSomethingMsg = 'Something went wrong';
  profileInfo: any;
  subscriptionUrl: SafeResourceUrl;
  autorenewalstatuschanged = 'Auto-renewal status changed.';
  subscriptionplansuccessfullycancelled = 'Subscription plan successfully cancelled.';
  accessToken = '';
  dectLanguage = 'en';
  newclass = 'new';


  curr_array = [];
  fileUrl: any;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProdialogComponent>,

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
    private meta: Meta,
    private matDialog: MatDialog

    ) {
    this.totalRemainingDays = data.totalRemainingDays;
    this.totalDisplayPer = data.totalDisplayPer;
    this.DAYSLEFT = data.DAYSLEFT;
    this.isProRemainDays = data.isProRemainDays;
    this.isAddPro = data.isAddPro;
    this.subCancelBtn = data.subCancelBtn;
    this.isSubsChecked = data.isSubsChecked;
    this.btnText = data.btnText;
    this.totalSubsPlanDays = data.totalSubsPlanDays;


  }


  ngOnInit() {

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
      const browserLang = this.profileInfo.defaultLanguage !== undefined && this.profileInfo.defaultLanguage !== '' && this.profileInfo.defaultLanguage != null ? this.profileInfo.defaultLanguage : 'en';
    this.dectLanguage = browserLang;
      this.accessToken = localStorage.getItem('userAccessToken');
      this.subscriptionUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://bullseyeinvestors.live/tester/subscription?accessToken=' + this.accessToken + '&language=' + this.dectLanguage
      );
    if (this.profileInfo.img !== '' && this.profileInfo.img !== undefined) {
      this.fileUrl = this.profileInfo.img;
    }


      /*  Set Language Translator */
      this.translate.use(browserLang.match(/en|ko|hi|zh|es|ja/) ? browserLang : 'en');
      this.refreshTranslation();

      const objectTypeNew = this;

    }

    refreshTranslation() {

      this.translate.get('Somethingwentwrong').subscribe(value => {
        this.defaulterrSomethingMsg = value;
      });

      this.translate.get('Processing...').subscribe(value => {
        this.processingTxt = value;
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
      this.translate.get('Areyousureyouwanttodeleteaccount').subscribe(value => {
          this.Areyousureyouwanttodeleteaccount = value;
        });
      this.translate.get('Yes').subscribe(value => {
        this.btnYes = this.btnText = value;
        });
      this.translate.get('No').subscribe(value => {
        this.btnNo = value;
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
    }
	close() {
		this.dialogRef.close('Thanks for using me!');
    }
    proClose() {
      this.activePro = this.activePro ? '' : 'closed';
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
            // tslint:disable-next-line: max-line-length
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
    this.translate.get('areYouSureWantToCancel').subscribe(value => {
      this.modelText = value;
    });
    this.translate.get('Processing...').subscribe(value => {
      this.processingTxt = value;
    });
    this.translate.get('Yes').subscribe(value => {
      this.btnText = this.autoRenewalBtn = value;
    });

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
        this.close();
        window.open('https://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/manageSubscriptions', '_blank');
      } else {
        this.subscriptionUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          'https://bullseyeinvestors.live/tester/subscription/upgrade?accessToken=' + objectType.accessToken + '&language=' + objectType.dectLanguage
        );
        this.isProRemainDays = false;
        this.isAddPro = true;
        this.modalService.dismissAll();
      }
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

}
