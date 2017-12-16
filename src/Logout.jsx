/*global fetch */
import 'whatwg-fetch'
import React from 'react'

export default class Logout extends React.Component {
  constructor(props) {
    super(props)
  }
  componentWillMount() {
    fetch('/logout').then((response) => {
      console.log("CALLING")
      if (response.ok) {
        console.log('logged out')
      } else {
        console.error('Error logging out!')
      }
    })
  }
  
  render() {
    return null
  }
}