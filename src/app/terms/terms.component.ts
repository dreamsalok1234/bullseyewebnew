import { Component, OnInit, ElementRef,  ViewContainerRef } from '@angular/core';
import { routerTransition } from '../router.animations';
import { TranslateService } from '@ngx-translate/core';
import { state, style, transition, animate, trigger, AUTO_STYLE } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Title, Meta } from '@angular/platform-browser';
@Component({
    selector: 'app-terms',
    templateUrl: './terms.component.html',
    styleUrls: ['./terms.component.scss'],
    animations: [routerTransition()]
})
export class TermsComponent implements OnInit {
	title='BullsEye Investors | Terms & Condition';
    constructor(
        private translate: TranslateService,private loadingBar: LoadingBarService,private titleService: Title,private meta: Meta
        ) {
            
		}

    ngOnInit() {
		this.titleService.setTitle(this.title);
    }

    private _initForm(): void {
        
    }
   
}
