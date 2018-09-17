import React from 'react'
import styled, { ThemeProvider } from 'styled-components'

import { getTheme } from '../../theme'

import Header from './Header'
import MessageBar from './MessageBar'

import Snippet from '../Snippet'

const exampleSolution = {
  id: 'ec3bc646-e174-4635-8ced-e9da85155073',
  name: 'Blank snippet',
  host: 'EXCEL',
  description: 'Create a new snippet from a blank template.',
  files: [
    {
      id: '5890734a-d2b1-4e80-af99-80b4e730a4f1',
      name: 'index.ts',
      content: 'document.getElementById("run").style.backgroundColor = "pink"',
      language: 'typescript',
      dateCreated: 1535175129365,
      dateLastModified: 1535175129365,
    },
    {
      id: 'b46300c0-239c-47df-afa8-d04cf0574858',
      name: 'index.html',
      content:
        '<button id="run" class="ms-Button">\n    <span class="ms-Button-label">Run</span>\n</button>\n',
      language: 'html',
      dateCreated: 1535175129365,
      dateLastModified: 1535175129365,
    },
    {
      id: 'f502139e-0132-4ab1-b690-aae95dd2e608',
      name: 'index.css',
      content: 'button {background-color: red}\n#run {background-color:green}',
      language: 'css',
      dateCreated: 1535175129365,
      dateLastModified: 1535175129365,
    },
    {
      id: 'a6fe7f7b-ef86-49b8-bb2a-0753688742e8',
      name: 'libraries.txt',
      content:
        'https://appsforoffice.microsoft.com/lib/1/hosted/office.js\n@types/office-js\n\noffice-ui-fabric-js@1.4.0/dist/css/fabric.min.css\noffice-ui-fabric-js@1.4.0/dist/css/fabric.components.min.css\n\ncore-js@2.4.1/client/core.min.js\n@types/core-js\n\n@microsoft/office-js-helpers@0.7.4/dist/office.helpers.min.js\n@microsoft/office-js-helpers@0.7.4/dist/office.helpers.d.ts\n\njquery@3.1.1\n@types/jquery\n',
      language: 'libraries',
      dateCreated: 1535175129365,
      dateLastModified: 1535175129365,
    },
  ],
  dateCreated: 1535175129365,
  dateLastModified: 1535175129365,
}

export const Layout = styled.div`
  height: 100vh;
  min-height: 100vh;

  display: flex;
  flex-direction: column;
`

export const ContentContainer = styled.div`
  flex: 1;
  overflow: hidden;
`

const RefreshBar = props => (
  <MessageBar
    message="The snippet has changed, would you like to refresh?"
    acceptMessage="Refresh"
    {...props}
  />
)

export class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={getTheme('EXCEL')}>
        <Layout>
          <Header solutionName="example" goBack={() => {}} refresh={() => {}} />
          <RefreshBar isVisible={true} />
          <ContentContainer>
            <Snippet solution={exampleSolution} />
          </ContentContainer>
        </Layout>
      </ThemeProvider>
    )
  }
}

export default App
