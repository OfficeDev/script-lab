/// <reference types="react" />
import { ICommandBarProps } from 'office-ui-fabric-react/lib/CommandBar';
export interface IProps extends ICommandBarProps {
    theme: ITheme | any;
}
declare const Header: (props: IProps) => JSX.Element;
export default Header;
