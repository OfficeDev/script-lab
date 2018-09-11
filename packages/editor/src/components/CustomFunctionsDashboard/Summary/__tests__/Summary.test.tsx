import React from 'react'
import { mount } from 'enzyme'

import { Summary } from '../'
import { basicSummaryProps, BasicSummary } from '../Summary.stories'

describe('Summary should render properly in basic case', () => {
  it('should not crash', () => {
    const summary = mount(<BasicSummary />)
  })
})
