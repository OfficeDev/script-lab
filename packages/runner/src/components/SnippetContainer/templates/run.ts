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
  ${linkReferences.map(href => `<link rel="stylesheet" href="${href}" />`).join('\n  ')}

  ${scriptReferences.map(src => `<script crossorigin="anonymous" src="${src}"></script>`).join('\n  ')}

  <style type="text/css">
    ${inlineStyles}
  </style>
</head>

<body>
  ${html}

  <script type="text/javascript">
    ${inlineScript}
  </script>
</body>

</html>`;
