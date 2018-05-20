import styled from 'styled-components'

export default styled.div`
  height: 100vh;
  display: grid;

  margin: 0;

  grid-template-columns: auto;
  grid-template-rows: 44px auto 22px;
  grid-template-areas: 'header' 'editor' 'footer';
`
