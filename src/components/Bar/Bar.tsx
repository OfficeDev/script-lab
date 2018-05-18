import styled from 'styled-components'

interface IProps {
  bgColor?: string
  height?: number
  justify?: 'flex-start' | 'flex-end'
}

export default styled<IProps, any>('div')`
  height: ${props => (props.height ? `${props.height}px` : '100%')};
  width: 100%;

  box-sizing: border-box;

  background-color: ${props => props.bgColor || 'none'};

  display: flex;
  align-items: stretch;
  justify-content: ${props => props.justify || 'flex-start'};
`
