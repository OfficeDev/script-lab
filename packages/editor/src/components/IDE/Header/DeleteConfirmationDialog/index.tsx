import React from 'react'
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog'
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button'

interface IProps {
  isVisible: boolean
  solutionName: string
  onYes: () => void
  onCancel: () => void
}

const DeleteConfirmationDialog = (props: IProps) => (
  <Dialog
    isDarkOverlay={true}
    hidden={!props.isVisible}
    onDismiss={props.onCancel}
    dialogContentProps={{
      type: DialogType.largeHeader,
      title: 'Delete Snippet?',
      subText: `Are you sure you want to delete '${props.solutionName}'?`,
    }}
    modalProps={{ isBlocking: true }}
  >
    <DialogFooter>
      <PrimaryButton text="Yes" onClick={props.onYes} />
      <DefaultButton text="No" onClick={props.onCancel} />
    </DialogFooter>
  </Dialog>
)

export default DeleteConfirmationDialog
