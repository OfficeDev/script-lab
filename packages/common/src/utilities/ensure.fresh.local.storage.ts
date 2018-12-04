const ensureFreshLocalStorage = (): void => {
  // Due to bug in IE (https://stackoverflow.com/a/40770399),
  // Local Storage may get out of sync across tabs.  To fix this,
  // set a value of some key, and this will ensure that localStorage is refreshed.
  window.localStorage.setItem('scriptlab_unused_key', '');
};

export default ensureFreshLocalStorage;
