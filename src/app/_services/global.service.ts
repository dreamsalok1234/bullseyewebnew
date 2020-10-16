import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders, HttpParams } from '@angular/common/http';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable, throwError } from 'rxjs';
import 'rxjs/add/operator/map';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { EmptyObservable } from 'rxjs/observable/EmptyObservable';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
@Injectable()
export class GlobalService {
    //apiBaseUrl used in prodialog component
    apiBaseUrl = 'https://bullseyeinvestors.live/tester';
    apiUrl = this.apiBaseUrl+'/apis/v3/';
    // apiUrl = 'https://bullseyeinvestors.live/apis/v3/';
    // apiUrl = 'http://localhost/bullseye/apis/v3/';
    responseItem: { data: any, statusCode: Number };
    unauthorizedReqMsg = 'Unauthorized Request!';
    defaulterrSomethingMsg = 'Something went wrong';
    profileInfo: any = { 'defaultLanguage': '' };
    empty: any = [];
    check = 0;
    constructor(
        private newhttp: Http,
        private http: HttpClient,
        private httpClient: HttpClientModule,
        public router: Router,
        private translate: TranslateService,
        public toastr: ToastrManager,
        private modalService: NgbModal
        ) {
        /* Check Token */
        if (
            (localStorage.getItem('userProfileInfo') === '' ||
            localStorage.getItem('userProfileInfo') === undefined ||
            localStorage.getItem('userProfileInfo') === null)
            && (localStorage.getItem('userAccessToken') === ''
            || localStorage.getItem('userAccessToken') === undefined
            || localStorage.getItem('userAccessToken') === null)
            ) { } else {
            this.profileInfo = JSON.parse(localStorage.getItem('userProfileInfo'));
        }
        /* Set Language Translator */
        this.translate.addLangs(['en', 'ko', 'hi', 'zh', 'es', 'ja']);
        this.translate.setDefaultLang('en');
        const browserLang = (this.profileInfo.defaultLanguage !== undefined
            && this.profileInfo.defaultLanguage !== '') ? this.profileInfo.defaultLanguage : 'en';
        this.translate.use(browserLang.match(/en|ko|hi|zh|es|ja/) ? browserLang : 'en');
        this.translate.get('unauthorizedReqMsg').subscribe(value => {
            this.unauthorizedReqMsg = value;
        });
    }


