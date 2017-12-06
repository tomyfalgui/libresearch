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
import uuid from 'uuid/v4'
import { getYoutubeLikeToDisplay } from '../helpers'
import matchSorter from 'match-sorter'
import { differenceInMilliseconds } from 'date-fns'

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

  deleteDocument = async doc => {
    remote.dialog.showMessageBox(
      {
        type: 'info',
        message: 'Delete?',
        detail: 'Are you sure you want to delete the table entry?',
        buttons: ['No', 'Yes']
      },
      async res => {
        if (res === 1) {
          const deleteDoc = await remote.getGlobal('delete')(doc)
          this.getDatabase()
        } else {
          console.log('NOPE')
        }
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
      rows = rows.filter(({ doc }) =>
        doc.date.toLowerCase().includes(month.toLowerCase())
      )
    }
    if (filter) {
      rows = rows.filter(({ doc }) => doc.updated === true)
    }
    const totalTime = rows.reduce((acc, { doc }) => {
      if (doc.updated === true) {
        return acc + doc.total_time
      }
      return acc
    }, 0)
    this.setState({ rows, totalTime })
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
    Object.keys(mapped_data).forEach(els => {
      let arr = mapped_data[els]

      arr = arr.map(({ doc }) => {
        let fixedDisplay = getYoutubeLikeToDisplay(doc.total_time)
        return {
          LRN: doc.LRN,
          date: doc.date,
          entered: new Date(doc.entered).toLocaleTimeString(),
          exited: doc.exited
            ? new Date(doc.exited).toLocaleTimeString()
            : 'NO EXIT',
          grade: doc.grade,
          display_total_time: fixedDisplay,
          total_time: doc.total_time
        }
      })
      /*
          Find a way to include total time per month at the 
          bottom most of the worksheet
        */

      const totol = arr.reduce(
        (acc, cur) => (cur.total_time ? cur.total_time + acc : acc),
        0
      )

      let ws = XLSX.utils.json_to_sheet([
        ...arr,
        { totol: getYoutubeLikeToDisplay(totol) }
      ])
      wb.SheetNames.push(els)
      wb.Sheets[els] = ws
    })

    const hash = uuid()
    XLSX.writeFile(wb, path.join(desktop, `${'datafile'}-${hash}.xlsx`), {
      bookType: 'xlsx'
    })
    remote.dialog.showMessageBox(null, {
      type: 'info',
      title: 'Saved File',
      message: `Data is saved in your desktop with filename: ${'datafile'}-${
        hash
      }.xlsx`
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
        <Table
          rows={rows}
          total_rows={total_rows}
          total_time={totalTime}
          deleteDoc={this.deleteDocument}
        />
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
