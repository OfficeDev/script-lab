export interface IProps {
  title: string;
  details: string;
}

export default ({ title, details }: IProps) => `<!DOCTYPE html>
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
</body>

</html>`;
