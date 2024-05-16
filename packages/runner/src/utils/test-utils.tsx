import React from "react";
import { render } from "react-testing-library";
import { ThemeProvider } from "styled-components";
import { getTheme } from "common/build/theme";

const customRender = (node, options) =>
  render(<ThemeProvider theme={getTheme("EXCEL")}> {node} </ThemeProvider>, options);

// re-export everything
export * from "react-testing-library";

// override render method
export { customRender as render };
