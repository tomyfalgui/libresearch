import React, { Component } from 'react'
import styled from 'styled-components'
import Export from './Export'

const DivBoy = styled.div``
const Input = styled.input`
  font-size: 16px;
  padding: 0.5em 0 0.3em 0.3em;
  margin-right: 6px;
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
        <Input
          type="text"
          placeholder="LRN"
          value={this.state.LRN}
          name="LRN"
          onChange={this.handleChange}
        />
        <Input
          type="text"
          placeholder="Year"
          value={this.state.year}
          name="year"
          onChange={this.handleChange}
        />
        <Input
          type="text"
          placeholder="Grade"
          value={this.state.grade}
          name="grade"
          onChange={this.handleChange}
        />
        <Input
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
        <div
          style={{
            marginTop: '0.5em'
          }}
        >
          <Button onClick={this.handleClick}>Filter</Button>
          <Button2 onClick={this.handleClear}>Clear Filters</Button2>
          <Export />
        </div>
      </DivBoy>
    )
  }
}

const Button = styled.button`
  background-color: #337ab7;
  border: 0;
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
  color: white;
`
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
