import { Component, OnInit, ViewContainerRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { routerTransition } from '../../router.animations';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CommonService } from '../../_services/common.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Title, Meta } from '@angular/platform-browser';
import { PredictionService } from '../../_services/prediction.service';
import { ChatService } from '../../_services/chat.service';

@Component({
  selector: 'app-price-prediction',
  templateUrl: './price-prediction.component.html',
  styleUrls: ['./price-prediction.component.scss'],
  animations: [routerTransition()]
})
export class PricePredictionComponent implements OnInit {
  closeResult: string;
  predictionForm: FormGroup;
  submitted = false;
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
  processing = true;
  closeProcessing = true;
  stockType = 'Stock';
  itemList: any = [];
  closedItemList: any = [];
  profileInfo: any;
  currencyList: any = [];
  searchText = '';
  activeTab = 'active';
  activeTab2 = '';
  curr_array = ['USD', 'SGD', 'INR', 'KD', 'AUD'];
  selectCurr = 'USD';
  defaulterrSomethingMsg = 'Something went wrong';
  stockText = 'Stocks';
  cryptoText = 'Cryptocurrency';
  tickerNameReq = 'Ticker name is required';
  processingTxt = 'Processing...';
  closeProcessingTxt = 'Processing...';
  title = 'BullsEye Investors | Price Prediction';
  targetPriceisRequiredMsg = 'Target Price is required!';
  noPricePredictionText = 'No price prediction found.';
  noPricePredictionHistoryText = 'No price prediction history found.';
  currentTime = new Date();
  isPagination = false;
  currentPage = 0;
  totalPage = 0;
  totalRecords = 0;
  prevLoading = false;
  nextLoading = false;
  pageSize = 10;
  pageNo = 1;
  sharingText = '';
  sharingWithHashText = '';
  sharingTicker = '';
  predictionStartDate = new Date();
  predictionStartDateFrom = { year: this.currentTime.getFullYear(), month: this.currentTime.getMonth() + 1, day: this.currentTime.getDate() };

