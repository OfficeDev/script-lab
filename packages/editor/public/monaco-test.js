document.getElementById("go").onclick = function () {
  var html = atob(ENCODED_HTML_TO_REPLACE).replace(
    /MONACO_BASE_URL/g,
    document.getElementById("monaco-base-url").value,
  );
  console.log(html);
  window.document.write(html);
};

// Note: HTML taken from https://github.com/Microsoft/monaco-editor-samples/blob/master/browser-script-editor/index.html,
//     and substituting in "../node_modules/monaco-editor/" with the generic "MONACO_BASE_URL" string,
//     which in turn is substituted later.
//     Also added a few tiny adjustments to title and container style
//     And added the section for IntelliSense, following bug https://github.com/OfficeDev/script-lab/issues/514
// The original text, run through a base64 encoder, is below.
var ENCODED_HTML_TO_REPLACE =
  "PCFET0NUWVBFIGh0bWw+CjxodG1sPgogIDxoZWFkPgogICAgPG1ldGEgaHR0cC1lcXVpdj0iWC1VQS1Db21wYXRpYmxlIiBjb250ZW50PSJJRT1lZGdlIiAvPgogICAgPG1ldGEgaHR0cC1lcXVpdj0iQ29udGVudC1UeXBlIiBjb250ZW50PSJ0ZXh0L2h0bWw7Y2hhcnNldD11dGYtOCIgLz4KICAgIDxsaW5rCiAgICAgIHJlbD0ic3R5bGVzaGVldCIKICAgICAgZGF0YS1uYW1lPSJ2cy9lZGl0b3IvZWRpdG9yLm1haW4iCiAgICAgIGhyZWY9Ik1PTkFDT19CQVNFX1VSTC9lZGl0b3IvZWRpdG9yLm1haW4uY3NzIgogICAgLz4KICA8L2hlYWQ+CiAgPGJvZHk+CiAgICA8aDI+TW9uYWNvIEVkaXRvciBTeW5jIExvYWRpbmcgU2FtcGxlLCBNT05BQ09fQkFTRV9VUkw8L2gyPgogICAgPGRpdiBpZD0iY29udGFpbmVyIiBzdHlsZT0id2lkdGg6MTAwJTtoZWlnaHQ6NjAwcHg7Ym9yZGVyOjFweCBzb2xpZCBncmV5Ij48L2Rpdj4KCiAgICA8c2NyaXB0PgogICAgICB2YXIgcmVxdWlyZSA9IHsgcGF0aHM6IHsgdnM6ICdNT05BQ09fQkFTRV9VUkwnIH0gfTsKICAgIDwvc2NyaXB0PgogICAgPHNjcmlwdCBzcmM9Ik1PTkFDT19CQVNFX1VSTC9sb2FkZXIuanMiPjwvc2NyaXB0PgogICAgPHNjcmlwdCBzcmM9Ik1PTkFDT19CQVNFX1VSTC9lZGl0b3IvZWRpdG9yLm1haW4ubmxzLmpzIj48L3NjcmlwdD4KICAgIDxzY3JpcHQgc3JjPSJNT05BQ09fQkFTRV9VUkwvZWRpdG9yL2VkaXRvci5tYWluLmpzIj48L3NjcmlwdD4KCiAgICA8c2NyaXB0PgogICAgICB2YXIgZWRpdG9yID0gbW9uYWNvLmVkaXRvci5jcmVhdGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcicpLCB7CiAgICAgICAgdmFsdWU6IFsnZnVuY3Rpb24geCgpIHsnLCAnXHRjb25zb2xlLmxvZygiSGVsbG8gd29ybGQhIik7JywgJ30nXS5qb2luKCdcbicpLAogICAgICAgIGxhbmd1YWdlOiAndHlwZXNjcmlwdCcsCiAgICAgIH0pOwogICAgICBpZiAod2luZG93LmZldGNoKSB7CiAgICAgICAgdmFyIHVybCA9ICdodHRwczovL3VucGtnLmNvbS9AbWljcm9zb2Z0L29mZmljZS1qcy1oZWxwZXJzQDAuNy40L2Rpc3Qvb2ZmaWNlLmhlbHBlcnMuZC50cyc7CiAgICAgICAgZmV0Y2godXJsKQogICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHsKICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKGZ1bmN0aW9uKHRleHQpIHsKICAgICAgICAgICAgICBjb25zb2xlLmxvZygiQWRkZWQgSW50ZWxsaVNlbnNlIGZvciAiICsgdXJsKTsKICAgICAgICAgICAgICBtb25hY28ubGFuZ3VhZ2VzLnR5cGVzY3JpcHQudHlwZXNjcmlwdERlZmF1bHRzLmFkZEV4dHJhTGliKHRleHQsIHVybCk7CiAgICAgICAgICAgIH0pOwogICAgICAgICAgfSkKICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihlKSB7CiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7CiAgICAgICAgICB9KTsKICAgICAgfQogICAgPC9zY3JpcHQ+CiAgPC9ib2R5Pgo8L2h0bWw+";
/*
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
    <link
      rel="stylesheet"
      data-name="vs/editor/editor.main"
      href="MONACO_BASE_URL/editor/editor.main.css"
    />
  </head>
  <body>
    <h2>Monaco Editor Sync Loading Sample, MONACO_BASE_URL</h2>
    <div id="container" style="width:100%;height:600px;border:1px solid grey"></div>

    <script>
      var require = { paths: { vs: 'MONACO_BASE_URL' } };
    </script>
    <script src="MONACO_BASE_URL/loader.js"></script>
    <script src="MONACO_BASE_URL/editor/editor.main.nls.js"></script>
    <script src="MONACO_BASE_URL/editor/editor.main.js"></script>

    <script>
      var editor = monaco.editor.create(document.getElementById('container'), {
        value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
        language: 'typescript',
      });
      if (window.fetch) {
        var url = 'https://unpkg.com/@microsoft/office-js-helpers@0.7.4/dist/office.helpers.d.ts';
        fetch(url)
          .then(function(response) {
            return response.text().then(function(text) {
              console.log("Added IntelliSense for " + url);
              monaco.languages.typescript.typescriptDefaults.addExtraLib(text, url);
            });
          })
          .catch(function(e) {
            console.error(e);
          });
      }
    </script>
  </body>
</html>
*/
