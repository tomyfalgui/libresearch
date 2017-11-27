import React, { Component } from 'react'
import Reader from '../components/ScannerWrapper'
import Wrapper from '../components/Wrapper'
import Header from '../components/Header'

import path from 'path'

export default class Start extends Component {
  render() {
    return (
      <Wrapper>
        <Header />
        <Reader />
      </Wrapper>
    )
  }
}
