import React from "react";
import styled, { withTheme } from "styled-components";
import IMenuItem from "./IMenuItem";
import PivotBar from "common/build/components/PivotBar";

const Wrapper = styled.div`
  box-shadow: 0px 2px 4px 2px ${(props) => props.theme.neutralSecondary};
`;

export interface IProps {
  items: IMenuItem[];
  selectedKey: string;
  theme: ITheme; // from withTheme
}

class PivotMenu extends React.Component<IProps> {
  onSelect = (key: string) => this.props.items.find((item) => item.key === key)!.onClick();

  render(): JSX.Element {
    const { items, selectedKey, theme } = this.props;

    return (
      <Wrapper>
        <PivotBar
          selectedKey={selectedKey}
          onSelect={this.onSelect}
          items={items
            .filter(({ isHidden }) => !isHidden)
            .map(({ label, icon, key, ariaLabel }) => {
              if (["back", "new"].includes(key)) {
                return {
                  text: key === "back" ? "Code" : "New",
                  iconName: icon,
                  key,
                  ariaLabel,
                };
              } else {
                return {
                  text: label,
                  key,
                  ariaLabel,
                };
              }
            })}
          backgroundColor={theme.primary}
          selectedColor={theme.primaryDark}
        />
      </Wrapper>
    );
  }
}

export default withTheme(PivotMenu);
