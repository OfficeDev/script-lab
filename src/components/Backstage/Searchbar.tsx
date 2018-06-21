import React from 'react'
import Content from './Content'
import GalleryList from './GalleryList'
import Samples from './Samples'
import MySolutions from './MySolutions'
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox'

// TODO: incorp. localization
// TODO: use real data

class Searchbar extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.PrintText = this.PrintText.bind(this)
    this.displayOption = this.displayOption.bind(this)
  }

  PrintText(value) {
    console.log(value)
  }

  displayOption(value) {
    console.log('why')
    this.props.searchExecution(value)
  }

  render() {
    return (
      <SearchBox
        placeholder="Search"
        onChange={this.PrintText}
        onSearch={this.displayOption}
      />
    )
  }
}

export default Searchbar
