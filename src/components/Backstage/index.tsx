import React from 'react'
import styled from 'styled-components'

const Backstage = styled.div`
  display: flex;
  flex-wrap: no-wrap;

  height: 100vh;
`

const Menu = styled.ul`
  display: flex;
  flex-direction: column;

  height: 100vh;

  background-color: ${props => props.theme.accent};
  color: ${props => props.theme.fg};
`

const MenuItem = styled.li`
  padding: 1.5rem;
`

const Content = styled.section`
  padding: 1rem;
  font-size: 1.6rem;
`
