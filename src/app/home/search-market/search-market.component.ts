import { Component, OnInit, ElementRef, ViewContainerRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../_services/common.service';
import { WatchlistService } from '../../_services/watchlist.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Title, Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-search-market',
  templateUrl: './search-market.component.html',
  styleUrls: ['./search-market.component.scss'],
  animations: [routerTransition()]
})
export class SearchMarketComponent implements OnInit {
  closeResult: string;
  newsForm: FormGroup;
  model: any = { 'currentCurrency': 'USD', 'searchCriteria': '', 'exchangeId': '', 'stockType': 'STOCK', 'keywords': '', 'range': 10 };
  priceAlert: any = { 'currentCurrency': 'USD', 'amount': '', 'tickerId': '', 'tickerName': '', 'symbol': '', 'compare': '>', 'expiryDate': '', 'tickerIcon': '' };
  priceAlertError: any = { 'amount': false, 'expiryDate': false };
  datepicker: any;
  currentPage = 0;
  totalPage = 0;
  stockType = 'Stock';
  loading = false;
  itemList = [];
  keywords = '';
  checkStatus = true;
  currencyList: any = [];
  currencyItemList: any = [];
  placeholderImageUrl: string;
  activeFilter = false;
  activeTab = 1;
  processing = true;
  isPagination = false;
  pageSearchResult = false;
  searchText = '';
  activeTab2 = 'active';
  curr_array = ['USD', 'SGD', 'INR', 'KD', 'AUD'];
  selectCurr = 'USD';
  criteriaFilter = [{ 'key': 'high', 'value': 'Risers' }, { 'key': 'low', 'value': 'Fallers' }, { 'key': 'market_cap', 'value': 'Market Capitalisation' }];
  stockExchangeType:any;
  currencyPriceList = {};
  tickerMarketCapData:any = { amount: 0, text: '' };
  profileInfo: any;
  defaulterrSomethingMsg = 'Something went wrong';
  stockText = 'Stocks';
  cryptoText = 'Cryptocurrency';
  reStockType = 'Stock';
  targetPriceisRequiredMsg = 'Target Price is required!';
  PriceTo3DecimalPlacesMsg = 'Price should be to 3 decimal place';
  expiryDateisRequiredMsg = 'Expiry Date is required!';
  noRecord = 'No records found.';
  processingTxtOfList = '';
  processingTxt = 'Processing...';
  tryUsingTheSearchBarorAddFilters = 'Try using the search bar or add filters.';
  pageSize = 10;
  pageNo = 0;
  title = 'BullsEye Investors | Search Markets';
  Chooseyourdefaultcurrency = 'Choose your default currency';
  disabledCurrency = true;
  defaultMarket:any;
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
  ) { }
  ngOnInit() {

    this.meta.removeTag('name=title');
    this.meta.removeTag('name=description');
    this.titleService.setTitle(this.title);
    /* Check Token */
    if ((localStorage.getItem('userProfileInfo') === '' || localStorage.getItem('userProfileInfo') === undefined || localStorage.getItem('userProfileInfo') === null) && (localStorage.getItem('userAccessToken') === '' || localStorage.getItem('userAccessToken') === undefined || localStorage.getItem('userAccessToken') === null)) {
      this.router.navigate(['/login']);
    }

    this.profileInfo = JSON.parse(localStorage.getItem('userProfileInfo'));
    /* Set Language Translator */
    this.translate.addLangs(['en', 'ko', 'hi', 'zh', 'es', 'ja']);
    this.translate.setDefaultLang('en');
    const browserLang = (this.profileInfo.defaultLanguage !== undefined && this.profileInfo.defaultLanguage !== '') ? this.profileInfo.defaultLanguage : 'en';
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
    this.translate.get('TargetPriceisRequired').subscribe(value => {
      this.targetPriceisRequiredMsg = value;
    });
    this.translate.get('ExpiryDateisrequired').subscribe(value => {
      this.expiryDateisRequiredMsg = value;
    });
    this.translate.get('Priceto3decimalplaces').subscribe(value => {
      this.PriceTo3DecimalPlacesMsg = value;
    });
    this.translate.get('Norecordsfound').subscribe(value => {

      this.noRecord = value;
    });
    this.translate.get('Tryusingthesearchbaroraddfilters').subscribe(value => {
      this.tryUsingTheSearchBarorAddFilters = value;
    });
    this.translate.get('Processing...').subscribe(value => {
      this.processingTxt = value;
    });
    this.translate.get('Chooseyourdefaultcurrency').subscribe(value => {
      this.Chooseyourdefaultcurrency = value;
    });

    try {
      this.currencyList = this.commonService.getCurrency();
      this.currencyItemList = this.currencyList;
      if (this.profileInfo.isProAccount) {
        this.disabledCurrency = false;
      } else {
        const newKeys = [];
        const objectType = this;
        this.currencyList.map(function (item) {
          if (item.name === objectType.profileInfo.baseCurrency) {
            return newKeys.push({ name: item.name, symbol: item.symbol });
          }
        });
        this.currencyList = newKeys;
      }

    } catch (error) { }
    this.model.currentCurrency = this.profileInfo.baseCurrency;
    this.priceAlert.currentCurrency = this.profileInfo.baseCurrency;
    this._initForm();
    this.placeholderImageUrl = '../assets/images/not-found.png';
    this.model.searchCriteria = 'market_cap';
    const objectNType = this;
    setTimeout(function () {
      objectNType.searchMarketData();
    }, 1000);

  }

  toggleActive(i) {
    if(this.activeTab == i)
    return;
    this.activeTab = i;
    this.reStockType = (i === 1) ? this.stockType : this.cryptoText;
    this.model.stockType = (i === 1) ? this.stockType.toUpperCase() : this.cryptoText;

    this.model.exchangeId = this.defaultMarket.exchangeId;
    this.model.searchCriteria = 'market_cap';

    this.filterExchangeItem();
  }

  private _initForm(): void {
    this.newsForm = this._fb.group({
      newsSearchTxt: ['', Validators.required]
    });
  }
  get n() {
    return this.newsForm.controls;
  }

  searchMarketData(stockTypeData = 'STOCK') {
    this.processingTxtOfList = this.processingTxt;
    const objectType = this;

    this.watchlistService.getExchangeWithData(stockTypeData, function (err, response) {
      // objectType.processing = false;
      if (err) {
        // objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
      }
      if (response.statusCode === 200) {

        if (response.data[0].status === true) {
          objectType.stockExchangeType = response.data[0].data.exchangeList.market;
          objectType.itemList = response.data[0].data.exchangeList.stockList;
          objectType.processing = false;
          if(objectType.stockExchangeType && !objectType.model.exchangeId){
            objectType.defaultMarket = objectType.stockExchangeType.find(element => element.exchangeName == "London Stock Exchange");
            objectType.model.exchangeId = objectType.defaultMarket.exchangeId;
          }
        }
        if (response.data[1].status === true) {
          objectType.currencyPriceList = response.data[1].data;
        }
      }
			/* else
              objectType.toastr.errorToastr(response.data.message, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true}); */

    });
  }

  getCurrencyValue(itemData, key = 'price') {
    const price = (key === 'price') ? itemData.price : itemData.marketCap;
    const keyType = (key === 'price') ? false : true;
    const currency = itemData.currency;
    return this.commonService.getGlobalCurrencyConvertValue(this.currencyPriceList, price, currency, this.model.currentCurrency, keyType);

  }

  ChangeCurrency() {
    const updateItem = this.itemList;
    this.itemList = updateItem;
  }
  getCurrencyMarketValue(itemData, key = 'price') {
    const price = (key === 'price') ? itemData.price : itemData.marketCap;
    const keyType = (key === 'price') ? false : true;
    const currency = itemData.currency;
    const finalPrice = this.commonService.getGlobalCurrencyConvertValue(this.currencyPriceList, price, currency, this.model.currentCurrency, keyType);
    if (Math.abs(finalPrice) > 1000000) {
      let douValue = finalPrice / 1000000;
      let sy = 'm';
      if (douValue > 1000) {
        sy = 'b';
        douValue = douValue / 1000;
      }
      this.tickerMarketCapData = { amount: (douValue), text: sy };
    } else {
      this.tickerMarketCapData = { amount: (finalPrice), text: '' };
    }
  }
  checkAndRemoveList() {

    if (this.model.exchangeId === '' && this.model.searchCriteria === '' && this.model.keywords === '') {
      /*this.itemList = [];
      this.processing = true;
      this.processingTxtOfList = this.noRecord + ' ' + this.tryUsingTheSearchBarorAddFilters;*/
      this.processing = true;
      this.searchMarketData();
    }
  }
  /*---------------------- Filter Exchange Item ------------------------*/
  filterExchangeItem() {

    const objectType = this;
    if (this.model.currentCurrency === '') {
      objectType.toastr.errorToastr(objectType.Chooseyourdefaultcurrency, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
      return false;
    }
    //
    /* Set Result If we cleared althings*/
    if (this.model.exchangeId === '' && this.model.searchCriteria === '' && this.model.keywords === '') {
      // objectType.processing = true;
      // objectType.processingTxtOfList = objectType.noRecord + ' ' + objectType.tryUsingTheSearchBarorAddFilters;
      objectType.activeFilter = false;
      return false;
    } else {
      objectType.processing = false;
      objectType.processingTxtOfList = objectType.processingTxt;
    }
    objectType.itemList = [];
    if (this.model.keywords !== '') {
      this.model.exchangeId = this.model.searchCriteria = '';
    } else if (this.model.exchangeId !== '' || this.model.searchCriteria !== '') {
      this.model.keywords = '';
    }

    let queryString = '';
    if (this.model.exchangeId !== '') {
      queryString += (queryString !== '') ? '&exchangeId=' + this.model.exchangeId : '?exchangeId=' + this.model.exchangeId;
    }
    if (this.model.searchCriteria !== '') {
      queryString += (queryString !== '') ? '&order=' + this.model.searchCriteria : '?order=' + this.model.searchCriteria;
    } else {
      queryString += (queryString !== '') ? '&order=high' : '?order=high';
    }

    if (this.model.stockType !== '') {
      queryString += (queryString !== '') ? '&stockType=' + this.model.stockType : '?stockType=' + this.model.stockType;
    }
    if (this.model.keywords !== '') {
      queryString += (queryString !== '') ? '&keyword=' + this.model.keywords : '?keyword=' + this.model.keywords;
    }
    this.pageSize =  this.model.range;
    queryString += (queryString !== '') ? '&startIndex=' + this.pageNo + '&pageSize=' + this.pageSize : '?startIndex=' + this.pageNo + '&pageSize=' + this.pageSize;

    objectType.processing = true;
    this.watchlistService.filterExchange(queryString, function (err, response) {
      if (err) {
        objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
        objectType.processing = true;
        objectType.processingTxtOfList = this.noRecord + ' ' + this.tryUsingTheSearchBarorAddFilters;
      }
      if (response.statusCode === 200) {

        if (response.data.status === true) {
          if (Object.keys(response.data.data.exchangeList.stockList).length > 0) {
            objectType.processing = false;
            objectType.processingTxtOfList = '';
            objectType.itemList = response.data.data.exchangeList.stockList;
          } else {
            objectType.processing = true;
            objectType.processingTxtOfList = objectType.noRecord + ' ' + objectType.tryUsingTheSearchBarorAddFilters;
          }
        } else {
          objectType.processing = true;
          objectType.processingTxtOfList = objectType.noRecord + ' ' + objectType.tryUsingTheSearchBarorAddFilters;
        }
        objectType.activeFilter = false;
      } else {
        objectType.toastr.errorToastr(((response.data.message === undefined || response.data.message === '') ? objectType.defaulterrSomethingMsg : response.data.message), null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
        objectType.processing = true;
        objectType.processingTxtOfList = objectType.noRecord + ' ' + objectType.tryUsingTheSearchBarorAddFilters;
      }
    });

  }

  open(content, keyIndex) {
    const tickerDetails = this.itemList[keyIndex];
    this.priceAlert.tickerName = tickerDetails.tickerName;
    this.priceAlert.symbol = tickerDetails.symbol;
    this.priceAlert.amount = '';
    this.priceAlert.tickerId = tickerDetails.id;
    this.priceAlert.tickerIcon = (tickerDetails.tickerUrl !== '' && tickerDetails.tickerUrl !== undefined) ? tickerDetails.tickerUrl : '../assets/images/not-found.png';
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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

  addToWatchlist(tickerId, keyIndex) {
    const objectType = this;
    this.commonService.addWatchList({ 'tickerId': tickerId }, function (err, response) {
      if (err) {
        objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
      }
      if (response.statusCode === 200) {
        if (response.data.status === true) {
          objectType.itemList[keyIndex].isWatchList = 1;
        }
        objectType.toastr.successToastr(response.data.message, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });

      } else {

        objectType.toastr.errorToastr(response.data.message, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
        /*if(response.statusCode == 401) {
          localStorage.removeItem("userAccessToken");
          localStorage.removeItem("userProfileInfo");
          objectType.router.navigate(['/login']);
        }*/

      }
    });
  }

  setPriceAlert() {
    this.priceAlertError.amount = (this.priceAlert.amount !== undefined && this.priceAlert.amount !== '') ? false : true;
    this.priceAlertError.expiryDate = (this.priceAlert.expiryDate !== undefined && this.priceAlert.expiryDate !== '') ? false : true;
    if (this.priceAlertError.amount) {
      this.toastr.errorToastr(this.targetPriceisRequiredMsg, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
      return false;
    } else {
      if (!(/^\d+[.,]?\d{0,3}$/g).test(this.priceAlert.amount)) {
        this.toastr.errorToastr(this.PriceTo3DecimalPlacesMsg, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
        return false;
      }
    }
    if (this.priceAlertError.expiryDate) {
      this.toastr.errorToastr(this.expiryDateisRequiredMsg, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
      return false;
    }
    const month = (this.priceAlert.expiryDate.month < 10) ? '0' + this.priceAlert.expiryDate.month : this.priceAlert.expiryDate.month;
    const day = (this.priceAlert.expiryDate.day < 10) ? '0' + this.priceAlert.expiryDate.day : this.priceAlert.expiryDate.day;
    const expiryDatevalue = day + '/' + month + '/' + this.priceAlert.expiryDate.year;

    const formData = { 'tickerId': this.priceAlert.tickerId, 'alertPriceType': this.priceAlert.compare, 'priceThreshold': this.priceAlert.amount, 'expiryDate': expiryDatevalue, 'currency': this.priceAlert.currentCurrency };
    const objectType = this;
    this.loading = true;
    this.loadingBar.start();
    this.commonService.addPriceAlert(formData, function (err, response) {
      objectType.loading = false;
      objectType.loadingBar.stop();
      if (err) {
        objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
      }
      if (response.statusCode === 200) {
        objectType.toastr.successToastr(response.data.message, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
        objectType.modalService.dismissAll();
      } else {
        objectType.toastr.errorToastr(response.data.message, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
      }
    });
  }
  /*Numeric value with decimal value*/
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) ? false : true;
  }
  goToTickerDetails(tickerId, tickerCurrency, tickerType, tickerName, tickerSymbol, watchlistId) {
    if (tickerId > 0 && (tickerCurrency !== '' && tickerCurrency !== undefined) && (tickerType !== '' && tickerType !== undefined)) {
      localStorage.setItem('tickerId', tickerId);
      localStorage.setItem('tickerCurrency', tickerCurrency);
      localStorage.setItem('tickerType', tickerType);
      localStorage.setItem('tickerName', tickerName);
      localStorage.setItem('tickerSymbol', tickerSymbol);
      localStorage.setItem('watchlistId', (watchlistId === '') ? '0' : watchlistId);
      localStorage.setItem('pageTickerRequest', 'serach-market');
      this.router.navigate(['/investment/' + tickerSymbol + '/' + tickerName]);

    } else {
      this.toastr.errorToastr(this.defaulterrSomethingMsg, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
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
  checkTargetValidation() {
    if (this.priceAlert.amount !== '') {
      if (!(/^\d+[.,]?\d{0,3}$/g.test(this.priceAlert.amount))) {
        const a = this.priceAlert.amount.split('.');
        this.priceAlert.amount = a[0] + '.' + a[1].substring(0, 3);
      }
    }
  }
}
