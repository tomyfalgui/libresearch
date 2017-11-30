import styled, { injectGlobal } from 'styled-components'
import React, { Component } from 'react'
import Reader from './Reader'
import Sine from './Sine'
import Header from './Header'
import Table from './Table'
import Filters from './Filters'
import { remote, ipcRenderer } from 'electron'

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
    total_rows: null
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
    this.setState({ rows, total_rows })
  }

  componentDidMount() {
    this.getDatabase()
  }

  render() {
    return (
      <Wrapper>
        <Header />
        <SpecialDiv>
          <Reader saveToDatabase={this.updateOrSaveToDatabase} />
          <Filters />
        </SpecialDiv>
        <Sine playing={this.state.playing} />
        <Table rows={this.state.rows} total_rows={this.state.total_rows} />
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
