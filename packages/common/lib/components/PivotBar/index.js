var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import React from 'react';
import { withTheme } from 'styled-components';
import { Pivot, PivotItem, PivotLinkFormat, PivotLinkSize, } from 'office-ui-fabric-react/lib/Pivot';
import { PivotBarWrapper } from './styles';
var PivotBar = /** @class */ (function (_super) {
    __extends(PivotBar, _super);
    function PivotBar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onLinkClick = function (item) {
            var key = item.props.itemKey;
            if (key && key !== _this.props.selectedKey) {
                _this.props.onSelect(key);
            }
        };
        return _this;
    }
    PivotBar.prototype.render = function () {
        var _a = this.props, items = _a.items, selectedKey = _a.selectedKey, theme = _a.theme, backgroundColor = _a.backgroundColor, selectedColor = _a.selectedColor, hideUnderline = _a.hideUnderline;
        return (React.createElement(PivotBarWrapper, null,
            React.createElement(Pivot, { linkSize: PivotLinkSize.normal, linkFormat: PivotLinkFormat.tabs, onLinkClick: this.onLinkClick, selectedKey: selectedKey || undefined, styles: {
                    root: { backgroundColor: backgroundColor || theme.primaryDarker },
                    link: {
                        backgroundColor: backgroundColor || theme.primaryDarker,
                        selectors: {
                            ':hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
                            ':active': { backgroundColor: selectedColor || theme.primaryDarkest },
                        },
                    },
                    linkIsSelected: {
                        backgroundColor: selectedColor || theme.primaryDarkest,
                        selectors: {
                            ':before': {
                                borderBottom: (hideUnderline ? 0 : 2) + "px solid " + theme.white,
                            },
                        },
                    },
                    linkContent: { color: theme.white, fontWeight: '400' },
                } }, items.map(function (item) { return (React.createElement(PivotItem, { key: item.key, itemKey: item.key, linkText: item.text, itemIcon: item.iconName })); }))));
    };
    PivotBar.defaultProps = {
        hideUnderline: false,
    };
    return PivotBar;
}(React.Component));
export default withTheme(PivotBar);
//# sourceMappingURL=index.js.map