import { merge } from '../settings'
import { allowedSettings } from '../../SettingsJSONSchema'
import { defaultSettings } from '../../defaultSettings'

describe('settings merge', () => {
  test('one', () => {
    const current = { ...defaultSettings }
    const parsed = {
      editor: { theme: 'light' },
    }

    const expected = { ...current }
    expected.editor.theme = 'light'

    expect(merge(current, parsed, allowedSettings)).toEqual(expected)
  })
})
