export interface IProps {
  title: string;
  details: string;
}

export default ({ title, details }: IProps) => `<!DOCTYPE html>
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
        background: #eee;
        border-radius: 5px;
        margin: 10px;
        padding: 10px;
        overflow-wrap: normal;
        -webkit-box-sizing: border-box;
                box-sizing: border-box;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
    </style>
</head>

<body class="ms-Fabric">
  <div class="container">
    <h1 id="title" class="ms-font-xxl">${title}</h1>
    <pre id="details">${details}</pre>
  </div>

  <script type="text/javascript">
    window.parent.scriptRunnerOnLoad(window);
  </script>
</body>

</html>`;
