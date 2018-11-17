var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import styled, { keyframes } from 'styled-components';
export var CenteringContainer = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  height: 100%;\n  width: 100%;\n\n  display: flex;\n  align-items: center;\n  justify-content: center;\n"], ["\n  height: 100%;\n  width: 100%;\n\n  display: flex;\n  align-items: center;\n  justify-content: center;\n"])));
export var BallContainer = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject([""], [""])));
var MovingBalls = keyframes(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  0%, 80%, 100% {\n      transform: scale(0);\n  }\n  40% {\n      transform: scale(1);\n  }\n"], ["\n  0%, 80%, 100% {\n      transform: scale(0);\n  }\n  40% {\n      transform: scale(1);\n  }\n"])));
export var Ball = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  margin: 4px;\n  border-radius: 100%;\n  display: inline-block;\n  animation: ", " 1.4s infinite ease-in-out both;\n"], ["\n  margin: 4px;\n  border-radius: 100%;\n  display: inline-block;\n  animation: ", " 1.4s infinite ease-in-out both;\n"])), MovingBalls);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=styles.js.map