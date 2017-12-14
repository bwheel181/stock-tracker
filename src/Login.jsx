import 'whatwg-fetch'
import React from 'react'
import { Panel, FormControl, Form, ControlLabel, FormGroup, Col, Button } from 'react-bootstrap'

export default class Login extends React.Component {
  constructor() {
    super()
    
    this.onSignupClick = this.onSignupClick.bind(this)
    this.onLoginSubmit = this.onLoginSubmit.bind(this)
  }
  
  onSignupClick(e) {
    console.log("Not implemented")
  }
  
  onLoginSubmit(e) {
    e.preventDefault()
    const password = this.password.value
    const email = this.email.value
    console.log(password, email)
    fetch('/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, password})
    }).then(response => {
      if (response.ok) {
        response.json().then(authData => {
          console.log(authData)
        }).catch(err => {
          console.log(`Parse Error: ${err}`)
        })
      } else {
        response.json().then(err => {
          console.log(err)
        })
      }
    }).catch(err => {
      console.log(`Network Error: ${err}`)
    })
  }
  
  render() {
    return (
      <Panel className="login-panel shadow" header="Login">
        <form onSubmit={this.onLoginSubmit}>
          <Form horizontal>
            <FormGroup controlId="email">
              <Col componentClass={ControlLabel} sm={1}>Email</Col>
              <Col sm={10}>
                <FormControl 
                  type="email" 
                  placeholder="email"
                  inputRef={node => this.email = node}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="password">
              <Col componentClass={ControlLabel} sm={1}>Password</Col>
              <Col sm={10}>
                <FormControl 
                  type="password" 
                  placeholder="password"
                  inputRef={node => this.password = node}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={1} sm={10}>
                <Button bsStyle="success" type="submit">Submit</Button>
              </Col>
            </FormGroup>
          </Form>
        </form>
      </Panel>  
    )
  }
}