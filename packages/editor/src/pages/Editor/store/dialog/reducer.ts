import actions, { IDialogAction } from "../actions";
import { getType } from "typesafe-actions";
import { DialogType } from "office-ui-fabric-react/lib/Dialog";

export interface IState {
  isVisible: boolean;
  style: DialogType;
  title: string;
  subText: string;
  isBlocking: boolean;
  buttons: Array<{
    key: string;
    text: string;
    action: { type: string; payload?: any };
    isPrimary: boolean;
  }>;
}

const defaultState: IState = {
  isVisible: false,
  style: DialogType.largeHeader,
  title: "",
  subText: "",
  isBlocking: false,
  buttons: [],
};

const dialogReducer = (state: IState = defaultState, action: IDialogAction): IState => {
  switch (action.type) {
    case getType(actions.dialog.show):
      return {
        isVisible: true,
        style: action.payload.style,
        title: action.payload.title,
        subText: action.payload.subText,
        isBlocking: action.payload.isBlocking,
        buttons: action.payload.buttons,
      };

    case getType(actions.dialog.hide):
      return { ...state, isVisible: false };

    case getType(actions.dialog.reset):
      return defaultState;

    default:
      return state;
  }
};

export default dialogReducer;
