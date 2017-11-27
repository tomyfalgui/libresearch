import React, { Component } from 'react'
import Reader from './Reader'
import { ipcRenderer } from 'electron'
import Sine from './Sine'
import { setTimeout } from 'timers'

class ReaderWrapper extends Component {
  state = {
    playing: false
  }

  updateOrSaveToDatabase = data => () => {
    console.log(this.state)
    ipcRenderer.send('updateorsave:data', data)
    this.setState(
      state => ({ playing: !state.playing }),
      () => {
        console.log(this.state)

        global.setTimeout(() => {
          this.setState(state => ({ playing: !state.playing }))
        }, 1000)
      }
    )
  }

  updateToDatabase = data => () => {}

  render() {
    return (
      <Wrapper>
        <Reader saveToDatabase={this.updateOrSaveToDatabase} />
        <Sine playing={this.state.playing} />
      </Wrapper>
    )
  }
}

export default ReaderWrapper

const Wrapper = ({ children }) => children
