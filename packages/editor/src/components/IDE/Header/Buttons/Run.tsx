import React from 'react'
import { ContextualMenuItemType } from 'office-ui-fabric-react/lib/ContextualMenu'
import { ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar'
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner'
import { Icon } from 'office-ui-fabric-react/lib/Icon'

interface IProps {
  isRunnableOnThisHost: boolean
  isNullSolution: boolean
  isCustomFunctionsView: boolean
  isDefaultRunSolution: boolean
  runnableFunctions: IDefaultFunctionRunMetadata[]
  solution: ISolution
  file: IFile

  navigateToCustomFunctions: () => void

  theme: ITheme // from withTheme
}

export const getRunButton = ({
  isRunnableOnThisHost,
  isNullSolution,
  isCustomFunctionsView,
  navigateToCustomFunctions,
  isDefaultRunSolution,
  runnableFunctions,
  solution,
  file,
  theme,
}: IProps): ICommandBarItemProps | null => {
  if (!isRunnableOnThisHost || isNullSolution) {
    return null
  }
  if (isCustomFunctionsView) {
    return {
      key: 'register-cf',
      text: 'Register',
      iconProps: { iconName: 'Play' },
      onClick: navigateToCustomFunctions,
    }
  } else if (isDefaultRunSolution) {
    return {
      key: 'default-run-functions',
      text: 'Run',
      iconProps: { iconName: 'Play' },
      subMenuProps: {
        items: [
          {
            key: 'functions-setion',
            itemType: ContextualMenuItemType.Section,
            sectionProps: {
              // title: 'Functions',
              items: runnableFunctions.map(({ name, status }) => ({
                key: name,
                text: name,
                iconProps: { iconName: 'Play' },
                onRenderIcon: (props, defaultRender) => {
                  const inner =
                    status === 'Idle' ? (
                      <Spinner size={SpinnerSize.small} />
                    ) : (
                      <Icon iconName="Play" style={{ color: '#98fb98' }} />
                    )
                  return (
                    <div style={{ marginLeft: '4px', marginRight: '4px' }}>{inner}</div>
                  )
                },
                itemProps: {
                  styles: {
                    icon: {
                      color: '#98fb98',
                    },
                  },
                },
                onClick: event => event.preventDefault(),
              })),
            },
          },
          {
            key: 'divider',
            itemType: ContextualMenuItemType.Divider,
            itemProps: {
              styles: {
                divider: {
                  backgroundColor: theme.neutralSecondaryLight,
                },
              },
            },
          },
          {
            key: 'terminate-all',
            text: 'Terminate All',
            iconProps: { iconName: 'Cancel' },
            itemProps: {
              styles: {
                icon: {
                  color: '#fd1532',
                },
              },
            },
          },
        ],
      },
    }
  } else {
    return {
      key: 'run',
      text: 'Run',
      iconProps: { iconName: 'Play' },
      href: '/run.html',
    }
  }
}
