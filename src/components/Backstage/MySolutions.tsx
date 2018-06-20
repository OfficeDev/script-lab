import React from 'react'
import Content from './Content'
import GalleryList from './GalleryList'
import { ISolution } from '../../stores/solutions'

// TODO: incorp. localization
// TODO: use real data
interface IMySolutions {
  solutions: ISolution[]
  openSolution: (solutionId: string) => void
  activeSolution?: ISolution
}
const MySolutions = ({ solutions, openSolution, activeSolution }: IMySolutions) => (
  <Content title="My Snippets" description="Choose a snippet that you have saved">
    <GalleryList
      title="My snippets on this computer"
      items={solutions.map(sol => ({
        key: sol.id,
        title: sol.name,
        description: sol.description,
        onClick: () => openSolution(sol.id),
        isActive: activeSolution && activeSolution.id === sol.id,
      }))}
    />
    <GalleryList
      title="My shared gists on GitHub"
      items={[
        {
          key: 'shared1',
          title: 'Snippet Name 1',
          description: 'Shared with Script Lab',
        },
        {
          key: 'shared2',
          title: 'Snippet Name 2',
          description: 'Shared with Script Lab',
        },
        {
          key: 'shared3',
          title: 'Snippet Name 3',
          description: 'Shared with Script Lab',
        },
        {
          key: 'shared4',
          title: 'Snippet Name 4',
          description: 'Shared with Script Lab',
        },
      ]}
    />
  </Content>
)

export default MySolutions
