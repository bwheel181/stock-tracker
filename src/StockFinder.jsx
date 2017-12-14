/*global fetch*/
import 'whatwg-fetch'
import classNames from 'classnames'
import React from 'react'
import { Panel, FormGroup, ControlLabel, InputGroup, FormControl, 
  Row, Col, Table, Button, ButtonToolbar } from 'react-bootstrap'
import { watchStockTimeout, tickerSearchTimeout } from '../server/config'

export default class StockFinder extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isFetching: false,
      watchFetchTimeoutId: undefined,
      searchFetchTimeoutId: undefined,
      tickerInputValue: '',
      stock: null,
      wasLastSearchSuccess: undefined,
    }
    // this.onClickWatch = this.onClickWatch.bind(this)
    // this.handleWatchResponse = this.handleWatchResponse.bind(this)
    this.onTickerInputChange = this.onTickerInputChange.bind(this)
    this.handleSearchResponse = this.handleSearchResponse.bind(this)
    this.getWatchButtonStyle = this.getWatchButtonStyle.bind(this)
  }
  
  // handleWatchResponse(data, err) {
  //   clearTimeout(this.state.watchFetchTimeoutId)
  //   if (err) {
  //     // TODO
  //     return
  //   }
  //   this.setState({isFetching: false, tickerInputValue: ''})
  //   // TODO
  // }
  
  // handleTimeout() {
  //   // TODO
  // }
  
  handleSearchResponse(data) {
    if (data.err) {
      this.setState({stock: null, wasLastSearchSuccess: false})
      return
    }
    this.setState({stock: data.data, wasLastSearchSuccess: true})
  }

  onTickerInputChange(e) {
    clearTimeout(this.state.searchFetchTimeoutId)
    const searchString = e.target.value
    if (searchString.match(/\w*\.?\w*$/) && searchString.length < 6) {
      const t = setTimeout(() => {
        console.log("Searching for: ", this.state.tickerInputValue)
        this.setState({isFetching: true})
        if (this.state.tickerInputValue) {
          fetch(`/api/stocks/lookup/${searchString}`)
            .then((res) => {
              return res.json()
            }).then((json) => {
              this.handleSearchResponse(json)
              this.setState({isFetching: false})
            }).catch((err) => {
              // TODO
              this.setState({isFetching: false})
              console.log(err)
            })
        } else {
          this.setState({isFetching: false, stock: null, wasLastSearchSuccess: undefined})
        }
      }, tickerSearchTimeout)
      this.setState({searchFetchTimeoutId: t, tickerInputValue: searchString})
    }
  }
  
  getWatchButtonStyle() {
    switch(this.state.wasLastSearchSuccess) {
      case true:
        return 'success'
      case false:
        return 'danger'
      default:
        return 'info'
    }
  }
  
  // onClickWatch() {
  //   clearTimeout(this.state.watchFetchTimeoutId)
  //   const ticker = this.stockWatch.value
  //   const t = setTimeout(this.handleTimeout, watchStockTimeout)
  //   this.setState({isFetching: true, watchFetchTimeoutId: t})
    
  //   fetch('/api/stocks', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ ticker }),
  //   }).then((response) => {
  //     response.json().then((parsedRes) => {
  //       this.handleWatchResponse(parsedRes.data, parsedRes.err)
  //     })
  //   }).catch((err) => {
  //     this.handleWatchResponse(null, `Network Error: ${err}`)
  //   })
  // }
  
  render() {
    const tickerInputStyle = { width: 76 }
    return (
      <Panel header="Stock Finder">
        <Row>
          <Col xs={2} sm={2} md={2} lg={2}>
            <FormGroup>
              <ControlLabel>Ticker</ControlLabel>
                <InputGroup>
                  <FormControl 
                    style={tickerInputStyle}
                    onChange={this.onTickerInputChange}
                    value={this.state.tickerInputValue}
                    placeholder="aapl" 
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <ButtonToolbar>
                  <Button 
                    bsStyle={this.getWatchButtonStyle()} 
                    onClick={this.onClickWatch}
                    disable={this.state.wasLastSearchSuccess ? "true" : "false"}>
                      Watch
                  </Button>
                </ButtonToolbar>
              </FormGroup>
          </Col>
          <Col >
            <StockInfo stock={this.state.stock} />
          </Col>
        </Row>
      </Panel>
    )
  }
}

const StockInfo = (props) => {
  
  const classes = () => {
    if (!props.stock) {
      return classNames({'white-font': true}) 
    }
    return classNames({
      'green-font': props.stock.open < props.stock.close,
      'red-font': props.stock.open > props.stock.close,
      'white-font': props.stock.open === props.stock.close
    })
  } 
  
  return(
    <Table responsive condensed>
      <thead>
        <tr>
          <th className="col-md-1">Ticker</th>
          <th className="col-md-1">Last</th>
          <th className="col-md-1">Open</th>
          <th className="col-md-1">Close</th>
          <th className="col-md-1">Low</th>
          <th className="col-md-1">High</th>
          <th className="col-md-1">Volume</th>
        </tr>
      </thead>
      <tbody>
        <tr className={classes()}>
          <td>{props.stock ? props.stock.ticker : '--'}</td>
          <td>{props.stock ? props.stock.lastRefresh : '--'}</td>
          <td>{props.stock ? `$${props.stock.open.toFixed(2)}` : "$0.00"}</td>
          <td>{props.stock ? `$${props.stock.close.toFixed(2)}` : "$0.00"}</td>
          <td>{props.stock ? `$${props.stock.high.toFixed(2)}` : "$0.00"}</td>
          <td>{props.stock ? `$${props.stock.low.toFixed(2)}` : "$0.00"}</td>
          <td>{props.stock ? props.stock.volume.toLocaleString() : 0}</td>
        </tr>
      </tbody>
    </Table>
  )

}
