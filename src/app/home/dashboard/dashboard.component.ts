import { Component, OnInit, ElementRef,  ViewContainerRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { state, style, transition, animate, trigger, AUTO_STYLE } from '@angular/animations';
import { PortfolioService } from '../../_services/portfolio.service';
import { WatchlistService } from '../../_services/watchlist.service';
import { CommonService } from '../../_services/common.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Title, Meta } from '@angular/platform-browser';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
declare var jQuery: any, intlTelInput: any, intlTelInputUtils: any;
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
	title=' BullsEye Investors | Home';
    constructor(private translate: TranslateService,private portfolioService: PortfolioService, private watchListService: WatchlistService, private commonService: CommonService, vcr: ViewContainerRef, private router: Router,private activeRoute: ActivatedRoute,public toastr: ToastrManager, private modalService: NgbModal, private loadingBar: LoadingBarService,private titleService: Title,
	private meta: Meta) {
    }
	model: any = {'currentCurrency': 'USD'};
	priceAlert: any;
	priceAlertError : any = {'amount' : false, 'expiryDate' : false};
	portfolioForm: any = {'currentCurrency': 'USD', 'name': '', 'portfolioId': '', "type": "stock"};
    portfolioError : any = {'name' : false, 'portfolioId' : false};
	datepicker: any;
	currentPage = 0;
	totalPage = 0;
	loading = false;
	stockType = 'Stock';
	portfolioList = [];
	watchlist = [];
	disabledCurrency = true;
	currencyPriceList = {};
	watchListCurrency = 'USD';
	currencyList: any = [];
	currencyItemList: any = [];
	profileInfo: any;
	closeResult: string;
	processing = true;
	btnText = '';
	ind = 0;
	deleteType = '';
	modelText = '';
    math = Math;
	tickerMarketCapData: any;
	imgUrl ='';
	portfolioEditInd=0;
	showBannerIcon=false;
	defaulterrSomethingMsg='Something went wrong';
	confirmMsg='Confirm';
	areYouSureMsg='Are you sure want to remove item ?';
	areYoueSurePortfolioMsg='Are you sure you want to delete this portfolio?';
	areYoueSureWatchlistMsg='Are you sure you want to delete <ticker> from your watchlist?';
	processingTxt='Processing...';
	targetPriceisRequiredMsg="Target Price is required!";
	expiryDateisRequiredMsg="Expiry Date is required!";
	PriceTo3DecimalPlacesMsg="Target Price should be to 3 decimal place";
	criteriaFilter = [{'key': 'high', 'value' : 'Top 10 by 24 Hour Change'}, {'key': 'low', 'value' : 'Bottom 10 by 24 Hour Change'}, {'key': 'market_cap', 'value' : 'Top 10 by Market Capitalisation'}];
	
	currentTime = new Date();
	priceAlertStartDateFrom = { year: this.currentTime.getFullYear(), month: this.currentTime.getMonth() + 1, day: this.currentTime.getDate() };
	
	priceAlertCurrencySymbol = '$';

    ngOnInit() {		
		 /* Check Token */
		if ((localStorage.getItem('userProfileInfo') === '' || localStorage.getItem('userProfileInfo') === undefined || localStorage.getItem('userProfileInfo') === null) && (localStorage.getItem('userAccessToken') === '' || localStorage.getItem('userAccessToken') === undefined || localStorage.getItem('userAccessToken') === null) && (localStorage.getItem('loginUserName') === '' || localStorage.getItem('loginUserName') === undefined || localStorage.getItem('loginUserName') === null)) { 
			this.router.navigate(['/login']);
		}
		else{
			if(this.activeRoute.snapshot.queryParams){
				if(this.activeRoute.snapshot.params.username!=undefined && this.activeRoute.snapshot.params.username!=null){
					if(this.activeRoute.snapshot.params.username!=localStorage.getItem('loginUserName'))
						this.router.navigate(['/login']);
				}
				else
					this.router.navigate(['/login']);
			}
			else {
				this.router.navigate(['/login']);
			}
		}
		this.title="BullsEye Investors | Home | "+localStorage.getItem('loginUserName');
		this.titleService.setTitle(this.title);
		this.profileInfo = JSON.parse(localStorage.getItem('userProfileInfo'));
		this.imgUrl = this.profileInfo.img;
		 /* Set Language Translator */
		this.translate.addLangs(['en', 'ko', 'hi', 'zh', 'es', 'ja']);
		this.translate.setDefaultLang('en');
		const browserLang = (this.profileInfo.defaultLanguage!=undefined && this.profileInfo.defaultLanguage!='')?this.profileInfo.defaultLanguage:'en';
		this.translate.use(browserLang.match(/en|ko|hi|zh|es|ja/) ? browserLang : 'en');
		this.translate.get('Somethingwentwrong').subscribe(value => {
			this.defaulterrSomethingMsg=value;
		});
		this.translate.get('Confirm').subscribe(value => {
			this.confirmMsg=value;
		});
		this.translate.get('Areyousurewant').subscribe(value => {
			this.areYouSureMsg=value;
		});
		this.translate.get('Processing...').subscribe(value => {
			this.processingTxt=value;
		});
		this.translate.get('TargetPriceisRequired').subscribe(value => {
			this.targetPriceisRequiredMsg=value;
		});
		this.translate.get('ExpiryDateisrequired').subscribe(value => {
			this.expiryDateisRequiredMsg=value;
		});
		this.translate.get('Areyousureyouwanttoremoveportfolio').subscribe(value => {
			this.areYoueSurePortfolioMsg=value;
		});
		this.translate.get('Areyousureyouwanttoremovewatchlist').subscribe(value => {
			this.areYoueSureWatchlistMsg=value;
		});
		this.translate.get('Priceto3decimalplaces').subscribe(value => {
			this.PriceTo3DecimalPlacesMsg=value;
		});
		/* Get All Static Currency*/
		try {
			this.currencyList = this.commonService.getCurrency();
			this.currencyItemList = this.currencyList;
		}
		catch (error) {}

    	// this.watchListCurrency = this.profileInfo.watchListCurrency;
    	// this.model.currentCurrency = this.watchListCurrency;
		// this.model.currentCurrency = this.profileInfo.baseCurrency;


		this.watchListCurrency = this.profileInfo.baseCurrency;
		this.model.currentCurrency = this.watchListCurrency;
		this.priceAlert= {'currentCurrency': this.watchListCurrency, 'amount': '', 'tickerId': '', 'tickerName': '', 'symbol' : '', 'compare' : '>', 'expiryDate' : '','tickerIcon':''};
		this.portfolioForm.currentCurrency=this.watchListCurrency;
		this.priceAlert.currentCurrency =this.profileInfo.baseCurrency;
    	if (this.profileInfo.isProAccount) {
    		this.disabledCurrency = false;
     } else {
			let newKeys =[];
			const objectType = this;
			this.currencyList.map(function(item) {
				if(item.name ==objectType.watchListCurrency) {
					return newKeys.push({name:item.name,symbol:item.symbol});
				}
			});
			this.currencyList=newKeys;
		}
		const objectNType = this;
		setTimeout(function() {
			objectNType.getPageContent();
		},1000);
		// this.getPageContent();
		
		this.priceAlertCurrencySymbol = this.returnCurrSymbol(this.watchListCurrency);

	}
	ChangePriceAlertCurrencySymbol(currency) {
		this.priceAlertCurrencySymbol = this.returnCurrSymbol(currency);
	}
    getPageContent() {
    	const objectType = this;
		objectType.loadingBar.start();

    	this.portfolioService.getHomePageData(function(err, response) {
			objectType.showBannerIcon =true;
    		if ( err ) {
              objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
			}
          	if( response.statusCode === 200 ) {
				  if (response.data[0].status === true) {
          			objectType.portfolioList = response.data[0].portfolioList;
						}
				  if (response.data[1].status === true) {

						}
          			objectType.watchlist = response.data[1].watchList;
          		if (response.data[2].status === true) {
          			objectType.currencyPriceList = response.data[2].data;
            }
          	} else {
          		objectType.toastr.errorToastr(((response.data.message==undefined || response.data.message=='')? objectType.defaulterrSomethingMsg:response.data.message), null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
          		if(response.statusCode == 401) {
					localStorage.clear();
          			objectType.router.navigate(['/login']);
          		}
          	}
          	objectType.processing = false;
			objectType.loadingBar.stop();
    	});
    }
    getCurrencyValue(watchListData, key = 'price') {
    	const price = (key === 'price') ? watchListData.price : watchListData.market_cap;
		const keyType = (key === 'price') ? false : true;
    	const currency = watchListData.currency;
    	return this.commonService.getGlobalCurrencyConvertValue(this.currencyPriceList, price, currency, this.watchListCurrency,keyType);
    }

	getCurrencyMarketValue(watchListData, key = 'price') {
      const price = (key === 'price') ? watchListData.price : watchListData.market_cap;
	  const keyType = (key === 'price') ? false : true;
      const currency = watchListData.currency;

      const finalPrice =  this.commonService.getGlobalCurrencyConvertValue(this.currencyPriceList, price, currency, this.watchListCurrency,keyType);

	   if (finalPrice > 1000000) {
		    let douValue = finalPrice / 1000000;
            let  sy = 'm';
            if (douValue > 1000) {
                sy = 'b';
                douValue = douValue / 1000;
            }
			this.tickerMarketCapData = {amount : (douValue), text : sy};
       } else {
		   this.tickerMarketCapData = {amount : (finalPrice), text : ''};
				}
    }
  ChangeWatchListCurrency() {
  	this.loadingBar.start();
  	this.watchListCurrency = this.model.currentCurrency;
  	const watchlistData = this.watchlist ;
  	this.watchlist = [];
  	this.watchlist = watchlistData;
  	this.loadingBar.stop();
  }
	addPortfolio() {
		this.router.navigate(['/portfolio']);
	}


  /*---------------------- Delete WatchList Item ---------------------------*/
  deleteWatchListItem(watchListIndex, content) {
    const watchListItemDetails = this.watchlist[watchListIndex];
    const objectType = this;
    objectType.loadingBar.start();
    this.watchListService.delete({'watchlistId' : watchListItemDetails.watchlistId}, function(err, response) {
      if ( err ) {
          objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
      }
      if ( response.statusCode === 200 ) {
        objectType.toastr.successToastr(response.data.message, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
        objectType.watchlist.splice(watchListIndex, 1);
      } else {

        objectType.toastr.errorToastr(response.data.message, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
        /*if(response.statusCode == 401) {
          localStorage.removeItem("userAccessToken");
          localStorage.removeItem("userProfileInfo");
          objectType.router.navigate(['/login']);
        }*/

      }
      objectType.loadingBar.stop();
      objectType.modalService.dismissAll();
    });
  }

  /*------------------------ Delete Portfolio Item -------------------------*/
  deletePortfolioItem(portfolioListIndex, content) {
    const portfolioDetailsDetails = this.portfolioList[portfolioListIndex];
    const objectType = this;
    objectType.loadingBar.start();
    this.portfolioService.delete({'portfolioid' : portfolioDetailsDetails.portfolioId}, function(err, response) {
      if ( err ) {
          objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
      }
      if ( response.statusCode === 200 ) {
        objectType.toastr.successToastr(response.data.message, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
        objectType.portfolioList.splice(portfolioListIndex, 1);
      } else {
        objectType.toastr.errorToastr(((response.data.message==undefined || response.data.message=='') ? objectType.defaulterrSomethingMsg:response.data.message), null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
		if(response.statusCode == 401) {
			localStorage.clear();
			objectType.router.navigate(['/login']);
		}

      }
      objectType.loadingBar.stop();
      objectType.modalService.dismissAll();
    });
  }


  /*------------------------ Delete Poppup ---------------------------------*/
  /*Modal Popup*/
  open(content, itemIndex, keyItem, obj?) {
    this.btnText = this.confirmMsg;
    this.ind = itemIndex;
    this.deleteType = keyItem;
	this.modelText = (keyItem=='portfolio')?this.areYoueSurePortfolioMsg :this.areYoueSureWatchlistMsg;
	
	if(obj && obj.tickerName){
		this.modelText = this.modelText.replace('<ticker>', obj.tickerName);
	}
	this.modalService.open(content).result.then((result) => {
		this.closeResult = `Closed with: ${result}`;
	}, (reason) => {
		this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
	});
  }
  private getDismissReason(reason: any): string {
      if (reason === ModalDismissReasons.ESC) {
          return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
          return 'by clicking on a backdrop';
      } else {
          return  `with: ${reason}`;
      }
  }

  /*--------------------------------- Edit Portfolio --------------------------*/
  editPortfolio(content, itemIndex, keyItem) {
      this.portfolioEditInd=itemIndex;
      const portfolioDetails = this.portfolioList[itemIndex];
      this.portfolioForm.name = portfolioDetails.name;
      this.portfolioForm.portfolioId = portfolioDetails.portfolioId;
      this.portfolioForm.currentCurrency = portfolioDetails.currency;
      this.portfolioForm.type = portfolioDetails.type;
      this.modalService.open(content).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }

  /*--------------------------------- Update Portfolio ------------------------*/
  updatePortfolio() {
    if(this.portfolioForm.name == '' || this.portfolioForm.name == undefined) {
      this.portfolioError.name = true;
      return false;
    } else {
        this.portfolioError.name = false;
    }
    const formData = {'name' : this.portfolioForm.name, 'type': this.portfolioForm.type, 'currency' : this.portfolioForm.currentCurrency, 'portfolioId': this.portfolioForm.portfolioId};
    const objectType = this;
    this.loading =true;
    this.loadingBar.start();
    this.portfolioService.addPortfolio(formData, function(err, response) {
      objectType.loading = false;
      objectType.loadingBar.stop();
      if( err ) {
        objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
      }
      if( response.statusCode == 200 ) {
        objectType.toastr.successToastr(response.data.message,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
		if(Object.keys(objectType.portfolioList[objectType.portfolioEditInd]).length> 0) {
			objectType.portfolioList[objectType.portfolioEditInd].name=objectType.portfolioForm.name;
			objectType.portfolioList[objectType.portfolioEditInd].currency =objectType.portfolioForm.currentCurrency;
			// objectType.portfolioList[objectType.portfolioEditInd].currency=objectType.portfolioForm.currentCurrency;
		}
        objectType.modalService.dismissAll();
      } else {
        objectType.toastr.errorToastr(response.data.message,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
      }
    });

  }
  deleteItems(content, indexVal, deleteItemType) {
    if (this.btnText === this.processingTxt) {
      return false;
    }
    this.btnText = this.processingTxt;
    if (deleteItemType === 'watchlist') {
      this.deleteWatchListItem(indexVal, content);
    } else if (deleteItemType === 'portfolio') {
      this.deletePortfolioItem(indexVal, content);
         }
  }

  openAlert(content, keyIndex) {
	if (!this.profileInfo.isProAccount) {
		localStorage.setItem('proActive','false');
		this.router.navigateByUrl('/check-pro', {skipLocationChange: true}).then(() =>
		this.router.navigate(['/account-settings']));
	} else {
		localStorage.setItem('proActive','');
		const tickerDetails = this.watchlist[keyIndex];
		this.priceAlert.tickerName = tickerDetails.tickerName;
		this.priceAlert.symbol = tickerDetails.symbol;
		this.priceAlert.amount = '';
		this.priceAlert.tickerId = tickerDetails.id;
		this.priceAlert.tickerIcon = (tickerDetails.tickerUrl!=='' && tickerDetails.tickerUrl!==undefined) ? tickerDetails.tickerUrl :'../assets/images/not-found.png';
		this.modalService.open(content).result.then((result) => {
		  this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
		  this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
	}
  }

  goToPortfolioDetails(portfolioId,portfolioCurrency,portfolioType,portfolioName) {
    if (portfolioId > 0 && portfolioCurrency !== '' && portfolioType !== '' && portfolioName !== '') {
		localStorage.setItem('portfolioId',portfolioId);
		localStorage.setItem('portfolioType', portfolioType);
		localStorage.setItem('portfolioCurrency', portfolioCurrency);
		localStorage.setItem('portfolioName', portfolioName);
		this.router.navigate([''+portfolioName+'/' + localStorage.getItem('loginUserName')]);
    } else {
		this.toastr.errorToastr(this.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
    }
  }
  goToTickerDetails(tickerId,tickerCurrency,tickerType,tickerName,tickerSymbol,watchlistId) {
	  if (tickerId > 0 && (tickerCurrency !== '' && tickerCurrency !== undefined) && (tickerType !== '' && tickerType !== undefined) && (watchlistId !== undefined && watchlistId > 0 && watchlistId !== '')) {
		localStorage.setItem('tickerId',tickerId);
		localStorage.setItem('tickerCurrency',tickerCurrency);
		localStorage.setItem('tickerType',tickerType);
		localStorage.setItem('tickerName',tickerName);
		localStorage.setItem('tickerSymbol',tickerSymbol);
		localStorage.setItem('watchlistId',watchlistId);
		localStorage.setItem('pageTickerRequest','dashboard');
		this.router.navigate(['/investment/'+tickerSymbol+'/' + tickerName]);
    } else {
		this.toastr.errorToastr(this.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
			}
  }
  setPriceAlert() {
	this.priceAlertError.amount = (this.priceAlert.amount !==undefined && this.priceAlert.amount!=='') ? false :true;
	this.priceAlertError.expiryDate = (this.priceAlert.expiryDate !== undefined && this.priceAlert.expiryDate !== '') ? false :true;
	if(this.priceAlertError.amount) {
		this.toastr.errorToastr(this.targetPriceisRequiredMsg,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
		return false;
	} else {
		if (!(/^\d+[.,]?\d{0,3}$/g).test(this.priceAlert.amount)) {
		  this.toastr.errorToastr(this.PriceTo3DecimalPlacesMsg,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
		  return false;
		}
	}
	if(this.priceAlertError.expiryDate) {
		this.toastr.errorToastr(this.expiryDateisRequiredMsg,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
		return false;
	}
    const month = (this.priceAlert.expiryDate.month < 10 ) ? '0' + this.priceAlert.expiryDate.month : this.priceAlert.expiryDate.month;
    const day = (this.priceAlert.expiryDate.day < 10 ) ? '0' + this.priceAlert.expiryDate.day : this.priceAlert.expiryDate.day;
    const expiryDatevalue = day+'/'+month + '/' + this.priceAlert.expiryDate.year;

    const formData = {'tickerId': this.priceAlert.tickerId, 'alertPriceType' : this.priceAlert.compare, 'priceThreshold': this.priceAlert.amount, 'expiryDate': expiryDatevalue, 'currency': this.priceAlert.currentCurrency};
    const objectType = this;
    this.loading = true;
    this.loadingBar.start();
    this.commonService.addPriceAlert(formData, function(err, response) {
      objectType.loading = false;
      objectType.loadingBar.stop();
      if ( err ) {
        objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
      }
      if ( response.statusCode === 200 ) {
        objectType.toastr.successToastr(response.data.message, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
        objectType.modalService.dismissAll();
      } else {
		 objectType.toastr.errorToastr(((response.data.message === undefined || response.data.message === '') ? objectType.defaulterrSomethingMsg : response.data.message), null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
		 if (response.statusCode === 401) {
			localStorage.clear();
			objectType.router.navigate(['/login']);
		 }
	  }
    });
  }
  setTagetValueWith3Digit() {
	  if (this.priceAlert.amount !== '') {
		 const amt = parseFloat(this.priceAlert.amount);
		 this.priceAlert.amount = amt.toFixed(3);
	  }
   }
  /*Numeric value with decimal value*/
  numberOnly(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      return (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) ? false : true;
  }
  checkTargetValidation() {
	 if (this.priceAlert.amount !== '') {
		 if (!(/^\d+[.,]?\d{0,3}$/g.test(this.priceAlert.amount))) {
		     const a = this.priceAlert.amount.split('.');
			 this.priceAlert.amount = a[0] + '.' + a[1].substring(0, 3);
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
	drop(event: CdkDragDrop<string[]>) {
		const currentIndex = event.currentIndex;
		const previousIndex = event.previousIndex;
		moveItemInArray(this.watchlist, event.previousIndex, event.currentIndex);
		this.loading = true;
	    this.loadingBar.start();
	    const objectType = this;
	    const formData = {'currentOrderNo': previousIndex +1 , 'newOrderNo': currentIndex+1, 'watchlistId' : this.watchlist[currentIndex].watchlistId};

	    this.watchListService.changeWatchListOrder(formData, function(err, response) {

	      objectType.loading = false;
	      objectType.loadingBar.stop();
	      if ( err ) {
	        objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
	      }
	      if ( response.statusCode === 200 ) {
	        objectType.toastr.successToastr(response.data.message, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
	        objectType.modalService.dismissAll();
	      } else {
			 objectType.toastr.errorToastr(((response.data.message === undefined || response.data.message === '') ? objectType.defaulterrSomethingMsg : response.data.message), null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
			 if (response.statusCode === 401) {
				localStorage.clear();
				objectType.router.navigate(['/login']);
			 }
		  }
	    });

	}
	dropPortfolio(event: CdkDragDrop<string[]>) {
		const currentIndex = event.currentIndex;
		const previousIndex = event.previousIndex;
		moveItemInArray(this.portfolioList, event.previousIndex, event.currentIndex);
		this.loading = true;
	    this.loadingBar.start();
	    const objectType = this;
	    const formData = {'currentOrderNo': previousIndex + 1 , 'newOrderNo': currentIndex + 1, 'portfolioId' : this.portfolioList[currentIndex].portfolioId};

	    this.portfolioService.changeWatchListOrder(formData, function(err, response) {

	      objectType.loading = false;
	      objectType.loadingBar.stop();
	      if ( err ) {
	        objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
	      }
	      if ( response.statusCode === 200 ) {
	        objectType.toastr.successToastr(response.data.message, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
	        objectType.modalService.dismissAll();
	      } else {
			 objectType.toastr.errorToastr(((response.data.message === undefined || response.data.message === '') ? objectType.defaulterrSomethingMsg : response.data.message), null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
			 if (response.statusCode === 401) {
				localStorage.clear();
				objectType.router.navigate(['/login']);
			 }
		  }
	    });

	}

	formatNumber(num) {
		const numNew=num.toString();
		if(numNew.indexOf('.') > -1) {
			const vSplitValue =numNew.split('.');
			const v =vSplitValue[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
			return v + '.' + vSplitValue[1];
		} else {
			return numNew.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
		}
	  }
	    
	formateBERF(finalPrice) {
		finalPrice = (finalPrice) ? parseFloat(finalPrice) : 0;
		if (Math.abs(finalPrice) > 1000000) {
			let douValue = finalPrice / 1000000;
			return this.formatNumber(douValue.toFixed(1)) + 'm';
		} else if (Math.abs(finalPrice) > 999) {
			let douValue = finalPrice / 1000;
			return this.formatNumber(douValue.toFixed(1)) + 'k';
		} else {
			return this.formatNumber(parseInt(finalPrice.toFixed(1)));
		}
	}

}
