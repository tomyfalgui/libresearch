import _ from 'lodash'
import styled from 'styled-components'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { differenceInMilliseconds, differenceInSeconds } from 'date-fns'
import { secondsToHms, getYoutubeLikeToDisplay } from '../helpers'
import React from 'react'
const Fragment = React.Fragment

const Table = styled.table`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-top: 30px;
  height: 0;

  thead {
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
  }
`

const Header = styled.tr`
  display: flex;
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 24px;
  .theader {
    flex: 1;
    text-align: left;
    font-weight: 300;
    text-transform: uppercase;
    font-size: 16px;
    letter-spacing: 0.5px;
    &--2 {
      flex: 2;
    }
  }
`

const Body = styled.tr`
  padding-left: 24px;
  display: flex;
  padding-top: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.18);
  padding-bottom: 16px;
  position: relative;

  .tcell {
    flex: 1;
    text-align: left;

    &--2 {
      flex: 2;
    }
  }
`

const Footer = styled.tr`
  padding-left: 24px;
  display: flex;
  margin-top: 15px;
`

const Td = styled.td`
  flex: 1;
  text-align: left;
`

const Td2 = Td.extend`
  flex: 2;
`
const Td05 = Td.extend`
  flex: 0.5;
`

function Rows({ rows, deletes }) {
  return (
    rows &&
    rows.sort((a, b) => a.doc.entered < b.doc.entered).map(({ doc }) => {
      const { total_time, _id, entered, exited, LRN, grade } = doc
      return (
        <Body key={_id}>
          <Td2>
            {LRN}-{grade}
          </Td2>
          <Td>{new Date(entered).toLocaleDateString()}</Td>
          <Td>{new Date(entered).toLocaleTimeString()}</Td>
          <Td>{exited ? new Date(exited).toLocaleTimeString() : 'ehhh'}</Td>
          <Td>
            {typeof total_time === 'number'
              ? secondsToHms(total_time)
              : 'NO TIME'}
          </Td>
          <Td05 onClick={deletes.bind(this, doc)}>
            <button>X</button>
          </Td05>
        </Body>
      )
    })
  )
}

function FooterBody({ display }) {
  return (
    <Fragment>
      <td style={{ flex: 2 }} key={1} />
      <td style={{ flex: 1 }} key={2} />
      <td style={{ flex: 1 }} key={3} />
      <td style={{ flex: 1 }} key={4} />
      <td style={{ flex: 1 }} key={5}>
        {display}
      </td>
      <td style={{ flex: 0.5 }} key={6} />
    </Fragment>
  )
}

export default ({ rows, total_time, deleteDoc }) => (
  <Table>
    <thead style={{ position: 'relative', display: 'block' }}>
      <Header>
        <th className="theader theader--2">LRN &amp; Grade</th>
        <th className="theader">Date of Use</th>
        <th className="theader">Time of Entry</th>
        <th className="theader">Time of Exit</th>
        <th className="theader">Total Time</th>
        <th style={{ flex: 0.5 }} />
      </Header>
    </thead>
    <tfoot>
      <Footer>
        <FooterBody
          display={
            typeof total_time === 'number'
              ? getYoutubeLikeToDisplay(total_time)
              : 'NO TIME'
          }
        />
      </Footer>
      <Footer>
        <FooterBody
          display={
            typeof total_time === 'number'
              ? secondsToHms(total_time)
              : 'NO TIME'
          }
        />
      </Footer>
    </tfoot>
    <tbody
      style={{
        overflowY: 'auto',
        display: 'block',
        maxHeight: '35vh',
        boxShadow: '0 10px 15px 2px  rgba(0,0,0,0.18)',
        position: 'relative'
      }}
    >
      <Rows rows={rows} deletes={deleteDoc} />
    </tbody>
  </Table>
)

const Option = styled.div`
  display: flex;
  padding-top: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.18);
  padding-bottom: 16px;
  position: absolute;
`

function Options() {
  return (
    <Option>
      <span>X</span>
    </Option>
  )
}
