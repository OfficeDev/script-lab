import { createSelector } from 'reselect';
import { Utilities, HostType, PlatformType } from '@microsoft/office-js-helpers';
import { isPoppedOut } from 'common/lib/utilities/popout.control';

import { selectors as host } from 'script-lab-core/lib/modules/host';

export const getIsRunnableOnThisHost = createSelector(
  [host.get, host.getHostsMatch] as any, // TODO: no clue what's going on with the typing here
  (host, hostsMatch) => host !== HostType.OUTLOOK && hostsMatch && !isPoppedOut(),
);
