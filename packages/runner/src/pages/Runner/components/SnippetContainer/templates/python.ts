import { RUNNER_TO_EDITOR_HEARTBEAT_REQUESTS } from 'common/lib/constants';
import {
  METHODS_TO_EXPOSE_ON_IFRAME,
  METHODS_EXPOSED_ON_RUNNER_OUTER_FRAME,
} from '../IFrame';

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
    <link
      rel="stylesheet"
      href="https://static2.sharepointonline.com/files/fabric/office-ui-fabric-js/1.4.0/css/fabric.components.min.css"
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
      .details {
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
      #main {
        width: 95%;
      }
      #main > h1 {
        text-align: left;
      }
    </style>
</head>

<body class="ms-Fabric">
  <div class="container">
    <div id="please-wait">
      <h1 class="ms-font-xxl">Please wait...</h1>
    </div>

    <div id="python-not-configured" style="display:none">
      <h1 class="ms-font-xxl">Python not configured</h1>
      <h3 class="details ms-font-l">To support Python scripts, you must
        enter the required settings in the editor's "Settings" page.
        Please return to the editor, add the necessary settings, and try again.
      </h3>
    </div>

    <div id="main" style="display:none">
      <h1 class="ms-font-xxl">Python script</h1>
      <button id="run" onclick="run()" class="ms-Button">
        <span class="ms-Button-label">Run code</span>
      </button>
    </div>
  </div>

  <script>
    window.parent.${METHODS_EXPOSED_ON_RUNNER_OUTER_FRAME.scriptRunnerOnLoad}(window);

    function run() {
      document.getElementById('run').setAttribute("disabled", "disabled");
      window.parent.${METHODS_EXPOSED_ON_RUNNER_OUTER_FRAME.executePythonScript}(
        pythonConfig,
        atob("${btoa(script)}"),
        function() {
          debugger;
          document.getElementById('run').removeAttribute("disabled");
        }
      );
    }

    var pythonConfig;
    window.${METHODS_TO_EXPOSE_ON_IFRAME.onMessageFromHeartbeat} = function(message) {
      if (message.type === "${
        RUNNER_TO_EDITOR_HEARTBEAT_REQUESTS.GET_PYTHON_CONFIG_IF_ANY
      }") {
        document.getElementById('please-wait').style.display = 'none';
        pythonConfig = message.contents;
        document.getElementById(pythonConfig ? 'main' : 'python-not-configured').style.display = '';
      }
    };

    window.${METHODS_TO_EXPOSE_ON_IFRAME.sendMessageFromRunnerToEditor}("${
  RUNNER_TO_EDITOR_HEARTBEAT_REQUESTS.GET_PYTHON_CONFIG_IF_ANY
}");
  </script>
</body>

</html>`;
