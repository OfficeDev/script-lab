import React from "react";
import { Icon } from "office-ui-fabric-react/lib/Icon";

export interface IIcon {
  name: string;
  color: string;
}

const IconOrDiv = ({ icon }: { icon: IIcon }) =>
  icon ? (
    <Icon
      className="ms-font-m"
      iconName={icon.name}
      style={{
        fontSize: "1.2rem",
        color: icon.color,
        lineHeight: "1.2rem",
      }}
    />
  ) : (
    <div style={{ width: "1.2rem", height: "1.2rem" }} />
  );

export default IconOrDiv;
