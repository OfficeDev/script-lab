import { Utilities, HostType, PlatformType } from '@microsoft/office-js-helpers';
import safeExternalUrls from 'common/lib/safe.external.urls';
import * as popoutControl from 'common/lib/utilities/popout.control';

export default function setup() {
  // SUPER IMPORTANT NOTE:  The add-in commands code doesn't do a redirect to localhost
  //   (or whatever other environment).  So it always runs in production.
  //   This is controlled by `skipRedirect: true` in `packages/editor/src/pages/index.tsx`.
  //   If you need to change this logic and test locally, sideload the localhost version.

  registerCommand('launchCode', event => {
    if (shouldOpenPopout()) {
      return popoutControl.openPopoutCodeEditor();
    } else {
      return launchInDialog(codeUrl, event, {
        width: 75,
        height: 75,
        displayInIframe: false,
      });
    }
  });

  registerCommand('launchTutorial', event => {
    if (shouldOpenPopout()) {
      return popoutControl.openPopoutTutorial(tutorialUrl);
    } else {
      return launchInDialog(tutorialUrl, event, { width: 35, height: 45 });
    }
  });

  registerCommand('launchHelp', event =>
    launchInStandaloneWindow(safeExternalUrls.playground_help, event),
  );

  registerCommand('launchAsk', event =>
    launchInStandaloneWindow(safeExternalUrls.ask, event),
  );

  registerCommand('launchApiDocs', event => {
    if (Office.context.requirements.isSetSupported('ExcelApi')) {
      return launchInStandaloneWindow(safeExternalUrls.excel_api, event);
    } else if (Office.context.requirements.isSetSupported('WordApi')) {
      return launchInStandaloneWindow(safeExternalUrls.word_api, event);
    } else if (Office.context.requirements.isSetSupported('OneNoteApi')) {
      return launchInStandaloneWindow(safeExternalUrls.onenote_api, event);
    } else {
      if (Utilities.host === HostType.POWERPOINT) {
        return launchInStandaloneWindow(safeExternalUrls.powepoint_api, event);
      } else if (Utilities.host === HostType.PROJECT) {
        return launchInStandaloneWindow(safeExternalUrls.project_api, event);
      } else if (Utilities.host === HostType.OUTLOOK) {
        return launchInStandaloneWindow(safeExternalUrls.outlook_api, event);
      } else {
        return launchInStandaloneWindow(safeExternalUrls.generic_api, event);
      }
    }
  });

  // Now that the functions are registered, call Office.onReady()
  return Office.onReady();
}

/////////////////////////////////

function registerCommand(
  manifestName: string,
  callback: (event: Office.AddinCommands.Event) => void,
) {
  (window as any)[manifestName] = callback;
}

const tutorialUrl = `${window.location.origin}/tutorial.html`;
const codeUrl = `${window.location.origin}/?mode=${Utilities.host}`;

function launchInDialog(
  url: string,
  event?: any,
  options?: { width?: number; height?: number; displayInIframe?: boolean },
  onSuccessCallback?: (dialog: Office.Dialog) => void,
): void {
  options = options || {};
  options.width = options.width || 60;
  options.height = options.height || 60;
  if (typeof options.displayInIframe === 'undefined') {
    options.displayInIframe = true;
  }
  Office.context.ui.displayDialogAsync(url, options, result => {
    if (Utilities.host === HostType.OUTLOOK) {
      if (result.status === Office.AsyncResultStatus.Failed) {
        event.completed();
      }
      const dialog = result.value;
      dialog.addEventHandler(Office.EventType.DialogEventReceived, () => {
        if (event) {
          event.completed();
        }
      });
    }

    if (onSuccessCallback && result.status === Office.AsyncResultStatus.Succeeded) {
      onSuccessCallback(result.value);
    }
  });
  if (event && Utilities.host !== HostType.OUTLOOK) {
    event.completed();
  }
}

function launchDialogNavigation(
  url: string,
  event: any,
  options?: { width?: number; height?: number; displayInIframe?: boolean },
  onSuccessCallback?: (dialog: Office.Dialog) => void,
): void {
  launchInDialog(
    `${window.location.origin}/#/external-page?destination=${encodeURIComponent(url)}`,
    event,
    options,
    onSuccessCallback,
  );
}

function launchInStandaloneWindow(url: string, event: any): void {
  // Launch a page that will direct the user to click a button to launch the actual page.
  // This method of indirection is required because:
  // * At least on desktop, it looks like you can't do "window.open" out of the invisible runner
  // * In the browser, a direct call to "window.open" would trigger a popup blocker
  launchDialogNavigation(
    url,
    event,
    { displayInIframe: true, width: 30, height: 30 },
    (dialog: Office.Dialog) => {
      dialog.addEventHandler(
        Office.EventType.DialogMessageReceived,
        (result: { message: string }) => {
          if (result.message === 'close') {
            dialog.close();
          }
        },
      );
    },
  );
}

function shouldOpenPopout(): boolean {
  return (
    Utilities.host === HostType.OUTLOOK &&
    Utilities.platform == PlatformType.OFFICE_ONLINE
  );
}
