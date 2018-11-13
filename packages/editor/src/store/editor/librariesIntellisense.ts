export default [
  {
    label: 'lodash',
    value: 'lodash',
    typings: '@types/lodash',
    description: 'Modular utilities used simplify array or object manipulations.',
  },
  {
    label: 'office-js',
    value: 'https://appsforoffice.microsoft.com/lib/1/hosted/Office.js',
    typings: '@types/office-js',
    description: 'JavaScript framework used to build Office Add-ins.',
  },
  {
    label: 'office-ui-fabric-js',
    value: [
      'office-ui-fabric-js/dist/css/fabric.min.css',
      'office-ui-fabric-js/dist/css/fabric.components.min.css',
      'office-ui-fabric-js/dist/js/fabric.min.js',
    ],
    description:
      'JavaScript front-end framework for building experiences for Office 365.',
  },
  {
    label: 'jquery',
    value: 'jquery',
    typings: '@types/jquery',
    description: 'JavaScript library for DOM operations.',
  },
  {
    label: '@microsoft/office-js-helpers',
    value: '@microsoft/office-js-helpers/dist/office.helpers.min.js',
    typings: '@microsoft/office-js-helpers/dist/office.helpers.d.ts',
    description: 'An open-source collection of helpers for developing Office Add-ins.',
  },
  {
    label: 'core-js',
    value: 'core-js/client/core.min.js',
    typings: '@types/core-js',
    description: 'Standard es6, es7 shim library',
  },
  {
    label: 'whatwg-fetch',
    value: 'whatwg-fetch',
    typings: ['@types/whatwg-fetch', '@types/whatwg-streams'],
    description: 'A window.fetch polyfill.',
  },
];
