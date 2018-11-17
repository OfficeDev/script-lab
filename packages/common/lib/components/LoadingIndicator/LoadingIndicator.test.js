var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import React from 'react';
import { mount } from 'enzyme';
import LoadingIndicator from '.';
import { Ball } from './styles';
describe('LoadingIndicator should render properly', function () {
    var props = { numBalls: 5, ballSize: 32, ballColor: 'white' };
    var loadingIndicator = mount(React.createElement(LoadingIndicator, __assign({}, props)));
    var balls = loadingIndicator.find(Ball);
    it("should have " + props.numBalls + " balls", function () {
        expect(balls.length).toEqual(props.numBalls);
    });
});
//# sourceMappingURL=LoadingIndicator.test.js.map