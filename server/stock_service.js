import 'babel-polyfill'
const fetch = require('node-fetch')

// TODO Error handling

class QuandlDataFetcher {
  constructor(date) {
    this.apiKey = 'Z6ujeVLxHPsv4Ec_Zw7f'
    this.baseUrl = 'https://www.quandl.com/api/v3/datasets/WIKI/'
    this.date = date || new Date()
    this.dataParser = new QuandlDataParser()
  }
  
  getData(ticker, dataParser, done) {
    const month = this.date.getMonth()
    const day = this.date.getDate()
    const year = this.date.getFullYear()
    const datePart = `${year}-${month + 1}-${day - 3}`
    fetch(`${this.baseUrl}${ticker}.json?&start_date=${datePart}&end_date=${datePart}&api_key=${this.apiKey}`)
    .then(response => {
      const timeoutID = setTimeout(() => {
        dataParser.parseData(null, done, 'Timeout')
        return
      }, 3000)
      let err = null
      if (!response.ok) {
        err = 'Bad Symbol'
      }
      response.json().then(jsonData => {
        dataParser.parseData(jsonData, done, err)
        clearTimeout(timeoutID)
      })

    })
  }
}

class QuandlDataParser {
  parseData(data, done, err) {
    if (!data || err) {
      done(null, err)
      return
    }
    
    const dataValues = data.dataset.data[0]
    const dataKeys = data.dataset.column_names
    const obj = {}
    obj.lastRefreshed = new Date()
    for (let i = 0; i < dataKeys.length; i++) {
      let key = dataKeys[i]
      key = key.replace('.', '').replace('-', '_').replace(' ', '_').toLowerCase()
      const value = dataValues[i]
      obj[key] = value
      obj.ticker = data.dataset.dataset_code
    }
    if (!obj) {
      err = 'Bad Symbol'
    }
    done(obj, err)
  }
}


export default class StockService {
  constructor() {
    this.dataFetcher = new QuandlDataFetcher()
    this.dataParser = new QuandlDataParser()
  }
  
  getStockData(ticker, done) {
    this.dataFetcher.getData(ticker, this.dataParser, done)
  }
}