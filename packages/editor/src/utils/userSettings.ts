export const USER_SETTINGS_LOCAL_STORAGE_KEY = 'userSettings';

export function getUserSettings() {
  return JSON.parse(localStorage.getItem(USER_SETTINGS_LOCAL_STORAGE_KEY) || '{}');
}
