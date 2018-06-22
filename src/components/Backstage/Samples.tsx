import React from 'react'
import Content from './Content'
import GalleryList from './GalleryList'
import Searchbar from './Searchbar'
import { concatStyleSets } from '@uifabric/styling'
// TODO: unhardcode

export default class Samples extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.populate = this.populate.bind(this)
    this.displaySearchedSamples = this.displaySearchedSamples.bind(this)
    this.state = {
      groupedSamples: {},
      visible: [],
      samples: [
        {
          id: 'excel-basic-api-call',
          name: 'Basic API call',
          fileName: 'basic-api-call.yaml',
          description: 'Executes a basic Excel API call',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/01-basics/basic-api-call.yaml',
          group: 'Basics',
          api_set: {
            ExcelApi: 1.1,
          },
        },
        {
          id: 'excel-basic-api-call-es5',
          name: 'Basic API call (JavaScript)',
          fileName: 'basic-api-call-es5.yaml',
          description:
            'Executes a basic Excel API call using plain JavaScript & Promises',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/01-basics/basic-api-call-es5.yaml',
          group: 'Basics',
          api_set: {
            ExcelApi: 1.1,
          },
        },
        {
          id: 'excel-basics-basic-common-api-call',
          name: 'Basic API call (Office 2013)',
          fileName: 'basic-common-api-call.yaml',
          description:
            'Executes a basic Excel API call using the "common API" syntax (compatible with Office 2013).',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/01-basics/basic-common-api-call.yaml',
          group: 'Basics',
          api_set: {
            Selection: 1.1,
          },
        },
        {
          id: 'excel-advanced-report-generation',
          name: 'Report generation',
          fileName: 'report-generation.yaml',
          description:
            'Writes data to the workbook, reads and applies basic formatting, and adds a chart bound to that data.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/20-scenarios/report-generation.yaml',
          group: 'Scenarios',
          api_set: {
            ExcelApi: 1.1,
          },
        },
        {
          id: 'excel-range-conditional-formatting-basic',
          name: 'Conditional Formatting for Ranges - Basic',
          fileName: 'conditional-formatting-basic.yaml',
          description: 'Apply common types of conditional formatting to ranges.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/30-range/conditional-formatting-basic.yaml',
          group: 'Range',
          api_set: {
            ExcelApi: 1.6,
          },
        },
        {
          id: 'excel-range-conditional-formatting-advanced',
          name: 'Conditional Formatting for Ranges - Advanced',
          fileName: 'conditional-formatting-advanced.yaml',
          description: 'Work with more than one conditional format on the same range.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/30-range/conditional-formatting-advanced.yaml',
          group: 'Range',
          api_set: {
            ExcelApi: 1.6,
          },
        },
        {
          id: 'excel-range-copy-multiply-values',
          name: 'Copy and multiply values',
          fileName: 'copy-multiply-values.yaml',
          description: 'Copy and multiply values in a range',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/30-range/copy-multiply-values.yaml',
          group: 'Range',
          api_set: {
            ExcelApi: 1.1,
          },
        },
        {
          id: 'excel-range-create-and-use-range-intersection',
          name: 'Create and Use an Intersection of Ranges',
          fileName: 'create-and-use-range-intersection.yaml',
          description: 'Create a an intersection of two ranges and make a chart of it.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/30-range/create-and-use-range-intersection.yaml',
          group: 'Range',
          api_set: {
            ExcelApi: 1.4,
          },
        },
        {
          id: 'excel-range-formatting',
          name: 'Formatting',
          fileName: 'formatting.yaml',
          description: 'Format a range',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/30-range/formatting.yaml',
          group: 'Range',
          api_set: {
            ExcelApi: 1.1,
          },
        },
        {
          id: 'excel-range-insert-delete-clear-range',
          name: 'Insert, delete, clear range',
          fileName: 'insert-delete-clear-range.yaml',
          description: 'Insert, delete and clear a range',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/30-range/insert-delete-clear-range.yaml',
          group: 'Range',
          api_set: {
            ExcelApi: 1.1,
          },
        },
        {
          id: 'excel-range-range-operations',
          name: 'Range operations',
          fileName: 'range-operations.yaml',
          description: 'Bounding rect, intersection, offset and resized range',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/30-range/range-operations.yaml',
          group: 'Range',
          api_set: {
            ExcelApi: 1.1,
          },
        },
        {
          id: 'excel-range-selected-range',
          name: 'Selected range',
          fileName: 'selected-range.yaml',
          description: 'Get and set the currently selected range',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/30-range/selected-range.yaml',
          group: 'Range',
          api_set: {
            ExcelApi: 1.1,
          },
        },
        {
          id: 'excel-range-set-get-values',
          name: 'Set and get values',
          fileName: 'set-get-values.yaml',
          description: 'Set and get values and formulas for a range',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/30-range/set-get-values.yaml',
          group: 'Range',
          api_set: {
            ExcelApi: 1.1,
          },
        },
        {
          id: 'excel-range-test-for-used-range',
          name: 'Test for used range',
          fileName: 'test-for-used-range.yaml',
          description: "Create a chart from a table only if there's data in the table.",
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/30-range/test-for-used-range.yaml',
          group: 'Range',
          api_set: {
            ExcelApi: 1.4,
          },
        },
        {
          id: 'excel-range-working-with-dates',
          name: 'Working with dates',
          fileName: 'working-with-dates.yaml',
          description:
            'Setting and getting date values in a range and manipulating them using the Moment JavaScript library with the Moment-MSDate plug-in',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/30-range/working-with-dates.yaml',
          group: 'Range',
          api_set: {
            ExcelApi: 1.1,
          },
        },
        {
          id: 'excel-range-hyperlink',
          name: 'Range hyperlink',
          fileName: 'range-hyperlink.yaml',
          description: 'Create, update, and clear a hyperlink for a range.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/30-range/range-hyperlink.yaml',
          group: 'Range',
          api_set: {
            ExcelApi: 1.7,
          },
        },
        {
          id: 'excel-range-text-orientation',
          name: 'Range text orientation',
          fileName: 'range-text-orientation.yaml',
          description: 'Set and get the text orientation within a range',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/30-range/range-text-orientation.yaml',
          group: 'Range',
          api_set: {
            ExcelApi: 1.7,
          },
        },
        {
          id: 'excel-worksheet-activeworksheet',
          name: 'Active worksheet',
          fileName: 'activeworksheet.yaml',
          description: 'Get and set the active worksheet',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/35-worksheet/activeworksheet.yaml',
          group: 'Worksheet',
          api_set: {
            ExcelApi: 1.1,
          },
        },
        {
          id: 'excel-worksheet-add-delete-rename-move-worksheet',
          name: 'Add, delete, rename and move worksheet',
          fileName: 'add-delete-rename-move-worksheet.yaml',
          description: 'Add, delete, rename and change the position of a worksheet',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/35-worksheet/add-delete-rename-move-worksheet.yaml',
          group: 'Worksheet',
          api_set: {
            ExcelApi: 1.1,
          },
        },
        {
          id: 'excel-worksheet-hide-unhide-worksheet',
          name: 'Hide and unhide worksheet',
          fileName: 'hide-unhide-worksheet.yaml',
          description: 'Hide and unhide a worksheet',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/35-worksheet/hide-unhide-worksheet.yaml',
          group: 'Worksheet',
          api_set: {
            ExcelApi: 1.1,
          },
        },
        {
          id: 'excel-worksheet-list-worksheets',
          name: 'List worksheets',
          fileName: 'list-worksheets.yaml',
          description: 'List the worksheets in the workbook',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/35-worksheet/list-worksheets.yaml',
          group: 'Worksheet',
          api_set: {
            ExcelApi: 1.1,
          },
        },
        {
          id: 'excel-worksheet-reference-worksheets-by-relative-position',
          name: 'Reference worksheets by relative position',
          fileName: 'reference-worksheets-by-relative-position.yaml',
          description:
            'Shows how to use the worksheet shortcut methods, such as getFirst, getLast, getPrevious, and getNext.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/35-worksheet/reference-worksheets-by-relative-position.yaml',
          group: 'Worksheet',
          api_set: {
            ExcelApi: 1.5,
          },
        },
        {
          id: 'excel-worksheet-worksheet-range-cell',
          name: 'Worksheet range and cell',
          fileName: 'worksheet-range-cell.yaml',
          description: 'Get a range or a cell in a worksheet',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/35-worksheet/worksheet-range-cell.yaml',
          group: 'Worksheet',
          api_set: {
            ExcelApi: 1.1,
          },
        },
        {
          id: 'excel-worksheet-copy',
          name: 'Copy worksheet',
          fileName: 'worksheet-copy.yaml',
          description: 'Copies the active worksheet to the specified location.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/35-worksheet/worksheet-copy.yaml',
          group: 'Worksheet',
          api_set: {
            ExcelApi: 1.7,
          },
        },
        {
          id: 'excel-worksheet-freeze-panes',
          name: 'Manage frozen panes in a worksheet',
          fileName: 'worksheet-freeze-panes.yaml',
          description:
            'Freeze columns, freeze rows, freeze a range, and manage frozen panes in a worksheet.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/35-worksheet/worksheet-freeze-panes.yaml',
          group: 'Worksheet',
          api_set: {
            ExcelApi: 1.7,
          },
        },
        {
          id: 'excel-worksheet-tab-color',
          name: 'Worksheet tab color',
          fileName: 'tab-color.yaml',
          description: 'Set and get the tab color of a worksheet',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/35-worksheet/tab-color.yaml',
          group: 'Worksheet',
          api_set: {
            ExcelApi: 1.7,
          },
        },
        {
          id: 'excel-workbook-get-active-cell',
          name: 'Get active cell',
          fileName: 'workbook-get-active-cell.yaml',
          description: 'Gets the active cell of the entire workbook.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/37-workbook/workbook-get-active-cell.yaml',
          group: 'Workbook',
          api_set: {
            ExcelApi: 1.7,
          },
        },
        {
          id: 'excel-protect-data-in-worksheet-and-workbook-structure',
          name: 'Protect data in worksheet and the workbook structure',
          fileName: 'protect-data-in-worksheet-and-workbook-structure.yaml',
          description:
            'Shows how to protect data in a worksheet and the workbook structure.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/37-workbook/protect-data-in-worksheet-and-workbook-structure.yaml',
          group: 'Workbook',
          api_set: {
            ExcelApi: 1.7,
          },
        },
        {
          id: 'excel-style',
          name: 'Style',
          fileName: 'style.yaml',
          description: 'Add, apply, get and delete styles.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/40-table/style.yaml',
          group: 'Table',
          api_set: {
            ExcelApi: 1.7,
          },
        },
        {
          id: 'excel-table-add-rows-and-columns-to-a-table',
          name: 'Add rows and columns',
          fileName: 'add-rows-and-columns-to-a-table.yaml',
          description: 'Add rows and columns to a table',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/40-table/add-rows-and-columns-to-a-table.yaml',
          group: 'Table',
          api_set: {
            ExcelApi: 1.1,
          },
        },
        {
          id: 'excel-table-convert-range-to-table',
          name: 'Convert a range to a table',
          fileName: 'convert-range-to-table.yaml',
          description: 'Convert a range to a table',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/40-table/convert-range-to-table.yaml',
          group: 'Table',
          api_set: {
            ExcelApi: 1.1,
          },
        },
        {
          id: 'excel-table-create-table',
          name: 'Create a table',
          fileName: 'create-table.yaml',
          description: 'Creates a table with four columns and seven rows.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/40-table/create-table.yaml',
          group: 'Table',
          api_set: {
            ExcelApi: 1.1,
          },
        },
        {
          id: 'excel-table-filter-data',
          name: 'Filter data',
          fileName: 'filter-data.yaml',
          description: 'Filter data in a table',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/40-table/filter-data.yaml',
          group: 'Table',
          api_set: {
            ExcelApi: 1.1,
          },
        },
        {
          id: 'excel-table-format-table',
          name: 'Format table',
          fileName: 'format-table.yaml',
          description: 'Format a table',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/40-table/format-table.yaml',
          group: 'Table',
          api_set: {
            ExcelApi: 1.1,
          },
        },
        {
          id: 'excel-table-get-data-from-table',
          name: 'Get data from a table',
          fileName: 'get-data-from-table.yaml',
          description: 'Get data from a table',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/40-table/get-data-from-table.yaml',
          group: 'Table',
          api_set: {
            ExcelApi: 1.1,
          },
        },
        {
          id: 'excel-table-get-visible-range-of-a-filtered-table',
          name: 'Get visible range from a filtered table',
          fileName: 'get-visible-range-of-a-filtered-table.yaml',
          description: 'Get visible range from a filtered table',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/40-table/get-visible-range-of-a-filtered-table.yaml',
          group: 'Table',
          api_set: {
            ExcelApi: 1.1,
          },
        },
        {
          id: 'excel-table-import-json-data',
          name: 'Import JSON data',
          fileName: 'import-json-data.yaml',
          description: 'Import JSON data into a table',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/40-table/import-json-data.yaml',
          group: 'Table',
          api_set: {
            ExcelApi: 1.1,
          },
        },
        {
          id: 'excel-table-sort-data',
          name: 'Sort table data',
          fileName: 'sort-data.yaml',
          description: 'Sort table data',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/40-table/sort-data.yaml',
          group: 'Table',
          api_set: {
            ExcelApi: 1.1,
          },
        },
        {
          id: 'excel-named-item-create-named-item',
          name: 'Create a named item',
          fileName: 'create-named-item.yaml',
          description: 'Create a named item for a formula',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/45-named-item/create-named-item.yaml',
          group: 'Named Item',
          api_set: {
            ExcelApi: 1.4,
          },
        },
        {
          id: 'excel-named-item-create-and-remove-named-item',
          name: 'Create and remove named items',
          fileName: 'create-and-remove-named-item.yaml',
          description: 'Create and remove named items for a formula',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/45-named-item/create-and-remove-named-item.yaml',
          group: 'Named Item',
          api_set: {
            ExcelApi: 1.4,
          },
        },
        {
          id: 'excel-create-and-use-named-item-for-range',
          name: 'Create and use named range item',
          fileName: 'create-and-use-named-item-for-range.yaml',
          description: 'Create and use named range item',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/45-named-item/create-and-use-named-item-for-range.yaml',
          group: 'Named Item',
          api_set: {
            ExcelApi: 1.4,
          },
        },
        {
          id: 'excel-named-item-list-named-items',
          name: 'List all named items in a workbook',
          fileName: 'list-named-items.yaml',
          description: 'List all named items in a workbook',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/45-named-item/list-named-items.yaml',
          group: 'Named Item',
          api_set: {
            ExcelApi: 1.3,
          },
        },
        {
          id: 'excel-update-named-item',
          name: 'Update a named item',
          fileName: 'update-named-item.yaml',
          description: 'Create and then update a named item',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/45-named-item/update-named-item.yaml',
          group: 'Named Item',
          api_set: {
            ExcelApi: 1.7,
          },
        },
        {
          id: 'excel-chart-create-column-clustered-chart',
          name: 'Column clustered chart',
          fileName: 'create-column-clustered-chart.yaml',
          description: 'Create a column clustered chart',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/50-chart/create-column-clustered-chart.yaml',
          group: 'Chart',
          api_set: {
            ExcelApi: 1.1,
          },
        },
        {
          id: 'excel-chart-create-doughnut-chart',
          name: 'Doughnut chart',
          fileName: 'create-doughnut-chart.yaml',
          description: 'Create a doughnut chart',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/50-chart/create-doughnut-chart.yaml',
          group: 'Chart',
          api_set: {
            ExcelApi: 1.1,
          },
        },
        {
          id: 'excel-chart-create-line-chart',
          name: 'Line chart',
          fileName: 'create-line-chart.yaml',
          description: 'Create a line chart',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/50-chart/create-line-chart.yaml',
          group: 'Chart',
          api_set: {
            ExcelApi: 1.1,
          },
        },
        {
          id: 'excel-chart-create-xyscatter-chart',
          name: 'XY scatter chart',
          fileName: 'create-xyscatter-chart.yaml',
          description: 'Draws a basic XY scatter chart',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/50-chart/create-xyscatter-chart.yaml',
          group: 'Chart',
          api_set: {
            ExcelApi: 1.1,
          },
        },
        {
          id: 'excel-chart-create-additonal-types',
          name: 'Create Additional Chart Types',
          fileName: 'create-additional-chart-types.yaml',
          description: 'Create area, radar, pie, 3D, cylinder, and 100% charts.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/50-chart/create-additional-chart-types.yaml',
          group: 'Chart',
          api_set: {
            ExcelApi: 1.1,
          },
        },
        {
          id: 'excel-chart-axis',
          name: 'Chart axis',
          fileName: 'chart-axis.yaml',
          description: 'Get, set, and remove axis unit, label and title in a chart.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/50-chart/chart-axis.yaml',
          group: 'Chart',
          api_set: {
            ExcelAPI: 1.7,
          },
        },
        {
          id: 'excel-chart-legend',
          name: 'Chart legend',
          fileName: 'chart-legend.yaml',
          description: 'Format legend font',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/50-chart/chart-legend.yaml',
          group: 'Chart',
          api_set: {
            ExcelAPI: 1.7,
          },
        },
        {
          id: 'excel-chart-point',
          name: 'Chart point',
          fileName: 'chart-point.yaml',
          description: 'Set chart point color.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/50-chart/chart-point.yaml',
          group: 'Chart',
          api_set: {
            ExcelAPI: 1.7,
          },
        },
        {
          id: 'excel-chart-series',
          name: 'Chart series',
          fileName: 'chart-series.yaml',
          description: 'Add, set, and delete a series in a chart.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/50-chart/chart-series.yaml',
          group: 'Chart',
          api_set: {
            ExcelAPI: 1.7,
          },
        },
        {
          id: 'excel-chart-series-doughnutholesize',
          name: 'Chart series - doughnutHoleSize',
          fileName: 'chart-series-doughnutholesize.yaml',
          description:
            'Set the doughnutHoleSize property in a series for a dough nut chart.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/50-chart/chart-series-doughnutholesize.yaml',
          group: 'Chart',
          api_set: {
            ExcelApi: 1.7,
          },
        },
        {
          id: 'excel-chart-series-markers',
          name: 'Chart series markers',
          fileName: 'chart-series-markers.yaml',
          description: 'Set chart series marker properties',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/50-chart/chart-series-markers.yaml',
          group: 'Chart',
          api_set: {
            ExcelAPI: 1.7,
          },
        },
        {
          id: 'excel-chart-series-plotorder',
          name: 'Chart - series plot order',
          fileName: 'chart-series-plotorder.yaml',
          description: 'Order the plotting of series in a chart.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/50-chart/chart-series-plotorder.yaml',
          group: 'Chart',
          api_set: {
            ExcelAPI: 1.7,
          },
        },
        {
          id: 'excel-chart-title-substring',
          name: 'Chart - Title substring',
          fileName: 'chart-title-substring.yaml',
          description: 'Get and set title substring for a chart.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/50-chart/chart-title-substring.yaml',
          group: 'Chart',
          api_set: {
            ExcelApi: 1.7,
          },
        },
        {
          id: 'excel-chart-trendlines',
          name: 'Chart trendlines',
          fileName: 'chart-trendlines.yaml',
          description: 'Add, get, and format trendlines in a chart.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/50-chart/chart-trendlines.yaml',
          group: 'Chart',
          api_set: {
            ExcelAPI: 1.7,
          },
        },
        {
          id: 'excel-pivottable-refresh-pivot-table',
          name: 'Refresh pivot table',
          fileName: 'refresh-pivot-table.yaml',
          description: 'Refresh pivot table',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/55-pivot-table/refresh-pivot-table.yaml',
          group: 'Pivot Table',
          api_set: {
            ExcelApi: 1.3,
          },
        },
        {
          id: 'excel-events-data-changed',
          name: 'Handle the data changed event',
          fileName: 'data-changed.yaml',
          description:
            'This snippet shows how to register a handler for the data-changed event.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/70-events/data-changed.yaml',
          group: 'Events',
          api_set: {
            ExcelApi: 1.3,
          },
        },
        {
          id: 'excel-events-selection-changed',
          name: 'Selection Changed',
          fileName: 'selection-changed.yaml',
          description: 'Add and remove an event handler on the selection changed event',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/70-events/selection-changed.yaml',
          group: 'Events',
          api_set: {
            ExcelApi: 1.2,
          },
        },
        {
          id: 'excel-events-setting-changed',
          name: 'Handle the settings-changed event',
          fileName: 'setting-changed.yaml',
          description:
            'This snippet shows how to register a handler for the SettingsChanged event.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/70-events/setting-changed.yaml',
          group: 'Events',
          api_set: {
            ExcelApi: 1.4,
          },
        },
        {
          id: 'excel-events-table-changed',
          name: 'Events - Table changed',
          fileName: 'events-table-changed.yaml',
          description:
            'Add event handlers for table onChanged and onSelectionChanged events',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/70-events/events-table-changed.yaml',
          group: 'Events',
          api_set: {
            ExcelApi: 1.7,
          },
        },
        {
          id: 'excel-events-tablecollection-changed',
          name: 'Events - Table collection changed',
          fileName: 'events-tablecollection-changed.yaml',
          description: 'Add event handlers for table collection onChanged event',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/70-events/events-tablecollection-changed.yaml',
          group: 'Events',
          api_set: {
            ExcelApi: 1.7,
          },
        },
        {
          id: 'excel-events-worksheet-activated',
          name: 'Events - Worksheet activated',
          fileName: 'events-worksheet-activated.yaml',
          description:
            'Add event handlers for worksheet onActivated and onDeactivated events',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/70-events/events-worksheet-activated.yaml',
          group: 'Events',
          api_set: {
            ExcelApi: 1.7,
          },
        },
        {
          id: 'excel-events-worksheet-changed',
          name: 'Events - Worksheet changed',
          fileName: 'events-worksheet-changed.yaml',
          description: 'Add event handlers for worksheet onChanged and onAdded events',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/70-events/events-worksheet-changed.yaml',
          group: 'Events',
          api_set: {
            ExcelApi: 1.7,
          },
        },
        {
          id: 'excel-events-worksheet-selectionchanged',
          name: 'Events - Worksheet onSelectionChanged',
          fileName: 'events-worksheet-selectionchanged.yaml',
          description: 'Add an event handler for the worksheet onSelectionChanged event',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/70-events/events-worksheet-selectionchanged.yaml',
          group: 'Events',
          api_set: {
            ExcelApi: 1.7,
          },
        },
        {
          id: 'excel-settings-create-get-change-delete-settings',
          name: 'Create, get, change, and delete a setting',
          fileName: 'create-get-change-delete-settings.yaml',
          description:
            'Show how to create, get, change, and delete settings in the document.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/80-settings/create-get-change-delete-settings.yaml',
          group: 'Settings',
          api_set: {
            ExcelApi: 1.4,
          },
        },
        {
          id: 'excel-document-get-file-in-slices-async',
          name: 'Get file (using slicing)',
          fileName: 'get-file-in-slices-async.yaml',
          description:
            'Use slicing to get the byte array and base64-encoded string that represent the current document.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/82-document/get-file-in-slices-async.yaml',
          group: 'Document',
          api_set: {
            ExcelApi: 1.1,
          },
        },
        {
          id: 'excel-document-properties',
          name: 'Document properties',
          fileName: 'properties.yaml',
          description: 'Set and get document properties.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/82-document/properties.yaml',
          group: 'Document',
          api_set: {
            ExcelApi: 1.7,
          },
        },
        {
          id: 'excel-custom-xml-parts-create-set-get-and-delete-custom-xml-parts',
          name: 'Create, set, get, and delete custom XML part',
          fileName: 'create-set-get-and-delete-custom-xml-parts.yaml',
          description: 'Shows how to create, set, get, and delete a custom XML part.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/85-custom-xml-parts/create-set-get-and-delete-custom-xml-parts.yaml',
          group: 'Custom XML Parts',
          api_set: {
            ExcelApi: 1.5,
          },
        },
        {
          id: 'excel-custom-xml-parts-test-xml-for-unique-namespace',
          name: 'Test custom XML part for unique namespace',
          fileName: 'test-xml-for-unique-namespace.yaml',
          description:
            'Shows how to test to see if there is only one XML part for a specified namespace.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/85-custom-xml-parts/test-xml-for-unique-namespace.yaml',
          group: 'Custom XML Parts',
          api_set: {
            ExcelApi: 1.5,
          },
        },
        {
          id: 'excel-multiple-property-set',
          name: 'Multiple Property Set',
          fileName: 'multiple-property-set.yaml',
          description:
            'Setting multiple properties at once with the rich API object set() method.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/88-common-patterns/multiple-property-set.yaml',
          group: 'Common Patterns',
          api_set: {
            ExcelApi: 1.4,
          },
        },
        {
          id: 'excel-chart-axis-formatting',
          name: 'Chart - Axis formatting',
          fileName: 'chart-axis-formatting.yaml',
          description: 'Format the vertical and horizontal axis in a chart.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/89-preview-apis/chart-axis-formatting.yaml',
          group: 'Preview APIs',
          api_set: {
            ExcelAPI: 1.8,
          },
        },
        {
          id: 'excel-data-validation',
          name: 'Data Validation',
          fileName: 'data-validation.yaml',
          description:
            'This snippet shows how to programmatically set a variety of data validation rules on ranges, how to prompt users to enter valid data, and how to popup a warning or informational message when invalid data is entered.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/89-preview-apis/data-validation.yaml',
          group: 'Preview APIs',
          api_set: {
            ExcelApi: 1.8,
          },
        },
        {
          id: 'excel-events-chart-activated',
          name: 'Events - Chart Activate',
          fileName: 'events-chart-activated.yaml',
          description:
            'Create handlers for the Chart.onActivated and Chart.onDeactivated events.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/89-preview-apis/events-chart-activated.yaml',
          group: 'Preview APIs',
          api_set: {
            ExcelApi: 1.8,
          },
        },
        {
          id: 'excel-events-chartcollection-added-activated',
          name: 'Events - ChartCollection',
          fileName: 'events-chartcollection-added-activated.yaml',
          description:
            'Shows how to handle the ChartCollection onActivated, onDeactivated, onAdded, and onDeleted events.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/89-preview-apis/events-chartcollection-added-activated.yaml',
          group: 'Preview APIs',
          api_set: {
            ExcelApi: 1.8,
          },
        },
        {
          id: 'excel-events-worksheet-calculated',
          name: 'Events - Worksheet onCalculated',
          fileName: 'events-worksheet-calculated.yaml',
          description: 'Add an event handler for the worksheet onCalculated event',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/89-preview-apis/events-worksheet-calculated.yaml',
          group: 'Preview APIs',
          api_set: {
            ExcelApi: 1.8,
          },
        },
        {
          id: 'excel-events-worksheetcollection-calculated',
          name: 'Events - WorksheetCollection onCalculated',
          fileName: 'events-worksheetcollection-calculated.yaml',
          description:
            'Add an event handler for the WorksheetCollection onCalculated event',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/89-preview-apis/events-worksheetcollection-calculated.yaml',
          group: 'Preview APIs',
          api_set: {
            ExcelApi: 1.8,
          },
        },
        {
          id: 'excel-gridlines',
          name: 'Worksheet gridlines',
          fileName: 'worksheet-gridlines.yaml',
          description: 'Hide and show gridlines in a worksheet',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/89-preview-apis/worksheet-gridlines.yaml',
          group: 'Preview APIs',
          api_set: {
            ExcelAPI: 1.8,
          },
        },
        {
          id: 'excel-range-areas',
          name: 'Using Areas (Discontiguous Ranges)',
          fileName: 'range-areas.yaml',
          description:
            'Work with Areas, which are sets of ranges that need not be contiguous with each other.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/89-preview-apis/range-areas.yaml',
          group: 'Preview APIs',
          api_set: {
            ExcelApi: 1.8,
          },
        },
        {
          id: 'excel-just-for-fun-gradient',
          name: 'Gradient',
          fileName: 'gradient.yaml',
          description:
            'Uses range formatting and external libraries to draw a colorful gradient within a range. Contributed by Alexander Zlatkovski.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/90-just-for-fun/gradient.yaml',
          group: 'Just For Fun',
          api_set: {
            ExcelApi: 1.2,
          },
        },
        {
          id: 'excel-just-for-fun-patterns',
          name: 'Colorful Patterns',
          fileName: 'patterns.yaml',
          description:
            'Shows how to use range formatting to draw interesting pattern. Contributed by Alexander Zlatkovski',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/90-just-for-fun/patterns.yaml',
          group: 'Just For Fun',
          api_set: {
            ExcelApi: 1.2,
          },
        },
        {
          id: 'excel-just-for-fun-path-finder-game',
          name: 'Path finder',
          fileName: 'path-finder-game.yaml',
          description:
            'Using range formatting to play a "pathfinder game". Contributed by Alexander Zlatkovski',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/90-just-for-fun/path-finder-game.yaml',
          group: 'Just For Fun',
          api_set: {
            ExcelApi: 1.2,
          },
        },
        {
          id: 'excel-just-for-fun-color-wheel',
          name: 'Wheel of colors',
          fileName: 'color-wheel.yaml',
          description:
            'Uses chart formatting to draw a wheel with changing colors. Contributed by Alexander Zlatkovski.',
          rawUrl:
            'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/90-just-for-fun/color-wheel.yaml',
          group: 'Just For Fun',
          api_set: {
            ExcelApi: 1.1,
          },
        },
      ],
    }
  }

  populate() {
    const newGroupedSamples = {}
    const visibles = this.state.visible
    visibles.forEach(sample => {
      const group = newGroupedSamples[sample.group] || []
      group.push(sample)
      newGroupedSamples[sample.group] = group
    })
    console.log(newGroupedSamples)
    this.setState({ groupedSamples: newGroupedSamples })
    console.log(this)
  }

  displaySearchedSamples(value) {
    // Clear the samples on the page when user presses enter
    const clearedArray = []
    this.setState({ visible: clearedArray })
    // check every entry for a match with search value
    for (const entry of this.state.samples) {
      const entryName = entry.name.toLowerCase()
      // if match
      if (entryName.indexOf(value.toLowerCase()) !== -1) {
        // create new copy of visible state
        const newVisibleArray = this.state.visible
        // add the entry to the state
        newVisibleArray.push(entry)
        console.log(newVisibleArray)
        // TODO: add to visible
        this.setState({ visible: newVisibleArray })
      }
    }
    console.log(this.state.visible)
    this.populate()
  }

  render() {
    return (
      <Content
        title="Samples"
        description="Choose one of the samples below to get started."
      >
        <Searchbar
          data={this.state.samples}
          searchExecution={this.displaySearchedSamples}
        />
        {Object.keys(this.state.groupedSamples).map(group => (
          <GalleryList
            title={group}
            items={this.state.groupedSamples[group].map(
              ({ name: title, description }) => ({
                title,
                description,
              }),
            )}
          />
        ))}
      </Content>
    )
  }
}
/* 
const samples = [
  {
    id: 'excel-basic-api-call',
    name: 'Basic API call',
    fileName: 'basic-api-call.yaml',
    description: 'Executes a basic Excel API call',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/01-basics/basic-api-call.yaml',
    group: 'Basics',
    api_set: {
      ExcelApi: 1.1,
    },
  },
  {
    id: 'excel-basic-api-call-es5',
    name: 'Basic API call (JavaScript)',
    fileName: 'basic-api-call-es5.yaml',
    description: 'Executes a basic Excel API call using plain JavaScript & Promises',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/01-basics/basic-api-call-es5.yaml',
    group: 'Basics',
    api_set: {
      ExcelApi: 1.1,
    },
  },
  {
    id: 'excel-basics-basic-common-api-call',
    name: 'Basic API call (Office 2013)',
    fileName: 'basic-common-api-call.yaml',
    description:
      'Executes a basic Excel API call using the "common API" syntax (compatible with Office 2013).',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/01-basics/basic-common-api-call.yaml',
    group: 'Basics',
    api_set: {
      Selection: 1.1,
    },
  },
  {
    id: 'excel-advanced-report-generation',
    name: 'Report generation',
    fileName: 'report-generation.yaml',
    description:
      'Writes data to the workbook, reads and applies basic formatting, and adds a chart bound to that data.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/20-scenarios/report-generation.yaml',
    group: 'Scenarios',
    api_set: {
      ExcelApi: 1.1,
    },
  },
  {
    id: 'excel-range-conditional-formatting-basic',
    name: 'Conditional Formatting for Ranges - Basic',
    fileName: 'conditional-formatting-basic.yaml',
    description: 'Apply common types of conditional formatting to ranges.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/30-range/conditional-formatting-basic.yaml',
    group: 'Range',
    api_set: {
      ExcelApi: 1.6,
    },
  },
  {
    id: 'excel-range-conditional-formatting-advanced',
    name: 'Conditional Formatting for Ranges - Advanced',
    fileName: 'conditional-formatting-advanced.yaml',
    description: 'Work with more than one conditional format on the same range.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/30-range/conditional-formatting-advanced.yaml',
    group: 'Range',
    api_set: {
      ExcelApi: 1.6,
    },
  },
  {
    id: 'excel-range-copy-multiply-values',
    name: 'Copy and multiply values',
    fileName: 'copy-multiply-values.yaml',
    description: 'Copy and multiply values in a range',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/30-range/copy-multiply-values.yaml',
    group: 'Range',
    api_set: {
      ExcelApi: 1.1,
    },
  },
  {
    id: 'excel-range-create-and-use-range-intersection',
    name: 'Create and Use an Intersection of Ranges',
    fileName: 'create-and-use-range-intersection.yaml',
    description: 'Create a an intersection of two ranges and make a chart of it.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/30-range/create-and-use-range-intersection.yaml',
    group: 'Range',
    api_set: {
      ExcelApi: 1.4,
    },
  },
  {
    id: 'excel-range-formatting',
    name: 'Formatting',
    fileName: 'formatting.yaml',
    description: 'Format a range',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/30-range/formatting.yaml',
    group: 'Range',
    api_set: {
      ExcelApi: 1.1,
    },
  },
  {
    id: 'excel-range-insert-delete-clear-range',
    name: 'Insert, delete, clear range',
    fileName: 'insert-delete-clear-range.yaml',
    description: 'Insert, delete and clear a range',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/30-range/insert-delete-clear-range.yaml',
    group: 'Range',
    api_set: {
      ExcelApi: 1.1,
    },
  },
  {
    id: 'excel-range-range-operations',
    name: 'Range operations',
    fileName: 'range-operations.yaml',
    description: 'Bounding rect, intersection, offset and resized range',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/30-range/range-operations.yaml',
    group: 'Range',
    api_set: {
      ExcelApi: 1.1,
    },
  },
  {
    id: 'excel-range-selected-range',
    name: 'Selected range',
    fileName: 'selected-range.yaml',
    description: 'Get and set the currently selected range',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/30-range/selected-range.yaml',
    group: 'Range',
    api_set: {
      ExcelApi: 1.1,
    },
  },
  {
    id: 'excel-range-set-get-values',
    name: 'Set and get values',
    fileName: 'set-get-values.yaml',
    description: 'Set and get values and formulas for a range',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/30-range/set-get-values.yaml',
    group: 'Range',
    api_set: {
      ExcelApi: 1.1,
    },
  },
  {
    id: 'excel-range-test-for-used-range',
    name: 'Test for used range',
    fileName: 'test-for-used-range.yaml',
    description: "Create a chart from a table only if there's data in the table.",
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/30-range/test-for-used-range.yaml',
    group: 'Range',
    api_set: {
      ExcelApi: 1.4,
    },
  },
  {
    id: 'excel-range-working-with-dates',
    name: 'Working with dates',
    fileName: 'working-with-dates.yaml',
    description:
      'Setting and getting date values in a range and manipulating them using the Moment JavaScript library with the Moment-MSDate plug-in',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/30-range/working-with-dates.yaml',
    group: 'Range',
    api_set: {
      ExcelApi: 1.1,
    },
  },
  {
    id: 'excel-range-hyperlink',
    name: 'Range hyperlink',
    fileName: 'range-hyperlink.yaml',
    description: 'Create, update, and clear a hyperlink for a range.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/30-range/range-hyperlink.yaml',
    group: 'Range',
    api_set: {
      ExcelApi: 1.7,
    },
  },
  {
    id: 'excel-range-text-orientation',
    name: 'Range text orientation',
    fileName: 'range-text-orientation.yaml',
    description: 'Set and get the text orientation within a range',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/30-range/range-text-orientation.yaml',
    group: 'Range',
    api_set: {
      ExcelApi: 1.7,
    },
  },
  {
    id: 'excel-worksheet-activeworksheet',
    name: 'Active worksheet',
    fileName: 'activeworksheet.yaml',
    description: 'Get and set the active worksheet',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/35-worksheet/activeworksheet.yaml',
    group: 'Worksheet',
    api_set: {
      ExcelApi: 1.1,
    },
  },
  {
    id: 'excel-worksheet-add-delete-rename-move-worksheet',
    name: 'Add, delete, rename and move worksheet',
    fileName: 'add-delete-rename-move-worksheet.yaml',
    description: 'Add, delete, rename and change the position of a worksheet',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/35-worksheet/add-delete-rename-move-worksheet.yaml',
    group: 'Worksheet',
    api_set: {
      ExcelApi: 1.1,
    },
  },
  {
    id: 'excel-worksheet-hide-unhide-worksheet',
    name: 'Hide and unhide worksheet',
    fileName: 'hide-unhide-worksheet.yaml',
    description: 'Hide and unhide a worksheet',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/35-worksheet/hide-unhide-worksheet.yaml',
    group: 'Worksheet',
    api_set: {
      ExcelApi: 1.1,
    },
  },
  {
    id: 'excel-worksheet-list-worksheets',
    name: 'List worksheets',
    fileName: 'list-worksheets.yaml',
    description: 'List the worksheets in the workbook',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/35-worksheet/list-worksheets.yaml',
    group: 'Worksheet',
    api_set: {
      ExcelApi: 1.1,
    },
  },
  {
    id: 'excel-worksheet-reference-worksheets-by-relative-position',
    name: 'Reference worksheets by relative position',
    fileName: 'reference-worksheets-by-relative-position.yaml',
    description:
      'Shows how to use the worksheet shortcut methods, such as getFirst, getLast, getPrevious, and getNext.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/35-worksheet/reference-worksheets-by-relative-position.yaml',
    group: 'Worksheet',
    api_set: {
      ExcelApi: 1.5,
    },
  },
  {
    id: 'excel-worksheet-worksheet-range-cell',
    name: 'Worksheet range and cell',
    fileName: 'worksheet-range-cell.yaml',
    description: 'Get a range or a cell in a worksheet',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/35-worksheet/worksheet-range-cell.yaml',
    group: 'Worksheet',
    api_set: {
      ExcelApi: 1.1,
    },
  },
  {
    id: 'excel-worksheet-copy',
    name: 'Copy worksheet',
    fileName: 'worksheet-copy.yaml',
    description: 'Copies the active worksheet to the specified location.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/35-worksheet/worksheet-copy.yaml',
    group: 'Worksheet',
    api_set: {
      ExcelApi: 1.7,
    },
  },
  {
    id: 'excel-worksheet-freeze-panes',
    name: 'Manage frozen panes in a worksheet',
    fileName: 'worksheet-freeze-panes.yaml',
    description:
      'Freeze columns, freeze rows, freeze a range, and manage frozen panes in a worksheet.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/35-worksheet/worksheet-freeze-panes.yaml',
    group: 'Worksheet',
    api_set: {
      ExcelApi: 1.7,
    },
  },
  {
    id: 'excel-worksheet-tab-color',
    name: 'Worksheet tab color',
    fileName: 'tab-color.yaml',
    description: 'Set and get the tab color of a worksheet',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/35-worksheet/tab-color.yaml',
    group: 'Worksheet',
    api_set: {
      ExcelApi: 1.7,
    },
  },
  {
    id: 'excel-workbook-get-active-cell',
    name: 'Get active cell',
    fileName: 'workbook-get-active-cell.yaml',
    description: 'Gets the active cell of the entire workbook.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/37-workbook/workbook-get-active-cell.yaml',
    group: 'Workbook',
    api_set: {
      ExcelApi: 1.7,
    },
  },
  {
    id: 'excel-protect-data-in-worksheet-and-workbook-structure',
    name: 'Protect data in worksheet and the workbook structure',
    fileName: 'protect-data-in-worksheet-and-workbook-structure.yaml',
    description: 'Shows how to protect data in a worksheet and the workbook structure.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/37-workbook/protect-data-in-worksheet-and-workbook-structure.yaml',
    group: 'Workbook',
    api_set: {
      ExcelApi: 1.7,
    },
  },
  {
    id: 'excel-style',
    name: 'Style',
    fileName: 'style.yaml',
    description: 'Add, apply, get and delete styles.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/40-table/style.yaml',
    group: 'Table',
    api_set: {
      ExcelApi: 1.7,
    },
  },
  {
    id: 'excel-table-add-rows-and-columns-to-a-table',
    name: 'Add rows and columns',
    fileName: 'add-rows-and-columns-to-a-table.yaml',
    description: 'Add rows and columns to a table',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/40-table/add-rows-and-columns-to-a-table.yaml',
    group: 'Table',
    api_set: {
      ExcelApi: 1.1,
    },
  },
  {
    id: 'excel-table-convert-range-to-table',
    name: 'Convert a range to a table',
    fileName: 'convert-range-to-table.yaml',
    description: 'Convert a range to a table',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/40-table/convert-range-to-table.yaml',
    group: 'Table',
    api_set: {
      ExcelApi: 1.1,
    },
  },
  {
    id: 'excel-table-create-table',
    name: 'Create a table',
    fileName: 'create-table.yaml',
    description: 'Creates a table with four columns and seven rows.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/40-table/create-table.yaml',
    group: 'Table',
    api_set: {
      ExcelApi: 1.1,
    },
  },
  {
    id: 'excel-table-filter-data',
    name: 'Filter data',
    fileName: 'filter-data.yaml',
    description: 'Filter data in a table',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/40-table/filter-data.yaml',
    group: 'Table',
    api_set: {
      ExcelApi: 1.1,
    },
  },
  {
    id: 'excel-table-format-table',
    name: 'Format table',
    fileName: 'format-table.yaml',
    description: 'Format a table',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/40-table/format-table.yaml',
    group: 'Table',
    api_set: {
      ExcelApi: 1.1,
    },
  },
  {
    id: 'excel-table-get-data-from-table',
    name: 'Get data from a table',
    fileName: 'get-data-from-table.yaml',
    description: 'Get data from a table',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/40-table/get-data-from-table.yaml',
    group: 'Table',
    api_set: {
      ExcelApi: 1.1,
    },
  },
  {
    id: 'excel-table-get-visible-range-of-a-filtered-table',
    name: 'Get visible range from a filtered table',
    fileName: 'get-visible-range-of-a-filtered-table.yaml',
    description: 'Get visible range from a filtered table',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/40-table/get-visible-range-of-a-filtered-table.yaml',
    group: 'Table',
    api_set: {
      ExcelApi: 1.1,
    },
  },
  {
    id: 'excel-table-import-json-data',
    name: 'Import JSON data',
    fileName: 'import-json-data.yaml',
    description: 'Import JSON data into a table',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/40-table/import-json-data.yaml',
    group: 'Table',
    api_set: {
      ExcelApi: 1.1,
    },
  },
  {
    id: 'excel-table-sort-data',
    name: 'Sort table data',
    fileName: 'sort-data.yaml',
    description: 'Sort table data',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/40-table/sort-data.yaml',
    group: 'Table',
    api_set: {
      ExcelApi: 1.1,
    },
  },
  {
    id: 'excel-named-item-create-named-item',
    name: 'Create a named item',
    fileName: 'create-named-item.yaml',
    description: 'Create a named item for a formula',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/45-named-item/create-named-item.yaml',
    group: 'Named Item',
    api_set: {
      ExcelApi: 1.4,
    },
  },
  {
    id: 'excel-named-item-create-and-remove-named-item',
    name: 'Create and remove named items',
    fileName: 'create-and-remove-named-item.yaml',
    description: 'Create and remove named items for a formula',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/45-named-item/create-and-remove-named-item.yaml',
    group: 'Named Item',
    api_set: {
      ExcelApi: 1.4,
    },
  },
  {
    id: 'excel-create-and-use-named-item-for-range',
    name: 'Create and use named range item',
    fileName: 'create-and-use-named-item-for-range.yaml',
    description: 'Create and use named range item',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/45-named-item/create-and-use-named-item-for-range.yaml',
    group: 'Named Item',
    api_set: {
      ExcelApi: 1.4,
    },
  },
  {
    id: 'excel-named-item-list-named-items',
    name: 'List all named items in a workbook',
    fileName: 'list-named-items.yaml',
    description: 'List all named items in a workbook',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/45-named-item/list-named-items.yaml',
    group: 'Named Item',
    api_set: {
      ExcelApi: 1.3,
    },
  },
  {
    id: 'excel-update-named-item',
    name: 'Update a named item',
    fileName: 'update-named-item.yaml',
    description: 'Create and then update a named item',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/45-named-item/update-named-item.yaml',
    group: 'Named Item',
    api_set: {
      ExcelApi: 1.7,
    },
  },
  {
    id: 'excel-chart-create-column-clustered-chart',
    name: 'Column clustered chart',
    fileName: 'create-column-clustered-chart.yaml',
    description: 'Create a column clustered chart',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/50-chart/create-column-clustered-chart.yaml',
    group: 'Chart',
    api_set: {
      ExcelApi: 1.1,
    },
  },
  {
    id: 'excel-chart-create-doughnut-chart',
    name: 'Doughnut chart',
    fileName: 'create-doughnut-chart.yaml',
    description: 'Create a doughnut chart',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/50-chart/create-doughnut-chart.yaml',
    group: 'Chart',
    api_set: {
      ExcelApi: 1.1,
    },
  },
  {
    id: 'excel-chart-create-line-chart',
    name: 'Line chart',
    fileName: 'create-line-chart.yaml',
    description: 'Create a line chart',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/50-chart/create-line-chart.yaml',
    group: 'Chart',
    api_set: {
      ExcelApi: 1.1,
    },
  },
  {
    id: 'excel-chart-create-xyscatter-chart',
    name: 'XY scatter chart',
    fileName: 'create-xyscatter-chart.yaml',
    description: 'Draws a basic XY scatter chart',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/50-chart/create-xyscatter-chart.yaml',
    group: 'Chart',
    api_set: {
      ExcelApi: 1.1,
    },
  },
  {
    id: 'excel-chart-create-additonal-types',
    name: 'Create Additional Chart Types',
    fileName: 'create-additional-chart-types.yaml',
    description: 'Create area, radar, pie, 3D, cylinder, and 100% charts.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/50-chart/create-additional-chart-types.yaml',
    group: 'Chart',
    api_set: {
      ExcelApi: 1.1,
    },
  },
  {
    id: 'excel-chart-axis',
    name: 'Chart axis',
    fileName: 'chart-axis.yaml',
    description: 'Get, set, and remove axis unit, label and title in a chart.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/50-chart/chart-axis.yaml',
    group: 'Chart',
    api_set: {
      ExcelAPI: 1.7,
    },
  },
  {
    id: 'excel-chart-legend',
    name: 'Chart legend',
    fileName: 'chart-legend.yaml',
    description: 'Format legend font',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/50-chart/chart-legend.yaml',
    group: 'Chart',
    api_set: {
      ExcelAPI: 1.7,
    },
  },
  {
    id: 'excel-chart-point',
    name: 'Chart point',
    fileName: 'chart-point.yaml',
    description: 'Set chart point color.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/50-chart/chart-point.yaml',
    group: 'Chart',
    api_set: {
      ExcelAPI: 1.7,
    },
  },
  {
    id: 'excel-chart-series',
    name: 'Chart series',
    fileName: 'chart-series.yaml',
    description: 'Add, set, and delete a series in a chart.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/50-chart/chart-series.yaml',
    group: 'Chart',
    api_set: {
      ExcelAPI: 1.7,
    },
  },
  {
    id: 'excel-chart-series-doughnutholesize',
    name: 'Chart series - doughnutHoleSize',
    fileName: 'chart-series-doughnutholesize.yaml',
    description: 'Set the doughnutHoleSize property in a series for a dough nut chart.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/50-chart/chart-series-doughnutholesize.yaml',
    group: 'Chart',
    api_set: {
      ExcelApi: 1.7,
    },
  },
  {
    id: 'excel-chart-series-markers',
    name: 'Chart series markers',
    fileName: 'chart-series-markers.yaml',
    description: 'Set chart series marker properties',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/50-chart/chart-series-markers.yaml',
    group: 'Chart',
    api_set: {
      ExcelAPI: 1.7,
    },
  },
  {
    id: 'excel-chart-series-plotorder',
    name: 'Chart - series plot order',
    fileName: 'chart-series-plotorder.yaml',
    description: 'Order the plotting of series in a chart.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/50-chart/chart-series-plotorder.yaml',
    group: 'Chart',
    api_set: {
      ExcelAPI: 1.7,
    },
  },
  {
    id: 'excel-chart-title-substring',
    name: 'Chart - Title substring',
    fileName: 'chart-title-substring.yaml',
    description: 'Get and set title substring for a chart.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/50-chart/chart-title-substring.yaml',
    group: 'Chart',
    api_set: {
      ExcelApi: 1.7,
    },
  },
  {
    id: 'excel-chart-trendlines',
    name: 'Chart trendlines',
    fileName: 'chart-trendlines.yaml',
    description: 'Add, get, and format trendlines in a chart.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/50-chart/chart-trendlines.yaml',
    group: 'Chart',
    api_set: {
      ExcelAPI: 1.7,
    },
  },
  {
    id: 'excel-pivottable-refresh-pivot-table',
    name: 'Refresh pivot table',
    fileName: 'refresh-pivot-table.yaml',
    description: 'Refresh pivot table',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/55-pivot-table/refresh-pivot-table.yaml',
    group: 'Pivot Table',
    api_set: {
      ExcelApi: 1.3,
    },
  },
  {
    id: 'excel-events-data-changed',
    name: 'Handle the data changed event',
    fileName: 'data-changed.yaml',
    description:
      'This snippet shows how to register a handler for the data-changed event.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/70-events/data-changed.yaml',
    group: 'Events',
    api_set: {
      ExcelApi: 1.3,
    },
  },
  {
    id: 'excel-events-selection-changed',
    name: 'Selection Changed',
    fileName: 'selection-changed.yaml',
    description: 'Add and remove an event handler on the selection changed event',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/70-events/selection-changed.yaml',
    group: 'Events',
    api_set: {
      ExcelApi: 1.2,
    },
  },
  {
    id: 'excel-events-setting-changed',
    name: 'Handle the settings-changed event',
    fileName: 'setting-changed.yaml',
    description:
      'This snippet shows how to register a handler for the SettingsChanged event.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/70-events/setting-changed.yaml',
    group: 'Events',
    api_set: {
      ExcelApi: 1.4,
    },
  },
  {
    id: 'excel-events-table-changed',
    name: 'Events - Table changed',
    fileName: 'events-table-changed.yaml',
    description: 'Add event handlers for table onChanged and onSelectionChanged events',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/70-events/events-table-changed.yaml',
    group: 'Events',
    api_set: {
      ExcelApi: 1.7,
    },
  },
  {
    id: 'excel-events-tablecollection-changed',
    name: 'Events - Table collection changed',
    fileName: 'events-tablecollection-changed.yaml',
    description: 'Add event handlers for table collection onChanged event',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/70-events/events-tablecollection-changed.yaml',
    group: 'Events',
    api_set: {
      ExcelApi: 1.7,
    },
  },
  {
    id: 'excel-events-worksheet-activated',
    name: 'Events - Worksheet activated',
    fileName: 'events-worksheet-activated.yaml',
    description: 'Add event handlers for worksheet onActivated and onDeactivated events',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/70-events/events-worksheet-activated.yaml',
    group: 'Events',
    api_set: {
      ExcelApi: 1.7,
    },
  },
  {
    id: 'excel-events-worksheet-changed',
    name: 'Events - Worksheet changed',
    fileName: 'events-worksheet-changed.yaml',
    description: 'Add event handlers for worksheet onChanged and onAdded events',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/70-events/events-worksheet-changed.yaml',
    group: 'Events',
    api_set: {
      ExcelApi: 1.7,
    },
  },
  {
    id: 'excel-events-worksheet-selectionchanged',
    name: 'Events - Worksheet onSelectionChanged',
    fileName: 'events-worksheet-selectionchanged.yaml',
    description: 'Add an event handler for the worksheet onSelectionChanged event',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/70-events/events-worksheet-selectionchanged.yaml',
    group: 'Events',
    api_set: {
      ExcelApi: 1.7,
    },
  },
  {
    id: 'excel-settings-create-get-change-delete-settings',
    name: 'Create, get, change, and delete a setting',
    fileName: 'create-get-change-delete-settings.yaml',
    description: 'Show how to create, get, change, and delete settings in the document.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/80-settings/create-get-change-delete-settings.yaml',
    group: 'Settings',
    api_set: {
      ExcelApi: 1.4,
    },
  },
  {
    id: 'excel-document-get-file-in-slices-async',
    name: 'Get file (using slicing)',
    fileName: 'get-file-in-slices-async.yaml',
    description:
      'Use slicing to get the byte array and base64-encoded string that represent the current document.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/82-document/get-file-in-slices-async.yaml',
    group: 'Document',
    api_set: {
      ExcelApi: 1.1,
    },
  },
  {
    id: 'excel-document-properties',
    name: 'Document properties',
    fileName: 'properties.yaml',
    description: 'Set and get document properties.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/82-document/properties.yaml',
    group: 'Document',
    api_set: {
      ExcelApi: 1.7,
    },
  },
  {
    id: 'excel-custom-xml-parts-create-set-get-and-delete-custom-xml-parts',
    name: 'Create, set, get, and delete custom XML part',
    fileName: 'create-set-get-and-delete-custom-xml-parts.yaml',
    description: 'Shows how to create, set, get, and delete a custom XML part.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/85-custom-xml-parts/create-set-get-and-delete-custom-xml-parts.yaml',
    group: 'Custom XML Parts',
    api_set: {
      ExcelApi: 1.5,
    },
  },
  {
    id: 'excel-custom-xml-parts-test-xml-for-unique-namespace',
    name: 'Test custom XML part for unique namespace',
    fileName: 'test-xml-for-unique-namespace.yaml',
    description:
      'Shows how to test to see if there is only one XML part for a specified namespace.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/85-custom-xml-parts/test-xml-for-unique-namespace.yaml',
    group: 'Custom XML Parts',
    api_set: {
      ExcelApi: 1.5,
    },
  },
  {
    id: 'excel-multiple-property-set',
    name: 'Multiple Property Set',
    fileName: 'multiple-property-set.yaml',
    description:
      'Setting multiple properties at once with the rich API object set() method.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/88-common-patterns/multiple-property-set.yaml',
    group: 'Common Patterns',
    api_set: {
      ExcelApi: 1.4,
    },
  },
  {
    id: 'excel-chart-axis-formatting',
    name: 'Chart - Axis formatting',
    fileName: 'chart-axis-formatting.yaml',
    description: 'Format the vertical and horizontal axis in a chart.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/89-preview-apis/chart-axis-formatting.yaml',
    group: 'Preview APIs',
    api_set: {
      ExcelAPI: 1.8,
    },
  },
  {
    id: 'excel-data-validation',
    name: 'Data Validation',
    fileName: 'data-validation.yaml',
    description:
      'This snippet shows how to programmatically set a variety of data validation rules on ranges, how to prompt users to enter valid data, and how to popup a warning or informational message when invalid data is entered.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/89-preview-apis/data-validation.yaml',
    group: 'Preview APIs',
    api_set: {
      ExcelApi: 1.8,
    },
  },
  {
    id: 'excel-events-chart-activated',
    name: 'Events - Chart Activate',
    fileName: 'events-chart-activated.yaml',
    description:
      'Create handlers for the Chart.onActivated and Chart.onDeactivated events.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/89-preview-apis/events-chart-activated.yaml',
    group: 'Preview APIs',
    api_set: {
      ExcelApi: 1.8,
    },
  },
  {
    id: 'excel-events-chartcollection-added-activated',
    name: 'Events - ChartCollection',
    fileName: 'events-chartcollection-added-activated.yaml',
    description:
      'Shows how to handle the ChartCollection onActivated, onDeactivated, onAdded, and onDeleted events.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/89-preview-apis/events-chartcollection-added-activated.yaml',
    group: 'Preview APIs',
    api_set: {
      ExcelApi: 1.8,
    },
  },
  {
    id: 'excel-events-worksheet-calculated',
    name: 'Events - Worksheet onCalculated',
    fileName: 'events-worksheet-calculated.yaml',
    description: 'Add an event handler for the worksheet onCalculated event',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/89-preview-apis/events-worksheet-calculated.yaml',
    group: 'Preview APIs',
    api_set: {
      ExcelApi: 1.8,
    },
  },
  {
    id: 'excel-events-worksheetcollection-calculated',
    name: 'Events - WorksheetCollection onCalculated',
    fileName: 'events-worksheetcollection-calculated.yaml',
    description: 'Add an event handler for the WorksheetCollection onCalculated event',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/89-preview-apis/events-worksheetcollection-calculated.yaml',
    group: 'Preview APIs',
    api_set: {
      ExcelApi: 1.8,
    },
  },
  {
    id: 'excel-gridlines',
    name: 'Worksheet gridlines',
    fileName: 'worksheet-gridlines.yaml',
    description: 'Hide and show gridlines in a worksheet',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/89-preview-apis/worksheet-gridlines.yaml',
    group: 'Preview APIs',
    api_set: {
      ExcelAPI: 1.8,
    },
  },
  {
    id: 'excel-range-areas',
    name: 'Using Areas (Discontiguous Ranges)',
    fileName: 'range-areas.yaml',
    description:
      'Work with Areas, which are sets of ranges that need not be contiguous with each other.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/89-preview-apis/range-areas.yaml',
    group: 'Preview APIs',
    api_set: {
      ExcelApi: 1.8,
    },
  },
  {
    id: 'excel-just-for-fun-gradient',
    name: 'Gradient',
    fileName: 'gradient.yaml',
    description:
      'Uses range formatting and external libraries to draw a colorful gradient within a range. Contributed by Alexander Zlatkovski.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/90-just-for-fun/gradient.yaml',
    group: 'Just For Fun',
    api_set: {
      ExcelApi: 1.2,
    },
  },
  {
    id: 'excel-just-for-fun-patterns',
    name: 'Colorful Patterns',
    fileName: 'patterns.yaml',
    description:
      'Shows how to use range formatting to draw interesting pattern. Contributed by Alexander Zlatkovski',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/90-just-for-fun/patterns.yaml',
    group: 'Just For Fun',
    api_set: {
      ExcelApi: 1.2,
    },
  },
  {
    id: 'excel-just-for-fun-path-finder-game',
    name: 'Path finder',
    fileName: 'path-finder-game.yaml',
    description:
      'Using range formatting to play a "pathfinder game". Contributed by Alexander Zlatkovski',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/90-just-for-fun/path-finder-game.yaml',
    group: 'Just For Fun',
    api_set: {
      ExcelApi: 1.2,
    },
  },
  {
    id: 'excel-just-for-fun-color-wheel',
    name: 'Wheel of colors',
    fileName: 'color-wheel.yaml',
    description:
      'Uses chart formatting to draw a wheel with changing colors. Contributed by Alexander Zlatkovski.',
    rawUrl:
      'https://raw.githubusercontent.com/<ACCOUNT>/<REPO>/<BRANCH>/samples/excel/90-just-for-fun/color-wheel.yaml',
    group: 'Just For Fun',
    api_set: {
      ExcelApi: 1.1,
    },
  },
]

// TODO: create a function that clears the samples in the UI when user searches

const groupedSamples = {}

// TODO: make this not Eww..
samples.forEach(sample => {
  const group = groupedSamples[sample.group] || []
  group.push(sample)
  groupedSamples[sample.group] = group
})

console.log(groupedSamples)

const displaySearchedSamples = value => {
  // TOOD: clear the samples on the page
  Object.values(groupedSamples).forEach(items => [])
  console.log(groupedSamples)
  // check if the user has searched anything
  for (const entry of samples) {
    if (entry.name.indexOf(value) > 0) {
      // TODO: display entry
    }
  }
}

export default props => (
  <Content title="Samples" description="Choose one of the samples below to get started.">
    <Searchbar data={samples} searchExecution={displaySearchedSamples} />
    {Object.keys(groupedSamples).map(group => (
      <GalleryList
        title={group}
        items={groupedSamples[group].map(({ name: title, description }) => ({
          title,
          description,
        }))}
      />
    ))}
  </Content>
) */
