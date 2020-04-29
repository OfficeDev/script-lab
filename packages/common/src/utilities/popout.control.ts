import queryString from 'query-string';
import { Utilities, HostType, PlatformType } from '@microsoft/office-js-helpers';
import { currentEditorUrl } from '../environment';
import { invokeGlobalErrorHandler } from './splash.screen';
import { ScriptLabError } from './error';

const IS_DIALOG_QUERY_PARAMETER = 'isDialog';

export function shouldShowPopoutControl(context: 'editor' | 'runner'): boolean {
  // If already is popped out in a dialog, don't show the popout control
  if (isPoppedOut()) {
    return false;
  }

  // For Outlook's activation model, this is necessary feature work.
  // So always show it, even despite some limitations (see more below).
  if (Utilities.host === HostType.OUTLOOK) {
    return true;
  }

  // On desktop, decided not to show it because on that platform,
  // you can just resize the taskpane (or even drag it out!).
  // And relative to a popped-out taskpane, this has a few advantages:
  // 1. With a dialog, closing the underlying "run" pane (to which the taskpane redirects)
  //       closes the editor, which is awkward.
  // 2. With a dialog, re-clicking on "Code" in the ribbon (e.g. accidentally)
  //       also closes the popped-out editor, which is unexpected
  // 3. With a dialog, the "Run" actually happens inside a pane called "Code", which is awkward
  // 4. Clicking on "Run" in the ribbon produces two runners, which is confusing.

  // On the Mac (at least for Excel/Word/PPT), it doesn't seem to work
  // (due to some interaction between Office.js and our routing behavior),
  // and it's not worth it for now to try to investigate.
  // See https://github.com/OfficeDev/script-lab/issues/578.

  // Thus, for Word/Excel/PPT, only enabling it where we tested it and where it's most useful
  // which is ONLY Office Online.  And note that we're only enabling it from the editor,
  // since allowing popping out from both can lead to strange behaviors (multiple dialogs
  // if you open it from both Editor + Runner, and a reloading of the "runner" pane)
  return context === 'editor' && Utilities.platform === PlatformType.OFFICE_ONLINE;
}

export function openPopoutCodeEditor(
  { onSuccess }: { onSuccess: () => void } = { onSuccess: () => {} },
) {
  Office.context.ui.displayDialogAsync(
    getPopoutEditorUrl(),
    {
      height: 60,
      width: 60,
      promptBeforeOpen: false,
    },
    (result: Office.AsyncResult<any>) => {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        onSuccess();
      } else {
        console.error(result);
        invokeGlobalErrorHandler(
          new ScriptLabError(
            'Could not open a standalone code editor window: ' + result.error.message,
          ),
        );
      }
    },
  );
}

export function openPopoutTutorial(
  tutorialUrl: string,
  { onSuccess }: { onSuccess: () => void } = { onSuccess: () => {} },
) {
  Office.context.ui.displayDialogAsync(
    tutorialUrl,
    {
      height: 60,
      width: 60,
      promptBeforeOpen: false,
    },
    (result: Office.AsyncResult<any>) => {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        onSuccess();
      } else {
        console.error(result);
        invokeGlobalErrorHandler(
          new ScriptLabError(
            'Could not open a standalone tutorial window: ' + result.error.message,
          ),
        );
      }
    },
  );
}

export function isPoppedOut(): boolean {
  const params: { [key: string]: any } = queryString.parse(window.location.search);
  return params[IS_DIALOG_QUERY_PARAMETER] ? true : false;
}

function getPopoutEditorUrl() {
  const queryParams: { [key: string]: any } = queryString.parse(window.location.search);

  // Now re-add it:
  queryParams[IS_DIALOG_QUERY_PARAMETER] = 1;

  return currentEditorUrl + '?' + queryString.stringify(queryParams);
}
