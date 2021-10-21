import React from 'react';
import { dialog } from '../../../store/actions';
import { IState as IDialogState } from '../../../store/dialog/reducer';
import { Dialog as FabricDialog, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';

import { connect } from 'react-redux'; // Note, avoid the temptation to include '@types/react-redux', it will break compile-time!

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
    const { dialogProps, dismiss } = this.props;

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
              key={button.key}
              data-testid={button.key}
              text={button.text}
              aria-label={button.text}
              onClick={this.getDispatchFunctionForOnClick(button.action)}
              primary={button.isPrimary}
            />
          ))}
        </DialogFooter>
      </FabricDialog>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(connect()(Dialog));
