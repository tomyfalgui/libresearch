import React, { Component } from 'react'
import styled from 'styled-components'

const DivBoy = styled.div`
  align-self: center;
`

export default () => (
  <DivBoy>
    <input type="text" placeholder="LRN" />
    <input type="text" placeholder="Year" />
    <input type="text" placeholder="Grade" />
    <input type="text" placeholder="Month" />
    <input type="text" placeholder="Time" />
    <button>Filter</button>
  </DivBoy>
)
