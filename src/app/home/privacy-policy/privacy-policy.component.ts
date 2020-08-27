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
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
  animations: [routerTransition()]
})
export class PrivacyPolicyComponent implements OnInit {
  title='BullsEye Investors | Privacy Policy';
  constructor(private router: Router,private loadingBar: LoadingBarService,private titleService: Title,
	private meta: Meta){
   }
  ngOnInit() {
	this.titleService.setTitle(this.title);
	 /* Check Token */
	if ((localStorage.getItem('userProfileInfo') === '' || localStorage.getItem('userProfileInfo') === undefined || localStorage.getItem('userProfileInfo') === null) && (localStorage.getItem('userAccessToken') === '' || localStorage.getItem('userAccessToken') === undefined || localStorage.getItem('userAccessToken') === null)) 
		this.router.navigate(['/login']);
  }
}
