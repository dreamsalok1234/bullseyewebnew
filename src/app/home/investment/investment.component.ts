import { Component, OnInit, ElementRef,  ViewContainerRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CommonService } from '../../_services/common.service';
import { InvestmentService } from '../../_services/investment.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { Title, Meta } from '@angular/platform-browser';
@Component({
    selector: 'app-investment',
    templateUrl: './investment.component.html',
    styleUrls: ['./investment.component.scss'],
    animations: [routerTransition()]
})
export class InvestmentComponent implements OnInit {
	showBtnText:string;
	investmentForm: FormGroup;
	submitted = false;
	currencyList = [];
	tickerList = [];
	loading = false;
	res=false;
	resTickerAutoComp=false;
	tickerId=0;
	tickerAmount=0;
	tickerName="";
	tickerError="";
	tickerCurrency="";
	currencyPriceList = {};
	profileInfo: any;
	defaulterrSomethingMsg='Something went wrong';
	tickerNameReq="Ticker name is required";
	tickerPriceMissText="Tickerpriceismissing";
	holdingReqText="Holding(units)isrequired";
	portfolioType='';
	holdingUnit="";
	symbol="";
	showBookingSymbol=false;
	showMarketSymbol=false;
	ticker : FormControl = new FormControl();
	title='BullsEye Investors | Investment';
    constructor(private translate: TranslateService,private commonService: CommonService,private investmentService:InvestmentService,private _fb: FormBuilder,vcr: ViewContainerRef, private router: Router, public toastr: ToastrManager,private loadingBar: LoadingBarService,private titleService: Title,
	private meta: Meta)
	{}
    ngOnInit() {
		this.titleService.setTitle(this.title);
    	 /* Check Token */
		if ((localStorage.getItem('userProfileInfo') === '' || localStorage.getItem('userProfileInfo') === undefined || localStorage.getItem('userProfileInfo') === null) && (localStorage.getItem('userAccessToken') === '' || localStorage.getItem('userAccessToken') === undefined || localStorage.getItem('userAccessToken') === null) && (localStorage.getItem('portfolioType') === '' || localStorage.getItem('portfolioType') === undefined || localStorage.getItem('portfolioType') === null) && (localStorage.getItem('portfolioCurrency') === '' || localStorage.getItem('portfolioCurrency') === undefined || localStorage.getItem('portfolioCurrency') === null)) 
			this.router.navigate(['/login']);
		
		this.profileInfo = JSON.parse(localStorage.getItem('userProfileInfo'));
		 /* Set Language Translator */
		this.translate.addLangs(['en', 'ko', 'hi', 'zh', 'es', 'ja']);
		this.translate.setDefaultLang('en');
		const browserLang = (this.profileInfo.defaultLanguage!=undefined && this.profileInfo.defaultLanguage!='')?this.profileInfo.defaultLanguage:'en';
		this.translate.use(browserLang.match(/en|ko|hi|zh|es|ja/) ? browserLang : 'en');
		this.translate.get('Somethingwentwrong').subscribe(value => { 
			this.defaulterrSomethingMsg=value;
		});
		this.translate.get('Tickernameisrequired').subscribe(value => { 
			this.tickerNameReq=value;
		});
		this.translate.get('Tickerpriceismissing').subscribe(value => { 
			this.tickerPriceMissText=value;
		});
		this.translate.get('Holding(units)isrequired').subscribe(value => { 
			this.holdingReqText=value;
		});
		/* Get All Static Currency*/
		try {
			this.currencyList = this.commonService.getCurrency();
		} 
		catch (error) {}
		var objectNtype=this;
		this.currencyList.map(function(item){
			if(item.name==localStorage.getItem("portfolioCurrency"))
				objectNtype.symbol=item.symbol;
		});
		this.portfolioType=(localStorage.getItem('portfolioType'));
		this._initForm();
		this.getCurrencyValue();
	}
	private _initForm():void{
		this.investmentForm=this._fb.group({
			'ticker':['',Validators.required],
			'holding':['',Validators.required],
			'bookingCost':['',[Validators.required]],
			'marketValue':['',[Validators.required]]
		});
		/* Create Auto complete*/
		var objectType = this;
		this.ticker.valueChanges.subscribe(
		  term => {
			setTimeout(function () {
				if (term != '' && objectType.res==false && objectType.resTickerAutoComp==false && localStorage.getItem("portfolioType")!=undefined && localStorage.getItem("portfolioType")!="" ) {
					objectType.loadingBar.start();
					objectType.res=true;
					objectType.commonService.getTickerList(term.toUpperCase(),localStorage.getItem("portfolioType"),function(err, response){
						if( err ){}
						if( response.statusCode == 200 ) {
							if(response.data.data.exchangeList.stockList!=undefined)
								objectType.tickerList =  response.data.data.exchangeList.stockList;
						}
						else 
						  {
							 objectType.toastr.errorToastr(((response.data.message==undefined || response.data.message=='')?objectType.defaulterrSomethingMsg:response.data.message), null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
							 if(response.statusCode == 401) {
								localStorage.clear();
								objectType.router.navigate(['/login']);
							 }
						  }
						objectType.loadingBar.stop();
						objectType.res=false;
					});
				}
				else objectType.resTickerAutoComp=false;
			}, 500);
		})
		 
	}
    get i() { return this.investmentForm.controls; }
	/* Get All Currency Value*/
	getCurrencyValue() {
    	var objectType = this;
		objectType.loadingBar.start();
    	this.commonService.getGlobalCurrencyValue(function(err, response){
    		if( err )
              objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
		  
          	if( response.statusCode == 200 )
          		objectType.currencyPriceList = response.data.data;
          	else
          		objectType.toastr.errorToastr(response.data.message,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
			
			objectType.loadingBar.stop();
    	});
    }
	/* Add Investment*/
	AddInvestment() {
		this.submitted = true;
		this.tickerError="";
		if(this.tickerName!=undefined && this.tickerName!="")
			this.investmentForm.controls["ticker"].setValue(this.tickerName);
		else
			this.tickerError=this.tickerNameReq;
		
		if (this.investmentForm.invalid) 
            return;
		if(this.checkPostVeryImpData()){
			objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true}); 
			return false;
		}
		
		
		let holdU=(this.investmentForm.controls.holding.value.toString().indexOf(".")>-1)?this.investmentForm.controls.holding.value.replace( /[^\d.]/g, ''):this.investmentForm.controls.holding.value;
		holdU=(holdU.toString().indexOf(",")>-1)?holdU.replace(/,/g, ""):holdU;
		
		let bookNCost=(this.investmentForm.controls.bookingCost.value.toString().indexOf(".")>-1)?this.investmentForm.controls.bookingCost.value.replace( /[^\d.]/g, ''):this.investmentForm.controls.bookingCost.value;
		bookNCost=(bookNCost.toString().indexOf(",")>-1)?bookNCost.replace(/,/g, ""):bookNCost;
		
		let marketUCost=(this.investmentForm.controls.marketValue.value.toString().indexOf(".")>-1)?this.investmentForm.controls.marketValue.value.replace( /[^\d.]/g, ''):this.investmentForm.controls.marketValue.value;
		marketUCost=(marketUCost.toString().indexOf(",")>-1)?marketUCost.replace(/,/g, ""):marketUCost;
		
        const formData = {"portfolioId" : localStorage.getItem("portfolioId"), "tickerId": this.tickerId, "noOfUnits" : holdU,"currentTickerPrice":this.tickerAmount,"bookCost":bookNCost,"marketCalCost":marketUCost};
		
		var objectType = this;
		this.loading =true;
		this.loadingBar.start();
		this.investmentService.addInvestment(formData, function(err, response){ 
			
			objectType.loading = false;
			objectType.loadingBar.stop();
			if( err )
			  objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
			if( response.statusCode == 200 ) {
				objectType.toastr.successToastr(response.data.message,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
				objectType.router.navigate([''+localStorage.getItem('portfolioName')+'/'+localStorage.getItem('loginUserName')]);
				objectType.investmentForm.reset();
				
			}
			else 
			  objectType.toastr.errorToastr(response.data.message,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true}); 
		});
		
	}
	/* Select Ticker */
	selectTicker(id,amount=0,name,currency){
		this.showMarketSymbol=this.showBookingSymbol=false;
		this.investmentForm.controls.holding.setValue("");
		this.investmentForm.controls.bookingCost.setValue("");
		this.investmentForm.controls.marketValue.setValue("");
		this.tickerId=id;
		this.tickerAmount=amount;
		this.tickerName=name;
		this.tickerCurrency=currency;
		this.resTickerAutoComp=true;
	}
	resetTickerTxt(){
		this.tickerId=this.tickerAmount=0;
		this.tickerName=this.tickerCurrency="";
	}
	calculateMarketPrice(v){
		this.showMarketSymbol=false;
		if(this.checkPostVeryImpData()){
			this.toastr.errorToastr(this.defaulterrSomethingMsg,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true}); 
			return false;
		}
		else{
			this.holdingUnit = this.investmentForm.controls.holding.value;
			this.holdingUnit=(this.holdingUnit==null || this.holdingUnit==undefined || this.holdingUnit=="")?"0":this.holdingUnit;
			if(v.toLowerCase()=='stock'){
				this.holdingUnit=(this.holdingUnit.toString().indexOf(",")>-1)?this.holdingUnit.replace(/,/g, ""):this.holdingUnit;
				this.holdingUnit=(this.holdingUnit.toString()!="" && this.holdingUnit.toString()!=null && this.holdingUnit.toString()!=undefined)?this.holdingUnit:"0";
				this.investmentForm.controls["holding"].setValue(parseInt(this.holdingUnit));
			}
			else{
				if(this.holdingUnit.toString().indexOf(".")>-1){
					let decimalPos = this.holdingUnit.split('.');
					this.holdingUnit=(decimalPos[1].length>6)?(decimalPos[0]+"."+decimalPos[1].substring(0,6)):decimalPos[0]+"."+decimalPos[1];
				}
				
				this.investmentForm.controls["holding"].setValue(this.holdingUnit);
			}
			
			//this.holdingUnit=this.investmentForm.controls.holding.value;
			if(this.holdingUnit!="" && this.holdingUnit!=undefined){
				let price=this.commonService.getGlobalCurrencyConvertValue(this.currencyPriceList,this.tickerAmount,this.tickerCurrency,localStorage.getItem("portfolioCurrency"));
				if(price>0 && price!=""){
					
					let holdU=(this.holdingUnit.toString().indexOf(",")>-1)?this.holdingUnit.replace(/,/g, ""):this.holdingUnit;
					let holdU1=parseFloat(holdU);
					price=parseFloat(price);
					this.showMarketSymbol=true;
					let newCalcPrice=((holdU1*price).toFixed(2));
					this.investmentForm.controls['marketValue'].setValue(this.formatNumber(newCalcPrice));
				}
				else{
					 this.toastr.errorToastr(this.tickerPriceMissText,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
				}
			}
			else{
				 this.investmentForm.controls['marketValue'].setValue("");
				 this.toastr.errorToastr(this.holdingReqText,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
				 
			}
		}
	}
	
	checkPostVeryImpData(){
		return (localStorage.getItem("portfolioId")==undefined && localStorage.getItem("portfolioId")=="" && localStorage.getItem("portfolioType")==undefined && localStorage.getItem("portfolioType")=="" && localStorage.getItem("portfolioCurrency")==undefined && localStorage.getItem("portfolioCurrency")=="" && this.tickerId==0 && this.tickerId==undefined && this.tickerAmount==0 && this.tickerAmount==undefined && this.tickerCurrency=="" && this.tickerCurrency==undefined);
	}
	calculateBookingCost(){
		let bookCost=this.investmentForm.controls.bookingCost.value.replace( /[^\d.]/g, '' );
		bookCost=(bookCost=="")?0:bookCost;
		this.investmentForm.controls['bookingCost'].setValue(this.formatNumber(parseFloat(bookCost).toFixed(2)));
		this.showBookingSymbol=true;
	}
	/*Numeric value with decimal value*/
   numberOnly(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      return (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))?false:true;
   }
   numberOnlyForHold(event): boolean {
		const charCode = (event.which) ? event.which : event.keyCode;
		return (charCode > 31 && (charCode < 48 || charCode > 57))?false:true;
   }
   checkBookValue(){
	   this.showBookingSymbol=false;
	   if(this.investmentForm.controls.bookingCost.value!="")
		   this.showBookingSymbol=true;
   }
   setHoldingValue(v){
		let input=this.investmentForm.controls.holding.value;
		input=(input!=null && input!='' && input!=undefined)?input:0;
		input=(input.toString().indexOf(",")>-1)?input.replace(/,/g, ""):input;
		input=(v.toLowerCase()=='stock')?parseInt(input):parseFloat(input);
		
		this.investmentForm.controls["holding"].setValue((v.toLowerCase()=='stock')?(this.formatNumber(input)):(this.formatNumber(input.toFixed(6))));
	}
	formatNumber(num) {
		var numNew=num.toString()
		if(numNew.indexOf(".")>-1){
			let vSplitValue=numNew.split('.');
			let v=vSplitValue[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
			return v+"."+vSplitValue[1];
		}
		else
			return numNew.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
   }
}
