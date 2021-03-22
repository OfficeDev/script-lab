import YAML from 'js-yaml';

import generatePythonCFCode from './generatePythonCFCode';
import { stripSpaces } from 'common/lib/utilities/string';
import { convertSnippetToSolution } from '..';

const basicCF = convertSnippetToSolution(YAML.safeLoad(
  stripSpaces(`
  name: Test Snippet Name
  description: A basic Custom Function, written in Python
  host: EXCEL
  api_set: {}
  script:
    content: |
      import customfunctions as cf
      @cf.customfunction("ADD")
      def myadd(x, y):
        return x + y
    language: python
`),
) as ISnippet);

const moreComplicatedCF = convertSnippetToSolution(YAML.safeLoad(
  stripSpaces(`
  name: More Complicated
  description: A more complicated snippet
  host: EXCEL
  api_set: {}
  script:
    content: |
      import customfunctions as cf

      @cf.customfunction("ADD")
      def myadd(x, y):
        return x + y

      import statistics
      @cf.customfunction("PYSTDEV",
        parameters=[
          cf.ParameterInfo(dimensionality=cf.Dimensionality.matrix)])
      def pystdev(data):
          flatList = [item for sublist in data for item in sublist]
          return statistics.stdev(flatList)
    language: python
`),
) as ISnippet);

describe('primitives', () => {
  it('basic', () =>
    expect(generatePythonCFCode([basicCF], { clearOnRegister: true })).toEqual(
      stripSpaces(`
        import customfunctionmanager
        customfunctionmanager.clear()

        #######################################
        
        import customfunctions as cf
        @cf.customfunction("TestSnippetName.ADD")
        def myadd(x, y):
          return x + y

        #######################################
        
        customfunctionmanager.generateMetadata()
      `),
    ));

  it('simple and more complicated combined', () =>
    expect(
      generatePythonCFCode([basicCF, moreComplicatedCF], { clearOnRegister: true }),
    ).toEqual(
      stripSpaces(`
        import customfunctionmanager
        customfunctionmanager.clear()

        #######################################

        import customfunctions as cf
        @cf.customfunction(\"TestSnippetName.ADD\")
        def myadd(x, y):
          return x + y
        
        #######################################
        
        import customfunctions as cf
        
        @cf.customfunction(\"MoreComplicated.ADD\")
        def myadd(x, y):
          return x + y
        
        import statistics
        @cf.customfunction(\"MoreComplicated.PYSTDEV\",
          parameters=[
            cf.ParameterInfo(dimensionality=cf.Dimensionality.matrix)])
        def pystdev(data):
            flatList = [item for sublist in data for item in sublist]
            return statistics.stdev(flatList)
        
        #######################################
        
        customfunctionmanager.generateMetadata()
      `),
    ));
});

// cspell:ignore customfunctions myadd pystdev sublist stdev
