import styled from 'styled-components'

export default styled.div`
  height: 100vh;

  grid-template-columns: auto;
  grid-template-rows: 44px 44px auto 22px;
  grid-template-areas: 'header' 'command-bar' 'editor' 'footer';
`
