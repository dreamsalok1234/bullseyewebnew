import { Component, OnInit, ElementRef, ViewContainerRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { TranslateService } from '@ngx-translate/core';
import { state, style, transition, animate, trigger, AUTO_STYLE } from '@angular/animations';
import { PortfolioService } from '../../_services/portfolio.service';
import { CommonService } from '../../_services/common.service';
import { InvestmentService } from '../../_services/investment.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Title, Meta } from '@angular/platform-browser';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
@Component({
	selector: 'app-portfolio-history',
	templateUrl: './portfolio-history.component.html',
	styleUrls: ['./portfolio-history.component.scss'],
	animations: [routerTransition()]
})
export class PortfolioHistoryComponent implements OnInit {
	constructor(private translate: TranslateService, private portfolioService: PortfolioService, private commonService: CommonService, private investmentService: InvestmentService, private modalService: NgbModal, private _fb: FormBuilder, vcr: ViewContainerRef, private router: Router, public toastr: ToastrManager, private loadingBar: LoadingBarService, private titleService: Title,
		private meta: Meta) {

	}
	portfolioList = [];
	currentPage = 0;
	totalPage = 0;
	totalRecords = 0;
	pageSize = 10;
	pageNo = 1;
	investmentForm: FormGroup;
	profileInfo: any;
	closeResult: string;
	currencyItemList: any = [];
	btnText = '';
	ind = 0;
	deleteType = '';
	modelText = '';
	modelHeading = '';
	investDetails: any;
	loading = false;
	tickerMarketCapData = {};
	portfolioId = 0;
	portfolioCurrency = '';
	portfolioType = '';
	searchSearchText = '';
	processing = true;
	holdingUnit = '';
	defaulterrSomethingMsg = 'Something went wrong';
	processingTxt = 'Processing...';
	noRecordText = 'No Record';
	title = 'BullsEye Investors | Portfolio History';
	symbol = "";
	showBookingSymbol = true;
	showMarketSymbol = true;
	valueList = false;
	currencyPriceList = false;
	priceAlert = false;
	priceAlertCurrency = false;
	submitted = false;
	ngOnInit() {
		this.meta.removeTag('name=title');
		this.meta.removeTag('name=description');
		this.titleService.setTitle(this.title);
		/* Check Token */
		if ((localStorage.getItem('userProfileInfo') === '' || localStorage.getItem('userProfileInfo') === undefined || localStorage.getItem('userProfileInfo') == null) && (localStorage.getItem('userAccessToken') === '' || localStorage.getItem('userAccessToken') === undefined || localStorage.getItem('userAccessToken') == null) && (localStorage.getItem('portfolioId') === '' || localStorage.getItem('portfolioId') === undefined || localStorage.getItem('portfolioId') === null) && (localStorage.getItem('portfolioCurrency') === '' || localStorage.getItem('portfolioCurrency') === undefined || localStorage.getItem('portfolioCurrency') == null) && (localStorage.getItem('portfolioType') === '' || localStorage.getItem('portfolioType') === undefined || localStorage.getItem('portfolioType') === null)) {
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
		this.translate.get('Processing...').subscribe(value => {
			this.processingTxt = value;
		});
		this.translate.get('Norecordsfound').subscribe(value => {
			this.noRecordText = value;
		});

		this.investmentForm = this._fb.group({
			'ticker': ['', Validators.required],
			'holding': ['', Validators.required],
			'bookingCost': ['', [Validators.required]],
			'marketValue': ['', [Validators.required]]
		});
		/* Get Localstorage Value*/
		this.portfolioId = parseInt(localStorage.getItem('portfolioId'));
		this.portfolioCurrency = localStorage.getItem('portfolioCurrency');
		this.portfolioType = localStorage.getItem('portfolioType');
		/* Get All Static Currency*/
		try {
			this.currencyItemList = this.commonService.getCurrency();
		} catch (error) { }

		var objectNtype = this;
		this.currencyItemList.map(function (item) {
			if (item.name == localStorage.getItem("portfolioCurrency"))
				objectNtype.symbol = item.symbol;
		});

		this.getPortfolioHistory();
	}
	get f() { return this.investmentForm.controls; }
	getPortfolioHistory() {
		const objectType = this;
		if (this.portfolioId > 0) {
			objectType.searchSearchText = this.processingTxt;
			objectType.loadingBar.start();
			this.portfolioService.getPortfolioHistory(this.portfolioId, this.pageSize, this.pageNo, function (err, response) {

				if (err) {
					objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
					objectType.searchSearchText = objectType.defaulterrSomethingMsg;
				}
				if (response.statusCode === 200) {

					if (response.data.status === true) {
						if (response.data.historyData !== undefined && response.data.historyData.length > 0) {
							objectType.portfolioList = response.data.historyData;
							if (objectType.pageNo === 1) {
								objectType.totalPage = response.data.totalPage;
								objectType.totalRecords = response.data.totalRecords;
							}
							objectType.processing = false;
						} else {
							objectType.searchSearchText = objectType.noRecordText;
							objectType.processing = true;
						}
					} else {
						objectType.searchSearchText = objectType.noRecordText;
						objectType.processing = true;
					}
				} else {
					objectType.toastr.errorToastr(response.data.message, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
					objectType.searchSearchText = response.data.message;
					/*if(response.statusCode == 401) {
						localStorage.removeItem("userAccessToken");
						localStorage.removeItem("userProfileInfo");
						objectType.router.navigate(['/login']);
					}*/

				}
				objectType.loadingBar.stop();
			});
		} else {
			objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
			objectType.searchSearchText = objectType.defaulterrSomethingMsg;
		}
	}
	onPageChange(pageNo, checkStatus) {
		this.pageNo = pageNo;
		this.getPortfolioHistory();
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

	setUpPopupItem(content, keyIndex) {

		if (this.portfolioList[keyIndex].historyType.toLowerCase().trim() === 'investment') {

		} else {
			const objectType = this;
			objectType.loadingBar.start();
			this.showMarketSymbol = this.showBookingSymbol = false;
			this.investmentForm.reset();
			this.investmentForm.controls['holding'].setValue(this.portfolioList[keyIndex].noOfUnits);
			this.holdingUnit = this.portfolioList[keyIndex].noOfUnits;
			this.portfolioType = this.portfolioList[keyIndex].portfolioType;
			if (this.portfolioList[keyIndex].historyType.toLowerCase().trim() == 'buy')
				this.investmentForm.controls['marketValue'].setValue((this.portfolioList[keyIndex].currentTickerPrice * this.portfolioList[keyIndex].noOfUnits).toFixed(2));
			else
				this.investmentForm.controls['marketValue'].setValue(parseFloat(this.portfolioList[keyIndex].bookCost).toFixed(2));
			this.investmentForm.controls['bookingCost'].setValue(this.portfolioList[keyIndex].bookCost);
			this.modelHeading = this.portfolioList[keyIndex].historyType;
			this.investDetails = this.portfolioList[keyIndex];
			this.investmentForm.controls['ticker'].setValue(this.investDetails.name + ' (' + this.investDetails.symbol + ')');
			// this.investDetails.currentTickerPrice = 0;

			this.modalService.open(content).result.then((result) => {
				this.closeResult = `Closed with: ${result}`;
			}, (reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			});
			this.showMarketSymbol = this.showBookingSymbol = true;
			objectType.loadingBar.stop();
		}




	}

	addInvestmentAction() {
		this.submitted = true;

		if (this.investmentForm.invalid && (this.investDetails.id == '' || this.investDetails.id == undefined))
			return;
		let holdU = (this.investmentForm.controls.holding.value.toString().indexOf(".") > -1) ? this.investmentForm.controls.holding.value.replace(/[^\d.]/g, '') : this.investmentForm.controls.holding.value;
		holdU = (holdU.toString().indexOf(",") > -1) ? holdU.replace(/,/g, "") : holdU;

		let bookNCost = (this.investmentForm.controls.bookingCost.value.toString().indexOf(".") > -1) ? this.investmentForm.controls.bookingCost.value.replace(/[^\d.]/g, '') : this.investmentForm.controls.bookingCost.value;
		bookNCost = (bookNCost.toString().indexOf(",") > -1) ? bookNCost.replace(/,/g, "") : bookNCost;

		let marketUCost = (this.investmentForm.controls.marketValue.value.toString().indexOf(".") > -1) ? this.investmentForm.controls.marketValue.value.replace(/[^\d.]/g, '') : this.investmentForm.controls.marketValue.value;
		marketUCost = (marketUCost.toString().indexOf(",") > -1) ? marketUCost.replace(/,/g, "") : marketUCost;

		if (holdU == undefined || holdU == '' || parseFloat(holdU) == 0 || marketUCost == undefined || marketUCost == '' || parseFloat(marketUCost) == 0 || bookNCost == undefined || bookNCost == '' || parseFloat(bookNCost) == 0 || this.investDetails.currentTickerPrice == undefined || this.investDetails.currentTickerPrice == '' || parseFloat(this.investDetails.currentTickerPrice) == 0) {
			return;
		}

		if (this.modelHeading == 'Sell') {
			bookNCost = marketUCost;
			marketUCost = (Math.round((this.investDetails.currentTickerPrice * parseFloat(holdU) * 100) / 100)).toFixed(3);
		}

		let formData = { "investmentId": this.investDetails.investmentId, "tickerId": this.investDetails.tickerId, "noOfUnits": holdU, "bookCost": bookNCost, "marketCalCost": marketUCost, currentTickerPrice: this.investDetails.currentTickerPrice, transactionId: this.investDetails.transactionId };


		let objectType = this;
		this.loading = true;
		this.loadingBar.start();
		this.investmentService.addInvestmentAction(this.modelHeading, formData, function (err, response) {
			objectType.loading = false;
			objectType.loadingBar.stop();
			if (err) {
				objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
			}
			if (response.statusCode == 200) {
				objectType.toastr.successToastr(response.data.message, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
				objectType.investmentForm.reset();
				objectType.modalService.dismissAll();
				objectType.submitted = false;
				/* Portfolio Call */
				// objectType.getPortfolioDetails();
				/* Chart Call */
				// objectType.getChartData(objectType.num, objectType.type, objectType.indMap);
				/*--------- We need reload current page -----------*/

			} else {
				objectType.toastr.errorToastr(response.data.message, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
			}
		});
	}
	getCurrencyValue(price, currency, toCurrency, key = 'price') {
		// const price = (key === 'price') ? watchListData.price : watchListData.market_cap;
		const keyType = (key === 'price') ? false : true;
		// const currency = watchListData.currency;
		return this.commonService.getGlobalCurrencyConvertValue(this.currencyPriceList, price, currency, toCurrency, keyType);
	}



	numberOnlyForHold(event): boolean {
		const charCode = (event.which) ? event.which : event.keyCode;
		return (charCode > 31 && (charCode < 48 || charCode > 57)) ? false : true;
	}
	numberOnly(event): boolean {
		const charCode = (event.which) ? event.which : event.keyCode;
		return (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) ? false : true;
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

	public getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}

	calculateMarketPrice(v) {

		this.showMarketSymbol = this.showBookingSymbol = false;
		this.holdingUnit = this.investmentForm.controls.holding.value;
		this.holdingUnit = (this.holdingUnit == null || this.holdingUnit === undefined) ? '0' : this.holdingUnit;

		this.holdingUnit = (this.holdingUnit.toString().indexOf(',') > -1) ? this.holdingUnit.replace(/,/g, '') : this.holdingUnit;
		if (v.toLowerCase() === 'stock') {
			this.holdingUnit = (this.holdingUnit.toString() !== '' && this.holdingUnit.toString() != null && this.holdingUnit.toString() !== undefined) ? this.holdingUnit : '0';
			this.investmentForm.controls['holding'].setValue(parseInt(this.holdingUnit));
		} else {
			if (this.holdingUnit.toString().indexOf('.') > -1) {
				const decimalPos = this.holdingUnit.split('.');
				this.holdingUnit = (decimalPos[1].length > 6) ? (decimalPos[0] + '.' + decimalPos[1].substring(0, 6)) : decimalPos[0] + '.' + decimalPos[1];
			}

			this.investmentForm.controls['holding'].setValue(this.formatNumber(this.holdingUnit));
		}
		if (this.holdingUnit !== '' && this.holdingUnit !== undefined) {
			this.showBookingSymbol = this.showMarketSymbol = true;
		}
		let holdU = (this.holdingUnit.toString().indexOf(',') > -1) ? this.holdingUnit.replace(/,/g, '') : this.holdingUnit;
		holdU = (holdU === '') ? '0' : holdU;
		const holdU1 = parseFloat(holdU);

		let bookCost = this.investmentForm.controls.bookingCost.value;
		if (bookCost !== '' && bookCost !== undefined && bookCost != null) {
			this.showBookingSymbol = true;
			bookCost = (bookCost.indexOf(',') > -1) ? bookCost.replace(/,/g, '') : bookCost;
			if (bookCost.indexOf('.') > -1) {
				const decimalPos = bookCost.split('.');
				bookCost = decimalPos[0] + '.' + decimalPos[1];
				// this.investmentForm.controls["bookingCost"].setValue(bookCost);
			}
		} else {
			bookCost = '0';
		}

		bookCost = parseFloat(bookCost);
		const marketValue = ((this.modelHeading === 'Buy') ? ((this.investDetails.currentTickerPrice) * holdU1) : (bookCost * holdU1));
		this.showMarketSymbol = true;
		this.investmentForm.controls['marketValue'].setValue(this.formatNumber(marketValue.toFixed(2)));
		/* if(bookCost=="0")
			this.investmentForm.controls["bookingCost"].setValue(this.formatNumber(bookCost.toFixed(2))); */

	}
	setHoldingValue(v) {
		let input = this.investmentForm.controls.holding.value;
		input = (input != null && input !== '' && input !== undefined) ? input : 0;
		input = (input.toString().indexOf(',') > -1) ? input.replace(/,/g, '') : input;
		input = (v.toLowerCase() === 'stock') ? parseInt(input) : parseFloat(input);

		this.investmentForm.controls['holding'].setValue((v.toLowerCase() === 'stock') ? (this.formatNumber(input)) : (this.formatNumber(input.toFixed(6))));
	}
	calculateBookingCost(v) {
		let bookCost = this.investmentForm.controls.bookingCost.value;
		if (bookCost !== '' && bookCost !== undefined && bookCost != null) {
			bookCost = (bookCost.indexOf(',') > -1) ? bookCost.replace(/,/g, '') : bookCost;
			if (bookCost.indexOf('.') > -1) {
				const decimalPos = bookCost.split('.');
				bookCost = decimalPos[0] + '.' + decimalPos[1];
				// this.investmentForm.controls["bookingCost"].setValue(bookCost);
			}
		} else {
			bookCost = '0';
		}

		this.investmentForm.controls['bookingCost'].setValue(this.formatNumber((v === 'sell') ? parseFloat(bookCost).toFixed(3) : parseFloat(bookCost).toFixed(2)));
		this.showBookingSymbol = true;
	}
	numberWithCommas(x) {
		const parts = x.toString().split('.');
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		return parts.join('.');
	}



}


