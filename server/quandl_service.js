import 'babel-polyfill'
import { apiKey } from './config'
const fetch = require('node-fetch')

class QuandlDataFetcher {
  constructor() {
    this.baseUrl = 'https://www.quandl.com/api/v3/datasets/WIKI/'
  }
  
  getLatestData(ticker, dataParser, done) {
    let err = null
    let data = null
    fetch(`${this.baseUrl}${ticker}.json?rows=1&api_key=${apiKey}`)
      .then((res) => {
        if (!res.ok) return { networkErr: res.statusText, status: res.status }
        return res.json()
      }).then((json) => {
        if (json.networkErr) err = { status: json.status, message: json.networkErr }
        if (json.quandl_error) err = { status: 404, message: `Incorrect ticker: ${ticker}` }
        if (json.dataset) data = dataParser.parse(json.dataset)
        done(data, err)
      }).catch((netErr) => {
        err = { status: 500, message: `Network error: ${netErr}` }
        done(data, err)
      })
  }
}

class QuandlDataParser {
  parse(data) {
    const obj = {}
    const keys = data.column_names
    const values = data.data[0]
    const len = keys.length
    for (let i = 0; i < len; i += 1) {
      let key = keys[i].replace('.', '').replace('-', '_').replace(' ', '_').toLowerCase()
      obj[key] = values[i]
    }
    obj.ticker = data.dataset_code
    obj.lastRefresh = new Date(data.newest_available_date)
    obj.date = new Date(obj.date)
    if (data.name.indexOf('(') !== -1) {
      obj.name = data.name.slice(0, data.name.indexOf('(')).trim() 
    } else {
      obj.name = "Unknown"
    }
    return obj
  }
}

export {QuandlDataFetcher, QuandlDataParser}

// Data structure for Quandl API
// { id: 9775687,
//   dataset_code: 'FB',
//   database_code: 'WIKI',
//   name: 'Facebook Inc. (FB) Prices, Dividends, Splits and Trading Volume',
//   description: 'End of day open, high, low, close and volume, dividends and splits, and split/dividend adjusted open, high, low close and volume for Facebook, Inc. (FB). Ex-Dividend is non-zero on ex-dividend dates. Split Ratio is 1 on non-split dates. Adjusted prices are calculated per CRSP (www.crsp.com/products/documentation/crsp-calculations)\n\nThis data is in the public domain. You may copy, distribute, disseminate or include the data in other products for commercial and/or noncommercial purposes.\n\nThis data is part of Quandl\'s Wiki initiative to get financial data permanently into the public domain. Quandl relies on users like you to flag errors and provide data where data is wrong or missing. Get involved: connect@quandl.com\n',
//   refreshed_at: '2017-12-13T22:47:25.923Z',
//   newest_available_date: '2017-12-13',
//   oldest_available_date: '2012-05-18',
//   column_names: 
//   [ 'Date',
//     'Open',
//     'High',
//     'Low',
//     'Close',
//     'Volume',
//     'Ex-Dividend',
//     'Split Ratio',
//     'Adj. Open',
//     'Adj. High',
//     'Adj. Low',
//     'Adj. Close',
//     'Adj. Volume' ],
//   frequency: 'daily',
//   type: 'Time Series',
//   premium: false,
//   limit: 1,
//   transform: null,
//   column_index: null,
//   start_date: '2012-05-18',
//   end_date: '2017-12-13',
//   data: 
//   [ [ '2017-12-13',
//       177.3,
//       179.16,
//       177.25,
//       178.3,
//       14406776,
//       0,
//       1,
//       177.3,
//       179.16,
//       177.25,
//       178.3,
//       14406776 ] ],
//   collapse: null,
//   order: null,
//   database_id: 4922 }