import { merge } from '../sagas'
import { allowedSettings } from '../../../SettingsJSONSchema'
import { defaultSettings } from '../../../defaultSettings'

describe('settings merge', () => {
  test('basic test', () => {
    const current = { ...defaultSettings }
    const parsed = {
      editor: { theme: 'light' },
    }

    const expected = { ...current }
    expected.editor.theme = 'light'

    expect(merge(current, parsed, allowedSettings)).toEqual(expected)
  })

  test('nested', () => {
    const current = { ...defaultSettings }
    const parsed = {
      editor: { theme: 'light', font: { family: 'Consolas', size: 17 } },
    }

    const expected = { ...current }
    expected.editor.theme = 'light'
    expected.editor.font.family = 'Consolas'
    expected.editor.font.size = 17

    expect(merge(current, parsed, allowedSettings)).toEqual(expected)
  })

  test('basic unsupported setting', () => {
    const current = { ...defaultSettings }
    const parsed = {
      editor: { theme: 'rainbows' },
    }

    const expected = { ...current }

    expect(merge(current, parsed, allowedSettings)).toEqual(expected)
  })

  test('more advanced unsupported setting', () => {
    const current = { ...defaultSettings }
    const parsed = {
      editor: { theme: 'rainbows', font: { family: 'Comic Sans MS', size: 72 } },
    }

    const expected = { ...current }
    expected.editor.font.size = 72

    expect(merge(current, parsed, allowedSettings)).toEqual(expected)
  })

  test('advanced nested', () => {
    const current = { ...defaultSettings }
    const parsed = {
      editor: {
        theme: 'light',
        font: { family: 'Consolas', size: 17, lineHeight: 32 },
        linter: { mode: 'warning' },
        tabSize: 4,
        prettier: false,
      },
      hostSpecific: {
        officeOnline: {
          openEditorInNewTab: 'always',
        },
      },
    }

    const expected = { ...current }
    expected.editor.theme = 'light'
    expected.editor.font.family = 'Consolas'
    expected.editor.font.size = 17
    expected.editor.font.lineHeight = 32
    expected.editor.tabSize = 4
    expected.editor.prettier = false
    expected.hostSpecific.officeOnline.openEditorInNewTab = 'always'

    expect(merge(current, parsed, allowedSettings)).toEqual(expected)
  })
})
