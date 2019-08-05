import { Component, OnInit, ElementRef, ViewContainerRef,Sanitizer, SecurityContext } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../_services/common.service';
import { ChatService } from '../../_services/chat.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
//import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Title, Meta } from '@angular/platform-browser';
@Component({
    selector: 'app-chat-details',
    templateUrl: './chat-details.component.html',
    styleUrls: ['./chat-details.component.scss'],
    animations: [routerTransition()]
})
export class ChatDetailsComponent implements OnInit {
	model : any = {"currentCurrency": "USD"};
	filterModel: any = { "searchCriteria": 0, "graphDisplay": 0 };
	submitted = false;
	activeFilter = false;
	chatForm: FormGroup;
	chatComplaintForm:FormGroup;
	currentPage = 0;
	totalPage=0;
    loading = false;
	pageSize=10;
	pageNo=1;
	chatCurrency='USD';
	chatDetailsCurrency='USD';
	profileInfo : any;
	currencyItemList:any=[];
	chatList = [];
	closeResult: string;
	chatPrice=0;
	chatName="";
	chatSymbol="";
	chatType="";
	chatChangePer=0;
	chatImage="";
	chatBoardId=0;
	favouriteId=0;
	btnText="";
	timestampData="";
	chatListCheck=true;
	userName="";
	updateFavtype="";
	modelText="";
	userId=0;
	messageId=0;
	ind=0;
	indMap=1;
	searchText="";
	complaintMsg="";
	isMessageReq=false;
	chartDataText="";
	placeholderImageUrl: string;
	activeTab="";
	isChecked = false;
	num = '';
	type = '';
	defaulterrSomethingMsg='Something went wrong';
	processingTxt='Processing...';
	NoChatText="Why not be the first to post here?";
	AreYouAddYourFav="Are you sure want to add in your favourites list ?";
	deleteMsgText="Are you sure want to delete message ?";
	deleteFavMsgText="Are you sure want to remove from your favourites ?";
	sendText="Send";
	yesText="Yes";
	CandlestickText="Candlestick";
	noChartDataText="No chart data available.";
	title='BullsEye Investors | Chat';
	enterNewMessageText="Enter message here...";
	editorConfig:any=[];
	postTitleError=false;
	postMessageError=false;
	postMessageArray: any;
	showAddPopup=false;
	dateText="Date";
	valueText="Value";
	chartValue = "Price";
	currencyText="Currency";
	closeText="Close";
	openText="Open";
	lowText="24H LOW";
	highText="24H HIGH";
	chartActionType = 'graphDisplay';
	limitsize = 30;
	volumeText = "Volume";
	chartDataObject : any;
	smaChartData : any;
    constructor( private translate: TranslateService,private commonService: CommonService, private chatService: ChatService, private _fb: FormBuilder, vcr: ViewContainerRef, private router: Router, public toastr: ToastrManager,private modalService: NgbModal, private loadingBar: LoadingBarService,private titleService: Title,
	private meta: Meta,private activeRoute: ActivatedRoute,private sanitizer: DomSanitizer) { }
	
