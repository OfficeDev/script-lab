import { IState } from "../reducer";

export const getMetadataByGroup = (state: IState): ISampleMetadataByGroup =>
  Object.values(state.samples || {})
    .filter((sample) => sample.host === state.host)
    .reduce(
      (byGroup, sample) => ({
        ...byGroup,
        [sample.group]: [...(byGroup[sample.group] || []), sample],
      }),
      {},
    );
