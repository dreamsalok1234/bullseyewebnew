import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  responseItem = { data: {}, statusCode: 200 };
  constructor(public globalService: GlobalService) { }

  openPricePredictionList(callback) {
    this.responseItem = { data: {}, statusCode: 200 };
    return this.globalService.callGetApi('prediction/open', true).subscribe(
       data  => {
           try {
             this.responseItem.data  = data;
           } catch (error) {
             this.responseItem.data  = {message: 'Something Wrong', status: false};
             this.responseItem.statusCode = 403;
           }
           return callback(null, this.responseItem);
       },
       error => {

           try {

             this.responseItem.data  = error.error;
           } catch (err) {
             this.responseItem.data  = { message: 'Something Wrong', status: false };
           }
           this.responseItem.statusCode = error.status;
           return callback(null, this.responseItem);
     });

 }
 closedPricePredictionList(pageSize, pageNoRequest, callback) {
   this.responseItem = { data: {}, statusCode: 200 };

   let pageResquest = '?pageSize=' + pageSize;
   pageResquest += (pageNoRequest === '') ? '' : '&pageNo=' + pageNoRequest;
   return this.globalService.callGetApi('prediction/closed' + pageResquest, true).subscribe(
      data  => {
          try {
            this.responseItem.data  = data;
          } catch (error) {
            this.responseItem.data  = {message: 'Something Wrong', status: false};
            this.responseItem.statusCode = 403;
          }
          return callback(null, this.responseItem);
      },
      error => {

          try {

            this.responseItem.data  = error.error;
          } catch (err) {
            this.responseItem.data  = { message: 'Something Wrong', status: false };
          }
          this.responseItem.statusCode = error.status;
          return callback(null, this.responseItem);
    });

}

 add(formdata, callback) {
  this.responseItem = { data: {}, statusCode: 200 };
  return this.globalService.callPostApi('prediction/add', formdata, true).subscribe(
     data  => {

         try {
           this.responseItem.data  = data;
         } catch (error) {
           this.responseItem.data  = {message: 'Something Wrong', status: false};
           this.responseItem.statusCode = 403;
         }
         return callback(null, this.responseItem);
     },
     error => {
         try {

           this.responseItem.data  = error.error;
         } catch (err) {
           this.responseItem.data  = { message: 'Something Wrong', status: false };
         }
         this.responseItem.statusCode = error.status;
         return callback(null, this.responseItem);
   });
}
}
