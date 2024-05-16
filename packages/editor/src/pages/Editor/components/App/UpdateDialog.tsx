import React, { useState } from "react";
import Dialog, { DialogType, DialogFooter } from "office-ui-fabric-react/lib/Dialog";
import { DefaultButton, PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Label } from "office-ui-fabric-react/lib/Label";
import {
  getLocalStorageOption,
  localStorageKeys,
  setLocalStorageOption,
} from "common/build/constants";

const blogPostUrl = "https://aka.ms/script-lab-blog-post";

export function UpdateDialog() {
  const hide = getLocalStorageOption(localStorageKeys.enableHideUpdateDialog);
  const [open, setOpen] = useState(!hide);

  const onReadBlog = () => {
    setOpen(false);
    window.open(blogPostUrl, "_blank");
    setLocalStorageOption(localStorageKeys.enableHideUpdateDialog, true);
  };

  const onOk = () => {
    setOpen(false);
    setLocalStorageOption(localStorageKeys.enableHideUpdateDialog, true);
  };

  const title = "Important changes";
  const lineOne = "We've updated Script Lab.";
  const lineTwo = "GitHub integration has been removed.";
  const lineThree = "Your snippets may be missing.";
  return (
    <Dialog
      hidden={!open}
      dialogContentProps={{
        type: DialogType.normal,
        title,
      }}
      modalProps={{
        isBlocking: true,
      }}
    >
      <Label>{lineOne}</Label>

      <Label>{lineTwo}</Label>

      <Label>{lineThree}</Label>
      <Label>
        <a href={blogPostUrl} target="_blank" rel="noreferrer">
          Read our blog post
        </a>
        {"."}
      </Label>

      <DialogFooter>
        <DefaultButton onClick={onOk} text="Ok" />
        <PrimaryButton onClick={onReadBlog} text="Read Blog" />
      </DialogFooter>
    </Dialog>
  );
}
