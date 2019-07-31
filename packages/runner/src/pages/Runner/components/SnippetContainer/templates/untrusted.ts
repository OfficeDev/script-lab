import { METHODS_EXPOSED_ON_RUNNER_OUTER_FRAME } from '../IFrame';

export interface IProps {
  snippetName: string;
}

// prettier-ignore
export default ({snippetName}: IProps) => `<!DOCTYPE html>
<html>
<head>
    <link
      rel="stylesheet"
      href="https://static2.sharepointonline.com/files/fabric/office-ui-fabric-core/9.6.0/css/fabric.min.css"
    />
    <style>
      *,
      *::before,
      *::after {
        padding: 0;
        margin: 0;
        -webkit-box-sizing: inherit;
        box-sizing: inherit;
      }
      .container {
        height: 100vh;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
            -ms-flex-direction: column;
                flex-direction: column;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        -webkit-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
      }
      h1 {
        text-align: center;
        margin-bottom: 0px;
      }
      #details {
        max-width: 95%;
        margin: 10px;
        padding: 10px;
        overflow-wrap: normal;
        -webkit-box-sizing: border-box;
                box-sizing: border-box;
        white-space: pre-wrap;
        word-wrap: break-word;
        word-break: break-all;
        white-space: pre-wrap;
        overflow-y: auto;
      }
    </style>
</head>

<body class="ms-Fabric">
  <div class="container">
    <h1 id="title" class="ms-font-xxl">Untrusted Snippet</h1>
    <h3 id="details" class="ms-font-l">In order to run "${snippetName}", you must first trust it in the editor.</h3>
  </div>

  <script>
    window.parent.${METHODS_EXPOSED_ON_RUNNER_OUTER_FRAME.scriptRunnerOnLoad}(window);
  </script>
</body>

</html>`;
