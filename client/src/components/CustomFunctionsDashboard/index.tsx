import React from 'react'

import Dashboard from './Dashboard'

import Summary from './Summary'
import Console from './Console'

const CustomFunctionsDashboard = props => <Dashboard items={{ Summary, Console }} />

export default CustomFunctionsDashboard
