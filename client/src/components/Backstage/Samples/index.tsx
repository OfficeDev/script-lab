// import React from 'react'
// // import {
// //   DetailsList,
// //   DetailsListLayoutMode,
// //   Selection,
// //   SelectionMode,
// //   IColumn,
// // } from 'office-ui-fabric-react/lib/DetailsList'
// // import { List } from 'office-ui-fabric-react/lib/List'
// import {
//   GroupedList,
//   IGroup,
//   IGroupDividerProps,
// } from 'office-ui-fabric-react/lib/components/GroupedList/index'

// import Content from './Content'
// import styled from 'styled-components'

// // TODO: decide on convention here: GalleryListWrapper vs Wrapper
// export const TitleBar = styled.div.attrs({ className: 'ms-font-m' })`
//   display: flex;
//   height: 4rem;
//   color: #333;
//   background-color: lightgray;
//   white-space: nowrap;
//   overflow: hidden;
// `

// export const Title = styled.span`
//   padding: 1.2rem;
//   flex: 1;
// `

// // TODO: really realllly refactor those styles out soon
// export const ArrowWrapper = styled.div`
//   padding: 1.2rem;

//   &:hover {
//     background-color: ${props => props.theme.primary}
//     color: ${props => props.theme.white}
//     cursor: pointer;
//   }
// `

// export const ItemWrapper = styled.article.attrs({ className: 'ms-font-m' })`
//   padding: 1rem 1.5rem;
//   user-select: none;

//   &:hover {
//     background-color: ${props => props.theme.primary};
//     color: ${props => props.theme.white};
//     cursor: pointer;
//   }
// `

// interface ISamples {
//   samplesByGroup
//   openSample: (rawUrl: string) => void
// }
// class Samples extends React.Component<ISamples> {
//   renderRow = (nestingDepth?: number, item?: any, index?: number) => {
//     const onClick = () => this.props.openSample(item.rawUrl)
//     return (
//       <ItemWrapper data-selection-index={index} onClick={onClick}>
//         <div>{item!.name}</div>
//         <div style={{ opacity: 0.75 }}>{item!.description}</div>
//       </ItemWrapper>
//     )
//   }

//   onItemInvoke = (item?: any, index?: number, ev?: React.FocusEvent<HTMLElement>) => {
//     console.log({ item, ev })
//     if (item) {
//       this.props.openSample(item.rawUrl)
//     }
//   }

//   render() {
//     const { samplesByGroup } = this.props

//     let itemCount = 0
//     const groups = Object.keys(samplesByGroup).map(group => {
//       const count = samplesByGroup[group].length
//       const detailsListGroup = { key: group, name: group, startIndex: itemCount, count }
//       itemCount += count
//       return detailsListGroup
//     })

//     const items = Object.keys(samplesByGroup)
//       .reduce((items, group) => [...items, ...samplesByGroup[group]], [])
//       .map((sample: ISampleMetadata) => ({
//         key: sample.id,
//         name: sample.name,
//         description: sample.description,
//         rawUrl: sample.rawUrl,
//       }))

//     console.log({ groups, items })
//     return (
//       <Content
//         title="Samples"
//         description="Choose one of the samples below to get started."
//       >
//         <GroupedList
//           groups={groups}
//           items={items}
//           groupProps={{
//             onRenderHeader: props => (
//               <TitleBar>
//                 <Title>{props!.group!.name}</Title>
//                 {/* <ArrowWrapper>
//                 <FabricIcon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} />
//               </ArrowWrapper> */}
//               </TitleBar>
//             ),
//             onRenderFooter: props => <div style={{ height: '2rem' }} />,
//           }}
//           onRenderCell={this.renderRow}
//           // compact={false}
//           // selectionMode={SelectionMode.none}
//           // setKey="set"
//           // layoutMode={DetailsListLayoutMode.justified}
//           // isHeaderVisible={false}
//           // // selection={this._selection}
//           // selectionPreservedOnEmptyClick={true}
//           // onActiveItemChanged={this.onItemInvoke}
//         />
//       </Content>
//     )
//   }
// }

// export default Samples
import React from 'react'
import Content from '../Content'
import GalleryList from '../GalleryList'

export default ({ samplesByGroup, openSample, theme }) => (
  <Content title="Samples" description="Choose one of the samples below to get started.">
    {Object.keys(samplesByGroup).length > 0 ? (
      Object.keys(samplesByGroup).map(group => (
        <GalleryList
          theme={theme}
          key={group}
          title={group}
          items={samplesByGroup[group].map(({ id, name, description, rawUrl }) => ({
            key: id,
            title: name,
            description,
            onClick: () => openSample(rawUrl),
          }))}
        />
      ))
    ) : (
      <span className="ms-font-m">There aren't any samples for this host yet.</span>
    )}
  </Content>
)
