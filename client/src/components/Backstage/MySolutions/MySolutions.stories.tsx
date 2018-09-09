import React from 'react'

import MySolutions from './'

import { storiesOf } from '@storybook/react'

const exampleSolutions = [
  {
    id: 'ec3bc646-e174-4635-8ced-e9da85155073',
    name: 'Blank snippet',
    host: 'EXCEL',
    description: 'Create a new snippet from a blank template.',
    files: [
      {
        id: '5890734a-d2b1-4e80-af99-80b4e730a4f1',
        name: 'index.ts',
        content:
          '$("#run").click(() => tryCatch(run));\n\nasync function run() {\n    await Excel.run(async (context) => {\n\n        OfficeHelpers.UI.notify("Your code goes here");\n\n        await context.sync();\n    });\n}\n\n/** Default helper for invoking an action and handling errors. */\nasync function tryCatch(callback) {\n    try {\n        await callback();\n    }\n    catch (error) {\n        OfficeHelpers.UI.notify(error);\n        OfficeHelpers.Utilities.log(error);\n    }\n}\n',
        language: 'typescript',
        dateCreated: 1535175129365,
        dateLastModified: 1535175129365,
      },
      {
        id: 'b46300c0-239c-47df-afa8-d04cf0574858',
        name: 'index.html',
        content:
          '<button id="run" class="ms-Button">\n    <span class="ms-Button-label">Run</span>\n</button>\n',
        language: 'html',
        dateCreated: 1535175129365,
        dateLastModified: 1535175129365,
      },
      {
        id: 'f502139e-0132-4ab1-b690-aae95dd2e608',
        name: 'index.css',
        content: '/* Your style goes here */\n',
        language: 'css',
        dateCreated: 1535175129365,
        dateLastModified: 1535175129365,
      },
      {
        id: 'a6fe7f7b-ef86-49b8-bb2a-0753688742e8',
        name: 'libraries.txt',
        content:
          'https://appsforoffice.microsoft.com/lib/1/hosted/office.js\n@types/office-js\n\noffice-ui-fabric-js@1.4.0/dist/css/fabric.min.css\noffice-ui-fabric-js@1.4.0/dist/css/fabric.components.min.css\n\ncore-js@2.4.1/client/core.min.js\n@types/core-js\n\n@microsoft/office-js-helpers@0.7.4/dist/office.helpers.min.js\n@microsoft/office-js-helpers@0.7.4/dist/office.helpers.d.ts\n\njquery@3.1.1\n@types/jquery\n',
        language: 'libraries',
        dateCreated: 1535175129365,
        dateLastModified: 1535175129365,
      },
    ],
    dateCreated: 1535175129365,
    dateLastModified: 1535175129365,
  },
  {
    id: '6af21993-5a90-408f-bf79-62044992a9e4',
    name: 'Conditional Formatting for Ranges - Basic',
    host: 'EXCEL',
    description: 'Apply common types of conditional formatting to ranges.',
    files: [
      {
        id: '4ec58fec-c44f-448a-baa0-58d211bf2ed1',
        name: 'index.ts',
        content:
          '$("#setup").click(() => tryCatch(setup));\n$("#apply-color-scale-format").click(() => tryCatch(applyColorScaleFormat));\n$("#apply-preset-format").click(() => tryCatch(applyPresetFormat));\n$("#apply-databar-format").click(() => tryCatch(applyDataBarFormat));\n$("#apply-icon-set-format").click(() => tryCatch(applyIconSetFormat));\n$("#apply-text-format").click(() => tryCatch(applyTextFormat));\n$("#apply-cell-value-format").click(() => tryCatch(applyCellValueFormat));\n$("#apply-custom-format").click(() => tryCatch(applyCustomFormat));\n$("#list-conditional-formats").click(() => tryCatch(listConditionalFormats));\n$("#clear-all-conditional-formats").click(() => tryCatch(clearAllConditionalFormats));\n\nasync function applyColorScaleFormat() {\n    await Excel.run(async (context) => {\n        const sheet = context.workbook.worksheets.getItem("Sample");\n        const range = sheet.getRange("B2:M5");\n        const conditionalFormat = range.conditionalFormats\n            .add(Excel.ConditionalFormatType.colorScale);\n        const criteria = {\n            minimum: { formula: null, type: Excel.ConditionalFormatColorCriterionType.lowestValue, color: "blue" },\n            midpoint: { formula: "50", type: Excel.ConditionalFormatColorCriterionType.percent, color: "yellow" },\n            maximum: { formula: null, type: Excel.ConditionalFormatColorCriterionType.highestValue, color: "red" }\n        };\n        conditionalFormat.colorScale.criteria = criteria;\n\n        await context.sync();\n    });\n}\n\nasync function applyPresetFormat() {\n    await Excel.run(async (context) => {\n        const sheet = context.workbook.worksheets.getItem("Sample");\n        const range = sheet.getRange("B2:M5");\n        const conditionalFormat = range.conditionalFormats\n            .add(Excel.ConditionalFormatType.presetCriteria);\n        conditionalFormat.preset.format.font.color = "white";\n        conditionalFormat.preset.rule = { criterion: Excel.ConditionalFormatPresetCriterion.oneStdDevAboveAverage };\n\n        await context.sync();\n    });\n}\n\nasync function applyDataBarFormat() {\n    await Excel.run(async (context) => {\n        const sheet = context.workbook.worksheets.getItem("Sample");\n        const range = sheet.getRange("B8:E13");\n        const conditionalFormat = range.conditionalFormats\n            .add(Excel.ConditionalFormatType.dataBar);\n        conditionalFormat.dataBar.barDirection = Excel.ConditionalDataBarDirection.leftToRight;\n\n        await context.sync();\n    });\n}\n\nasync function applyIconSetFormat() {\n    await Excel.run(async (context) => {\n        const sheet = context.workbook.worksheets.getItem("Sample");\n        const range = sheet.getRange("B8:E13");\n        const conditionalFormat = range.conditionalFormats\n            .add(Excel.ConditionalFormatType.iconSet);\n        const iconSetCF = conditionalFormat.iconSet;\n        iconSetCF.style = Excel.IconSet.threeTriangles;\n\n        /*\n            The iconSetCF.criteria array is automatically prepopulated with\n            criterion elements whose properties have been given default settings.\n            You can\'t write to each property of a criterion directly. Instead,\n            replace the whole criteria object.\n\n            With a "three*" icon set style, such as "threeTriangles", the third\n            element in the criteria array (criteria[2]) defines the "top" icon;\n            e.g., a green triangle. The second (criteria[1]) defines the "middle"\n            icon, The first (criteria[0]) defines the "low" icon, but it\n            can often be left empty as this method does below, because every\n            cell that does not match the other two criteria always gets the low\n            icon.            \n        */\n        iconSetCF.criteria = [\n            {} as any,\n            {\n                type: Excel.ConditionalFormatIconRuleType.number,\n                operator: Excel.ConditionalIconCriterionOperator.greaterThanOrEqual,\n                formula: "=700"\n            },\n            {\n                type: Excel.ConditionalFormatIconRuleType.number,\n                operator: Excel.ConditionalIconCriterionOperator.greaterThanOrEqual,\n                formula: "=1000",\n            }\n        ];\n\n        await context.sync();\n    });\n}\n\nasync function applyTextFormat() {\n    await Excel.run(async (context) => {\n        const sheet = context.workbook.worksheets.getItem("Sample");\n        const range = sheet.getRange("B16:D18");\n        const conditionalFormat = range.conditionalFormats\n            .add(Excel.ConditionalFormatType.containsText);\n        conditionalFormat.textComparison.format.font.color = "red";\n        conditionalFormat.textComparison.rule = { operator: Excel.ConditionalTextOperator.contains, text: "Delayed" };\n\n        await context.sync();\n    });\n}\n\nasync function applyCellValueFormat() {\n    await Excel.run(async (context) => {\n        const sheet = context.workbook.worksheets.getItem("Sample");\n        const range = sheet.getRange("B21:E23");\n        const conditionalFormat = range.conditionalFormats\n            .add(Excel.ConditionalFormatType.cellValue);\n        conditionalFormat.cellValue.format.font.color = "red";\n        conditionalFormat.cellValue.rule = { formula1: "=0", operator: "LessThan" };\n\n        await context.sync();\n    });\n}\n\nasync function applyCustomFormat() {\n    await Excel.run(async (context) => {\n        const sheet = context.workbook.worksheets.getItem("Sample");\n        const range = sheet.getRange("B8:E13");\n        const conditionalFormat = range.conditionalFormats.add(Excel.ConditionalFormatType.custom);\n        conditionalFormat.custom.rule.formula = \'=IF(B8>INDIRECT("RC[-1]",0),TRUE)\';\n        conditionalFormat.custom.format.font.color = "green";\n\n        await context.sync();\n    });\n}\n\nasync function listConditionalFormats() {\n    await Excel.run(async (context) => {\n        const sheet = context.workbook.worksheets.getItem("Sample");\n        const worksheetRange = sheet.getRange();\n        worksheetRange.conditionalFormats.load("type");\n\n        await context.sync();\n\n        let cfRangePairs: { cf: Excel.ConditionalFormat, range: Excel.Range }[] = [];\n        worksheetRange.conditionalFormats.items.forEach(item => {\n            cfRangePairs.push({\n                cf: item,\n                range: item.getRange().load("address")\n            });\n        });\n\n        await context.sync();\n\n        $("#conditional-formats li").remove();\n        if (cfRangePairs.length > 0) {\n            cfRangePairs.forEach(item => {\n                let $p = $("<p></p>").text(\n                    `${item.cf.type}`)\n                let $li = $(`<li></li>`);\n                $li.append($p);\n                $("#conditional-formats").append($li);\n                $(".conditional-formats").show()[0].scrollIntoView();\n            })\n        }\n        else {\n            OfficeHelpers.UI.notify("None to display", "No conditional formats in workbook", "warning");\n        }\n    });\n}\n\nasync function clearAllConditionalFormats() {\n    await Excel.run(async (context) => {\n        const sheet = context.workbook.worksheets.getItem("Sample");\n        const range = sheet.getRange();\n        range.conditionalFormats.clearAll();\n\n        await context.sync();\n\n        $(".conditional-formats").hide();\n    });\n}\n\nasync function setup() {\n    await Excel.run(async (context) => {\n        const sheet = await OfficeHelpers.ExcelUtilities\n            .forceCreateSheet(context.workbook, "Sample");\n        queueCommandsToCreateTemperatureTable(sheet);\n        queueCommandsToCreateSalesTable(sheet);\n        queueCommandsToCreateProjectTable(sheet);\n        queueCommandsToCreateProfitLossTable(sheet);\n\n        let format = sheet.getRange().format;\n        format.autofitColumns();\n        format.autofitRows();\n\n        sheet.activate();\n        await context.sync();\n    });\n}\n\nfunction queueCommandsToCreateTemperatureTable(sheet: Excel.Worksheet) {\n    let temperatureTable = sheet.tables.add(\'A1:M1\', true);\n    temperatureTable.name = "TemperatureTable";\n    temperatureTable.getHeaderRowRange().values = [["Category", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]];\n    temperatureTable.rows.add(null, [\n        ["Avg High", 40, 38, 44, 45, 51, 56, 67, 72, 79, 59, 45, 41],\n        ["Avg Low", 34, 33, 38, 41, 45, 48, 51, 55, 54, 45, 41, 38],\n        ["Record High", 61, 69, 79, 83, 95, 97, 100, 101, 94, 87, 72, 66],\n        ["Record Low", 0, 2, 9, 24, 28, 32, 36, 39, 35, 21, 12, 4]\n    ]);\n}\n\nfunction queueCommandsToCreateSalesTable(sheet: Excel.Worksheet) {\n    let salesTable = sheet.tables.add(\'A7:E7\', true);\n    salesTable.name = "SalesTable";\n    salesTable.getHeaderRowRange().values = [["Sales Team", "Qtr1", "Qtr2", "Qtr3", "Qtr4"]];\n    salesTable.rows.add(null, [\n        ["Asian Team 1", 500, 700, 654, 234],\n        ["Asian Team 2", 400, 323, 276, 345],\n        ["Asian Team 3", 1200, 876, 845, 456],\n        ["Euro Team 1", 600, 500, 854, 567],\n        ["Euro Team 2", 5001, 2232, 4763, 678],\n        ["Euro Team 3", 130, 776, 104, 789]\n    ]);\n}\n\nfunction queueCommandsToCreateProjectTable(sheet: Excel.Worksheet) {\n    let projectTable = sheet.tables.add(\'A15:D15\', true);\n    projectTable.name = "ProjectTable";\n    projectTable.getHeaderRowRange().values = [["Project", "Alpha", "Beta", "Ship"]];\n    projectTable.rows.add(null, [\n        ["Project 1", "Complete", "Ongoing", "On Schedule"],\n        ["Project 2", "Complete", "Complete", "On Schedule"],\n        ["Project 3", "Ongoing", "Not Started", "Delayed"]\n    ]);\n}\n\nfunction queueCommandsToCreateProfitLossTable(sheet: Excel.Worksheet) {\n    let profitLossTable = sheet.tables.add(\'A20:E20\', true);\n    profitLossTable.name = "ProfitLossTable";\n    profitLossTable.getHeaderRowRange().values = [["Company", "2013", "2014", "2015", "2016"]];\n    profitLossTable.rows.add(null, [\n        ["Contoso", 256.00, -55.31, 68.90, -82.13],\n        ["Fabrikam", 454.00, 75.29, -88.88, 781.87],\n        ["Northwind", -858.21, 35.33, 49.01, 112.68]\n    ]);\n    profitLossTable.getDataBodyRange().numberFormat = [["$#,##0.00"]];\n}\n\n/** Default helper for invoking an action and handling errors. */\nasync function tryCatch(callback) {\n    try {\n        await callback();\n    }\n    catch (error) {\n        OfficeHelpers.UI.notify(error);\n        OfficeHelpers.Utilities.log(error);\n    }\n}',
        language: 'typescript',
        dateCreated: 1535595731846,
        dateLastModified: 1535595731846,
      },
      {
        id: '968b7ef1-2ce4-4689-b992-b1a0fdc1f653',
        name: 'index.html',
        content:
          '<!-- Fabric Message Banner template -->\n<!-- https://dev.office.com/fabric-js/Components/MessageBanner/MessageBanner.html -->\n<div class="ms-MessageBanner">\n    <div class="ms-MessageBanner-content">\n        <div class="ms-MessageBanner-text">\n            <div class="ms-MessageBanner-clipper"></div>\n        </div>\n    </div>\n    <button class="ms-MessageBanner-close">\n    <i class="ms-Icon ms-Icon--Clear"></i>\n  </button>\n</div>\n\n<section id="main" class="ms-font-m">\n    <p>This sample shows how to apply conditional formatting to ranges.</p>\n</section>\n\n<section id="main" class="setup ms-font-m">\n    <h3>Set up</h3>\n    <button id="setup" class="ms-Button">\n        <span class="ms-Button-label">Add sample data</span>\n    </button>\n</section>\n\n<section id="main" class="samples ms-font-m">\n    <h3>Try it out</h3>\n    <label class="ms-font-s">Add color scale to temperature table.</label>\n    <button id="apply-color-scale-format" class="ms-Button">\n        <span class="ms-Button-label">Apply color scale format</span>\n    </button>\n    <label class="ms-font-s">Use white font for high temperatures.</label>\n    <button id="apply-preset-format" class="ms-Button">\n        <span class="ms-Button-label">Apply preset format</span>\n    </button>\n    <label class="ms-font-s">Apply data bar to sales table.</label>\n    <button id="apply-databar-format" class="ms-Button">\n        <span class="ms-Button-label">Apply data bar format</span>\n    </button>\n    <label class="ms-font-s">Apply icons to sales table.</label>\n    <button id="apply-icon-set-format" class="ms-Button">\n        <span class="ms-Button-label">Apply icon set format</span>\n    </button>\n    <label class="ms-font-s">Use red font for delayed projects.</label>\n    <button id="apply-text-format" class="ms-Button">\n        <span class="ms-Button-label">Apply text format</span>\n    </button>\n    <label class="ms-font-s">Use red font for losses in profit/loss table.</label>\n    <button id="apply-cell-value-format" class="ms-Button">\n        <span class="ms-Button-label">Apply cell value format</span>\n    </button>\n    <label class="ms-font-s">Use green font for cell values higher than the previous quarter value in sales table.</label>\n    <button id="apply-custom-format" class="ms-Button">\n        <span class="ms-Button-label">Apply custom format</span>\n    </button>\n    <label class="ms-font-s">Helper functions</label>\n    <button id="list-conditional-formats" class="ms-Button">\n        <span class="ms-Button-label">List conditional formats</span>\n    </button>\n    <button id="clear-all-conditional-formats" class="ms-Button">\n        <span class="ms-Button-label">Clear all conditional formats</span>\n    </button>\n    \n</section>\n\n<section id="main" class="conditional-formats ms-font-m" hidden=true>\n    <h3>Conditional Formats</h3>\n    <ul id="conditional-formats" class="ms-font-m">\n    </ul>\n</section>\n',
        language: 'html',
        dateCreated: 1535595731846,
        dateLastModified: 1535595731846,
      },
      {
        id: '84c1f068-a79e-4ddc-b1b8-34ae4b3ab46d',
        name: 'index.css',
        content:
          'section.samples {\n    margin-top: 20px;\n}\n\nsection.samples .ms-Button, section.setup .ms-Button {\n    display: block;\n    margin-bottom: 5px;\n    margin-left: 20px;\n    min-width: 80px;\n}\n\nbody {\n    margin: 0;\n    padding: 0;\n}\n\n#main {\n    margin: 10px;\n}\n\n.ms-MessageBanner {\n    display: none;\n}',
        language: 'css',
        dateCreated: 1535595731846,
        dateLastModified: 1535595731846,
      },
      {
        id: '7a79d960-b1d8-47a1-9c8b-f0452ed76fe7',
        name: 'libraries.txt',
        content:
          'https://appsforoffice.microsoft.com/lib/1/hosted/office.js\n@types/office-js\n\noffice-ui-fabric-js@1.4.0/dist/css/fabric.min.css\noffice-ui-fabric-js@1.4.0/dist/css/fabric.components.min.css\n\ncore-js@2.4.1/client/core.min.js\n@types/core-js\n\n@microsoft/office-js-helpers@0.7.4/dist/office.helpers.min.js\n@microsoft/office-js-helpers@0.7.4/dist/office.helpers.d.ts\n\njquery@3.1.1\n@types/jquery\n',
        language: 'libraries',
        dateCreated: 1535595731846,
        dateLastModified: 1535595731846,
      },
    ],
    dateCreated: 1535595731846,
    dateLastModified: 1535595731846,
  },
  {
    id: '36a405aa-ccfa-4bf6-bcb3-d7eb1834ecf0',
    name: 'Basic API call (Office 2013)',
    host: 'EXCEL',
    description:
      'Executes a basic Excel API call using the "common API" syntax (compatible with Office 2013).',
    files: [
      {
        id: 'bc60d5c6-cefd-4ce0-9578-e1509b672beb',
        name: 'index.ts',
        content:
          '$("#run").click(run);\n\nfunction run() {\n    Office.context.document.getSelectedDataAsync(Office.CoercionType.Text, (asyncResult) => {\n        if (asyncResult.status === Office.AsyncResultStatus.Failed) {\n            console.log(asyncResult.error.message);\n        } else {\n            console.log(`The selected data is "${asyncResult.value}".`);\n        }\n    });\n}\n',
        language: 'typescript',
        dateCreated: 1535595994636,
        dateLastModified: 1535595994636,
      },
      {
        id: '75b9efec-e36e-4faa-afbd-15167f61cbdf',
        name: 'index.html',
        content:
          '<button id="run" class="ms-Button">\n    <span class="ms-Button-label">Run</span>\n</button>\n',
        language: 'html',
        dateCreated: 1535595994636,
        dateLastModified: 1535595994636,
      },
      {
        id: 'e7ff29d6-a1a2-4111-9f47-719620f48003',
        name: 'index.css',
        content: '/* Your style goes here */\n',
        language: 'css',
        dateCreated: 1535595994636,
        dateLastModified: 1535595994636,
      },
      {
        id: 'b3bc3b36-a595-446b-b205-d284d9e84120',
        name: 'libraries.txt',
        content:
          'https://appsforoffice.microsoft.com/lib/1/hosted/office.js\n@types/office-js\n\noffice-ui-fabric-js@1.4.0/dist/css/fabric.min.css\noffice-ui-fabric-js@1.4.0/dist/css/fabric.components.min.css\n\ncore-js@2.4.1/client/core.min.js\n@types/core-js\n\n@microsoft/office-js-helpers@0.7.4/dist/office.helpers.min.js\n@microsoft/office-js-helpers@0.7.4/dist/office.helpers.d.ts\n\njquery@3.1.1\n@types/jquery\n',
        language: 'libraries',
        dateCreated: 1535595994636,
        dateLastModified: 1535595994636,
      },
    ],
    dateCreated: 1535595994636,
    dateLastModified: 1535595994636,
  },
  {
    id: '2c32044d-c6eb-4a3f-8906-b33ddc5eb927',
    name: 'Basic API call',
    host: 'EXCEL',
    description: 'Executes a basic Excel API call',
    files: [
      {
        id: '0adf0bae-11a3-445e-b5fd-91861121a8ae',
        name: 'index.ts',
        content:
          '$("#run").click(() => tryCatch(run));\n\nasync function run() {\n    await Excel.run(async (context) => {\n        const range = context.workbook.getSelectedRange();\n        range.format.fill.color = "yellow";\n        range.load("address");\n\n        await context.sync()\n\n        console.log(`The range address was "${range.address}".`);\n    });\n}\n\n/** Default helper for invoking an action and handling errors. */\nasync function tryCatch(callback) {\n    try {\n        await callback();\n    }\n    catch (error) {\n        OfficeHelpers.UI.notify(error);\n        OfficeHelpers.Utilities.log(error);\n    }\n}\n',
        language: 'typescript',
        dateCreated: 1535596188347,
        dateLastModified: 1535596188347,
      },
      {
        id: '31415a00-65a1-4af1-9a9c-070c94ca40d8',
        name: 'index.html',
        content:
          '<p class="ms-font-m">Executes a simple code snippet.</p>\n<button id="run" class="ms-Button">\n    <span class="ms-Button-label">Run code</span>\n</button>\n',
        language: 'html',
        dateCreated: 1535596188347,
        dateLastModified: 1535596188347,
      },
      {
        id: '6a7461e6-7152-4845-bb52-2baedc512b43',
        name: 'index.css',
        content: '',
        language: 'css',
        dateCreated: 1535596188347,
        dateLastModified: 1535596188347,
      },
      {
        id: '7a82360b-d889-442a-9e4e-0ed5d4fcd582',
        name: 'libraries.txt',
        content:
          'https://appsforoffice.microsoft.com/lib/1/hosted/office.js\n@types/office-js\n\noffice-ui-fabric-js@1.4.0/dist/css/fabric.min.css\noffice-ui-fabric-js@1.4.0/dist/css/fabric.components.min.css\n\ncore-js@2.4.1/client/core.min.js\n@types/core-js\n\n@microsoft/office-js-helpers@0.7.4/dist/office.helpers.min.js\n@microsoft/office-js-helpers@0.7.4/dist/office.helpers.d.ts\n\njquery@3.1.1\n@types/jquery\n',
        language: 'libraries',
        dateCreated: 1535596188347,
        dateLastModified: 1535596188347,
      },
    ],
    dateCreated: 1535596188347,
    dateLastModified: 1535596188347,
  },
  {
    id: '36624f5e-3388-48a5-bb4f-c22dc60530e3',
    name: 'Report generation',
    host: 'EXCEL',
    description:
      'Writes data to the workbook, reads and applies basic formatting, and adds a chart bound to that data.',
    files: [
      {
        id: 'a935f3d4-de8c-4c32-ac3c-fb923f527bd9',
        name: 'index.ts',
        content:
          '$("#create-report").click(() => tryCatch(createReport));\n\n/** Load sample data into a new worksheet and create a chart */\nasync function createReport() {\n    await Excel.run(async (context) => {\n        const sheet = context.workbook.worksheets.add();\n\n        try {\n            await writeSheetData(sheet);\n            sheet.activate();\n            await context.sync();\n        }\n        catch (error) {\n                // Try to activate the new sheet regardless, to show\n                // how far the processing got before failing\n            sheet.activate();\n            await context.sync();\n\n            // Then re-throw the original error, for appropriate error-handling\n            // (in this snippet, simply showing a notification)\n            throw error;\n        }\n    });\n\n    OfficeHelpers.UI.notify("Sucess!",\n        "Report generation completed.");\n}\n\nasync function writeSheetData(sheet: Excel.Worksheet) {\n    // Set the report title in the worksheet\n    const titleCell = sheet.getCell(0, 0);\n    titleCell.values = [["Quarterly Sales Report"]];\n    titleCell.format.font.name = "Century";\n    titleCell.format.font.size = 26;\n\n    // Create an array containing sample data\n    const headerNames = ["Product", "Qtr1", "Qtr2", "Qtr3", "Qtr4"];\n    const data = [\n        ["Frames", 5000, 7000, 6544, 4377],\n        ["Saddles", 400, 323, 276, 651],\n        ["Brake levers", 12000, 8766, 8456, 9812],\n        ["Chains", 1550, 1088, 692, 853],\n        ["Mirrors", 225, 600, 923, 544],\n        ["Spokes", 6005, 7634, 4589, 8765]\n    ];\n\n    // Write the sample data to the specified range in the worksheet \n    // and bold the header row\n    const headerRow = titleCell.getOffsetRange(1, 0)\n        .getResizedRange(0, headerNames.length - 1);\n    headerRow.values = [headerNames];\n    headerRow.getRow(0).format.font.bold = true;\n\n    const dataRange = headerRow.getOffsetRange(1, 0)\n        .getResizedRange(data.length - 1, 0);\n    dataRange.values = data;\n\n\n    titleCell.getResizedRange(0, headerNames.length - 1).merge();\n    dataRange.format.autofitColumns();\n\n    const columnRanges = headerNames.map((header, index) => dataRange.getColumn(index).load("format/columnWidth"));\n    await sheet.context.sync();\n\n    // For the header (product name) column, make it a minimum of 100px;\n    const firstColumn = columnRanges.shift();\n    if (firstColumn.format.columnWidth < 100) {\n        console.log("Expanding the first column to 100px");\n        firstColumn.format.columnWidth = 100;\n    }\n\n    // For the remainder, make them identical or a minimum of 60px\n    let minColumnWidth = 60;\n    columnRanges.forEach((column, index) => {\n        console.log(`Column #${index + 1}: auto-fitted width = ${column.format.columnWidth}`);\n        minColumnWidth = Math.max(minColumnWidth, column.format.columnWidth);\n    });\n    console.log(`Setting data columns to a width of ${minColumnWidth} pixels`);\n    dataRange.getOffsetRange(0, 1).getResizedRange(0, -1)\n        .format.columnWidth = minColumnWidth;\n\n    // Add a new chart\n    const chart = sheet.charts.add(\n        Excel.ChartType.columnClustered,\n        dataRange, Excel.ChartSeriesBy.columns);\n\n    // Set the properties and format the chart\n    const chartTopRow = dataRange.getLastRow().getOffsetRange(2, 0);\n    chart.setPosition(chartTopRow, chartTopRow.getOffsetRange(14, 0));\n    chart.title.text = "Quarterly sales chart";\n    chart.legend.position = "Right"\n    chart.legend.format.fill.setSolidColor("white");\n    chart.dataLabels.format.font.size = 15;\n    chart.dataLabels.format.font.color = "black";\n\n    const points = chart.series.getItemAt(0).points;\n    points.getItemAt(0).format.fill.setSolidColor("pink");\n    points.getItemAt(1).format.fill.setSolidColor("indigo");\n}\n\n/** Default helper for invoking an action and handling errors. */\nasync function tryCatch(callback) {\n    try {\n        await callback();\n    }\n    catch (error) {\n        OfficeHelpers.UI.notify(error);\n        OfficeHelpers.Utilities.log(error);\n    }\n}\n',
        language: 'typescript',
        dateCreated: 1535606895638,
        dateLastModified: 1535606895638,
      },
      {
        id: '27c879c4-1ded-4758-91bf-f24359f3b139',
        name: 'index.html',
        content:
          '<section class="ms-font-m">\n    <p>This sample shows how to load sample data into the worksheet, and then create a chart using the Excel API.</p>\n</section>\n\n<section class="samples ms-font-m">\n    <h3>Try it out</h3>\n    <button id="create-report" class="ms-Button">\n        <span class="ms-Button-label">Create report</span>\n    </button>\n</section>',
        language: 'html',
        dateCreated: 1535606895638,
        dateLastModified: 1535606895638,
      },
      {
        id: 'dc84dc72-2319-4dee-99e8-7355860f2d59',
        name: 'index.css',
        content:
          '.ms-MessageBanner {\n    display: none;\n}\n\nsection.samples {\n    margin-top: 20px;\n}\n\nsection.samples .ms-Button, section.setup .ms-Button {\n    display: block;\n    margin-bottom: 5px;\n    margin-left: 20px;\n    min-width: 80px;\n}\n',
        language: 'css',
        dateCreated: 1535606895638,
        dateLastModified: 1535606895638,
      },
      {
        id: '23fc2725-a83c-4395-ab4a-5d1e26185e57',
        name: 'libraries.txt',
        content:
          'https://appsforoffice.microsoft.com/lib/1/hosted/office.js\n@types/office-js\n\noffice-ui-fabric-js@1.4.0/dist/css/fabric.min.css\noffice-ui-fabric-js@1.4.0/dist/css/fabric.components.min.css\n\ncore-js@2.4.1/client/core.min.js\n@types/core-js\n\n@microsoft/office-js-helpers@0.7.4/dist/office.helpers.min.js\n@microsoft/office-js-helpers@0.7.4/dist/office.helpers.d.ts\n\njquery@3.1.1\n@types/jquery\n',
        language: 'libraries',
        dateCreated: 1535606895638,
        dateLastModified: 1535606895638,
      },
    ],
    dateCreated: 1535606895638,
    dateLastModified: 1535606895638,
  },
  {
    id: '3a7628b2-b111-4417-a667-e0a1c8efc786',
    name: 'Basic API call',
    host: 'EXCEL',
    description: 'Executes a basic Excel API call',
    files: [
      {
        id: 'd5c33d7e-2840-465b-b7f3-a6bdb63250b5',
        name: 'index.ts',
        content:
          '$("#run").click(() => tryCatch(run));\n\nasync function run() {\n    await Excel.run(async (context) => {\n        const range = context.workbook.getSelectedRange();\n        range.format.fill.color = "yellow";\n        range.load("address");\n\n        await context.sync()\n\n        console.log(`The range address was "${range.address}".`);\n    });\n}\n\n/** Default helper for invoking an action and handling errors. */\nasync function tryCatch(callback) {\n    try {\n        await callback();\n    }\n    catch (error) {\n        OfficeHelpers.UI.notify(error);\n        OfficeHelpers.Utilities.log(error);\n    }\n}\n',
        language: 'typescript',
        dateCreated: 1535607528757,
        dateLastModified: 1535607528757,
      },
      {
        id: 'b833da79-8868-420b-a8cd-fcf205bae339',
        name: 'index.html',
        content:
          '<p class="ms-font-m">Executes a simple code snippet.</p>\n<button id="run" class="ms-Button">\n    <span class="ms-Button-label">Run code</span>\n</button>\n',
        language: 'html',
        dateCreated: 1535607528757,
        dateLastModified: 1535607528757,
      },
      {
        id: 'a3891961-e31b-48ba-87a0-2cb030db1add',
        name: 'index.css',
        content: '',
        language: 'css',
        dateCreated: 1535607528757,
        dateLastModified: 1535607528757,
      },
      {
        id: '99e5cd4d-43b3-4c63-b48a-8177039ed128',
        name: 'libraries.txt',
        content:
          'https://appsforoffice.microsoft.com/lib/1/hosted/office.js\n@types/office-js\n\noffice-ui-fabric-js@1.4.0/dist/css/fabric.min.css\noffice-ui-fabric-js@1.4.0/dist/css/fabric.components.min.css\n\ncore-js@2.4.1/client/core.min.js\n@types/core-js\n\n@microsoft/office-js-helpers@0.7.4/dist/office.helpers.min.js\n@microsoft/office-js-helpers@0.7.4/dist/office.helpers.d.ts\n\njquery@3.1.1\n@types/jquery\n',
        language: 'libraries',
        dateCreated: 1535607528758,
        dateLastModified: 1535607528758,
      },
    ],
    dateCreated: 1535607528758,
    dateLastModified: 1535607528758,
  },
  {
    id: 'a520a09d-5b5e-4126-8772-1c7c7488b42c',
    name: 'Conditional Formatting for Ranges - Basic',
    host: 'EXCEL',
    description: 'Apply common types of conditional formatting to ranges.',
    files: [
      {
        id: '92c86673-8fb5-46fb-b8ae-cdac62940636',
        name: 'index.ts',
        content:
          '$("#setup").click(() => tryCatch(setup));\n$("#apply-color-scale-format").click(() => tryCatch(applyColorScaleFormat));\n$("#apply-preset-format").click(() => tryCatch(applyPresetFormat));\n$("#apply-databar-format").click(() => tryCatch(applyDataBarFormat));\n$("#apply-icon-set-format").click(() => tryCatch(applyIconSetFormat));\n$("#apply-text-format").click(() => tryCatch(applyTextFormat));\n$("#apply-cell-value-format").click(() => tryCatch(applyCellValueFormat));\n$("#apply-custom-format").click(() => tryCatch(applyCustomFormat));\n$("#list-conditional-formats").click(() => tryCatch(listConditionalFormats));\n$("#clear-all-conditional-formats").click(() => tryCatch(clearAllConditionalFormats));\n\nasync function applyColorScaleFormat() {\n    await Excel.run(async (context) => {\n        const sheet = context.workbook.worksheets.getItem("Sample");\n        const range = sheet.getRange("B2:M5");\n        const conditionalFormat = range.conditionalFormats\n            .add(Excel.ConditionalFormatType.colorScale);\n        const criteria = {\n            minimum: { formula: null, type: Excel.ConditionalFormatColorCriterionType.lowestValue, color: "blue" },\n            midpoint: { formula: "50", type: Excel.ConditionalFormatColorCriterionType.percent, color: "yellow" },\n            maximum: { formula: null, type: Excel.ConditionalFormatColorCriterionType.highestValue, color: "red" }\n        };\n        conditionalFormat.colorScale.criteria = criteria;\n\n        await context.sync();\n    });\n}\n\nasync function applyPresetFormat() {\n    await Excel.run(async (context) => {\n        const sheet = context.workbook.worksheets.getItem("Sample");\n        const range = sheet.getRange("B2:M5");\n        const conditionalFormat = range.conditionalFormats\n            .add(Excel.ConditionalFormatType.presetCriteria);\n        conditionalFormat.preset.format.font.color = "white";\n        conditionalFormat.preset.rule = { criterion: Excel.ConditionalFormatPresetCriterion.oneStdDevAboveAverage };\n\n        await context.sync();\n    });\n}\n\nasync function applyDataBarFormat() {\n    await Excel.run(async (context) => {\n        const sheet = context.workbook.worksheets.getItem("Sample");\n        const range = sheet.getRange("B8:E13");\n        const conditionalFormat = range.conditionalFormats\n            .add(Excel.ConditionalFormatType.dataBar);\n        conditionalFormat.dataBar.barDirection = Excel.ConditionalDataBarDirection.leftToRight;\n\n        await context.sync();\n    });\n}\n\nasync function applyIconSetFormat() {\n    await Excel.run(async (context) => {\n        const sheet = context.workbook.worksheets.getItem("Sample");\n        const range = sheet.getRange("B8:E13");\n        const conditionalFormat = range.conditionalFormats\n            .add(Excel.ConditionalFormatType.iconSet);\n        const iconSetCF = conditionalFormat.iconSet;\n        iconSetCF.style = Excel.IconSet.threeTriangles;\n\n        /*\n            The iconSetCF.criteria array is automatically prepopulated with\n            criterion elements whose properties have been given default settings.\n            You can\'t write to each property of a criterion directly. Instead,\n            replace the whole criteria object.\n\n            With a "three*" icon set style, such as "threeTriangles", the third\n            element in the criteria array (criteria[2]) defines the "top" icon;\n            e.g., a green triangle. The second (criteria[1]) defines the "middle"\n            icon, The first (criteria[0]) defines the "low" icon, but it\n            can often be left empty as this method does below, because every\n            cell that does not match the other two criteria always gets the low\n            icon.            \n        */\n        iconSetCF.criteria = [\n            {} as any,\n            {\n                type: Excel.ConditionalFormatIconRuleType.number,\n                operator: Excel.ConditionalIconCriterionOperator.greaterThanOrEqual,\n                formula: "=700"\n            },\n            {\n                type: Excel.ConditionalFormatIconRuleType.number,\n                operator: Excel.ConditionalIconCriterionOperator.greaterThanOrEqual,\n                formula: "=1000",\n            }\n        ];\n\n        await context.sync();\n    });\n}\n\nasync function applyTextFormat() {\n    await Excel.run(async (context) => {\n        const sheet = context.workbook.worksheets.getItem("Sample");\n        const range = sheet.getRange("B16:D18");\n        const conditionalFormat = range.conditionalFormats\n            .add(Excel.ConditionalFormatType.containsText);\n        conditionalFormat.textComparison.format.font.color = "red";\n        conditionalFormat.textComparison.rule = { operator: Excel.ConditionalTextOperator.contains, text: "Delayed" };\n\n        await context.sync();\n    });\n}\n\nasync function applyCellValueFormat() {\n    await Excel.run(async (context) => {\n        const sheet = context.workbook.worksheets.getItem("Sample");\n        const range = sheet.getRange("B21:E23");\n        const conditionalFormat = range.conditionalFormats\n            .add(Excel.ConditionalFormatType.cellValue);\n        conditionalFormat.cellValue.format.font.color = "red";\n        conditionalFormat.cellValue.rule = { formula1: "=0", operator: "LessThan" };\n\n        await context.sync();\n    });\n}\n\nasync function applyCustomFormat() {\n    await Excel.run(async (context) => {\n        const sheet = context.workbook.worksheets.getItem("Sample");\n        const range = sheet.getRange("B8:E13");\n        const conditionalFormat = range.conditionalFormats.add(Excel.ConditionalFormatType.custom);\n        conditionalFormat.custom.rule.formula = \'=IF(B8>INDIRECT("RC[-1]",0),TRUE)\';\n        conditionalFormat.custom.format.font.color = "green";\n\n        await context.sync();\n    });\n}\n\nasync function listConditionalFormats() {\n    await Excel.run(async (context) => {\n        const sheet = context.workbook.worksheets.getItem("Sample");\n        const worksheetRange = sheet.getRange();\n        worksheetRange.conditionalFormats.load("type");\n\n        await context.sync();\n\n        let cfRangePairs: { cf: Excel.ConditionalFormat, range: Excel.Range }[] = [];\n        worksheetRange.conditionalFormats.items.forEach(item => {\n            cfRangePairs.push({\n                cf: item,\n                range: item.getRange().load("address")\n            });\n        });\n\n        await context.sync();\n\n        $("#conditional-formats li").remove();\n        if (cfRangePairs.length > 0) {\n            cfRangePairs.forEach(item => {\n                let $p = $("<p></p>").text(\n                    `${item.cf.type}`)\n                let $li = $(`<li></li>`);\n                $li.append($p);\n                $("#conditional-formats").append($li);\n                $(".conditional-formats").show()[0].scrollIntoView();\n            })\n        }\n        else {\n            OfficeHelpers.UI.notify("None to display", "No conditional formats in workbook", "warning");\n        }\n    });\n}\n\nasync function clearAllConditionalFormats() {\n    await Excel.run(async (context) => {\n        const sheet = context.workbook.worksheets.getItem("Sample");\n        const range = sheet.getRange();\n        range.conditionalFormats.clearAll();\n\n        await context.sync();\n\n        $(".conditional-formats").hide();\n    });\n}\n\nasync function setup() {\n    await Excel.run(async (context) => {\n        const sheet = await OfficeHelpers.ExcelUtilities\n            .forceCreateSheet(context.workbook, "Sample");\n        queueCommandsToCreateTemperatureTable(sheet);\n        queueCommandsToCreateSalesTable(sheet);\n        queueCommandsToCreateProjectTable(sheet);\n        queueCommandsToCreateProfitLossTable(sheet);\n\n        let format = sheet.getRange().format;\n        format.autofitColumns();\n        format.autofitRows();\n\n        sheet.activate();\n        await context.sync();\n    });\n}\n\nfunction queueCommandsToCreateTemperatureTable(sheet: Excel.Worksheet) {\n    let temperatureTable = sheet.tables.add(\'A1:M1\', true);\n    temperatureTable.name = "TemperatureTable";\n    temperatureTable.getHeaderRowRange().values = [["Category", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]];\n    temperatureTable.rows.add(null, [\n        ["Avg High", 40, 38, 44, 45, 51, 56, 67, 72, 79, 59, 45, 41],\n        ["Avg Low", 34, 33, 38, 41, 45, 48, 51, 55, 54, 45, 41, 38],\n        ["Record High", 61, 69, 79, 83, 95, 97, 100, 101, 94, 87, 72, 66],\n        ["Record Low", 0, 2, 9, 24, 28, 32, 36, 39, 35, 21, 12, 4]\n    ]);\n}\n\nfunction queueCommandsToCreateSalesTable(sheet: Excel.Worksheet) {\n    let salesTable = sheet.tables.add(\'A7:E7\', true);\n    salesTable.name = "SalesTable";\n    salesTable.getHeaderRowRange().values = [["Sales Team", "Qtr1", "Qtr2", "Qtr3", "Qtr4"]];\n    salesTable.rows.add(null, [\n        ["Asian Team 1", 500, 700, 654, 234],\n        ["Asian Team 2", 400, 323, 276, 345],\n        ["Asian Team 3", 1200, 876, 845, 456],\n        ["Euro Team 1", 600, 500, 854, 567],\n        ["Euro Team 2", 5001, 2232, 4763, 678],\n        ["Euro Team 3", 130, 776, 104, 789]\n    ]);\n}\n\nfunction queueCommandsToCreateProjectTable(sheet: Excel.Worksheet) {\n    let projectTable = sheet.tables.add(\'A15:D15\', true);\n    projectTable.name = "ProjectTable";\n    projectTable.getHeaderRowRange().values = [["Project", "Alpha", "Beta", "Ship"]];\n    projectTable.rows.add(null, [\n        ["Project 1", "Complete", "Ongoing", "On Schedule"],\n        ["Project 2", "Complete", "Complete", "On Schedule"],\n        ["Project 3", "Ongoing", "Not Started", "Delayed"]\n    ]);\n}\n\nfunction queueCommandsToCreateProfitLossTable(sheet: Excel.Worksheet) {\n    let profitLossTable = sheet.tables.add(\'A20:E20\', true);\n    profitLossTable.name = "ProfitLossTable";\n    profitLossTable.getHeaderRowRange().values = [["Company", "2013", "2014", "2015", "2016"]];\n    profitLossTable.rows.add(null, [\n        ["Contoso", 256.00, -55.31, 68.90, -82.13],\n        ["Fabrikam", 454.00, 75.29, -88.88, 781.87],\n        ["Northwind", -858.21, 35.33, 49.01, 112.68]\n    ]);\n    profitLossTable.getDataBodyRange().numberFormat = [["$#,##0.00"]];\n}\n\n/** Default helper for invoking an action and handling errors. */\nasync function tryCatch(callback) {\n    try {\n        await callback();\n    }\n    catch (error) {\n        OfficeHelpers.UI.notify(error);\n        OfficeHelpers.Utilities.log(error);\n    }\n}',
        language: 'typescript',
        dateCreated: 1535694542561,
        dateLastModified: 1535694542561,
      },
      {
        id: '6d283bc3-ba8a-4848-85f4-347127c898ff',
        name: 'index.html',
        content:
          '<!-- Fabric Message Banner template -->\n<!-- https://dev.office.com/fabric-js/Components/MessageBanner/MessageBanner.html -->\n<div class="ms-MessageBanner">\n    <div class="ms-MessageBanner-content">\n        <div class="ms-MessageBanner-text">\n            <div class="ms-MessageBanner-clipper"></div>\n        </div>\n    </div>\n    <button class="ms-MessageBanner-close">\n    <i class="ms-Icon ms-Icon--Clear"></i>\n  </button>\n</div>\n\n<section id="main" class="ms-font-m">\n    <p>This sample shows how to apply conditional formatting to ranges.</p>\n</section>\n\n<section id="main" class="setup ms-font-m">\n    <h3>Set up</h3>\n    <button id="setup" class="ms-Button">\n        <span class="ms-Button-label">Add sample data</span>\n    </button>\n</section>\n\n<section id="main" class="samples ms-font-m">\n    <h3>Try it out</h3>\n    <label class="ms-font-s">Add color scale to temperature table.</label>\n    <button id="apply-color-scale-format" class="ms-Button">\n        <span class="ms-Button-label">Apply color scale format</span>\n    </button>\n    <label class="ms-font-s">Use white font for high temperatures.</label>\n    <button id="apply-preset-format" class="ms-Button">\n        <span class="ms-Button-label">Apply preset format</span>\n    </button>\n    <label class="ms-font-s">Apply data bar to sales table.</label>\n    <button id="apply-databar-format" class="ms-Button">\n        <span class="ms-Button-label">Apply data bar format</span>\n    </button>\n    <label class="ms-font-s">Apply icons to sales table.</label>\n    <button id="apply-icon-set-format" class="ms-Button">\n        <span class="ms-Button-label">Apply icon set format</span>\n    </button>\n    <label class="ms-font-s">Use red font for delayed projects.</label>\n    <button id="apply-text-format" class="ms-Button">\n        <span class="ms-Button-label">Apply text format</span>\n    </button>\n    <label class="ms-font-s">Use red font for losses in profit/loss table.</label>\n    <button id="apply-cell-value-format" class="ms-Button">\n        <span class="ms-Button-label">Apply cell value format</span>\n    </button>\n    <label class="ms-font-s">Use green font for cell values higher than the previous quarter value in sales table.</label>\n    <button id="apply-custom-format" class="ms-Button">\n        <span class="ms-Button-label">Apply custom format</span>\n    </button>\n    <label class="ms-font-s">Helper functions</label>\n    <button id="list-conditional-formats" class="ms-Button">\n        <span class="ms-Button-label">List conditional formats</span>\n    </button>\n    <button id="clear-all-conditional-formats" class="ms-Button">\n        <span class="ms-Button-label">Clear all conditional formats</span>\n    </button>\n    \n</section>\n\n<section id="main" class="conditional-formats ms-font-m" hidden=true>\n    <h3>Conditional Formats</h3>\n    <ul id="conditional-formats" class="ms-font-m">\n    </ul>\n</section>\n',
        language: 'html',
        dateCreated: 1535694542561,
        dateLastModified: 1535694542561,
      },
      {
        id: 'b5153cd4-f881-452b-aedb-8ff3f75acd2e',
        name: 'index.css',
        content:
          'section.samples {\n    margin-top: 20px;\n}\n\nsection.samples .ms-Button, section.setup .ms-Button {\n    display: block;\n    margin-bottom: 5px;\n    margin-left: 20px;\n    min-width: 80px;\n}\n\nbody {\n    margin: 0;\n    padding: 0;\n}\n\n#main {\n    margin: 10px;\n}\n\n.ms-MessageBanner {\n    display: none;\n}',
        language: 'css',
        dateCreated: 1535694542561,
        dateLastModified: 1535694542561,
      },
      {
        id: '0a67977c-0d38-4ab6-9f47-bab95eef413d',
        name: 'libraries.txt',
        content:
          'https://appsforoffice.microsoft.com/lib/1/hosted/office.js\n@types/office-js\n\noffice-ui-fabric-js@1.4.0/dist/css/fabric.min.css\noffice-ui-fabric-js@1.4.0/dist/css/fabric.components.min.css\n\ncore-js@2.4.1/client/core.min.js\n@types/core-js\n\n@microsoft/office-js-helpers@0.7.4/dist/office.helpers.min.js\n@microsoft/office-js-helpers@0.7.4/dist/office.helpers.d.ts\n\njquery@3.1.1\n@types/jquery\n',
        language: 'libraries',
        dateCreated: 1535694542561,
        dateLastModified: 1535694542561,
      },
    ],
    dateCreated: 1535694542561,
    dateLastModified: 1535694542561,
  },
  {
    id: '9ab2c0c0-26e7-4362-a8d1-5978230e9b9e',
    name: 'Basic API call (1)',
    host: 'EXCEL',
    description: 'Executes a basic Excel API call',
    files: [
      {
        id: '54902f87-0f27-4019-9d22-5e49e27b8c12',
        name: 'index.ts',
        content:
          '$("#run").click(() => tryCatch(run));\n\nasync function run() {\n    await Excel.run(async (context) => {\n        const range = context.workbook.getSelectedRange();\n        range.format.fill.color = "yellow";\n        range.load("address");\n\n        await context.sync()\n\n        console.log(`The range address was "${range.address}".`);\n    });\n}\n\n/** Default helper for invoking an action and handling errors. */\nasync function tryCatch(callback) {\n    try {\n        await callback();\n    }\n    catch (error) {\n        OfficeHelpers.UI.notify(error);\n        OfficeHelpers.Utilities.log(error);\n    }\n}\n',
        language: 'typescript',
        dateCreated: 1536391158476,
        dateLastModified: 1536391158476,
      },
      {
        id: '4744e510-a4a4-4dbc-8a60-e59b4279f674',
        name: 'index.html',
        content:
          '<p class="ms-font-m">Executes a simple code snippet.</p>\n<button id="run" class="ms-Button">\n    <span class="ms-Button-label">Run code</span>\n</button>\n',
        language: 'html',
        dateCreated: 1536391158476,
        dateLastModified: 1536391158476,
      },
      {
        id: 'f7c61675-409f-4b93-a69e-40034a7b7b67',
        name: 'index.css',
        content: '',
        language: 'css',
        dateCreated: 1536391158476,
        dateLastModified: 1536391158476,
      },
      {
        id: '6e54b874-67d4-47e7-8827-2cfccc3a2c29',
        name: 'libraries.txt',
        content:
          'https://appsforoffice.microsoft.com/lib/1/hosted/office.js\n@types/office-js\n\noffice-ui-fabric-js@1.4.0/dist/css/fabric.min.css\noffice-ui-fabric-js@1.4.0/dist/css/fabric.components.min.css\n\ncore-js@2.4.1/client/core.min.js\n@types/core-js\n\n@microsoft/office-js-helpers@0.7.4/dist/office.helpers.min.js\n@microsoft/office-js-helpers@0.7.4/dist/office.helpers.d.ts\n\njquery@3.1.1\n@types/jquery\n',
        language: 'libraries',
        dateCreated: 1536391158476,
        dateLastModified: 1536391158476,
      },
    ],
    dateCreated: 1536391158476,
    dateLastModified: 1536391158476,
  },
  {
    id: '7e0f1bd6-f942-4cde-9066-c80f58828aab',
    name: 'Report generation (1)',
    host: 'EXCEL',
    description:
      'Writes data to the workbook, reads and applies basic formatting, and adds a chart bound to that data.',
    files: [
      {
        id: '4f630c74-a5be-4553-a1b9-ba7445b5a29a',
        name: 'index.ts',
        content:
          '$("#create-report").click(() => tryCatch(createReport));\n\n/** Load sample data into a new worksheet and create a chart */\nasync function createReport() {\n    await Excel.run(async (context) => {\n        const sheet = context.workbook.worksheets.add();\n\n        try {\n            await writeSheetData(sheet);\n            sheet.activate();\n            await context.sync();\n        }\n        catch (error) {\n                // Try to activate the new sheet regardless, to show\n                // how far the processing got before failing\n            sheet.activate();\n            await context.sync();\n\n            // Then re-throw the original error, for appropriate error-handling\n            // (in this snippet, simply showing a notification)\n            throw error;\n        }\n    });\n\n    OfficeHelpers.UI.notify("Sucess!",\n        "Report generation completed.");\n}\n\nasync function writeSheetData(sheet: Excel.Worksheet) {\n    // Set the report title in the worksheet\n    const titleCell = sheet.getCell(0, 0);\n    titleCell.values = [["Quarterly Sales Report"]];\n    titleCell.format.font.name = "Century";\n    titleCell.format.font.size = 26;\n\n    // Create an array containing sample data\n    const headerNames = ["Product", "Qtr1", "Qtr2", "Qtr3", "Qtr4"];\n    const data = [\n        ["Frames", 5000, 7000, 6544, 4377],\n        ["Saddles", 400, 323, 276, 651],\n        ["Brake levers", 12000, 8766, 8456, 9812],\n        ["Chains", 1550, 1088, 692, 853],\n        ["Mirrors", 225, 600, 923, 544],\n        ["Spokes", 6005, 7634, 4589, 8765]\n    ];\n\n    // Write the sample data to the specified range in the worksheet \n    // and bold the header row\n    const headerRow = titleCell.getOffsetRange(1, 0)\n        .getResizedRange(0, headerNames.length - 1);\n    headerRow.values = [headerNames];\n    headerRow.getRow(0).format.font.bold = true;\n\n    const dataRange = headerRow.getOffsetRange(1, 0)\n        .getResizedRange(data.length - 1, 0);\n    dataRange.values = data;\n\n\n    titleCell.getResizedRange(0, headerNames.length - 1).merge();\n    dataRange.format.autofitColumns();\n\n    const columnRanges = headerNames.map((header, index) => dataRange.getColumn(index).load("format/columnWidth"));\n    await sheet.context.sync();\n\n    // For the header (product name) column, make it a minimum of 100px;\n    const firstColumn = columnRanges.shift();\n    if (firstColumn.format.columnWidth < 100) {\n        console.log("Expanding the first column to 100px");\n        firstColumn.format.columnWidth = 100;\n    }\n\n    // For the remainder, make them identical or a minimum of 60px\n    let minColumnWidth = 60;\n    columnRanges.forEach((column, index) => {\n        console.log(`Column #${index + 1}: auto-fitted width = ${column.format.columnWidth}`);\n        minColumnWidth = Math.max(minColumnWidth, column.format.columnWidth);\n    });\n    console.log(`Setting data columns to a width of ${minColumnWidth} pixels`);\n    dataRange.getOffsetRange(0, 1).getResizedRange(0, -1)\n        .format.columnWidth = minColumnWidth;\n\n    // Add a new chart\n    const chart = sheet.charts.add(\n        Excel.ChartType.columnClustered,\n        dataRange, Excel.ChartSeriesBy.columns);\n\n    // Set the properties and format the chart\n    const chartTopRow = dataRange.getLastRow().getOffsetRange(2, 0);\n    chart.setPosition(chartTopRow, chartTopRow.getOffsetRange(14, 0));\n    chart.title.text = "Quarterly sales chart";\n    chart.legend.position = "Right"\n    chart.legend.format.fill.setSolidColor("white");\n    chart.dataLabels.format.font.size = 15;\n    chart.dataLabels.format.font.color = "black";\n\n    const points = chart.series.getItemAt(0).points;\n    points.getItemAt(0).format.fill.setSolidColor("pink");\n    points.getItemAt(1).format.fill.setSolidColor("indigo");\n}\n\n/** Default helper for invoking an action and handling errors. */\nasync function tryCatch(callback) {\n    try {\n        await callback();\n    }\n    catch (error) {\n        OfficeHelpers.UI.notify(error);\n        OfficeHelpers.Utilities.log(error);\n    }\n}\n',
        language: 'typescript',
        dateCreated: 1536391163666,
        dateLastModified: 1536391163666,
      },
      {
        id: 'c177119e-f4b9-4e10-9d0e-457d154ba4ab',
        name: 'index.html',
        content:
          '<section class="ms-font-m">\n    <p>This sample shows how to load sample data into the worksheet, and then create a chart using the Excel API.</p>\n</section>\n\n<section class="samples ms-font-m">\n    <h3>Try it out</h3>\n    <button id="create-report" class="ms-Button">\n        <span class="ms-Button-label">Create report</span>\n    </button>\n</section>',
        language: 'html',
        dateCreated: 1536391163666,
        dateLastModified: 1536391163666,
      },
      {
        id: '7a6cc04a-1001-4193-8f78-75edfeff3a76',
        name: 'index.css',
        content:
          '.ms-MessageBanner {\n    display: none;\n}\n\nsection.samples {\n    margin-top: 20px;\n}\n\nsection.samples .ms-Button, section.setup .ms-Button {\n    display: block;\n    margin-bottom: 5px;\n    margin-left: 20px;\n    min-width: 80px;\n}\n',
        language: 'css',
        dateCreated: 1536391163666,
        dateLastModified: 1536391163666,
      },
      {
        id: 'c5979ee9-4f62-4960-8174-99bab39e8b80',
        name: 'libraries.txt',
        content:
          'https://appsforoffice.microsoft.com/lib/1/hosted/office.js\n@types/office-js\n\noffice-ui-fabric-js@1.4.0/dist/css/fabric.min.css\noffice-ui-fabric-js@1.4.0/dist/css/fabric.components.min.css\n\ncore-js@2.4.1/client/core.min.js\n@types/core-js\n\n@microsoft/office-js-helpers@0.7.4/dist/office.helpers.min.js\n@microsoft/office-js-helpers@0.7.4/dist/office.helpers.d.ts\n\njquery@3.1.1\n@types/jquery\n',
        language: 'libraries',
        dateCreated: 1536391163666,
        dateLastModified: 1536391163666,
      },
    ],
    dateCreated: 1536391163666,
    dateLastModified: 1536391163666,
  },
  {
    id: '0f4a84c4-d0e1-491b-af8f-22e3fc96ea4b',
    name: 'Reference worksheets by relative position',
    host: 'EXCEL',
    description:
      'Shows how to use the worksheet shortcut methods, such as getFirst, getLast, getPrevious, and getNext.',
    files: [
      {
        id: '454a1e74-ee84-467a-beb1-0915eff91023',
        name: 'index.ts',
        content:
          '$("#setup").click(() => tryCatch(setup));\n$("#compare-current-and-previous-year").click(() => tryCatch(compareCurrentWithPreviousTax));\n$("#compare-first-and-last-year").click(()  => tryCatch(compareFirstWithMostRecentTaxRate));\n\nasync function setup() {\n    await Excel.run(async (context) => {\n        const sheets = context.workbook.worksheets;\n        sheets.load("NoPropertiesNeeded");\n\n        await context.sync();\n\n        // Make setup repeatable by deleting all worksheets,\n        // except the default. Note: DEcrement on each loop.\n        for (let i = sheets.items.length; i > 0; i--) {\n            if (sheets.items[i]) {\n                sheets.items[i].delete();\n            }            \n        }\n\n        let currentYearSheet: Excel.Worksheet;\n        let revenue = 10000;\n        let taxRate = .213;\n\n        for (let year = 2014; year < 2018; year++) {\n            let sheet = sheets.add();\n            sheet.name = `Taxes${year}`;\n            let taxDataTable = sheet.tables.add(\'A1:C1\', true);\n\n            // Table names must be unique within the whole workbook.        \n            taxDataTable.name = `TaxesCalculation${year}`;\n            taxDataTable.getHeaderRowRange().values = [["Revenue", "Tax Rate", "Tax Due"]];\n            taxDataTable.rows.add(null, [\n                [revenue, taxRate, "=A2 * B2"],\n            ]);  \n            sheet.getRange("A2").numberFormat = [["$#,##0.00"]];\n            sheet.getRange("B2").numberFormat = [["0.00%"]];\n            sheet.getRange("C2").numberFormat = [["$#,##0.00"]];\n            taxDataTable.getRange().format.autofitColumns();\n            taxDataTable.getRange().format.autofitRows();\n            currentYearSheet = sheet;\n            revenue += 150;\n            taxRate += .0025;\n        }\n        currentYearSheet.activate();\n        \n        await context.sync();\n    });\n}\n\nasync function compareCurrentWithPreviousTax() {\n    await Excel.run(async (context) => {\n        const sheets = context.workbook.worksheets;\n        const currentSheet = sheets.getActiveWorksheet();\n        const previousYearSheet = currentSheet.getPrevious();\n        const currentTaxDueRange = currentSheet.getRange("C2");\n        const previousTaxDueRange = previousYearSheet.getRange("C2");\n\n        currentSheet.load("name");\n        previousYearSheet.load("name");\n        currentTaxDueRange.load("text");\n        previousTaxDueRange.load("text");\n\n        await context.sync();\n\n        let currentYear = currentSheet.name.substr(5, 4);\n        let previousYear = previousYearSheet.name.substr(5, 4);\n        OfficeHelpers.UI.notify("Two Year Tax Due Comparison", `Tax due for ${currentYear} was ${currentTaxDueRange.text[0][0]}\\nTax due for ${previousYear} was ${previousTaxDueRange.text[0][0]}`)\n\n        await context.sync();\n    });\n}\n\nasync function compareFirstWithMostRecentTaxRate() {\n    await Excel.run(async (context) => {\n        const sheets = context.workbook.worksheets;\n\n        // We don\'t want to include the default worksheet that was created\n        // when the workbook was created, so our "firstSheet" will be the one\n        // after the literal first. Note chaining of navigation methods.\n        const firstSheet = sheets.getFirst().getNext();\n        const lastSheet = sheets.getLast();\n        const firstTaxRateRange = firstSheet.getRange("B2");\n        const lastTaxRateRange = lastSheet.getRange("B2");\n\n        firstSheet.load("name");\n        lastSheet.load("name");\n        firstTaxRateRange.load("text");\n        lastTaxRateRange.load("text");\n\n        await context.sync();\n\n        let firstYear = firstSheet.name.substr(5, 4);\n        let lastYear = lastSheet.name.substr(5, 4);\n        OfficeHelpers.UI.notify(`Tax Rate change from ${firstYear} to ${lastYear}`, `Tax rate for ${firstYear}: ${firstTaxRateRange.text[0][0]}\\nTax rate for ${lastYear}: ${lastTaxRateRange.text[0][0]}`)\n\n        await context.sync();\n    });\n}\n\n/** Default helper for invoking an action and handling errors. */\nasync function tryCatch(callback) {\n    try {\n        await callback();\n    }\n    catch (error) {\n        OfficeHelpers.UI.notify(error);\n        OfficeHelpers.Utilities.log(error);\n    }\n}\n',
        language: 'typescript',
        dateCreated: 1536392599100,
        dateLastModified: 1536392599100,
      },
      {
        id: 'adbed3f2-ad2d-4bab-92e5-20ffcc13d33d',
        name: 'index.html',
        content:
          '<section class="ms-font-m">\n    <p>This sample shows how to get a reference to a sheet using its relative position with the sheet.getNext, sheet.getPrevious, sheetCollection.getFirst, and sheetCollection.getLast methods.</p>\n</section>\n\n<section class="setup ms-font-m">\n    <h3>Set up</h3>\n    <button id="setup" class="ms-Button">\n        <span class="ms-Button-label">Create sample worksheets</span>\n    </button>\n</section>\n\n<section class="samples ms-font-m">\n    <h3>Try it out</h3>\n    <p>Select any of the three worksheets for 2015, 1016, or 2017 and press the button to compare the <b>tax due</b> on the current sheet with the previous sheet.</p>\n    <button id="compare-current-and-previous-year" class="ms-Button">\n        <span class="ms-Button-label">Compare tax bills</span>\n    </button>\n    <p>Compare the tax <b>rate</b> on the last sheet with the first sheet.</p>\n    <button id="compare-first-and-last-year" class="ms-Button">\n        <span class="ms-Button-label">Compare tax rates</span>\n    </button>\n</section>\n',
        language: 'html',
        dateCreated: 1536392599100,
        dateLastModified: 1536392599100,
      },
      {
        id: 'fde008b5-f75b-4453-978c-0478a1c3817f',
        name: 'index.css',
        content:
          'section.samples {\n    margin-top: 20px;\n}\n\nsection.samples .ms-Button, section.setup .ms-Button {\n    display: block;\n    margin-bottom: 5px;\n    margin-left: 20px;\n    min-width: 80px;\n}\n',
        language: 'css',
        dateCreated: 1536392599100,
        dateLastModified: 1536392599100,
      },
      {
        id: '5cf583a6-7e25-484a-a6cd-9d50e99ee370',
        name: 'libraries.txt',
        content:
          'https://appsforoffice.microsoft.com/lib/1/hosted/office.js\n@types/office-js\n\noffice-ui-fabric-js@1.4.0/dist/css/fabric.min.css\noffice-ui-fabric-js@1.4.0/dist/css/fabric.components.min.css\n\ncore-js@2.4.1/client/core.min.js\n@types/core-js\n\n@microsoft/office-js-helpers@0.7.4/dist/office.helpers.min.js\n@microsoft/office-js-helpers@0.7.4/dist/office.helpers.d.ts\n\njquery@3.1.1\n@types/jquery\n',
        language: 'libraries',
        dateCreated: 1536392599100,
        dateLastModified: 1536392599100,
      },
    ],
    dateCreated: 1536392599100,
    dateLastModified: 1536392599100,
  },
]

