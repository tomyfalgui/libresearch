import React, { Component } from 'react'
import { remote } from 'electron'
import styled from 'styled-components'

const Button2 = styled.div`
  display: inline-block;
  padding: 4px 16px;
  margin-bottom: 0;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  border-radius: 4px;
  color: #337ab7;
`

class Export extends Component {
  state = {}
  render() {
    return <Button2 onClick={this.props.export}>Export</Button2>
  }
}

export default Export
