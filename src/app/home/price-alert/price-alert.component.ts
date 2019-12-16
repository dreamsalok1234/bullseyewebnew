import { Component, OnInit, ElementRef, ViewContainerRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CommonService } from '../../_services/common.service';
import { WatchlistService } from '../../_services/watchlist.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Title, Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-search-market',
  templateUrl: './price-alert.component.html',
  styleUrls: ['./price-alert.component.scss'],
  animations: [routerTransition()]
})
export class PriceAlertComponent implements OnInit {
  closeResult: string;
  investmentForm: FormGroup;
  submitted = false;
  model: any = { currentCurrency: 'USD', searchCriteria: '', exchangeId: '', stockType: 'STOCK', keywords: '' };
  priceAlert: any = { currentCurrency: 'USD', amount: '', tickerId: '', tickerName: '', symbol: '', compare: '>', expiryDate: '' };
  priceAlertError: any = { amount: false, expiryDate: false };
  datepicker: any;
  loading = false;
  res = false;
  tickerList: any = [];
  resTickerAutoComp = false;
  tickerId = 0;
  tickerAmount = 0;
  tickerName = '';
  tickerError = '';
  tickerCurrency = '';
  currencyItemList: any = [];
  ticker: FormControl = new FormControl();
  currentPage = 0;
  totalPage = 0;
  processing = true;
  stockType = 'Stock';
  itemList: any = [];
  profileInfo: any;
  priceAlertDetails: any;
  checkStatus = true;
  currencyList: any = [];
  searchText = '';
  activeTab = 'active';
  activeTab2 = '';
  alertId = '';
  curr_array = ['USD', 'SGD', 'INR', 'KD', 'AUD'];
  selectCurr = 'USD';
  criteriaFilter = [
    { key: 'high', value: 'Top 10 by 24 Hour Change' },
    { key: 'low', value: 'Bottom 10 by 24 Hour Change' },
    { key: 'market_cap', value: 'Top 10 by Market Capitalisation' }
  ];
  defaulterrSomethingMsg = 'Something went wrong';
  stockText = 'Stocks';
  cryptoText = 'Cryptocurrency';
  tickerNameReq = 'Ticker name is required';
  processingTxt = 'Processing...';
  noPriceAlertText = 'No price alerts set.';
  title = 'BullsEye Investors | Price Alert';
  targetPriceisRequiredMsg="Target Price is required!";
  currentTime = new Date();
  constructor(
    private translate: TranslateService,
    private commonService: CommonService,
    private watchlistService: WatchlistService,
    private _fb: FormBuilder,
    vcr: ViewContainerRef,
    private router: Router,
    public toastr: ToastrManager,
    private modalService: NgbModal,
    private loadingBar: LoadingBarService,
	private titleService: Title,
	private meta: Meta
  ) {}
  ngOnInit() {
	this.meta.removeTag('name=title');
	this.meta.removeTag('name=description');
	this.titleService.setTitle(this.title);
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

	if (!this.profileInfo.isProAccount){
		localStorage.setItem("proActive","false");
		this.router.navigateByUrl('/check-pro', {skipLocationChange: true}).then(()=>
		this.router.navigate(['/account-settings']));
	}
	else {
		localStorage.setItem("proActive","");
	}
    /* Set Language Translator */
    this.translate.addLangs(['en', 'ko', 'hi', 'zh', 'es', 'ja']);
    this.translate.setDefaultLang('en');
    const browserLang =
      this.profileInfo.defaultLanguage !== undefined && this.profileInfo.defaultLanguage != '' ? this.profileInfo.defaultLanguage : 'en';
    this.translate.use(browserLang.match(/en|ko|hi|zh|es|ja/) ? browserLang : 'en');
    this.translate.get('Somethingwentwrong').subscribe(value => {
      this.defaulterrSomethingMsg = value;
    });
    this.translate.get('Stocks').subscribe(value => {
      this.stockText = value;
    });
    this.translate.get('Cryptocurrency').subscribe(value => {
      this.cryptoText = value;
    });
    this.translate.get('Tickernameisrequired').subscribe(value => {
      this.tickerNameReq = value;
    });
    this.translate.get('Processing...').subscribe(value => {
      this.processingTxt = value;
    });
    this.translate.get('Nopricealertsset').subscribe(value => {
      this.noPriceAlertText = value;
    });
	this.translate.get('TargetPriceisRequired').subscribe(value => {
		this.targetPriceisRequiredMsg=value;
	});
	try {
      this.currencyList = this.commonService.getCurrency();
	  this.currencyItemList= this.currencyList;

    } catch (error) {}
    this._initForm();
    this.priceAlertList();
  }

