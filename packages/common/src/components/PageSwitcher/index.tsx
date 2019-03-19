import React from 'react';

import { HashRouter, Route, Switch } from 'react-router-dom';
import { AwaitPromiseThenRender } from './utilities/AwaitPromiseThenRender';
import { addScriptTags } from '../../utilities/script-loader';
import { redirectIfNeeded } from '../../utilities/environment.redirector';

export interface IPageLoadingSpec {
  component: React.ComponentType;
  officeJs: string | null;

  /** Indicates whether the redirect should be possibly cancelable.
   * Makes sense for the Editor page (since that's also where you choose the environment)
   * but would only be slowing down the experience for other pages.
   */
  isRedirectCancelable?: boolean;

  /** For special cases where want to wait to announce that the add-in is ready until
   * *after* the possible redirect.  Relevant for add-in commands.
   */
  skipOfficeOnReady?: boolean;
}

interface IProps {
  pages: { [key: string]: IPageLoadingSpec };
  defaultPath: string;
}

const PageSwitcher = ({ pages, defaultPath }: IProps) => (
  <HashRouter>
    <Switch>
      {/* Render a route for each page */}
      {Object.keys(pages).map(path => (
        <Route
          exact
          path={path}
          component={renderPageAfterPrerequisites(pages[path])}
          key={path}
        />
      ))}
      {/* Falling back on the default component for an unknown route */}
      <Route component={renderPageAfterPrerequisites(pages[defaultPath])} />
    </Switch>
  </HashRouter>
);

export default PageSwitcher;

///////////////////////////////////////

function renderPageAfterPrerequisites(spec: IPageLoadingSpec): React.ComponentType {
  return () => (
    <AwaitPromiseThenRender
      promise={(spec.officeJs
        ? addScriptTags([spec.officeJs]).then(() =>
            spec.skipOfficeOnReady ? Promise.resolve(null) : Office.onReady(),
          )
        : Promise.resolve(null)
      ).then(() => redirectIfNeeded({ isCancelable: spec.isRedirectCancelable }))}
    >
      {React.createElement(spec.component)}
    </AwaitPromiseThenRender>
  );
}
