import React, { Component } from 'react'
import { remote } from 'electron'
import Table from './Table'

export default class TableWrapper extends Component {
  state = {
    rows: null,
    total_rows: null
  }
  getDatabase = async () => {
    const data = await remote.getGlobal('getData')()
    const { rows, total_rows } = data
    this.setState({ rows, total_rows })
  }

  componentDidMount() {
    this.getDatabase()
  }

  render() {
    return <Table />
  }
}
