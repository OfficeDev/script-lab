var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { HostType } from '@microsoft/office-js-helpers';
import Color from 'color';
import { loadTheme, createTheme } from 'office-ui-fabric-react/lib/Styling';
var neutralColors = {
    black: '#000000',
    neutralDarker: '#1e1e1e',
    neutralDark: '#212121',
    neutralPrimary: '#333333',
    neutralSecondary: '#666666',
    neutralSecondaryLight: '#888888',
    neutralLight: '#eaeaea',
    neutralLighter: '#f4f4f4',
    white: '#ffffff',
};
export var getCommandBarFabricTheme = function (host) {
    var theme = getTheme(host);
    return createTheme({
        palette: {
            themePrimary: theme.white,
            themeDarkAlt: theme.neutralLighter,
            neutralLighter: theme.primary,
            neutralLight: theme.primaryDark,
            neutralQuaternaryAlt: theme.primaryLight,
            neutralSecondary: theme.white,
            neutralPrimary: theme.white,
            neutralDark: theme.neutralLighter,
            black: theme.white,
            white: theme.neutralSecondary,
        },
    });
};
export var getTheme = function (host) {
    var primary = primaryColors[host] || primaryColors[HostType.WEB];
    var primaryColor = Color(primary);
    return __assign({ primaryDarkest: primaryColor.darken(0.6).hex(), primaryDarker: primaryColor.darken(0.5).hex(), primaryDark: primaryColor.darken(0.3).hex(), primary: primaryColor.hex(), primaryLight: primaryColor.lighten(0.3).hex(), primaryLighter: primaryColor.lighten(0.5).hex(), primaryLightest: primaryColor.lighten(0.6).hex() }, neutralColors);
};
var primaryColors = (_a = {},
    _a[HostType.WEB] = '#0078d4',
    _a[HostType.ACCESS] = '#B7472A',
    _a[HostType.EXCEL] = '#217346',
    _a[HostType.ONENOTE] = '#80397B',
    _a[HostType.OUTLOOK] = '#0173C7',
    _a[HostType.POWERPOINT] = '#B7472A',
    _a[HostType.PROJECT] = '#217346',
    _a[HostType.WORD] = '#2B579A',
    _a);
// todo reconcile these two
export var fabricTheme = {
    themePrimary: '#217346',
    themeLighterAlt: '#f2f9f5',
    themeLighter: '#cee9da',
    themeLight: '#a8d5bc',
    themeTertiary: '#62ab83',
    themeSecondary: '#318456',
    themeDarkAlt: '#1e673f',
    themeDark: '#195735',
    themeDarker: '#134027',
    neutralLighterAlt: '#f8f8f8',
    neutralLighter: '#f4f4f4',
    neutralLight: '#eaeaea',
    neutralQuaternaryAlt: '#dadada',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c8c8',
    neutralTertiary: '#c2c2c2',
    neutralSecondary: '#858585',
    neutralPrimaryAlt: '#4b4b4b',
    neutralPrimary: '#333',
    neutralDark: '#272727',
    black: '#1d1d1d',
    white: '#fff',
    primaryBackground: '#fff',
    primaryText: '#333',
    bodyBackground: '#fff',
    bodyText: '#333',
    disabledBackground: '#f4f4f4',
    disabledText: '#c8c8c8',
};
export var setupFabricTheme = function (host) {
    var theme = getTheme(host);
    var fabricTheme = {
        themePrimary: theme.primary,
        themeLighterAlt: theme.neutralLighter,
        themeLighter: theme.primaryLightest,
        themeLight: theme.primaryLighter,
        themeTertiary: theme.primaryLight,
        themeSecondary: theme.primary,
        themeDarkAlt: theme.primaryDark,
        themeDark: theme.primaryDarker,
        themeDarker: theme.primaryDarkest,
        neutralLighterAlt: theme.neutralLighter,
        neutralLighter: theme.neutralLighter,
        neutralLight: theme.neutralLight,
        neutralQuaternaryAlt: '#dadada',
        neutralQuaternary: '#d0d0d0',
        neutralTertiaryAlt: '#c8c8c8',
        neutralTertiary: '#c2c2c2',
        neutralSecondary: '#858585',
        neutralPrimaryAlt: '#4b4b4b',
        neutralPrimary: '#333',
        neutralDark: '#272727',
        black: '#1d1d1d',
        white: '#fff',
        primaryBackground: '#fff',
        primaryText: '#333',
        bodyBackground: '#fff',
        bodyText: '#333',
        disabledBackground: '#f4f4f4',
        disabledText: '#c8c8c8',
    };
    loadTheme({ palette: fabricTheme, isInverted: true });
};
var _a;
//# sourceMappingURL=theme.js.map