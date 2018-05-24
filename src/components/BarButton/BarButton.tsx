import styled from 'styled-components'

export default styled.a`
  display: flex;
  align-items: center;
  justify-items: center;

  height: 100%;

  padding: 0em 1rem;

  border: 0;

  background: none;
  color: white;

  transition: all 0.1s ease-in-out;

  &:hover {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.2);
  }
  &:active {
    background: rgba(0, 0, 0, 0.4);
  }
`
