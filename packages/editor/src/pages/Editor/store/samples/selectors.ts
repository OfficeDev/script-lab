import { IState } from '../reducer';

import { selectors as host } from 'script-lab-core/lib/modules/host';

export const getMetadataByGroup = (state: IState): ISampleMetadataByGroup =>
  Object.values(state.samples || {})
    .filter(sample => sample.host === host.get(state))
    .reduce(
      (byGroup, sample) => ({
        ...byGroup,
        [sample.group]: [...(byGroup[sample.group] || []), sample],
      }),
      {},
    );
