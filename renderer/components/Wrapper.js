import styled, { injectGlobal } from 'styled-components'

const Wrapper = styled.div`
  display: grid;
  height: 100vh;
  grid-template-rows: 150px 5fr 1fr;
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
