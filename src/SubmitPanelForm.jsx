/*global fetch */
import 'whatwg-fetch'
import React from 'react'
import { Panel, FormControl, Form, ControlLabel, 
  FormGroup, Col, Button, ButtonToolbar } from 'react-bootstrap'

// TODO Fix the nested form here. OnSumbmit doesn't work with react-bootstrap Form

const defaultStyle = {
  maxWidth: 300,
  
}

export default class SubmitPanelForm extends React.Component {
  constructor(props) {
    super(props)
    
    this.onSubmit = this.onSubmit.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
    this.style = Object.assign(defaultStyle, this.props.style)
    this.labels = this.props.labels.map(label =>
      <FormLabel 
        key={label.id} 
        id={label.id} 
        name={label.name}
        title={label.title}
        placeholder={label.placeholder}
        onInputChange={this.onInputChange}
      />
    )
    this.buttons = []
    if (this.props.extraButtons) {
      this.buttons = this.props.extraButtons.map(button =>
        <Button 
          key={button.id} 
          id={button.id} 
          bsStyle={button.style}
          type={button.type} 
          onClick={button.onClick}>
            {button.name}
        </Button>
      )    
    }
  }
  
  onInputChange(inputId, value) {
    const obj = Object.assign({}, this.state)
    obj[inputId] = value
    this.setState(obj)
  }
  
  onSubmit(e) {
    e.preventDefault()
    fetch(this.props.submitUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(this.state),
    }).then((response) => {
      if (response.ok) {
        response.json().then((error) => this.props.onError(error))
      } else {
        response.json().then((success) => this.props.onSuccess(success))
      }
    })
  }
  
  render() {
    return (
      <Panel className={this.props.classNames} header={this.props.header} style={this.style}>
        <form onSubmit={this.onSubmit}>
          <Form horizontal>
            {this.labels}
            <FormGroup>
              <Col md={12}>
                <ButtonToolbar>
                  <Button bsStyle="success" type="submit">Submit</Button>
                  {this.buttons}
                </ButtonToolbar>
              </Col>
            </FormGroup>
          </Form>
        </form>
      </Panel>
    ) 
  }
}

const FormLabel = (props) => {
  const onChange = (e) => {
    props.onInputChange(props.id, e.target.value)  
  }
  
  return (
    <FormGroup controlId={props.id}>
      <Col md={1} componentClass={ControlLabel}>{props.title}</Col>
      <Col md={11}>
        <FormControl 
          name={props.name}
          onChange={onChange}
          type={props.labelType} 
          placeholder={props.placeholder}
        />
      </Col>
    </FormGroup>
  )
}