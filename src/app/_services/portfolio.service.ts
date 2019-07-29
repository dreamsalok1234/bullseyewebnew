import { Injectable } from '@angular/core';

//import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { Observable } from 'rxjs/Observable';
import { GlobalService } from './global.service';

import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';

@Injectable()
export class PortfolioService {
    responseItem = { data: {}, statusCode: 200 };
    constructor(public globalService: GlobalService) { }

    /***************************** Add/List Property Section ********************/
    getHomePageData(callback) {
      let portfolioListAPI = this.globalService.callGetApi('portfolio/list', true);
      let watchListAPI = this.globalService.callGetApi('watchlist/list', true);
      let currencyListAPI = this.globalService.callGetApi('stock/currencyExchange', false);
      forkJoin(
        portfolioListAPI, watchListAPI, currencyListAPI
      )
      .subscribe(data  => { 
              try {
                this.responseItem.data  = data;
              }
              catch (error) {
                this.responseItem.data  = {message: "Something went wrong", status: false};
                this.responseItem.statusCode = 403;
              } 
              return callback(null, this.responseItem);             
          },
          error => {                       
              try {                 
                this.responseItem.data  = JSON.parse(error.error);
              }
              catch (err) {
                this.responseItem.data  = { message: "Something went wrong", status: false };
              }
              this.responseItem.statusCode = error.status;
              return callback(null, this.responseItem);
              
        });
      /*return this.requestDataFromMultipleSources([portfolioListAPI, watchListAPI, currencyListAPI]).subscribe(
          data  => {  
              
              try {
                this.responseItem.data  = data;
              }
              catch (error) {
                this.responseItem.data  = {message: "Something went wrong", status: false};
                this.responseItem.statusCode = 403;
              } 
              return callback(null, this.responseItem);             
          },
          error => { 
                           
              try {                 
                this.responseItem.data  = JSON.parse(error.error);
              }
              catch (err) {
                this.responseItem.data  = { message: "Something went wrong", status: false };
              }
              this.responseItem.statusCode = error.status;
              return callback(null, this.responseItem);
              
        });*/
    }
	/* Add Portfolio Services*/
	addPortfolio(formdata, callback) {   
      this.responseItem = { data: {}, statusCode: 200 };
       return this.globalService.callPostApi('portfolio/add',formdata,true).subscribe(
          data  => {  
              try {
                this.responseItem.data  = data;
              }
              catch (error) {
                this.responseItem.data  = {message: "Something went wrong", status: false};
                this.responseItem.statusCode = 403;
              } 
              return callback(null, this.responseItem);             
          },
          error => {   
                         
              try {                 
                this.responseItem.data  = error.error;
              }
              catch (err) {
                this.responseItem.data  = { message: "Something went wrong", status: false };
              }
              this.responseItem.statusCode = error.status;
              return callback(null, this.responseItem);
        });
    }
	/* Get Portfolio Services*/
	getPortfolioDetails(portfolioId, callback) { 
	  this.responseItem = { data: {}, statusCode: 200 };
	  let currencyListAPI = this.globalService.callGetApi('stock/currencyExchange', false);
	  let portfolioGraphListAPI = this.globalService.callGetApi('ticker/portfoliotickers/'+portfolioId, true);
       forkJoin(
		portfolioGraphListAPI, currencyListAPI
      )
	  .subscribe(data  => { 
              try {
                this.responseItem.data  = data;
              }
              catch (error) {
                this.responseItem.data  = {message: "Something went wrong", status: false};
                this.responseItem.statusCode = 403;
              } 
              return callback(null, this.responseItem);             
          },
          error => {                       
              try {                 
                this.responseItem.data  = JSON.parse(error.error);
              }
              catch (err) {
                this.responseItem.data  = { message: "Something went wrong", status: false };
              }
              this.responseItem.statusCode = error.status;
              return callback(null, this.responseItem);
              
        });
     
       /* return this.globalService.callGetApi('ticker/portfoliotickers/'+portfolioId,true).subscribe(
          data  => { 
					  
              try {
                this.responseItem.data  = data;
              }
              catch (error) {
                this.responseItem.data  = {message: "Something went wrong", status: false};
                this.responseItem.statusCode = 403;
              } 
              return callback(null, this.responseItem);             
          },
          error => {   
                         
              try {                 
                this.responseItem.data  = error.error;
              }
              catch (err) {
                this.responseItem.data  = { message: "Something went wrong", status: false };
              }
              this.responseItem.statusCode = error.status;
              return callback(null, this.responseItem);
        }); */
    }
	/* Get Portfolio Graph*/
	getPortfolioGraphDetails(portfolioId,durationType,duration,callback) { 
	   this.responseItem = { data: {}, statusCode: 200 };
	   let pageResquest="?duration="+duration;
	   pageResquest+=(durationType=="")?"":"&durationType="+durationType;
       let currencyListAPI = this.globalService.callGetApi('stock/currencyExchange', false);
	   let portfolioGraphListAPI = this.globalService.callGetApi('portfolio/graph/'+portfolioId+pageResquest, true);
       forkJoin(
		portfolioGraphListAPI, currencyListAPI
      )
      .subscribe(data  => { 
              try {
                this.responseItem.data  = data;
              }
              catch (error) {
                this.responseItem.data  = {message: "Something went wrong", status: false};
                this.responseItem.statusCode = 403;
              } 
              return callback(null, this.responseItem);             
          },
          error => {                       
              try {                 
                this.responseItem.data  = JSON.parse(error.error);
              }
              catch (err) {
                this.responseItem.data  = { message: "Something went wrong", status: false };
              }
              this.responseItem.statusCode = error.status;
              return callback(null, this.responseItem);
              
        });
		
       /* return this.globalService.callGetApi('portfolio/graph/'+portfolioId+pageResquest,true).subscribe(
          data  => { 
					  
              try {
                this.responseItem.data  = data;
              }
              catch (error) {
                this.responseItem.data  = {message: "Something went wrong", status: false};
                this.responseItem.statusCode = 403;
              } 
              return callback(null, this.responseItem);             
          },
          error => {   
                         
              try {                 
                this.responseItem.data  = error.error;
              }
              catch (err) {
                this.responseItem.data  = { message: "Something went wrong", status: false };
              }
              this.responseItem.statusCode = error.status;
              return callback(null, this.responseItem);
        }); */
    }
	/* Delete Portfolio Services*/
	delete(formdata, callback) {   
		  this.responseItem = { data: {}, statusCode: 200 };
		  return this.globalService.callPostApi('portfolio/delete',formdata,true).subscribe(
			data  => {  
				try {
				  this.responseItem.data  = data;
				}
				catch (error) {
				  this.responseItem.data  = {message: "Something went wrong", status: false};
				  this.responseItem.statusCode = 403;
				} 
				return callback(null, this.responseItem);             
			},
			error => {   
						   
				try {                 
				  this.responseItem.data  = error.error;
				}
				catch (err) {
				  this.responseItem.data  = { message: "Something went wrong", status: false };
				}
				this.responseItem.statusCode = error.status;
				return callback(null, this.responseItem);
		  });
	  }
	 /* Get Portfolio History*/
	getPortfolioHistory(portfolioId,pageSize,pageNoRequest, callback) {   
	 
       this.responseItem = { data: {}, statusCode: 200 };
	   let pageResquest="?pageSize="+pageSize;
	   pageResquest+=(pageNoRequest=="")?"":"&pageNo="+pageNoRequest;
       return this.globalService.callGetApi('portfolio/history/'+portfolioId+pageResquest,true).subscribe(
          data  => { 	  
              try {
                this.responseItem.data  = data;
              }
              catch (error) {
                this.responseItem.data  = {message: "Something went wrong", status: false};
                this.responseItem.statusCode = 403;
              } 
              return callback(null, this.responseItem);             
          },
          error => {   
                         
              try {                 
                this.responseItem.data  = error.error;
              }
              catch (err) {
                this.responseItem.data  = { message: "Something went wrong", status: false };
              }
              this.responseItem.statusCode = error.status;
              return callback(null, this.responseItem);
        });
    }
    public requestDataFromMultipleSources(apiList): Observable<any[]> {
      return Observable.forkJoin(apiList);
    }

    /* CHange portfolio Order*/
    changeWatchListOrder(formdata, callback) {  
       this.responseItem = { data: {}, statusCode: 200 }; 
       return this.globalService.callPostApi('portfolio/change_order', formdata, true).subscribe(
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