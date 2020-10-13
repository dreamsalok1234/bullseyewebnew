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
  selector: 'app-terms-service',
  templateUrl: './terms-service.component.html',
  styleUrls: ['./terms-service.component.scss'],
  animations: [routerTransition()]
})
export class TermsServiceComponent implements OnInit {
   title='BullsEye Investors | Terms & Condition';
   constructor(private router: Router,private loadingBar: LoadingBarService,
	private titleService: Title,
	private meta: Meta){
   }
  ngOnInit() {
	this.meta.removeTag('name=title');
	this.meta.removeTag('name=description');
	this.titleService.setTitle(this.title);
	 /* Check Token */
	if ((localStorage.getItem('userProfileInfo') === '' || localStorage.getItem('userProfileInfo') === undefined || localStorage.getItem('userProfileInfo') === null) && (localStorage.getItem('userAccessToken') === '' || localStorage.getItem('userAccessToken') === undefined || localStorage.getItem('userAccessToken') === null)) 
		this.router.navigate(['/login']);
  }
}
