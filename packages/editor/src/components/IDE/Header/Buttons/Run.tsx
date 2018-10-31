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
  defaultRunFunction: (solutionId: string, fileId: string, funcName: string) => void
  terminateAllDefaultRunFunctions: () => void

  theme: ITheme // from withTheme
}

export const getRunButton = ({
  isRunnableOnThisHost,
  isNullSolution,
  isCustomFunctionsView,
  navigateToCustomFunctions,
  isDefaultRunSolution,
  runnableFunctions,
  defaultRunFunction,
  terminateAllDefaultRunFunctions,
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
            key: 'functions-section',
            itemType: ContextualMenuItemType.Section,
            sectionProps: {
              // title: 'Functions',

              // TODO: There's a react duplicate keys error being thrown here, but I don't know why. Might be fabric bug?
              items: runnableFunctions.map(({ name, status }) => ({
                key: `function-${name}`,
                text: name,
                iconProps: { iconName: 'Play' },
                onRenderIcon: (props, defaultRender) => {
                  const inner = {
                    Idle: <Icon iconName="Play" style={{ color: '#98fb98' }} />,
                    Running: (
                      <Spinner size={SpinnerSize.xSmall} style={{ padding: '.1rem' }} />
                    ),
                    Success: <Icon iconName="Accept" style={{ color: '#98fb98' }} />,
                    Failure: <Icon iconName="Error" style={{ color: '#fd1532' }} />,
                  }[status]

                  return (
                    <div
                      style={{
                        marginLeft: '.4rem',
                        marginRight: '.4rem',
                        marginTop: '.2rem',
                      }}
                    >
                      {inner}
                    </div>
                  )
                },
                itemProps: {
                  styles: {
                    icon: {
                      color: '#98fb98',
                    },
                  },
                },
                onClick: event => {
                  event.preventDefault()
                  if (status !== 'Running') {
                    defaultRunFunction(solution.id, file.id, name)
                  }
                },
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
            onClick: event => {
              if (event) {
                event.preventDefault()
              }
              terminateAllDefaultRunFunctions()
            },
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
