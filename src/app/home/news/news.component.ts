import { Component, OnInit, ElementRef, ViewContainerRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CommonService } from '../../_services/common.service';
import { NewsService } from '../../_services/news.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Title, Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  animations: [routerTransition()]
})
export class NewsComponent implements OnInit {
  newsForm: FormGroup;
  currentPage = 0;
  totalPage = 0;
  model : any = {"sourceItem" : ""}; 
  totalRecords = 0;
  stockType = 'Stock';
  loading = false;
  prevLoading = false;
  nextLoading = false;
  newsList = [];
  newsFilterList = [];
  pageSize = 20;
  pageNo = 1;
  keywords = '';
  checkStatus = true;
  placeholderImageUrl: string;
  activeFilter = false;
  activeTab = '';
  isPagination = false;
  pageSearchResult = false;
  searchText = '';
  profileInfo: any;
  processingTxt = 'Processing...';
  defaulterrSomethingMsg = 'Something went wrong';
  noRecord = 'No records found.';
  title = 'BullsEye Investors | News';
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  ChooseSourceText="Choose Source";
  SelectAllText="Select All";
  UnSelectAllText="UnSelect All";
  constructor(
    private translate: TranslateService,
    private commonService: CommonService,
    private newsService: NewsService,
    private _fb: FormBuilder,
    vcr: ViewContainerRef,
    private router: Router,
    public toastr: ToastrManager,
    private loadingBar: LoadingBarService,
	private titleService: Title,
	private meta: Meta
  ) {}
  ngOnInit() {
	this.meta.removeTag('name=title');
	this.meta.removeTag('name=description');
	this.titleService.setTitle(this.title);
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
	this.translate.get('Processing...').subscribe(value => {
		this.processingTxt = value;
	});
	this.translate.get('Somethingwentwrong').subscribe(value => {
		this.defaulterrSomethingMsg = value;
	});
	this.translate.get('Norecordsfound').subscribe(value => {
		this.noRecord = value;
	});
	this.translate.get('ChooseSource').subscribe(value => {
		this.ChooseSourceText = value;
	});
	this.translate.get('SelectAllText').subscribe(value => {
		this.SelectAllText = value;
	});
	this.translate.get('UnSelectAllText').subscribe(value => {
		this.UnSelectAllText = value;
	});
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: this.SelectAllText,
      unSelectAllText: this.UnSelectAllText,
      itemsShowLimit: 2,
      allowSearchFilter: false
    };
  
  	this._initForm();
  	this.placeholderImageUrl = '../assets/images/not-found.png';
  	this.getNewsData();
    this.getNewsFilterData();
  }
  
  private _initForm(): void {
    this.newsForm = this._fb.group({
      newsSearchTxt: ['', Validators.required]
    });
	/* Create Auto complete*/
    const objectType = this;
  }
  get n() {
    return this.newsForm.controls;
  }
  toggle(i) {
    this.pageNo = 1;
    this.currentPage = 0;
    this.stockType = i === 1 ? 'Stock' : 'crypto';
	this.selectedItems=[];
	this.getNewsData();
    this.getNewsFilterData();
	this.activeTab = (!this.activeTab) ? 'active' : '';
  }
  getNewsData() {
    this.newsList = [];
    this.searchText = this.processingTxt;
    this.pageSearchResult = true;
    const objectType = this;
  	this.nextLoading = this.prevLoading = false;
      objectType.loadingBar.start();
	  
	  this.model.sourceItem=(this.selectedItems.length>0)?this.selectedItems.join(','):"";
      this.newsService.getNewsData(this.stockType, this.keywords, this.model.sourceItem, this.pageSize, this.pageNo, function(err, response) {
        if (err) { objectType.toastr.errorToastr(objectType.defaulterrSomethingMsg, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true }); objectType.searchText = 'Something Going Wrong'; }
        if (response.statusCode === 200) {
  			if (response.data.data.length > 0) {
  				objectType.isPagination = true;
  				objectType.pageSearchResult = false;
  			} else {
  				objectType.searchText = objectType.noRecord;
  				objectType.isPagination = false;
  			}
  			objectType.newsList = response.data.data;
  			if (objectType.pageNo === 1) {
  				objectType.prevLoading = true;
  				objectType.totalPage = response.data.totalPage;
  				objectType.totalRecords = response.data.totalRecords;
  			}
  			if (objectType.pageNo === objectType.totalPage) {
  				objectType.nextLoading = true;
  			}
        } else {
  			objectType.toastr.errorToastr(response.data.message, null, { autoDismiss: true, maxOpened: 1, preventDuplicates: true });
  			this.searchText = response.data.message;
  	  }

        objectType.loadingBar.stop();
      });
  }
  onPageChange(pageNo, checkStatus) {
    this.pageNo = pageNo;
    this.getNewsData();
  }
  searchNews() {
    const txt = this.newsForm.controls.newsSearchTxt.value;
    if (txt !== '') {
      this.pageNo = 1;
      this.keywords = txt;
      this.getNewsData();
      this.activeFilter = false;
    }
  }
  searchSourceNews() {
    const txt = this.newsForm.controls.newsSearchTxt.value;
	this.pageNo = 1;
	this.keywords = txt;
	this.getNewsData();
	this.activeFilter = false;
  }
  resetSearchTxt() {
    this.keywords = '';
  }
  setNewsData() {
		if (this.newsForm.controls.newsSearchTxt.value.length === 0) {
		  this.keywords = '';
		  this.pageNo = 1;
		  this.getNewsData();
		}
  }
  changePagination(i) {
	  this.nextLoading = this.prevLoading = false;
	  if (i === 0) {
		  if (this.pageNo === 1) {
			  this.prevLoading = true;
				} else {
			   this.prevLoading = false;
			   this.pageNo = (this.pageNo - 1);
			   this.currentPage =  this.pageNo;
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
			  this.currentPage =  this.pageNo;
			  this.onPageChange(this.pageNo, true);
			  if (this.pageNo === this.totalPage) {
				this.nextLoading = true;
					}
		  }
	  }
  }
   getNewsFilterData() { 
      const objectType = this;
	  objectType.dropdownList=[];
      this.newsService.getNewsFilterData(this.stockType,  function(err, response) { 
        objectType.model.sourceItem = '';   	
        if (response.statusCode === 200){      
            objectType.newsFilterList = response.data.sourceData;
			let newKeys=[];			
			if(Object.keys(objectType.newsFilterList).length>0){
				objectType.newsFilterList.map(function(item){
					return newKeys.push({item_id:item.source,item_text:item.source});
				});
			}
			objectType.dropdownList=newKeys;
		}			
      });
   }
   onItemSelect(item: any) {
	  //this.selectedItems.push(item);
   }
   onSelectAll(items: any) {
	   //this.selectedItems=items;
   }
   onItemDeSelect(item:any){
	   //const index: number = this.selectedItems.indexOf(item);
		//if (index !== -1) 
			//this.selectedItems.splice(index, 1);
   }
   onItemDeSelectAll(items: any) {
	   //this.selectedItems=[];
   }
   formatDate(obj) {
        return obj.toString().replace(/\s/g, "T");
    }
}
