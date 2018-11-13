import { samples as sampleActions, ISamplesAction } from '../actions';
import { getType } from 'typesafe-actions';

export interface IState {
  [id: string]: ISampleMetadata;
}

const initialState = {};
const samples = (state: IState = initialState, action: ISamplesAction): IState => {
  switch (action.type) {
    case getType(sampleActions.fetchMetadata.success):
      return action.payload.reduce(
        (allSamples, sample) => ({ ...allSamples, [sample.id]: sample }),
        { ...state },
      );

    default:
      return state;
  }
};

export default samples;
