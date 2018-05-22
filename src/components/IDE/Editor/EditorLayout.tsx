import styled from 'styled-components'

export default styled.div`
  grid-area: 'editor';

  height: 100%;
  display: grid;

  grid-template-columns: auto;
  grid-template-rows: 44px auto;
  grid-template-areas: 'command-bar' 'editor';
`
