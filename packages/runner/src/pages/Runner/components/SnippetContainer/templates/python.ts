import { RUNNER_TO_EDITOR_HEARTBEAT_REQUESTS } from 'common/lib/constants';
import { METHODS_TO_EXPOSE_ON_IFRAME } from '../IFrame';

export interface IProps {
  script: string;
}

export default ({ script }: IProps) => `<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <title>Script Lab</title>
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <meta name="theme-color" content="#000000" />
    <link rel="shortcut icon" type="image/x-icon" href="/assets/images/favicon.ico" />

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
        margin-bottom: 20px;
      }
      #details {
        max-width: 95%;
        background: #eee;
        border-radius: 5px;
        margin: 10px;
        padding: 10px;
        overflow-wrap: normal;
        -webkit-box-sizing: border-box;
                box-sizing: border-box;
        overflow-y: auto;
      }
      pre#details {
        white-space: pre-wrap;
        word-wrap: break-word;
        word-break: break-all;
        white-space: pre-wrap;
      }
    </style>
</head>

<body class="ms-Fabric">
  <div class="container">
    <h1 id="title" class="ms-font-xxl">Python script initializing</h1>
    <h3 id="details" class="ms-font-l">Please wait...</h3>

    <pre>
${script}
    </pre>
  </div>

  <script>
    window.parent.scriptRunnerOnLoad(window);

    window.onMessage = function(event) {
      debugger; // FIXME
      console.log(event.data)
    }

    window.${METHODS_TO_EXPOSE_ON_IFRAME.sendMessageFromRunnerToEditor}("${
  RUNNER_TO_EDITOR_HEARTBEAT_REQUESTS.IS_JUPYTER_ENABLED
}");    
  </script>
</body>

</html>`;
