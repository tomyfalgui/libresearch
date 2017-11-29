import styled, { injectGlobal } from 'styled-components'

const Wrapper = styled.div`
  display: grid;
  max-height: 100vh;
  grid-template-rows: 50px 1fr 5fr;
  grid-row-gap: 12px;
`

export default ({ children }) => <Wrapper>{children}</Wrapper>

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
