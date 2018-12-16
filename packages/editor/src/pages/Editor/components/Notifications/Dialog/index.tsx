import React from 'react';
import { dialog } from '../../../store/actions';
import { IState as IDialogState } from '../../../store/dialog/reducer';
import {
  Dialog as FabricDialog,
  DialogType,
  DialogFooter,
} from 'office-ui-fabric-react/lib/Dialog';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';

import { connect } from 'react-redux';

interface IPropsFromRedux {
  dialogProps: IDialogState;
}

const mapStateToProps = state => ({
  dialogProps: state.dialog,
});

interface IActionsFromRedux {
  dismiss: () => void;
}

const mapDispatchToProps = dispatch => ({
  dismiss: () => dispatch(dialog.dismiss()),
});

export interface IProps extends IPropsFromRedux, IActionsFromRedux {
  dispatch: any; // from connect
}

export class Dialog extends React.Component<IProps> {
  getDispatchFunctionForOnClick = (action: { type: string; payload?: any }) => () => {
    this.props.dispatch(action);
    this.props.dispatch(dialog.dismiss());
  };

  render() {
    const { dialogProps, dismiss, dispatch } = this.props;

    return (
      <FabricDialog
        hidden={!dialogProps.isVisible}
        onDismiss={dismiss}
        dialogContentProps={{
          type: dialogProps.style,
          title: dialogProps.title,
          subText: dialogProps.subText,
        }}
        modalProps={{
          isBlocking: dialogProps.isBlocking,
        }}
      >
        <DialogFooter>
          {dialogProps.buttons.map(button => (
            <DefaultButton
              text={button.text}
              onClick={this.getDispatchFunctionForOnClick(button.action)}
              primary={button.isPrimary}
            />
          ))}
        </DialogFooter>
      </FabricDialog>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connect()(Dialog));
