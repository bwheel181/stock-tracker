import React from 'react'
import {Jumbotron, Button, ButtonToolbar} from 'react-bootstrap'
import {Link} from 'react-router-dom'

export default class Index extends React.Component {
  render() {
    return (
      <Jumbotron>
        <h1>Welcome to Stock Tracker</h1>
        <ButtonToolbar>
          <Link to="/signup">
            <Button bsStyle="primary" type="text" onClick={this.onSignupClick}>
              Sign up
            </Button>
          </Link>
          <Button bsStyle="primary" type="text" onClick={this.onSignupClick}>
            Learn More
          </Button>
        </ButtonToolbar>
      </Jumbotron>
    )
  }
}