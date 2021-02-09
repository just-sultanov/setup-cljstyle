import {getVersion} from '../src/installer'

test('version should be correctly parsed', () => {
  expect(getVersion('0')).toEqual('0.0.0')
  expect(getVersion('0.0.0')).toEqual('0.0.0')
  expect(getVersion('0.14.0')).toEqual('0.14.0')
  expect(getVersion('1.23.456')).toEqual('1.23.456')
})
