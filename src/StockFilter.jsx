import React from 'react'
import { objectify } from '../util/QueryMutator'
import { Col, Row, FormGroup, FormControl, 
  ControlLabel, InputGroup, ButtonToolbar, Button } from 'react-bootstrap'

export default class StockFilter extends React.Component {
  constructor(props) {
    super()
    const initFilterObj = objectify(props.initFilter)
    this.state = {
      price_gte: initFilterObj.price_gte || '',
      price_lte: initFilterObj.price_lte || '',
      changed: false,
    }
    this.onChangePriceGte = this.onChangePriceGte.bind(this)
    this.onChangePriceLte = this.onChangePriceLte.bind(this)
    this.applyFilter = this.applyFilter.bind(this)
    this.clearFilter = this.clearFilter.bind(this)
    this.resetFilter = this.resetFilter.bind(this)
  }

  componentWillReceiveProps(newProps) {
    const initFilterObj = objectify(newProps.initFilter)
    this.setState({
      price_gte: initFilterObj.price_gte || '',
      price_lte: initFilterObj.price_lte || '',
      changed: false,
    })
  }

  onChangePriceGte(e) {
    const effortString = e.target.value
    if (effortString.match(/\d*\.?\d*$/)) {
      this.setState({ price_gte: e.target.value, changed: true })
    }
  }

  onChangePriceLte(e) {
    const effortString = e.target.value
    if (effortString.match(/\d*\.?\d*$/)) {
      this.setState({ price_lte: e.target.value, changed: true })
    }
  }

  applyFilter() {
    const newFilter = {}
    if (this.state.price_gte) newFilter.price_gte = this.state.price_gte
    if (this.state.price_lte) newFilter.price_lte = this.state.price_lte
    this.props.setFilter(newFilter)
  }

  clearFilter() {
    this.props.setFilter({})
  }

  resetFilter() {
    this.setState({
      price_gte: this.props.initFilter.price_gte || '',
      price_lte: this.props.initFilter.price_lte || '',
      changed: false,
    })
  }

  render() {
    return (
      <Row>
        <Col xs={6} sm={4} md={3} lg={3}>
          <FormGroup>
            <ControlLabel>Price</ControlLabel>
            <InputGroup>
              <FormControl value={this.state.price_gte} onChange={this.onChangePriceGte} />
              <InputGroup.Addon>-</InputGroup.Addon>
              <FormControl value={this.state.price_lte} onChange={this.onChangePriceLte} />
            </InputGroup>
          </FormGroup>
        </Col>
        <Col xs={6} sm={4} md={3} lg={3}>
          <FormGroup>
            <ControlLabel>&nbsp;</ControlLabel>
            <ButtonToolbar>
              <Button bsStyle="success" onClick={this.applyFilter}>Apply</Button>
              <Button bsStyle="info" onClick={this.resetFilter} disabled={!this.state.changed}>Reset</Button>
              <Button bsStyle="danger" onClick={this.clearFilter}>Clear</Button>
            </ButtonToolbar>
          </FormGroup>
        </Col>
      </Row>
    )
  }
}