const exampleGistMetadata = [
  {
    url:
      'https://gist.githubusercontent.com/nico-bellante/d3402717c21255f44385054831834d74/raw/cd6c2ff178e76e4aa3ff9e74dae1b88417d433c5/Insert,%20delete,%20clear%20range.EXCEL.yaml',
    host: 'EXCEL',
    id: 'd3402717c21255f44385054831834d74',
    description: 'Insert, delete and clear a range',
    title: 'Insert, delete, clear range',
    dateCreated: '2018-09-09T07:26:51Z',
    dateLastModified: '2018-09-09T07:26:51Z',
  },
  {
    url:
      'https://gist.githubusercontent.com/nico-bellante/4a0848eafc36741e575da27d4347c6d7/raw/36f9d2d5ffec166b719be5d9ccd4900268915ca4/Conditional%20Formatting%20for%20Ranges%20-%20Basic.EXCEL.yaml',
    host: 'EXCEL',
    id: '4a0848eafc36741e575da27d4347c6d7',
    description: 'Apply common types of conditional formatting to ranges.',
    title: 'Conditional Formatting for Ranges - Basic',
    dateCreated: '2018-09-09T07:24:56Z',
    dateLastModified: '2018-09-09T07:24:56Z',
  },
  {
    url:
      'https://gist.githubusercontent.com/nico-bellante/25c5273a105773bff6b5f0f0546a75bd/raw/25389876fa84b51b61323823c0156b9adb26e470/Report%20generation.EXCEL.yaml',
    host: 'EXCEL',
    id: '25c5273a105773bff6b5f0f0546a75bd',
    description:
      'Writes data to the workbook, reads and applies basic formatting, and adds a chart bound to that data.',
    title: 'Report generation',
    dateCreated: '2018-09-09T07:24:44Z',
    dateLastModified: '2018-09-09T07:24:45Z',
  },
  {
    url:
      'https://gist.githubusercontent.com/nico-bellante/68361634babc28f2f9edce8e533a177a/raw/a61e55fa5ec37aa3b853f054434bca45b7136db2/Blank%20snippet%20(1).EXCEL.yaml',
    host: 'EXCEL',
    id: '68361634babc28f2f9edce8e533a177a',
    description: 'Create a new snippet from a blank template.',
    title: 'Blank snippet (1)',
    dateCreated: '2018-09-09T07:22:17Z',
    dateLastModified: '2018-09-09T07:22:18Z',
  },
]

const voidFunc = () => {}
export const BasicMySolutions = () => (
  <MySolutions
    solutions={exampleSolutions}
    gistMetadata={exampleGistMetadata}
    openSolution={voidFunc}
    openGist={voidFunc}
  />
)

storiesOf('Backstage/Samples', module).add('basic', () => <BasicMySolutions />)
