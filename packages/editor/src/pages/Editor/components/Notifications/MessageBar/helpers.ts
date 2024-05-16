import { MessageBarType } from "office-ui-fabric-react/lib/MessageBar";

export const getMessageBarStyle = (style: MessageBarType) => {
  switch (style) {
    case MessageBarType.info:
      return { root: { background: "#F4F4F4" } };

    case MessageBarType.success:
      return { root: { background: "#F1F7CE" } };

    case MessageBarType.error:
      return { root: { background: "#FACFD3" } };

    case MessageBarType.warning:
      return {
        root: { background: "#FFF1CC" },
        icon: {
          color: "darkgray",
        },
      };

    default:
      return { root: {} };
  }
};
