import React from 'react'
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  SelectionMode,
  IColumn,
} from 'office-ui-fabric-react/lib/DetailsList'

// const columns = [
//   {
//     key: 'name-column',
//     name: 'Name',
//     fieldName: 'name',
//     minWidth: 210,
//     // maxWidth: 350,
//     isRowHeader: true,
//     isResizable: true,
//     isSorted: true,
//     isSortedDescending: false,
//     // onColumnClick: this._onColumnClick,
//     data: 'string',
//     isPadded: true,
//   },
//   {
//     key: 'date-column',
//     name: 'Date Last Modified',
//     fieldName: 'dateLastModifiedValue',
//     minWidth: 210,
//     maxWidth: 350,
//     isRowHeader: true,
//     isResizable: true,
//     isSorted: true,
//     isSortedDescending: false,
//     // onColumnClick: this._onColumnClick,
//     data: 'number',
//     // isPadded: true,
//     onRender: item => {
//       return <span>{item.dateLastModified}</span>
//     },
//   },
//   {
//     key: 'location-column',
//     name: 'Location',
//     fieldName: 'location',
//     minWidth: 210,
//     maxWidth: 350,
//     isRowHeader: true,
//     isResizable: true,
//     isSorted: true,
//     isSortedDescending: false,
//     // onColumnClick: this._onColumnClick,
//     data: 'string',
//     isPadded: true,
//   },
// ]

const Gallery = ({ items }) => (
  <DetailsList
    items={items}
    compact={false}
    selectionMode={SelectionMode.none}
    setKey="set"
    layoutMode={DetailsListLayoutMode.justified}
    isHeaderVisible={true}
    // selection={this._selection}
    selectionPreservedOnEmptyClick={true}
    // onItemInvoked={this._onItemInvoked}
  />
)

export default Gallery
