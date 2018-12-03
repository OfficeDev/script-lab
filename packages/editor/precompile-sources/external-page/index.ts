import { parse } from 'query-string';
import safeExternalUrls from '../../../common/src/safe.external.urls';
import forIn from 'lodash/forin';

(() => {
  const { destination } = parse(window.location.search) as {
    destination: string;
  };

  forIn(
    safeExternalUrls,
    (value: string): any => {
      if (value === destination) {
        window.location.href = destination;
        return false;
      }
    },
  );

  // Otherwise can just stay on empty page.  This should never happen in normal behavior,
  // and if someone tweaks the URL, then so be it.
})();

///////////////////////////////////////

// cspell:ignore forin
