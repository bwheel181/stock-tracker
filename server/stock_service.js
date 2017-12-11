import 'babel-polyfill'
import { apiKey } from './config'
const fetch = require('node-fetch')

// TODO Better error handling
// TODO More services?
// TODO Clean up code

class QuandlDataFetcher {
  constructor(date) {
    this.baseUrl = 'https://www.quandl.com/api/v3/datasets/WIKI/'
    this.date = date || new Date()
    this.dataParser = new QuandlDataParser()
  }
  
  getData(ticker, dataParser, done) {
    const month = this.date.getMonth()
    const day = this.date.getDate()
    const year = this.date.getFullYear()
    const datePart = `${year}-${month + 1}-${day}`
    console.log(`${this.baseUrl}${ticker}.json?rows=1&api_key=${apiKey}`)
    fetch(`${this.baseUrl}${ticker}.json?rows=1&api_key=${apiKey}`)
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
    console.log(data)
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