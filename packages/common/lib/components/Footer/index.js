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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import React from 'react';
import { withTheme } from 'styled-components';
import merge from 'lodash/merge';
import { Customizer } from 'office-ui-fabric-react/lib/Utilities';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { getCommandBarFabricTheme } from '../../theme';
import { Wrapper } from './styles';
var Footer = function (props) {
    var items = props.items
        .filter(function (_a) {
        var hidden = _a.hidden;
        return !hidden;
    })
        .map(function (item) {
        return merge(item, __assign({}, (item.subMenuProps
            ? {
                subMenuProps: {
                    isBeakVisible: true,
                    shouldFocusOnMount: true,
                    styles: {
                        root: {
                            backgroundColor: props.theme.primary,
                            color: props.theme.white,
                        },
                    },
                    items: item.subMenuProps && item.submenuProps.items
                        ? item.subMenuProps.items.map(function (subItem) {
                            return merge(subItem, {
                                itemProps: {
                                    styles: {
                                        root: {
                                            background: props.theme.primary,
                                            selectors: {
                                                ':hover': {
                                                    background: props.theme.primaryDark,
                                                },
                                                ':active': {
                                                    background: props.theme.primaryDarker,
                                                },
                                            },
                                        },
                                        label: {
                                            color: props.theme.white,
                                        },
                                    },
                                },
                            });
                        })
                        : [],
                },
            }
            : {}), { style: { fontSize: '1.2rem' } }));
    });
    var theme = props.theme, propsNoTheme = __rest(props, ["theme"]);
    var mergedProps = merge(__assign({}, propsNoTheme, { items: items }), {
        styles: {
            root: {
                paddingLeft: 0,
                paddingRight: 0,
                height: '2rem',
            },
        },
    });
    return (React.createElement(Customizer, { settings: { theme: getCommandBarFabricTheme(props.theme) } },
        React.createElement(Wrapper, null,
            React.createElement(CommandBar, __assign({}, mergedProps)))));
};
export default withTheme(Footer);
//# sourceMappingURL=index.js.map