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
    time: ''
  }

  handleClick = e => {
    const { LRN, year, grade, month, time } = this.state

    this.props.filter(LRN, year, grade, month, time)
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
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
        <input
          type="text"
          placeholder="Time"
          value={this.state.time}
          name="time"
          onChange={this.handleChange}
        />
        <button onClick={this.handleClick}>Filter</button>
        <button onClick={this.props.getData}>Clear Filters</button>
      </DivBoy>
    )
  }
}
