import { Injectable } from '@angular/core';

// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
import { GlobalService } from './global.service';

import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';

@Injectable()
export class ChatService {
  responseItem = { data: {}, statusCode: 200 };
  constructor(public globalService: GlobalService) { }

  /***************************** get Chat Section ********************/
  getChatData(apiName, type, keywordsRequest, pageSize, pageNoRequest, callback) {
    this.responseItem = { data: {}, statusCode: 200 };
    let pageResquest = '?pageSize=' + pageSize;
    pageResquest += (type === '') ? '' : '&stockType=' + type;
    pageResquest += (keywordsRequest === '') ? '' : '&keywords=' + keywordsRequest;
    pageResquest += (pageNoRequest === '') ? '' : '&pageNo=' + pageNoRequest;
    const chatListAPI = this.globalService.callGetApi('chatboard/' + apiName + pageResquest, true);
    const currencyListAPI = this.globalService.callGetApi('stock/currencyExchange', false);
    forkJoin(
      chatListAPI, currencyListAPI
    )
      .subscribe(data => {
        try {
          this.responseItem.data = data;
        } catch (error) {
          this.responseItem.data = { message: 'Something Wrong', status: false };
          this.responseItem.statusCode = 403;
        }
        return callback(null, this.responseItem);
      },
        error => {
          try {
            this.responseItem.data = JSON.parse(error.error);
          } catch (err) {
            this.responseItem.data = { message: 'Something Wrong', status: false };
          }
          this.responseItem.statusCode = error.status;
          return callback(null, this.responseItem);

        });
  }
  /**************************** Get Message List ********************/
  getChatDetails(chatBoardId, timestampData, pageSize, pageNoRequest, callback) {
    this.responseItem = { data: {}, statusCode: 200 };
    let pageResquest = '?pageSize=' + pageSize;
    pageResquest += '&chatBoardId=' + chatBoardId;
    pageResquest += (timestampData === '') ? '' : '&timestampData=' + timestampData;
    pageResquest += (pageNoRequest === '') ? '' : '&pageNo=' + pageNoRequest;
    return this.globalService.callGetApi('chatboard/messagelist' + pageResquest, true).subscribe(
      data => {
        try {
          this.responseItem.data = data;
        } catch (error) {
          this.responseItem.data = { message: 'Something Wrong', status: false };
          this.responseItem.statusCode = 403;
        }
        return callback(null, this.responseItem);
      },
      error => {
        try {
          this.responseItem.data = error.error;
        } catch (err) {
          this.responseItem.data = { message: 'Something Wrong', status: false };
        }
        this.responseItem.statusCode = error.status;
        return callback(null, this.responseItem);
      });
  }
  /**************************** Update Favourite ********************/
  addUpdateFavourite(formdata, apiName, callback) {
    this.responseItem = { data: {}, statusCode: 200 };
    return this.globalService.callPostApi('chatboard/' + apiName, formdata, true).subscribe(
      data => {
        try {
          this.responseItem.data = data;
        } catch (error) {
          this.responseItem.data = { message: 'Something Wrong', status: false };
          this.responseItem.statusCode = 403;
        }
        return callback(null, this.responseItem);
      },
      error => {
        try {
          this.responseItem.data = error.error;
        } catch (err) {
          this.responseItem.data = { message: 'Something Wrong', status: false };
        }
        this.responseItem.statusCode = error.status;
        return callback(null, this.responseItem);
      });
  }
  /* Delete Message */
  deleteMessage(messageId, callback) {
    this.responseItem = { data: {}, statusCode: 200 };
    const pageResquest = '?messageId=' + messageId;
    return this.globalService.callPostApi('chatboard/deletemessage' + pageResquest, {}, true).subscribe(
      data => {
        try {
          this.responseItem.data = data;
        } catch (error) {
          this.responseItem.data = { message: 'Something Wrong', status: false };
          this.responseItem.statusCode = 403;
        }
        return callback(null, this.responseItem);
      },
      error => {
        try {
          this.responseItem.data = error.error;
        } catch (err) {
          this.responseItem.data = { message: 'Something Wrong', status: false };
        }
        this.responseItem.statusCode = error.status;
        return callback(null, this.responseItem);
      });
  }
  /* Delete Message */
  share(symbol, text, callback) {
    this.responseItem = { data: {}, statusCode: 200 };
    const pageResquest = '?symbol=' + symbol + '&text=' + text;
    return this.globalService.callGetApi('chatboard/share' + pageResquest, true).subscribe(
      data => {
        try {
          this.responseItem.data = data;
        } catch (error) {
          this.responseItem.data = { message: 'Something Wrong', status: false };
          this.responseItem.statusCode = 403;
        }
        return callback(null, this.responseItem);
      },
      error => {
        try {
          this.responseItem.data = error.error;
        } catch (err) {
          this.responseItem.data = { message: 'Something Wrong', status: false };
        }
        this.responseItem.statusCode = error.status;
        return callback(null, this.responseItem);
      });
  }
}
