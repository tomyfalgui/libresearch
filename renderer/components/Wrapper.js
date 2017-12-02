import styled, { injectGlobal } from 'styled-components'
import React, { Component } from 'react'
import Reader from './Reader'
import Sine from './Sine'
import Header from './Header'
import Table from './Table'
import Filters from './Filters'
import { remote, ipcRenderer } from 'electron'
import matchSorter from 'match-sorter'

const Wrapper = styled.div`
  display: grid;
  max-height: 100vh;
  grid-template-rows: 50px 1fr 5fr;
  grid-row-gap: 12px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
`

const SpecialDiv = styled.div`
  display: flex;
`

export default class Global extends Component {
  state = {
    playing: false,
    rows: null,
    total_rows: null,
    totalTime: null
  }

  updateOrSaveToDatabase = data => () => {
    console.log(this.state)
    ipcRenderer.send('updateorsave:data', data)
    this.setState(
      state => ({ playing: !state.playing }),
      () => {
        console.log(this.state)

        global.setTimeout(() => {
          this.setState(
            state => ({ playing: !state.playing }),
            this.getDatabase
          )
        }, 1000)
      }
    )
  }

  getDatabase = async () => {
    const data = await remote.getGlobal('getData')()
    const { rows, total_rows } = data
    const totalTime = rows.reduce((acc, { doc }) => {
      if (doc.updated === true) {
        return acc + doc.total_time
      }
      return acc
    }, 0)
    this.setState({ rows, total_rows, totalTime }, () => {
      console.log(this.state)
    })
  }

  filter = (lrn, year, grade, month, time) => {
    const { rows } = this.state
    // try using filter lol
    // const LRNFILTER = matchSorter(rows, lrn, { keys: ['doc.LRN'] })
    // const YEARFILTER = matchSorter(rows, year, { keys: ['doc.date'] })
    // const GRADEFILTER = matchSorter(rows, grade, { keys: ['doc.LRN'] })
    // const MONTHFILTER = matchSorter(rows, month, { keys: ['doc.date'] })
    // const TIMEFILTER = matchSorter(rows, (+time / 1000).toFixed(0), {
    //   keys: ['doc.total_time']
    // })
    const search = rows.filter(({ doc }) => {
      //if()
      return doc.LRN.includes(lrn)
    })
    //console.log(search)
  }

  componentDidMount() {
    this.getDatabase()
  }

  render() {
    const { totalTime, rows, total_rows, playing } = this.state
    return (
      <Wrapper>
        <Header />
        <SpecialDiv>
          <Reader saveToDatabase={this.updateOrSaveToDatabase} />
          <Filters filter={this.filter} getDate={this.getDatabase} />
        </SpecialDiv>
        <Sine playing={playing} />
        <Table rows={rows} total_rows={total_rows} total_time={totalTime} />
      </Wrapper>
    )
  }
}

injectGlobal`
@import "/static/styles/fontStylesheet.css";

  html {
    box-sizing:border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering:optimizeLegibility;
    font-family: 'Lato',sans-serif;
  }

  *,
  *::before,
  *::after {
    box-sizing:inherit;
    margin:0;
    padding:0;
  }
  
 

`
