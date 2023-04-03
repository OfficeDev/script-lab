import React, { Component } from 'react';
import { HYPHENATED_PACKAGE_VERSIONS } from 'common/lib/package-versions';

export interface IProps {
  solutionId: string;
  file: IFile;
  tabSize: number;

  editorDidMount: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  onValueChange: (solutionId: string, fileId: string, value: string) => void;
  applyFormatting: () => void;
}

interface IState {
  models: { [id: string]: any };
}

export class ReactMonaco extends Component<IProps, IState> {
  private editor: monaco.editor.IStandaloneCodeEditor;
  private container = React.createRef<HTMLDivElement>();

  componentDidMount() {
    if ((window as any).monaco !== undefined) {
      this.initializeMonaco();
    } else {
      (window as any).require.config({
        baseUrl: '/',
        paths: {
          vs: `external/monaco-editor-${HYPHENATED_PACKAGE_VERSIONS['monaco-editor']}/vs`,
        },
      });
      (window as any).require(['vs/editor/editor.main'], () => this.initializeMonaco());
    }
  }

  componentDidUpdate(prevProps: IProps) {
    if (this.editor) {
      const { solutionId, file } = this.props;

      if (solutionId !== prevProps.solutionId) {
        this.clearAllModels();
      }

      const isDifferentLanguage = file.language !== prevProps.file.language;
      if (file.id !== prevProps.file.id || isDifferentLanguage) {
        const newModel = this.getModel();
        newModel.updateOptions({ tabSize: this.props.tabSize });
        this.editor.setModel(newModel);
        this.props.applyFormatting();

        if (isDifferentLanguage) {
          const oldModel = monaco.editor.getModel(
            getUri({
              solutionId: solutionId,
              file: prevProps.file,
            }),
          );
          if (oldModel) {
            oldModel.dispose();
          }
        }
      }
    }
  }

  componentWillUnmount() {
    if (this.editor) {
      this.editor.dispose();
    }
  }

  initializeMonaco = () => {
    if (!this.container.current) {
      // Adding throw here mostly for the type-safety of using current below
      throw new Error(
        "Trying to initialize but ref isn't even valid. This should not be reachable.",
      );
    }

    this.editor = monaco.editor.create(this.container.current, {});

    const model = this.getModel();
    model.updateOptions({ tabSize: this.props.tabSize });
    this.editor.setModel(model);

    this.editor.onDidChangeModelContent(() => {
      this.onValueChange();
    });

    this.props.editorDidMount(this.editor);
  };

  onValueChange = () =>
    this.props.onValueChange(
      this.props.solutionId,
      this.props.file.id,
      this.editor.getModel().getValue(),
    );

  private getCurrentUri = () =>
    getUri({
      solutionId: this.props.solutionId,
      file: this.props.file,
    });

  private getModel = () => {
    const uri = this.getCurrentUri();
    const model = monaco.editor.getModel(uri);

    return model
      ? model
      : monaco.editor.createModel(this.props.file.content, this.props.file.language, uri);
  };

  clearAllModels = () => {
    monaco.editor.getModels().forEach(model => model.dispose());
  };

  render() {
    return (
      <div ref={this.container} style={{ width: '100%', height: '100%' }} role="main" />
    );
  }
}

function getUri({ solutionId, file }: { solutionId: string; file: IFile }) {
  return monaco.Uri.file(`${solutionId}/${file.language}/${file.id}`);
}

export default ReactMonaco;
