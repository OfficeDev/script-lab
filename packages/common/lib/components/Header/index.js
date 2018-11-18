var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React from 'react';
import merge from 'lodash/merge';
import { Customizer } from 'office-ui-fabric-react/lib/Utilities';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { getCommandBarFabricTheme } from '../../theme';
import { getPlatform, PlatformType } from '../../platform';
var Header = function (props) {
    var _a;
    return (React.createElement(Customizer, { settings: { theme: getCommandBarFabricTheme(props.theme) } },
        React.createElement(CommandBar, __assign({}, merge(props, {
            styles: {
                root: {
                    paddingLeft: 0,
                    paddingRight: (_a = {},
                        _a[PlatformType.PC] = '20px',
                        _a[PlatformType.Mac] = '40px',
                        _a[PlatformType.OfficeOnline] = '0px',
                        _a)[getPlatform()],
                },
            },
        })))));
};
export default Header;
//# sourceMappingURL=index.js.map