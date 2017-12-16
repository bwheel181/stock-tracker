import 'babel-polyfill'
import {QuandlDataFetcher, QuandlDataParser} from './quandl_service'

// The StockService class should implement a simple interface:
//   Interface {
//     getStockData(tickerSymbol, callback(data, err))      
//   {
// 
// The data obj sould take the minimum form: 
//   { lastRefresh: Date,
//     ticker: string,
//     adj_open: number,
//     adj_high: number,
//     adj_low: number,
//     adj_close: number,
//     adj_volume: number }
//  
// The err obj should be of the form
//   { status: number, message: string }
//
// This ensures dependency inversion, and if this moves to Typescript the above
// interface should be implemented accordingly

export default class StockService {
  constructor() {
    this.latestDataFetcher = new QuandlDataFetcher()
    this.dataParser = new QuandlDataParser()
  }
  
  getLatestStockData(ticker, done) {
    this.latestDataFetcher.getLatestData(ticker, this.dataParser, done)
  }
}
