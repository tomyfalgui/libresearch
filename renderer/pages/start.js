import React, { Component } from 'react'
import Reader from '../components/ScannerWrapper'
import Table from '../components/TableWrapper'
import Wrapper from '../components/Wrapper'
import Header from '../components/Header'

import path from 'path'

export default class Start extends Component {
  render() {
    return (
      <Wrapper>
        <Header />
        <Reader />
        <Table />
      </Wrapper>
    )
  }
}
