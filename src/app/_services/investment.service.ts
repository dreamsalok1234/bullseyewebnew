import { Injectable } from '@angular/core';

//import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { Observable } from 'rxjs/Observable';
import { GlobalService } from './global.service';

import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';

@Injectable()
export class InvestmentService {
    responseItem = { data: {}, statusCode: 200 };
    constructor(public globalService: GlobalService) { }
	/* Add Investment Services*/
	addInvestment(formdata, callback) {   
      this.responseItem = { data: {}, statusCode: 200 };
       return this.globalService.callPostApi('ticker/investment',formdata,true).subscribe(
          data  => {  
              try {
                this.responseItem.data  = data;
              }
              catch (error) {
                this.responseItem.data  = {message: "Something Wrong", status: false};
                this.responseItem.statusCode = 403;
              } 
              return callback(null, this.responseItem);             
          },
          error => {   
                         
              try {                 
                this.responseItem.data  = error.error;
              }
              catch (err) {
                this.responseItem.data  = { message: "Something Wrong", status: false };
              }
              this.responseItem.statusCode = error.status;
              return callback(null, this.responseItem);
        });
    }
    /* Add Investment Action Services*/
    addInvestmentAction(type, formdata, callback) {   
      this.responseItem = { data: {}, statusCode: 200 };
      let investUrl = 'ticker/buy';
      if(type == 'Buy')
        investUrl = 'ticker/buy';
      else if(type == 'Sell')
        investUrl = 'ticker/sell';
      else if(type == 'Delete')
        investUrl = 'ticker/delete';
       return this.globalService.callPostApi(investUrl,formdata,true).subscribe(
          data  => {  
              try {
                this.responseItem.data  = data;
              }
              catch (error) {
                this.responseItem.data  = {message: "Something Wrong", status: false};
                this.responseItem.statusCode = 403;
              } 
              return callback(null, this.responseItem);             
          },
          error => {   
                         
              try {                 
                this.responseItem.data  = error.error;
              }
              catch (err) {
                this.responseItem.data  = { message: "Something Wrong", status: false };
              }
              this.responseItem.statusCode = error.status;
              return callback(null, this.responseItem);
        });
    }
    public requestDataFromMultipleSources(apiList): Observable<any[]> {
      return Observable.forkJoin(apiList);
    }
}