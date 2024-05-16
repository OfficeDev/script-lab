import { getUserSettings } from "./userSettings";

export function getPythonConfigIfAny(): IPythonConfig | null {
  const userSettings = getUserSettings();
  const allJupyterSettings = ["jupyter.url", "jupyter.token", "jupyter.notebook"].map(
    (settingName) => userSettings[settingName],
  );

  const countOfFilledOutSettings = allJupyterSettings.filter(
    (value: string) => value && value.length > 0,
  ).length;
  if (countOfFilledOutSettings < allJupyterSettings.length) {
    return null;
  }

  const [url, token, notebook] = allJupyterSettings;
  return { url, token, notebook };
}
