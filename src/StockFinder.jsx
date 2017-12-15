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
      wasLastSearchSuccess: undefined,
      searchErrMessage: 'Start typing to search for a stock',
      stock: null,
      
    }
    // this.onClickWatch = this.onClickWatch.bind(this)
    this.onTickerInputChange = this.onTickerInputChange.bind(this)
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

  onTickerInputChange(e) {
    clearTimeout(this.state.searchFetchTimeoutId)
    const searchString = e.target.value
    if (searchString.match(/\w*\.?\w*$/) && searchString.length <= 5) {
      const t = setTimeout(() => {
        console.log("Searching for: ", this.state.tickerInputValue)
        this.setState({isFetching: true})
        if (this.state.tickerInputValue) {
          fetch(`/api/stocks/lookup/${searchString}`)
            .then((res) => {
              return res.json()
            }).then((json) => {
              if (json.err) {
                this.setState({
                  stock: null,
                  wasLastSearchSuccess: false,
                  isFetching: false,
                  searchErrMessage: json.err,
                })
              } else {
                this.setState({
                  stock: json.data, 
                  wasLastSearchSuccess: true, 
                  isFetching: false,
                  searchErrMessage: '',
                }) 
              }
            }).catch((err) => {
              this.setState({
                stock: null, 
                wasLastSearchSuccess: false, 
                isFetching: false,
                searchErrMessage: err,
              })
            })
        } else {
          this.setState({
            stock: null, 
            wasLastSearchSuccess: false, 
            isFetching: false,
            searchErrMessage: 'Start typing to search for a stock',
          })
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
        return 'danger'
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
            <StockInfo 
              stock={this.state.stock} 
              searchSuccess={this.state.wasLastSearchSuccess} 
              errMessage={this.state.searchErrMessage} 
            />
          </Col>
        </Row>
      </Panel>
    )
  }
}

const StockInfo = (props) => {
  return(
    <Table responsive condensed>
      <thead>
        <tr>
          <th className="col-md-1">{props.stock ? "Ticker" : ''}</th>
          <th className="col-md-1">{props.stock ? "Name" : ''}</th>
          <th className="col-md-1">{props.stock ? "Open" : ''}</th>
          <th className="col-md-1">{props.stock ? "Close" : ''}</th>
          <th className="col-md-1">{props.stock ? "Low" : ''}</th>
          <th className="col-md-1">{props.stock ? "High" : ''}</th>
          <th className="col-md-1">{props.stock ? "Volume" : ''}</th>
        </tr>
      </thead>
      <StockDataTable 
        stock={props.stock} 
        searchSuccess={props.searchSuccess} 
        errMessage={props.errMessage}
      />
    </Table>
  )
}

const StockDataTable = (props) => {
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
  
  const emptyStyle = {
    fontSize: 25
  }
  
  if (props.searchSuccess) {
    return (
      <tbody>
        <tr className={classes()}>
          <td>{props.stock.ticker }</td>
          <td>{ props.stock.name }</td>
          <td>{`$${props.stock.open.toFixed(2)}`}</td>
          <td>{`$${props.stock.close.toFixed(2)}`}</td>
          <td>{`$${props.stock.high.toFixed(2)}`}</td>
          <td>{`$${props.stock.low.toFixed(2)}`}</td>
          <td>{props.stock.volume.toLocaleString()}</td>
        </tr>
      </tbody>    
    )      
  } else {
    return (
      <tbody style={emptyStyle}>
        <tr align="left"><td colspan="7">{props.errMessage}</td></tr>
      </tbody>
    )
  }
}
