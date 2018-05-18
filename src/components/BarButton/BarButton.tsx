import styled from 'styled-components'

export default styled.button`
  display: flex;
  align-items: center;
  justify-items: center;

  padding: 0em 1em;

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

  &:focus {
    outline: none;
  }
`
