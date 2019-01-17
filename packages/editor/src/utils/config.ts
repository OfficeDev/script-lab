import queryString from 'query-string';

const KEYS = {
  shouldSplitRunButton: 'should_split_run_button',
};

export function init() {
  const queryParams: { commands: number } = queryString.parse(window.location.search);

  // If the URL has "commands=1" on it (from the URL specified in the manifest),
  //     it means that it's run in an Office host that supports ribbon commands.
  //     For such hosts, we want to split out the "run" button to alert them that
  //     a better experience is to run in side-by-side mode.
  if (queryParams.commands) {
    sessionStorage[KEYS.shouldSplitRunButton] = true;
  }
}

export function getShouldSplitRunButton(): boolean {
  return !!sessionStorage[KEYS.shouldSplitRunButton];
}
