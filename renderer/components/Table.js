import _ from 'lodash'
import styled from 'styled-components'
import bemto from 'bemto-components'

const Table = styled.table`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-top: 30px;

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

  .tcell {
    flex: 1;
    text-align: left;

    &--2 {
      flex: 2;
    }
  }
`

function Rows({ rows }) {
  return (
    rows &&
    rows.sort((a, b) => a.doc.entered < b.doc.entered).map(({ doc }) => {
      return (
        <Body key={doc._id}>
          <td className="tcell tcell--2">{doc.LRN}</td>
          <td className="tcell">
            {new Date(doc.entered).toLocaleDateString()}
          </td>
          <td className="tcell">
            {new Date(doc.entered).toLocaleTimeString()}
          </td>
          <td className="tcell">
            {doc.exited ? new Date(doc.exited).toLocaleTimeString() : 'ehhh'}
          </td>
          <td className="tcell">
            {new Date(doc.entered).toLocaleTimeString()}-{doc.exited
              ? new Date(doc.exited).toLocaleTimeString()
              : 'ehhh'}
          </td>
        </Body>
      )
    })
  )
}

export default ({ rows }) => (
  <Table>
    <thead style={{ position: 'relative', display: 'block' }}>
      <Header>
        <th className="theader theader--2">LRN &amp; Grade</th>
        <th className="theader">Date of Use</th>
        <th className="theader">Time of Entry</th>
        <th className="theader">Time of Exit</th>
        <th className="theader">Total Time</th>
      </Header>
    </thead>
    <tbody style={{ overflow: 'scroll', height: '40vh', display: 'block' }}>
      <Rows rows={rows} />
    </tbody>
  </Table>
)
