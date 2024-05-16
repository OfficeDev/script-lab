import { currentEditorUrl } from "common/build/environment";
import { Utilities, HostType, PlatformType } from "common/build/helpers/officeJsHost";
import { safeExternalUrls } from "common/build/safeExternalUrls";
import { hideSplashScreen } from "common/build/utilities/splash.screen";

const codeUrl = `${currentEditorUrl}/index.html?mode=${Utilities.host}`;

export default function setup() {
  // SUPER IMPORTANT NOTE:  The add-in commands code doesn't do a redirect to localhost
  //   (or whatever other environment).  So it always runs in production.
  //   This is controlled by `skipRedirect: true` in `packages/editor/src/pages/index.tsx`.
  //   If you need to change this logic and test locally, sideload the localhost version.

  registerCommand("launchCode", (event) => {
    if (isOutlookOnline()) {
      hideSplashScreen();
      launchDialog(codeUrl, event, { displayInIframe: false, width: 60, height: 60 });
    } else {
      return launchDialog(codeUrl, event, {
        width: 75,
        height: 75,
        displayInIframe: false,
      });
    }
  });

  registerCommand("launchHelp", (event) =>
    launchInStandaloneWindow(safeExternalUrls.tutorial, event),
  );

  registerCommand("launchAsk", (event) => launchInStandaloneWindow(safeExternalUrls.ask, event));

  registerCommand("launchApiDocs", (event) => {
    let url = safeExternalUrls.generic_api;

    if (Office.context.requirements.isSetSupported("ExcelApi")) {
      url = safeExternalUrls.excel_api;
    } else if (Office.context.requirements.isSetSupported("WordApi")) {
      url = safeExternalUrls.word_api;
    } else if (Office.context.requirements.isSetSupported("OneNoteApi")) {
      url = safeExternalUrls.onenote_api;
    } else if (Utilities.host === HostType.POWERPOINT) {
      url = safeExternalUrls.powepoint_api;
    } else if (Utilities.host === HostType.PROJECT) {
      url = safeExternalUrls.project_api;
    } else if (Utilities.host === HostType.OUTLOOK) {
      url = safeExternalUrls.outlook_api;
    } else {
      url = safeExternalUrls.generic_api;
    }
    return launchInStandaloneWindow(url, event);
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

function launchDialog(
  url: string,
  event?: any,
  options?: { width?: number; height?: number; displayInIframe?: boolean },
): void {
  const onSuccessCallback: (dialog: Office.Dialog) => void = (dialog: Office.Dialog) => {
    dialog.addEventHandler(
      Office.EventType.DialogMessageReceived,
      (result: { message: string }) => {
        if (result.message === "close") {
          dialog.close();
        }
      },
    );
  };

  options = options || {};
  options.width = options.width || 60;
  options.height = options.height || 60;
  if (typeof options.displayInIframe === "undefined") {
    options.displayInIframe = true;
  }
  Office.context.ui.displayDialogAsync(url, options, (result) => {
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

// Launch a page that will direct the user to click a button to launch the actual page.
// This method of indirection is required because:
// * At least on desktop, it looks like you can't do "window.open" out of the invisible runner
// * In the browser, a direct call to "window.open" would trigger a popup blocker
function launchInStandaloneWindow(url: string, event: any): void {
  const dialogUrl = `${currentEditorUrl}/index.html#/external-page?destination=${encodeURIComponent(
    url,
  )}`;

  const dialogOptions = { displayInIframe: true, width: 30, height: 30 };

  launchDialog(dialogUrl, event, dialogOptions);
}

function isOutlookOnline(): boolean {
  return Utilities.host === HostType.OUTLOOK && Utilities.platform === PlatformType.OFFICE_ONLINE;
}
