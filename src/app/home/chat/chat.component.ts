import { Component, OnInit, ElementRef, ViewContainerRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../_services/common.service';
import { ChatService } from '../../_services/chat.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Title, Meta } from '@angular/platform-browser';
@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
    animations: [routerTransition()]
})
export class ChatComponent implements OnInit {
	model : any = {"currentCurrency": "USD"};
	chatForm: FormGroup;
	currentPage = 0;
	totalPage=0;
	stockType='Stock';
	cryptoType="Crypto";
    loading = false;
	pageSize=20;
	pageNo=1;
    keywords="";
	checkStatus=true;
	modelText="";
	apiName="favourite";
	chatCurrency='USD';
	profileInfo : any;
	searchResultCnt=false;
	chatList = [];
	chatSearchList = [];
	currencyPriceList = {};
	currencyItemList:any=[];
	closeResult: string;
	chatBoardId=0;
	favouriteId=0;
	updateFavtype="";
	btnText="";
	searchChatFav=false;
	searchChatSearch=false;
	searchFavText="";
	searchSearchText="";
	ind=0;
	activeTab="";
	placeholderImageUrl: string;
	defaulterrSomethingMsg='Something went wrong';
    stockText ='Stock';
	cryptoText ='Cryptocurrency';
	processingTxt ='Processing...';
	yesText ='Yes';
	favRemoveText ='Are you sure want to remove from your favourites ?';
	NoFavTickerText ="You don't currently have any favourites. Try searching for your favourites using the search bar.";
	Usethesearchbartofindyourfavouritechatboard = 'Use the search bar to find your favourite chat board';
	title='BullsEye Investors | Chat';
    constructor(private translate: TranslateService, private commonService: CommonService, private chatService: ChatService, private _fb: FormBuilder, vcr: ViewContainerRef, private router: Router, public toastr: ToastrManager, private modalService: NgbModal, private loadingBar: LoadingBarService,private titleService: Title,
	private meta: Meta) { }
    ngOnInit() {
		this.meta.removeTag('name=title');
		this.meta.removeTag('name=description');
		this.titleService.setTitle(this.title);
		this._initForm();
		 /* Check Token */
		if ((localStorage.getItem('userProfileInfo') === '' || localStorage.getItem('userProfileInfo') === undefined || localStorage.getItem('userProfileInfo') === null) && (localStorage.getItem('userAccessToken') === '' || localStorage.getItem('userAccessToken') === undefined || localStorage.getItem('userAccessToken') === null)) {
			this.router.navigate(['/login']);
		}

		this.profileInfo = JSON.parse(localStorage.getItem('userProfileInfo'));
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
		this.translate.get('Processing...').subscribe(value => {
			this.processingTxt = value;
		});
		this.translate.get('Yes').subscribe(value => {
			this.yesText = value;
		});
		this.translate.get('Areyousurewanttoremovefav?').subscribe(value => {
			this.favRemoveText = value;
		});
		this.translate.get('Youdontcurrentlyhaveanyfavourites').subscribe(value => {
			this.NoFavTickerText = value;
		});
		this.translate.get('Usethesearchbartofindyourfavouritechatboard').subscribe(value => {
			debugger;
			this.Usethesearchbartofindyourfavouritechatboard = value;
		});
		try {
		  this.currencyItemList = this.commonService.getCurrency();
		} catch (error) {}
    	this.chatCurrency = this.profileInfo.baseCurrency;
    	this.model.currentCurrency = this.chatCurrency;
		this.btnText = this.yesText;
		this.placeholderImageUrl = '../assets/images/not-found.png';
		this.searchFavText = this.processingTxt;
		this.searchChatFav = true;
		this.stockType = this.stockText;
		
		this.searchResultCnt=this.searchChatSearch = true;
		var objectNtype=this;
		setTimeout(function(){
			objectNtype.searchSearchText=objectNtype.Usethesearchbartofindyourfavouritechatboard;
			objectNtype.getChatData();
		},1000);
		
	}
	private _initForm(): void {
        this.chatForm = this._fb.group({
            'chatSearchTxt': ['', Validators.required]
        });

    }
    get c() { return this.chatForm.controls; }

