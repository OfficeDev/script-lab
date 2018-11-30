import run, { IProps } from './run';

describe('template', () => {
  it('should render proper runner html', () => {
    expect(
      run({
        linkReferences: ['url1', 'url2', 'url3'],
        scriptReferences: ['url4', 'url5', 'url6'],
        inlineScript: 'example inline script',
        html: '<div>hello world</div>',
        inlineStyles: 'body { color: blue }',
      }),
    ).toEqual(`<!DOCTYPE html>
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

  <link rel=\"stylesheet\" href=\"url1\" />
  <link rel=\"stylesheet\" href=\"url2\" />
  <link rel=\"stylesheet\" href=\"url3\" />

  <script crossorigin=\"anonymous\" src=\"url4\"></script>
  <script crossorigin=\"anonymous\" src=\"url5\"></script>
  <script crossorigin=\"anonymous\" src=\"url6\"></script>

  <style type=\"text/css\">
    body { color: blue }
  </style>
</head>

<body>
  <div>hello world</div>

  <script type=\"text/javascript\">
    example inline script
  </script>
</body>

</html>`);
  });
});
