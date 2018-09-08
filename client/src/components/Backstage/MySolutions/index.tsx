import React from 'react'
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox'

import Content from '../Content'
import GalleryList from '../GalleryList'

interface IProps {
  solutions: ISolution[]
  openSolution: (solutionId: string) => void
  activeSolution?: ISolution
  gistMetadata: ISharedGistMetadata[]
  openGist: (gistMetadata: ISharedGistMetadata) => void
  theme: ITheme
}

interface IState {
  filterQuery: string
}
class MySolutions extends React.Component<IProps> {
  state = { filterQuery: '' }

  componentWillMount() {
    this.setFilterQuery('')
  }

  setFilterQuery = filterQuery => this.setState({ filterQuery })

  render() {
    const {
      solutions,
      openSolution,
      activeSolution,
      gistMetadata,
      openGist,
      theme,
    } = this.props

    return (
      <Content title="My Snippets" description="Choose a snippet that you have saved">
        <SearchBox
          placeholder="Search your snippets"
          // onSearch={newValue => console.log('value is ' + newValue)}
          onChange={this.setFilterQuery}
        />
        <GalleryList
          theme={theme}
          title="My snippets on this computer"
          items={solutions
            .filter(solution => {
              if (this.state.filterQuery === '') {
                return true
              }

              const megastring = [
                solution.name,
                solution.description,
                ...solution.files.map(file => file.content),
              ]
                .filter(Boolean)
                .join(' ')

              return megastring.includes(this.state.filterQuery)
            })
            .map(sol => ({
              key: sol.id,
              title: sol.name,
              description: sol.description,
              onClick: () => openSolution(sol.id),
              isActive: activeSolution && activeSolution.id === sol.id,
            }))}
        />
        {gistMetadata.length > 0 && (
          <GalleryList
            theme={theme}
            title="My shared gists on GitHub"
            items={gistMetadata.map(gist => ({
              key: gist.id,
              title: gist.title,
              description: gist.description,
              onClick: () => openGist(gist),
            }))}
          />
        )}
      </Content>
    )
  }
}

export default MySolutions
