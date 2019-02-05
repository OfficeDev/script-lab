// cspell:ignore crossorigin

export interface ICustomFunctionPayload {
  solutionId: string;
  namespace: string;
  functionNames: string[];
  code: string;
  jsLibs: string[];
}

export default ({
  solutionId,
  namespace,
  functionNames,
  code,
  jsLibs,
}: ICustomFunctionPayload) => {
  const resultingHtml = `<!DOCTYPE html>
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
</head>

<body>
  <script>
    window.parent.scriptRunnerOnLoad(window, "${solutionId}");
  </script>

  ${jsLibs
    .map(src => `<script crossorigin="anonymous" src="${src}"></script>`)
    .join('\n  ')}

  <script>
    ${code}

    ${functionNames
      .map(
        funcName =>
          `ScriptLabCustomFunctionsDictionary["${namespace}.${funcName}"] = ${funcName};`,
      )
      .join('\n  ')}

    window.parent.scriptRunnerOnLoadComplete();
  </script>
</body>

</html>`;

  return resultingHtml;
};
