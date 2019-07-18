import { Injectable } from '@angular/core';
//import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GlobalService } from './global.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';

@Injectable()
export class WatchlistService {
    responseItem = { data: {}, statusCode: 200 };
    constructor(public globalService: GlobalService) { }

    delete(formdata, callback) {  
       this.responseItem = { data: {}, statusCode: 200 }; 
       return this.globalService.callPostApi('watchlist/delete',formdata, true).subscribe(
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

    deletePriceAlert(formdata, callback) {  
       this.responseItem = { data: {}, statusCode: 200 }; 
       return this.globalService.callPostApi('watchlist/deletepricealert',formdata, true).subscribe(
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

    add(formdata, callback) {  
       this.responseItem = { data: {}, statusCode: 200 }; 
       return this.globalService.callPostApi('watchlist/add',formdata, true).subscribe(
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
    getExchangeWithData(stockType, callback) {
      stockType = ( stockType == '' || stockType == undefined) ? 'STOCK' : stockType;
      let exchangeTypeAPI = this.globalService.callGetApi('watchlist/stockMarket?stockType='+stockType, true);
      let currencyListAPI = this.globalService.callGetApi('stock/currencyExchange', false);
      forkJoin(
        exchangeTypeAPI, currencyListAPI
      )
      .subscribe(data  => { 
              
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
                this.responseItem.data  = JSON.parse(error.error);
              }
              catch (err) {
                this.responseItem.data  = { message: "Something Wrong", status: false };
              }
              this.responseItem.statusCode = error.status;
              return callback(null, this.responseItem);
              
        });      
    }  
    filterExchange(formdata, callback) {  
       this.responseItem = { data: {}, statusCode: 200 }; 
       return this.globalService.callGetApi('watchlist/stockMarket'+formdata, true).subscribe(
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
    priceAlertList(callback) {  
       this.responseItem = { data: {}, statusCode: 200 }; 
       return this.globalService.callGetApi('watchlist/pricealertlist', true).subscribe(
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
}