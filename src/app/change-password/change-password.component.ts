import { Component, OnInit, ElementRef, ViewContainerRef } from '@angular/core';
import { routerTransition } from '../router.animations';
import { Title, Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  animations: [routerTransition()]
})
export class ChangePasswordComponent implements OnInit {
  show: boolean;
  showBtnText: string;
  submitted = false;
  loading = false;
  title='BullsEye Investors | Change Password';
  constructor(private titleService: Title,private meta: Meta) {
    this.show = false;
		this.showBtnText = 'Show';
  }

  ngOnInit() {
	  this.meta.removeTag('name=title');
	  this.meta.removeTag('name=description');
	  this.titleService.setTitle(this.title);
  }
  onShowHidePassword() {
      this.show = !this.show;
      this.showBtnText = (!this.show) ? 'Show' : 'Hide';
  }
}
