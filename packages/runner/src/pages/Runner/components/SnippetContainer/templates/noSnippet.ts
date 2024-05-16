import { METHODS_EXPOSED_ON_RUNNER_OUTER_FRAME } from "../IFrame";

// prettier-ignore
export default () => `<!DOCTYPE html>
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
        overflow-y: auto;
      }
    </style>
</head>

<body class="ms-Fabric">
  <div class="container">
    <h1 id="title" class="ms-font-xxl">No snippet to run</h1>
    <h3 id="details" class="ms-font-l">Please open the editor to select a snippet.</h3>
  </div>

  <script>
    window.parent.${METHODS_EXPOSED_ON_RUNNER_OUTER_FRAME.scriptRunnerOnLoad}(window);
  </script>
</body>

</html>`;
