import { Injectable } from '@angular/core';
//import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GlobalService } from './global.service';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthService {
    responseItem = { data: {}, statusCode: 200 };
    constructor(public globalService: GlobalService) { }

    login(formdata, callback) {  
       this.responseItem = { data: {}, statusCode: 200 }; 
       return this.globalService.callPostApi('auths/login',formdata).subscribe(
          data  => {  
              
              try {
                this.responseItem.data  = data;
              }
              catch (error) {
                this.responseItem.data  = {message: "Something went wrong, please try again!", status: false};
                this.responseItem.statusCode = 403;
              } 
              return callback(null, this.responseItem);             
          },
          error => {   
                      
              try {     
                            
                this.responseItem.data  = error.error;
              }
              catch (err) {
                this.responseItem.data  = { message: "Something went wrong, please try again!", status: false };
              }
              this.responseItem.statusCode = error.status;
              return callback(null, this.responseItem);
        });
    }
    signup(formdata, callback) {   
      this.responseItem = { data: {}, statusCode: 200 };
       return this.globalService.callPostApi('auths/registration',formdata).subscribe(
          data  => {  
              
              try {
                this.responseItem.data  = data;
              }
              catch (error) {
                this.responseItem.data  = {message: "Something went wrong, please try again!", status: false};
                this.responseItem.statusCode = 403;
              } 
              return callback(null, this.responseItem);             
          },
          error => {   
                         
              try {                 
                this.responseItem.data  = error.error;
              }
              catch (err) {
                this.responseItem.data  = { message: "Something went wrong, please try again!", status: false };
              }
              this.responseItem.statusCode = error.status;
              return callback(null, this.responseItem);
        });
    }

    forgotPassword(formdata, callback) {   
      this.responseItem = { data: {}, statusCode: 200 };
       return this.globalService.callPostApi('auths/forgotpassword',formdata).subscribe(
          data  => {  
              
              try {
                this.responseItem.data  = data;
              }
              catch (error) {
                this.responseItem.data  = {message: "Something went wrong, please try again!", status: false};
                this.responseItem.statusCode = 403;
              } 
              return callback(null, this.responseItem);             
          },
          error => {   
                         
              try {                 
                this.responseItem.data  = error.error;
              }
              catch (err) {
                this.responseItem.data  = { message: "Something went wrong, please try again!", status: false };
              }
              this.responseItem.statusCode = error.status;
              return callback(null, this.responseItem);
        });
    }
    resendOtp(formdata, callback) {   
      this.responseItem = { data: {}, statusCode: 200 };
       return this.globalService.callPostApi('auths/resendotp',formdata).subscribe(
          data  => {  
              
              try {
                this.responseItem.data  = data;
              }
              catch (error) {
                this.responseItem.data  = {message: "Something went wrong, please try again!", status: false};
                this.responseItem.statusCode = 403;
              } 
              
              return callback(null, this.responseItem);             
          },
          error => {   
                         
              try {                 
                this.responseItem.data  = error.error;
              }
              catch (err) {
                this.responseItem.data  = { message: "Something went wrong, please try again!", status: false };
              }
              this.responseItem.statusCode = error.status;
              
              return callback(null, this.responseItem);
        });
    }

    verifyOtp(formdata, callback) {
       this.responseItem = { data: {}, statusCode: 200 };   
       return this.globalService.callPostApi('auths/verifyotp',formdata).subscribe(
          data  => {  
              
              try {
                this.responseItem.data  = data;
              }
              catch (error) {
                this.responseItem.data  = {message: "Something went wrong, please try again!", status: false};
                this.responseItem.statusCode = 403;
              } 
              return callback(null, this.responseItem);             
          },
          error => {   
                         
              try {                 
                this.responseItem.data  = error.error;
              }
              catch (err) {
                this.responseItem.data  = { message: "Something went wrong, please try again!", status: false };
              }
              this.responseItem.statusCode = error.status;
              return callback(null, this.responseItem);
        });
    }
	/* Change Password */
	changePassword(formdata, callback) {   
      this.responseItem = { data: {}, statusCode: 200 };
       return this.globalService.callPostApi('auths/resetpassword',formdata,true).subscribe(
          data  => {  
              try {
                this.responseItem.data  = data;
              }
              catch (error) {
                this.responseItem.data  = {message: "Something went wrong, please try again!", status: false};
                this.responseItem.statusCode = 403;
              } 
              
              return callback(null, this.responseItem);             
          },
          error => {   
                         
              try {                 
                this.responseItem.data  = error.error;
              }
              catch (err) {
                this.responseItem.data  = { message: "Something went wrong, please try again!", status: false };
              }
              this.responseItem.statusCode = error.status;
              
              return callback(null, this.responseItem);
        });
    }
	
	/* User Query*/
	userQuery(formdata, callback) {   
      this.responseItem = { data: {}, statusCode: 200 };
       return this.globalService.callPostApi('users/query',formdata,true).subscribe(
          data  => {  
              try {
                this.responseItem.data  = data;
              }
              catch (error) {
                this.responseItem.data  = {message: "Something went wrong, please try again!", status: false};
                this.responseItem.statusCode = 403;
              } 
              
              return callback(null, this.responseItem);             
          },
          error => {   
                         
              try {                 
                this.responseItem.data  = error.error;
              }
              catch (err) {
                this.responseItem.data  = { message: "Something went wrong, please try again!", status: false };
              }
              this.responseItem.statusCode = error.status;
              
              return callback(null, this.responseItem);
        });
    }
	/* Change Phone Number*/
	changePhoneNumberAndVerify(apiName,formdata, callback) {  
      	
      this.responseItem = { data: {}, statusCode: 200 };
       return this.globalService.callPostApi('auths/'+apiName,formdata,true).subscribe(
          data  => {  
              try {
                this.responseItem.data  = data;
              }
              catch (error) {
                this.responseItem.data  = {message: "Something went wrong, please try again!", status: false};
                this.responseItem.statusCode = 403;
              } 
              
              return callback(null, this.responseItem);             
          },
          error => {   
                         
              try {                 
                this.responseItem.data  = error.error;
              }
              catch (err) {
                this.responseItem.data  = { message: "Something went wrong, please try again!", status: false };
              }
              this.responseItem.statusCode = error.status;
              
              return callback(null, this.responseItem);
        });
    }
	/* User Query*/
	  changeBaseCurrency(formdata, callback) {   
      this.responseItem = { data: {}, statusCode: 200 };
       return this.globalService.callPostApi('users/setting',formdata,true).subscribe(
          data  => {  
              try {
                this.responseItem.data  = data;
              }
              catch (error) {
                this.responseItem.data  = {message: "Something went wrong, please try again!", status: false};
                this.responseItem.statusCode = 403;
              } 
              
              return callback(null, this.responseItem);             
          },
          error => {   
                         
              try {                 
                this.responseItem.data  = error.error;
              }
              catch (err) {
                this.responseItem.data  = { message: "Something went wrong, please try again!", status: false };
              }
              this.responseItem.statusCode = error.status;
              
              return callback(null, this.responseItem);
        });
    }

    /*Update Default Language*/
    changeLanguage(formdata, callback) {   
      this.responseItem = { data: {}, statusCode: 200 };
       return this.globalService.callPostApi('users/language',formdata,true).subscribe(
          data  => {  
              try {
                this.responseItem.data  = data;
              }
              catch (error) {
                this.responseItem.data  = {message: "Something went wrong, please try again!", status: false};
                this.responseItem.statusCode = 403;
              } 
              
              return callback(null, this.responseItem);             
          },
          error => {   
                         
              try {                 
                this.responseItem.data  = error.error;
              }
              catch (err) {
                this.responseItem.data  = { message: "Something went wrong, please try again!", status: false };
              }
              this.responseItem.statusCode = error.status;
              
              return callback(null, this.responseItem);
        });
    }

    /*Invite Friend*/
    inviteFriend(formdata, callback) {   
      this.responseItem = { data: {}, statusCode: 200 };
       return this.globalService.callPostApi('users/invitebyemail',formdata,true).subscribe(
          data  => {  
              try {
                this.responseItem.data  = data;
              }
              catch (error) {
                this.responseItem.data  = {message: "Something went wrong, please try again!", status: false};
                this.responseItem.statusCode = 403;
              } 
              
              return callback(null, this.responseItem);             
          },
          error => {   
                         
              try {                 
                this.responseItem.data  = error.error;
              }
              catch (err) {
                this.responseItem.data  = { message: "Something went wrong, please try again!", status: false };
              }
              this.responseItem.statusCode = error.status;
              
              return callback(null, this.responseItem);
        });
    }
	/*Get My Subscription*/
	getMySubscription(callback) {
		this.responseItem = { data: {}, statusCode: 200 };
		return this.globalService.callGetApi('subscription/getmysubscription',true).subscribe(
          data  => {  
              try {
                this.responseItem.data  = data;
              }
              catch (error) {
                this.responseItem.data  = {message: "Something went wrong, please try again!", status: false};
                this.responseItem.statusCode = 403;
              } 
              return callback(null, this.responseItem);             
          },
          error => {          
              try {                 
                this.responseItem.data  = error.error;
              }
              catch (err) {
                this.responseItem.data  = { message: "Something went wrong, please try again!", status: false };
              }
              this.responseItem.statusCode = error.status;
              return callback(null, this.responseItem);
        }); 
    }
	/*Auto Renewal On Off*/
    changeAutoRenewal(formdata, callback) {   
      this.responseItem = { data: {}, statusCode: 200 };
       return this.globalService.callPostApi('subscription/renew',formdata,true).subscribe(
          data  => {  
              try {
                this.responseItem.data  = data;
              }
              catch (error) {
                this.responseItem.data  = {message: "Something went wrong, please try again!", status: false};
                this.responseItem.statusCode = 403;
              } 
              
              return callback(null, this.responseItem);             
          },
          error => {   
                         
              try {                 
                this.responseItem.data  = error.error;
              }
              catch (err) {
                this.responseItem.data  = { message: "Something went wrong, please try again!", status: false };
              }
              this.responseItem.statusCode = error.status;
              
              return callback(null, this.responseItem);
        });
    }
	/*Get My Subscription*/
	cancelSubscription(callback) {
		this.responseItem = { data: {}, statusCode: 200 };
		return this.globalService.callGetApi('subscription/cancel',true).subscribe(
          data  => {  
              try {
                this.responseItem.data  = data;
              }
              catch (error) {
                this.responseItem.data  = {message: "Something went wrong, please try again!", status: false};
                this.responseItem.statusCode = 403;
              } 
              return callback(null, this.responseItem);             
          },
          error => {          
              try {                 
                this.responseItem.data  = error.error;
              }
              catch (err) {
                this.responseItem.data  = { message: "Something went wrong, please try again!", status: false };
              }
              this.responseItem.statusCode = error.status;
              return callback(null, this.responseItem);
        }); 
    }
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
	
}