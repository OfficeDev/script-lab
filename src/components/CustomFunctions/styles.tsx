import React from 'react'
import styled from 'styled-components'

// TODO: fill styles for custom functions

//  export const GalleryListWrapper = styled.section`
//   margin: 1.2rem 0;
// `

// // TODO: decide on convention here: GalleryListWrapper vs Wrapper
// export const TitleBar = styled.div.attrs({ className: 'ms-font-m' })`
//   display: flex;
//   height: 4rem;
//   color: #555;
//   background-color: lightgray;
//   white-space: nowrap;
//   overflow: hidden;
// `

export const Title = styled.div`
  padding: 1.2rem;
  font-size: 42px;
  font-weight: lighter;
  flex: 1;
  text-align: center;
`

export const Subheader = styled.div`
  font-size: 13px;
  text-align: center;
  width: 70%;
  margin-left: 15%;
  margin-right: 15%;
  flex: 1;
`
export const Divider = styled.div`
  border-bottom: solid;
  border-width: 1px;
  border-bottom-color: #ccc;
  width: 50%;
  margin: 8% 25%;
`

export const Bodytext = styled.div`
  font-size: 13px;
  float: left;
  line-height: 2.4em;
`
export const Listtext = styled.div`
  font-size: 12px;
  float: left;
  line-height: 2.4em;
`
export const Codeblock = styled.div``
// // TODO: really realllly refactor those styles out soon
// export const ArrowWrapper = styled.div`
//   padding: 1.2rem;

//   &:hover {
//     background-color: ${props => props.theme.accent}
//     color: ${props => props.theme.fg}
//     cursor: pointer;
//   }
// `
