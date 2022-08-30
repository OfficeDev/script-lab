import React from 'react';
import { Wrapper, ActiveWrapper, Title, Description } from './styles';
import { composeSolutionId } from 'common/lib/utilities/string';

export interface IGalleryListItem {
  key: string;
  title: string;
  description?: string;
  isActive?: boolean;
  onClick?: () => void;
}

const GalleryListItem = ({ title, description, isActive, onClick }: IGalleryListItem) => {
  const ItemWrapper = isActive ? ActiveWrapper : Wrapper;
  return (
    <ItemWrapper
      data-is-focusable="true"
      onClick={onClick}
      aria-label={title}
      id={composeSolutionId(title)}
    >
      <Title>{title}</Title>
      <Description>{description}</Description>
    </ItemWrapper>
  );
};

export default GalleryListItem;
