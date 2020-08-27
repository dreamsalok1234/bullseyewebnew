import { Component, OnInit, ElementRef,  ViewContainerRef } from '@angular/core';
import { routerTransition } from '../router.animations';
import { state, style, transition, animate, trigger, AUTO_STYLE } from '@angular/animations';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Title, Meta } from '@angular/platform-browser';
@Component({
    selector: 'app-privacy',
    templateUrl: './privacy.component.html',
    styleUrls: ['./privacy.component.scss'],
    animations: [routerTransition()]
})
export class PrivacyComponent implements OnInit {
    title='BullsEye Investors | Privacy Policy';
    constructor(private router: Router, public toastr: ToastrManager,private loadingBar: LoadingBarService,private titleService: Title,private meta: Meta
        ) {
    }
    ngOnInit() {
	  this.titleService.setTitle(this.title);
    }
    private _initForm(): void {
        
    }
   
}
