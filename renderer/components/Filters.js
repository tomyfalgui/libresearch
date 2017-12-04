import React, { Component } from 'react'
import styled from 'styled-components'

const DivBoy = styled.div`
  align-self: center;
`

export default class extends Component {
  state = {
    LRN: '',
    year: '',
    grade: '',
    month: '',
    filter: false
  }

  handleClick = e => {
    const { LRN, year, grade, month, filter } = this.state

    this.props.filter(LRN, year, grade, month, filter)
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleCheck = e => {
    this.setState(state => ({ filter: !state.filter }))
  }

  handleClear = e => {
    this.props.getData()
    this.setState({
      LRN: '',
      grade: '',
      year: '',
      month: '',
      filter: false
    })
  }

  render() {
    return (
      <DivBoy>
        <input
          type="text"
          placeholder="LRN"
          value={this.state.LRN}
          name="LRN"
          onChange={this.handleChange}
        />
        <input
          type="text"
          placeholder="Year"
          value={this.state.year}
          name="year"
          onChange={this.handleChange}
        />
        <input
          type="text"
          placeholder="Grade"
          value={this.state.grade}
          name="grade"
          onChange={this.handleChange}
        />
        <input
          type="text"
          placeholder="Month"
          value={this.state.month}
          name="month"
          onChange={this.handleChange}
        />
        <label>
          Updated
          <input
            type="checkbox"
            placeholder="Time"
            onChange={this.handleCheck}
            checked={this.state.filter}
          />
        </label>
        <button onClick={this.handleClick}>Filter</button>
        <button onClick={this.handleClear}>Clear Filters</button>
      </DivBoy>
    )
  }
}
