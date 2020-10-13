import { Injectable } from '@angular/core';

// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
import { GlobalService } from './global.service';

import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';

@Injectable()
export class NewsService {
  responseItem = { data: {}, statusCode: 200 };
  constructor(public globalService: GlobalService) { }

  /***************************** Add/List Property Section ********************/
  getNewsData(type, keywordsRequest, sourceItem, pageSize, pageNoRequest, callback) {
    this.responseItem = { data: {}, statusCode: 200 };
    type = (type === '') ? '' : '/' + type;
    let pageResquest = '?pageSize' + pageSize;
    pageResquest += (keywordsRequest === '') ? '' : '&keywords=' + keywordsRequest;
    pageResquest += (sourceItem === '') ? '' : '&source=' + sourceItem;
    pageResquest += (pageNoRequest === '') ? '' : '&pageNo=' + pageNoRequest;
    return this.globalService.callGetApi('news/list' + type + pageResquest, false).subscribe(
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
  /*************************Get Filter Data *********************/
  getNewsFilterData(type, callback) {
    this.responseItem = { data: {}, statusCode: 200 };
    type = (type === '') ? '' : '/' + type;
    return this.globalService.callGetApi('news/filter' + type, false).subscribe(
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
