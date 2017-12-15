/*global fetch */
import 'whatwg-fetch'
import React from 'react'
import SubmitPanelForm from './SubmitPanelForm'


export default class Login extends React.Component {
  constructor() {
    super()
  }
  
  onSuccess(data) {
    console.log(data)
  }
  
  onError(err) {
    console.log(err.message)
  }
  
  render() {
    return (
      <LoginPanel submitUrl="/login" onSuccess={this.onSuccess} onError={this.onError} />
    )
  }
}

const LoginPanel = (props) => {
  const classNames = "shadow"
  const labels = [
    {name: "email", id: "email", placeholder: "email", title: "Email", type: "text"},
    {name: "password", id: "password", placeholder: "password", title: "Password", type: "password"},
  ]
  const buttons = [
    {id: "signup", style: "info", type: "button", onClick: props.onSignupClick, name: "Signup"},  
  ]
  return (
    <SubmitPanelForm 
      submitUrl={props.submitUrl}
      onSuccess={props.onSuccess}
      onError={props.onError}
      labels={labels} 
      extraButtons={buttons}
      header="Login"
    />
  )
}
