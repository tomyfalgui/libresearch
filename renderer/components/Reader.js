import React, { Component } from 'react'
import QrReader from 'react-qr-reader'
import { func } from 'prop-types'

export default class Scanner extends Component {
  static propTypes = {
    saveToDatabase: func.isRequired
  }

  state = {
    delay: 1000,
    result: 'No Result'
  }

  handleScan = result => {
    if (result) {
      this.setState({ result }, () => {
        this.props.saveToDatabase(this.state.result)()
      })
    }
  }

  handleError(err) {
    console.error(err)
  }

  render() {
    const previewStyle = {
      height: 360,
      width: 360
    }

    return (
      <div>
        <QrReader
          delay={this.state.delay}
          style={previewStyle}
          onError={this.handleError}
          onScan={this.handleScan}
        />
        {this.state.result}
      </div>
    )
  }
}