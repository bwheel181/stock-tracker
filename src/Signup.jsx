import React from 'react'
import SubmitPanelForm from './SubmitPanelForm'


export default class Signup extends React.Component {
  constructor() {
    super()
    this.onError = this.onError.bind(this)
    this.onSuccess = this.onSuccess.bind(this)
    this.classNames = "shadow"
    this.labels = [
      {name: "email", id: "email", placeholder: "email", title: "Email", type: "text"},
      {name: "password", id: "password", placeholder: "password", title: "Password", type: "password"},
      {name: "confirm", id: "confirm", placeholder: "confirm", title: "Confirm", type: "password"},
    ]
  }
  
  onSuccess(data) {
    console.log(data)
  }
  
  onError(err) {
    console.log(err.message)
  }
  
  render() {
    return (
      <SubmitPanelForm 
        submitUrl="/signup"
        onSuccess={this.onSuccess}
        onError={this.onError}
        labels={this.labels} 
        header="Signup"
      />
    )
  }
}
