import { Component, OnInit, ElementRef, ViewContainerRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CommonService } from '../../_services/common.service';
import { NewsService } from '../../_services/news.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Title, Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-bullseye-pro',
  templateUrl: './bullseye-pro.component.html',
  styleUrls: ['./bullseye-pro.component.scss'],
  animations: [routerTransition()]
})
export class BullseyeProComponent implements OnInit {
  title='BullsEye Investors | Pro';
  constructor(
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
  get n() {
    return this.newsForm.controls;
  }
  newsForm: FormGroup;
  currentPage = 0;
  totalPage = 0;
  stockType = 'Stock';
  loading = false;
  newsList = [];
  keywords = '';
  checkStatus = true;
  placeholderImageUrl: string;
  activeTab = '';
  isPagination = false;
  pageSearchResult = false;
  searchText = '';
  activeTab2 = 'active';
  curr_array = ['USD', 'SGD', 'INR', 'KD', 'AUD'];
  selectCurr = '';
  ngOnInit() {
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
    this._initForm();

    this.placeholderImageUrl = '../assets/images/not-found.png';
    this.getNewsData();
    this.selectCurr = this.curr_array[0];
  }
  private _initForm(): void {
    this.newsForm = this._fb.group({
      newsSearchTxt: ['', Validators.required]
    });
  }
  toggle(i) {
    this.currentPage = 0;
    this.stockType = i === 1 ? 'Stock' : 'crypto';
    this.getNewsData();
    this.activeTab = !this.activeTab ? 'active' : '';
  }
  getNewsData() {
    this.newsList = [];
    this.searchText = 'Processing...';
    this.pageSearchResult = true;
    const objectType = this;
    // s objectType.loadingBar.start();
  }
  searchNews() {
    const txt = this.newsForm.controls.newsSearchTxt.value;
    if (txt !== '') {
      this.keywords = txt;
      this.getNewsData();
    }
  }
  setNewsData() {
    if (this.newsForm.controls.newsSearchTxt.value.length === 0) {
      this.keywords = '';
      this.getNewsData();
    }
  }

  currencyToggle() {
    this.activeTab2 = this.activeTab2 ? '' : 'active';
  }
  currencyMethod(itemText) {
    this.selectCurr = itemText;
  }
}
