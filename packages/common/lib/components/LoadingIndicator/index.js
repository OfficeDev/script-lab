import React from 'react';
import { CenteringContainer, BallContainer, Ball } from './styles';
var LoadingIndicator = function (_a) {
    var numBalls = _a.numBalls, ballSize = _a.ballSize, ballColor = _a.ballColor, _b = _a.delay, delay = _b === void 0 ? 0.16 : _b;
    return (React.createElement(CenteringContainer, null,
        React.createElement(BallContainer, { style: { height: ballSize + "px" } }, Array.from({ length: numBalls }, function (v, k) { return (React.createElement(Ball, { key: "ball-" + k, style: {
                animationDelay: "-" + delay * (numBalls - k) + "s",
                height: ballSize + "px",
                width: ballSize + "px",
                backgroundColor: ballColor,
            } })); }))));
};
export default LoadingIndicator;
//# sourceMappingURL=index.js.map