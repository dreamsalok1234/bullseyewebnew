import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GlobalService } from './global.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';

@Injectable()
export class TickerService {
  responseItem = { data: {}, statusCode: 200 };
  constructor(public globalService: GlobalService) { }
  getTickerDetails(tickerId, callback) {
    const tickerListAPI = this.globalService.callGetApi('ticker/detail/' + tickerId, true);
    const currencyListAPI = this.globalService.callGetApi('stock/currencyExchange', false);
    this.responseItem = { data: {}, statusCode: 200 };
    forkJoin(
      tickerListAPI, currencyListAPI
    )
      .subscribe(data => {
        try {
          this.responseItem.data = data;
        } catch (error) {
          this.responseItem.data = { message: 'Something went wrong', status: false };
          this.responseItem.statusCode = 403;
        }
        return callback(null, this.responseItem);
      },
        error => {
          try {
            this.responseItem.data = JSON.parse(error.error);
          } catch (err) {
            this.responseItem.data = { message: 'Something went wrong', status: false };
          }
          this.responseItem.statusCode = error.status;
          return callback(null, this.responseItem);

        });
  }
  getAlphaMarket(callback) {
    this.responseItem = { data: {}, statusCode: 200 };
    return this.globalService.callGetApi('investment/alphamarket', true).subscribe(
      data => {
        try {
          this.responseItem.data = data;
        } catch (error) {
          this.responseItem.data = { message: 'Something went wrong', status: false };
          this.responseItem.statusCode = 403;
        }
        return callback(null, this.responseItem);
      },
      error => {
        try {
          this.responseItem.data = error.error;
        } catch (err) {
          this.responseItem.data = { message: 'Something went wrong', status: false };
        }
        this.responseItem.statusCode = error.status;
        return callback(null, this.responseItem);
      });
  }
  RiskIndicators(formdata, callback) {

    this.responseItem = { data: {}, statusCode: 200 };
    return this.globalService.callPostApi('investment/performanceindicator', formdata, true).subscribe(
      data => {

        try {
          this.responseItem.data = data;
        } catch (error) {
          this.responseItem.data = { message: 'Something went wrong', status: false };
          this.responseItem.statusCode = 403;
        }
        return callback(null, this.responseItem);
      },
      error => {

        try {

          this.responseItem.data = error.error;
        } catch (err) {
          this.responseItem.data = { message: 'Something went wrong', status: false };
        }
        this.responseItem.statusCode = error.status;
        return callback(null, this.responseItem);
      });
  }
  getInvestmentPerformance(investmentId, callback) {
    this.responseItem = { data: {}, statusCode: 200 };
    return this.globalService.callGetApi('investment/performance?investmentId=' + investmentId, true).subscribe(
      data => {
        try {
          this.responseItem.data = data;
        } catch (error) {
          this.responseItem.data = { message: 'Something went wrong', status: false };
          this.responseItem.statusCode = 403;
        }
        return callback(null, this.responseItem);
      },
      error => {
        try {
          this.responseItem.data = error.error;
        } catch (err) {
          this.responseItem.data = { message: 'Something went wrong', status: false };
        }
        this.responseItem.statusCode = error.status;
        return callback(null, this.responseItem);
      });
  }
  getTickerChatboard(tickerId, callback) {
    this.responseItem = { data: {}, statusCode: 200 };
    return this.globalService.callGetApi('chatboard/tickerchatboard/' + tickerId, true).subscribe(
      data => {
        try {
          this.responseItem.data = data;
        } catch (error) {
          this.responseItem.data = { message: 'Something went wrong', status: false };
          this.responseItem.statusCode = 403;
        }
        return callback(null, this.responseItem);
      },
      error => {
        try {
          this.responseItem.data = error.error;
        } catch (err) {
          this.responseItem.data = { message: 'Something went wrong', status: false };
        }
        this.responseItem.statusCode = error.status;
        return callback(null, this.responseItem);
      });
  }
}
