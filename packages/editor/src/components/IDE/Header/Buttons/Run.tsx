import React from 'react';
import { ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { Icon } from 'office-ui-fabric-react/lib/Icon';

export interface IProps {
  isRunnableOnThisHost: boolean;
  isNullSolution: boolean;
  isCustomFunctionsView: boolean;
  solution: ISolution;
  file: IFile;

  navigateToCustomFunctions: () => void;

  navigateToRun: () => void;
  isNavigatingAwayToRun: boolean;
  showTrustError: () => void;

  theme: ITheme; // from withTheme
}

export const getRunButton = ({
  isRunnableOnThisHost,
  isNullSolution,
  isCustomFunctionsView,
  navigateToCustomFunctions,
  navigateToRun,
  solution,
  file,
  theme,
  isNavigatingAwayToRun,
  showTrustError,
}: IProps): ICommandBarItemProps | null => {
  if (!isRunnableOnThisHost || isNullSolution) {
    return null;
  }
  if (isCustomFunctionsView) {
    return {
      key: 'register-cf',
      text: 'Register',
      iconProps: { iconName: 'Play' },
      onClick: navigateToCustomFunctions,
    };
  } else {
    return {
      key: 'run',
      text: 'Run',
      iconProps: { iconName: 'Play' },
      onClick: () => (solution.options.isUntrusted ? showTrustError : navigateToRun)(),
      onRenderIcon: () => {
        return (
          <div
            style={{
              marginLeft: '.4rem',
              marginRight: '.4rem',
              marginTop: '.2rem',
            }}
          >
            {isNavigatingAwayToRun ? (
              <Spinner size={SpinnerSize.xSmall} style={{ padding: '.1rem' }} />
            ) : (
              <Icon iconName="Play" />
            )}
          </div>
        );
      },
    };
  }
};
