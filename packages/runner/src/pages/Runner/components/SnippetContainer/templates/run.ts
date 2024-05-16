import { METHODS_EXPOSED_ON_RUNNER_OUTER_FRAME } from "../IFrame";

// cspell:ignore crossorigin

export interface IProps {
  linkReferences: string[];
  scriptReferences: string[];
  inlineStyles: string;
  html: string;
  inlineScript: string;
}

// prettier-ignore
export default ({
  linkReferences,
  scriptReferences,
  inlineStyles,
  html,
  inlineScript,
}: IProps) => `<!DOCTYPE html>
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
  <link rel="shortcut icon" type="image/x-icon" href="/assets/images/favicon.ico" />

  ${linkReferences.map(href => `<link rel="stylesheet" href="${href}" />`).join('\n  ')}

  <style type="text/css">
    ${inlineStyles}
  </style>
</head>

<body>
  ${html}

  <script>
    window.parent.${METHODS_EXPOSED_ON_RUNNER_OUTER_FRAME.scriptRunnerOnLoad}(window);
  </script>

  ${scriptReferences.map(src => `<script crossorigin="anonymous" src="${src}"></script>`).join('\n  ')}

  <script>
    ${inlineScript}
  </script>
</body>

</html>`;
