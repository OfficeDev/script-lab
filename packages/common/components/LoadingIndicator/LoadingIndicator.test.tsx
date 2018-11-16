import React from 'react';
import { mount } from 'enzyme';

import LoadingIndicator, { IProps } from '.';
import { Ball } from './styles';

describe('LoadingIndicator should render properly', () => {
  const props: IProps = { numBalls: 5, ballSize: 32, ballColor: 'white' };

  const loadingIndicator = mount(<LoadingIndicator {...props} />);
  const balls = loadingIndicator.find(Ball);

  it(`should have ${props.numBalls} balls`, () => {
    expect(balls.length).toEqual(props.numBalls);
  });
});
