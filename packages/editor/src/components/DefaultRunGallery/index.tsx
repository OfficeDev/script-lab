import React from 'react'
import SnippetFunctionGallery from './SnippetFunctionGallery'
import {
  RunGallery,
  RunGalleryItemContentWrapper,
  RunGalleryItemLabel,
  RunGalleryItemWrapper,
} from './styles'

interface IProps {
  snippets?: IDefaultSnippetRunMetadata[]
}

export class DefaultRunGallery extends React.Component<IProps> {
  render() {
    return (
      <RunGallery>
        {this.props.snippets &&
          this.props.snippets.map(({ name, functions }) => (
            <RunGalleryItemWrapper key={name}>
              <RunGalleryItemLabel>{name}</RunGalleryItemLabel>
              <RunGalleryItemContentWrapper>
                <SnippetFunctionGallery functions={functions} />
              </RunGalleryItemContentWrapper>
            </RunGalleryItemWrapper>
          ))}
      </RunGallery>
    )
  }
}

export default DefaultRunGallery
