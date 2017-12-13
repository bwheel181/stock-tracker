import 'whatwg-fetch'
import React from 'react'
import StockFilter from './StockFilter'
import { stringify } from '../util/QueryMutator'
import { Glyphicon, Table, Panel } from 'react-bootstrap'
import StockFinder from './StockFinder'

export default class StockList extends React.Component {
  constructor() {
    super()
    this.state = { 
      stockList: [],
    }
    this.setFilter = this.setFilter.bind(this)
    this.deleteStock = this.deleteStock.bind(this)
    this.loadData = this.loadData.bind(this)
  }

  componentDidMount() {
    this.loadData()
  }

  componentDidUpdate(prevProps) {
    const oldQuery = prevProps.location.search
    const newQuery = this.props.location.search
    if (oldQuery === newQuery) {
      return
    }
    this.loadData()
  }

  setFilter(query) {
    const queryStr = stringify(query)
    this.props.history.push({ pathname: this.props.location.pathname, search: queryStr })
  }

  loadData() {
    console.log("Calling")
    fetch(`/api/stocks${this.props.location.search}`).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          if (data.err) {
            // TODO
          }
          this.setState({stockList: data.stockList})
        })
      }
    })
  }


  deleteStock(ticker) {
    console.error("Not implemented")
  }

  render() {
    return (
      <div>
        <Panel collapsible header="Filter">
          <StockFilter
            setFilter={this.setFilter}
            initFilter={this.props.location.search}
          />
        </Panel>
        <StockTable
          stocks={this.state.stockList}
          deleteStock={this.deleteStock}
        />
        <StockFinder onAddStock={this.loadData}/>
      </div>
    )
  }
}

const StockRow = (props) => {
  function onDeleteClick() {
    props.deleteStock(props.stock.ticker)
  }

  return (
    <tr className={props.stock.open > props.stock.close ? 'red-font' : 'green-font'}>
      <td>{props.stock.ticker}</td>
      <td>${props.stock.open.toFixed(2)}</td>
      <td>${props.stock.close.toFixed(2)}</td>
      <td>${props.stock.high.toFixed(2)}</td>
      <td>${props.stock.low.toFixed(2)}</td>
      <td>{props.stock.volume.toLocaleString()}</td>
      <td><button bssize="xsmall" onClick={onDeleteClick}><Glyphicon className="trash-icon" glyph="trash" /></button></td>
    </tr>
  )
}

function StockTable(props) {
  const stockRows = props.stocks.map(stock =>
    <StockRow key={stock._id} stock={stock} deleteStock={props.deleteStock} />)
  return (
    <Table bordered condensed hover responsive>
      <thead>
        <tr>
          <th>Ticker</th>
          <th>Open</th>
          <th>Close</th>
          <th>Low</th>
          <th>High</th>
          <th>Volume</th>
          <th />
        </tr>
      </thead>
      <tbody>{stockRows}</tbody>
    </Table>
  )
}
