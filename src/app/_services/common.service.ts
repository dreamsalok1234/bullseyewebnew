import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GlobalService } from './global.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';

@Injectable()
export class CommonService {
    responseItem = { data: {}, statusCode: 200 };
    constructor(public globalService: GlobalService) { }
    /* Get All Static Currency*/
	getCurrency() {
		// return  [{"name":"USD","symbol":"$"},{"name":"EUR","symbol":"€"},{"name":"GBP","symbol":"£"},{"name":"HKD","symbol":"HK$"},{"name":"SGD","symbol":"S$"},{"name":"AUD","symbol":"A$"},{"name":"CAD","symbol":"C$"},{"name":"JPY","symbol":"¥"},{"name":"KRW","symbol":"₩"},{"name":"INR","symbol":"₹"},{"name":"IDR","symbol":"Rp"},{"name":"CNY","symbol":"¥"},{"name":"CHF","symbol":"Fr"},{"name":"TWD","symbol":"NT$"}];
		return  [{'name': 'USD', 'symbol': '$'}, {'name': 'EUR', 'symbol': '€'}, {'name': 'GBP', 'symbol': '£'}, {'name': 'HKD', 'symbol': 'HK$'}, {'name': 'SGD', 'symbol': 'S$'}, {'name': 'AUD', 'symbol': 'A$'}, {'name': 'CAD', 'symbol': 'C$'}, {'name': 'JPY', 'symbol': '¥'}, {'name': 'KRW', 'symbol': '₩'}, {'name': 'INR', 'symbol': '₹'}];
	}
	/* Get Ticker List */
	getTickerList(name, type, callback) {
      this.globalService.callGetApi('watchlist/stockMarket?stockType=' + type + '&keyword=' + name + '&pageSize=50', true).subscribe(data  => {
              try {
                this.responseItem.data  = data;
              } catch (error) {
                this.responseItem.data  = {message: 'Something went wrong', status: false};
                this.responseItem.statusCode = 403;
              }
              return callback(null, this.responseItem);
          },
          error => {
              try {
                this.responseItem.data  = JSON.parse(error.error);
              } catch (err) {
                this.responseItem.data  = { message: 'Something went wrong', status: false };
              }
              this.responseItem.statusCode = error.status;
              return callback(null, this.responseItem);

        });
    }
	/* getCurrencyValue(watchListData, key = 'price'){
    	let price = (key == 'price') ? watchListData.price : watchListData.market_cap;
    	let currency = watchListData.currency;

        if(watchListData.currency == 'GBX') {
        	price = (watchListData.price) ? watchListData.price/100 : watchListData.price;
        	currency = 'GBP';
        }
        if(currency == this.watchListCurrency)
        	price = price;
        else {
        	if(currency == 'USD')
        		price = price * this.currencyPriceList[this.watchListCurrency];
        	else
        		price = price * (1/this.currencyPriceList[currency]) * this.currencyPriceList[this.watchListCurrency];
        }
        return price;
    } */
	getGlobalCurrencyConvertValue(currencyPriceList, price, currency, toCurrency, currencyType= false) {
		try {
			if (currencyType && currency === 'GBX') {
				price = price * 100;
			}

			if (currency === 'GBX') {
				price = (price) ? price / 100 : price;
				currency = 'GBP';
			}
			if (currency === toCurrency) {
				price = price;
			} else {
				if (currency === 'USD') {
					price = price * currencyPriceList[toCurrency];
				} else {
					price = price * (1 / currencyPriceList[currency]) * currencyPriceList[toCurrency];
				}
			}


		} catch (err) {
			price = 0;
		}

        return price;
    }
	getGlobalCurrencyValue(callback) {
		 this.responseItem = { data: {}, statusCode: 200 };
		 return this.globalService.callGetApi('stock/currencyExchange', false).subscribe(
			  data  => {
				  try {
					this.responseItem.data  = data;
				  } catch (error) {
					this.responseItem.data  = {message: 'Something went wrong', status: false};
					this.responseItem.statusCode = 403;
				  }
				  return callback(null, this.responseItem);
			  },
			  error => {

				  try {
					this.responseItem.data  = error.error;
				  } catch (err) {
					this.responseItem.data  = { message: 'Something went wrong', status: false };
				  }
				  this.responseItem.statusCode = error.status;
				  return callback(null, this.responseItem);
        });
	}
	/*----------------------- Add Watchlist -----------------------------*/
	addWatchList(formdata, callback) {
       this.responseItem = { data: {}, statusCode: 200 };
       return this.globalService.callPostApi('watchlist/add', formdata, true).subscribe(
          data  => {

              try {
                this.responseItem.data  = data;
              } catch (error) {
                this.responseItem.data  = {message: 'Something went wrong', status: false};
                this.responseItem.statusCode = 403;
              }
              return callback(null, this.responseItem);
          },
          error => {

              try {

                this.responseItem.data  = error.error;
              } catch (err) {
                this.responseItem.data  = { message: 'Something went wrong', status: false };
              }
              this.responseItem.statusCode = error.status;
              return callback(null, this.responseItem);
        });
    }