    ngOnInit() {
		this.meta.removeTag('name=title');
		this.meta.removeTag('name=description');
		
		/* Check Token */
    	if((localStorage.getItem("userProfileInfo") == '' || localStorage.getItem("userProfileInfo") == undefined || localStorage.getItem('userProfileInfo') === null) && (localStorage.getItem("userAccessToken") == '' || localStorage.getItem("userAccessToken") == undefined || localStorage.getItem('userAccessToken') === null) && (localStorage.getItem("chatBoardId") == '' || localStorage.getItem("chatBoardId") == undefined || localStorage.getItem("chatBoardId") == null) && (localStorage.getItem("chatPrice") == '' || localStorage.getItem("chatPrice") == undefined || localStorage.getItem("chatPrice") == null) && (localStorage.getItem("chatName") == '' || localStorage.getItem("chatName") == undefined || localStorage.getItem("chatName") == null) && (localStorage.getItem("chatSymbol") == '' || localStorage.getItem("chatSymbol") == undefined || localStorage.getItem("chatSymbol") == null) && (localStorage.getItem("favouriteId") == '' || localStorage.getItem("favouriteId") == undefined || localStorage.getItem("favouriteId") == null) && (localStorage.getItem("chatType") == '' || localStorage.getItem("chatType") == undefined || localStorage.getItem("chatType") == null) && (localStorage.getItem("chatCurrency") == '' || localStorage.getItem("chatCurrency") == undefined || localStorage.getItem("chatCurrency") == null))
    		this.router.navigate(['/chat']);
		
		if(this.activeRoute.snapshot.queryParams){
			if(this.activeRoute.snapshot.params.ctsymbol!=undefined && this.activeRoute.snapshot.params.ctsymbol!=null && this.activeRoute.snapshot.params.ctname!=undefined && this.activeRoute.snapshot.params.ctname!=null){
				if(this.activeRoute.snapshot.params.ctsymbol!=localStorage.getItem('chatSymbol') || this.activeRoute.snapshot.params.ctname!=localStorage.getItem('chatName'))
					this.router.navigate(['/chat']);
			}
			else
				this.router.navigate(['/chat']);
		}
		else
			this.router.navigate(['/chat']);
		
		
		this.profileInfo = JSON.parse(localStorage.getItem("userProfileInfo"));
		if (!this.profileInfo.isProAccount){
			localStorage.setItem("proActive","false");
			this.router.navigateByUrl('/check-pro', {skipLocationChange: true}).then(()=>
			this.router.navigate(['/account-settings']));
		}
		else
			localStorage.setItem("proActive","");
		 /* Set Language Translator */
		this.translate.addLangs(['en', 'ko', 'hi', 'zh', 'es', 'ja']);
		this.translate.setDefaultLang('en');
		const browserLang = (this.profileInfo.defaultLanguage !=undefined && this.profileInfo.defaultLanguage != '') ? this.profileInfo.defaultLanguage:'en';
		this.translate.use(browserLang.match(/en|ko|hi|zh|es|ja/) ? browserLang : 'en');
		this.translate.get('Somethingwentwrong').subscribe(value => {
			this.defaulterrSomethingMsg = value;
		});
		
		this.translate.get('Processing...').subscribe(value => {
			this.processingTxt=value;
		});
		this.translate.get('Nochat').subscribe(value => {
			this.NoChatText=value;
		});
		this.translate.get('Areyousurewanttoaddinyourfav').subscribe(value => {
			this.AreYouAddYourFav =value;
		});
		this.translate.get('Areyousurewanttodeletemessage').subscribe(value => {
			this.deleteMsgText= value;
		});
		this.translate.get('Areyousurewanttoremovefav').subscribe(value => {
			this.deleteFavMsgText=value;
		});
		this.translate.get('Send').subscribe(value => {
			this.sendText=value;
		});
		this.translate.get('Yes').subscribe(value => {
			this.yesText=value;
		});
		this.translate.get('Nochartdataavailable').subscribe(value => {
			this.noChartDataText=value;
		});
		this.translate.get('Candlestick').subscribe(value => {
			this.CandlestickText=value;
		});
		
		try {
		  this.currencyItemList = this.commonService.getCurrency();
		} catch (error) {}

		this.postMessageArray= {'postTitle':'', 'postMessage': ''};
		this._initForm();
		/* Get Localstorage Value*/
		this.chatBoardId=parseInt(localStorage.getItem('chatBoardId'));
		this.chatPrice=parseFloat(localStorage.getItem('chatPrice'));
		this.chatImage=localStorage.getItem('chatImage');
		this.chatName=localStorage.getItem('chatName');
		this.chatSymbol=localStorage.getItem('chatSymbol');
		this.chatType=localStorage.getItem('chatType');
		this.chatDetailsCurrency =localStorage.getItem('chatCurrency');
		this.favouriteId=((localStorage.getItem('favouriteId')!=undefined) && (localStorage.getItem('favouriteId')!=''))?parseInt(localStorage.getItem('favouriteId')):0;
		this.chatChangePer=((localStorage.getItem('chatChangeType')!=undefined) && (localStorage.getItem('chatChangeType')!='') && (localStorage.getItem('chatChangeType')!=null))?parseFloat(localStorage.getItem('chatChangeType')) :0;

    	this.chatCurrency = this.profileInfo.baseCurrency;
    	this.model.currentCurrency = this.chatCurrency;
		this.userName = this.profileInfo.firstname;
		this.userId = this.profileInfo.userId;
		this.btnText = this.sendText;
		this.placeholderImageUrl = '../assets/images/not-found.png';
		this.pageSize = 10;
		this.chatListCheck = true;
		
		this.totalPage = this.currentPage = 0;
		/* Set Mata Tag*/
		//this.title=""+this.chatName+" Chat | "+this.chatSymbol+" | Live "+this.chatType+" Market Prices & Chat | Bullseye Investors";
		this.meta.removeTag('name=title');
		this.meta.removeTag('name=description');
		this.title="BullsEye Investors | Chat"+" | "+localStorage.getItem("chatName")+" | "+localStorage.getItem("chatSymbol");
		this.titleService.setTitle(this.title);
		this.meta.addTag({name: 'description', content: ''+this.chatName+' chat for private investors. Share your views with other '+this.chatSymbol+' investors in the Bullseye Community using the Bullseye Investors web, iOS and Android platforms. Track live prices and set alerts directly to your device.'});
		this.translate.get('Entermessagehere').subscribe(value => {
			
			this.enterNewMessageText=value;
			/*Set Editior Configuration*/
			this.editorConfig= {
				"editable": true,
				"spellcheck": true,
				"height": "100px",
				"minHeight": "50px",
				"width": "auto",
				"minWidth": "0",
				"translate": "yes",
				"enableToolbar": true,
				"showToolbar": true,
				"placeholder": this.enterNewMessageText,
				"imageEndPoint": "",
				"toolbar": [
					["bold", "italic", "underline", "strikeThrough",],
					["fontName", "fontSize"],
					["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"],
					["cut", "copy", "delete", "removeFormat", "undo", "redo"],
					["paragraph", "blockquote", "removeBlockquote", "horizontalLine", "orderedList", "unorderedList"],
					["link", "unlink"]
				]
			}
		});
		
		var objectNtype=this;
		setTimeout(() => {
			objectNtype.searchText = objectNtype.processingTxt;
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
				objectNtype.openText=value;
			});
			objectNtype.translate.get('24HLOW').subscribe(value => { 
				objectNtype.lowText=value;
			});
			objectNtype.translate.get('24HHIGH').subscribe(value => { 
				objectNtype.highText=value;
			});
			objectNtype.getChatData();
			objectNtype.getChartData(1, 'D', 0);
		},1000);
	}
	private _initForm(): void {
		this.chatComplaintForm = this._fb.group({
			'comment':['',Validators.required]
		});
		setTimeout (() => {
			// document.querySelectorAll('g[aria-labelledby="id-241-title"]')[0].remove();
		}, 3000);



    }
	get c() {
		return this.chatComplaintForm.controls;
	}

	getChatData() {
		const objectType = this;
		if(this.chatBoardId === 0) {
			objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
			return false;
		}
		objectType.loadingBar.start();
		this.chatService.getChatDetails(this.chatBoardId,this.timestampData,this.pageSize,this.pageNo,function(err, response) {
			if( err ) {
			  objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg,null,{autoDismiss: true, maxOpened: 1,preventDuplicates: true});
			  objectType.searchText = objectType.defaulterrSomethingMsg;
			}
			if ( response.statusCode === 200 ) {
debugger;
				if (objectType.pageNo === 1) { objectType.totalPage = response.data.totalPage; }
				objectType.chatList = response.data.data;
				if (objectType.chatList.length > 0) {
					objectType.searchText = '';
					objectType.chatListCheck = false;

				} else {
					objectType.searchText = objectType.NoChatText;
					objectType.chatListCheck = true;
				}
			} else {
				objectType.toastr.errorToastr(response.data.message, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
				objectType.searchText = response.data.message;
				/*if(response.statusCode == 401) {
					localStorage.removeItem("userAccessToken");
					localStorage.removeItem("userProfileInfo");
					objectType.router.navigate(['/login']);
				}*/

			}
			objectType.loadingBar.stop();
		});
    }
	/*Modal Popup of message*/
	open(content) {
		const objectType=this;
		this.postMessageArray= {'postTitle':'', 'postMessage': ''};
		this.btnText = this.sendText;
		this.modalService.open(content, { windowClass: 'add_chat_modal'}).result.then(
		  result => {
			this.closeResult = `Closed with: ${result}`;
		  },
		  reason => {
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		  }
	   );
	   /* setTimeout (() => {
			objectType.showAddPopup=true;
	   }, 500); */
    }
	/*Modal Popup for faviourite and delete faviourite*/
	openFavPopup(favcontent, chatBoardId, favouriteId, updateFavtype) {
		this.updateFavtype = updateFavtype;
		this.chatBoardId = parseInt(chatBoardId);
		this.favouriteId = parseInt(favouriteId);
		this.messageId = 0;
		this.btnText = this.yesText;
		this.modelText = (this.favouriteId === 0) ? this.AreYouAddYourFav : this.deleteFavMsgText;
        this.modalService.open(favcontent).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
	/* Open Delete Message */
	openMsgPopup(content, messageId, ind, msg) {
		this.postMessageArray= {'postTitle':'', 'postMessage': ''};
		this.ind = ind + 1;
		this.messageId = messageId;
		this.btnText = this.yesText;
		this.modelText = this.deleteMsgText;
		this.complaintMsg = msg;
		this.modalService.open(content, { size: 'lg', windowClass: 'report_modal' }).result.then((result) => {
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
	updateFavouriteTicker(content) {
		if (this.chatBoardId > 0 && this.updateFavtype !== '' && this.btnText !== '') {
			if (this.btnText === this.processingTxt) {
				return ;
			}

			this.btnText = this.processingTxt;
			let formData = {};
			if (this.updateFavtype === 'deletefavourite') {
				if (this.favouriteId === 0) {
					this.toastr.errorToastr(this.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
					return false;
				} else {
					formData = {'favouriteId' : this.favouriteId};
				}
			} else {
				formData = {'chatBoardId' : this.chatBoardId};
			}

			const objectType = this;
			this.loading = true;
			this.loadingBar.start();
			this.chatService.addUpdateFavourite(formData, this.updateFavtype, function(err, response) {
				objectType.loading = false;
				objectType.loadingBar.stop();
				if ( err ) {
				  objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
				}
				if ( response.statusCode === 200 ) {
					objectType.toastr.successToastr(response.data.message, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
					objectType.favouriteId = 1;
					localStorage.setItem('favouriteId', '1');
					objectType.updateFavtype = objectType.modelText = '';
					objectType.modalService.dismissAll();
				} else {
				  objectType.toastr.errorToastr(response.data.message, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
				}

				objectType.btnText = objectType.yesText;
			});
		} else {
			this.toastr.errorToastr(this.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
		}
	}
	addMessage() {

		this.isMessageReq=this.postMessageError=this.postTitleError = false;
		this.submitted = true;
		if (this.chatBoardId === 0 && this.btnText === '') {
			this.toastr.errorToastr(this.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
			return false;
		}
		this.postTitleError=(this.postMessageArray.postTitle==undefined || this.postMessageArray.postTitle==null || this.postMessageArray.postTitle=="")?true:false;
		this.postMessageError=(this.postMessageArray.postMessage==undefined || this.postMessageArray.postMessage==null || this.postMessageArray.postMessage=="")?true:false;
		if(this.postMessageArray.postTitle==undefined || this.postMessageArray.postTitle==null || this.postMessageArray.postTitle=="" || this.postMessageArray.postMessage==undefined || this.postMessageArray.postMessage==null || this.postMessageArray.postMessage=="") {
			this.btnText = this.sendText;
			return false;
		}
		if (this.btnText === this.processingTxt) {
				this.btnText = this.sendText;
				return ;
		}
		this.btnText = this.processingTxt;
        const formData = {'chatBoardId' : this.chatBoardId, 'messageTitle': this.postMessageArray.postTitle, 'messageBody' : this.postMessageArray.postMessage};
		const objectType = this;
		this.loading = true;
		this.loadingBar.start();
		this.chatService.addUpdateFavourite(formData, 'addmessage', function(err, response) {
			objectType.loading = false;
			objectType.loadingBar.stop();
			if ( err ) {
			  objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
			}
			if ( response.statusCode === 200 ) {
				objectType.toastr.successToastr(response.data.message, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
				objectType.postMessageArray= {'postTitle':'', 'postMessage': ''};
				objectType.modalService.dismissAll();
				objectType.getChatData();
			} else {
			  objectType.toastr.errorToastr(response.data.message, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
			}

			objectType.btnText = objectType.sendText;
		});

	}
	addComplain() {
		this.isMessageReq = false;
		if (this.chatBoardId === 0 && this.btnText === '' && this.messageId === 0 && this.userId === 0) {
			this.toastr.errorToastr(this.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
			return false;
		}
		if (this.btnText === this.processingTxt) {
				return ;
		}
		if (this.chatComplaintForm.controls.comment.value === '') {
			this.isMessageReq = true;
			this.btnText = this.sendText;
            return;
        }
		this.btnText = this.processingTxt;
        const formData = {'chatBoardId' : this.chatBoardId, 'messageby': this.userId, 'messageId' : this.messageId, 'comment': this.chatComplaintForm.controls.comment.value, 'message': this.complaintMsg};
		const objectType = this;
		this.loading = true;
		this.loadingBar.start();
		this.chatService.addUpdateFavourite(formData, 'complain', function(err, response) {
			objectType.loading = false;
			objectType.loadingBar.stop();
			if ( err ) {
			  objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
			}
			if ( response.statusCode === 200 ) {
				objectType.toastr.successToastr(response.data.message, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
				objectType.chatComplaintForm.reset();
				objectType.modalService.dismissAll();
			} else {
			  objectType.toastr.errorToastr(response.data.message, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
			}

			objectType.btnText = objectType.sendText;
		});

	}
	onPageChange(pageNo) {
		this.pageNo = pageNo;
		this.getChatData();
    }
	deleteMessage() {
		if (this.messageId > 0 && this.btnText !== '') {
			if (this.btnText === this.processingTxt) {
				return ;
			}

			this.btnText = this.processingTxt;
			const objectType = this;
			this.loading = true;
			this.loadingBar.start();
			this.chatService.deleteMessage(this.messageId, function(err, response) {
				objectType.loading = false;
				objectType.loadingBar.stop();
				if ( err ) {
				  objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
				}
				if ( response.statusCode === 200 ) {
					objectType.toastr.successToastr(response.data.message, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
					objectType.messageId = 0;
					if (objectType.ind > 0) {
						objectType.chatList.splice((objectType.ind - 1), 1);
						objectType.ind = 0;
					}
					objectType.modalService.dismissAll();
				} else {
				  objectType.toastr.errorToastr(response.data.message, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
				}

				objectType.btnText = objectType.yesText;

			});

		} else {
			 this.toastr.errorToastr(this.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
		}
	}
	getChartData(num, type, clickind) {
		const objectType = this;
		this.activeTab = 'active';
		this.indMap = clickind;
		this.chartDataText = "";
		this.num = num;
		this.type = type;

		objectType.loadingBar.start();
		if (this.chatType !== '' && this.chatName !== '' && this.chatSymbol !== '' && this.chatCurrency !== '' && this.num !== '' && this.type !== '') {

			if( this.type === 'D' ) {

				this.commonService.getTicker1DDataListByType(this.chatSymbol, this.chatType, this.chatCurrency, this.limitsize, function (err, response) {

					if (err) {
						objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
						objectType.chartDataText = objectType.defaulterrSomethingMsg;
					}
					if (response.statusCode === 200) {
						objectType.chartDataText = '';
						const keys = [];
						const candleStickData = [];
						let data = [];
						
						if (objectType.chatType.toLowerCase() === 'crypto' || objectType.chatType.toLowerCase() === 'cryptocurrency') {
							if (response.data.Data !== undefined && response.data.Data.length > 0) {

								data = response.data.Data;
								data.map(function (item) {
									const currentDateTime = new Date(item.time * 1000);
									const volume = (item.volumefrom) ? objectType.formatNumber(parseFloat(item.volumefrom).toFixed(4)) : 0.00;
									keys.push({ date: new Date(item.time * 1000), currentDateTime: currentDateTime.getHours() + ':' + currentDateTime.getMinutes(), currency: objectType.chatCurrency, open: objectType.formatNumber(parseFloat(item.open).toFixed(4)), close: objectType.formatNumber(parseFloat(item.close).toFixed(4)), high: objectType.formatNumber(parseFloat(item.high).toFixed(4)), low: objectType.formatNumber(parseFloat(item.low).toFixed(4)), volume: volume });

									// candleStickData.push({date: new Date(item.time * 1000), currency: objectType.chatCurrency, open: objectType.formatNumber((Math.round(item.open * 100) / 100).toFixed(4)), close: objectType.formatNumber((Math.round(item.close * 100) / 100).toFixed(4)), high: objectType.formatNumber((Math.round(item.high * 100) / 100).toFixed(4)), low: objectType.formatNumber((Math.round(item.low * 100) / 100).toFixed(4))});

								});
								keys.sort((a, b) => {
									return <any>new Date(a.date) - <any>new Date(b.date);
									});
								objectType.chartDataObject = keys;
								objectType.renderChart(keys, '1D');
								objectType.renderVolumeChart(keys, '1D');
								objectType.renderCandleStickChartData(keys, '1D');
								objectType.getSMAData(objectType.chartDataObject, objectType.filterModel.searchCriteria);
							} else {
								objectType.chartDataText = objectType.noChartDataText;
							}
						} else if (objectType.chatType.toLowerCase() === 'stock') {
							if (response.data.intraday !== undefined && Object.keys(response.data.intraday).length > 0) {

								data = response.data.intraday;
								Object.keys(data).map(function (key) {
									const currentDateTime = new Date(key);
									
									keys.push({ date: new Date(key), currentDateTime: currentDateTime.getHours() + ':' + currentDateTime.getMinutes(), currency: objectType.chatCurrency, open: objectType.formatNumber(parseFloat(data[key].open).toFixed(3)), close: objectType.formatNumber(parseFloat(data[key].close).toFixed(3)), high: objectType.formatNumber(parseFloat(data[key].high).toFixed(3)), low: objectType.formatNumber(parseFloat(data[key].low).toFixed(3)), volume: objectType.formatNumber(parseFloat(data[key].volume).toFixed(3)) });

									// candleStickData.push({date : new Date(key), currency: objectType.chatCurrency, open: objectType.formatNumber(parseFloat(data[key].open).toFixed(3)), close: objectType.formatNumber(parseFloat(data[key].close).toFixed(3)), high: objectType.formatNumber(parseFloat(data[key].high).toFixed(3)), low: objectType.formatNumber(parseFloat(data[key].low).toFixed(3))});

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
							} else {
								objectType.chartDataText = objectType.noChartDataText;
							}
						} else {
							objectType.chartDataText = objectType.noChartDataText;
						}
					} else {
						objectType.toastr.errorToastr(response.data.message, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
						objectType.chartDataText = response.data.message;
						/*if(response.statusCode == 401) {
							localStorage.removeItem("userAccessToken");
							localStorage.removeItem("userProfileInfo");
							objectType.router.navigate(['/login']);
						}*/

					}
					objectType.loadingBar.stop();
				});
			} else {
					/* Current Date */
					const d = new Date();
					const y = d.getUTCFullYear();
					let m = d.getUTCMonth();
					let day = d.getUTCDate();
					m = m + 1;
					let mm = (m < 9 ) ? ('0' + m) : m;
					let dd = (day < 9 ) ? ('0' + day) : day;
					const dateTo = y + '-' + mm + '-' + dd;

					const num = parseInt(this.num);
					const limit = (this.type === 'M') ? (num * 30) : (num * 365);
					d.setDate(d.getDate() - limit);
					m = d.getUTCMonth();
					day = d.getUTCDate();
					m = m + 1;
					mm = (m < 9 ) ? ('0' + m) : m;
					dd = (day < 9 ) ? ('0' + day) : day;
					const dateFrom = d.getUTCFullYear() + '-' + mm + '-' + dd;
					this.commonService.getTickerDataListByType(this.chatSymbol, this.chatType, this.chatCurrency, limit, dateFrom, dateTo, function(err, response) {
						if ( err ) {
						objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
						objectType.chartDataText = objectType.defaulterrSomethingMsg;
						}
						if ( response.statusCode === 200 ) {
							objectType.chartDataText = '';
							const keys = [];
							const candleStickData = [];
							let data = [];
							if(objectType.chatType.toLowerCase() === 'crypto' || objectType.chatType.toLowerCase() === 'cryptocurrency') {
								if (response.data.Data !== undefined && response.data.Data.length > 0) {

									data = response.data.Data;
									data.map(function(item) {
										const currentDateTime = new Date(item.time * 1000);
										const volume = (item.volumefrom) ? objectType.formatNumber(parseFloat(item.volumefrom).toFixed(4)) : 0.00;
										keys.push({date: new Date(item.time * 1000), currentDateTime: currentDateTime.getDate(), currency: objectType.chatCurrency, open: objectType.formatNumber(parseFloat(item.open).toFixed(4)), close: objectType.formatNumber(parseFloat(item.close).toFixed(4)), high: objectType.formatNumber(parseFloat(item.high).toFixed(4)), low: objectType.formatNumber(parseFloat(item.low).toFixed(4)), volume: volume});

										// candleStickData.push({date: new Date(item.time * 1000), currency: objectType.chatCurrency, open: objectType.formatNumber((Math.round(item.open * 100) / 100).toFixed(4)), close: objectType.formatNumber((Math.round(item.close * 100) / 100).toFixed(4)), high: objectType.formatNumber((Math.round(item.high * 100) / 100).toFixed(4)), low: objectType.formatNumber((Math.round(item.low * 100) / 100).toFixed(4))});

									});
									keys.sort((a, b) => {
									return <any>new Date(a.date) - <any>new Date(b.date);
									});
									objectType.chartDataObject = keys;
									objectType.renderChart(keys);
									objectType.renderVolumeChart(keys);
									objectType.renderCandleStickChartData(keys);
									objectType.getSMAData(objectType.chartDataObject, objectType.filterModel.searchCriteria);
								} else {
									objectType.chartDataText = objectType.noChartDataText;
								}
							} else if (objectType.chatType.toLowerCase() === 'stock') {
								if (response.data.history !== undefined && Object.keys(response.data.history).length > 0) {

									data = response.data.history;
									Object.keys(data).map(function (key) {
										const currentDateTime = new Date(key);
										keys.push({date : new Date(key), currentDateTime: currentDateTime.getDate(), currency: objectType.chatCurrency, open: objectType.formatNumber(parseFloat(data[key].open).toFixed(3)), close: objectType.formatNumber(parseFloat(data[key].close).toFixed(3)), high: objectType.formatNumber(parseFloat(data[key].high).toFixed(3)), low: objectType.formatNumber(parseFloat(data[key].low).toFixed(3)), volume: objectType.formatNumber(parseFloat(data[key].volume).toFixed(3))});

										// candleStickData.push({date : new Date(key), currency: objectType.chatCurrency, open: objectType.formatNumber(parseFloat(data[key].open).toFixed(3)), close: objectType.formatNumber(parseFloat(data[key].close).toFixed(3)), high: objectType.formatNumber(parseFloat(data[key].high).toFixed(3)), low: objectType.formatNumber(parseFloat(data[key].low).toFixed(3))});

									});
									keys.sort((a, b) => {
									return <any>new Date(a.date) - <any>new Date(b.date);
									});
									/* candleStickData.sort((a, b) => {
									return <any>new Date(a.date) - <any>new Date(b.date);
									}); */
									objectType.chartDataObject = keys;
									objectType.renderChart(keys);
									objectType.renderVolumeChart(keys);
									objectType.renderCandleStickChartData(keys);
									objectType.getSMAData(objectType.chartDataObject, objectType.filterModel.searchCriteria);
								} else {
									objectType.chartDataText = objectType.noChartDataText;
								}
							} else {
								objectType.chartDataText = objectType.noChartDataText;
												}
						} else {
							objectType.toastr.errorToastr(response.data.message, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
							objectType.chartDataText = response.data.message;
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
			this.chartDataText = this.noChartDataText;
			objectType.loadingBar.stop();
		}
	}

	/* Render Chart Data */
	renderChart(data, dataType = 'normal', chartType= 'chartdiv') {
		am4core.useTheme(am4themes_animated);
		const chart = am4core.create(chartType, am4charts.XYChart);
		chart.paddingRight = 10;
		chart.data = data;
		const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
		dateAxis.renderer.grid.template.location = 0;

		dateAxis.renderer.grid.template.disabled = true;
		dateAxis.renderer.ticks.template.disabled = true;
		dateAxis.renderer.labels.template.disabled = true;
		dateAxis.tooltip.disabled = true;

		const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.renderer.grid.template.location = 0;
		valueAxis.renderer.grid.template.disabled = true;
		valueAxis.renderer.ticks.template.disabled = true;
		valueAxis.renderer.labels.template.disabled = true;
		valueAxis.tooltip.disabled = true;
		valueAxis.renderer.minWidth = 35;

		const series = chart.series.push(new am4charts.LineSeries());

		series.dataFields.dateX = 'date';
		series.dataFields.valueY = 'close';
		// series.fillOpacity = 0.5;
		series.strokeWidth = 1.5;
		if(chartType == 'chartdiv')
			series.stroke = am4core.color('#00b050');
		else
			series.stroke = am4core.color('#ffffff');
		//series.stroke = am4core.color('#00b050');
		
		// let currency=this.chatCurrency;
		// let showDateTime = (dataType == '1D') ? `{currentDateTime}`: `{date}`;
		series.tooltipText =
			this.dateText + `:` + ` {date}`+`\n`+
			this.currencyText + `: {currency}\n` +
			this.chartValue + `: {close}`+`\n`;
		/*series.tooltipText =
		`Date: {date}
		 Currency: {currency}
		 Price: {close}`;*/
		// series3.tooltip.pointerOrientation = "vertical";
		/* Set Chart Tooltip Style */
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

	renderVolumeChart(data, dataType = 'normal') {
		
		am4core.useTheme(am4themes_animated);
		const chart = am4core.create('volumechart', am4charts.XYChart);
		chart.paddingRight = 20;

		chart.data = data;
		var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
		categoryAxis.dataFields.category = "currentDateTime";
		categoryAxis.renderer.grid.template.strokeOpacity = 0;
		categoryAxis.renderer.labels.template.disabled = true;
		categoryAxis.renderer.cellStartLocation = 0.2;
		categoryAxis.renderer.cellEndLocation = 0.8;
		categoryAxis.tooltip.disabled = true;

		var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.renderer.inside = true;
		valueAxis.renderer.labels.template.fillOpacity = 0.3;
		valueAxis.renderer.grid.template.strokeOpacity = 0;
		valueAxis.renderer.minWidth = 35;
		valueAxis.cursorTooltipEnabled = false;
		valueAxis.renderer.baseGrid.strokeOpacity = 0;
		valueAxis.renderer.grid.template.location = 0;
	    valueAxis.renderer.grid.template.disabled = true;
		valueAxis.renderer.ticks.template.disabled = true;
		valueAxis.renderer.labels.template.disabled = true;
		var series = chart.series.push(new am4charts.ColumnSeries);
		series.dataFields.valueY = "volume";
		series.dataFields.categoryX = "currentDateTime";
		series.tooltipText = this.dateText + `:` + ` {date}`+`\n`+
			this.currencyText + `: {currency}\n` +
			this.volumeText + `: {volume}`;
		//series.tooltip.pointerOrientation = "vertical";
		series.tooltip.dy = - 6;
		series.columnsContainer.zIndex = 100;

		var columnTemplate = series.columns.template;
		columnTemplate.width = am4core.percent(50);
		columnTemplate.height = am4core.percent(50);
		columnTemplate.maxHeight = 100;
		columnTemplate.maxWidth = 10;
		//columnTemplate.column.cornerRadius(60, 60, 10, 10);
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
	renderCandleStickChartData(data, dataType = 'normal') {
		// Themes begin
		am4core.useTheme(am4themes_animated);
		// Themes end
		const chart = am4core.create('candlechart', am4charts.XYChart);
		chart.paddingRight = 10;

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

		const series = chart.series.push(new am4charts.CandlestickSeries());
		series.dataFields.dateX = 'date';
		series.dataFields.openValueY = 'open';
		series.dataFields.valueY = 'close';
		series.dataFields.highValueY = 'high';
		series.dataFields.lowValueY = 'low';

		series.simplifiedProcessing = true;
		series.tooltipText =
			this.dateText+`: {date}\n`+
			this.currencyText+`: {currency}\n`+
			this.openText+`: {open}\n`+
			this.closeText+`: {close}\n`+
			this.highText + `: {high}\n` +
			this.lowText + `: {low}`;
		// series.tooltipText = 'Date: {date}\nCurrency: {currency}\nOpen: {open}\nClose: {close}\n24H High: {high}\n24H Low: {low}';

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

		/* let scrollbarX = new am4charts.XYChartScrollbar();
		scrollbarX.series.push(lineSeries);
		chart.scrollbarX = scrollbarX; */

		chart.data = data;
	}
	/* Show Hide Chart*/
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
	/* Render Chart Data */
	
	/*Return Currency Symbol*/
   returnCurrSymbol(v) {
	  let cur = v;
	  v=(v=='GBX')?'GBP':v;
	  this.currencyItemList.map(function(item) {
			if (item.name === v) {
				cur = item.symbol;
			}
	  });
	  return cur;
   }
   formatNumber(num) {
		const numNew=num.toString()
		if(numNew.indexOf('.') > -1) {
			const vSplitValue =numNew.split('.');
			const v =vSplitValue[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
			return v+'.' + vSplitValue[1];
		} else {
			return numNew.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
		}
  }
  formatDate(obj) {
        return obj.toString().replace(/\s/g, 'T');
  }
  getSantizeUrl(value: string) {
	 return value.replace(/\\/g, '');
  }
  filterExchangeItem(){
  	this.loadingBar.start();
	this.getChartData(this.num, this.type, this.indMap);
	if (this.filterModel.graphDisplay) {
		document.getElementById('chartdiv').style.display = 'none';
		document.getElementById('candlechart').style.display = 'flex';

	} else {
		document.getElementById('candlechart').style.display = 'none';
		document.getElementById('chartdiv').style.display = 'flex';
	}
	if(this.filterModel.searchCriteria == 0) {
		document.getElementById('volumechart').style.display = 'none';
		document.getElementById('smachart').style.display = 'none';
	}
	else if(this.filterModel.searchCriteria == 24)
		document.getElementById('volumechart').style.display = 'flex';
	else {
		const smaData =this.getSMAData(this.chartDataObject, this.filterModel.searchCriteria);
		this.smaChartData = smaData;
		this.renderChart(smaData, 'normal', "smachart");
		document.getElementById('smachart').style.display = 'flex';
		document.getElementById('volumechart').style.display = 'none';
	}
	
	this.activeFilter = false;
	this.loadingBar.stop();

  }

  setChartActionType(actionType) {
  		this.chartActionType = actionType;
  }

  getSMAData(data, SMAType){
	var SMAData = [];
	SMAType = parseInt(SMAType);
	if( data.length > SMAType ) {
		const loopcount = data.length - SMAType + 1;
		for( let i = 0; i <= loopcount; i++) {				
			let smaTotal : number = 0;
			const nextLoop = SMAType + i;
			for( let j= i; j <= nextLoop; j++ ) {
				if(data[j] != undefined)									
					smaTotal = smaTotal + parseFloat(data[j].close);
			}	
			if(data[nextLoop] != undefined)			
				SMAData.push( {date: data[nextLoop].date, currency: data[nextLoop].currency, close: (smaTotal / SMAType).toFixed(6)});
			
		}
	}
	return SMAData;
  }
}
