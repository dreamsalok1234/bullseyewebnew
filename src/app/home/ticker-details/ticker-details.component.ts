import { Component, OnInit, ElementRef,  ViewContainerRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Router, ActivatedRoute } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../_services/common.service';
import { TickerService } from '../../_services/ticker.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
/* Imports */
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { Title, Meta } from '@angular/platform-browser';

@Component({
    selector: 'app-ticker-details',
    templateUrl: './ticker-details.component.html',
    styleUrls: ['./ticker-details.component.scss'],
    animations: [routerTransition()]
})
export class TickerDetailsComponent implements OnInit {
	closeResult: string;
	math = Math;
	model: any = {'currentCurrency': 'USD'};
	filterModel: any = { "searchCriteria": 24, "graphDisplay": 0 };
	profileInfo: any;
	tickerId = 0;
	searchSearchText = '';
	tickerListData: any = [];
	currencyList = [];
	currencyItemList: any = [];
	benkMarchList:any=[];
	currencyPriceList = {};
	watchListCurrency = 'USD';
	formData:any={};
	placeholderImageUrl: string;
	currencyType = '';
	marketCapData: any;
	activeFilter = false;
	activeTab = '';
	tickerDataText = '';
	indMap = 1;
	tickerName = '';
	tickerSymbol = '';
	tickerType = '';
	tickerDetailsCurrency = '';
	isChecked = false;
	watchListId = 0;
	tickerMarketCapData = {};
	num = '';
	type = '';
	loading = false;
	processingText = 'blurTdetails';
	priceAlert: any = {'currentCurrency': 'USD', 'amount': '', 'tickerId': '', 'tickerName': '', 'symbol' : '', 'compare' : '>', 'expiryDate' : '','tickerIcon':''};
	riskPerformanceArray: any = {'tickerId': '', 'tickerName': '', 'symbol' : '','tickerIcon':'','potentialST':'1','potentialMT':'1','potentialLT':'1','riskVolality':'3','riskFundamentals':'1','benkMarchIndex':'0'};
    priceAlertError: any = {'amount' : false, 'expiryDate' : false};
    datepicker: any;
	defaulterrSomethingMsg='Something went wrong';
	processingTxt='Processing...';
	CandlestickText="Candlestick";
	noChartDataText="No chart data available.";
	title='BullsEye Investors | Investment Details';
	tickerNIcon='../assets/images/not-found.png';
	targetPriceisRequiredMsg="Target Price is required!";
	PriceTo3DecimalPlacesMsg="Price should be to 3 decimal place";
	expiryDateisRequiredMsg="Expiry Date is required!";
	tickerAlreadyAddedToYourWatchlist="Ticker already added to your watchlist";
	getBenchMark=false;
	potentialId="0";
	investmentId="0";
	saveRiskText="Save";
	saveRiskBtnText="Save";
	riskEnditiorStatus=false;
	shortTerm="1";
	mediumTerm="1";
	longTerm="1"
	voladility="3";
	fundamentals="1";
	alphaMarketId="0";
	dateText="Date";
	timeText = "Time";
	valueText="Value";
	chartValue ="Price";
	volumeText = "Volume";
	currencyText="Currency";
	priceText="Price";
	closeText="Close";
	openText="Open";
	lowText="LOW";
	highText="HIGH";
	cryptoMaxValue = 0;
	cryptoMinValue = 0;
	limitsize=30;
	chartActionType = 'graphDisplay';
	chartDataObject : any;
	smaChartData : any;
	shortingTab = '1D';
	shortZone = "GMT";
    constructor(
			private translate: TranslateService,
			private commonService: CommonService,
			private tickerService: TickerService,
            private _fb: FormBuilder, vcr: ViewContainerRef,
            private router: Router, public toastr: ToastrManager,
			private modalService: NgbModal,
            private loadingBar: LoadingBarService,
			private titleService: Title,
			private meta: Meta,
			private activeRoute: ActivatedRoute
	) {}
    ngOnInit() {
		this.meta.removeTag('name=title');
		this.meta.removeTag('name=description');
		
    	if ((localStorage.getItem('userProfileInfo') === '' || localStorage.getItem('userProfileInfo') === null || localStorage.getItem('userProfileInfo') === undefined) && (localStorage.getItem('userAccessToken') === '' || localStorage.getItem('userAccessToken') === null || localStorage.getItem('userAccessToken') === undefined) && (localStorage.getItem('tickerId') === '' || localStorage.getItem('tickerId') === undefined || localStorage.getItem('tickerId') === null) && (localStorage.getItem('tickerCurrency') === '' || localStorage.getItem('tickerCurrency') === undefined  || localStorage.getItem('tickerCurrency')==null) && (localStorage.getItem('tickerType') === '' || localStorage.getItem('tickerType') === undefined || localStorage.getItem('tickerType') === null) && (localStorage.getItem('loginUserName') === '' || localStorage.getItem('loginUserName') === undefined || localStorage.getItem('loginUserName') === null))
    		this.router.navigate(['/login']);
		
		this.profileInfo = JSON.parse(localStorage.getItem('userProfileInfo'));
		if(this.activeRoute.snapshot.queryParams){
			
			if(this.activeRoute.snapshot.params.pname!=undefined && this.activeRoute.snapshot.params.pname!=null && this.activeRoute.snapshot.params.username!=undefined && this.activeRoute.snapshot.params.username!=null){
				if(this.activeRoute.snapshot.params.pname!=localStorage.getItem('tickerSymbol') || this.activeRoute.snapshot.params.username!=localStorage.getItem('tickerName'))
					this.router.navigate(['/home/'+localStorage.getItem('loginUserName')]);
			}
			else
				this.router.navigate(['/home/'+localStorage.getItem('loginUserName')]);
		}
		else
			this.router.navigate(['/home/'+localStorage.getItem('loginUserName')]);
		
		this.title="BullsEye Investors"+ ((localStorage.getItem('tickerName')!= undefined && localStorage.getItem('tickerName')!=null && localStorage.getItem('tickerName')!="")?" | " +localStorage.getItem('tickerName'):"")+((localStorage.getItem('tickerSymbol')!=undefined && localStorage.getItem('tickerSymbol')!=null && localStorage.getItem('tickerSymbol')!="")?" | " + localStorage.getItem('tickerSymbol') :"");
		this.titleService.setTitle(this.title);

		/*Set Risk Indicators*/
		this.riskEnditiorStatus=((localStorage.getItem('pageTickerRequest')=="portfolio-details"))?true:false;
		if(this.riskEnditiorStatus){

			this.shortTerm=(localStorage.getItem('shortTerm')=="")? "1":localStorage.getItem('shortTerm');
			this.mediumTerm=((localStorage.getItem('mediumTerm')=="")?"1":(parseInt(localStorage.getItem('mediumTerm')) /2).toString());
			this.longTerm=((localStorage.getItem('longTerm')=='')?'1':(parseInt(localStorage.getItem('longTerm'))/3).toString());
			this.voladility=(localStorage.getItem('voladility') =='')?'3':localStorage.getItem('voladility');
			this.fundamentals=(localStorage.getItem('fundamentals')=='')?'1':localStorage.getItem('fundamentals');
			this.alphaMarketId=(localStorage.getItem('alphaMarketId') =='')?'':localStorage.getItem('alphaMarketId');

			this.potentialId=localStorage.getItem('potentialId');
			this.investmentId= localStorage.getItem('investmentId');
		}



		 /* Set Language Translator */
		this.translate.addLangs(['en', 'ko', 'hi', 'zh', 'es', 'ja']);
		this.translate.setDefaultLang('en');
		const browserLang = (this.profileInfo.defaultLanguage!= undefined && this.profileInfo.defaultLanguage!='')?this.profileInfo.defaultLanguage :'en';
		this.translate.use(browserLang.match(/en|ko|hi|zh|es|ja/) ? browserLang : 'en');
		this.translate.get('Somethingwentwrong').subscribe(value => {
			this.defaulterrSomethingMsg =value;
		});
		this.translate.get('Processing...').subscribe(value => {
			this.processingTxt=value;
		});
		this.translate.get('Candlestick').subscribe(value => {
			this.CandlestickText=value;
		});
		this.translate.get('Nochartdataavailable').subscribe(value => {
			this.noChartDataText =value;
		});
		this.translate.get('TargetPriceisRequired').subscribe(value => {
			this.targetPriceisRequiredMsg=value;
		});
		this.translate.get('ExpiryDateisrequired').subscribe(value => {
			this.expiryDateisRequiredMsg =value;
		});
		this.translate.get('Priceto3decimalplaces').subscribe(value => {
			this.PriceTo3DecimalPlacesMsg= value;
		});
		/* Get All Static Currency*/
		try {
			this.currencyList = this.commonService.getCurrency();
			this.currencyItemList = this.currencyList;
		} catch (error) {}
		this.placeholderImageUrl = '../assets/images/not-found.png';


		this.tickerId = parseInt(localStorage.getItem('tickerId'));
		this.tickerName = (localStorage.getItem('tickerName') !== undefined) ? localStorage.getItem('tickerName') : '';
		this.tickerType = localStorage.getItem('tickerType');
		this.tickerDetailsCurrency = (localStorage.getItem('tickerCurrency') !== undefined) ? localStorage.getItem('tickerCurrency') : '';
		this.tickerSymbol = (localStorage.getItem('tickerSymbol') !== undefined) ? localStorage.getItem('tickerSymbol') : '';

		if (localStorage.getItem('watchlistId') !== undefined && localStorage.getItem('watchlistId') !== '') {
			this.watchListId = parseInt(localStorage.getItem('watchlistId'));
		}
		this.watchListCurrency = this.profileInfo.baseCurrency;
		this.model.currentCurrency = this.watchListCurrency;
		if (!this.profileInfo.isProAccount) {
			const newKeys = [];
			const objectType = this;
			this.currencyList.map(function(item) {
				if (item.name === objectType.watchListCurrency) {
					return newKeys.push({name: item.name, symbol: item.symbol});
				}
			});
			this.currencyList = newKeys;
		}
		const objectNtype=this;
		/* Chart Call */
		setTimeout(() => {
			objectNtype.translate.get('Date').subscribe(value => {
				objectNtype.dateText=value;
			});
			objectNtype.translate.get('value').subscribe(value => {
				objectNtype.valueText=value;
			});
			objectNtype.translate.get('Currency').subscribe(value => {
				objectNtype.currencyText=value;
			});
			objectNtype.translate.get('Close').subscribe(value => {
				objectNtype.closeText=value;
			});
			objectNtype.translate.get('Open').subscribe(value => {
				objectNtype.openText= value;
			});
			objectNtype.translate.get('Low').subscribe(value => {
				objectNtype.lowText=value;
			});
			objectNtype.translate.get('High').subscribe(value => {
				objectNtype.highText =value;
			});
			objectNtype.translate.get('Price').subscribe(value => {
				objectNtype.priceText =value;
			});
			objectNtype.translate.get('Tickeralreadyaddedtoyourwatchlist').subscribe(value => {
				objectNtype.tickerAlreadyAddedToYourWatchlist= value;
			});
			objectNtype.getTickerDetails();
			objectNtype.getChartData(3, 'M', 2);
			if (objectNtype.tickerType.toLowerCase() === 'crypto' || objectNtype.tickerType.toLowerCase() === 'cryptocurrency') {
				objectNtype.getCrypto1YearHighLow();
			}
			
			objectNtype.filterExchangeItem();
		},1000);

    }
	getCurrencyMarketValueOld(finalPrice) {
	  finalPrice=(finalPrice!='' && finalPrice!=undefined)?parseFloat(finalPrice):0;
	  if (finalPrice > 1000000) {
		    let douValue = finalPrice / 1000000;
            let  sy = 'm';
            if (douValue > 1000) {
                sy = 'b';
                douValue = douValue / 1000;
            }
			const douValue1=(this.tickerType.toLowerCase() === 'stock')?douValue.toFixed(2):douValue.toFixed(3);
			return this.formatNumber(douValue1)+sy;
       } else {
		   finalPrice=parseInt(finalPrice);
		   return this.formatNumber(finalPrice);
	   }
    }
    getMinMax(arr, prop, type= "low") {
	    let max;

	    if(type == "low") {
	    	for (let i=0 ; i<arr.length ; i++) {
	        	if (!max || parseFloat(arr[i][prop]) < parseFloat(max.low)) {
	            	max = arr[i];
										}
	    	}
	    }
	    else{
		    for (let i=0 ; i<arr.length ; i++) {
		        if (!max || parseFloat(arr[i][prop]) > parseFloat(max.high)) {
		            max = arr[i];
										}

		    }
		}
	    return max;
	}
	getTickerDetails() {
		const objectType = this;
		if (this.tickerId > 0) {

			objectType.searchSearchText = objectType.processingTxt;
			objectType.loadingBar.start();
			this.tickerService.getTickerDetails(this.tickerId, function(err, response) {

				if ( err ) {
				  objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
				  objectType.searchSearchText = objectType.defaulterrSomethingMsg;
				}
				if ( response.statusCode === 200 ) {
					if (response.data[1].status === true) {
						objectType.currencyPriceList = response.data[1].data;
					}
					if (response.data[0].status === true && response.data[0].historyData.currentDayData !== undefined && Object.keys(response.data[0].historyData.currentDayData).length > 0) {

					     objectType.tickerListData = response.data[0].historyData.currentDayData;
					     if (objectType.tickerType.toLowerCase() === 'crypto' || objectType.tickerType.toLowerCase() === 'cryptocurrency') {
					     	if(objectType.cryptoMaxValue != 0 ) {
					     		objectType.tickerListData.WHigh52 = objectType.cryptoMaxValue;
					     		objectType.tickerListData.WLow52 = objectType.cryptoMinValue;
					     	} else {
					     		objectType.getCrypto1YearHighLow();
											}
					     }
						 objectType.tickerDetailsCurrency=<any>response.data[0].historyData.currentDayData.currency;
						 const icon=response.data[0].historyData.currentDayData.tickerUrl;
						 if(icon!=='' && icon!==undefined) {
							objectType.tickerNIcon=response.data[0].historyData.currentDayData.tickerUrl;
							}
					}
				} else {
					objectType.toastr.errorToastr(response.data.message, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
					objectType.searchSearchText = response.data.message;
				}
				objectType.processingText = '';
				objectType.loadingBar.stop();
			});
		} else {
			objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
			objectType.searchSearchText = objectType.defaulterrSomethingMsg;
		}
    }

    getCrypto1YearHighLow() {
    	const objectType = this;
    	this.commonService.getTickerDataListByType(this.tickerSymbol, this.tickerType, this.tickerDetailsCurrency, 365, '', '', function(err, response) {
			if ( err ) {
				objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
				objectType.tickerDataText = objectType.defaulterrSomethingMsg;
			}
			if ( response.statusCode === 200 ) {
				objectType.tickerDataText = '';
				const keys = [];
				const candleStickData = [];
				let data = [];
				let max = objectType.getMinMax(response.data.Data, 'high', 'high');
    			let min = objectType.getMinMax(response.data.Data, 'low', 'low');

    			objectType.cryptoMaxValue = max.high;
    			objectType.cryptoMinValue = min.low;

				objectType.tickerListData.WHigh52 = objectType.cryptoMaxValue;
				objectType.tickerListData.WLow52 = objectType.cryptoMinValue;


			} else {
				objectType.toastr.errorToastr(response.data.message, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
				objectType.tickerDataText = response.data.message;

			}

		});
    }
	ChangeCurrency() {
		this.loadingBar.start();
		this.watchListCurrency = this.model.currentCurrency;
		const tickerListDataData = this.tickerListData ;
		this.tickerListData = [];
		this.tickerListData = tickerListDataData;
		this.loadingBar.stop();
   }
   getCurrencyValue(price,currency,keyType) {
    	/* const price = (key === 'price') ? watchListData.price : watchListData.market_cap;
		const keyType = (key === 'price') ? false : true; */
    	// const currency = watchListData.currency;
    	return this.commonService.getGlobalCurrencyConvertValue(this.currencyPriceList, price, currency, this.watchListCurrency,keyType);
   }
   /* getCurrencyMarketValue(finalPrice, key = 'price') {
      if (finalPrice >= 1000000 && finalPrice <= 999999999) {
		  this.marketCapData = (finalPrice / 1000000).toFixed(3);
		  this.currencyType = 'm';
      } else if (finalPrice >= 1000000000 && finalPrice <= 999999999999) {
		  this.marketCapData = (finalPrice / 1000000000).toFixed(3);
		    this.currencyType = 'b';
      } else {
		   this.marketCapData = (finalPrice / 1000000000).toFixed(3);
		    this.currencyType = '';
	  }
    } */
	getCurrencyMarketValue(price,currency, key = 'price') {
      /* const price = (key === 'price') ? itemData.price : itemData.marketCap;
      const currency = itemData.currency; */
	  const keyType = (key === 'price') ? false : true;
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
	showHideChart() {
		this.loadingBar.start();
		this.isChecked = (!this.isChecked) ? true : false;
		this.getChartData(this.num, this.type, this.indMap);
		if (this.isChecked) {
			document.getElementById('chartdiv').style.display = 'none';
			document.getElementById('candlechart').style.display = 'flex';

		} else {
			document.getElementById('candlechart').style.display = 'none';
			document.getElementById('chartdiv').style.display = 'flex';
		}
		this.loadingBar.stop();
	}

	getExtraSMA(){
		// setting date range in sma case
		let limit = 0;
		if(this.filterModel.searchCriteria == 50 || this.filterModel.searchCriteria == 100 || this.filterModel.searchCriteria == 200){
			if (this.tickerType.toLowerCase() === 'crypto' || this.tickerType.toLowerCase() === 'cryptocurrency') {
				switch (this.filterModel.searchCriteria) {
					case "50": { 
						limit += 50 
						break; 
					} 
					case "100": { 
						limit += 100 
						break; 
					}
					case "200": { 
						limit += 200 
						break; 
					}
				}
			} else {
				switch (this.filterModel.searchCriteria) {
					case "50": { 
						limit += 80 
						break; 
					} 
					case "100": { 
						limit += 150 
						break; 
					}
					case "200": { 
						limit += 295 
						break; 
					}
				}
			}
		}
		return limit;
	}
	getChartData(num, type, clickind) {
		const objectType = this;
		this.activeTab = 'active';
		this.indMap = clickind;
		this.tickerDataText = this.processingTxt;
		this.num = num;
		this.type = type;

		objectType.loadingBar.start();
		if (this.tickerType !== '' && this.tickerName !== '' && this.tickerSymbol !== '' && this.tickerDetailsCurrency !== '' && this.num !== '' && this.type !== '') {

			if( this.type === 'D' ) {
				this.shortingTab = '1D';
				// this.filterModel.searchCriteria = 0;
				this.commonService.getTicker1DDataListByType(this.tickerSymbol, this.tickerType, this.tickerDetailsCurrency, this.limitsize, function (err, response) {

					if (err) {
						objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
						objectType.tickerDataText = objectType.defaulterrSomethingMsg;
					}
					if (response.statusCode === 200) {
						objectType.tickerDataText = '';
						const keys = [];
						const candleStickData = [];
						let data = [];
						if (objectType.tickerType.toLowerCase() === 'crypto' || objectType.tickerType.toLowerCase() === 'cryptocurrency') {
							if (response.data.Data !== undefined && response.data.Data.length > 0) {

								data = response.data.Data;
								data.map(function (item) {
									const currentDateTime = new Date(item.time * 1000);
									keys.push({ date: new Date(item.time * 1000), shortZone: 'GMT', currentDateTime: currentDateTime.getHours() + ':' + currentDateTime.getMinutes(), currency: objectType.tickerDetailsCurrency, open: objectType.formatNumber(parseFloat(item.open).toFixed(4)), close: objectType.formatNumber(parseFloat(item.close).toFixed(4)), high: objectType.formatNumber(parseFloat(item.high).toFixed(4)), low: objectType.formatNumber(parseFloat(item.low).toFixed(4)), volume: objectType.formatNumber(parseFloat(item.volumefrom).toFixed(4)) });

									// candleStickData.push({date: new Date(item.time * 1000), currency: objectType.tickerDetailsCurrency, open: objectType.formatNumber((Math.round(item.open * 100) / 100).toFixed(4)), close: objectType.formatNumber((Math.round(item.close * 100) / 100).toFixed(4)), high: objectType.formatNumber((Math.round(item.high * 100) / 100).toFixed(4)), low: objectType.formatNumber((Math.round(item.low * 100) / 100).toFixed(4))});

								});
								keys.sort((a, b) => {
									return <any>new Date(a.date) - <any>new Date(b.date);
									});
								objectType.chartDataObject = keys;
								objectType.renderChart(keys, '1D');
								objectType.renderVolumeChart(keys, '1D');
								// objectType.getSMAData(objectType.chartDataObject, objectType.filterModel.searchCriteria);
								objectType.renderCandleStickChartData(keys, '1D');
								objectType.renderCandleStickChartData(keys, '1D', 'smachart');
								objectType.renderChart(keys, '1D', 'smachart');
							} else {
								objectType.tickerDataText = objectType.noChartDataText;
							}
						} else if (objectType.tickerType.toLowerCase() === 'stock') {
							if (response.data.intraday !== undefined && Object.keys(response.data.intraday).length > 0) {

								data = response.data.intraday;
								let dataTimeZone = response.data.timezone_name;
								Object.keys(data).map(function (key) {
									const currentDateTime = new Date(key);
									let shortZone = currentDateTime.toLocaleTimeString('en-us',{timeZoneName:'short', timeZone: dataTimeZone}).split(' ')[2];
									keys.push({ date: new Date(key), shortZone: shortZone, currentDateTime: currentDateTime.getHours() + ':' + currentDateTime.getMinutes(), currency: objectType.tickerDetailsCurrency, open: objectType.formatNumber(parseFloat(data[key].open).toFixed(3)), close: objectType.formatNumber(parseFloat(data[key].close).toFixed(3)), high: objectType.formatNumber(parseFloat(data[key].high).toFixed(3)), low: objectType.formatNumber(parseFloat(data[key].low).toFixed(3)), volume: objectType.formatNumber(parseFloat(data[key].volume).toFixed(0)) });

									// candleStickData.push({date : new Date(key), currency: objectType.tickerDetailsCurrency, open: objectType.formatNumber(parseFloat(data[key].open).toFixed(3)), close: objectType.formatNumber(parseFloat(data[key].close).toFixed(3)), high: objectType.formatNumber(parseFloat(data[key].high).toFixed(3)), low: objectType.formatNumber(parseFloat(data[key].low).toFixed(3))});

								});

								keys.sort((a, b) => {
									return <any>new Date(a.date) - <any>new Date(b.date);
								});
								/* candleStickData.sort((a, b) => {
								  return <any>new Date(a.date) - <any>new Date(b.date);
								}); */
								objectType.chartDataObject = keys;
								objectType.renderChart(keys, '1D');
								objectType.renderVolumeChart(keys, '1D');
								objectType.renderCandleStickChartData(keys, '1D');
								objectType.getSMAData(objectType.chartDataObject, objectType.filterModel.searchCriteria);
								objectType.renderCandleStickChartData(keys, '1D', 'smachart');
								objectType.renderChart(keys, '1D', 'smachart');
							} else {
								objectType.tickerDataText = objectType.noChartDataText;
							}
						} else {
							objectType.tickerDataText = objectType.noChartDataText;
						}
					} else {
						objectType.toastr.errorToastr(response.data.message, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
						objectType.tickerDataText = response.data.message;
						/*if(response.statusCode == 401) {
							localStorage.removeItem("userAccessToken");
							localStorage.removeItem("userProfileInfo");
							objectType.router.navigate(['/login']);
						}*/

					}
					objectType.loadingBar.stop();
				});
			} else {
					this.shortingTab = '1M';
					/* Current Date */
					const d = new Date();
					const y = d.getUTCFullYear();
					let m = d.getUTCMonth();
					let day = d.getUTCDate();
					m = m + 1;
					let mm = (m <= 9 ) ? ('0' + m) : m;
					let dd = (day <= 9 ) ? ('0' + day) : day;
					const dateTo = y + '-' + mm + '-' + dd;
					
					const num = parseInt(this.num);
					let limit = (this.type === 'M') ? (num * 30) : (num * 365);
					let extraSMA   = this.getExtraSMA();
					limit = limit+extraSMA;

					d.setDate(d.getDate() - limit);
					m = d.getUTCMonth();
					day = d.getUTCDate();
					m = m + 1;
					mm = (m <= 9 ) ? ('0' + m) : m;
					dd = (day <= 9 ) ? ('0' + day) : day;
					const dateFrom = d.getUTCFullYear() + '-' + mm + '-' + dd;

					

					this.commonService.getTickerDataListByType(this.tickerSymbol, this.tickerType, this.tickerDetailsCurrency, limit, dateFrom, dateTo, function(err, response) {
						if ( err ) {
						objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
						objectType.tickerDataText = objectType.defaulterrSomethingMsg;
						}
						if ( response.statusCode === 200 ) {
							objectType.tickerDataText = '';
							const keys = [];
							const candleStickData = [];
							let data = [];
							let newData = [];
							if(objectType.tickerType.toLowerCase() === 'crypto' || objectType.tickerType.toLowerCase() === 'cryptocurrency') {
								if (response.data.Data !== undefined && response.data.Data.length > 0) {
									data = response.data.Data;
									
									data.map(function(item) {
										const currentDateTime = new Date(item.time * 1000);
										keys.push({date: new Date(item.time * 1000), currentDateTime: currentDateTime.getDate(), currency: objectType.tickerDetailsCurrency, open: objectType.formatNumber(parseFloat(item.open).toFixed(4)), close: objectType.formatNumber(parseFloat(item.close).toFixed(4)), high: objectType.formatNumber(parseFloat(item.high).toFixed(4)), low: objectType.formatNumber(parseFloat(item.low).toFixed(4)), volume: objectType.formatNumber(parseFloat(item.volumefrom).toFixed(4))});

										// candleStickData.push({date: new Date(item.time * 1000), currency: objectType.tickerDetailsCurrency, open: objectType.formatNumber((Math.round(item.open * 100) / 100).toFixed(4)), close: objectType.formatNumber((Math.round(item.close * 100) / 100).toFixed(4)), high: objectType.formatNumber((Math.round(item.high * 100) / 100).toFixed(4)), low: objectType.formatNumber((Math.round(item.low * 100) / 100).toFixed(4))});

									});
									keys.sort((a, b) => {
									return <any>new Date(a.date) - <any>new Date(b.date);
									});
									newData = keys.slice(extraSMA);
									objectType.chartDataObject = newData;
									objectType.renderChart(newData);
									objectType.renderVolumeChart(newData);
									objectType.renderCandleStickChartData(newData);
									objectType.getSMAData(keys, objectType.filterModel.searchCriteria);
									objectType.renderCandleStickChartData(newData, 'normal','smachart');
									objectType.renderChart(newData, 'normal', 'smachart');
								} else {
									objectType.tickerDataText = objectType.noChartDataText;
								}
							} else if (objectType.tickerType.toLowerCase() === 'stock') {
								if (response.data.history !== undefined && Object.keys(response.data.history).length > 0) {
									data = response.data.history;
									Object.keys(data).map(function (key) {
										const currentDateTime = new Date(key);
										keys.push({date : new Date(key), currentDateTime: currentDateTime.getDate(), currency: objectType.tickerDetailsCurrency, open: objectType.formatNumber(parseFloat(data[key].open).toFixed(3)), close: objectType.formatNumber(parseFloat(data[key].close).toFixed(3)), high: objectType.formatNumber(parseFloat(data[key].high).toFixed(3)), low: objectType.formatNumber(parseFloat(data[key].low).toFixed(3)), volume: objectType.formatNumber(parseFloat(data[key].volume).toFixed(0))});

										// candleStickData.push({date : new Date(key), currency: objectType.tickerDetailsCurrency, open: objectType.formatNumber(parseFloat(data[key].open).toFixed(3)), close: objectType.formatNumber(parseFloat(data[key].close).toFixed(3)), high: objectType.formatNumber(parseFloat(data[key].high).toFixed(3)), low: objectType.formatNumber(parseFloat(data[key].low).toFixed(3))});

									});
									keys.sort((a, b) => {
									return <any>new Date(a.date) - <any>new Date(b.date);
									});
									
									newData = keys.slice(objectType.filterModel.searchCriteria);
									/* candleStickData.sort((a, b) => {
									return <any>new Date(a.date) - <any>new Date(b.date);
									}); */
									
									objectType.chartDataObject = newData;
									objectType.renderChart(newData);
									objectType.renderVolumeChart(newData);
									objectType.renderCandleStickChartData(newData);
									objectType.getSMAData(keys, objectType.filterModel.searchCriteria);
									objectType.renderCandleStickChartData(newData, 'normal','smachart');
									objectType.renderChart(newData, 'normal', 'smachart');
								} else {
									objectType.tickerDataText = objectType.noChartDataText;
								}
							} else {
								objectType.tickerDataText = objectType.noChartDataText;
												}
						} else {
							objectType.toastr.errorToastr(response.data.message, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
							objectType.tickerDataText = response.data.message;
							/*if(response.statusCode == 401) {
								localStorage.removeItem("userAccessToken");
								localStorage.removeItem("userProfileInfo");
								objectType.router.navigate(['/login']);
							}*/

						}
						objectType.loadingBar.stop();
					});
			}
		} else {
			this.tickerDataText = this.noChartDataText;
			objectType.loadingBar.stop();
		}
	}


	createAxisAndSeries(field,chart) {

		let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.renderer.grid.template.location = 0;
		valueAxis.renderer.grid.template.disabled = true;
		valueAxis.renderer.ticks.template.disabled = true;
		valueAxis.renderer.labels.template.disabled = true;
		valueAxis.tooltip.disabled = true;
		valueAxis.renderer.minWidth = 35;
		
		let extraParam = (this.filterModel.searchCriteria == 24) ? (`Volume: {volume}\n`):((this.filterModel.searchCriteria == 50) ? `50-day SMA: {SMA}`: ((this.filterModel.searchCriteria == 100)? `100-day SMA: {SMA}`:((this.filterModel.searchCriteria == 200)? `200-day SMA: {SMA}`: "")));

		let tooltipText =
			this.dateText + `:` + ` {date}`+`\n`+((this.shortingTab == '1D')?this.timeText + `:` + ` {currentDateTime} {shortZone}`+`\n`:'')+
			this.currencyText + `: {currency}\n` +
			this.priceText + `: {close}\n`+extraParam;
		if(field=="value"){
			let series = chart.series.push(new am4charts.LineSeries());
			series.dataFields.dateX = "date";
			series.dataFields.valueY = "close";
			series.strokeWidth = 1.5;
			series.stroke = am4core.color("#00b050");

			// let currency=this.chatDetailsCurrency;
			series.tooltipText = tooltipText;
			/* Set Chart Tooltip Style */
			series.tooltip.getFillFromObject = false;
			series.tooltip.background.fill = am4core.color("#00b050");
		} else if(field=="chartwithSma"){
			let series = chart.series.push(new am4charts.LineSeries());
			series.dataFields.dateX = "date";
			series.dataFields.valueY = "close";
			series.strokeWidth = 1.5;
			series.stroke = am4core.color("#00b050");
			series.tooltipText = tooltipText;

			/* Set Chart Tooltip Style */
			series.tooltip.getFillFromObject = false;
			series.tooltip.background.fill = am4core.color("#00b050");
		} else if(field=="sma"){
			let series = chart.series.push(new am4charts.LineSeries());
			series.dataFields.dateX = "date";
			series.dataFields.valueY = "SMA";
			series.strokeWidth = 1.5;
			series.stroke = am4core.color("#add8e6");

		} else if(field == 'candle') {
			const series = chart.series.push(new am4charts.CandlestickSeries());
			series.dataFields.dateX = 'date';
			series.dataFields.openValueY = 'open';
			series.dataFields.valueY = 'close';
			series.dataFields.highValueY = 'high';
			series.dataFields.lowValueY = 'low';

			series.simplifiedProcessing = true;
			chart.cursor = new am4charts.XYCursor();
			series.tooltip.background.strokeWidth = 0;
			series.tooltip.background.pointerLength = 1;
			series.tooltip.label.fill = am4core.color('#FFFFFF');
			series.tooltip.background.filters.clear();
			// a separate series for scrollbar
			const lineSeries = chart.series.push(new am4charts.LineSeries());
			lineSeries.dataFields.dateX = 'date';
			lineSeries.dataFields.valueY = 'close';
			// need to set on default state, as initially series is "show"
			lineSeries.defaultState.properties.visible = false;

			// hide from legend too (in case there is one)
			lineSeries.hiddenInLegend = true;
			lineSeries.fillOpacity = 1.5;
			lineSeries.strokeOpacity = 1.5;

			series.dropFromOpenState.properties.fill = am4core.color('#ec1111');
			series.dropFromOpenState.properties.stroke = am4core.color('#ec1111');

			series.riseFromOpenState.properties.fill = am4core.color('#00b050');
			series.riseFromOpenState.properties.stroke = am4core.color('#00b050');
			series.tooltipText =
			this.dateText+`: {date}\n`+
			this.currencyText+`: {currency}\n`+
			this.openText+`: {open}\n`+
			this.closeText+`: {close}\n`+
			this.highText + `: {high}\n` +
			this.lowText + `: {low}\n`+extraParam;

		}
		if(field == 'value' || field == 'chartwithSma' || field == 'sma') {
			chart.cursor = new am4charts.XYCursor();
			/* Set Chart Tooltip Dotted Line */
			chart.cursor.lineX.stroke = am4core.color("#5a7e9e");
			chart.cursor.lineX.strokeWidth = 1.5;
			chart.cursor.lineX.strokeOpacity = 1;
			chart.cursor.lineX.strokeDasharray = "";

			chart.cursor.lineY.stroke = am4core.color("#5a7e9e");
			chart.cursor.lineY.strokeWidth = 1;
			chart.cursor.lineY.strokeOpacity = 1;
			chart.cursor.lineY.strokeDasharray = "";
		}
	}

	/* Render Chart Data */
	renderChart(data, dataType = 'normal', chartType= 'chartdiv') {

		am4core.useTheme(am4themes_animated);
		const chart = am4core.create(chartType, am4charts.XYChart);
		chart.paddingRight = 10;
		chart.paddingBottom = 40;
		chart.data = data;
		const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
		dateAxis.renderer.grid.template.location = 0;

		dateAxis.renderer.grid.template.disabled = true;
		dateAxis.renderer.ticks.template.disabled = true;
		dateAxis.renderer.labels.template.disabled = true;
		dateAxis.tooltip.disabled = true;
		if(chartType == 'chartdiv') {
			this.createAxisAndSeries("value",chart);
		} else {
			this.createAxisAndSeries("chartwithSma",chart);
			this.createAxisAndSeries("sma",chart);
		}

	}

	renderVolumeChart(data, dataType = 'normal') {
		am4core.useTheme(am4themes_animated);
		const chart = am4core.create('volumechart', am4charts.XYChart);
		chart.paddingRight = 20;

		chart.data = data;
		let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
		categoryAxis.dataFields.category = "currentDateTime";
		categoryAxis.renderer.grid.template.strokeOpacity = 0;
		categoryAxis.renderer.labels.template.disabled = true;
		categoryAxis.renderer.cellStartLocation = 0.2;
		categoryAxis.renderer.cellEndLocation = 0.8;
		categoryAxis.tooltip.disabled = true;

		let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.renderer.inside = true;
		valueAxis.renderer.labels.template.fillOpacity = 0;
		valueAxis.renderer.grid.template.strokeOpacity = 0;
		valueAxis.renderer.minWidth = 35;
		valueAxis.cursorTooltipEnabled = false;
		valueAxis.renderer.baseGrid.strokeOpacity = 0;
		valueAxis.renderer.grid.template.location = 0;
	    valueAxis.renderer.grid.template.disabled = true;
		valueAxis.renderer.ticks.template.disabled = true;
		valueAxis.renderer.labels.template.disabled = true;
		let series = chart.series.push(new am4charts.ColumnSeries);
		series.dataFields.valueY = "volume";
		series.dataFields.categoryX = "currentDateTime";
		series.tooltipText = this.dateText + `:` + ` {date}`+`\n`+
			this.currencyText + `: {currency}\n` +
			this.volumeText + `: {volume}`;
		// series.tooltip.pointerOrientation = "vertical";
		series.tooltip.dy = - 6;
		series.columnsContainer.zIndex = 100;

		let columnTemplate = series.columns.template;
		columnTemplate.width = am4core.percent(50);
		columnTemplate.height = am4core.percent(50);
		columnTemplate.fill = am4core.color("#364451");
		columnTemplate.maxHeight = 100;
		columnTemplate.maxWidth = 13;
		// columnTemplate.column.cornerRadius(60, 60, 10, 10);
		columnTemplate.strokeOpacity = 0;
		series.tooltip.getFillFromObject = false;

		series.tooltip.background.fill = am4core.color('#00b050');
		chart.cursor = new am4charts.XYCursor();
		chart.cursor.behavior = 'zoomX';
		chart.cursor.lineX.disabled = true;
		/* Set Chart Tooltip Dotted Line */
		chart.cursor.lineX.stroke = am4core.color('#5a7e9e');
		chart.cursor.lineX.strokeWidth = 1.5;
		chart.cursor.lineX.strokeOpacity = 1;
		chart.cursor.lineX.strokeDasharray = '';

		chart.cursor.lineY.stroke = am4core.color('#5a7e9e');
		chart.cursor.lineY.strokeWidth = 1;
		chart.cursor.lineY.strokeOpacity = 1;
		chart.cursor.lineY.strokeDasharray = '';
	}
	/* Render Candle Chart Data */
	renderCandleStickChartData(data, dataType = 'normal', chartType = 'candleStick') {
		// Themes begin
		am4core.useTheme(am4themes_animated);
		// Themes end
		const chart = am4core.create((chartType == 'candleStick') ? 'candlechart' : 'candleSma', am4charts.XYChart);
		chart.paddingRight = 10;
		chart.data = data;
		chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd';

		const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
		dateAxis.renderer.grid.template.location = 0;
		dateAxis.renderer.grid.template.disabled = true;
		dateAxis.renderer.labels.template.disabled = true;
		dateAxis.tooltip.disabled = true;
		const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.tooltip.disabled = true;
		valueAxis.renderer.grid.template.disabled = true;
		valueAxis.renderer.labels.template.disabled = true;
		valueAxis.tooltip.disabled = true;
		if(chartType == 'candleStick') {
			this.createAxisAndSeries("candle",chart);
		} else {

			this.createAxisAndSeries("sma",chart);
			this.createAxisAndSeries("candle",chart);
		}


		/* let scrollbarX = new am4charts.XYChartScrollbar();
		scrollbarX.series.push(lineSeries);
		chart.scrollbarX = scrollbarX; */


	}
	/* Add to watch list */
	addToWatchList() {
		if (this.watchListId === 0) {
			if (this.tickerId > 0) {
				if (this.loading) {
					return;
				}
				const objectType = this;
				this.loading = true;
				this.commonService.addWatchList({'tickerId' : this.tickerId}, function(err, response) {
					objectType.loading = false;
					if ( err ) {
					  objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
					}
					if ( response.statusCode === 200 ) {
					  if (response.data.status === true) {
						objectType.watchListId = 1;
							}
					  objectType.toastr.successToastr(response.data.message, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
					} else {
					  objectType.toastr.errorToastr(response.data.message, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
					  /*if(response.statusCode == 401) {
						localStorage.removeItem("userAccessToken");
						localStorage.removeItem("userProfileInfo");
						objectType.router.navigate(['/login']);
					  }*/

					}
				});
			} else {
				this.toastr.errorToastr(this.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
				this.loading = false;
			}
		} else {
			this.loading = false;
			this.toastr.errorToastr(this.tickerAlreadyAddedToYourWatchlist, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
		}
	}
	setPriceAlert() {
		this.priceAlertError.amount = (this.priceAlert.amount !== undefined && this.priceAlert.amount !== '') ? false : true;
		this.priceAlertError.expiryDate = (this.priceAlert.expiryDate !== undefined && this.priceAlert.expiryDate !== '') ? false : true;
		if (this.priceAlertError.amount) {
			this.toastr.errorToastr(this.targetPriceisRequiredMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
			return false;
		} else {
			if (!(/^\d+[.,]?\d{0,3}$/g).test(this.priceAlert.amount)) {
			  this.toastr.errorToastr(this.PriceTo3DecimalPlacesMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
			  return false;
			}
		}
		if (this.priceAlertError.expiryDate) {
			this.toastr.errorToastr(this.expiryDateisRequiredMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
			return false;
		}
		const month = (this.priceAlert.expiryDate.month < 10 ) ? '0' + this.priceAlert.expiryDate.month : this.priceAlert.expiryDate.month;
		const day = (this.priceAlert.expiryDate.day < 10 ) ? '0' + this.priceAlert.expiryDate.day : this.priceAlert.expiryDate.day;
		const expiryDatevalue = day + '/' + month + '/' + this.priceAlert.expiryDate.year;

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
			objectType.toastr.errorToastr(response.data.message, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
				}
		});
  }
  /*Numeric value with decimal value*/
  numberOnly(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        } else {
			return true;
        }
  }
  open(content) {
	   if (!this.profileInfo.isProAccount) {
			localStorage.setItem('proActive', 'false');
			this.router.navigateByUrl('/check-pro', {skipLocationChange: true}).then(() =>
			this.router.navigate(['/account-settings']));
		} else {
			localStorage.setItem('proActive', '');
			this.priceAlert.tickerName = this.tickerName;
			this.priceAlert.symbol = this.tickerSymbol;
			this.priceAlert.amount = '';
			this.priceAlert.tickerId = this.tickerId;
			this.priceAlert.tickerIcon = this.tickerNIcon;
			this.modalService.open(content).result.then((result) => {
			  this.closeResult = `Closed with: ${result}`;
			}, (reason) => {
			  this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			});
		}
	}
	openRisk(ic_risk) {

		const objectType = this;
		this.riskPerformanceArray.tickerName = this.tickerName;
		this.riskPerformanceArray.symbol = this.tickerSymbol;
		this.riskPerformanceArray.tickerId = this.tickerId;
		this.riskPerformanceArray.tickerIcon = this.tickerNIcon;

		this.riskPerformanceArray.potentialST = this.shortTerm;
		this.riskPerformanceArray.potentialMT = this.mediumTerm;
		this.riskPerformanceArray.potentialLT = this.longTerm;
		this.riskPerformanceArray.riskVolality = this.voladility;
		this.riskPerformanceArray.riskFundamentals = this.fundamentals;
		if (this.tickerType.toLowerCase() === 'crypto' || this.tickerType.toLowerCase() === 'cryptocurrency') {
				this.alphaMarketId = '0';
		}
		this.riskPerformanceArray.benkMarchIndex = this.alphaMarketId;

		this.saveRiskBtnText = this.saveRiskText;
		// this.riskPerformanceArray.potentialST='Low';
		if (!this.getBenchMark) {
			if (this.tickerType.toLowerCase() === 'stock') {
				objectType.loadingBar.start();
				this.tickerService.getAlphaMarket(function(err, response) {
					if ( err ) {
					  objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
					}
					if ( response.statusCode === 200 ) {
						if (response.data.status === true) {
							objectType.benkMarchList = response.data.data;
							objectType.getBenchMark = true;
							objectType.modalService.open(ic_risk).result.then((result) => {
								objectType.closeResult = `Closed with: ${result}`;
							}, (reason) => {
								objectType.closeResult = `Dismissed ${objectType.getDismissReason(reason)}`;
							});
						}
					}
					objectType.loadingBar.stop();
				});
			} else {
				objectType.benkMarchList.push({alphaMarketId: 0, tickerName: 'BullsEye Crypto10'});
				objectType.modalService.open(ic_risk).result.then((result) => {
					objectType.closeResult = `Closed with: ${result}`;
				}, (reason) => {
					objectType.closeResult = `Dismissed ${objectType.getDismissReason(reason)}`;
				});
			}
		} else {
			objectType.modalService.open(ic_risk).result.then((result) => {
				objectType.closeResult = `Closed with: ${result}`;
			}, (reason) => {
				objectType.closeResult = `Dismissed ${objectType.getDismissReason(reason)}`;
			});
		}
  }
  checkTargetValidation() {
	 if (this.priceAlert.amount !== '') {
		 if (!(/^\d+[.,]?\d{0,3}$/g.test(this.priceAlert.amount))) {
		     const a = this.priceAlert.amount.split('.');
			 this.priceAlert.amount = a[0] + '.' + a[1].substring(0, 3);
		 }
	 }
   }
   setTagetValueWith3Digit() {
	  if (this.priceAlert.amount !== '') {
		 const amt = parseFloat(this.priceAlert.amount);
		 this.priceAlert.amount = amt.toFixed(3);
	  }
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
  /*Return Currency Symbol*/
  returnCurrSymbol(v) {
	  let cur = v;
	  v = (v === 'GBX') ? 'GBP' : v;
	  this.currencyItemList.map(function(item) {
			if (item.name === v) {
				cur = item.symbol;
			}
	  });
	  return cur;
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
  setRiskIndicators() {

		const objectType = this;
		if (this.riskPerformanceArray.tickerId === '0' || this.riskPerformanceArray.tickerId == null || this.riskPerformanceArray.tickerId === '' || this.investmentId === '0' || this.investmentId == null || this.investmentId === '') {
			objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
			this.saveRiskBtnText = this.saveRiskText;
			return false;
		}
		if (this.saveRiskText === this.processingTxt) {
			return;
		}

		this.saveRiskBtnText = this.processingTxt;
		const pMedium = (this.riskPerformanceArray.potentialMT !== '') ? (parseInt(this.riskPerformanceArray.potentialMT) * 2) : 0;
		const pLong = (this.riskPerformanceArray.potentialLT !== '') ? (parseInt(this.riskPerformanceArray.potentialLT) * 3) : 0;
		if (this.potentialId !== '0' && this.potentialId != null && objectType.potentialId !== '') {
			this.formData = {'short': this.riskPerformanceArray.potentialST, 'medium' : pMedium, 'long': pLong, 'voladility': this.riskPerformanceArray.riskVolality, 'fundamentals': this.riskPerformanceArray.riskFundamentals, 'alphaMarketId': this.riskPerformanceArray.benkMarchIndex, 'investmentId': this.investmentId, 'tickerId': this.riskPerformanceArray.tickerId, 'potentialId': this.potentialId};
		} else {
			this.formData = {'short': this.riskPerformanceArray.potentialST, 'medium' : pMedium, 'long': pLong, 'voladility': this.riskPerformanceArray.riskVolality, 'fundamentals': this.riskPerformanceArray.riskFundamentals, 'alphaMarketId': this.riskPerformanceArray.benkMarchIndex, 'investmentId': this.investmentId, 'tickerId': this.riskPerformanceArray.tickerId};
		}


		this.loading = true;
		this.loadingBar.start();
		this.tickerService.RiskIndicators(this.formData, function(err, response) {

	      objectType.saveRiskBtnText = objectType.saveRiskText;
		  objectType.loading = false;
		  objectType.loadingBar.stop();
		  if ( err ) {
				objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
		  }
		  if ( response.statusCode === 200 ) {
			objectType.toastr.successToastr(response.data.message, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
			if (objectType.potentialId === '0' || objectType.potentialId == null || objectType.potentialId === '') {
				objectType.loadingBar.start();
				objectType.tickerService.getInvestmentPerformance(objectType.investmentId, function(err, responseData) {

					if ( err ) {
					  objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
					}
					if ( responseData.statusCode === 200 ) {
						if (responseData.data.status === true) {
							const potId = (responseData.data.data.potentialId != null && responseData.data.data.potentialId !== undefined && responseData.data.data.potentialId !== '') ? responseData.data.data.potentialId : '';
							localStorage.setItem('potentialId', potId);
							objectType.potentialId = potId;
						}
					}
					objectType.loadingBar.stop();
				});
			}

			objectType.shortTerm = objectType.riskPerformanceArray.potentialST;
			objectType.mediumTerm = objectType.riskPerformanceArray.potentialMT;
			objectType.longTerm = objectType.riskPerformanceArray.potentialLT;
			objectType.voladility = objectType.riskPerformanceArray.riskVolality;
			objectType.fundamentals = objectType.riskPerformanceArray.riskFundamentals;
			const marketId = (objectType.riskPerformanceArray.benkMarchIndex != null && objectType.riskPerformanceArray.benkMarchIndex !== undefined && objectType.riskPerformanceArray.benkMarchIndex !== '') ? objectType.riskPerformanceArray.benkMarchIndex : '';
			objectType.alphaMarketId = marketId;
			objectType.modalService.dismissAll();
		  } else {
			objectType.toastr.errorToastr(response.data.message, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
		  }
		});
  }

  filterExchangeItem() {
	  debugger;
  	this.loadingBar.start();
	this.getChartData(this.num, this.type, this.indMap);
	
	if (this.filterModel.graphDisplay) {
		debugger;
		document.getElementById('chartdiv').style.display = 'none';
		document.getElementById('smachart').style.display = 'none';
		if(this.filterModel.searchCriteria == 0 || this.filterModel.searchCriteria == 24) {
			debugger;
			document.getElementById('candleSma').style.display = 'none';
			document.getElementById('candlechart').style.display = 'flex';
		} else {
			debugger;
			document.getElementById('candlechart').style.display = 'none';
			document.getElementById('candleSma').style.display = 'flex';
		}

	} else {
		debugger;
		document.getElementById('candlechart').style.display = 'none';
		document.getElementById('chartdiv').style.display = 'flex';
		document.getElementById('candleSma').style.display = 'none';
		if(this.filterModel.searchCriteria == 0 || this.filterModel.searchCriteria == 24) {
			document.getElementById('smachart').style.display = 'none';
			document.getElementById('chartdiv').style.display = 'flex';
		} else {
			document.getElementById('chartdiv').style.display = 'none';
			document.getElementById('smachart').style.display = 'flex';
		}
	}
	if(this.filterModel.searchCriteria == 0) {
		document.getElementById('volumechart').style.display = 'none';
		document.getElementById('smachart').style.display = 'none';
		document.getElementById('candleSma').style.display = 'none';
	} else if(this.filterModel.searchCriteria == 24) {
		document.getElementById('volumechart').style.display = 'flex';
						} else {
		const smaData =this.getSMAData(this.chartDataObject, this.filterModel.searchCriteria);

		this.smaChartData = smaData;
		this.renderChart(this.chartDataObject, 'normal', "smachart");
		this.renderCandleStickChartData(this.chartDataObject, 'normal', "candleSma");
		if(!this.filterModel.graphDisplay) {
			document.getElementById('candleSma').style.display = 'none';
			document.getElementById('smachart').style.display = 'flex';
		} else {
			document.getElementById('smachart').style.display = 'none';
			document.getElementById('candleSma').style.display = 'flex';
		}
		document.getElementById('candlechart').style.display = 'none';
		document.getElementById('chartdiv').style.display = 'none';
		document.getElementById('volumechart').style.display = 'none';
	}

	this.activeFilter = false;
	this.loadingBar.stop();

  }

  setChartActionType(actionType) {
  		// this.chartActionType = actionType;
  }


  getSMAData(data, SMAType) {
	  
	  let extraSMA   = this.getExtraSMA();
	const SMAData = [];
	SMAType = parseInt(SMAType);
	SMAType = (data.length >= SMAType) ? SMAType : data.length;



	if ( data.length >= SMAType ) {
		const loopcount = data.length - SMAType + 1;
		let count = 0;
		for ( let i = 0; i <= loopcount; i++) {
			

			let smaTotal = 0;
			const nextLoop = SMAType + i;
			for ( let j = i; j <= nextLoop; j++ ) {
				

				if (data[j] !== undefined) {
					smaTotal = smaTotal + parseFloat(data[j].close.replace(',', ''));
				}
			}
			if (data[nextLoop] !== undefined)	{
				// if (count === 0) {
				// 	for (let k = 0; k < SMAType; k++) {
				// 		const chartItemVal = this.chartDataObject[k];
				// 		chartItemVal.SMA = 'N/A';
				// 		this.chartDataObject[k] = chartItemVal;
				// 		SMAData.push( {date: data[k].date, currency: data[k].currency, close: chartItemVal.SMA});
				// 	}
				// }
				const chartItemVal = this.chartDataObject[count];
				if(this.chartDataObject[count] != undefined && SMAType > 0){
					chartItemVal.SMA = (smaTotal / SMAType).toFixed(6);
					
					this.chartDataObject[count] = chartItemVal;
					SMAData.push( {date: data[nextLoop].date, currency: data[nextLoop].currency, close: (smaTotal / SMAType).toFixed(6)});
				}
				if(this.chartDataObject[count] === undefined) {
					
				}
			}
			count++;

		}

	}
	return SMAData;
  }


}

