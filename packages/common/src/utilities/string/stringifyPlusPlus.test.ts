import { stringifyPlusPlus, stripSpaces } from '.';
import { ScriptLabError } from '../error';

describe('primitives', () => {
  it('basic', () => expect(stringifyPlusPlus('Hello World')).toEqual('Hello World'));

  it('number', () => expect(stringifyPlusPlus(5.0)).toEqual('5'));

  it('boolean', () => expect(stringifyPlusPlus(!!5)).toEqual('true'));
});

describe('arrays', () => {
  it('1D array of primitives', () =>
    expect(stringifyPlusPlus(['Hi', 5])).toEqual(`["Hi", 5]`));
  it('Empty 1D array', () => expect(stringifyPlusPlus([])).toEqual(`[]`));
  it('1D array with nested array', () =>
    expect(stringifyPlusPlus(['Nested', [1, 2]])).toEqual(
      stripSpaces(`
        [
            "Nested",
            [1, 2]
        ]
      `),
    ));

  it('2D array', () =>
    expect(
      stringifyPlusPlus([
        ['Product', 'Price'],
        ['Hammer', 17.99],
        ['Saw', 234.1],
      ]),
    ).toEqual(
      stripSpaces(`
        [
            ["Product", "Price"],
            ["Hammer", 17.99],
            ["Saw", 234.1]
        ]
      `),
    ));
});

describe('objects', () => {
  it('empty object', () => expect(stringifyPlusPlus({})).toEqual(`{}`));

  it('simple', () =>
    expect(
      stringifyPlusPlus({ type: 'thing', value: 'great', num: 2, happy: true }),
    ).toEqual(
      stripSpaces(`
        {
            "type": "thing",
            "value": "great",
            "num": 2,
            "happy": true
        }
      `),
    ));

  it('nested', () =>
    expect(
      stringifyPlusPlus({
        a: 'hi',
        b: {
          c: 'interesting',
          d: 5,
          e: {},
        },
      }),
    ).toEqual(
      stripSpaces(`
        {
            "a": "hi",
            "b": {
                "c": "interesting",
                "d": 5,
                "e": {}
            }
        }
      `),
    ));
});

describe('errors', () => {
  it('simple', () =>
    expect(stringifyPlusPlus(new Error('Test error'), { skipErrorStack: true })).toEqual(
      stripSpaces(`
        Error:
        {
            "message": "Test error"
        }
      `),
    ));

  it('ScriptLabError with string', () =>
    expect(
      stringifyPlusPlus(new ScriptLabError('Test error', 'Something'), {
        skipErrorStack: true,
      }),
    ).toEqual(
      stripSpaces(`
        Test error:
        {
            "message": "Test error",
            "name": "Script Lab Error",
            "innerError": "Something"
        }
      `),
    ));

  it('ScriptLabError with inner error object', () =>
    expect(
      stringifyPlusPlus(new ScriptLabError('Test error', new Error('Inner')), {
        skipErrorStack: true,
      }),
    ).toEqual(
      stripSpaces(`
        Test error:
        {
            "message": "Test error",
            "name": "Script Lab Error",
            "innerError": {
                "message": "Inner"
            }
        }
      `),
    ));

  // Note: cannot test OfficeExtension.Error, since "OfficeExtension"
  //       is only loaded within an add-in (from the office.js script reference,
  //       not via any dependent package)
});
