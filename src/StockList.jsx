import 'whatwg-fetch'
import React from 'react'
import StockFilter from './StockFilter'
import { stringify } from '../util/QueryMutator'
import { Glyphicon, Table, Panel } from 'react-bootstrap'

export default class StockList extends React.Component {
  constructor() {
    super()
    this.state = { 
      stockList: [],
    }
    this.setFilter = this.setFilter.bind(this)
    this.deleteStock = this.deleteStock.bind(this)
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
    // fetch(`/api/issues${this.props.location.search}`).then((response) => {
    //   if (response.ok) {
    //     response.json().then((data) => {
    //       console.log('Total count of records:', data._metadata.total_count) // eslint-disable-line
    //       data.records.forEach((issue) => {
    //         issue.created = new Date(issue.created)
    //         if (issue.completionDate) issue.completionDate = new Date(issue.completionDate)
    //       })
    //       this.setState({ issues: data.records })
    //     })
    //   } else {
    //     response.json().then((error) => {
    //       this.showError(`Failed to fetch issues: ${error.message}`)
    //     })
    //   }
    // }).catch((err) => {
    //   this.showError(`Error in fetching data from server: ${err}`)
    // })
  }


  deleteStock(ticker) {
    // TODO
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
          deleteStock={this.deleteIssue}
        />
      </div>
    )
  }
}

const StockRow = (props) => {
  function onDeleteClick() {
    props.deleteStock(props.stock.ticker)
  }

  return (
    <tr>
      <td>{props.stock.ticker}</td>
      <td>{props.stock.open}</td>
      <td>{props.stock.high}</td>
      <td>{props.stock.low}</td>
      <td>{props.stock.close}</td>
      <td>{props.stock.volume}</td>
      <td><button bssize="xsmall" onClick={onDeleteClick}><Glyphicon glyph="trash" /></button></td>
    </tr>
  )
}

function StockTable(props) {
  const stockRows = props.stocks.map(stock =>
    <StockRow key={stock._id} stock={stock} deleteIssue={props.deleteStock} />)
  return (
    <Table bordered condensed hover responsive>
      <thead>
        <tr>
          <th>Ticker</th>
          <th>Open</th>
          <th>High</th>
          <th>Low</th>
          <th>Close</th>
          <th>Volume</th>
          <th />
        </tr>
      </thead>
      <tbody>{stockRows}</tbody>
    </Table>
  )
}
