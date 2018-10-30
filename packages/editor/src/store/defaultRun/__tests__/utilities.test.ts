import { findAllNoUIFunctions } from '../utilities'

describe('findAllNoUIFunctions tests', () => {
  it('should be able to parse out all functions', () => {
    const content = `/** @NoUI */
    function foo() {
      return 42
    }

    /** @NoUI */
    function bar() {
      return 'foo'
    }`

    expect(findAllNoUIFunctions(content)).toEqual(['foo', 'bar'])
  })

  it("shouldn't parse the innner function", () => {
    const content = `/** @NoUI */
    function foo() {
      return 42
    }

    /** @NoUI */
    function bar() {
      function dontParseMePlease() {

      }
      return 'foo'
    }`

    expect(findAllNoUIFunctions(content)).toEqual(['foo', 'bar'])
  })
  it("shouldn't parse non-tagged functions", () => {
    const content = `
    function foo() {
      return 42
    }


    function bar() {
      function dontParseMePlease() {

      }
      return 'foo'
    }`

    expect(findAllNoUIFunctions(content)).toEqual([])
  })
})
