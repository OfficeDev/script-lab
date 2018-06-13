import React, { Component } from 'react'
import { GalleryListWrapper, Title } from './styles'

interface IGalleryListItem {
  title: string
  description: string
}

// TODO: decide on convention for Props: IComponentProps vs IComponent
export interface IGalleryList {
  title: string
  items: IGalleryListItem[]
}

export default class GalleryList extends Component<IGalleryList> {
  render() {
    const { title } = this.props
    return (
      <GalleryListWrapper>
        <Title>{title}</Title>
      </GalleryListWrapper>
    )
  }
}
