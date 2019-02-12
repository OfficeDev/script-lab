import React from 'react';
import { ObjectInspector } from 'react-inspector';
import isError from 'lodash/isError';

export interface IProps {
  obj: any;
}

export default ({ obj }: IProps): JSX.Element => {
  if ((obj as any).toJSON) {
    return <ObjectInspector data={(obj as any).toJSON()} />;
  } else if (
    typeof OfficeExtension !== 'undefined' &&
    obj instanceof OfficeExtension.Error
  ) {
    return (
      <ObjectInspector
        data={obj}
        expandPaths={['$', '$.debugInfo', '$.debugInfo.surroundingStatements']}
      />
    );
  } else if (isError(obj)) {
    // cspell:ignore nonenumerable, nonenumerables
    // For errors, show the non-nonenumerables
    return (
      <ObjectInspector
        data={obj}
        showNonenumerable={true}
        expandLevel={1}
        sortObjectKeys={sortStackToTheBottom}
      />
    );
  } else {
    return <ObjectInspector data={obj} />;
  }
};

function sortStackToTheBottom(x: string, y: string): number {
  if (x === 'stack') {
    return 1;
  }
  if (y === 'stack') {
    return -1;
  }
  if (x < y) {
    return -1;
  }
  if (x > y) {
    return 1;
  }
  return 0;
}
