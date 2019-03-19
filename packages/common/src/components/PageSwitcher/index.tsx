import React from 'react';

import { HashRouter, Route, Switch } from 'react-router-dom';
import { AwaitPromiseThenRender } from './utilities/AwaitPromiseThenRender';
import { addScriptTags } from '../../utilities/script-loader';
import { redirectIfNeeded } from '../../utilities/environment.redirector';

export interface IPageLoadingSpec {
  component: React.ComponentType;
  officeJs: string | null;
  isRedirectCancelable?: boolean;
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
        ? addScriptTags([spec.officeJs]).then(() => Office.onReady())
        : Promise.resolve(null)
      ).then(() => redirectIfNeeded({ isCancelable: spec.isRedirectCancelable }))}
    >
      {React.createElement(spec.component)}
    </AwaitPromiseThenRender>
  );
}
