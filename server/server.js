import 'babel-polyfill'
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import mongoose from 'mongoose'
import Stock from './models/stock'
import User from './models/user'
import SourceMapSupport from 'source-map-support'
import StockService from './stock_service'

// TODO Add User Authentication and session management
// TODO Add recent searches specific to logged in users
// TODO Better error handling

SourceMapSupport.install()
const app = express()
const stockService = new StockService()

mongoose.connect('mongodb://localhost/stocktracker', {
  useMongoClient: true,
  autoIndex: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  poolSize: process.env.NODE_ENV === 'development' ? 2 : 10,
  promiseLibrary: global.Promise,
  bufferMaxEntries: 0
}).then((conn) => {
  console.log(`Database connected on port ${conn.port}`)
})

app.listen(8080, () => {
  console.log('Application started on port 8080')
})

app.use(express.static('static'))
app.use(bodyParser.json())
  
app.get('/api/stocks', (req, res) => {
  // TODO Implement filter
  res.json({message: "Not implemented"})
})

app.post('/api/stocks', (req, res) => {
  const ticker = req.body.ticker
  console.log('Not implemented')
})

app.get('/api/stocks/lookup/:ticker', (req, res) => {
  stockService.getLatestStockData(req.params.ticker, (data, err) => {
    if (err) return res.status(err.status).json({data: null, err: err.message})
    if (data) return res.json({data: data, err: null})
    return res.status(500).json({data: null, err: "Internal Server Error"})
  })
})

app.delete('/api/stocks/:ticker', (req, res) => {
  res.json({message: "Not implemented"})
})

app.post('/login', (req, res) => {
  if (!req.body.email) return res.status(400).json({message: "POST email is missing"})
  if (!req.body.password) return res.status(400).json({message: "POST password is missing"})
  User.findOne({email: req.body.email}).then((user, err) => {
    if (err) return res.status(500).json({message: err})
    if (!user) return res.status(422).json({message: "Could not find user"})
    user.comparePassword(req.body.password, (err, match) => {
      if (err) return res.status(500).json({message: "Could not authenticate user"})
      if (!match) return res.status(422).json({message: "Incorrect password"})
      return res.json({message: "Success"})
    })
  })
})

app.post('/signup', (req, res) => {
  if (!req.body.email) return res.status(400).json({message: "POST email is missing"})
  if (!req.body.password) return res.status(400).json({message: "POST password is missing"})
  User.findOne({email: req.body.email}).then((user, err) => {
    if (err) return res.status(500).json({message: err})
    if (user) return res.status(422).json({message: "User already exists"})
    const newUser = new User({email: req.body.email, password: req.body.password})
    newUser.save((err) => {
      if (err) return res.status(500).json({message: err})
      return res.json({message: 'success'})
    })
  })
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../static/index.html'))
})