import React from 'react';
import {
  render,
  fireEvent,
  cleanup,
  renderWithReduxAndRouter,
} from '../../../../../utils/test-utils';

import FileSwitcherPivot from './';

const setup = () => {
  const initialState = {
    solutions: {
      metadata: {
        'a676df2c-3062-4b0c-ac48-c855e4bc4087': {
          options: {},
          id: 'a676df2c-3062-4b0c-ac48-c855e4bc4087',
          name: 'Blank snippet',
          host: 'WEB',
          description: 'Create a new snippet from a blank template.',
          dateCreated: 1539737668489,
          dateLastModified: 1539737668489,
          files: [
            '121b1c13-ce96-487e-b99d-e984126983d2',
            '750711ee-7a58-48ee-823a-8c93c9191b81',
            'b485b258-2695-4b8f-80a2-62777cc93a50',
            '0dcdae52-b806-4535-9d0d-339aeb7b83c6',
          ],
        },
        'user-settings': {
          id: 'user-settings',
          name: 'Settings',
          options: {},
          dateCreated: 1543143427440,
          dateLastModified: 1543143427440,
          host: 'ALL',
          files: ['user-settings-file', 'default-settings-file', 'about'],
        },
      },
      files: {
        settings: {
          id: 'settings',
          name: 'Settings',
          dateCreated: 1539739146490,
          dateLastModified: 1539739146490,
          language: 'JSON',
          content:
            '{\n  "editor": {\n    "theme": "dark",\n    "font": {\n      "family": "Menlo",\n      "size": 14,\n      "lineHeight": 19\n    },\n    "minimap": false,\n    "tabSize": 2,\n    "prettier": {\n      "enabled": true,\n      "autoFormat": true\n    },\n    "folding": true,\n    "linter": {\n      "mode": "warning"\n    },\n    "wordWrap": "bounded",\n    "wordWrapColumn": 80\n  },\n  "hostSpecific": {\n    "officeOnline": {\n      "openEditorInNewTab": "prompt"\n    }\n  },\n  "defaultActions": {\n    "applySettings": "prompt",\n    "gistImport": "prompt"\n  },\n  "environment": "local"\n}\n',
        },
        '121b1c13-ce96-487e-b99d-e984126983d2': {
          id: '121b1c13-ce96-487e-b99d-e984126983d2',
          name: 'index.ts',
          content:
            '$("#run").click(run);\n\nfunction run() {\n    OfficeHelpers.UI.notify("Your code goes here");\n}\n',
          language: 'typescript',
          dateCreated: 1539737668489,
          dateLastModified: 1539737668489,
        },
        '750711ee-7a58-48ee-823a-8c93c9191b81': {
          id: '750711ee-7a58-48ee-823a-8c93c9191b81',
          name: 'index.html',
          content:
            '<button id="run" class="ms-Button">\n    <span class="ms-Button-label">Run</span>\n</button>\n',
          language: 'html',
          dateCreated: 1539737668489,
          dateLastModified: 1539737668489,
        },
        'b485b258-2695-4b8f-80a2-62777cc93a50': {
          id: 'b485b258-2695-4b8f-80a2-62777cc93a50',
          name: 'index.css',
          content: '/* Your style goes here */\n',
          language: 'css',
          dateCreated: 1539737668489,
          dateLastModified: 1539737668489,
        },
        '0dcdae52-b806-4535-9d0d-339aeb7b83c6': {
          id: '0dcdae52-b806-4535-9d0d-339aeb7b83c6',
          name: 'libraries.txt',
          content:
            'office-ui-fabric-js@1.4.0/dist/css/fabric.min.css\noffice-ui-fabric-js@1.4.0/dist/css/fabric.components.min.css\n\ncore-js@2.4.1/client/core.min.js\n@types/core-js\n\n@microsoft/office-js-helpers@0.7.4/dist/office.helpers.min.js\n@microsoft/office-js-helpers@0.7.4/dist/office.helpers.d.ts\n\njquery@3.1.1\n@types/jquery\n',
          language: 'libraries',
          dateCreated: 1539737668489,
          dateLastModified: 1539737668489,
        },
        'user-settings-file': {
          id: 'user-settings-file',
          name: 'User Settings',
          dateCreated: 1543143427440,
          dateLastModified: 1543143427440,
          language: 'JSON',
          content: '{}\n',
        },
        'default-settings-file': {
          id: 'default-settings-file',
          name: 'Default Settings',
          dateCreated: 1543143427440,
          dateLastModified: 1543143427440,
          language: 'JSON',
          content:
            '{\n  "editor.theme": "dark",\n  "editor.fontFamily": "Menlo",\n  "editor.fontSize": 14,\n  "editor.minimap": false,\n  "editor.tabSize": 2,\n  "editor.prettier": true,\n  "editor.prettier.autoFormat": true,\n  "editor.folding": true,\n  "editor.wordWrap": "bounded"\n}\n',
        },
        about: {
          id: 'about',
          name: 'About',
          dateCreated: 1543143427440,
          dateLastModified: 1543143427440,
          language: 'plaintext',
          content:
            'Last Updated: now\nCommit: https://github.com/OfficeDev/script-lab-react/commits/1337\nEnvironment: local',
        },
      },
    },
    settings: { userSettings: {}, lastActive: { solutionId: null, fileId: null } },
    github: { profilePicUrl: null, username: null, token: null, isLoggingInOrOut: false },
    editor: {
      isVisible: true,
      hasLoaded: true,
      active: {
        solutionId: 'a676df2c-3062-4b0c-ac48-c855e4bc4087',
        fileId: 'b485b258-2695-4b8f-80a2-62777cc93a50',
      },
    },
    host: 'WEB',
  };

  return renderWithReduxAndRouter(<FileSwitcherPivot />, { initialState });
};

test('it should be able to switch files', () => {
  const { getByText, store } = setup();
  fireEvent.click(getByText(/script/i));

  expect(store.getState().editor.active).toEqual({
    solutionId: 'a676df2c-3062-4b0c-ac48-c855e4bc4087',
    fileId: '121b1c13-ce96-487e-b99d-e984126983d2',
  });
});
