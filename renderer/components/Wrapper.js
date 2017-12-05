import styled, { injectGlobal } from 'styled-components'
import React, { Component } from 'react'
import Reader from './Reader'
import Sine from './Sine'
import Header from './Header'
import Table from './Table'
import Filters from './Filters'
import { remote, ipcRenderer } from 'electron'
import * as XLSX from 'xlsx'
import Export from './Export'
import _ from 'lodash'
import path from 'path'
import { getYoutubeLikeToDisplay } from '../helpers'

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
    this.setState({ rows, total_rows, totalTime })
  }

  filter = (lrn, year, grade, month, filter) => {
    let rows = [...this.state.rows]

    if (lrn) {
      rows = rows.filter(({ doc }) => doc.LRN.includes(lrn))
    }
    if (year) {
      rows = rows.filter(({ doc }) => doc.date.includes(year))
    }
    if (grade) {
      rows = rows.filter(({ doc }) => doc.grade.includes(grade))
    }
    if (month) {
      rows = rows.filter(({ doc }) => doc.date.includes(month.toLowerCase()))
    }
    if (filter) {
      rows = rows.filter(({ doc }) => doc.updated === true)
    }
    this.setState({ rows })
  }

  export = e => {
    const desktop = remote.app.getPath('desktop')
    const wb = { SheetNames: [], Sheets: {} }

    const mapped_data = _.groupBy(this.state.rows, function(el) {
      const { doc } = el
      let { date } = doc
      date = date.split(' ')
      return `${date[1].toLowerCase()}${date[3]}`
    })

    let array = []
    let i = 0
    for (let value of Object.keys(mapped_data)) {
      for (let obj of mapped_data[value]) {
        array[i++] = obj.doc
      }
    }

    array = array.map(el => {
      return {
        LRN: el.LRN,
        date: el.date,
        entered: new Date(el.entered).toLocaleTimeString(),
        exited: el.exited
          ? new Date(el.exited).toLocaleTimeString()
          : 'NO EXIT',
        grade: el.grade,
        total_time: getYoutubeLikeToDisplay(el.total_time)
      }
    })

    var ws = XLSX.utils.json_to_sheet(array, {
      header: ['LRN', 'date', 'entered', 'exited', 'grade', 'total_time']
    })

    wb.SheetNames.push('hehe')
    wb.Sheets['hehe'] = ws
    XLSX.writeFile(
      wb,
      path.join(desktop, `${'niggakids'}-${Date.now()}.xlsx`),
      {
        bookType: 'xlsx'
      }
    )
    remote.dialog.showMessageBox(null, {
      type: 'info',
      title: 'Saved File',
      message: `Data is saved in ${'niggakids'}-${Date.now()}.xlsx`
    })
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
          <div>
            <Filters filter={this.filter} getData={this.getDatabase} />
            <Export export={this.export} />
          </div>
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
