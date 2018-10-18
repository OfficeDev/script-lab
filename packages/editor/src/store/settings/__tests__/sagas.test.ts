import { merge } from '../sagas'
import { allowedSettings, defaultSettings } from '../../../settings'

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

    expect(() => merge(current, parsed, allowedSettings)).toThrow()
  })

  test('more advanced unsupported setting', () => {
    const current = { ...defaultSettings }
    const parsed = {
      editor: { theme: 'rainbows', font: { family: 'Comic Sans MS', size: 72 } },
    }

    const expected = { ...current }
    expected.editor.font.size = 72

    expect(() => merge(current, parsed, allowedSettings)).toThrow()
  })

  test('advanced nested', () => {
    const current = { ...defaultSettings }
    const parsed = {
      editor: {
        theme: 'light',
        font: { family: 'Consolas', size: 17 },
        tabSize: 4,
        prettier: {
          enabled: false,
          autoFormat: false,
        },
      },
    }

    const expected = { ...current }
    expected.editor.theme = 'light'
    expected.editor.font.family = 'Consolas'
    expected.editor.font.size = 17
    expected.editor.tabSize = 4
    expected.editor.prettier = { enabled: false, autoFormat: false }

    expect(merge(current, parsed, allowedSettings)).toEqual(expected)
  })
})
