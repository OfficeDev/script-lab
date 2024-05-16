import React from "react";
import NavMenu from "./NavMenu";
import PivotMenu from "./PivotMenu";
import IMenuItem from "./IMenuItem";

// TODO: make it so that I don't cry when I look at this styling..
export interface IProps {
  isCompact: boolean;
  items: IMenuItem[];
  selectedKey: string;
}

class Menu extends React.Component<IProps> {
  render(): JSX.Element {
    const { items, selectedKey, isCompact } = this.props;

    return isCompact ? (
      <PivotMenu items={items} selectedKey={selectedKey} />
    ) : (
      <NavMenu items={items} selectedKey={selectedKey} />
    );
  }
}

export default Menu;
