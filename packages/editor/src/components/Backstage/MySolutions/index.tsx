import React from 'react';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';

import Content from '../Content';
import GalleryList from '../GalleryList';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Label } from 'office-ui-fabric-react/lib/Label';

interface IProps {
  solutions: ISolution[];
  openSolution: (solutionId: string) => void;
  activeSolution?: ISolution;
  gistMetadata: ISharedGistMetadata[];
  openGist: (gistMetadata: ISharedGistMetadata) => void;
  signIn: () => void;
}

interface IState {
  filterQuery: string;
}

class MySolutions extends React.Component<IProps> {
  state = { filterQuery: '' };

  componentWillMount() {
    this.setFilterQuery('');
  }

  setFilterQuery = filterQuery => this.setState({ filterQuery });

  render() {
    const {
      solutions,
      openSolution,
      activeSolution,
      gistMetadata,
      openGist,
    } = this.props;

    return (
      <Content title="My Snippets" description="Choose a snippet that you have saved">
        <SearchBox placeholder="Search your snippets" onChange={this.setFilterQuery} />
        <GalleryList
          title="My snippets on this computer"
          items={solutions
            .filter(solution => {
              if (this.state.filterQuery === '') {
                return true;
              }

              const megastring = [
                solution.name,
                solution.description,
                ...solution.files.map(file => file.content),
              ]
                .filter(Boolean)
                .join(' ');

              return megastring.includes(this.state.filterQuery);
            })
            .map(sol => ({
              key: sol.id,
              title: sol.name,
              description: sol.description,
              onClick: () => openSolution(sol.id),
              isActive: activeSolution && activeSolution.id === sol.id,
            }))}
        />
        <GalleryList
          title="My shared gists on GitHub"
          items={gistMetadata.map(gist => ({
            key: gist.id,
            title: gist.title,
            description: gist.description,
            onClick: () => openGist(gist),
          }))}
        />
        {gistMetadata.length === 0 && (
          <div style={{ margin: '1rem', marginLeft: '2rem' }}>
            <Label>You must be logged in to see your gists</Label>
            <DefaultButton
              text="Sign In"
              label="You must be logged in to see your gists"
              onClick={this.props.signIn}
            />
          </div>
        )}
      </Content>
    );
  }
}

export default MySolutions;
