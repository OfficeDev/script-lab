/* cspell:disable */

import { getFakeString, getFakeStringLong } from './strings';

describe('localization fake strings', () => {
  it('basic string', () => expect(getFakeString('Hello World')).toEqual('Olleh Dlrow'));
  it('all lowercase', () => expect(getFakeString('hello world')).toEqual('olleh dlrow'));
  it('all uppercase', () => expect(getFakeString('HELLO WORLD')).toEqual('OLLEH DLROW'));
  it('mixed', () => expect(getFakeString('Hi there world')).toEqual('Ih ereht dlrow'));
  it('with symbols', () =>
    expect(getFakeString('... Hello World!')).toEqual('... Olleh Dlrow!'));
  it('really mixed', () =>
    expect(getFakeString('hi thERe wORLd')).toEqual('ih erEHt dLROw'));
});

describe('localization fake strings long', () => {
  it('basic string', () =>
    expect(getFakeStringLong('Hello World')).toEqual('Ooolleeeh Dlrooow'));
  it('all lowercase', () =>
    expect(getFakeStringLong('hello world')).toEqual('ooolleeeh dlrooow'));
  it('all uppercase', () =>
    expect(getFakeStringLong('HELLO WORLD')).toEqual('OOOLLEEEH DLROOOW'));
  it('mixed', () =>
    expect(getFakeStringLong('Hi there world')).toEqual('Ih eeereeeht dlrooow'));
  it('with symbols', () =>
    expect(getFakeStringLong('... Hello World!')).toEqual('... Ooolleeeh Dlrooow!'));
  it('really mixed', () =>
    expect(getFakeStringLong('hi thERe wORLd')).toEqual('ih eeerEEEHt dLROoow'));
});
