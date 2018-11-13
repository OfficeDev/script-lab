import React, { Component } from 'react';
import { withTheme } from 'styled-components';
import { BackstageWrapper, ContentContainer, LoadingContainer } from './styles';
import debounce from 'lodash/debounce';

import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

import Menu from './Menu';
import MySolutions from './MySolutions';
import Samples from './Samples';
import ImportSolution from './ImportSolution';

import ConflictResolutionDialog from './ConflictResolutionDialog/ConflictResolutionDialog';
import { ConflictResolutionOptions } from '../../interfaces/enums';

import { connect } from 'react-redux';
import selectors from '../../store/selectors';
import { editor, solutions, samples, gists } from '../../store/actions';
import { push } from 'connected-react-router';
import { PATHS } from '../../constants';
import Only from '../Only';

interface IBackstageItem {
  key: string;
  icon: string;
  label?: string;
  onClick?: () => void;
  content?: JSX.Element;
  ariaLabel?: string;
}

interface IPropsFromRedux {
  solutions: ISolution[];
  activeSolution?: ISolution;
  sharedGistMetadata: ISharedGistMetadata[];
  samplesByGroup: { [group: string]: ISampleMetadata[] };
}

const mapStateToProps = (state): IPropsFromRedux => ({
  solutions: selectors.solutions.getInLastModifiedOrder(state),
  activeSolution: selectors.editor.getActiveSolution(state),
  sharedGistMetadata: selectors.gists.getGistMetadata(state),
  samplesByGroup: selectors.samples.getMetadataByGroup(state),
});

interface IActionsFromRedux {
  createNewSolution: () => void;
  openSolution: (solutionId: string, fileId: string) => void;
  openSample: (rawUrl: string) => void;
  openGist: (
    rawUrl: string,
    gistId: string,
    conflictResolution?: { type: ConflictResolutionOptions; existingSolution: ISolution },
  ) => void;
  importGist: (gistId?: string, gist?: string) => void;
  goBack: () => void;
}

const mapDispatchToProps = (dispatch): IActionsFromRedux => ({
  createNewSolution: () => dispatch(solutions.create()),
  openSolution: (solutionId: string, fileId: string) =>
    dispatch(editor.open({ solutionId, fileId })),
  openSample: (rawUrl: string) => dispatch(samples.get.request({ rawUrl })),
  openGist: (
    rawUrl: string,
    gistId: string,
    conflictResolution?: { type: ConflictResolutionOptions; existingSolution: ISolution },
  ) => dispatch(gists.get.request({ rawUrl, gistId, conflictResolution })),
  importGist: (gistId?: string, gist?: string) =>
    dispatch(gists.importSnippet.request({ gistId, gist })),
  goBack: () => dispatch(push(PATHS.EDITOR)),
});

export interface IProps extends IPropsFromRedux, IActionsFromRedux {}

interface IState {
  isLoading: boolean;
  selectedKey: string;
  conflictingGist: ISharedGistMetadata | null;
  existingSolutionsConflicting: ISolution[] | null;
  width: number;
}

export class Backstage extends Component<IProps, IState> {
  state = {
    isLoading: false,
    selectedKey: 'my-solutions',
    conflictingGist: null,
    existingSolutionsConflicting: null,
    width: 0,
  };
  containerDomNode;
  resizeListener;

  constructor(props) {
    super(props);
    this.containerDomNode = React.createRef();
  }

  componentDidMount() {
    this.resizeListener = window.addEventListener('resize', debounce(this.setWidth, 100));
    this.setWidth();
  }

  setWidth = () => {
    const { current } = this.containerDomNode;
    if (current) {
      const { width } = current.getBoundingClientRect();
      if (this.state.width !== width) {
        this.setState({ width });
      }
    }
  };

  componentWillUnmount() {
    this.setState({ selectedKey: 'my-solutions', isLoading: false });
  }

  openSolution = (solutionId: string) => {
    const solution = this.props.solutions.find(solution => solution.id === solutionId);
    this.props.openSolution(solutionId, solution!.files[0].id);
    this.setState({ isLoading: true });
  };

  openSample = (rawUrl: string) => {
    this.props.openSample(rawUrl);
    this.setState({ isLoading: true });
  };

  openSharedGist = (gistMeta: ISharedGistMetadata) => {
    const { solutions, openGist } = this.props;
    const { id, url } = gistMeta;
    const existingSolutions = solutions.filter(
      s => s.source && s.source.origin === 'gist' && s.source.id === id,
    );

    if (existingSolutions.length > 0) {
      // version of this gist already exists locally in solutions
      this.showGistConflictDialog(gistMeta, existingSolutions);
    } else {
      openGist(url, id);
    }
    this.setState({ isLoading: true });
  };

  showGistConflictDialog = (
    conflictingGist: ISharedGistMetadata,
    existingSolutionsConflicting: ISolution[],
  ) => this.setState({ conflictingGist, existingSolutionsConflicting });

  hideGistConflictDialog = () =>
    this.setState({
      conflictingGist: null,
      existingSolutionsConflicting: null,
      isLoading: false,
    });

  render() {
    const items = [
      {
        key: 'back',
        ariaLabel: 'Back',
        icon: 'GlobalNavButton',
        onClick: this.props.goBack,
      },
      {
        key: 'new',
        label: 'New Snippet',
        icon: 'Add',
        onClick: () => {
          this.props.createNewSolution();
        },
      },
      {
        key: 'my-solutions',
        label: 'My Snippets',
        icon: 'DocumentSet',
        content: (
          <MySolutions
            solutions={this.props.solutions}
            openSolution={this.openSolution}
            activeSolution={this.props.activeSolution}
            gistMetadata={this.props.sharedGistMetadata}
            openGist={this.openSharedGist}
          />
        ),
      },
      {
        key: 'samples',
        label: 'Samples',
        icon: 'Dictionary',
        content: (
          <Samples
            openSample={this.openSample}
            samplesByGroup={this.props.samplesByGroup}
          />
        ),
      },
      {
        key: 'import',
        label: 'Import',
        icon: 'Download',
        content: <ImportSolution importGist={this.props.importGist} />,
      },
    ].map((item: IBackstageItem) => ({
      onClick: () => this.setState({ selectedKey: item.key }),
      ...item,
    }));
    const {
      selectedKey,
      conflictingGist,
      existingSolutionsConflicting,
      width,
    } = this.state;
    const activeItem = items.find(item => item.key === selectedKey);
    return (
      <div ref={this.containerDomNode}>
        <BackstageWrapper>
          <Menu
            isCompact={width <= 500}
            selectedKey={this.state.selectedKey}
            items={items}
          />
          <ContentContainer>
            {activeItem && activeItem.content}
            <Only when={this.state.isLoading}>
              <LoadingContainer>
                <Spinner size={SpinnerSize.large} />
              </LoadingContainer>
            </Only>
          </ContentContainer>
          {conflictingGist && existingSolutionsConflicting && (
            <ConflictResolutionDialog
              conflictingGist={conflictingGist}
              existingSolutions={existingSolutionsConflicting}
              closeDialog={this.hideGistConflictDialog}
              openGist={this.props.openGist}
            />
          )}
        </BackstageWrapper>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Backstage);
