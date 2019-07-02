import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.scss']
})
export class AccessDeniedComponent implements OnInit {
  title='BullsEye Investors | Access Denied';
  constructor(private titleService: Title,private meta: Meta) {}

  ngOnInit() {
	  this.meta.removeTag('name=title');
	  this.meta.removeTag('name=description');
	  this.titleService.setTitle(this.title);
  }

}
