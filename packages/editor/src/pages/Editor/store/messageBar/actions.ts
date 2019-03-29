import { createAction } from 'typesafe-actions';
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { IState as IMessageBarState, IShowMessageBarParams } from './reducer';

export const show = createAction('MESSAGE_BAR_SHOW', resolve => {
  return (props: IShowMessageBarParams) => {
    const fullParams: IMessageBarState = {
      isVisible: true,
      style: MessageBarType.info,
      link: null,
      ...props,
    };
    return resolve(fullParams);
  };
});

export const dismiss = createAction('MESSAGE_BAR_HIDE');
