/// <reference types="styled-components" />
import React from 'react';
import { PivotItem } from 'office-ui-fabric-react/lib/Pivot';
export interface IPivotBarItem {
    key: string;
    text?: string;
    iconName?: string;
}
export interface IProps {
    items: IPivotBarItem[];
    selectedKey: string | null;
    backgroundColor?: string;
    selectedColor?: string;
    hideUnderline?: boolean;
    onSelect: (selectedKey: string) => void;
    theme: ITheme;
}
declare class PivotBar extends React.Component<IProps> {
    static defaultProps: Partial<IProps>;
    render(): JSX.Element;
    onLinkClick: (item: PivotItem) => void;
}
declare const _default: React.ForwardRefExoticComponent<Pick<IProps & React.RefAttributes<PivotBar>, "ref" | "key" | "onSelect" | "items" | "selectedKey" | "backgroundColor" | "selectedColor" | "hideUnderline"> & {
    theme?: any;
}>;
export default _default;
