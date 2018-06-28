import samplesReducer from '../samples'
import { samples as samplesActions } from '../../actions'

interface ISampleMetadata {
  id: string
  name: string
  fileName: string
  description: string
  rawUrl: string
  group: string
  api_set: any
}

const getSampleMetadata = (indicies: number[]): ISampleMetadata[] =>
  indicies.map(i => ({
    id: `${i}`,
    name: `sample ${i}`,
    fileName: `fileName ${i}`,
    description: `does ${i} stuff`,
    rawUrl: `www.${i}.com`,
    group: `group ${i}`,
    api_set: `${i}.${i}`,
  }))

describe('samples reducer', () => {
  test('accept the request success result', () => {
    expect(
      samplesReducer(
        [],
        samplesActions.fetchMetadata.success(getSampleMetadata([1, 3, 5])),
      ),
    ).toEqual(getSampleMetadata([1, 3, 5]))
  })
})
