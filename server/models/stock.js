import mongoose from 'mongoose'
const Schema = mongoose.Schema

const Stock = new Schema({
  date: Date,
  open: Number,
  high: Number,
  low: Number,
  close: Number,
  volume: Number,
  ex_dividend: Number,
  split_ratio: Number,
  adj_open: Number,
  adj_high: Number,
  adj_low: Number,
  adj_close: Number,
  adj_volume: Number,
  ticker: String,
  lastRefresh: Date,
  name: Number,
})

//   date: '2017-12-14',
//   open: 1045,
//   high: 1058.5,
//   low: 1043.11,
//   close: 1049.15,
//   volume: 1545616,
//   ex_dividend: 0,
//   split_ratio: 1,
//   adj_open: 1045,
//   adj_high: 1058.5,
//   adj_low: 1043.11,
//   adj_close: 1049.15,
//   adj_volume: 1545616,
//   ticker: 'GOOG',
//   lastRefresh: '2017-12-14',
//   name: 'Alphabet Inc' 