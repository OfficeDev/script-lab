import React from 'react'
import Snippet from './components/Snippet'

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

const exampleSolution2 = {
  id: '0cc8749f-e334-4d9b-816c-43f8ca83a2d1',
  name: 'Runner Test',
  host: 'WEB',
  description: 'Create a new snippet from a blank template.',
  files: [
    {
      id: '0ca5f180-2d9b-4341-b43a-7c8f21b4858c',
      name: 'index.ts',
      content:
        'var count = 0\n\nsetInterval(function () {\n    var btn = document.createElement("BUTTON");      // Create a <button> element\n    btn.classList.add("ms-Button"); \nvar t = document.createTextNode("CLICK ME " + count);       // Create a text node\n    btn.appendChild(t);                                // Append the text to <button>\n    document.body.appendChild(btn);                    // Append <button> to <body>\n    count++;\n}, 2500)\n',
      language: 'typescript',
      dateCreated: 1536125352086,
      dateLastModified: 1536823129072,
    },
    {
      id: 'd0e83e0f-d998-4bf1-9bb8-f7570bf1e4d8',
      name: 'index.html',
      content:
        '<button id="run" class="ms-Button">\n    <span class="ms-Button-label">Run</span>\n</button>\n',
      language: 'html',
      dateCreated: 1536125352086,
      dateLastModified: 1536125352086,
    },
    {
      id: '7cd7ed1a-c240-4eba-94ce-f0e5a4d907ae',
      name: 'index.css',
      content: '/* Your style goes here */\n',
      language: 'css',
      dateCreated: 1536125352086,
      dateLastModified: 1536125352086,
    },
    {
      id: '73d399f4-0fbd-4a19-9bba-503b8ce58b2d',
      name: 'libraries.txt',
      content:
        'office-ui-fabric-js@1.4.0/dist/css/fabric.min.css\noffice-ui-fabric-js@1.4.0/dist/css/fabric.components.min.css\n\ncore-js@2.4.1/client/core.min.js\n@types/core-js\n\n@microsoft/office-js-helpers@0.7.4/dist/office.helpers.min.js\n@microsoft/office-js-helpers@0.7.4/dist/office.helpers.d.ts\n\njquery@3.1.1\n@types/jquery\n',
      language: 'libraries',
      dateCreated: 1536125352086,
      dateLastModified: 1536125352086,
    },
  ],
  dateCreated: 1536125352086,
  dateLastModified: 1536823129072,
}

const Solution = ({ solution }: { solution: ISolution }) => {
  // const html = solution.files.find(file => file.name === 'index.html')!.content
  // const css = solution.files.find(file => file.name === 'index.css')!.content
  // const libraries = solution.files.find(file => file.name === 'libraries.txt')!.content
  // const { linkReferences, scriptReferences, officeJS } = processLibraries(
  //   libraries,
  //   false,
  // )
  // const script = solution.files.find(file => file.name === 'index.ts')!.content
  // console.log({ linkReferences, scriptReferences, officeJS })
  // return <Frame />
}
// <Frame
//   contentDidMount={(...args) => console.log(args)}
//   head={
//     <>
//       {scriptReferences.map(url => (
//         <script src={url} />
//       ))}
//       {linkReferences.map(url => (
//         <link key={url} rel="stylesheet" type="text/css" href={url} />
//       ))}
//       <style>{css}</style>
//     </>
//   }
// >
//   <div dangerouslySetInnerHTML={{ __html: html }} />
//   <script
//     dangerouslySetInnerHTML={{
//       __html: `window.addEventListener('DOMContentLoaded', function(){${script}})`,
//     }}
//   />
//   <script
//     dangerouslySetInnerHTML={{
//       __html: `function(){${script}}()`,
//     }}
//   />
{
  /* <script type="text/javascript" dangerouslySetInnerHTML={{ __html: script }} /> */
}
{
  /* <FrameContextConsumer>
        {// Callback is invoked with iframe's window and document instances
        ({ document, window }) => {
          // document.addEventListener('DOMContentLoaded', event => {
          //   console.log(event)
          // })

          // document.onreadystatechange = () => {
          //   if (document.readyState === 'complete') {
          //     // document is ready. Do your stuff here
          //     console.log('readyyyy')
          //     console.log(document)
          //   }
          // }
          // Render Children
          const tag = document.createElement('script')
          tag.innerHTML = `$( document ).ready(function(){${script}})`
          document.body.appendChild(tag)
          console.log(document)
          console.log(document.getElementById('run'))
          console.log(document.getElementsByClassName('ms-Button'))
        }}
      </FrameContextConsumer> */
}
// </Frame>

const Foo = ({ n }) => (
  <>
    <div>{n}</div>
    <ul>
      <li>{n + 1}</li>
      <li>{n + 2}</li>
      <li>{n + 3}</li>
    </ul>
  </>
)

class App extends React.Component {
  state = { count: 0, something: 0 }

  componentDidMount() {
    // setInterval(() => this.setState({ something: this.state.something + 1 }), 100)
    setInterval(() => this.setState({ count: this.state.count + 1 }), 10000)
  }
  render() {
    console.log(this.state.something)
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        {/* <Frame message={this.state.count.toString()} /> */}
        <Snippet solution={exampleSolution2} />
        {/* <Solution solution={exampleSolution} /> */}
      </div>
    )
  }
}

export default App
