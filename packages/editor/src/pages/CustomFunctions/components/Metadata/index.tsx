import React from 'react';

import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { getJsonMetadataString } from '../App/utilities';
import {
  getAllowCustomDataForDataTypeAny,
} from '../../../../utils/custom-functions';
export interface IProps {
  items: Array<ICustomFunctionParseResult<null>> | null;
}

const height100Percent = { height: '100%' };

export const Metadata = ({ items }: IProps) => (
  <TextField
    readOnly
    resizable={false}
    multiline
    value={getJsonMetadataString(items, {
      allowCustomDataForDataTypeAny: getAllowCustomDataForDataTypeAny()
    })}
    style={{ fontFamily: 'Consolas, monaco, monospace' }}
    styles={{
      root: height100Percent,
      wrapper: { ...height100Percent, border: 0 },
      fieldGroup: height100Percent,
      field: height100Percent,
    }}
  />
);

export default Metadata;
