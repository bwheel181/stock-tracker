import 'babel-polyfill'
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import { MongoClient, ObjectId } from 'mongodb'
import SourceMapSupport from 'source-map-support'
import StockService from './stock_service'

// TODO Add User Authentication and session management
// TODO Add recent searches specific to logged in users
// TODO Better error handling

SourceMapSupport.install()
const app = express()
const stockService = new StockService()

let db
MongoClient.connect('mongodb://localhost/stocktracker').then((conn) => {
  db = conn
  app.listen(8080, () => {
    console.log('App started on port 8080')
  })
}).catch((err) => {
  console.log('ERROR: ', err)
})

app.use(express.static('static'))
app.use(bodyParser.json())
  
app.get('/api/stocks', (req, res) => {
  const filter = {}
  if (req.query.price_lte || req.query.price_gte) filter.price = {}
  if (req.query.price_lte) filter.adj_close.$lte = parseInt(req.query.price_lte, 10)
  if (req.query.price_gte) filter.adj_close.$gte = parseInt(req.query.price_gte, 10)
  db.collection('stocks').find(filter).toArray().then((stockList) => {
    const metadata = { total_count: stockList.length }
    res.json({metadata: metadata, stockList: stockList, error: null})
  })
    .catch((err) => {
      console.log(err)
      res.status(500).json({metadata: null, stockList: null, error: err})
    })
})

app.post('/api/stocks', (req, res) => {
  const ticker = req.body.ticker
  stockService.getStockData(ticker, ((stockData, err) => {
    if (err) {
      res.status(500).json({data: null, err: err})
      return
    }
    db.collection('stocks')
    .updateOne({
      ticker: {$regex: new RegExp(ticker, 'i')}}, 
      stockData, 
      {upsert: true})
    .then(updated => {
      res.json({data: stockData, err: null})
    })
    .catch(err => {
      res.status(500).json({data: null, err: 'Error'})
    })
  }))
})

app.delete('/api/stocks/:id', (req, res) => {
  console.log(req.params.id)
})

app.post('/login', (req, res) => {
  db.collection('users').find({email: req.body.email}).limit(1).next().then(user => {
    if (!user) {
      res.status(404).json({message: `User ${req.body.email} could not be found`, data: null})
      return
    }
    //Authenticate user and set up session
    res.json({message: "OK", data: {}})
  }).catch(err => {
    res.status(500).json({message: `Internal Server Error: ${err}`, data: null})
  })
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../static/index.html'))
})