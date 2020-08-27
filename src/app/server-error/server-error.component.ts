import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.scss']
})
export class ServerErrorComponent implements OnInit {
  title='BullsEye Investors | Server Error';
  constructor(private titleService: Title,private meta: Meta) { }

  ngOnInit() {
	  this.titleService.setTitle(this.title);
  }

}
