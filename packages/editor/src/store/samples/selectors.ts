import { IState } from '../reducer';
import { getObjectValues } from '../../utils';

export const getMetadataByGroup = (state: IState): ISampleMetadataByGroup =>
  getObjectValues(state.samples)
    .filter(sample => sample.host === state.host)
    .reduce(
      (byGroup, sample) => ({
        ...byGroup,
        [sample.group]: [...(byGroup[sample.group] || []), sample],
      }),
      {},
    );
