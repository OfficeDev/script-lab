document.getElementById('go').onclick = function() {
  window.document.write(
    atob(ENCODED_HTML_TO_REPLACE).replace(
      /MONACO_BASE_URL/g,
      document.getElementById('monaco-base-url').value,
    ),
  );
};

// Note: HTML taken more-or-less verbatim from https://github.com/Microsoft/monaco-editor-samples/blob/master/browser-script-editor/index.html,
//     except for substituting in "../node_modules/monaco-editor/" with the generic "MONACO_BASE_URL" string,
//     which in turn is substituted later.  And a few tiny adjustments to title and container style
// The original text, run through a base64 encoder, is below.
var ENCODED_HTML_TO_REPLACE =
  'PCFET0NUWVBFIGh0bWw+CjxodG1sPgogIDxoZWFkPgogICAgPG1ldGEgaHR0cC1lcXVpdj0iWC1VQS1Db21wYXRpYmxlIiBjb250ZW50PSJJRT1lZGdlIiAvPgogICAgPG1ldGEgaHR0cC1lcXVpdj0iQ29udGVudC1UeXBlIiBjb250ZW50PSJ0ZXh0L2h0bWw7Y2hhcnNldD11dGYtOCIgLz4KICAgIDxsaW5rCiAgICAgIHJlbD0ic3R5bGVzaGVldCIKICAgICAgZGF0YS1uYW1lPSJ2cy9lZGl0b3IvZWRpdG9yLm1haW4iCiAgICAgIGhyZWY9Ik1PTkFDT19CQVNFX1VSTC9taW4vdnMvZWRpdG9yL2VkaXRvci5tYWluLmNzcyIKICAgIC8+CiAgPC9oZWFkPgogIDxib2R5PgogICAgPGgyPk1vbmFjbyBFZGl0b3IgU3luYyBMb2FkaW5nIFNhbXBsZSwgTU9OQUNPX0JBU0VfVVJMPC9oMj4KICAgIDxkaXYgaWQ9ImNvbnRhaW5lciIgc3R5bGU9IndpZHRoOjEwMCU7aGVpZ2h0OjYwMHB4O2JvcmRlcjoxcHggc29saWQgZ3JleSI+PC9kaXY+CgogICAgPHNjcmlwdD4KICAgICAgdmFyIHJlcXVpcmUgPSB7IHBhdGhzOiB7IHZzOiAnTU9OQUNPX0JBU0VfVVJML21pbi92cycgfSB9OwogICAgPC9zY3JpcHQ+CiAgICA8c2NyaXB0IHNyYz0iTU9OQUNPX0JBU0VfVVJML21pbi92cy9sb2FkZXIuanMiPjwvc2NyaXB0PgogICAgPHNjcmlwdCBzcmM9Ik1PTkFDT19CQVNFX1VSTC9taW4vdnMvZWRpdG9yL2VkaXRvci5tYWluLm5scy5qcyI+PC9zY3JpcHQ+CiAgICA8c2NyaXB0IHNyYz0iTU9OQUNPX0JBU0VfVVJML21pbi92cy9lZGl0b3IvZWRpdG9yLm1haW4uanMiPjwvc2NyaXB0PgoKICAgIDxzY3JpcHQ+CiAgICAgIHZhciBlZGl0b3IgPSBtb25hY28uZWRpdG9yLmNyZWF0ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFpbmVyJyksIHsKICAgICAgICB2YWx1ZTogWydmdW5jdGlvbiB4KCkgeycsICdcdGNvbnNvbGUubG9nKCJIZWxsbyB3b3JsZCEiKTsnLCAnfSddLmpvaW4oJ1xuJyksCiAgICAgICAgbGFuZ3VhZ2U6ICdqYXZhc2NyaXB0JywKICAgICAgfSk7CiAgICA8L3NjcmlwdD4KICA8L2JvZHk+CjwvaHRtbD4=';
/*
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
    <link
      rel="stylesheet"
      data-name="vs/editor/editor.main"
      href="MONACO_BASE_URL/min/vs/editor/editor.main.css"
    />
  </head>
  <body>
    <h2>Monaco Editor Sync Loading Sample, MONACO_BASE_URL</h2>
    <div id="container" style="width:100%;height:600px;border:1px solid grey"></div>

    <script>
      var require = { paths: { vs: 'MONACO_BASE_URL/min/vs' } };
    </script>
    <script src="MONACO_BASE_URL/min/vs/loader.js"></script>
    <script src="MONACO_BASE_URL/min/vs/editor/editor.main.nls.js"></script>
    <script src="MONACO_BASE_URL/min/vs/editor/editor.main.js"></script>

    <script>
      var editor = monaco.editor.create(document.getElementById('container'), {
        value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
        language: 'javascript',
      });
    </script>
  </body>
</html>
*/
