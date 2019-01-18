import path from 'path';
import fs from 'fs-extra';

import { stripSpaces } from 'common/lib/utilities/string';
import * as SimplePrompt from './helpers/simple.prompt';

(async () => {
  console.log(
    stripSpaces(`
        This script will set you up with doing local GitHub auth.
        
        If you haven't already, go to https://github.com/settings/developers
        and click "Register new application".
        Give it a name like "ScriptLab Local Dev",
        with a Homepage and Auth callback URL of https://localhost:3000
        
        Once you've done that, please enter the following details from your app registration:
    `),
  );

  let clientId = await SimplePrompt.promptCustomText('Client ID:', { required: true });
  let clientSecret = await SimplePrompt.promptCustomText('Client Secret:', {
    required: true,
  });

  const root = path.resolve(__dirname, '../');

  fs.writeFileSync(
    path.resolve(root, 'packages/server/.env'),
    stripSpaces(`
      GITHUB_CLIENT_ID=${clientId}
      GITHUB_CLIENT_SECRET=${clientSecret}
      GITHUB_REDIRECT_URL=https://localhost:3000/
    `),
  );

  fs.writeFileSync(
    path.resolve(root, 'packages/server/.env.development.local'),
    stripSpaces(`
      GITHUB_CLIENT_ID=${clientId}
      GITHUB_CLIENT_SECRET=${clientSecret}
      GITHUB_REDIRECT_URL=https://localhost:3000/
    `),
  );

  fs.writeFileSync(
    path.resolve(root, 'packages/editor/.env.development.local'),
    stripSpaces(`
      REACT_APP_GITHUB_CLIENT_ID=${clientId}
    `),
  );
})();
