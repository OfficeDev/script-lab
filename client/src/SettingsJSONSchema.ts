export const allowedSettings = {
  editor: {
    theme: ['dark', 'light', 'high-contrast'],
    font: {
      family: ['Menlo', 'Consolas', 'Courier New', 'Source Code Pro'],
    },
    linter: {
      mode: ['warning', 'error', 'none'],
    },
  },
  hostSpecific: {
    officeOnline: {
      openEditorInNewTab: ['prompt', 'always', 'never'],
    },
  },
  defaultActions: {
    applySettings: ['prompt', 'immediate'],
    gistImport: ['prompt', 'open', 'copy', 'overwrite'],
  },
}

// Note: this must be kept in sync with the interfaces in src/interfaces/index.d.ts
export default {
  $id: 'http://todo.com/example.json',
  description: 'Schema for the settings of Script Lab',
  type: 'object',
  definitions: {},
  $schema: 'http://json-schema.org/draft-07/schema#',
  properties: {
    editor: {
      $id: '/properties/editor',
      type: 'object',
      properties: {
        theme: {
          $id: '/properties/editor/properties/theme',
          type: 'string',
          default: allowedSettings.editor.theme[0],
          enum: allowedSettings.editor.theme,
        },
        font: {
          $id: '/properties/editor/properties/font',
          type: 'object',
          properties: {
            family: {
              $id: '/properties/editor/properties/font/properties/family',
              type: 'string',
              default: allowedSettings.editor.font.family[0],
              enum: allowedSettings.editor.font.family,
            },
            size: {
              $id: '/properties/editor/properties/font/properties/size',
              type: 'integer',
              default: 18,
              examples: [16, 18, 24],
            },
            lineHeight: {
              $id: '/properties/editor/properties/font/properties/lineHeight',
              type: 'integer',
              default: 24,
              examples: [18, 24, 36],
            },
          },
        },
        minimap: {
          $id: '/properties/editor/properties/minimap',
          type: 'boolean',
          default: false,
          examples: [false, true],
        },
        tabSize: {
          $id: '/properties/editor/properties/tabSize',
          type: 'integer',
          default: 4,
          examples: [2, 4],
        },
        prettier: {
          $id: '/properties/editor/properties/prettier',
          type: 'boolean',
          default: true,
          examples: [true, false],
        },
        folding: {
          $id: '/properties/editor/properties/folding',
          type: 'boolean',
          default: true,
          examples: [true, false],
        },
        linter: {
          $id: '/properties/editor/properties/linter',
          type: 'object',
          properties: {
            mode: {
              $id: '/properties/editor/properties/linter/properties/mode',
              type: 'string',
              default: allowedSettings.editor.linter.mode[0],
              enum: allowedSettings.editor.linter.mode,
            },
          },
        },
      },
    },
    hostSpecific: {
      $id: '/properties/hostSpecific',
      type: 'object',
      properties: {
        officeOnline: {
          $id: '/properties/hostSpecific/properties/officeOnline',
          type: 'object',
          properties: {
            openEditorInNewTab: {
              $id:
                '/properties/hostSpecific/properties/officeOnline/properties/openEditorInNewTab',
              type: 'string',
              default: allowedSettings.hostSpecific.officeOnline.openEditorInNewTab[0],
              enum: allowedSettings.hostSpecific.officeOnline.openEditorInNewTab,
            },
          },
        },
      },
    },
    defaultActions: {
      $id: '/properties/defaultActions',
      type: 'object',
      properties: {
        applySettings: {
          $id: '/properties/defaultActions/properties/applySettings',
          type: 'string',
          default: allowedSettings.defaultActions.applySettings[0],
          enum: allowedSettings.defaultActions.applySettings,
        },
        gistImport: {
          $id: '/properties/defaultActions/properties/gistImport',
          type: 'string',
          default: allowedSettings.defaultActions.gistImport[0],
          enum: allowedSettings.defaultActions.gistImport,
        },
      },
    },
  },
}
