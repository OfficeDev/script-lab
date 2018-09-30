import React from 'react'
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog'
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button'

interface IProps {
  isHidden: boolean
  onDismiss: () => void
  apply: () => void
  cancel: () => void
  open: () => void
}

const SettingsNotAppliedDialog = (props: IProps) => (
  <Dialog
    isDarkOverlay={true}
    hidden={props.isHidden}
    onDismiss={props.onDismiss}
    dialogContentProps={{
      type: DialogType.largeHeader,
      title: 'Save changes?',
      subText:
        "It looks like you made an edit to your settings that you didn't apply. Would you like to apply these changes?",
    }}
    modalProps={{ isBlocking: true }}
  >
    <DialogFooter>
      <PrimaryButton text="Apply" onClick={props.apply} />
      <DefaultButton text="Cancel" onClick={props.cancel} />
      <DefaultButton text="Open" onClick={props.open} />
    </DialogFooter>
  </Dialog>
)

export default SettingsNotAppliedDialog
