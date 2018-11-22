import template, { IProps } from './template';

describe('template', () => {
  it('should render proper runner html', () => {
    expect(
      template({
        linkReferences: ['url1', 'url2', 'url3'],
        scriptReferences: ['url4', 'url5', 'url6'],
        inlineScript: 'example inline script',
        html: '<div>hello world</div>',
        inlineStyles: 'body { color: blue }',
      }),
    ).toEqual(`<!DOCTYPE html>
<html>

<head>
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
    Office.onReady(function () {
      example inline script
    });
  </script>
</body>

</html>`);
  });
});