    /*--------------------------------- Add price ALert ------------------*/
    addPriceAlert(formdata, callback) {
       this.responseItem = { data: {}, statusCode: 200 };
       return this.globalService.callPostApi('watchlist/addpricealert', formdata, true).subscribe(
          data  => {

              try {
                this.responseItem.data  = data;
              } catch (error) {
                this.responseItem.data  = {message: 'Something went wrong', status: false};
                this.responseItem.statusCode = 403;
              }
              return callback(null, this.responseItem);
          },
          error => {

              try {

                this.responseItem.data  = error.error;
              } catch (err) {
                this.responseItem.data  = { message: 'Something went wrong', status: false };
              }
              this.responseItem.statusCode = error.status;
              return callback(null, this.responseItem);
        });

    }
	/* Get Ticker Data By 3Party */
	getTickerDataListByType(chatSymbol, type, currency, limit, dateFrom, dateTo, callback) {

		  this.responseItem = { data: {}, statusCode: 200 };
		  let apiName = '';
		  if (type.toLowerCase() === 'crypto' || type.toLowerCase() === 'cryptocurrency') {
			  apiName = 'https://min-api.cryptocompare.com/data/histoday';
			  apiName += '?fsym=' + chatSymbol;
			  apiName += '&tsym=' + currency;
			  apiName += '&limit=' + limit;
		  } else {
			  apiName = 'https://www.worldtradingdata.com/api/v1/history?api_token=Enbl13NdXIwtInHQM4u9wNQMXrBEJY3WQnqb1nBlT8vK7aWK9DUXdKlcJLVc';
			  apiName += '&symbol=' + chatSymbol;
			  apiName += '&date_to=' + dateTo;
			  apiName += '&date_from=' + dateFrom;
		  }
      
		  this.globalService.callGlobalGetApi(apiName, false).subscribe(data  => {
              try {
                this.responseItem.data  = data;
              } catch (error) {
                this.responseItem.data  = {message: 'Something went wrong', status: false};
                this.responseItem.statusCode = 403;
              }
              return callback(null, this.responseItem);
          },
          error => {
              try {
                this.responseItem.data  = JSON.parse(error.error);
              } catch (err) {
                this.responseItem.data  = { message: 'Something went wrong', status: false };
              }
              this.responseItem.statusCode = error.status;
              return callback(null, this.responseItem);
        });
    }

  /* Get Ticker Data By 3Party */
  getTicker1DDataListByType(chatSymbol, type, currency, limit, callback) {
    debugger;
    this.responseItem = { data: {}, statusCode: 200 };
    let apiName = '';
    if (type.toLowerCase() === 'crypto' || type.toLowerCase() === 'cryptocurrency') {
      apiName = 'https://min-api.cryptocompare.com/data/histominute?fsym=' + chatSymbol + '&tsym=' + currency + '&aggregate=15&limit=96';
    } else {
      apiName = 'https://intraday.worldtradingdata.com/api/v1/intraday?symbol=' + chatSymbol + '&range=1&interval=15&api_token=Enbl13NdXIwtInHQM4u9wNQMXrBEJY3WQnqb1nBlT8vK7aWK9DUXdKlcJLVc';
      // apiName += '&symbol=' + chatSymbol;
    }
    this.globalService.callGlobalGetApi(apiName, false).subscribe(data => {
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
	/* Get Market Value*/
	/* Get Ticker Data By 3Party */
	getServerMarketValue(symbol, type, currency, callback) {
		  this.responseItem = { data: {}, statusCode: 200 };
		  let apiName = '';
		  if (type.toLowerCase() === 'crypto' || type.toLowerCase() === 'cryptocurrency') {
			  apiName = 'https://min-api.cryptocompare.com/data/price';
			  apiName += '?fsym=' + symbol;
			  apiName += '&tsyms=' + currency;
		  } else {
			  apiName = 'https://www.worldtradingdata.com/api/v1/stock?api_token=Enbl13NdXIwtInHQM4u9wNQMXrBEJY3WQnqb1nBlT8vK7aWK9DUXdKlcJLVc';
			  apiName += '&symbol=' + symbol;
		  }
		  const marketPriceAPI = this.globalService.callGlobalGetApi(apiName, false);
		  const currencyListAPI = this.globalService.callGetApi('stock/currencyExchange', false);
		  forkJoin(
			marketPriceAPI, currencyListAPI
		  )
		  .subscribe(data  => {
              try {
                this.responseItem.data  = data;
              } catch (error) {
                this.responseItem.data  = {message: 'Something went wrong', status: false};
                this.responseItem.statusCode = 403;
              }
              return callback(null, this.responseItem);
          },
          error => {
              try {
                this.responseItem.data  = JSON.parse(error.error);
              } catch (err) {
                this.responseItem.data  = { message: 'Something went wrong', status: false };
              }
              this.responseItem.statusCode = error.status;
              return callback(null, this.responseItem);

        });
    }
}
