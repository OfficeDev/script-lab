import React from 'react'
import Content from './Content'

import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button'

// TODO: incorp. localization
export default () => (
  <Content
    title="Import snippet"
    description="Enter the snippet's URL or paste the YAML below, then choose Import."
  >
    <span className="ms-font-m">SNIPPET URL OR YAML</span>
    <TextField
      multiline={true}
      placeholder="e.g.: https://gist.github.com/sampleGistId"
    />
    <PrimaryButton style={{ marginTop: '1.5rem', float: 'right' }} text="Import" />
  </Content>
)