	toggle(i) {
		this.searchFavText = this.processingTxt;
		this.chatList = [];
		this.pageNo = 1;
		this.currentPage = 0;
		this.pageSize = 20;
		this.apiName = 'favourite';
		this.keywords = '';
		this.stockType = (i === 1) ? this.stockText : this.cryptoType;
		this.searchChatFav = true;
		this.getChatData();

		this.activeTab = (!this.activeTab) ? 'active' : '';
    }
	getChatData() {
		const objectType = this;
		objectType.loadingBar.start();

		this.chatService.getChatData(this.apiName, this.stockType, this.keywords, this.pageSize, this.pageNo, function(err, response) {
			if ( err ) {
			  objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
			  if (objectType.apiName === 'favourite') {
				objectType.searchFavText = objectType.defaulterrSomethingMsg;
					}
			  if (objectType.apiName === 'list') {
				objectType.searchSearchText = objectType.defaulterrSomethingMsg;
					}
			}
			if ( response.statusCode === 200 ) {
				
				if (objectType.pageNo === 1) {
					objectType.totalPage = response.data.totalPage;
				}

				if (response.data[0].status === true) {
					const chatData = (response.data[0].chatBoard !== undefined) ? response.data[0].chatBoard : response.data[0].data;

					if (objectType.apiName === 'list') {
						objectType.chatSearchList = chatData;
					} else {
						objectType.chatList = chatData;
					}

					if ((chatData.length === 0 && objectType.apiName === 'favourite')) {
						objectType.searchFavText = objectType.NoFavTickerText;
					}
					if ((chatData.length === 0 && objectType.apiName === 'list')) {
						objectType.searchSearchText = objectType.Usethesearchbartofindyourfavouritechatboard;
					}
				}
          		if (response.data[1].status === true) {
          			objectType.currencyPriceList = response.data[1].data;
            }
			} else {
				objectType.toastr.errorToastr(response.data.message, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
				if (objectType.apiName === 'favourite') {
					objectType.searchFavText = response.data.message;
				}
				if (objectType.apiName === 'list') {
					objectType.searchSearchText = response.data.message;
				}
				/*if(response.statusCode == 401) {
					localStorage.removeItem("userAccessToken");
					localStorage.removeItem("userProfileInfo");
					objectType.router.navigate(['/login']);
				}*/

			}

			objectType.loadingBar.stop();
		});
    }
	getCurrencyValue(chatData, key = 'price') {
    	const price = chatData.price;
    	const currency = chatData.currency;
    	return this.commonService.getGlobalCurrencyConvertValue(this.currencyPriceList, price, currency, this.chatCurrency);
    }
	searchChat() {
		this.searchSearchText = this.processingTxt;
		this.chatSearchList = [];
		this.searchResultCnt = false;
		this.searchChatSearch = true;
		const txt = this.chatForm.controls.chatSearchTxt.value;
		if (txt !== '') {
			this.apiName = 'list';
			this.pageSize = 10;
			this.pageNo = 1;
			this.keywords = txt;
			this.searchResultCnt = true;
			this.getChatData();
		}
	}
	setChatData() {
		if (this.chatForm.controls.chatSearchTxt.value.length === 0) {
			this.searchChatSearch = true;
			this.searchResultCnt=this.searchChatSearch = true;
			this.searchSearchText=this.Usethesearchbartofindyourfavouritechatboard;
			this.chatSearchList = [];
		}
	}
	/*Modal Popup*/
	open(content, chatBoardId, favouriteId, updateFavtype, ind) {
		this.ind = ind + 1;
		this.updateFavtype = updateFavtype;
		this.chatBoardId = chatBoardId;
		this.favouriteId = favouriteId;
		this.modelText = this.favRemoveText;
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
					objectType.chatBoardId = objectType.favouriteId = 0;
					objectType.updateFavtype = objectType.modelText = '';
					// objectType.getDismissReason();
					if (objectType.ind > 0) {
						objectType.chatList.splice((objectType.ind - 1), 1);
						objectType.ind = 0;
						objectType.modalService.dismissAll();
					}
				} else {
				  objectType.toastr.errorToastr(response.data.message, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
				}

				objectType.btnText = objectType.yesText;

			});

		}
	}
	goToChatDetails(chatBoardId, chatName, chatSymbol, chatImage, chatPrice, chatCurrency, favouriteId,change_pct,volume) {
		
		if (chatBoardId > 0) {
			localStorage.setItem('chatBoardId', chatBoardId);
			localStorage.setItem('chatName', chatName);
			localStorage.setItem('chatSymbol', chatSymbol);
			localStorage.setItem('chatImage', (chatImage=="")?this.placeholderImageUrl:chatImage);
			localStorage.setItem('chatPrice', chatPrice);
			localStorage.setItem('chatCurrency', chatCurrency);
			localStorage.setItem('chatType', this.stockType);
			localStorage.setItem('chatChangeType', (change_pct=='' || change_pct==null)?0:change_pct);
			localStorage.setItem('favouriteId', ((favouriteId !== undefined && favouriteId !== '' && favouriteId !== null) ? favouriteId : 0));
			this.router.navigate(['/chat/'+chatSymbol+'/'+chatName]);
		} else {
			this.toastr.errorToastr(this.defaulterrSomethingMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
		}

	}
	/*Return Currency Symbol*/
   returnCurrSymbol(v){
	  let cur=v;
	  this.currencyItemList.map(function(item){
			if(item.name==v)
				cur=item.symbol;
	  });
	  return cur;
   }
}

