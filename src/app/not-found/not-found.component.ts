import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  title='BullsEye Investors | Not Found';
  constructor(private titleService: Title,private meta: Meta,public router: Router) { }

  ngOnInit() {
	  this.titleService.setTitle(this.title);
  }
  gotoHomePage(){
		if((localStorage.getItem('loginUserName') != '' && localStorage.getItem('loginUserName') != undefined && localStorage.getItem('loginUserName') != null))
			this.router.navigate(['/home/'+localStorage.getItem('loginUserName')]);
		else
			this.router.navigate(['/login']);
			
  }

}
