import 'babel-polyfill'
import express from 'express'
import { port, sessionSecret, jwtExp } from './config'
import bodyParser from 'body-parser'
import path from 'path'
import verifyToken from './verify_token'
import mongoose from 'mongoose'
import Stock from './models/stock'
import User from './models/user'
import jwt from 'jsonwebtoken'
import SourceMapSupport from 'source-map-support'
import StockService from './stock_service'

// TODO Add User Authentication and session management
// TODO Add recent searches specific to logged in users
// TODO Better error handling

const app = express()
const stockService = new StockService()

SourceMapSupport.install()
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

app.listen(port, () => {
  console.log('Application started on port ', port)
})

app.use(express.static('static'))

app.use(bodyParser.json())
  
app.get('/api/stocks', verifyToken, (req, res) => {
  // TODO Implement filter
  res.json({message: "Not implemented"})
})

app.post('/api/stocks', verifyToken, (req, res) => {
  const ticker = req.body.ticker
  User.findOne({email: req.body.email}).then((err, user) => {
    if (user) {
      // TODO
    }
  })
})

app.get('/api/stocks/lookup/:ticker', verifyToken, (req, res) => {
  stockService.getLatestStockData(req.params.ticker, (data, err) => {
    if (err) return res.status(err.status).json({data: null, err: err.message})
    if (data) return res.json({data: data, err: null})
    return res.status(500).json({data: null, err: "Internal Server Error"})
  })
})

app.delete('/api/stocks/:ticker', verifyToken, (req, res) => {
  res.json({message: "Not implemented"})
})

app.post('/login', (req, res) => {
  if (!req.body.email) return res.status(400).json({message: "POST email is missing"})
  if (!req.body.password) return res.status(400).json({message: "POST password is missing"})
  User.findOne({email: req.body.email}).then((user) => {
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (err) return res.status(400).json({message: err.toString()})
      if (!isMatch) return res.status(401).json({auth: false, token: null})
      const token = jwt.sign({email: user.email}, sessionSecret, {expiresIn: jwtExp})
      return res.json({auth: true, token: token})
    })
  }).catch((err) => {
    res.status(500).json({message: err.toString()})
  })
})

app.post('/signup', (req, res) => {
  if (!req.body.email) return res.status(400).json({message: "POST email is missing"})
  if (!req.body.password) return res.status(400).json({message: "POST password is missing"})
  User.findOne({email: req.body.email}).then((user) => {
    if (user) {
      res.status(404).json({message: "User already exists"})
      return
    }
  }).catch((err) => {
    res.status(500).json({message: err.toString()})
    return
  })
  const user = new User({email: req.body.email, password: req.body.password})
  user.save().then((saved) => {
    const token = jwt.sign({ email: saved.email }, sessionSecret, { expiresIn: jwtExp })
    res.json({ auth: true, token: token })
  }).catch((err) => {
    res.status(500).json({message: err.toString()})
  })
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../static/index.html'))
})