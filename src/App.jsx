import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import StockList from './StockList'
import Login from './Login'
import Signup from './Signup'
import {Navbar, Nav, NavItem, NavDropdown, MenuItem, Glyphicon} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'

const Header = () => (
  <Navbar fluid>
    <Navbar.Header>
      <Navbar.Brand>Stock Tracker</Navbar.Brand>
    </Navbar.Header>
    <Nav>
      <LinkContainer to="/watcher">
        <NavItem>Watcher</NavItem>
      </LinkContainer>
      <LinkContainer to="/reports">
        <NavItem>Reports</NavItem>
      </LinkContainer>
    </Nav>
    <Nav pullRight>
      <NavItem><Glyphicon glyph="plus" /></NavItem>
      <NavDropdown id="user-dropdown" title={<Glyphicon glyph="option-horizontal" />}noCaret>
        <LinkContainer to="/login"><MenuItem>Login</MenuItem></LinkContainer>
        <LinkContainer to="/signup"><MenuItem>Sign up</MenuItem></LinkContainer>
        <MenuItem>Logout</MenuItem>
      </NavDropdown>
    </Nav>
  </Navbar>
)

const App = props => (
  <div>
    <Header />
    <div className="container-fluid">
      {props.children}
      <hr />
      <h5><small>
      Full source code available at this <a href="https://github.com/bwheel181/mern">
      Git Repository</a>
      </small></h5>
    </div>
  </div>
)

App.propTypes = {
  children: PropTypes.element.isRequired,
}

const RoutedApp = () => (
  <Router>
    <div>
      <App>
        <Switch>
          <Route exact path="/" component={StockList} />
          <Route path="/watcher" component={StockList} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
        </Switch>
      </App>
    </div>
  </Router>
)

ReactDOM.render(<RoutedApp />, document.getElementById('contents'))

if (module.hot) { module.hot.accept() }
