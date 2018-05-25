import styled from 'styled-components'

interface IProps {
  size?: number
}

export default styled<IProps, any>('div')`
  height: ${props => props.size || 32}px;
  width: ${props => props.size || 32}px;

  margin: 1rem;
  margin-left: auto;
  border-radius: 50%;

  background-image: url(https://lh3.googleusercontent.com/-e2y2T1aiT00/AAAAAAAAAAI/AAAAAAAAAAA/AB6qoq09tgaWz7fRfJi2ZBfVc5Tiup5Elw/s96-c-mo/photo.jpg);
  background-size: cover;

  &:hover {
    cursor: pointer;
    border: 2px solid white;
  }
`
