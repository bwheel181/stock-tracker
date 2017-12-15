/*global fetch*/
import 'whatwg-fetch'
import classNames from 'classnames'
import React from 'react'
import { Panel, FormGroup, ControlLabel, InputGroup, FormControl, 
  Row, Col, Table, Button, ButtonToolbar } from 'react-bootstrap'
import { watchStockTimeout, tickerSearchTimeout } from '../server/config'

const idleSearchStateMessage = 'Start typing to search for a stock'

export default class StockFinder extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isFetching: false,
      watchFetchTimeoutId: undefined,
      searchFetchTimeoutId: undefined,
      tickerInputValue: '',
      wasLastSearchSuccess: undefined,
      searchErrMessage: idleSearchStateMessage,
      stock: null,
      
    }
    this.onClickWatch = this.onClickWatch.bind(this)
    this.handleSearchResponse = this.handleSearchResponse.bind(this)
    this.onTickerInputChange = this.onTickerInputChange.bind(this)
    this.getWatchButtonStyle = this.getWatchButtonStyle.bind(this)
  }
  
  handleSearchResponse(stock, err) {
    const wasLastSearchSuccess = !err
    const searchErrMessage = err || ''
    const isFetching = false
    this.setState({ stock, wasLastSearchSuccess, isFetching, searchErrMessage })
  }

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
                this.handleSearchResponse(null, json.err)
              } else {
                this.handleSearchResponse(json.data, null)
              }
            }).catch((err) => {
              this.handleSearchResponse(null, err)
            })
        } else {
          this.handleSearchResponse(null, idleSearchStateMessage)
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
  
  onClickWatch() {
    console.log("Not implemented")
  }
  
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
              wasLastSearchSuccess={this.state.wasLastSearchSuccess} 
              searchResMessage={this.state.searchErrMessage} 
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
          <th className="col-md-1">{props.wasLastSearchSuccess ? "Name" : ''}</th>
          <th className="col-md-1">{props.wasLastSearchSuccess ? "Open" : ''}</th>
          <th className="col-md-1">{props.wasLastSearchSuccess ? "Close" : ''}</th>
          <th className="col-md-1">{props.wasLastSearchSuccess ? "Low" : ''}</th>
          <th className="col-md-1">{props.wasLastSearchSuccess ? "High" : ''}</th>
          <th className="col-md-1">{props.wasLastSearchSuccess ? "Volume" : ''}</th>
        </tr>
      </thead>
      <StockDataTable 
        stock={props.stock} 
        wasLastSearchSuccess={props.wasLastSearchSuccess} 
        searchResMessage={props.searchResMessage}
      />
    </Table>
  )
}

const StockDataTable = (props) => {
  const classes = () => {
    return classNames({
      'green-font': props.stock.open < props.stock.close,
      'red-font': props.stock.open > props.stock.close,
      'white-font': props.stock.open === props.stock.close
    })
  }
  
  const emptyStyle = {
    fontSize: 25
  }
  
  if (props.wasLastSearchSuccess) {
    return (
      <tbody>
        <tr className={classes()}>
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
        <tr align="left"><td colspan="7">{props.searchResMessage}</td></tr>
      </tbody>
    )
  }
}
