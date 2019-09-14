import { Component, OnInit, ElementRef,  ViewContainerRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Router, ActivatedRoute } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../_services/common.service';
import { PortfolioService } from '../../_services/portfolio.service';
import { InvestmentService } from '../../_services/investment.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Title, Meta } from '@angular/platform-browser';
@Component({
    selector: 'app-portfolio-details',
    templateUrl: './portfolio-details.component.html',
    styleUrls: ['./portfolio-details.component.scss'],
    animations: [routerTransition()]
})
export class PortfolioDetailsComponent implements OnInit {
	model: any = {'currentCurrency': 'USD'};
	priceAlert: any = {'currentCurrency': 'USD', 'amount': '', 'tickerId': '', 'tickerName': '', 'symbol' : '', 'compare' : '>', 'expiryDate' : '','tickerIcon':''};
    priceAlertError : any = {'amount' : false, 'expiryDate' : false};
    datepicker: any;
	profileInfo: any;
	investmentForm: FormGroup;
	submitted = false;
	activeFilter = false;
	searchSearchText='';
	portfolioId=0;
	portfolioCurrency="";
	priceAlertCurrency="";
	portfolioType="";
	totalMarketVal=0;
	portfolioChanges=0;
	math = Math;
	valueList: any = [];
	riskList: any = [];
	currencyList: any =[];
	currencyItemList: any = [];
	showValueList=false;
	showRiskList=false;
	showPerformanceList=false;
	indMenu=1;
	activeTab="";
	closeResult = "";
	modelHeading = "";
	investDetails :  any;
	loading = false;
	isCollapsed = true;
	num="";
	type="";
	indMap=0;
	portGraphDataText="";
	hideme = {};
	defaulterrSomethingMsg='Something went wrong';
	processingTxt='Processing...';
	noChartDataText="No chart data available.";
	isChecked = false;
	portfolioName="";
	valueItemProcessing=true;
	riskItemProcessing=true;
	noRecord="No records found.";
	processingTxtOfList='Processing...';
	title='BullsEye Investors | Portfolio';
	PriceTo3DecimalPlacesMsg="Target Price should be to 3 decimal place";
	holdingUnit="";
	targetPriceisRequiredMsg="Target Price is required!";
	dateText="Date";
	valueText="Value";
	chartValue = "Value";
	currencyText="Currency";
	costText="Cost";
	symbol="";
	showBookingSymbol=false;
	showMarketSymbol=false;
	currencyPriceList = {};
	stockExchangeType: [];
	criteriaFilter = [{ 'key': 'high', 'value': 'Top 10 by 24 Hour Change' }, { 'key': 'low', 'value': 'Bottom 10 by 24 Hour Change' }, { 'key': 'market_cap', 'value': 'Top 10 by Market Capitalisation' }];
	graphFilter:number = 0;
    constructor(private translate: TranslateService,private commonService: CommonService, private investmentService: InvestmentService, private modalService: NgbModal,private portfolioService: PortfolioService, private _fb: FormBuilder, vcr: ViewContainerRef, private router: Router, public toastr: ToastrManager, private loadingBar: LoadingBarService,private titleService: Title,
	private meta: Meta,private activeRoute: ActivatedRoute) {}
    ngOnInit() {
		this.meta.removeTag('name=title');
		this.meta.removeTag('name=description');
		
		if ((localStorage.getItem('userProfileInfo') === '' || localStorage.getItem('userProfileInfo') === undefined || localStorage.getItem('userProfileInfo') === null) && (localStorage.getItem('userAccessToken') === '' || localStorage.getItem('userAccessToken') === undefined || localStorage.getItem('userAccessToken') === null) && (localStorage.getItem("portfolioId") == '' || localStorage.getItem("portfolioId") == undefined || localStorage.getItem("portfolioId") == null) && (localStorage.getItem("portfolioCurrency") == '' || localStorage.getItem("portfolioCurrency") == undefined || localStorage.getItem("portfolioCurrency")==null) && (localStorage.getItem("portfolioType") == '' || localStorage.getItem("portfolioType") == undefined || localStorage.getItem("portfolioType") == null)  && (localStorage.getItem("portfolioName") == '' || localStorage.getItem("portfolioName") == undefined || localStorage.getItem("portfolioName") == null) && (localStorage.getItem('loginUserName') === '' || localStorage.getItem('loginUserName') === undefined || localStorage.getItem('loginUserName') === null))
    		this.router.navigate(['/login']);
		
		
		if(this.activeRoute.snapshot.queryParams){
			if(this.activeRoute.snapshot.params.pname!=undefined && this.activeRoute.snapshot.params.pname!=null && this.activeRoute.snapshot.params.username!=undefined && this.activeRoute.snapshot.params.username!=null){
				if(this.activeRoute.snapshot.params.pname!=localStorage.getItem('portfolioName') || this.activeRoute.snapshot.params.username!=localStorage.getItem('loginUserName'))
					this.router.navigate(['/home/'+localStorage.getItem('loginUserName')]);
			}
			else
				this.router.navigate(['/home/'+localStorage.getItem('loginUserName')]);
		}
		else
			this.router.navigate(['/home/'+localStorage.getItem('loginUserName')]);
		
		this.title="BullsEye Investors | Portfolio | "+localStorage.getItem('portfolioName');
		this.titleService.setTitle(this.title);
    	this.profileInfo = JSON.parse(localStorage.getItem('userProfileInfo'));
		 /* Set Language Translator */
		this.translate.addLangs(['en', 'ko', 'hi', 'zh', 'es', 'ja']);
		this.translate.setDefaultLang('en');
		this.model.currentCurrency = this.profileInfo.baseCurrency;
		this.priceAlert.currentCurrency =this.profileInfo.baseCurrency;
		this.priceAlertCurrency=this.profileInfo.baseCurrency;
		const browserLang = (this.profileInfo.defaultLanguage!=undefined && this.profileInfo.defaultLanguage!='')?this.profileInfo.defaultLanguage:'en';
		this.translate.use(browserLang.match(/en|ko|hi|zh|es|ja/) ? browserLang : 'en');
		this.translate.get('Somethingwentwrong').subscribe(value => { 
			this.defaulterrSomethingMsg=value;
		});
		this.translate.get('Processing...').subscribe(value => { 
			this.processingTxt=value
			this.processingTxtOfList=value;
		});
		this.translate.get('Nochartdataavailable').subscribe(value => { 
			this.noChartDataText=value;
		});
		this.translate.get('Norecordsfound').subscribe(value => { 
			this.noRecord=value;
		});
		this.translate.get('TargetPriceisRequired').subscribe(value => { 
			this.targetPriceisRequiredMsg=value;
		});
		this.translate.get('Priceto3decimalplaces').subscribe(value => { 
			this.PriceTo3DecimalPlacesMsg=value;
		});
    	this.investmentForm=this._fb.group({
			'ticker':['',Validators.required],
			'holding':['',Validators.required],
			'bookingCost':['',[Validators.required]],
			'marketValue':['',[Validators.required]]
		});
		try {
	      this.currencyList = this.commonService.getCurrency();
		  this.currencyItemList = this.currencyList;
	    } catch (error) {}
		var objectNtype=this;
		this.currencyList.map(function(item){
			if(item.name==localStorage.getItem("portfolioCurrency"))
				objectNtype.symbol=item.symbol;
		});
		/* Get Localstorage Value*/
		this.portfolioId= parseInt(localStorage.getItem("portfolioId"));
		this.portfolioCurrency=localStorage.getItem("portfolioCurrency");
		this.portfolioType=localStorage.getItem("portfolioType");
		this.portfolioName=localStorage.getItem("portfolioName");
		this.showTabList(1);
		setTimeout(function(){
			objectNtype.translate.get('Date').subscribe(value => { 
				objectNtype.dateText=value;
			});
			objectNtype.translate.get('value').subscribe(value => { 
				objectNtype.valueText=value;
			});
			objectNtype.translate.get('Currency').subscribe(value => { 
				objectNtype.currencyText=value;
			});
			objectNtype.translate.get('Cost').subscribe(value => { 
				objectNtype.costText=value;
			});
			objectNtype.getPortfolioDetails();
			/* Chart Call */
			objectNtype.getChartData(1,'month',0);
		},500);
	}
	get f() { return this.investmentForm.controls; }
	showTabList(i){
		this.indMenu=i;
		this.showValueList=this.showRiskList=this.showPerformanceList =false;
		if(i==1)
			this.showValueList=true;
		else if(i==2) {
			this.showRiskList=true;
							}
		else {
			this.showPerformanceList=true;
							}
	}
	setHoldingValue(v){
		let input=this.investmentForm.controls.holding.value;
		input=(input!=null && input!='' && input!=undefined)?input:0;
		input=(input.toString().indexOf(",")>-1)?input.replace(/,/g, ""):input;
		input=(v.toLowerCase()=='stock')?parseInt(input):parseFloat(input);
		
		this.investmentForm.controls["holding"].setValue((v.toLowerCase()=='stock')?(this.formatNumber(input)):(this.formatNumber(input.toFixed(6))));
	}
	calculateBookingCost(v){
		var bookCost=this.investmentForm.controls.bookingCost.value;
		if(bookCost!="" && bookCost!=undefined && bookCost!=null){
			bookCost=(bookCost.indexOf(",")>-1)?bookCost.replace(/,/g, ""):bookCost;
			if(bookCost.indexOf(".")>-1){
				let decimalPos = bookCost.split('.');
				bookCost=decimalPos[0]+"."+decimalPos[1];
				//this.investmentForm.controls["bookingCost"].setValue(bookCost);
			}
		}
		else
			bookCost="0";
		
		this.investmentForm.controls['bookingCost'].setValue(this.formatNumber((v=='sell')?parseFloat(bookCost).toFixed(3):parseFloat(bookCost).toFixed(2)));
		this.showBookingSymbol=true;
	}
	validateNumber(e: any,v) {
		let input = this.investmentForm.controls.holding.value;
		input=(input==null)?'':input;
		if(v.toLowerCase()=='stock'){
			
		}
		else{
			const reg=/^\d*(?:[.,]\d{1,6})?$/;
			//var convertValue=parseFloat(input);
			if (!reg.test(input)){
				e.preventDefault();
				var decimalPos = input.split('.');
				var value=decimalPos[0]+"."+decimalPos[1].substring(0,6);
			    this.investmentForm.controls["holding"].setValue(value);
			}	
		}
    }
	getPortfolioDetails() {
		
		var objectType = this;
		objectType.valueList=objectType.riskList=[];
		this.valueItemProcessing=this.riskItemProcessing=true;
		this.processingTxtOfList=this.processingTxt;
		if(this.portfolioId>0){
			
			objectType.searchSearchText =this.processingTxt;
			objectType.loadingBar.start();
			this.portfolioService.getPortfolioDetails(this.portfolioId,function(err, response){
				
				if( err ){
				  objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
				  objectType.searchSearchText=objectType.defaulterrSomethingMsg;
				  objectType.processingTxtOfList=objectType.noRecord;
				}	
				if( response.statusCode == 200 ) {
					
					if (response.data[1].status === true)
						objectType.currencyPriceList = response.data[1].data;
					if(response.data[0].status == true){
						
						if(response.data[0].tickerList!= undefined && response.data[0].tickerList.length>0) {
							objectType.valueItemProcessing=false;
					        objectType.valueList=response.data[0].tickerList;
						}
						else
							objectType.processingTxtOfList=objectType.noRecord;
						
					    if(response.data[0].performanceIndicator!=undefined && response.data[0].performanceIndicator.length>0) {
							objectType.riskItemProcessing=false;
							var performanceArray=response.data[0].performanceIndicator;
							var newDataArray=[];
							response.data[0].tickerList.map(function(item){
								var check=false;
								performanceArray.map(function(pitem){
									if(pitem.tickerId==item.tickerId){
										newDataArray.push(pitem);
										check=true;
									}
								});
								if(!check){
									newDataArray.push(
										{
											alpha1YChange:'N/A',
											alpha6MChange:'N/A',
											alphaChange:  'N/A',
											alphaMarketId:  'N/A',
											alphaMarketSymbol:'N/A',
											alphaWChange:'N/A',
											avgPotential:'N/A',
											avgRisk:'N/A',
											concentration:"N/A",
											fundamentals:"N/A",
											investmentId:item.id,
											longTerm:"N/A",
											mediumTerm:"N/A",
											name:item.name,
											opportunity:"N/A",
											potentialId:"N/A",
											potentialText:"N/A",
											riskText:"N/A",
											shortTerm:"N/A",
											symbol:item.symbol,
											tickerId:item.tickerId,
											type:item.type,
											voladility:"N/A",
											isTemp:0
										});
								}
						});
						objectType.riskList=newDataArray;
							//objectType.riskList=response.data.performanceIndicator;
						}
						else{
						    if(response.data[0].tickerList!= undefined && response.data[0].tickerList.length>0){
								objectType.riskItemProcessing=false;
								let newDataArray=[];
								response.data[0].tickerList.map(function(item){
									return newDataArray.push(
										{
											alpha1YChange:'N/A',
											alpha6MChange:'N/A',
											alphaChange:  'N/A',
											alphaMarketId:  'N/A',
											alphaMarketSymbol:'N/A',
											alphaWChange:'N/A',
											avgPotential:'N/A',
											avgRisk:'N/A',
											concentration:"N/A",
											fundamentals:"N/A",
											investmentId:item.id,
											longTerm:"N/A",
											mediumTerm:"N/A",
											name:item.name,
											opportunity:"N/A",
											potentialId:"N/A",
											potentialText:"N/A",
											riskText:"N/A",
											shortTerm:"N/A",
											symbol:item.symbol,
											tickerId:item.tickerId,
											type:item.type,
											voladility:"N/A",
											isTemp:0
										}
									);
								});
								objectType.riskList=newDataArray;
							}
							else
								objectType.processingTxtOfList =objectType.noRecord;
						}
						
						objectType.totalMarketVal=(response.data[0].totalMarketVal!=undefined)?Math.round((response.data[0].totalMarketVal)):0;
						objectType.portfolioChanges=(response.data[0].performance!=undefined)?response.data[0].performance:0;
					}
					else {
						objectType.processingTxtOfList=objectType.noRecord;
					}
				}
				else {
					objectType.searchSearchText=((response.data[0].message== undefined || response.data[0].message=='')?objectType.defaulterrSomethingMsg:response.data[0].message);
					objectType.toastr.errorToastr(((response.data[0].message==undefined || response.data[0].message=='')?objectType.defaulterrSomethingMsg:response.data[0].message), null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
					objectType.processingTxtOfList=objectType.noRecord;
				}
				objectType.loadingBar.stop();
			});
		}
		else{
			objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
			objectType.processingTxtOfList=objectType.noRecord;
			objectType.searchSearchText=objectType.defaulterrSomethingMsg;
		}
    }
	addInvestment(){
		if(this.portfolioId>0 && this.portfolioCurrency!="" && this.portfolioType!="") {
			this.router.navigate(['investment']);
		}
		else {
			this.toastr.errorToastr(this.defaulterrSomethingMsg,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
		}
	}
	gotoPortfolioHistory(){
		if(this.portfolioId>0 && this.portfolioCurrency!="" && this.portfolioType!="") {
		    this.router.navigate(['portfolio-history']);
		}
		else {
			this.toastr.errorToastr(this.defaulterrSomethingMsg,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
		}
	}

	setUpPopupItem(content,type, keyIndex) {
		
		const objectType = this;
		objectType.loadingBar.start();
		this.showMarketSymbol=this.showBookingSymbol=false;
		this.investmentForm.reset();
		this.investmentForm.controls["holding"].setValue("");
		this.modelHeading = type;
		this.investDetails = this.valueList[keyIndex];
		this.investmentForm.controls["ticker"].setValue(this.investDetails.name +' ('+this.investDetails.symbol+')');
		this.commonService.getServerMarketValue(this.investDetails.symbol,this.investDetails.type, this.portfolioCurrency,function(err, response) {
			if ( err ) {
			  objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
			}
			if (response.statusCode === 200 ) {
				
				if (response.data[1].status === true) { 
					objectType.currencyPriceList = response.data[1].data;
				}
				if(response.data[0]!=undefined && response.data[0]!=null && response.data[0]!=""){
					if(objectType.investDetails.type.toLowerCase()=='crypto' || objectType.investDetails.type.toLowerCase()=='cryptocurrency'){
						Object.keys(response.data[0]).forEach(function (key,value) {
							objectType.investDetails.currentTickerPrice=response.data[0][key];
						});
					}
					else {
						var currentPrice=0;
						if((response.data[0]["data"][0].price!=undefined && response.data[0]["data"][0].price!=null && response.data[0]["data"][0].price!="")){
							currentPrice=(response.data[0]["data"][0].price!=undefined && response.data[0]["data"][0].price!=null && response.	data[0]["data"][0].price!="")?response.data[0]["data"][0].price:0;
							currentPrice=objectType.getCurrencyValue(currentPrice,response.data[0]["data"][0].currency,objectType.portfolioCurrency,'price');
							
						}
						objectType.investDetails.currentTickerPrice=currentPrice;
					}
					objectType.modalService.open(content).result.then((result) => {
						objectType.closeResult = `Closed with: ${result}`;
					}, (reason) => {
					  objectType.closeResult = `Dismissed ${objectType.getDismissReason(reason)}`;
					});
				}
				else
				{
					objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
				}
			}
			objectType.loadingBar.stop();
			
		});
	}
	deleteInvestmentItem(content,type, keyIndex) {
		this.investmentForm.reset();
		this.modelHeading = type;
		this.investDetails = this.valueList[keyIndex];
		this.investDetails.keyIndex = keyIndex;

	    this.modalService.open(content).result.then((result) => {
	      this.closeResult = `Closed with: ${result}`;
	    }, (reason) => {
	      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
	    });
	}
	public getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
		  return 'by pressing ESC';
		}
		else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
		  return 'by clicking on a backdrop';
							}
		else {
		  return `with: ${reason}`;
							}
	}
	calculateMarketPrice(v){
		
		this.showMarketSymbol=this.showBookingSymbol=false;
		this.holdingUnit = this.investmentForm.controls.holding.value;
		this.holdingUnit=(this.holdingUnit==null || this.holdingUnit==undefined)?"0":this.holdingUnit;
		
		this.holdingUnit=(this.holdingUnit.toString().indexOf(",")>-1)?this.holdingUnit.replace(/,/g, ""):this.holdingUnit;
		if(v.toLowerCase()=='stock'){
			   this.holdingUnit=(this.holdingUnit.toString()!="" && this.holdingUnit.toString()!=null && this.holdingUnit.toString()!=undefined)?this.holdingUnit:"0";
				this.investmentForm.controls["holding"].setValue(parseInt(this.holdingUnit));
		}
		else{
			if(this.holdingUnit.toString().indexOf(".")>-1){
				let decimalPos = this.holdingUnit.split('.');
				this.holdingUnit=(decimalPos[1].length>6)?(decimalPos[0]+"."+decimalPos[1].substring(0,6)):decimalPos[0]+"."+decimalPos[1];
			}
			
			this.investmentForm.controls["holding"].setValue(this.formatNumber(this.holdingUnit));
		}
		if(this.holdingUnit!="" && this.holdingUnit!=undefined){
			this.showBookingSymbol=this.showMarketSymbol=true;
		}
		let holdU=(this.holdingUnit.toString().indexOf(",")>-1)?this.holdingUnit.replace(/,/g, ""):this.holdingUnit;
		holdU=(holdU=="")?"0":holdU;
		let holdU1=parseFloat(holdU);
		
		var bookCost=this.investmentForm.controls.bookingCost.value;
		if(bookCost!="" && bookCost!=undefined && bookCost!=null){
			this.showBookingSymbol=true;
			bookCost=(bookCost.indexOf(",")>-1)?bookCost.replace(/,/g, ""):bookCost;
			if(bookCost.indexOf(".")>-1){
				let decimalPos = bookCost.split('.');
				bookCost=decimalPos[0]+"."+decimalPos[1];
				// this.investmentForm.controls["bookingCost"].setValue(bookCost);
			}
		}
		else {
			bookCost="0";
		}
		
		bookCost=parseFloat(bookCost);
		var marketValue = ((this.modelHeading == 'Buy')?((this.investDetails.currentTickerPrice) * holdU1):(bookCost * holdU1));
		this.showMarketSymbol=true;
		this.investmentForm.controls["marketValue"].setValue(this.formatNumber(marketValue.toFixed(2)));
		/* if(bookCost=="0")
			this.investmentForm.controls["bookingCost"].setValue(this.formatNumber(bookCost.toFixed(2))); */

	}
	addInvestmentAction(){
		this.submitted = true;

		if (this.investmentForm.invalid && (this.investDetails.id == '' || this.investDetails.id == undefined)) {
            return;
		}
		let holdU=(this.investmentForm.controls.holding.value.toString().indexOf(".")>-1)?this.investmentForm.controls.holding.value.replace( /[^\d.]/g, ''):this.investmentForm.controls.holding.value;
		holdU=(holdU.toString().indexOf(",")>-1)?holdU.replace(/,/g, ""):holdU;
		
		let bookNCost=(this.investmentForm.controls.bookingCost.value.toString().indexOf(".")>-1)?this.investmentForm.controls.bookingCost.value.replace( /[^\d.]/g, ''):this.investmentForm.controls.bookingCost.value;
		bookNCost=(bookNCost.toString().indexOf(",")>-1)?bookNCost.replace(/,/g, ""):bookNCost;
		
		let marketUCost=(this.investmentForm.controls.marketValue.value.toString().indexOf(".")>-1)?this.investmentForm.controls.marketValue.value.replace( /[^\d.]/g, ''):this.investmentForm.controls.marketValue.value;
		marketUCost=(marketUCost.toString().indexOf(",")>-1)?marketUCost.replace(/,/g, ""):marketUCost;
		
		if(holdU==undefined || holdU=='' ||  parseFloat(holdU)==0 || marketUCost==undefined || marketUCost=='' || parseFloat(marketUCost)==0 || bookNCost==undefined || bookNCost=='' ||  parseFloat(bookNCost)==0 || this.investDetails.currentTickerPrice==undefined || this.investDetails.currentTickerPrice=='' || parseFloat(this.investDetails.currentTickerPrice)==0) {
		  return;
		}
		
		if(this.modelHeading=='Sell'){
			bookNCost=marketUCost;
			marketUCost=(Math.round((this.investDetails.currentTickerPrice*parseFloat(holdU) * 100) / 100)).toFixed(3);
		}
		
		let formData = {"investmentId" : this.investDetails.id, "tickerId": this.investDetails.tickerId, "noOfUnits" : holdU,"bookCost":bookNCost,"marketCalCost":marketUCost, currentTickerPrice: this.investDetails.currentTickerPrice};


		var objectType = this;
		this.loading =true;
		this.loadingBar.start();
		this.investmentService.addInvestmentAction(this.modelHeading, formData, function(err, response){
			objectType.loading = false;
			objectType.loadingBar.stop();
			if( err ) {
			  objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
			}
			if( response.statusCode == 200 ) {
				objectType.toastr.successToastr(response.data.message,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
				objectType.investmentForm.reset();
				objectType.modalService.dismissAll();
				objectType.submitted = false;
				/* Portfolio Call */
				objectType.getPortfolioDetails();
				/* Chart Call */
				objectType.getChartData(objectType.num, objectType.type, objectType.indMap);
				/*--------- We need reload current page -----------*/

			}
			else {
			  objectType.toastr.errorToastr(response.data.message,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
			}
		});
	}

	DeleteInvestment(){
		this.submitted = true;

		if (this.investDetails.id == '' || this.investDetails.id == undefined) {
            return;
		}

		let formData = {"investmentId" : this.investDetails.id, "tickerId": this.investDetails.tickerId, "noOfUnits" : this.investDetails.noOfUnits,"bookCost":this.investDetails.bookCostVal,"marketCalCost":this.investDetails.marketCalCost, currentTickerPrice: this.investDetails.currentTickerPrice};


		var objectType = this;
		this.loading =true;
		this.loadingBar.start();
		this.investmentService.addInvestmentAction(this.modelHeading, formData, function(err, response){
			objectType.loading = false;
			objectType.loadingBar.stop();
			if( err ) {
			  objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
			}
			if( response.statusCode == 200 ) {
				objectType.toastr.successToastr(response.data.message,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
				objectType.valueList.splice(objectType.investDetails.keyIndex,1);
				objectType.modalService.dismissAll();
				/* Portfolio Call */
				objectType.getPortfolioDetails();
				/* Chart Call */
				objectType.getChartData(objectType.num, objectType.type, objectType.indMap);
				/*--------- We need reload current page -----------*/

			}
			else {
			  objectType.toastr.errorToastr(response.data.message,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
			}
		});
	}
	setPriceAlert(){
		this.priceAlertError.amount=(this.priceAlert.amount !=undefined && this.priceAlert.amount!="")?false:true;
		this.priceAlertError.expiryDate=(this.priceAlert.expiryDate !=undefined && this.priceAlert.expiryDate!="")?false:true;
		if(this.priceAlertError.amount){
			this.toastr.errorToastr(this.targetPriceisRequiredMsg,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true}); 
			return false;
		}
		else{
			if (!(/^\d+[.,]?\d{0,3}$/g).test(this.priceAlert.amount)) {
			  this.toastr.errorToastr(this.PriceTo3DecimalPlacesMsg,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true}); 
			  return false;
			}
		}
	    let month = (this.priceAlert.expiryDate.month < 10 )? '0'+this.priceAlert.expiryDate.month : this.priceAlert.expiryDate.month;
	    let day = (this.priceAlert.expiryDate.day < 10 )? '0'+this.priceAlert.expiryDate.day : this.priceAlert.expiryDate.day;
	    let expiryDatevalue = day+'/'+month+'/'+this.priceAlert.expiryDate.year

	    const formData = {"tickerId": this.priceAlert.tickerId, "alertPriceType" : this.priceAlert.compare,"priceThreshold":this.priceAlert.amount,"expiryDate":expiryDatevalue,"currency":this.priceAlert.currentCurrency};
	    var objectType = this;
	    this.loading =true;
	    this.loadingBar.start();
	    this.commonService.addPriceAlert(formData, function(err, response){
	      objectType.loading = false;
	      objectType.loadingBar.stop();
	      if( err ) {
	        objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
							}
	      if( response.statusCode == 200 ) {
	        objectType.toastr.successToastr(response.data.message, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
	        objectType.modalService.dismissAll();
	      }
	      else {
	        objectType.toastr.errorToastr(response.data.message,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
							}
	    });
  	}

  	priceAlertPopup(content, keyIndex) {
		if (!this.profileInfo.isProAccount){
			localStorage.setItem("proActive","false");
			this.router.navigateByUrl('/check-pro', {skipLocationChange: true}).then(()=>
			this.router.navigate(['/account-settings']));
		}
		else{
			const tickerDetails = this.valueList[keyIndex];

			this.priceAlert.tickerName = tickerDetails.name;
			this.priceAlert.symbol = tickerDetails.symbol;
			this.priceAlert.amount = '';
			this.priceAlert.tickerId = tickerDetails.tickerId;
			this.priceAlert.currentCurrency=this.profileInfo.baseCurrency;
			this.priceAlertCurrency=this.profileInfo.baseCurrency;
			this.priceAlert.tickerIcon=(tickerDetails.tickerUrl!='' && tickerDetails.tickerUrl!=undefined)?tickerDetails.tickerUrl:'../assets/images/not-found.png';
			this.modalService.open(content).result.then((result) => {
			  this.closeResult = `Closed with: ${result}`;
			}, (reason) => {
			  this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			});
		}
	 }
	 getCurrencyValue(price,currency,toCurrency,key = 'price') {
    	// const price = (key === 'price') ? watchListData.price : watchListData.market_cap;
		const keyType = (key === 'price') ? false : true;
    	// const currency = watchListData.currency;
    	return this.commonService.getGlobalCurrencyConvertValue(this.currencyPriceList, price, currency, toCurrency,keyType);
    }
	getChartData(num,type,clickind){
		var objectType = this;
		this.activeTab = 'active';
		this.indMap=clickind;
		this.num=num;
		this.type=type;
		this.portGraphDataText=this.processingTxt;
		objectType.loadingBar.start();
		if(num!="" && type!="" && this.portfolioId>0){
			num=parseInt(num);	
			this.portfolioService.getPortfolioGraphDetails(this.portfolioId,type,num,function(err, response){
				if( err ){
				  objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
				  objectType.portGraphDataText=objectType.defaulterrSomethingMsg;
				}
				if( response.statusCode == 200 ) {
					var keys = [];
					let data=[];
					objectType.portGraphDataText="";
					if (response.data[1].status === true) {
						objectType.currencyPriceList = response.data[1].data;
					}
					if (response.data[0].status === true)
					{
						if(response.data[0].historyData.graphData.length>0 && response.data[0].historyData.graphData !=undefined){
							data=response.data[0].historyData.graphData;
							data.map(function(item) {
								let newPrice=objectType.getCurrencyValue(item.price,item.currency,objectType.portfolioCurrency,'price')
								return keys.push({date:new Date(item.marketdate),value:objectType.formatNumber(parseFloat(newPrice).toFixed(2)),cost:objectType.formatNumber(parseFloat(item.totalBookCost).toFixed(2)),currency:objectType.portfolioCurrency});
							});
							objectType.renderChart(keys,"value");
							objectType.renderChart(keys,"cost");
						}
						else {
							objectType.portGraphDataText=objectType.noChartDataText;
						}
					}
					else {
						objectType.portGraphDataText=objectType.noChartDataText;
					}
				}
				else {
					objectType.toastr.errorToastr(response.data.message,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
					objectType.portGraphDataText=response.data.message;
					/*if(response.statusCode == 401) {
						localStorage.removeItem("userAccessToken");
						localStorage.removeItem("userProfileInfo");
						objectType.router.navigate(['/login']);
					}*/

				}
				objectType.loadingBar.stop();
			});
		}
		else{
			this.portGraphDataText=objectType.noChartDataText;
			objectType.loadingBar.stop();
		}
	}
	/* Render Chart Data */
	renderChart(data,type){
		am4core.useTheme(am4themes_animated);
		let chart = am4core.create((type=='value')?"chartdiv":"bookchart", am4charts.XYChart);
		chart.paddingRight = 20;
		chart.data = data;
		let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
		dateAxis.renderer.grid.template.location = 0;
		dateAxis.renderer.grid.template.disabled = true;
		dateAxis.renderer.ticks.template.disabled = true;
		dateAxis.renderer.labels.template.disabled = true;
		dateAxis.tooltip.disabled = true;
		if(type=='value') {
			this.createAxisAndSeries("value",chart);
		}
		else{
			if(this.graphFilter ==1){
				this.createAxisAndSeries("valuebookcost",chart);
			}else if(this.graphFilter ==2){
				this.createAxisAndSeries("bookcost",chart);
			}else{				
				this.createAxisAndSeries("valuebookcost",chart);
				this.createAxisAndSeries("bookcost",chart);
			}
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
		if(field=="value"){
			let series = chart.series.push(new am4charts.LineSeries());
			series.dataFields.dateX = "date";
			series.dataFields.valueY = "value";
			series.strokeWidth = 1.5;
			series.stroke = am4core.color("#00b050");

			// let currency=this.chatDetailsCurrency;
			series.tooltipText =
			this.dateText+`: {date}\n`+
			this.currencyText+`: {currency}\n`+
			this.chartValue+`: {value}`;
			/* Set Chart Tooltip Style */
			series.tooltip.getFillFromObject = false;
			series.tooltip.background.fill = am4core.color("#00b050");
		}
		else if(field=="valuebookcost"){
			let series = chart.series.push(new am4charts.LineSeries());
			series.dataFields.dateX = "date";
			series.dataFields.valueY = "value";
			series.strokeWidth = 1.5;
			series.stroke = am4core.color("#00b050");
		}
		else if(field=="bookcost"){
			let series = chart.series.push(new am4charts.LineSeries());
			series.dataFields.dateX = "date";
			series.dataFields.valueY = "cost";
			series.strokeWidth = 1.5;
			series.stroke = am4core.color("#ff0000");
			series.tooltipText =
			this.dateText+`: {date}\n`+
			this.currencyText+`: {currency}\n`+
			this.valueText+`: {value}\n`+
			this.costText+`: {cost}`;

			/* Set Chart Tooltip Style */
			series.tooltip.getFillFromObject = false;
			series.tooltip.background.fill = am4core.color("#00b050");
		}
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
	/* toggle me action*/
	toggleMe(i){
		Object.keys(this.hideme).forEach(h => {
			if(h!=i) {
				this.hideme[h] = false;
			}
		});
		this.hideme[i] = !this.hideme[i];
	}
   goToTickerDetails(tickerId,tickerCurrency,tickerType,tickerName,tickerSymbol,watchlistId,keyIndex){

	  const tickerDetailsValue = this.riskList[keyIndex];
	  if (tickerId > 0 && (tickerCurrency!="" && tickerCurrency!=undefined) && (tickerType!="" && tickerType!=undefined) && Object.keys(tickerDetailsValue).length>0)  {
		localStorage.setItem("tickerId",tickerId);
		localStorage.setItem("tickerCurrency",tickerCurrency);
		localStorage.setItem("tickerType",tickerType);
		localStorage.setItem("tickerName",tickerName);
		localStorage.setItem("tickerSymbol",tickerSymbol);

		localStorage.setItem("shortTerm",(tickerDetailsValue.shortTerm==undefined || tickerDetailsValue.shortTerm=="N/A" || tickerDetailsValue.shortTerm=="0")?"":tickerDetailsValue.shortTerm);
		localStorage.setItem("mediumTerm",(tickerDetailsValue.mediumTerm==undefined || tickerDetailsValue.mediumTerm=="N/A" || tickerDetailsValue.mediumTerm=="0")?"":tickerDetailsValue.mediumTerm);
		localStorage.setItem("longTerm",(tickerDetailsValue.longTerm==undefined || tickerDetailsValue.longTerm=="N/A" || tickerDetailsValue.longTerm=="0")?"":tickerDetailsValue.longTerm);
		localStorage.setItem("voladility",(tickerDetailsValue.voladility==undefined || tickerDetailsValue.voladility=="N/A" || tickerDetailsValue.voladility=="0")?"":tickerDetailsValue.voladility);
		localStorage.setItem("fundamentals",(tickerDetailsValue.fundamentals==undefined || tickerDetailsValue.fundamentals=="N/A" || tickerDetailsValue.fundamentals=="0")?"":tickerDetailsValue.fundamentals);
		localStorage.setItem("alphaMarketId",(tickerDetailsValue.alphaMarketId==undefined || tickerDetailsValue.alphaMarketId=="N/A" || tickerDetailsValue.alphaMarketId=="0")?"":tickerDetailsValue.alphaMarketId);
		localStorage.setItem("investmentId",(tickerDetailsValue.investmentId==undefined || tickerDetailsValue.investmentId=="N/A" || tickerDetailsValue.investmentId=="0")?"":tickerDetailsValue.investmentId);
		localStorage.setItem("potentialId",(tickerDetailsValue.potentialId==undefined || tickerDetailsValue.potentialId=="N/A" || tickerDetailsValue.potentialId=="0")?"":tickerDetailsValue.potentialId);
		localStorage.setItem("pageTickerRequest",'portfolio-details');

		localStorage.setItem("watchlistId",(watchlistId=="")?"0":watchlistId);
		this.router.navigate(['/investment/'+tickerSymbol+'/'+tickerName]);
    } else {
		this.toastr.errorToastr(this.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
			}
   }
   /*Return Currency Symbol*/
   returnCurrSymbol(v) {
	  let cur=v;
	  v=(v=='GBX')?'GBP':v;
	  this.currencyItemList.map(function(item) {
			if(item.name===v) {
				cur = item.symbol;
			}
	  });
	  return cur;
   }
   checkTargetValidation() {
	 if(this.priceAlert.amount !== '') {
		 if (!(/^\d+[.,]?\d{0,3}$/g.test(this.priceAlert.amount))) {
		     const a = this.priceAlert.amount.split('.');
			 this.priceAlert.amount = a[0] + '.' + a[1].substring(0, 3);
		 }
	 }
   }
   setTagetValueWith3Digit(){
	  if(this.priceAlert.amount !== '') {
		 let amt=parseFloat(this.priceAlert.amount);
		 this.priceAlert.amount=amt.toFixed(3);
	  }
   }
   ChangeCurrency() {
		this.loadingBar.start();
		this.priceAlertCurrency = this.priceAlert.currentCurrency;
		this.loadingBar.stop();
   }
   numberOnlyForHold(event): boolean {
		const charCode = (event.which) ? event.which : event.keyCode;
		return (charCode > 31 && (charCode < 48 || charCode > 57))?false:true;
   }
   numberOnly(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      return (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))?false:true;
   }
   formatNumber(num) {
		var numNew=num.toString()
		if(numNew.indexOf(".")>-1){
			let vSplitValue=numNew.split('.');
			let v=vSplitValue[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
			return v+"."+vSplitValue[1];
		}
		else {
			return numNew.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
		}
  }
	/* Show hide chart*/
	showHideChart(val) {
		this.getChartData(this.num, this.type, this.indMap);
		this.activeFilter = false;
		// this.loadingBar.start();
		// this.isChecked = (this.isChecked) ? false : true;
		// this.getChartData(this.num, this.type, this.indMap);
		

		// document.getElementById('id-305').style.display = 'none';

		// debugger;
		// if (this.isChecked) {
		// 	debugger;
		// 	document.getElementById('chartdiv').style.display = 'flex';
		// 	document.getElementById('bookchart').style.display = 'flex';

		// }
		// else if("both") {
		// 	document.getElementById('bookchart').style.display = 'none';
		// 	document.getElementById('chartdiv').style.display = 'flex';
		// }
		// else {
		// 	document.getElementById('bookchart').style.display = 'flex';
		// 	document.getElementById('chartdiv').style.display = 'none';
		// }
		// this.loadingBar.stop();
	}

	// filterExchangeItem() {
	// 	this.loadingBar.start();
	// 	this.getChartData(this.num, this.type, this.indMap);
	// 	if (this.filterModel.graphDisplay) {
	// 		document.getElementById('chartdiv').style.display = 'none';
	// 		document.getElementById('bookchart').style.display = 'flex';

	// 	} else {
	// 		document.getElementById('bookchart').style.display = 'none';
	// 		document.getElementById('chartdiv').style.display = 'flex';
	// 	}
	// 	this.activeFilter = false;
	// 	this.loadingBar.stop();

	// }
}
