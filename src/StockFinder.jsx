import 'whatwg-fetch'
import React from 'react'
import { Panel, FormGroup, ControlLabel, InputGroup, FormControl, 
  Row, Col, Table, Button, ButtonToolbar } from 'react-bootstrap'

export default class StockFinder extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentStockValues: {
        ticker: '--',
        open: 0,
        high: 0,
        low: 0,
        close: 0,
        volume: 0, 
      },
      watchButton: {
        title: 'Watch',
        style: 'primary'
      },
      currentState: 'idle'
    }
    this.onClickWatch = this.onClickWatch.bind(this)
    this.resetWatchButton = this.resetWatchButton.bind(this)
    this.setWatchWorking = this.setWatchWorking.bind(this)
    this.timeoutId = undefined
  }
  
  setWatchFeedback(err, data) {
    let watchStyle
    let watchTitle
    let currentState
    this.timeoutId = setTimeout(this.resetWatchButton, 1500)
    if (err) {
      watchStyle = 'danger'
      watchTitle = err
      currentState = 'error'
    } else {
      watchStyle = 'success'
      watchTitle = 'Success!'
      currentState = 'success'
    }
    this.setState({
      watchButton: {
        style: watchStyle,
        title: watchTitle,
      },
      currentStockValues: {
          ticker: data ? data.ticker : 'Err',
          open: data ? data.adj_open : 'Err',
          high: data ? data.adj_high : 'Err',
          low: data ? data.adj_low : 'Err',
          close: data ? data.adj_close : 'Err',
          volume: data ? data.adj_volume : 'Err',
      },
      currentState: currentState,
    })
  }
  
  setWatchWorking() {
    this.setState({
      watchButton: {
        style: 'default',
        title: 'Working...',
      },
      currentState: 'working'
    })
  }
  
  resetWatchButton() {
    this.setState({
      watchButton: {
        style: 'primary',
        title: 'Watch',
      },
      currentState: 'idle'
    })
  }
  
  onClickWatch() {
    clearTimeout(this.timeoutId)
    if (this.state.currentState === 'working') {
      return
    }
    this.setWatchWorking()
    const ticker = this.stockWatch.value
    fetch('/api/stocks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ticker: ticker}),
    }).then((response) => {
      response.json().then(parsedRes => {
        this.setWatchFeedback(parsedRes.err, parsedRes.data)
      })
    })
    .catch(err => {
      this.setWatchFeedback("Net Error", null)
    })
  }
  
  render() {
    return (
      <Panel header="Stock Finder">
        <Row>
          <Col xs={6} sm={4} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>Ticker</ControlLabel>
                <InputGroup>
                  <FormControl 
                    placeholder="aapl" 
                    inputRef={node => this.stockWatch = node}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <ButtonToolbar>
                  <Button 
                    bsStyle={this.state.watchButton.style} 
                    onClick={this.onClickWatch}>
                      {this.state.watchButton.title}
                  </Button>
                </ButtonToolbar>
              </FormGroup>
          </Col>
          <Col >
            <StockInfo 
              ticker={this.state.currentStockValues.ticker}
              open={this.state.currentStockValues.open}
              high={this.state.currentStockValues.high}
              low={this.state.currentStockValues.low}
              close={this.state.currentStockValues.close}
              volume={this.state.currentStockValues.volume}
            />
          </Col>
        </Row>
      </Panel>
    )
  }
}

const StockInfo = (props) => (
    <Table responsive striped bordered condensed hover>
      <thead>
        <tr>
          <th>Ticker</th>
          <th>Open</th>
          <th>Close</th>
          <th>Low</th>
          <th>High</th>
          <th>Volume</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className={props.open > props.close ? 'red-font' : 'green-font'}>{props.ticker}</td>
          <td>{props.open.toFixed(2)}</td>
          <td className={props.open > props.close ? 'red-font' : 'green-font'}>{props.close.toFixed(2)}</td>
          <td>{props.high.toFixed(2)}</td>
          <td>{props.low.toFixed(2)}</td>
          <td>{props.volume.toLocaleString()}</td>
        </tr>
      </tbody>
    </Table>
)
