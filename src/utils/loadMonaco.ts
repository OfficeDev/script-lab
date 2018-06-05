export function loadMonaco(): Promise<void> {
  return new Promise(resolve => {
    const require = (window as any).require

    require.config({ paths: { vs: '../vs' } })

    require(['vs/editor/editor.main'], resolve)
  })
}
