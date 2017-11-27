import React, { Component } from 'react'

export default class Sine extends Component {
  constructor() {
    super()

    if (global.AudioContext) {
      this.audioCtx = new AudioContext()
      this.oscillator = this.audioCtx.createOscillator()
      this.gainNode = this.audioCtx.createGain()
      this.oscillator.connect(this.gainNode)
      this.gainNode.connect(this.audioCtx.destination)
      this.oscillator.type = 'sine'
      this.oscillator.frequency.value = 3000
      this.oscillator.start()
    }
  }

  playSound = () => {
    if (global.AudioContext) {
      if (!this.props.playing) {
        this.gainNode.disconnect(this.audioCtx.destination)
      } else {
        this.gainNode.connect(this.audioCtx.destination)
      }
    }
  }
  componentDidMount() {
    this.playSound()
  }
  componentWillUnmount() {
    if (global.AudioContext) {
      this.audioCtx.close()
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.playing !== this.props.playing) {
      this.playSound()
    } else {
      return
    }
  }
  render() {
    return null
  }
}
