import React from 'react'
import Content from '../Content'
import GalleryList from '../GalleryList'

// TODO: incorp. localization
interface IMySolutions {
  solutions: ISolution[]
  openSolution: (solutionId: string) => void
  activeSolution?: ISolution
  gistMetadata: ISharedGistMetadata[]
  openGist: (gistMetadata: ISharedGistMetadata) => void
  theme: ITheme
}
const MySolutions = ({
  solutions,
  openSolution,
  activeSolution,
  gistMetadata,
  openGist,
  theme,
}: IMySolutions) => (
  <Content title="My Snippets" description="Choose a snippet that you have saved">
    <GalleryList
      theme={theme}
      title="My snippets on this computer"
      items={solutions.map(sol => ({
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

export default MySolutions
