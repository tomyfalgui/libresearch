import React, { Component } from 'react'
import { remote } from 'electron'

class Export extends Component {
  state = {}
  render() {
    return <button onClick={this.props.export}>Export</button>
  }
}

export default Export