  constructor(
    private translate: TranslateService,
    private commonService: CommonService,
    private predictionService: PredictionService,
    private chatService: ChatService,
    private _fb: FormBuilder,
    vcr: ViewContainerRef,
    private router: Router,
    public toastr: ToastrManager,
    private modalService: NgbModal,
    private loadingBar: LoadingBarService,
    private titleService: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit() {
    this.predictionStartDate.setDate(this.predictionStartDate.getDate() + 7);
    this.predictionStartDateFrom = {
      year: this.predictionStartDate.getFullYear(),
      month: this.predictionStartDate.getMonth() + 1,
      day: this.predictionStartDate.getDate()
    };
    this.document.body.classList.add('modal-index');
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
    if (!this.profileInfo.isProAccount) {
      localStorage.setItem('proActive', 'false');
      this.router.navigateByUrl('/check-pro', { skipLocationChange: true }).then(() =>
        this.router.navigate(['/account-settings']));
    } else {
      localStorage.setItem('proActive', '');
    }
    /* Set Language Translator */
    this.translate.addLangs(['en', 'ko', 'hi', 'zh', 'es', 'ja']);
    this.translate.setDefaultLang('en');
    const browserLang =
      this.profileInfo.defaultLanguage !== undefined && this.profileInfo.defaultLanguage !== '' ? this.profileInfo.defaultLanguage : 'en';
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
      this.closeProcessingTxt = value;
    });
    this.translate.get('TargetPriceisRequired').subscribe(value => {
      this.targetPriceisRequiredMsg = value;
    });
    this.translate.get('noPricePredictionText').subscribe(value => {
      this.noPricePredictionText = value;
    });
    this.translate.get('noPricePredictionHistoryText').subscribe(value => {
      this.noPricePredictionHistoryText = value;
    });
    try {
      this.currencyList = this.commonService.getCurrency();
      this.currencyItemList = this.currencyList;

    } catch (error) { }
    this._initForm();
    this.openPricePredictionList();
    this.closedPricePredictionList();
  }
  private _initForm(): void {
    this.predictionForm = this._fb.group({
      ticker: ['', Validators.required],
      amount: ['', Validators.required],
      predictionForDate: ['', [Validators.required]],
      currency: [this.profileInfo.baseCurrency, [Validators.required]]
    });
  }
  get i() {
    return this.predictionForm.controls;
  }
  valuechange($event) {
    const objectType = this;
    setTimeout(function () {
      const term = objectType.predictionForm.controls['ticker'].value;
      if (term !== '' && objectType.res === false && objectType.resTickerAutoComp === false) {
        objectType.loadingBar.start();
        objectType.res = true;
        objectType.commonService.getTickerList(term, objectType.stockType, function (err, response) {

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
    if (this.predictionForm.controls['amount'].value !== '') {
      const amt = parseFloat(this.predictionForm.controls['amount'].value);
      this.predictionForm.controls['amount'].setValue(amt.toFixed(3));
    }
  }
  openPricePredictionList() {
    const objectType = this;
    objectType.itemList = [];
    objectType.processingTxt = objectType.processingTxt;
    objectType.processing = true;
    this.predictionService.openPricePredictionList(function (err, response) {
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
          objectType.processingTxt = objectType.noPricePredictionText;
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
      }
    });
  }

  closedPricePredictionList() {
    const objectType = this;
    objectType.closedItemList = [];
    this.nextLoading = this.prevLoading = false;
    objectType.closeProcessingTxt = objectType.processingTxt;
    objectType.closeProcessing = true;
    objectType.loadingBar.start();
    this.predictionService.closedPricePredictionList(this.pageSize, this.pageNo, function (err, response) {
      if (err) {
        objectType.closeProcessingTxt = objectType.defaulterrSomethingMsg;
        objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {
          autoDismiss: true,
          maxOpened: 1,
          preventDuplicates: true
        });
      }
      if (response.statusCode === 200) {

        if (response.data.data !== undefined && response.data.data.length > 0) {
          objectType.isPagination = true;
          objectType.closedItemList = response.data.data;
          objectType.closeProcessing = false;
        } else {
          objectType.isPagination = false;
          objectType.closeProcessingTxt = objectType.noPricePredictionHistoryText;
        }
        if (objectType.pageNo === 1) {
          objectType.prevLoading = true;
          objectType.totalPage = response.data.totalPage;
          objectType.totalRecords = response.data.totalRecords;
        }
        if (objectType.pageNo === objectType.totalPage) {
          objectType.nextLoading = true;
        }
        // } else {
        //   objectType.toastr.errorToastr(response.data.message, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
        //   this.searchText = response.data.message;
        // }

        // objectType.loadingBar.stop();
      } else {
        objectType.toastr.errorToastr(
          response.data.message === undefined || response.data.message === '' ? objectType.defaulterrSomethingMsg : response.data.message,
          null,
          { autoDismiss: true, maxOpened: 1, preventDuplicates: true }
        );
        objectType.closeProcessingTxt = objectType.defaulterrSomethingMsg;
        if (response.statusCode === 401) {
          localStorage.clear();
          objectType.router.navigate(['/login']);
        }
      }
    });

    objectType.loadingBar.stop();
  }

  addPricePrediction(addpricealert) {
    this.tickerName = '';
    this.predictionForm.reset();
    this.predictionForm.controls['currency'].setValue(this.profileInfo.baseCurrency);
    this.modalService.open(addpricealert).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  setPricePrediction() {
    this.submitted = true;
    this.tickerError = '';
    if (this.tickerName !== undefined && this.tickerName !== '') {
      this.predictionForm.controls['ticker'].setValue(this.tickerName);
    } else {
      this.tickerError = this.tickerNameReq;
    }

    if (this.predictionForm.invalid) {
      return;
    }
    const month =
      this.predictionForm.controls['predictionForDate'].value.month < 10
        ? '0' + this.predictionForm.controls['predictionForDate'].value.month
        : this.predictionForm.controls['predictionForDate'].value.month;
    const day =
      this.predictionForm.controls['predictionForDate'].value.day < 10
        ? '0' + this.predictionForm.controls['predictionForDate'].value.day
        : this.predictionForm.controls['predictionForDate'].value.day;
    const predictionForDatevalue = day + '/' + month + '/' + this.predictionForm.controls['predictionForDate'].value.year;

    const formData = {
      tickerId: this.tickerId,
      prediction: this.predictionForm.controls['amount'].value,
      predictionForDate: predictionForDatevalue,
      currency: this.predictionForm.controls['currency'].value
    };
    const objectType = this;
    this.loading = true;
    this.loadingBar.start();
    this.predictionService.add(formData, function (err, response) {
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
        objectType.predictionForm.reset();
        objectType.openPricePredictionList();
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
  selectTicker(id, amount = 0, symbol, name, currency) {
    this.tickerId = id;
    this.tickerAmount = amount;
    this.tickerName = name + ' (' + symbol + ')';
    this.predictionForm.controls['ticker'].setValue(this.tickerName);
    this.tickerCurrency = currency;
    this.resTickerAutoComp = true;
  }
  resetTickerTxt() {
    this.tickerId = this.tickerAmount = 0;
    this.tickerName = this.tickerCurrency = '';
  }

  toggleActive(i) {
    this.tickerList = [];
    this.activeTab = this.activeTab2 = '';
    if (i === 1) {
      this.activeTab = 'active';
    } else {
      this.activeTab2 = 'active';
    }
    // this.activeTab = !this.activeTab ? 'active' : '';
    this.stockType = i === 1 ? 'Stock' : 'Cryptocurrency';
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

  checkTargetValidation() {
    const amt = this.predictionForm.controls['amount'].value;
    if (amt !== '') {
      if (!(/^\d+[.,]?\d{0,3}$/g.test(amt))) {
        const a = amt.split('.');
        this.predictionForm.controls['amount'].setValue(a[0] + '.' + a[1].substring(0, 3));
      }
    }
  }
  /*Return Currency Symbol*/
  returnCurrSymbol(v) {
    let cur = v;
    this.currencyItemList.map(function (item) {
      if (item.name === v) {
        cur = item.symbol;
      }
    });
    return cur;
  }
  onPageChange(pageNo, checkStatus) {
    this.pageNo = pageNo;
    this.closedPricePredictionList();
  }
  changePagination(i) {
    this.nextLoading = this.prevLoading = false;
    if (i === 0) {
      if (this.pageNo === 1) {
        this.prevLoading = true;
      } else {
        this.prevLoading = false;
        this.pageNo = (this.pageNo - 1);
        this.currentPage = this.pageNo;
        this.onPageChange(this.pageNo, true);
        if (this.pageNo === 1) {
          this.prevLoading = true;
        }
      }
    } else {
      if (this.pageNo === this.totalPage) {
        this.nextLoading = true;
      } else {
        this.nextLoading = false;
        this.pageNo = (this.pageNo + 1);
        this.currentPage = this.pageNo;
        this.onPageChange(this.pageNo, true);
        if (this.pageNo === this.totalPage) {
          this.nextLoading = true;
        }
      }
    }
  }

  formatNumber(num) {
    const numNew = num.toString();
    if (numNew.indexOf('.') > -1) {
      const vSplitValue = numNew.split('.');
      const v = vSplitValue[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      return v + '.' + vSplitValue[1];
    } else {
      return numNew.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
  }

  formatNumberDecimalPlaces(num, decimalplaces) {
    return parseFloat(num).toFixed(decimalplaces);
  }

  sharePrediction(content, ticker, tickerName, currency, prediction, date) {
    prediction = currency + ' ' + this.formatNumber(this.formatNumberDecimalPlaces(prediction, 3));
    this.sharingText = encodeURI( 'My price prediction is for ' + tickerName + ' to be ' + prediction + ' on ' + date + '' );
    this.sharingWithHashText = encodeURI( 'My price prediction is for ' + tickerName + ' to be ' + prediction + ' on ' + date + '. Make your price prediction by registering your BullsEye Pro account here&hashtag=#' + ticker );
    this.sharingTicker = ticker;
    this.modalService.open(content, { windowClass: 'sharemodal', size: 'lg' }).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  sharetochatboard() {
    const objectType = this;
    this.loading = true;
    this.loadingBar.start();
    this.chatService.share(objectType.sharingTicker, objectType.sharingText, function (err, response) {
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
        objectType.modalService.dismissAll();
      } else {
        objectType.toastr.errorToastr(response.data.message, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
      }
    });
  }


  goToChatDetails(chatBoardId, chatName, chatSymbol, chatImage, chatPrice, chatCurrency, stockType) {
    // (chatBoardId, chatName, chatSymbol, chatImage, chatPrice, chatCurrency, favouriteId,change_pct,volume)
    if (chatBoardId > 0) {
      localStorage.setItem('chatBoardId', chatBoardId);
      localStorage.setItem('chatName', chatName);
      localStorage.setItem('chatSymbol', chatSymbol);
      localStorage.setItem('chatImage', (chatImage === '') ? '../assets/images/not-found.png' : chatImage);
      localStorage.setItem('chatPrice', chatPrice);
      localStorage.setItem('chatCurrency', chatCurrency);
      localStorage.setItem('chatType', stockType);
      // localStorage.setItem('chatChangeType', (change_pct=='' || change_pct==null)?0:change_pct);
      // localStorage.setItem('favouriteId', ((favouriteId !== undefined && favouriteId !== '' && favouriteId !== null) ? favouriteId : 0));
      this.router.navigate(['/chat/' + chatSymbol + '/' + chatName]);
    } else {
      this.toastr.errorToastr(this.defaulterrSomethingMsg, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
    }

  }



}