  private _initForm(): void {
    this.investmentForm = this._fb.group({
      ticker: ['', Validators.required],
      amount: ['', Validators.required],
      expiryDate: ['', [Validators.required]],
      compare: ['>', [Validators.required]],
      currency: [this.profileInfo.baseCurrency, [Validators.required]]
    });
    /* Create Auto complete*/
    /* const objectType = this;
    this.ticker.valueChanges.subscribe(term => {

    }); */
  }
  get i() {
    return this.investmentForm.controls;
  }
  valuechange($event){
	  const objectType = this;
	  setTimeout(function() {
		let term=objectType.investmentForm.controls['ticker'].value;
        if (term !== '' && objectType.res === false && objectType.resTickerAutoComp === false) {
          objectType.loadingBar.start();
          objectType.res = true;
          objectType.commonService.getTickerList(term, objectType.stockType, function(err, response) {

            if (err) {
            }
            if (response.statusCode === 200) {
              if (response.data.data.exchangeList.stockList !== undefined) {
                objectType.tickerList = response.data.data.exchangeList.stockList;
              }
            }
            objectType.loadingBar.stop();
            objectType.res = false;
          });
        } else {
          objectType.resTickerAutoComp = false;
        }
      }, 500);
  }
  setTagetValueWith3Digit() {
	  if(this.investmentForm.controls['amount'].value !== '') {
		 const amt=parseFloat(this.investmentForm.controls['amount'].value);
		 this.investmentForm.controls['amount'].setValue(amt.toFixed(3));
	  }
  }
  priceAlertList() {
    const objectType = this;
	objectType.itemList=[];
    objectType.processingTxt = objectType.processingTxt;
    objectType.processing = true;
    this.watchlistService.priceAlertList(function(err, response) {
      if (err) {
        objectType.processingTxt = objectType.defaulterrSomethingMsg;
        objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {
          autoDismiss: true,
          maxOpened: 1,
          preventDuplicates: true
        });
      }
      if (response.statusCode === 200) {

        if (response.data.data !== undefined && response.data.data.length > 0) {
          objectType.itemList = response.data.data;
          objectType.processing = false;
        } else {
          objectType.processingTxt = objectType.noPriceAlertText;
        }
      } else {
        objectType.toastr.errorToastr(
          response.data.message === undefined || response.data.message === '' ? objectType.defaulterrSomethingMsg : response.data.message,
          null,
          { autoDismiss: true, maxOpened: 1, preventDuplicates: true }
        );
        objectType.processingTxt = objectType.defaulterrSomethingMsg;
        if (response.statusCode === 401) {
          localStorage.clear();
          objectType.router.navigate(['/login']);
        }
        // objectType.processing = objectType.response.data.message;
        // objectType.toastr.errorToastr(response.data.message, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
        /*if(response.statusCode == 401) {
                localStorage.removeItem("userAccessToken");
                localStorage.removeItem("userProfileInfo");
                objectType.router.navigate(['/login']);
              }*/
      }
      // objectType.processing = false;
    });
  }

  setPriceAlert() {
    this.submitted = true;
    this.tickerError = '';
    if (this.tickerName !== undefined && this.tickerName !== '') {
      this.investmentForm.controls['ticker'].setValue(this.tickerName);
    } else {
      this.tickerError = this.tickerNameReq;
    }

    if (this.investmentForm.invalid) {
      return;
    }
    const month =
      this.investmentForm.controls['expiryDate'].value.month < 10
        ? '0' + this.investmentForm.controls['expiryDate'].value.month
        : this.investmentForm.controls['expiryDate'].value.month;
    const day =
      this.investmentForm.controls['expiryDate'].value.day < 10
        ? '0' + this.investmentForm.controls['expiryDate'].value.day
        : this.investmentForm.controls['expiryDate'].value.day;
    const expiryDatevalue = day + '/' + month + '/' + this.investmentForm.controls['expiryDate'].value.year;

    const formData = {
      tickerId: this.tickerId,
      alertId: this.alertId,
      alertPriceType: this.investmentForm.controls['compare'].value,
      priceThreshold: this.investmentForm.controls['amount'].value,
      expiryDate: expiryDatevalue,
      currency: this.investmentForm.controls['currency'].value
    };
    const objectType = this;
    this.loading = true;
    this.loadingBar.start();
    this.commonService.addPriceAlert(formData, function(err, response) {
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
         objectType.investmentForm.reset();
		 objectType.priceAlertList();
		 objectType.modalService.dismissAll();

        /*------------------ ReLoad Page ---------------------*/
      } else {
        objectType.toastr.errorToastr(response.data.message, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
      }
    });
  }
  /*Numeric value with decimal value*/
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    return charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57) ? false : true;
  }

  /* Select Ticker */
  selectTicker(id, amount = 0, symbol,name, currency) {
    this.tickerId = id;
    this.tickerAmount = amount;
    this.tickerName = name+' ('+symbol+')';
	this.investmentForm.controls['ticker'].setValue(this.tickerName);
    this.tickerCurrency = currency;
    this.resTickerAutoComp = true;
  }
  resetTickerTxt() {
    this.tickerId = this.tickerAmount = 0;
    this.tickerName = this.tickerCurrency = '';
  }

  toggleActive(i) {
	this.tickerList=[];
	this.activeTab=this.activeTab2='';
	if(i===1) {
		this.activeTab = 'active';
	} else {
		this.activeTab2 = 'active';
	}
    // this.activeTab = !this.activeTab ? 'active' : '';
    this.stockType = i === 1 ? 'Stock' : 'Cryptocurrency';
  }
  deleteInvestmentItem(content, keyIndex) {
    this.investmentForm.reset();
    this.priceAlertDetails = this.itemList[keyIndex];
    this.priceAlertDetails.keyIndex = keyIndex;

    this.modalService.open(content).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  public getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  DeletePriceAlert() {
    if (this.priceAlertDetails.alertId === '' || this.priceAlertDetails.alertId === undefined) {
      this.modalService.dismissAll();
      return;
    }
    const formData = { alertId: this.priceAlertDetails.alertId };
    const objectType = this;
    this.loading = true;
    this.loadingBar.start();
    this.watchlistService.deletePriceAlert(formData, function(err, response) {
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
        objectType.itemList.splice(objectType.priceAlertDetails.keyIndex, 1);
        objectType.modalService.dismissAll();
      } else {
        objectType.toastr.errorToastr(response.data.message, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
      }
    });
  }

  editPriceAlert(addpricealert,keyIndex) {
	this.tickerList = [];
	this.tickerName = '';
	this.investmentForm.reset();
    this.alertId = '';
    const priceAlert = this.itemList[keyIndex];
    this.tickerId = priceAlert.tickerId;
    this.stockType = priceAlert.tickerType;
	this.toggleActive((this.stockType.toLowerCase() === 'stock') ? 1 :2);
    this.tickerName = priceAlert.name;
	if (this.tickerName !== undefined && this.tickerName !== '') {
      this.investmentForm.controls['ticker'].setValue(this.tickerName +' (' + priceAlert.symbol + ')');
	}
    this.investmentForm.controls['expiryDate'].setValue({ year: 2019, month: 10, day: 25 });
    this.investmentForm.controls['currency'].setValue(priceAlert.currency);
    this.investmentForm.controls['compare'].setValue(priceAlert.alertType);
    this.investmentForm.controls['amount'].setValue(priceAlert.alertAmount);
    this.alertId = priceAlert.alertId;
	this.modalService.open(addpricealert).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  addPriceAlert(addpricealert) {
	this.tickerName = '';
	this.investmentForm.reset();
	this.investmentForm.controls['compare'].setValue('>');
	this.investmentForm.controls['currency'].setValue(this.profileInfo.baseCurrency);
    this.modalService.open(addpricealert).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  checkTargetValidation() {
	 const amt = this.investmentForm.controls['amount'].value;
	 if (amt !== '') {
		 if (!(/^\d+[.,]?\d{0,3}$/g.test(amt))) {
		     const a = amt.split('.');
			  this.investmentForm.controls['amount'].setValue(a[0] + '.' + a[1].substring(0, 3));
		 }
	 }
   }
  /*Return Currency Symbol*/
   returnCurrSymbol(v) {
	  let cur = v;
	  this.currencyItemList.map(function(item) {
			if (item.name === v) {
				cur = item.symbol;
			}
	  });
	  return cur;
   }
}