    callGetApi(apiname, accessToken = false) {
        // if (accessToken) {
        const authToken = localStorage.getItem('userAccessToken');
        const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `JWT ${authToken}` });
        // } else {
        //     const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded'});
        // }
        /*const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        if(accessToken) {
            let authToken = localStorage.getItem('userAccessToken');
            headers.append('Authorization', `JWT ${authToken}`);

        }*/
        const objectType = this;
        return this.http.get(this.apiUrl + apiname, { headers }).map((user: Response) => {
            objectType.check = 0;
            return user;
        }).catch((error: any) => {
            if (error.status === 401) {
                if (objectType.check === 0) {
                    // objectType.toastr.errorToastr(objectType.unauthorizedReqMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
                    objectType.check = 1;
                }
                localStorage.clear();
                objectType.modalService.dismissAll();
                objectType.router.navigateByUrl('login', { replaceUrl: true });
                return new EmptyObservable();

            } else {
                objectType.check = 0;
            }
            return throwError(error);
        });
        /* var headers = new Headers();

        if(accessToken) {
            let authToken = localStorage.getItem('userAccessToken');
            headers.append('Authorization', `JWT ${authToken}`);
        }

        let options = new RequestOptions({ headers: headers });
        return this.newhttp.get(this.apiUrl+apiname, options).map((user : Response) => {
                return user.json();
            });*/
    }

    callPostApi(apiname, parameter, accessToken = false) {

        let httpParams = new HttpParams();
        Object.keys(parameter).forEach(function (key) {
            httpParams = httpParams.append(key, parameter[key]);
        });
        // if (accessToken) {
        const authToken = localStorage.getItem('userAccessToken');
        const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `JWT ${authToken}` });
        // } else {
        //     const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded'});
        // }
        /*if(accessToken) {

            let authToken = localStorage.getItem('userAccessToken');
            headers.append('Authorization', `JWT ${authToken}`);

        }*/
        const objectType = this;
        return this.http.post(this.apiUrl + apiname, httpParams, { headers }).map((user: Response) => {

            objectType.check = 0;
            return user;
        }).catch((error: any) => {

            if (error.status === 401) {
                if (objectType.check === 0) {
                    // objectType.toastr.errorToastr(objectType.unauthorizedReqMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
                    objectType.check = 1;
                }
                localStorage.clear();
                objectType.modalService.dismissAll();
                objectType.router.navigateByUrl('login', { replaceUrl: true });
                return new EmptyObservable();
            } else {
                objectType.check = 0;
            }
            return throwError(error);
        });

        /*var headers = new Headers();

        if(accessToken) {
            let authToken = localStorage.getItem('userAccessToken');
            headers.append('Authorization', `JWT ${authToken}`);

        }
        headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
        headers.append('Accept' , 'application/json');
        let options = new RequestOptions({ headers: headers });


        return this.newhttp.post(this.apiUrl+apiname, parameter, options).map((user : Response) => {
                return user.json();
            });*/
    }
    callNewGlobalGetApi(apiname, accessToken = false) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
        const objectType = this;
        return this.http.get(apiname).map((user: Response) => {
            objectType.check = 0;
            return user;
        }).catch((error: any) => {
            if (error.status === 401) {
                if (objectType.check === 0) {
                    objectType.check = 1;
                }
                localStorage.clear();
                objectType.modalService.dismissAll();
                objectType.router.navigateByUrl('login', { replaceUrl: true });
                return new EmptyObservable();
            } else {
                objectType.check = 0;
            }
            return throwError(error);
        });
    }
    callGlobalGetApi(apiname, accessToken = false) {
        // if (accessToken) {
        const authToken = localStorage.getItem('userAccessToken');
        const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `JWT ${authToken}` });
        // } else {
        //     const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded'});
        // }
        /*const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        if(accessToken) {
            let authToken = localStorage.getItem('userAccessToken');
            headers.append('Authorization', `JWT ${authToken}`);

        }*/
        const objectType = this;
        return this.http.get(apiname, { headers }).map((user: Response) => {
            objectType.check = 0;
            return user;
        }).catch((error: any) => {
            if (error.status === 401) {
                if (objectType.check === 0) {
                    // objectType.toastr.errorToastr(objectType.unauthorizedReqMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
                    objectType.check = 1;
                }
                localStorage.clear();
                objectType.modalService.dismissAll();
                objectType.router.navigateByUrl('login', { replaceUrl: true });
                return new EmptyObservable();
            } else {
                objectType.check = 0;
            }
            return throwError(error);
        });
        /* var headers = new Headers();

        if(accessToken) {
            let authToken = localStorage.getItem('userAccessToken');
            headers.append('Authorization', `JWT ${authToken}`);
        }

        let options = new RequestOptions({ headers: headers });
        return this.newhttp.get(this.apiUrl+apiname, options).map((user : Response) => {
                return user.json();
            });*/
    }

    callFilePostApi(apiname, parameter, accessToken = false) {

        const httpParams = new FormData();
        Object.keys(parameter).forEach(function (key) {
            httpParams.append(key, parameter[key], parameter[key].name);
        });
        // if (accessToken) {
        const authToken = localStorage.getItem('userAccessToken');
        const headers = new HttpHeaders({ 'Authorization': `JWT ${authToken}` });
        // } else {
        //     const headers = new HttpHeaders({});
        // }

        const objectType = this;
        return this.http.post(this.apiUrl + apiname, httpParams, { headers }).map((user: Response) => {

            objectType.check = 0;
            return user;
        }).catch((error: any) => {

            if (error.status === 401) {
                if (objectType.check === 0) {
                    // objectType.toastr.errorToastr(objectType.unauthorizedReqMsg, null, {autoDismiss: true, maxOpened: 1, preventDuplicates: true});
                    objectType.check = 1;
                }
                localStorage.clear();
                objectType.modalService.dismissAll();
                objectType.router.navigateByUrl('login', { replaceUrl: true });
                return new EmptyObservable();
            } else {
                objectType.check = 0;
            }
            return throwError(error);
        });

        /*var headers = new Headers();

        if(accessToken) {
            let authToken = localStorage.getItem('userAccessToken');
            headers.append('Authorization', `JWT ${authToken}`);

        }
        headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
        headers.append('Accept' , 'application/json');
        let options = new RequestOptions({ headers: headers });


        return this.newhttp.post(this.apiUrl+apiname, parameter, options).map((user : Response) => {
                return user.json();
            });*/
    }
}
